<template>
  <div id="floating-lyrics" ref="container">
    <div class="song-title" ref="songTitleEl">🎵 点击播放音乐</div>
    <div class="current-line" ref="currentLineEl">等待播放...</div>
    <div class="next-line" ref="nextLineEl"></div>
    <div id="lyrics-resize-handle"></div>
    <div class="lyrics-settings-btn" @click="toggleSettings">⚙</div>
  </div>

  <!-- 设置面板 -->
  <div id="lyrics-settings-panel" ref="settingsPanel">
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
import { ref, onMounted } from 'vue'
import { usePlayerStore } from '../stores/playerStore'
import { useLyrics } from '../composables/useLyrics'

const store = usePlayerStore()
const {
  container,
  currentLineEl,
  nextLineEl,
  songTitleEl,
  reset,
  applyStyles
} = useLyrics()

const settingsPanel = ref(null)
const isSettingsOpen = ref(false)

const toggleSettings = (e) => {
  e.stopPropagation()
  isSettingsOpen.value = !isSettingsOpen.value
  if (isSettingsOpen.value) {
    const rect = container.value.getBoundingClientRect()
    let px = rect.right - 210
    let py = rect.top - 10
    if (px < 10) px = rect.left + 10
    if (py < 10) py = rect.bottom + 10
    if (py + 280 > window.innerHeight) py = rect.top - 290
    settingsPanel.value.style.left = px + 'px'
    settingsPanel.value.style.top = py + 'px'
    settingsPanel.value.style.display = 'block'
  } else {
    settingsPanel.value.style.display = 'none'
  }
}

const closeSettings = () => {
  isSettingsOpen.value = false
  settingsPanel.value.style.display = 'none'
}

const onColorChange = (e) => {
  store.setLyricsColor(e.target.value)
  applyStyles()
}

const onFontSizeChange = (e) => {
  store.setLyricsFontSize(parseInt(e.target.value))
  applyStyles()
}

onMounted(() => {
  applyStyles()
})
</script>

<style scoped>
/* 样式在 css/lyrics.css 中定义，这里不重复 */
</style>
