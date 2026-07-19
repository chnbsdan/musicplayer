<template>
  <button id="music-capsule" 
          @click="togglePlayer" 
          :class="{ playing: store.isPlaying }" 
          title="展开播放器"
          :style="{ display: visible ? 'flex' : 'none' }">
    <span class="icon-music">♪</span>
    <img id="capsule-cover" :src="coverUrl" alt="cover" @error="handleImageError">
  </button>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { usePlayerStore } from '../stores/playerStore'

const store = usePlayerStore()
const visible = ref(true)
const fallbackCover = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect fill="%23333" width="100" height="100"/%3E%3Ctext x="50" y="55" text-anchor="middle" fill="%23ff8c00" font-size="40"%3E♪%3C/text%3E%3C/svg%3E'

// 封面 URL：从当前歌曲获取
const coverUrl = computed(() => {
  if (store.currentSong && store.currentSong.cover) {
    return store.currentSong.cover
  }
  return fallbackCover
})

const handleImageError = (e) => {
  e.target.src = fallbackCover
}

const togglePlayer = () => {
  window.dispatchEvent(new CustomEvent('capsule-toggle'))
}

const show = () => {
  visible.value = true
}

const hide = () => {
  visible.value = false
}

// 监听歌曲切换，更新封面
const onPlayerPlay = (e) => {
  const song = e.detail?.song
  if (song && song.cover) {
    // 封面会自动更新因为 computed 依赖 store.currentSong
  }
}

onMounted(() => {
  window.addEventListener('player-play', onPlayerPlay)
})

onUnmounted(() => {
  window.removeEventListener('player-play', onPlayerPlay)
})

defineExpose({ togglePlayer, show, hide, visible })
</script>

<style scoped>
#music-capsule {
  position: fixed;
  left: 22px;
  bottom: 96px;
  width: 72px;
  height: 72px;
  border-radius: 50%;
  cursor: pointer;
  z-index: 30000;
  background: radial-gradient(circle at 30% 30%, #00c3ff, #0061ff);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 28px rgba(0, 180, 255, 0.3);
  transition: all var(--transition);
  border: none;
  color: #fff;
  font-size: 28px;
  overflow: hidden;
}

#music-capsule:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 40px rgba(0, 180, 255, 0.5);
}

#music-capsule .icon-music {
  font-style: normal;
}

#music-capsule.playing {
  background: radial-gradient(circle at 30% 30%, #ff9500, #ff5e00);
  box-shadow: 0 8px 28px rgba(255, 140, 0, 0.28);
}

#music-capsule.playing img {
  animation: spin 6s linear infinite;
}

#music-capsule img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  display: none;
}

#music-capsule.playing img {
  display: block;
}

#music-capsule.playing .icon-music {
  display: none;
}

@keyframes spin {
  from { transform: rotate(0); }
  to { transform: rotate(360deg); }
}
</style>
