import { ref, onMounted, onUnmounted } from 'vue'
import { usePlayerStore } from '../stores/playerStore'
import { API_CONFIG } from '../config'

export function usePlayer() {
  const store = usePlayerStore()
  const container = ref(null)
  const aplayer = ref(null)
  const isLoading = ref(false)

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

  const loadPlaylist = async (id) => {
    store.setPlaylist(id)

    if (aplayer.value) {
      aplayer.value.pause()
      aplayer.value = null
    }

    const songs = await fetchPlaylist(id)
    const audioList = await fetchLyrics(songs)

    aplayer.value = new APlayer({
      container: container.value,
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

  const bindEvents = () => {
    if (!aplayer.value) return

    aplayer.value.on('play', () => {
      store.togglePlay()
      const info = aplayer.value.list.audios[aplayer.value.list.index]
      store.setCurrentSong(info)
    })

    aplayer.value.on('pause', () => {
      store.togglePlay()
    })

    aplayer.value.on('ended', () => {
      store.togglePlay()
    })

    aplayer.value.on('volumechange', () => {
      const vol = aplayer.value.audio.volume
      store.setVolume(vol)
    })
  }

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

  const setVolume = (vol) => {
    store.setVolume(vol)
    if (aplayer.value) aplayer.value.volume(vol, true)
  }

  const toggleLoop = () => {
    const mode = store.toggleLoopMode()
    if (aplayer.value) aplayer.value.options.loop = mode
    return mode
  }

  const getCurrentSong = () => {
    if (!aplayer.value) return null
    const list = aplayer.value.list.audios
    const index = aplayer.value.list.index
    return list[index] || null
  }

  onMounted(() => {
    // 自动初始化
    init()
  })

  onUnmounted(() => {
    if (aplayer.value) {
      aplayer.value.pause()
      aplayer.value = null
    }
  })

  return {
    container,
    aplayer,
    isLoading,
    init,
    loadPlaylist,
    toggle,
    play,
    pause,
    next,
    prev,
    setVolume,
    toggleLoop,
    getCurrentSong,
    isPlaying: store.isPlaying,
    currentSong: store.currentSong
  }
}
