import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
  try {
    // 验证管理员密码
    const password = request.headers.get('x-admin-password');
    const adminPassword = process.env.ADMIN_PASSWORD || '2025';

    if (password !== adminPassword) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const pageId = formData.get('pageId') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // 获取文件扩展名
    const fileExtension = file.name.split('.').pop();
    const fileName = `${pageId}.${fileExtension}`;

    // 读取文件内容
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 保存到 public/img 文件夹
    const filePath = join(process.cwd(), 'public', 'img', fileName);
    await writeFile(filePath, buffer);

    // 返回图片URL
    const imageUrl = `/img/${fileName}`;

    return NextResponse.json({ url: imageUrl, success: true });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}
