<template>
  <div style="position:relative;">
    <button class="round-btn" @click="toggle">
      <span>⊞</span>
      <span class="badge">{{ store.playlists.length }}</span>
    </button>
    <div id="playlist-dropdown" ref="dropdown" :class="{ show: isOpen }">
      <div v-for="pl in store.playlists" :key="pl.id"
           class="dropdown-item"
           :class="{ active: pl.id === store.playlistId }"
           @click="switchPlaylist(pl.id)">
        <span class="item-icon">♪</span> {{ pl.name }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { usePlayerStore } from '../stores/playerStore'

const store = usePlayerStore()
const dropdown = ref(null)
const isOpen = ref(false)

const toggle = (e) => {
  e.stopPropagation()
  isOpen.value = !isOpen.value
}

const switchPlaylist = (id) => {
  store.setPlaylist(id)
  isOpen.value = false
  // 触发歌单切换事件
  window.dispatchEvent(new CustomEvent('playlist-switch', { detail: { id } }))
}

const close = () => {
  isOpen.value = false
}

onMounted(() => {
  document.addEventListener('click', close)
})

onUnmounted(() => {
  document.removeEventListener('click', close)
})
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

.round-btn .badge {
  position: absolute;
  top: -3px;
  right: -3px;
  width: 17px;
  height: 17px;
  background: linear-gradient(135deg, #ff8c00, #ff4500);
  border-radius: 50%;
  font-size: 9px;
  font-weight: 700;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(255, 140, 0, 0.4);
}

#playlist-dropdown {
  position: absolute;
  bottom: 56px;
  right: 0;
  min-width: 160px;
  background: var(--dropdown-bg);
  backdrop-filter: blur(20px);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  padding: 4px 0;
  display: none;
  box-shadow: var(--shadow);
  max-height: 300px;
  overflow-y: auto;
}

#playlist-dropdown.show {
  display: block;
  animation: dropIn 0.2s ease;
}

@keyframes dropIn {
  from { opacity: 0; transform: translateY(-8px) scale(0.96); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.dropdown-item {
  padding: 8px 16px;
  cursor: pointer;
  color: var(--text-secondary);
  font-size: 13px;
  transition: all 0.15s;
  border-bottom: 1px solid rgba(255, 255, 255, 0.03);
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 8px;
}

.dropdown-item .item-icon {
  font-size: 13px;
  opacity: 0.4;
}

.dropdown-item:hover {
  background: rgba(255, 140, 0, 0.15);
  color: var(--text-primary);
}

.dropdown-item.active {
  color: #ff8c00;
  font-weight: 600;
}

.dropdown-item.active .item-icon {
  opacity: 1;
  color: #ff8c00;
}

.dropdown-item:last-child {
  border-bottom: none;
}
</style>
