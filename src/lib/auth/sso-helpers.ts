/**
 * SSO Helper Functions
 * Handles OAuth flow and user creation/login
 */

import { db } from '@/lib/db';
import crypto from 'crypto';

export interface SSOUserProfile {
  provider: 'google' | 'microsoft' | 'apple';
  providerId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  avatarUrl?: string;
  emailVerified?: boolean;
}

/**
 * Find or create user from SSO profile
 */
export async function findOrCreateSSOUser(profile: SSOUserProfile) {
  try {
    // First, try to find user by provider ID
    const existingUserByProvider = await db.select(
      `SELECT u.*, ud.first_name, ud.last_name, ud.profile_picture_url
       FROM users u
       LEFT JOIN user_details ud ON u.userid = ud.userid
       WHERE u.auth_provider = $1 AND u.provider_user_id = $2`,
      [profile.provider, profile.providerId]
    );

    if (existingUserByProvider.length > 0) {
      const userId = existingUserByProvider[0].userid;
      
      // Update last login and email verified status
      await db.update(
        'UPDATE users SET last_login = CURRENT_TIMESTAMP, email_verified = $1 WHERE userid = $2',
        [profile.emailVerified || false, userId]
      );
      
      // Update profile picture if provided (truncate if too long for database)
      if (profile.avatarUrl) {
        const firstName = profile.firstName || profile.name?.split(' ')[0] || '';
        const lastName = profile.lastName || profile.name?.split(' ').slice(1).join(' ') || '';
        const lastSyncTime = new Date().toISOString();
        const avatarUrl = profile.avatarUrl.length > 500 ? profile.avatarUrl.substring(0, 500) : profile.avatarUrl;
        
        await db.update(
          `UPDATE user_details 
           SET profile_picture_url = $1,
               first_name = COALESCE(NULLIF(first_name, ''), $2),
               last_name = COALESCE(NULLIF(last_name, ''), $3),
               metadata = COALESCE(metadata, '{}'::jsonb) || jsonb_build_object('sso_avatar', true, 'last_sso_sync', $4::text)
           WHERE userid = $5`,
          [
            avatarUrl, 
            firstName,
            lastName,
            lastSyncTime,
            userId
          ]
        );
      }
      
      // Transform user object to include name field for session
      const user = existingUserByProvider[0];
      user.name = user.first_name && user.last_name 
        ? `${user.first_name} ${user.last_name}`.trim()
        : user.username || user.email.split('@')[0];
      user.photo = user.profile_picture_url;
      
      return user;
    }

    // Check if user exists with same email but different provider
    const existingUserByEmail = await db.select(
      'SELECT * FROM users WHERE email = $1',
      [profile.email]
    );

    if (existingUserByEmail.length > 0) {
      // Link SSO to existing account
      const user = existingUserByEmail[0];
      await db.update(
        `UPDATE users 
         SET auth_provider = $1, 
             provider_user_id = $2, 
             email_verified = $3,
             last_login = CURRENT_TIMESTAMP
         WHERE userid = $4`,
        [profile.provider, profile.providerId, profile.emailVerified, user.userid]
      );
      
      // Get user_details for name and photo
      const userDetails = await db.select(
        'SELECT first_name, last_name, profile_picture_url FROM user_details WHERE userid = $1',
        [user.userid]
      );
      
      // Update profile picture in user_details if avatar provided (truncate if too long)
      if (profile.avatarUrl) {
        const avatarUrl = profile.avatarUrl.length > 500 ? profile.avatarUrl.substring(0, 500) : profile.avatarUrl;
        await db.update(
          `UPDATE user_details 
           SET profile_picture_url = $1,
               metadata = COALESCE(metadata, '{}'::jsonb) || jsonb_build_object('sso_avatar', $2)
           WHERE userid = $3`,
          [avatarUrl, true, user.userid]
        );
      }
      
      // Transform user object to include name field for session
      if (userDetails.length > 0) {
        user.name = userDetails[0].first_name && userDetails[0].last_name
          ? `${userDetails[0].first_name} ${userDetails[0].last_name}`.trim()
          : user.username || user.email.split('@')[0];
        user.photo = profile.avatarUrl || userDetails[0].profile_picture_url;
      } else {
        user.name = user.username || user.email.split('@')[0];
        user.photo = profile.avatarUrl;
      }
      
      return user;
    }

    // Create new user
    const username = profile.email.split('@')[0] + '_' + crypto.randomBytes(4).toString('hex');
    
    const newUser = await db.insert(
      `INSERT INTO users (username, email, password, auth_provider, provider_user_id, email_verified, last_login)
       VALUES ($1, $2, NULL, $3, $4, $5, CURRENT_TIMESTAMP)
       RETURNING *`,
      [username, profile.email, profile.provider, profile.providerId, profile.emailVerified || false]
    );

    // Create user_details entry
    const firstName = profile.firstName || profile.name?.split(' ')[0] || '';
    const lastName = profile.lastName || profile.name?.split(' ').slice(1).join(' ') || '';

    // Truncate avatar URL if too long for database column
    const avatarUrl = profile.avatarUrl && profile.avatarUrl.length > 500 
      ? profile.avatarUrl.substring(0, 500) 
      : profile.avatarUrl;
    
    await db.insert(
      `INSERT INTO user_details (userid, first_name, last_name, profile_picture_url, metadata)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        newUser.userid,
        firstName,
        lastName,
        avatarUrl,
        JSON.stringify({
          sso_provider: profile.provider,
          sso_created_at: new Date().toISOString(),
        }),
      ]
    );

    // Transform user object to include name field for session
    newUser.name = firstName && lastName
      ? `${firstName} ${lastName}`.trim()
      : profile.name || username;
    newUser.photo = profile.avatarUrl;

    return newUser;
  } catch (error) {
    console.error('Error in findOrCreateSSOUser:', error);
    throw error;
  }
}

/**
 * Generate OAuth state parameter for CSRF protection
 */
export function generateState(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Verify OAuth state parameter
 */
export function verifyState(state: string, expectedState: string): boolean {
  return state === expectedState;
}

/**
 * Create JWT session token
 */
export function createSessionToken(user: any): string {
  const { createSession } = require('./session');
  
  return createSession({
    userId: user.userid,
    email: user.email,
    name: user.username || user.email.split('@')[0],
    photo: undefined,
    authProvider: user.auth_provider
  });
}
