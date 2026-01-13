import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, saveDatabase } from '@/lib/db';

// GET - 获取所有页面数据
export async function GET() {
  try {
    const db = await getDatabase();
    const result = db.exec('SELECT id, data FROM pages');

    const data: Record<string, any> = {};
    if (result.length > 0) {
      const rows = result[0].values;
      for (const row of rows) {
        const id = row[0] as string;
        const jsonData = row[1] as string;
        data[id] = JSON.parse(jsonData);
      }
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}

// PUT - 更新所有页面数据
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    // 验证管理员密码
    const password = request.headers.get('x-admin-password');
    const adminPassword = process.env.ADMIN_PASSWORD || '2024';

    if (password !== adminPassword) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await getDatabase();

    // 更新所有数据
    for (const [id, value] of Object.entries(body)) {
      const jsonData = JSON.stringify(value);

      // 先尝试更新
      db.run(
        'INSERT OR REPLACE INTO pages (id, data, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)',
        [id, jsonData]
      );
    }

    // 保存到文件
    saveDatabase();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to update data' }, { status: 500 });
  }
}
