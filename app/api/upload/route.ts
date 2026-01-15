import { NextRequest, NextResponse } from 'next/server';
import { writeFile, readdir, unlink } from 'fs/promises';
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

    const imgDir = join(process.cwd(), 'public', 'img');

    // 删除该 pageId 的所有旧图片（不管什么扩展名）
    try {
      const existingFiles = await readdir(imgDir);
      const oldFiles = existingFiles.filter(f => {
        // 匹配 pageId.* 格式的文件（例如 p4.jpg, p4.png）
        const regex = new RegExp(`^${pageId}\\.`);
        return regex.test(f);
      });

      // 删除所有旧文件
      for (const oldFile of oldFiles) {
        const oldFilePath = join(imgDir, oldFile);
        await unlink(oldFilePath);
        console.log(`Deleted old image: ${oldFile}`);
      }
    } catch (err) {
      console.warn('Failed to delete old images:', err);
      // 继续执行，不阻止上传
    }

    // 保存新图片到 public/img 文件夹
    const filePath = join(imgDir, fileName);
    await writeFile(filePath, buffer);

    // 返回新的图片URL（使用动态API路径）
    const imageUrl = `/api/images/${fileName}`;

    return NextResponse.json({ url: imageUrl, success: true });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}
