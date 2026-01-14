# Love Ledger - iOS风格叙事应用

这是一个基于Next.js的iOS风格叙事/回忆录应用，使用SQLite存储数据。

## 功能特点

- 📱 iOS 17风格的UI设计（Squircle卡片、灵动岛风格）
- 🎨 12种主题色彩系统
- 💾 SQLite本地数据库存储
- 🔐 管理员密码保护
- ✨ Framer Motion动画效果
- 📄 14页叙事内容支持

## 技术栈

- **框架**: Next.js 16 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS 4
- **动画**: Framer Motion
- **图标**: Lucide React
- **数据库**: SQLite (better-sqlite3)

## 安装依赖

```bash
pnpm install
```

## 环境配置

复制 `.env.example` 到 `.env.local` 并设置管理员密码：

```bash
cp .env.example .env.local
```

编辑 `.env.local`:

```env
ADMIN_PASSWORD=your_password_here
NEXT_PUBLIC_ADMIN_PASSWORD=your_password_here
```

## 运行项目

```bash
# 开发模式
pnpm dev

# 构建生产版本
pnpm build

# 启动生产服务器
pnpm start
```

应用将在 http://localhost:3338 运行。

## 项目结构

```
love-ledger/
├── app/
│   ├── api/
│   │   └── data/
│   │       └── route.ts          # 数据API路由
│   ├── components/
│   │   ├── NarrativeCard.tsx     # 叙事卡片组件
│   │   └── SquircleCard.tsx      # iOS风格卡片容器
│   ├── layout.tsx                # 根布局
│   └── page.tsx                  # 主页面
├── lib/
│   └── db.ts                     # SQLite数据库初始化
├── .env.local                    # 环境变量（不提交到git）
└── data.db                       # SQLite数据库文件（自动生成）
```

## 使用说明

### 查看叙事内容

直接访问首页即可查看叙事内容。使用以下方式翻页：
- 鼠标滚轮上下滚动
- 触摸屏上下滑动

### 编辑内容

1. 点击左上角的编辑按钮（需要悬停才能看到）
2. 输入管理员密码
3. 进入管理后台编辑内容
4. 点击"保存"按钮保存更改
5. 点击"预览"查看效果

### 数据结构

每一页的数据结构：

**文本页** (如 p1, p14):
```json
{
  "type": "text",
  "content": "2025\nOur Memories"
}
```

**图片页** (如 p2, p3):
```json
{
  "month": 4,
  "top": "微风练习曲",
  "img": "https://images.unsplash.com/photo-xxx",
  "bottom": "在草地上睡个午觉吧..."
}
```

## API端点

### GET /api/data
获取所有页面数据

### PUT /api/data
更新所有页面数据（需要管理员密码）

Headers:
```
x-admin-password: your_password
```

## 注意事项

- 数据库文件 `data.db` 会在首次运行时自动创建
- 默认包含4页示例数据 (p1, p2, p3, p14)
- 支持最多14页内容
- 图片使用外部URL链接

## 开发说明

本项目从单文件React应用转换而来，主要改动：
- 移除Firebase依赖，改用SQLite
- 拆分为Next.js项目结构
- 添加API路由处理数据
- 使用环境变量管理密码
