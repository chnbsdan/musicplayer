import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const usePlayerStore = defineStore('player', () => {
  // ===== 状态 =====
  const isPlaying = ref(false)
  const currentSong = ref(null)
  const volume = ref(0.7)
  const loopMode = ref('all')
  const playlistId = ref('')
  const playlistName = ref('')
  const songs = ref([])
  const currentIndex = ref(0)

  // ===== 歌词状态 =====
  const lyricsVisible = ref(true)
  const lyricsColor = ref('#ff4500')
  const lyricsFontSize = ref(30)
  const currentLyric = ref('')
  const nextLyric = ref('')

  // ===== 主题 =====
  const isLight = ref(false)

  // ===== 歌单 =====
  const playlists = ref([
    { id: '14148542684', name: '华语流行' },
    { id: '3779629', name: '粤语经典' },
    { id: '3136952023', name: '欧美热歌' },
    { id: '2189471174', name: '纯音治愈' },
    { id: '5120491304', name: '摇滚精选' }
  ])

  // ===== 计算属性 =====
  const currentPlaylist = computed(() => {
    return playlists.value.find(p => p.id === playlistId.value)
  })

  const loopModeLabel = computed(() => {
    const labels = {
      'all': '🔁 循环全部',
      'one': '🔂 单曲循环',
      'none': '▶ 顺序播放'
    }
    return labels[loopMode.value] || '🔁 循环全部'
  })

  // ===== 方法 =====
  function togglePlay() {
    isPlaying.value = !isPlaying.value
  }

  function setVolume(val) {
    volume.value = Math.min(1, Math.max(0, val))
    localStorage.setItem('player-volume', String(volume.value))
  }

  function toggleLoopMode() {
    const modes = ['all', 'one', 'none']
    const idx = modes.indexOf(loopMode.value)
    loopMode.value = modes[(idx + 1) % modes.length]
    return loopMode.value
  }

  function setPlaylist(id) {
    playlistId.value = id
    const pl = playlists.value.find(p => p.id === id)
    playlistName.value = pl ? pl.name : ''
    localStorage.setItem('playlist-id', id)
  }

  function setCurrentSong(song) {
    currentSong.value = song
  }

  function toggleLyrics() {
    lyricsVisible.value = !lyricsVisible.value
    localStorage.setItem('lyrics-visible', String(lyricsVisible.value))
    return lyricsVisible.value
  }

  function setLyricsColor(color) {
    lyricsColor.value = color
    localStorage.setItem('lyrics-color', color)
  }

  function setLyricsFontSize(size) {
    lyricsFontSize.value = size
    localStorage.setItem('lyrics-font-size', String(size))
  }

  function toggleTheme() {
    isLight.value = !isLight.value
    localStorage.setItem('theme', isLight.value ? 'light' : 'dark')
  }

  function loadTheme() {
    const saved = localStorage.getItem('theme')
    isLight.value = saved === 'light'
  }

  // 加载保存的状态
  function loadSavedState() {
    const savedVolume = localStorage.getItem('player-volume')
    if (savedVolume) volume.value = parseFloat(savedVolume)

    const savedLyrics = localStorage.getItem('lyrics-visible')
    if (savedLyrics !== null) lyricsVisible.value = savedLyrics === 'true'

    const savedColor = localStorage.getItem('lyrics-color')
    if (savedColor) lyricsColor.value = savedColor

    const savedFontSize = localStorage.getItem('lyrics-font-size')
    if (savedFontSize) lyricsFontSize.value = parseInt(savedFontSize)

    const savedPlaylist = localStorage.getItem('playlist-id')
    if (savedPlaylist) playlistId.value = savedPlaylist
  }

  // 初始化
  loadSavedState()

  return {
    // 状态
    isPlaying,
    currentSong,
    volume,
    loopMode,
    playlistId,
    playlistName,
    songs,
    currentIndex,
    lyricsVisible,
    lyricsColor,
    lyricsFontSize,
    currentLyric,
    nextLyric,
    isLight,
    playlists,

    // 计算
    currentPlaylist,
    loopModeLabel,

    // 方法
    togglePlay,
    setVolume,
    toggleLoopMode,
    setPlaylist,
    setCurrentSong,
    toggleLyrics,
    setLyricsColor,
    setLyricsFontSize,
    toggleTheme,
    loadTheme,
    loadSavedState
  }
})
