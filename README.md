# 🎵 Music Player

一个基于 Vue 3 + Vite + APlayer 的现代音乐播放器，支持多歌单、歌词同步、主题切换、热聊区评论等功能。

---

## ✨ 功能特性

### 🎵 核心播放
| 功能 | 说明 |
|------|------|
| 音乐播放 | 基于 APlayer 引擎，支持网易云歌单 |
| 歌单切换 | 下拉菜单快速切换歌单，自动加载歌曲 |
| 歌词同步 | 滚动歌词显示，打字机动画效果 |
| 播放控制 | 播放/暂停、上一首/下一首、音量调节 |
| 循环模式 | 循环全部、单曲循环、顺序播放 |

### 🎨 界面交互
| 功能 | 说明 |
|------|------|
| 歌词窗口 | 可拖动、可缩放、可调节颜色和字号 |
| 音乐胶囊 | 点击展开/收起播放器，播放时旋转动画 |
| 主题切换 | 亮色/暗色模式，自动记忆偏好 |
| 右键菜单 | 完整的播放控制菜单 |
| 键盘快捷键 | 空格播放/暂停，←/→ 切歌 |

### 💬 社交功能
| 功能 | 说明 |
|------|------|
| 热聊区 | 基于 Twikoo 的评论系统 |
| 话题标签 | 点击自动填入预设话题，方便讨论 |

---

## 📁 项目结构

```
music-player/
├── index.html                 # 入口 HTML
├── package.json               # 项目依赖
├── vite.config.js             # Vite 配置
├── src/
│   ├── main.js                # 应用入口
│   ├── App.vue                # 根组件（含全局样式）
│   ├── config/
│   │   └── index.js           # 配置文件
│   ├── stores/
│   │   └── playerStore.js     # Pinia 状态管理
│   ├── components/
│   │   ├── Capsule.vue        # 音乐胶囊
│   │   ├── Player.vue         # 播放器
│   │   ├── Lyrics.vue         # 歌词窗口
│   │   ├── Playlist.vue       # 歌单切换
│   │   ├── ThemeToggle.vue    # 主题切换
│   │   ├── RightMenu.vue      # 右键菜单
│   │   └── Chat.vue           # 热聊区
│   └── styles/
│       └── base.css           # 基础样式
└── README.md
```

---

## 🔧 配置说明

### 1. 歌单配置

编辑 `src/config/index.js`：

```javascript
export const PLAYLISTS = [
    { id: '14148542684', name: '华语流行' },
    { id: '3779629', name: '粤语经典' },
    // 想加多少加多少
];
```

**获取歌单 ID：**
打开网易云音乐网页版，进入歌单页面，地址栏获取：

```
https://music.163.com/playlist?id=14148542684
                              ↑ 这就是 ID
```

### 2. API 配置

```javascript
export const API_CONFIG = {
    METING_API: 'https://api.injahow.cn/meting/',      // 歌单 API
    LRC_API: 'https://api.uomg.com/api/163/lyric',     // 歌词 API
    TWIKOO_ENV_ID: 'https://twikoo.hangdn.com',        // 评论系统环境 ID
    TWIKOO_REGION: 'ap-guangzhou'                      // 评论系统区域
};
```

### 3. 歌词配置

```javascript
export const LYRICS_CONFIG = {
    updateInterval: 200,      // 歌词轮询间隔 (ms)
    minWidth: 150,            // 窗口最小宽度
    minHeight: 70,            // 窗口最小高度
    defaultColor: '#ff4500',  // 默认文字颜色
    defaultFontSize: 30       // 默认字号
};
```

### 4. 封面图替换

替换 `src/assets/cover.jpg` 为你的默认封面图。

### 5. Twikoo 评论配置

在 `src/components/Chat.vue` 中修改 `envId`：

```javascript
twikooInstance = twikoo.init({
    el: containerRef.value,
    envId: 'https://你的-twikoo-地址.com',  // 改这里
    region: 'ap-guangzhou'
})
```

---

## 🚀 部署

### 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器 (http://localhost:3000)
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

### Cloudflare Pages 部署

1. 构建项目：`npm run build`
2. 在 Cloudflare Pages 中新建项目
3. 上传 `dist` 目录
4. 部署完成

---

## 🎮 使用指南

### 播放控制

| 操作 | 说明 |
|------|------|
| 点击音乐胶囊 | 展开/收起播放器 |
| 点击播放器控制按钮 | 播放/暂停/切歌 |
| 右键页面空白处 | 呼出控制菜单 |
| 空格键 | 播放/暂停 |
| ← 方向键 | 上一首 |
| → 方向键 | 下一首 |
| ESC 键 | 关闭热聊区弹窗 |

### 歌词窗口

| 操作 | 说明 |
|------|------|
| 拖拽窗口中间 | 移动位置 |
| 拖拽右下角手柄 | 缩放窗口大小 |
| 悬停右上角齿轮 | 点击调出设置面板 |
| 设置面板 | 调节文字颜色和字号 |
| 重置按钮 | 恢复默认位置和样式 |

### 歌单切换

| 操作 | 说明 |
|------|------|
| 点击右下角歌单按钮 | 展开歌单下拉列表 |
| 选择歌单 | 自动切换并加载 |
| 切换后自动展开播放器 | 方便立即播放 |

### 热聊区

| 操作 | 说明 |
|------|------|
| 点击底部「热聊区」按钮 | 打开评论弹窗 |
| 点击话题标签 | 自动填入预设话题 |
| 点击弹窗外部或 × | 关闭弹窗 |
| 按 ESC 键 | 关闭弹窗 |

---

## 🛠️ 技术栈

| 技术 | 用途 |
|------|------|
| Vue 3 | 前端框架 |
| Pinia | 状态管理 |
| Vite | 构建工具 |
| APlayer | 音乐播放引擎 |
| Twikoo | 评论系统 |

---

## 📝 更新日志

### v1.0.0 (2024-07)
- ✅ 基础播放功能
- ✅ 歌单切换
- ✅ 歌词同步显示
- ✅ 歌词窗口拖动/缩放
- ✅ 亮色/暗色主题
- ✅ 热聊区评论
- ✅ 移动端适配
- ✅ 键盘快捷键
- ✅ 右键菜单
- ✅ 循环模式切换
- ✅ 音量记忆
- ✅ 打字机歌词动画



## 📄 许可证

MIT License



# 项目结构

```
music-player-vue/
├── index.html
├── package.json
├── vite.config.js
├── src/
│   ├── main.js
│   ├── App.vue
│   ├── assets/
│   │   └── cover.jpg
│   ├── components/
│   │   ├── Player.vue          # 播放器核心
│   │   ├── Lyrics.vue          # 歌词窗口
│   │   ├── Capsule.vue         # 音乐胶囊
│   │   ├── Playlist.vue        # 歌单切换
│   │   ├── ThemeToggle.vue     # 主题切换
│   │   ├── RightMenu.vue       # 右键菜单
│   │   └── Chat.vue            # 热聊区
│   ├── composables/
│   │   ├── usePlayer.js        # 播放器逻辑
│   │   ├── useLyrics.js        # 歌词逻辑
│   │   ├── useTheme.js         # 主题逻辑
│   │   ├── usePlaylist.js      # 歌单逻辑
│   │   └── useChat.js          # 热聊区逻辑
│   ├── stores/
│   │   └── playerStore.js      # Pinia 状态管理
│   ├── config/
│   │   └── index.js            # 配置文件
│   └── styles/
│       ├── base.css
│       └── variables.css
```
