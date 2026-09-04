import { createClient } from '@libsql/client';
import path from 'path';

const dbPath = path.join(process.cwd(), 'database.sqlite');
const db = createClient({
  url: `file:${dbPath}`,
});

// Tablo oluştur
db.execute(`
  CREATE TABLE IF NOT EXISTS visitor_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ip_address TEXT,
    city TEXT,
    visit_time TEXT,
    user_agent TEXT
  )
`);

export async function logVisitor(ipAddress: string, city: string, userAgent: string) {
  const visitTime = new Date().toISOString();
  await db.execute({
    sql: 'INSERT INTO visitor_logs (ip_address, city, visit_time, user_agent) VALUES (?, ?, ?, ?)',
    args: [ipAddress, city, visitTime, userAgent],
  });
}

export async function getLogs() {
  const result = await db.execute('SELECT id, ip_address, city, visit_time, user_agent FROM visitor_logs ORDER BY id DESC');
  return result.rows;
}
