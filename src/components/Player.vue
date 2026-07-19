<template>
  <div id="player-wrap" :class="{ show: isOpen }">
    <div ref="container" id="aplayer-container"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { usePlayer } from '../composables/usePlayer'
import { usePlayerStore } from '../stores/playerStore'

const store = usePlayerStore()
const { container, init, toggle, play, pause, next, prev } = usePlayer()

const isOpen = ref(false)

const togglePlayer = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    init()
  }
}

// 暴露给外部
defineExpose({
  togglePlayer,
  isOpen,
  toggle,
  play,
  pause,
  next,
  prev
})

// 监听歌单切换自动展开
onMounted(() => {
  // 监听歌单切换事件
  window.addEventListener('playlist-switch', () => {
    isOpen.value = true
    init()
  })
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
