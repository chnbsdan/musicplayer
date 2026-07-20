<template>
  <div class="app" :class="{ light: store.isLight }">

    <!-- 左上角导航菜单 -->
    <NavMenu />
    
    <!-- 音乐胶囊 -->
    <Capsule ref="capsuleRef" />

    <!-- 右下角按钮组 -->
    <div class="right-buttons">
      <Playlist />
      <ThemeToggle />
    </div>

    <!-- 歌词窗口 -->
    <Lyrics ref="lyricsRef" />

    <!-- 播放器 -->
    <Player ref="playerRef" />

    <!-- 右键菜单 -->
    <RightMenu 
      @play-toggle="handlePlayToggle"
      @prev="handlePrev"
      @next="handleNext"
      @vol-up="handleVolUp"
      @vol-down="handleVolDown"
      @loop-toggle="handleLoopToggle"
      @lyrics-toggle="handleLyricsToggle"
      @support="handleSupport"
      @fullscreen="handleFullscreen"
      @close-player="handleClosePlayer"
    />

    <!-- GitHub 角标 -->
    <a href="https://github.com/chnbsdan/musicplayer" target="_blank" class="github-corner">
      <svg viewBox="0 0 16 16" fill="white">
        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
      </svg>
    </a>

    <!-- 页脚 -->
    <footer class="footer">
  <span>© 2024 Music Player · 由 <a href="https://github.com/chnbsdan/musicplayer" target="_blank" style="color:var(--text-primary);text-decoration:none;font-weight:600;border-bottom:1px solid var(--border-color);transition:all 0.3s;" onmouseover="this.style.color='#ff8c00';this.style.borderBottomColor='#ff8c00';" onmouseout="this.style.color='var(--text-primary)';this.style.borderBottomColor='var(--border-color)';">GitHub</a> 驱动</span>
  <button @click="openChat">💬 热聊区</button>
</footer>
    <!-- 热聊区弹窗 -->
    <Chat ref="chatRef" />
  </div>
</template>


<script setup>
import NavMenu from './components/NavMenu.vue'  
import { ref, onMounted, onUnmounted } from 'vue'
import { usePlayerStore } from './stores/playerStore'
import Capsule from './components/Capsule.vue'
import Player from './components/Player.vue'
import Lyrics from './components/Lyrics.vue'
import Playlist from './components/Playlist.vue'
import ThemeToggle from './components/ThemeToggle.vue'
import RightMenu from './components/RightMenu.vue'
import Chat from './components/Chat.vue'

const store = usePlayerStore()
const capsuleRef = ref(null)
const playerRef = ref(null)
const lyricsRef = ref(null)
const chatRef = ref(null)

const openChat = () => {
  if (chatRef.value) {
    chatRef.value.open()
  }
}

const handlePlayToggle = () => {
  playerRef.value?.toggle()
}

const handlePrev = () => {
  playerRef.value?.prev()
}

const handleNext = () => {
  playerRef.value?.next()
}

const handleVolUp = () => {
  const currentVol = store.volume
  store.setVolume(Math.min(currentVol + 0.1, 1))
}

const handleVolDown = () => {
  const currentVol = store.volume
  store.setVolume(Math.max(currentVol - 0.1, 0))
}

const handleLoopToggle = () => {
  const mode = store.toggleLoopMode()
  if (playerRef.value?.aplayer) {
    playerRef.value.aplayer.options.loop = mode
  }
}

const handleLyricsToggle = () => {
  lyricsRef.value?.toggleVisibility()
}

const handleSupport = () => {
  window.open('https://aoso.hangdn.com', '_blank')
}

const handleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(() => {})
  } else {
    document.exitFullscreen().catch(() => {})
  }
}

const handleClosePlayer = () => {
  playerRef.value?.pause()
  if (playerRef.value?.close) {
    playerRef.value.close()
  }
  if (capsuleRef.value?.show) {
    capsuleRef.value.show()
  }
}

const onCapsuleToggle = () => {
  if (playerRef.value?.isOpen) {
    playerRef.value.close?.()
    capsuleRef.value?.show?.()
  } else {
    capsuleRef.value?.hide?.()
    playerRef.value?.open?.()
    playerRef.value?.init?.()
  }
}

const onPlaylistSwitch = (e) => {
  const id = e.detail?.id
  if (id) {
    playerRef.value?.open?.()
    playerRef.value?.loadPlaylist?.(id)
  }
}

onMounted(() => {
  store.loadTheme()
  window.addEventListener('capsule-toggle', onCapsuleToggle)
  window.addEventListener('playlist-switch', onPlaylistSwitch)
})

onUnmounted(() => {
  window.removeEventListener('capsule-toggle', onCapsuleToggle)
  window.removeEventListener('playlist-switch', onPlaylistSwitch)
})
</script>

<style>
/* ===== 全局基础样式 ===== */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
}

body {
  background: var(--bg-primary);
  font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif;
  transition: background var(--transition);
  color: var(--text-primary);
  overflow-x: hidden;
  -webkit-tap-highlight-color: transparent;
}

::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 4px;
}
.app.light ::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.15);
}

/* ===== CSS 变量 ===== */
:root {
  --bg-primary: #0f0f1a;
  --bg-secondary: rgba(15, 15, 35, 0.75);
  --bg-card: rgba(255, 255, 255, 0.06);
  --border-color: rgba(255, 255, 255, 0.08);
  --text-primary: #fff;
  --text-secondary: rgba(255, 255, 255, 0.7);
  --text-muted: rgba(255, 255, 255, 0.35);
  --shadow: 0 8px 40px rgba(0, 0, 0, 0.5);
  --lyrics-bg: rgba(15, 15, 35, 0.75);
  --lyrics-border: rgba(255, 255, 255, 0.08);
  --btn-bg: rgba(255, 255, 255, 0.12);
  --btn-hover: rgba(255, 255, 255, 0.25);
  --dropdown-bg: rgba(20, 20, 40, 0.92);
  --menu-bg: rgba(0, 0, 0, 0.9);
  --aplayer-bg: rgba(255, 255, 255, 0.95);
  --aplayer-text: #000;
  --toast-bg: rgba(15, 15, 35, 0.92);
  --radius: 16px;
  --radius-sm: 10px;
  --transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.app.light {
  --bg-primary: #e8ecf1;
  --bg-secondary: rgba(255, 255, 255, 0.75);
  --bg-card: rgba(0, 0, 0, 0.04);
  --border-color: rgba(0, 0, 0, 0.08);
  --text-primary: #1a1a2e;
  --text-secondary: rgba(0, 0, 0, 0.6);
  --text-muted: rgba(0, 0, 0, 0.35);
  --shadow: 0 8px 40px rgba(0, 0, 0, 0.12);
  --lyrics-bg: rgba(255, 255, 255, 0.75);
  --lyrics-border: rgba(0, 0, 0, 0.08);
  --btn-bg: rgba(0, 0, 0, 0.06);
  --btn-hover: rgba(0, 0, 0, 0.12);
  --dropdown-bg: rgba(255, 255, 255, 0.92);
  --menu-bg: rgba(255, 255, 255, 0.95);
  --aplayer-bg: rgba(255, 255, 255, 0.95);
  --aplayer-text: #000;
  --toast-bg: rgba(255, 255, 255, 0.92);
}

/* ===== 播放器样式覆盖 ===== */
.aplayer .aplayer-info .aplayer-music .aplayer-title {
  color: #1a1a2e !important;
}

.aplayer .aplayer-list ol li .aplayer-list-title {
  color: #1a1a2e !important;
}

.aplayer .aplayer-list ol li {
  color: #1a1a2e !important;
}

/* ===== 全局强压 Twikoo 样式 ===== */
#twikoo-container,
#twikoo-container *,
.tk-comment,
.tk-comment *,
.tk-content,
.tk-content *,
.tk-nick,
.tk-nick *,
.tk-time,
.tk-time *,
.tk-input,
.tk-input *,
.tk-submit,
.tk-submit *,
.tk-reply,
.tk-reply *,
.tk-actions,
.tk-actions *,
.tk-like,
.tk-like *,
.tk-dislike,
.tk-dislike *,
.tk-btn,
.tk-btn *,
.tk-label,
.tk-label *,
.tk-count,
.tk-count *,
.tk-more,
.tk-more *,
.tk-pinned,
.tk-pinned *,
.tk-owner,
.tk-owner *,
.tk-comment .tk-content,
.tk-comment .tk-nick,
.tk-comment .tk-time,
.tk-comment .tk-actions {
  color: #1a1a2e !important;
}

.tk-btn {
  background: linear-gradient(135deg, #ff8c00, #ff4500) !important;
  color: #ffffff !important;
  border: none !important;
  padding: 8px 20px !important;
  border-radius: 8px !important;
  cursor: pointer !important;
}

.tk-input,
.tk-input textarea,
.tk-input input {
  background: #ffffff !important;
  color: #1a1a2e !important;
  border: 1px solid #d5dbe3 !important;
  border-radius: 8px !important;
  padding: 10px 14px !important;
}

.tk-input::placeholder,
.tk-input input::placeholder,
.tk-input textarea::placeholder {
  color: #aaa !important;
}

.tk-comment {
  background: #f5f6f8 !important;
  border-radius: 10px !important;
  padding: 14px 18px !important;
  margin-bottom: 12px !important;
  border: 1px solid #e8ecf1 !important;
}

.tk-nick {
  font-weight: 700 !important;
}

.tk-time {
  color: #999 !important;
}

.tk-btn:hover {
  transform: scale(1.03) !important;
}

.tk-submit {
  background: #f5f6f8 !important;
  border-radius: 10px !important;
  padding: 16px !important;
  border: 1px solid #e8ecf1 !important;
}

.tk-reply .tk-input {
  background: #ffffff !important;
  border: 1px solid #d5dbe3 !important;
  border-radius: 6px !important;
}

.tk-count {
  color: #888 !important;
}

.tk-more {
  color: #2563eb !important;
  cursor: pointer !important;
}

.tk-pinned {
  background: #fff8e1 !important;
}

.tk-owner {
  background: #e3f2fd !important;
}

/* ===== App 组件样式 ===== */
.app {
  min-height: 100vh;
  background: var(--bg-primary);
  transition: background var(--transition);
  font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif;
  position: relative;
}

.right-buttons {
  position: fixed;
  right: 24px;
  bottom: 96px;
  z-index: 30000;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
}

.github-corner {
  position: fixed;
  top: 0;
  right: 0;
  width: 0;
  height: 0;
  border-top: 46px solid rgba(0, 100, 255, 0.85);
  border-left: 46px solid transparent;
  text-decoration: none;
  cursor: pointer;
  transition: all var(--transition);
  z-index: 99999;
}

.github-corner:hover {
  border-top-color: rgba(0, 80, 220, 1);
}

.github-corner svg {
  position: absolute;
  top: -38px;
  right: 4px;
  width: 20px;
  height: 20px;
  transform: rotate(45deg);
}

.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 99998;
  background: rgba(15, 15, 26, 0.7);
  backdrop-filter: blur(12px);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding: 8px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.5);
}

.app.light .footer {
  background: rgba(255, 255, 255, 0.7);
  border-top-color: rgba(0, 0, 0, 0.06);
  color: rgba(0, 0, 0, 0.4);
}

.footer button {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  font-size: 13px;
  transition: all var(--transition);
  padding: 5px 16px;
  border-radius: 20px;
}

.app.light .footer button {
  background: rgba(0, 0, 0, 0.05);
  border-color: rgba(0, 0, 0, 0.08);
  color: rgba(0, 0, 0, 0.6);
}

.footer button:hover {
  background: rgba(255, 140, 0, 0.2);
  border-color: rgba(255, 140, 0, 0.4);
  color: #ff8c00;
}
</style>
