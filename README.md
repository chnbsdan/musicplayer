# 项目结构
在线网易歌单播放器，全屏歌词放大
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
