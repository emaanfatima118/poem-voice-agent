/**
 * Google Cloud Storage Helper
 * Handles file uploads to GCS and returns public URLs
 */

import { Storage } from '@google-cloud/storage';
import path from 'path';

// Initialize GCS client
let storage: Storage | null = null;

function getStorage(): Storage {
  if (!storage) {
    const projectId = process.env.GCS_PROJECT_ID;
    const clientEmail = process.env.GCS_CLIENT_EMAIL;
    const privateKey = process.env.GCS_PRIVATE_KEY;

    if (projectId && clientEmail && privateKey) {
      // Use credentials from environment variables
      storage = new Storage({
        projectId,
        credentials: {
          client_email: clientEmail,
          private_key: privateKey.replace(/\\n/g, '\n'), // Handle escaped newlines
        },
      });
    } else {
      // Fallback to default credentials (e.g., from GCE, Cloud Run, etc.)
      storage = new Storage({ projectId });
    }
  }
  return storage;
}

const BUCKET_NAME = process.env.GCS_BUCKET_NAME || 'stackwise-documents';

export interface UploadResult {
  url: string;
  bucket: string;
  path: string;
  size: number;
  mimeType: string;
}

/**
 * Upload a buffer to Google Cloud Storage
 * @param buffer - File content as Buffer
 * @param filename - Destination filename
 * @param mimeType - MIME type of the file
 * @param folder - Optional folder path in the bucket
 * @returns Upload result with signed URL
 */
export async function uploadToGCS(
  buffer: Buffer,
  filename: string,
  mimeType: string,
  folder: string = 'reports'
): Promise<UploadResult> {
  try {
    const storage = getStorage();
    const bucket = storage.bucket(BUCKET_NAME);
    
    // Create full path
    const gcsPath = folder ? `${folder}/${filename}` : filename;
    const file = bucket.file(gcsPath);

    console.log(`[GCS] Uploading to gs://${BUCKET_NAME}/${gcsPath}`);

    // Upload the buffer
    await file.save(buffer, {
      metadata: {
        contentType: mimeType,
        cacheControl: 'public, max-age=31536000', // Cache for 1 year
      },
      validation: false,
    });

    // Generate signed URL valid for 7 days
    const [signedUrl] = await file.getSignedUrl({
      version: 'v4',
      action: 'read',
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    console.log(`[GCS] Upload successful with signed URL`);

    return {
      url: signedUrl,
      bucket: BUCKET_NAME,
      path: gcsPath,
      size: buffer.length,
      mimeType,
    };
  } catch (error: any) {
    console.error('[GCS] Upload failed:', error);
    throw new Error(`Failed to upload to GCS: ${error.message}`);
  }
}

/**
 * Generate a signed URL for an existing file
 * @param gcsPath - Path to the file in the bucket
 * @param expiresInDays - Number of days until URL expires (default: 7)
 * @returns Signed URL for the file
 */
export async function getSignedUrl(gcsPath: string, expiresInDays: number = 7): Promise<string> {
  try {
    const storage = getStorage();
    const bucket = storage.bucket(BUCKET_NAME);
    const file = bucket.file(gcsPath);

    const [signedUrl] = await file.getSignedUrl({
      version: 'v4',
      action: 'read',
      expires: Date.now() + expiresInDays * 24 * 60 * 60 * 1000,
    });

    return signedUrl;
  } catch (error: any) {
    console.error('[GCS] Failed to generate signed URL:', error);
    throw new Error(`Failed to generate signed URL: ${error.message}`);
  }
}

/**
 * Delete a file from Google Cloud Storage
 * @param gcsPath - Path to the file in the bucket
 */
export async function deleteFromGCS(gcsPath: string): Promise<void> {
  try {
    const storage = getStorage();
    const bucket = storage.bucket(BUCKET_NAME);
    const file = bucket.file(gcsPath);

    await file.delete();
    console.log(`[GCS] Deleted: gs://${BUCKET_NAME}/${gcsPath}`);
  } catch (error: any) {
    console.error('[GCS] Delete failed:', error);
    throw new Error(`Failed to delete from GCS: ${error.message}`);
  }
}

/**
 * Check if a file exists in GCS
 * @param gcsPath - Path to the file in the bucket
 */
export async function fileExistsInGCS(gcsPath: string): Promise<boolean> {
  try {
    const storage = getStorage();
    const bucket = storage.bucket(BUCKET_NAME);
    const file = bucket.file(gcsPath);

    const [exists] = await file.exists();
    return exists;
  } catch (error: any) {
    console.error('[GCS] Existence check failed:', error);
    return false;
  }
}

/**
 * Get MIME type based on file extension
 */
export function getMimeType(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  const mimeTypes: Record<string, string> = {
    '.pdf': 'application/pdf',
    '.json': 'application/json',
    '.md': 'text/markdown',
    '.txt': 'text/plain',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
  };
  return mimeTypes[ext] || 'application/octet-stream';
}
