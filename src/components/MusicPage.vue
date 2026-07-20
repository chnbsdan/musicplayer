<template>
  <div v-if="visible" class="page-overlay" @click="close">
    <div class="page-content" @click.stop>
      <div class="page-header">
        <span class="page-title">🎵 在线音乐</span>
        <button class="page-close" @click="close">&times;</button>
      </div>
      <div class="page-body">
        <!-- 音乐播放器 -->
        <div v-if="currentMusic" class="player-wrapper music-player">
          <audio :src="currentMusic.url" controls autoplay class="audio-player"></audio>
          <div class="now-playing">{{ currentMusic.title }}</div>
        </div>
        <div v-else class="placeholder">
          <span>🎵</span>
          <p>请选择音乐</p>
        </div>

        <!-- 音乐列表 -->
        <div class="item-list">
          <div
            v-for="item in musicItems"
            :key="item.id"
            class="item"
            :class="{ active: currentMusic && currentMusic.id === item.id }"
            @click="playMusic(item)"
          >
            <span class="item-icon">♪</span>
            <span class="item-title">{{ item.title }}</span>
            <span class="item-play">▶</span>
          </div>
        </div>

        <div class="footer-tip">💡 在 MusicPage.vue 的 musicItems 中增删改</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({ visible: Boolean })
const emit = defineEmits(['close'])

const currentMusic = ref(null)

// ============================================================
// 🔥 在这里添加你的音乐
// ============================================================
const musicItems = [
  { id: 1, title: '音乐 1', url: 'https://pico.1356666.xyz/api/large/你的音乐1.mp3' },
  { id: 2, title: '音乐 2', url: 'https://pico.1356666.xyz/api/large/你的音乐2.mp3' },
  { id: 3, title: '音乐 3', url: 'https://pico.1356666.xyz/api/large/你的音乐3.mp3' },
]

const playMusic = (item) => {
  currentMusic.value = item
}

const close = () => {
  currentMusic.value = null
  emit('close')
}

watch(() => props.visible, (val) => {
  if (val && musicItems.length > 0) {
    currentMusic.value = musicItems[0]
  }
}, { immediate: true })
</script>

<style scoped>
.page-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  z-index: 999999;
  background: rgba(0,0,0,0.7);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.25s ease;
}
.page-content {
  background: var(--bg-primary, #0f0f1a);
  border-radius: 20px;
  width: 92%;
  max-width: 900px;
  max-height: 88vh;
  border: 1px solid var(--border-color, rgba(255,255,255,0.08));
  box-shadow: 0 20px 60px rgba(0,0,0,0.6);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  animation: scaleIn 0.25s ease;
}
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 24px;
  border-bottom: 1px solid var(--border-color, rgba(255,255,255,0.06));
  flex-shrink: 0;
}
.page-title { font-size: 18px; font-weight: 700; color: var(--text-primary, #fff); }
.page-close {
  background: none; border: none;
  color: var(--text-secondary, rgba(255,255,255,0.5));
  font-size: 28px; cursor: pointer;
  transition: all 0.3s;
}
.page-close:hover { color: #ff4500; transform: rotate(90deg); }
.page-body {
  padding: 20px 24px 16px;
  overflow-y: auto;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.player-wrapper {
  background: #1a1a2e;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}
.audio-player { width: 100%; }
.now-playing {
  color: var(--text-primary, #fff);
  font-size: 14px;
  font-weight: 500;
}
.placeholder {
  background: #1a1a2e;
  border-radius: 12px;
  padding: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary, rgba(255,255,255,0.3));
}
.placeholder span { font-size: 48px; margin-bottom: 12px; }
.item-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  max-height: 160px;
  overflow-y: auto;
  flex-shrink: 0;
}
.item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 14px;
  background: var(--bg-card, rgba(255,255,255,0.04));
  border: 1px solid var(--border-color, rgba(255,255,255,0.06));
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
  flex: 1 1 auto;
  min-width: 120px;
  max-width: 240px;
}
.item:hover { background: rgba(255,140,0,0.08); border-color: rgba(255,140,0,0.2); }
.item.active { background: rgba(255,140,0,0.15); border-color: #ff8c00; }
.item-icon { font-size: 16px; }
.item-title {
  font-size: 13px;
  color: var(--text-primary, #fff);
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.item-play { font-size: 12px; color: var(--text-secondary, rgba(255,255,255,0.3)); }
.item:hover .item-play { color: #ff8c00; }
.item.active .item-play { color: #ff8c00; }
.footer-tip {
  text-align: center;
  padding: 8px 0 4px;
  color: var(--text-secondary, rgba(255,255,255,0.2));
  font-size: 12px;
  border-top: 1px solid var(--border-color, rgba(255,255,255,0.04));
  flex-shrink: 0;
}
@keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
@keyframes scaleIn { from { opacity:0; transform:scale(0.96); } to { opacity:1; transform:scale(1); } }
.item-list::-webkit-scrollbar { width:4px; }
.item-list::-webkit-scrollbar-track { background:transparent; }
.item-list::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.12); border-radius:4px; }

body.light .page-content { background:#fff; border-color:rgba(0,0,0,0.06); }
body.light .page-title { color:#1a1a2e; }
body.light .item { background:#f5f6f8; border-color:#e8ecf1; }
body.light .item-title { color:#1a1a2e; }
body.light .placeholder { background:#f5f6f8; }
body.light .footer-tip { color:rgba(0,0,0,0.2); }
body.light .player-wrapper { background:#f5f6f8; }
body.light .now-playing { color:#1a1a2e; }
</style>
