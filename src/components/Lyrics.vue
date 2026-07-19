<template>
  <div id="floating-lyrics" ref="containerRef" :class="{ show: isVisible }">
    <div class="song-title" ref="songTitleRef">🎵 点击播放音乐</div>
    <div class="current-line" ref="currentLineRef">等待播放...</div>
    <div class="next-line" ref="nextLineRef"></div>
    <div id="lyrics-resize-handle"></div>
    <div class="lyrics-settings-btn" @click.stop="toggleSettings">⚙</div>
  </div>

  <div id="lyrics-settings-panel" ref="settingsPanelRef" @click.stop>
    <div class="panel-header">
      <span>🎤 歌词设置</span>
      <span class="panel-close" @click="closeSettings">&times;</span>
    </div>
    <label>文字颜色</label>
    <input type="color" class="color-picker" :value="store.lyricsColor" @input="onColorChange">
    <label>字号大小</label>
    <div class="slider-row">
      <input type="range" min="12" max="80" :value="store.lyricsFontSize" @input="onFontSizeChange">
      <span>{{ store.lyricsFontSize }}</span>
    </div>
    <div class="btn-row">
      <button class="btn-reset" @click="reset">重置</button>
      <button class="btn-apply" @click="closeSettings">应用</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { usePlayerStore } from '../stores/playerStore'

const store = usePlayerStore()
const containerRef = ref(null)
const currentLineRef = ref(null)
const nextLineRef = ref(null)
const songTitleRef = ref(null)
const settingsPanelRef = ref(null)

const isVisible = ref(false)
const currentLyric = ref('')
let interval = null
let dragData = null
let resizeData = null
let isSettingsOpen = false

// ===== 显示歌词（打字效果） =====
const show = (text, nextText) => {
  if (!store.lyricsVisible) return
  if (text === currentLyric.value) return

  currentLyric.value = text
  if (!currentLineRef.value) return

  currentLineRef.value.innerHTML = ''

  if (text && text.trim()) {
    isVisible.value = true
    containerRef.value.style.display = 'block'
    containerRef.value.style.opacity = '1'

    // 打字效果
    const span = document.createElement('span')
    span.className = 'typing-text'
    span.textContent = text
    currentLineRef.value.appendChild(span)

    if (nextLineRef.value) {
      nextLineRef.value.textContent = nextText || ''
    }
    containerRef.value.classList.add('show')
  } else {
    hide()
  }
}

const hide = () => {
  isVisible.value = false
  if (containerRef.value) {
    containerRef.value.style.display = 'none'
    containerRef.value.classList.remove('show')
  }
  currentLyric.value = ''
}

const setCurrentSong = (song) => {
  if (songTitleRef.value) {
    songTitleRef.value.textContent = song ? `🎵 ${song.name} - ${song.artist || ''}` : '🎵 点击播放音乐'
  }
}

const toggleVisibility = () => {
  const visible = store.toggleLyrics()
  if (visible) {
    containerRef.value.style.display = 'block'
    containerRef.value.classList.add('show')
    isVisible.value = true
  } else {
    hide()
  }
  return visible
}

// ===== 从 DOM 更新歌词 =====
const updateFromDOM = () => {
  try {
    if (!store.lyricsVisible) return

    const lrcContainer = document.querySelector('.aplayer-lrc')
    if (!lrcContainer) {
      hide()
      return
    }

    const currentLrc = lrcContainer.querySelector('p.aplayer-lrc-current')
    const allLrcLines = lrcContainer.querySelectorAll('p')

    if (currentLrc && currentLrc.textContent.trim()) {
      const text = currentLrc.textContent.trim()
      let nextText = ''
      for (let i = 0; i < allLrcLines.length; i++) {
        if (allLrcLines[i] === currentLrc && i < allLrcLines.length - 1) {
          nextText = allLrcLines[i + 1].textContent.trim()
          break
        }
      }
      show(text, nextText)
    } else {
      hide()
    }
  } catch (e) {
    hide()
  }
}

const startUpdate = () => {
  if (interval) clearInterval(interval)
  interval = setInterval(updateFromDOM, 200)
}

const stopUpdate = () => {
  if (interval) {
    clearInterval(interval)
    interval = null
  }
}

// ===== 应用样式 =====
const applyStyles = () => {
  nextTick(() => {
    if (currentLineRef.value) {
      currentLineRef.value.style.color = store.lyricsColor
      currentLineRef.value.style.fontSize = store.lyricsFontSize + 'px'
    }
    if (nextLineRef.value) {
      nextLineRef.value.style.fontSize = Math.max(10, store.lyricsFontSize * 0.45) + 'px'
    }
  })
}

const reset = () => {
  if (containerRef.value) {
    containerRef.value.style.left = '50%'
    containerRef.value.style.top = '20px'
    containerRef.value.style.transform = 'translateX(-50%)'
    containerRef.value.style.width = ''
    containerRef.value.style.height = ''
  }
  store.setLyricsColor('#ff4500')
  store.setLyricsFontSize(30)
  applyStyles()
  closeSettings()
}

// ===== 设置面板 =====
const toggleSettings = (e) => {
  e?.stopPropagation?.()
  isSettingsOpen = !isSettingsOpen
  if (isSettingsOpen) {
    const rect = containerRef.value.getBoundingClientRect()
    let px = rect.right - 210
    let py = rect.top - 10
    if (px < 10) px = rect.left + 10
    if (py < 10) py = rect.bottom + 10
    if (py + 280 > window.innerHeight) py = rect.top - 290
    settingsPanelRef.value.style.left = px + 'px'
    settingsPanelRef.value.style.top = py + 'px'
    settingsPanelRef.value.style.display = 'block'
  } else {
    settingsPanelRef.value.style.display = 'none'
  }
}

const closeSettings = () => {
  isSettingsOpen = false
  if (settingsPanelRef.value) {
    settingsPanelRef.value.style.display = 'none'
  }
}

const onColorChange = (e) => {
  store.setLyricsColor(e.target.value)
  applyStyles()
}

const onFontSizeChange = (e) => {
  store.setLyricsFontSize(parseInt(e.target.value))
  applyStyles()
}

// ===== 拖动（鼠标 + 触摸） =====
const bindDrag = () => {
  const el = containerRef.value
  if (!el) return

  el.addEventListener('mousedown', (e) => {
    if (e.target.closest('.lyrics-settings-btn') || e.target.closest('#lyrics-resize-handle')) return
    if (!el.classList.contains('show')) return
    dragData = {
      offsetX: e.clientX - el.offsetLeft,
      offsetY: e.clientY - el.offsetTop,
      isTouch: false
    }
    e.preventDefault()
  })

  el.addEventListener('touchstart', (e) => {
    if (e.target.closest('.lyrics-settings-btn') || e.target.closest('#lyrics-resize-handle')) return
    if (!el.classList.contains('show')) return
    const touch = e.touches[0]
    dragData = {
      offsetX: touch.clientX - el.offsetLeft,
      offsetY: touch.clientY - el.offsetTop,
      isTouch: true
    }
    e.preventDefault()
  }, { passive: false })

  document.addEventListener('mousemove', (e) => {
    if (!dragData || dragData.isTouch) return
    doDrag(e.clientX, e.clientY)
  })

  document.addEventListener('touchmove', (e) => {
    if (!dragData || !dragData.isTouch) return
    const touch = e.touches[0]
    doDrag(touch.clientX, touch.clientY)
    e.preventDefault()
  }, { passive: false })

  document.addEventListener('mouseup', () => { dragData = null })
  document.addEventListener('touchend', () => { dragData = null })
}

const doDrag = (clientX, clientY) => {
  const el = containerRef.value
  if (!el || !dragData) return
  let x = clientX - dragData.offsetX
  let y = clientY - dragData.offsetY
  x = Math.max(0, Math.min(window.innerWidth - el.offsetWidth, x))
  y = Math.max(0, Math.min(window.innerHeight - el.offsetHeight, y))
  el.style.left = x + 'px'
  el.style.top = y + 'px'
  el.style.transform = 'none'
}

// ===== 缩放 =====
const bindResize = () => {
  const handle = document.getElementById('lyrics-resize-handle')
  const el = containerRef.value
  if (!handle || !el) return

  handle.addEventListener('mousedown', (e) => {
    e.stopPropagation()
    e.preventDefault()
    if (!el.classList.contains('show')) return
    resizeData = {
      startX: e.clientX,
      startY: e.clientY,
      startW: el.offsetWidth,
      startH: el.offsetHeight,
      isTouch: false
    }
  })

  handle.addEventListener('touchstart', (e) => {
    e.stopPropagation()
    e.preventDefault()
    if (!el.classList.contains('show')) return
    const touch = e.touches[0]
    resizeData = {
      startX: touch.clientX,
      startY: touch.clientY,
      startW: el.offsetWidth,
      startH: el.offsetHeight,
      isTouch: true
    }
  }, { passive: false })

  document.addEventListener('mousemove', (e) => {
    if (!resizeData || resizeData.isTouch) return
    doResize(e.clientX, e.clientY)
  })

  document.addEventListener('touchmove', (e) => {
    if (!resizeData || !resizeData.isTouch) return
    const touch = e.touches[0]
    doResize(touch.clientX, touch.clientY)
    e.preventDefault()
  }, { passive: false })

  document.addEventListener('mouseup', () => { resizeData = null })
  document.addEventListener('touchend', () => { resizeData = null })
}

const doResize = (clientX, clientY) => {
  const el = containerRef.value
  if (!el || !resizeData) return
  let newW = resizeData.startW + (clientX - resizeData.startX)
  let newH = resizeData.startH + (clientY - resizeData.startY)
  newW = Math.max(150, newW)
  newH = Math.max(70, newH)
  el.style.width = newW + 'px'
  el.style.height = newH + 'px'
}

// ===== 事件监听 =====
const onPlayerPlay = (e) => {
  const song = e.detail?.song
  if (song) setCurrentSong(song)
  startUpdate()
}

const onPlayerPause = () => { stopUpdate() }
const onPlayerEnded = () => { stopUpdate(); hide() }

// ===== 生命周期 =====
onMounted(() => {
  bindDrag()
  bindResize()
  applyStyles()

  window.addEventListener('player-play', onPlayerPlay)
  window.addEventListener('player-pause', onPlayerPause)
  window.addEventListener('player-ended', onPlayerEnded)
})

onUnmounted(() => {
  stopUpdate()
  window.removeEventListener('player-play', onPlayerPlay)
  window.removeEventListener('player-pause', onPlayerPause)
  window.removeEventListener('player-ended', onPlayerEnded)
})

watch(() => store.lyricsColor, () => applyStyles())
watch(() => store.lyricsFontSize, () => applyStyles())

defineExpose({
  show,
  hide,
  setCurrentSong,
  toggleVisibility,
  startUpdate,
  stopUpdate,
  reset,
  applyStyles
})
</script>

<style scoped>
#floating-lyrics {
  position: fixed;
  left: 50%;
  top: 20px;
  transform: translateX(-50%);
  z-index: 99999;
  color: #ff8c00;
  background: var(--lyrics-bg);
  padding: 18px 30px 30px 30px;
  border-radius: var(--radius);
  backdrop-filter: blur(16px) saturate(1.4);
  border: 1px solid var(--lyrics-border);
  display: none;
  opacity: 0;
  pointer-events: auto;
  cursor: grab;
  box-shadow: var(--shadow);
  min-width: 150px;
  min-height: 70px;
  text-align: center;
  user-select: none;
  transition: background var(--transition), border-color var(--transition),
    box-shadow var(--transition), opacity 0.25s ease;
  touch-action: none;
}

#floating-lyrics:active {
  cursor: grabbing;
}

#floating-lyrics.show {
  display: block;
  opacity: 1;
}

#floating-lyrics .song-title {
  color: var(--text-secondary);
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 6px;
  opacity: 0.7;
  min-height: 18px;
}

#floating-lyrics .current-line {
  color: #ff4500;
  font-size: 30px;
  font-weight: bold;
  min-height: 36px;
  text-align: center;
  line-height: 1.3;
}

#floating-lyrics .next-line {
  color: #ff8c00;
  font-size: 14px;
  opacity: 0.8;
  min-height: 18px;
  text-align: center;
}

#floating-lyrics .current-line .typing-text {
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  animation: typing 2s steps(40, end);
  animation-fill-mode: both;
}

@keyframes typing {
  from { width: 0; }
  to { width: 100%; }
}

#lyrics-resize-handle {
  position: absolute;
  bottom: 3px;
  right: 3px;
  width: 14px;
  height: 14px;
  cursor: nwse-resize;
  pointer-events: auto;
  z-index: 20;
  background: linear-gradient(135deg, transparent 55%, rgba(255, 255, 255, 0.3) 55%);
  border-radius: 0 0 var(--radius-sm) 0;
  opacity: 0;
  transition: opacity 0.25s ease;
  touch-action: none;
}

#floating-lyrics:hover #lyrics-resize-handle {
  opacity: 1;
}

.app.light #lyrics-resize-handle {
  background: linear-gradient(135deg, transparent 55%, rgba(0, 0, 0, 0.18) 55%);
}

.lyrics-settings-btn {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 26px;
  height: 26px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  color: #fff;
  font-size: 13px;
  text-align: center;
  line-height: 26px;
  cursor: pointer;
  pointer-events: auto;
  z-index: 10;
  border: 1px solid rgba(255, 255, 255, 0.12);
  transition: all var(--transition);
  opacity: 0.5;
}

.app.light .lyrics-settings-btn {
  background: rgba(0, 0, 0, 0.05);
  color: #444;
  border: 1px solid rgba(0, 0, 0, 0.06);
  opacity: 0.6;
}

.lyrics-settings-btn:hover {
  opacity: 1;
  background: rgba(255, 140, 0, 0.5);
  color: #fff;
  transform: scale(1.1);
}

#lyrics-settings-panel {
  position: fixed;
  display: none;
  z-index: 100000;
  background: var(--dropdown-bg);
  backdrop-filter: blur(20px);
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  padding: 18px 22px;
  min-width: 210px;
  color: var(--text-primary);
  box-shadow: var(--shadow);
  pointer-events: auto;
  font-family: inherit;
}

#lyrics-settings-panel .panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

#lyrics-settings-panel .panel-header span {
  font-weight: 600;
  font-size: 14px;
}

#lyrics-settings-panel .panel-close {
  cursor: pointer;
  font-size: 18px;
  opacity: 0.5;
  transition: 0.2s;
}

#lyrics-settings-panel .panel-close:hover {
  opacity: 1;
}

#lyrics-settings-panel label {
  font-size: 11px;
  color: var(--text-secondary);
  display: block;
  margin-bottom: 3px;
}

#lyrics-settings-panel .color-picker {
  width: 100%;
  height: 32px;
  border: none;
  border-radius: 6px;
  background: transparent;
  cursor: pointer;
  margin-bottom: 10px;
}

#lyrics-settings-panel .slider-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

#lyrics-settings-panel .slider-row input[type="range"] {
  flex: 1;
  accent-color: #ff8c00;
  height: 4px;
}

#lyrics-settings-panel .slider-row span {
  min-width: 32px;
  text-align: center;
  font-weight: 600;
  color: #ff8c00;
  font-size: 14px;
}

#lyrics-settings-panel .btn-row {
  display: flex;
  gap: 6px;
  margin-top: 2px;
}

#lyrics-settings-panel .btn-row button {
  flex: 1;
  padding: 6px 10px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  transition: 0.2s;
}

#lyrics-settings-panel .btn-reset {
  background: rgba(255, 255, 255, 0.06);
  color: var(--text-secondary);
}

#lyrics-settings-panel .btn-reset:hover {
  background: rgba(255, 255, 255, 0.12);
}

#lyrics-settings-panel .btn-apply {
  background: linear-gradient(135deg, #ff8c00, #ff4500);
  color: #fff;
  font-weight: 600;
}

#lyrics-settings-panel .btn-apply:hover {
  transform: scale(1.02);
}
</style>
