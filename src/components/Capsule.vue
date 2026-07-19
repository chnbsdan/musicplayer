<template>
  <button id="music-capsule" @click="togglePlayer" :class="{ playing: store.isPlaying }" title="展开播放器">
    <span class="icon-music">♪</span>
    <img id="capsule-cover" :src="coverImage" alt="cover">
  </button>
</template>

<script setup>
import { ref } from 'vue'
import { usePlayerStore } from '../stores/playerStore'

const store = usePlayerStore()
const coverImage = ref('/src/assets/cover.jpg')

const togglePlayer = () => {
  const event = new CustomEvent('capsule-toggle')
  window.dispatchEvent(event)
}

// 暴露给父组件
defineExpose({ togglePlayer })
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
  width: 90%;
  height: 90%;
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
