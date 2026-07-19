<template>
  <ul id="right-menu" ref="menu" @click="close">
    <li @click="onPlayToggle">▶ 播放 / 暂停</li>
    <li @click="onPrev">⏮ 上一首</li>
    <li @click="onNext">⏭ 下一首</li>
    <li @click="onVolUp">🔊 音量 +</li>
    <li @click="onVolDown">🔉 音量 -</li>
    <li @click="onLoopToggle">{{ store.loopModeLabel }}</li>
    <li @click="onLyricsToggle">{{ store.lyricsVisible ? '📜 隐藏歌词' : '📜 显示歌词' }}</li>
    <li @click="onSupport">💡 技术支持</li>
    <li @click="onFullscreen">🖥️ 全屏模式</li>
    <li @click="onClose">❌ 关闭播放器</li>
  </ul>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { usePlayerStore } from '../stores/playerStore'

const store = usePlayerStore()
const menu = ref(null)

const emit = defineEmits([
  'play-toggle',
  'prev',
  'next',
  'vol-up',
  'vol-down',
  'loop-toggle',
  'lyrics-toggle',
  'support',
  'fullscreen',
  'close-player'
])

const close = () => {
  menu.value.style.display = 'none'
}

const show = (x, y) => {
  menu.value.style.display = 'block'
  const mw = menu.value.offsetWidth || 170
  const mh = menu.value.offsetHeight || 260
  let left = Math.round(x - mw / 2)
  left = Math.max(8, Math.min(left, window.innerWidth - mw - 8))
  let top = y - mh - 10
  if (top < 8) top = y + 10
  if (top + mh > window.innerHeight - 8) top = Math.max(8, window.innerHeight - mh - 8)
  menu.value.style.left = left + 'px'
  menu.value.style.top = top + 'px'
}

// 事件处理
const onPlayToggle = () => emit('play-toggle')
const onPrev = () => emit('prev')
const onNext = () => emit('next')
const onVolUp = () => emit('vol-up')
const onVolDown = () => emit('vol-down')
const onLoopToggle = () => emit('loop-toggle')
const onLyricsToggle = () => emit('lyrics-toggle')
const onSupport = () => emit('support')
const onFullscreen = () => emit('fullscreen')
const onClose = () => emit('close-player')

// 全局右键监听
const onContextMenu = (e) => {
  e.preventDefault()
  show(e.clientX, e.clientY)
}

const onClick = (e) => {
  if (menu.value && !menu.value.contains(e.target)) {
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
  min-width: 170px;
  background: var(--menu-bg);
  backdrop-filter: blur(12px);
  color: var(--text-primary);
  border-radius: var(--radius-sm);
  padding: 4px 0;
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow);
}

#right-menu li {
  padding: 7px 16px;
  cursor: pointer;
  list-style: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.03);
  border-radius: 6px;
  margin: 0 3px;
  transition: all 0.15s;
  color: var(--text-secondary);
  font-size: 13px;
}

#right-menu li:hover {
  background: #3b82f6;
  color: white;
}

#right-menu li:last-child {
  border-bottom: none;
}
</style>
