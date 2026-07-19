<template>
  <div id="player-wrap" ref="wrapRef" :class="{ show: isOpen }">
    <div ref="containerRef" id="aplayer-container"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { usePlayerStore } from '../stores/playerStore'
import { API_CONFIG } from '../config'

const store = usePlayerStore()
const wrapRef = ref(null)
const containerRef = ref(null)
const aplayer = ref(null)
const isLoading = ref(false)
const isOpen = ref(false)

// ===== 初始化播放器 =====
const init = async () => {
  if (aplayer.value || isLoading.value) return
  isLoading.value = true
  try {
    await loadPlaylist(store.playlistId || store.playlists[0]?.id)
  } catch (e) {
    console.error('播放器初始化失败:', e)
  }
  isLoading.value = false
}

// ===== 加载歌单 =====
const loadPlaylist = async (id) => {
  store.setPlaylist(id)
  if (aplayer.value) {
    aplayer.value.pause()
    aplayer.value = null
  }
  if (containerRef.value) {
    containerRef.value.innerHTML = ''
  }

  const songs = await fetchPlaylist(id)
  const audioList = await fetchLyrics(songs)

  aplayer.value = new APlayer({
    container: containerRef.value,
    audio: audioList,
    theme: '#49b1f5',
    loop: store.loopMode,
    preload: 'metadata',
    volume: store.volume,
    lrcType: 3
  })

  bindEvents()
  return aplayer.value
}

const fetchPlaylist = async (id) => {
  const url = `${API_CONFIG.METING_API}?server=netease&type=playlist&id=${id}`
  const res = await fetch(url)
  return await res.json()
}

const fetchLyrics = async (songs) => {
  const result = []
  for (const song of songs) {
    let lrc = song.lrc || ''
    if (!lrc) {
      try {
        const url = `${API_CONFIG.LRC_API}?id=${song.id}`
        const res = await fetch(url)
        const data = await res.json()
        lrc = data.lyric || ''
      } catch (e) {}
    }
    result.push({
      name: song.name,
      artist: song.artist,
      url: song.url,
      cover: song.pic,
      lrc: lrc
    })
  }
  return result
}

// ===== 绑定事件 =====
const bindEvents = () => {
  if (!aplayer.value) return

  aplayer.value.on('play', () => {
    store.isPlaying = true
    const info = aplayer.value.list.audios[aplayer.value.list.index]
    store.setCurrentSong(info)
    window.dispatchEvent(new CustomEvent('player-play', { detail: { song: info } }))
  })

  aplayer.value.on('pause', () => {
    store.isPlaying = false
    window.dispatchEvent(new CustomEvent('player-pause'))
  })

  aplayer.value.on('ended', () => {
    store.isPlaying = false
    window.dispatchEvent(new CustomEvent('player-ended'))
  })

  aplayer.value.on('volumechange', () => {
    const vol = aplayer.value.audio.volume
    store.setVolume(vol)
  })
}

// ===== 控制方法 =====
const toggle = () => {
  if (aplayer.value) aplayer.value.toggle()
}

const play = () => {
  if (aplayer.value) aplayer.value.play()
}

const pause = () => {
  if (aplayer.value) aplayer.value.pause()
}

const next = () => {
  if (aplayer.value) aplayer.value.skipForward()
}

const prev = () => {
  if (aplayer.value) aplayer.value.skipBack()
}

const open = () => {
  isOpen.value = true
  if (!aplayer.value) init()
}

const close = () => {
  isOpen.value = false
}

// ===== 暴露 =====
defineExpose({
  init,
  loadPlaylist,
  toggle,
  play,
  pause,
  next,
  prev,
  open,
  close,
  isOpen,
  aplayer,
  containerRef
})

// ===== 监听音量变化 =====
watch(() => store.volume, (vol) => {
  if (aplayer.value) {
    aplayer.value.volume(vol, true)
  }
})

// ===== 生命周期 =====
onMounted(() => {
  // 如果默认不展开，预加载但不显示
  if (!isOpen.value) {
    init()
  }
})

onUnmounted(() => {
  if (aplayer.value) {
    aplayer.value.pause()
    aplayer.value = null
  }
})
</script>

<style scoped>
#player-wrap {
  position: fixed;
  left: 18px;
  bottom: 92px;
  width: 360px;
  max-width: calc(100% - 40px);
  z-index: 15000;
  display: none;
}

#player-wrap.show {
  display: block;
  animation: popIn 0.18s ease;
}

@keyframes popIn {
  from { opacity: 0; transform: scale(0.96); }
  to { opacity: 1; transform: scale(1); }
}
</style>
