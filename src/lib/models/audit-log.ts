import { query } from './db';

export interface AuditLogModel {
  user_id: number;
  file?: string;
  name?: string;
  updated_at: Date;
}

export async function createAuditLog(userId: number, file?: string, name?: string): Promise<void> {
  const text = `
    INSERT INTO audit_log (user_id, file, name, updated_at)
    VALUES ($1, $2, $3, NOW())
    ON CONFLICT (user_id) 
    DO UPDATE SET file = $2, name = $3, updated_at = NOW()
  `;
  const params = [userId, file || null, name || null];
  await query(text, params);
}

export async function getAuditLogByUserId(userId: number): Promise<AuditLogModel | null> {
  const text = 'SELECT * FROM audit_log WHERE user_id = $1';
  const result = await query(text, [userId]);
  return result.rows[0] || null;
}

export async function updateAuditLog(userId: number, file?: string, name?: string): Promise<void> {
  const text = `
    UPDATE audit_log 
    SET file = $2, name = $3, updated_at = NOW()
    WHERE user_id = $1
  `;
  const params = [userId, file || null, name || null];
  await query(text, params);
}

export async function deleteAuditLog(userId: number): Promise<void> {
  const text = 'DELETE FROM audit_log WHERE user_id = $1';
  await query(text, [userId]);
}
