# 校园活动管理系统

一个基于 Vue 3 + Element Plus 的现代化校园活动管理平台，为学生和活动组织者提供便捷的活动发布、报名和管理功能。

## 🚀 功能特性

### 用户功能
- **用户注册/登录** - 支持学生账号注册和登录
- **活动浏览** - 查看所有可参与的活动列表
- **活动详情** - 查看活动详细信息，包括时间、地点、人数限制等
- **活动报名** - 一键报名参与感兴趣的活动
- **个人中心** - 管理个人信息和已报名的活动
- **我的活动** - 查看个人已报名的活动列表

### 管理员功能
- **活动管理** - 发布、编辑、删除活动
- **用户管理** - 管理用户账号和权限
- **报名管理** - 审核和管理活动报名情况
- **数据统计** - 查看活动参与度和用户活跃度

### 系统功能
- **响应式设计** - 支持桌面端和移动端访问
- **实时通知** - 活动状态变更实时提醒
- **搜索筛选** - 按类别、时间等条件筛选活动
- **二维码扫描** - 支持活动签到二维码扫描

## 🛠️ 技术栈

### 前端技术
- **Vue 3** - 渐进式 JavaScript 框架
- **Vue Router 4** - 官方路由管理器
- **Pinia** - Vue 状态管理库
- **Element Plus** - Vue 3 组件库
- **Axios** - HTTP 客户端
- **Day.js** - 轻量级日期处理库
- **HTML5-QRCode** - 二维码扫描库

### 开发工具
- **Vite** - 下一代前端构建工具
- **Vue DevTools** - Vue 开发调试工具

## 📦 项目结构

```
school_activity_web/
├── public/                 # 静态资源
├── src/
│   ├── assets/            # 资源文件
│   │   ├── images/        # 图片资源
│   │   └── main.css       # 全局样式
│   ├── components/        # 公共组件
│   │   └── icons/         # 图标组件
│   ├── router/            # 路由配置
│   │   └── index.js       # 路由定义
│   ├── stores/            # 状态管理
│   │   └── user.js        # 用户状态
│   ├── utils/             # 工具函数
│   │   └── request.js     # HTTP 请求封装
│   ├── views/             # 页面组件
│   │   ├── Home.vue       # 首页
│   │   ├── ActivityList.vue    # 活动列表
│   │   ├── ActivityDetail.vue  # 活动详情
│   │   ├── LoginPage.vue       # 登录页面
│   │   ├── Register.vue        # 注册页面
│   │   ├── UserProfile.vue     # 用户中心
│   │   ├── MyActivities.vue    # 我的活动
│   │   ├── AdminApplicationForm.vue # 管理员申请
│   │   ├── About.vue           # 关于页面
│   │   ├── Header.vue          # 头部组件
│   │   └── Footer.vue          # 底部组件
│   ├── App.vue            # 根组件
│   └── main.js            # 应用入口
├── index.html             # HTML 模板
├── package.json           # 项目配置
├── vite.config.js         # Vite 配置
└── README.md              # 项目说明
```

## 🚀 快速开始

### 环境要求
- Node.js >= 16.0.0
- npm >= 8.0.0

### 安装依赖
```bash
npm install
```

### 开发环境运行
```bash
npm run dev
```

访问 http://localhost:5173 查看应用

### 生产环境构建
```bash
npm run build
```

### 预览生产构建
```bash
npm run preview
```

## 📱 页面路由

| 路由 | 页面 | 描述 |
|------|------|------|
| `/` | 首页 | 展示热门活动和最新公告 |
| `/activities` | 活动列表 | 浏览所有可参与的活动 |
| `/activities/:id` | 活动详情 | 查看活动详细信息和报名 |
| `/login` | 登录页面 | 用户登录 |
| `/register` | 注册页面 | 新用户注册 |
| `/profile` | 个人中心 | 用户信息管理 |
| `/my-activities` | 我的活动 | 查看已报名的活动 |
| `/admin-apply` | 管理员申请 | 申请成为管理员 |
| `/about` | 关于我们 | 项目介绍和联系方式 |

## 🔧 开发指南

### 添加新页面
1. 在 `src/views/` 目录下创建新的 Vue 组件
2. 在 `src/router/index.js` 中添加路由配置
3. 更新导航菜单（如需要）

### 状态管理
- 使用 Pinia 进行状态管理
- 用户信息存储在 `stores/user.js` 中
- 通过 `useUserStore()` 访问用户状态

### API 请求
- 使用 `src/utils/request.js` 封装的 axios 实例
- 支持请求拦截器和响应拦截器
- 自动处理认证 token

### 样式规范
- 使用 Element Plus 组件库
- 全局样式在 `src/assets/main.css` 中定义
- 组件样式使用 scoped 作用域

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 📞 联系方式

如有问题或建议，请通过以下方式联系：

- 项目 Issues: [GitHub Issues](https://github.com/your-username/school_activity_web/issues)
- 邮箱: your-email@example.com

## 🙏 致谢

感谢所有为这个项目做出贡献的开发者和用户！

---

**注意**: 这是一个前端项目，需要配合后端 API 服务使用。请确保后端服务正常运行并配置正确的 API 地址。
