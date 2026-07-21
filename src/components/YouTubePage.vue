<template>
  <div v-if="visible" class="page-overlay" @click="close">
    <div class="page-content" @click.stop>
      <div class="page-header">
        <span class="page-title"><i class="fab fa-youtube" style="color:#ff0000;"></i> YouTube</span>
        <button class="page-close" @click="close">&times;</button>
      </div>
      <div class="page-body">
        <!-- 播放器 -->
        <div v-if="currentVideo" class="player-wrapper">
          <iframe
            :src="getEmbedUrl(currentVideo.url)"
            class="video-iframe"
            allowfullscreen
            loading="lazy"
          ></iframe>
          <div class="now-playing">
            <span class="playing-icon">▶</span>
            {{ currentVideo.title }}
          </div>
        </div>
        <div v-else class="placeholder">
          <span>▶️</span>
          <p>请选择视频</p>
        </div>

        <!-- ===== 视频卡片网格 ===== -->
        <div class="video-grid">
          <div
            v-for="item in videoItems"
            :key="item.id"
            class="video-card"
            :class="{ active: currentVideo && currentVideo.id === item.id }"
            @click="playVideo(item)"
          >
            <div class="video-card-left">
              <span class="video-card-number">{{ String(item.id).padStart(2, '0') }}</span>
              <span class="video-card-title">{{ item.title }}</span>
            </div>
            <div class="video-card-right">
              <span class="video-card-badge">YouTube</span>
              <span class="video-card-play">▶</span>
            </div>
          </div>
        </div>

        <div class="footer-tip">💡 点击视频卡片即可播放</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({ visible: Boolean })
const emit = defineEmits(['close'])

const currentVideo = ref(null)

// ============================================================
// 🔥 你的 YouTube 视频列表
// ============================================================
const videoItems = [
  { id: 1, title: '示例视频 1', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
  { id: 2, title: '示例视频 2', url: 'https://www.youtube.com/watch?v=9bZkp7q19f0' },
  // 添加更多...
]

const getEmbedUrl = (url) => {
  let videoId = ''
  let match = url.match(/[?&]v=([^&]+)/)
  if (match) { videoId = match[1] }
  match = url.match(/youtu\.be\/([^?&]+)/)
  if (match) { videoId = match[1] }
  return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0` : url
}

const playVideo = (item) => {
  currentVideo.value = item
}

const close = () => {
  currentVideo.value = null
  emit('close')
}

watch(() => props.visible, (val) => {
  if (val && videoItems.length > 0) {
    currentVideo.value = videoItems[0]
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
  padding: 16px 20px 12px;
  overflow-y: auto;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.player-wrapper {
  background: #000;
  border-radius: 12px;
  overflow: hidden;
  aspect-ratio: 16/9;
  position: relative;
  flex-shrink: 0;
}
.video-iframe { width: 100%; height: 100%; border: none; }
.now-playing {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  padding: 8px 16px;
  background: linear-gradient(transparent, rgba(0,0,0,0.8));
  color: #fff;
  font-size: 13px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
}
.playing-icon { color: #ff8c00; font-size: 12px; }

.placeholder {
  background: #1a1a2e;
  border-radius: 12px;
  aspect-ratio: 16/9;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary, rgba(255,255,255,0.3));
}
.placeholder span { font-size: 48px; margin-bottom: 12px; }

/* ===== 视频卡片网格 ===== */
.video-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  max-height: 200px;
  overflow-y: auto;
  padding-right: 4px;
  flex-shrink: 0;
}

.video-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  background: var(--bg-card, rgba(255,255,255,0.04));
  border: 1px solid transparent;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  gap: 10px;
}

.video-card:hover {
  background: rgba(255,255,255,0.06);
  border-color: rgba(255,255,255,0.08);
  transform: translateY(-1px);
}

.video-card.active {
  background: rgba(255,140,0,0.12);
  border-color: rgba(255,140,0,0.3);
  box-shadow: 0 0 20px rgba(255,140,0,0.05);
}

.video-card-left {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  min-width: 0;
}

.video-card-number {
  font-size: 11px;
  font-weight: 700;
  color: var(--text-secondary, rgba(255,255,255,0.25));
  min-width: 24px;
  font-variant-numeric: tabular-nums;
}

.video-card-title {
  font-size: 13px;
  color: var(--text-primary, #fff);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 500;
}

.video-card.active .video-card-title {
  color: #ff8c00;
}

.video-card-right {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.video-card-badge {
  font-size: 9px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 10px;
  background: rgba(255,0,0,0.12);
  color: #ff0000;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.video-card.active .video-card-badge {
  background: rgba(255,140,0,0.15);
  color: #ff8c00;
}

.video-card-play {
  font-size: 10px;
  color: var(--text-secondary, rgba(255,255,255,0.15));
  transition: all 0.2s;
}

.video-card:hover .video-card-play {
  color: #ff8c00;
}
.video-card.active .video-card-play {
  color: #ff8c00;
}

.footer-tip {
  text-align: center;
  padding: 6px 0 2px;
  color: var(--text-secondary, rgba(255,255,255,0.12));
  font-size: 12px;
  border-top: 1px solid var(--border-color, rgba(255,255,255,0.03));
  flex-shrink: 0;
}

@keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
@keyframes scaleIn { from { opacity:0; transform:scale(0.96); } to { opacity:1; transform:scale(1); } }

.video-grid::-webkit-scrollbar { width: 3px; }
.video-grid::-webkit-scrollbar-track { background: transparent; }
.video-grid::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }

/* ===== 浅色模式 ===== */
body.light .page-content { background:#fff; border-color:rgba(0,0,0,0.06); }
body.light .page-title { color:#1a1a2e; }
body.light .video-card { background:#f5f6f8; }
body.light .video-card:hover { background:#eef0f3; border-color:rgba(0,0,0,0.06); }
body.light .video-card-title { color:#1a1a2e; }
body.light .video-card.active { background:rgba(255,140,0,0.08); border-color:rgba(255,140,0,0.2); }
body.light .video-card-number { color:rgba(0,0,0,0.2); }
body.light .video-card-badge { background:rgba(255,0,0,0.08); color:#cc0000; }
body.light .video-card.active .video-card-badge { background:rgba(255,140,0,0.1); color:#e67e22; }
body.light .placeholder { background:#f5f6f8; }
body.light .footer-tip { color:rgba(0,0,0,0.12); }
</style>
