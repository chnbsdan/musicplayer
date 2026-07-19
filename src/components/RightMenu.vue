<template>
  <ul id="right-menu" ref="menuRef" @click="close">
    <li @click="onPlayToggle"><i class="fas fa-play"></i> 播放 / 暂停</li>
    <li @click="onPrev"><i class="fas fa-backward"></i> 上一首</li>
    <li @click="onNext"><i class="fas fa-forward"></i> 下一首</li>
    <li @click="onVolUp"><i class="fas fa-volume-up"></i> 音量 +</li>
    <li @click="onVolDown"><i class="fas fa-volume-down"></i> 音量 -</li>
    <li @click="onLoopToggle"><i class="fas fa-sync-alt"></i> {{ store.loopModeLabel }}</li>
    <li @click="onLyricsToggle"><i class="fas fa-music"></i> {{ store.lyricsVisible ? '隐藏歌词' : '显示歌词' }}</li>
    <li @click="onSupport"><i class="fas fa-life-ring"></i> 技术支持</li>
    <li @click="onFullscreen"><i class="fas fa-expand"></i> 全屏模式</li>
    <li @click="onClose"><i class="fas fa-times"></i> 关闭播放器</li>
  </ul>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { usePlayerStore } from '../stores/playerStore'

const store = usePlayerStore()
const menuRef = ref(null)

const emit = defineEmits([
  'play-toggle', 'prev', 'next', 'vol-up', 'vol-down',
  'loop-toggle', 'lyrics-toggle', 'support', 'fullscreen', 'close-player'
])

const close = () => {
  if (menuRef.value) menuRef.value.style.display = 'none'
}

const show = (x, y) => {
  if (!menuRef.value) return
  menuRef.value.style.display = 'block'
  const mw = menuRef.value.offsetWidth || 190
  const mh = menuRef.value.offsetHeight || 300
  let left = Math.round(x - mw / 2)
  left = Math.max(10, Math.min(left, window.innerWidth - mw - 10))
  let top = y - mh - 10
  if (top < 10) top = y + 10
  if (top + mh > window.innerHeight - 10) top = Math.max(10, window.innerHeight - mh - 10)
  menuRef.value.style.left = left + 'px'
  menuRef.value.style.top = top + 'px'
}

const onPlayToggle = () => { emit('play-toggle'); close() }
const onPrev = () => { emit('prev'); close() }
const onNext = () => { emit('next'); close() }
const onVolUp = () => { emit('vol-up'); close() }
const onVolDown = () => { emit('vol-down'); close() }
const onLoopToggle = () => { emit('loop-toggle'); close() }
const onLyricsToggle = () => { emit('lyrics-toggle'); close() }
const onSupport = () => { emit('support'); close() }
const onFullscreen = () => { emit('fullscreen'); close() }
const onClose = () => { emit('close-player'); close() }

const onContextMenu = (e) => {
  e.preventDefault()
  show(e.clientX, e.clientY)
}

const onClick = (e) => {
  if (menuRef.value && !menuRef.value.contains(e.target)) {
    close()
  }
}

onMounted(() => {
  document.addEventListener('contextmenu', onContextMenu)
  document.addEventListener('click', onClick)
})

onUnmounted(() => {
  document.removeEventListener('contextmenu', onContextMenu)
  document.removeEventListener('click', onClick)
})

defineExpose({ show, close })
</script>

<style scoped>
#right-menu {
  position: fixed;
  display: none;
  z-index: 40000;
  min-width: 200px;
  background: var(--menu-bg);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  color: var(--text-primary);
  border-radius: 12px;
  padding: 6px 0;
  border: 1px solid var(--border-color);
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.4);
  overflow: hidden;
}

#right-menu li {
  padding: 10px 18px;
  cursor: pointer;
  list-style: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 6px;
  margin: 0 4px;
  transition: all 0.15s ease;
  color: var(--text-secondary);
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 12px;
}

body.light #right-menu li {
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);
}

#right-menu li:hover {
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  color: #ffffff;
  transform: translateX(3px);
}

#right-menu li i {
  width: 18px;
  text-align: center;
  font-size: 14px;
  opacity: 0.6;
  transition: opacity 0.2s;
}

#right-menu li:hover i {
  opacity: 1;
}

#right-menu li:last-child {
  border-bottom: none;
}

/* 浅色模式 */
body.light #right-menu li:hover {
  background: linear-gradient(135deg, #2563eb, #7c3aed);
  color: #ffffff;
}
</style>
