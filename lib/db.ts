import initSqlJs, { Database } from 'sql.js';
import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data.db');

let SQL: any = null;
let db: Database | null = null;

// 默认数据
// p1: 开头文本页
// p2-p13: 1-12月图片页
// p14: 总结文本页
const defaultData = {
  p1: { type: 'text', content: '2025\nOur Memories' },
  p2: { top: '微风练习曲', img: 'https://images.unsplash.com/photo-1522748906645-95d8adfd52c7?w=1000', bottom: '在草地上睡个午觉吧。万物复苏的时候,我们也在一起。微风拂过发梢,那一刻的时间仿佛凝固了。' },
  p3: { top: '初夏的告白', img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1000', bottom: '冰汽水里的气泡。' },
  p14: { type: 'text', content: 'Loved Always\nBy You' },
};

// 初始化数据库
async function initDatabase(): Promise<Database> {
  if (db) return db;

  // 初始化 sql.js
  if (!SQL) {
    const buffer = fs.readFileSync(
      path.join(process.cwd(), 'node_modules/sql.js/dist/sql-wasm.wasm')
    );
    const wasmBinary = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
    SQL = await initSqlJs({ wasmBinary });
  }

  // 检查数据库文件是否存在
  if (fs.existsSync(dbPath)) {
    const buffer = fs.readFileSync(dbPath);
    db = new SQL.Database(buffer);
  } else {
    const newDb = new SQL.Database();
    db = newDb;

    // 创建表
    newDb.run(`
      CREATE TABLE IF NOT EXISTS pages (
        id TEXT PRIMARY KEY,
        data TEXT NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 插入默认数据
    const stmt = newDb.prepare('INSERT INTO pages (id, data) VALUES (?, ?)');
    for (const [key, value] of Object.entries(defaultData)) {
      stmt.run([key, JSON.stringify(value)]);
    }
    stmt.free();

    // 保存到文件
    saveDatabase();
  }

  return db!;
}

// 保存数据库到文件
function saveDatabase() {
  if (db) {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(dbPath, buffer);
  }
}

// 获取数据库实例
export async function getDatabase() {
  return await initDatabase();
}

// 导出保存函数
export { saveDatabase };
