<template>
  <button class="round-btn" @click="toggleTheme" :title="store.isLight ? '切换到暗色' : '切换到亮色'">
    <i :class="store.isLight ? 'fas fa-moon' : 'fas fa-sun'"></i>
  </button>
</template>

<script setup>
import { usePlayerStore } from '../stores/playerStore'

const store = usePlayerStore()

const toggleTheme = () => {
  store.toggleTheme()
}
</script>

<style scoped>
.round-btn {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  font-size: 18px;
  transition: all var(--transition);
  background: var(--btn-bg);
  color: var(--text-primary);
  backdrop-filter: blur(12px);
  border: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow);
  position: relative;
}

.round-btn:hover {
  background: var(--btn-hover);
  transform: scale(1.08);
}
</style>
