<template>
  <div v-if="visible" class="page-overlay" @click="close">
    <div class="page-content" @click.stop>
      <div class="page-header">
        <span class="page-title"><i class="fab fa-youtube" style="color:#ff0000;"></i> YouTube</span>
        <button class="page-close" @click="close">&times;</button>
      </div>
      <div class="page-body">
        <!-- 视频播放器 -->
        <div v-if="currentVideo" class="player-wrapper">
          <iframe
            :src="getEmbedUrl(currentVideo.url)"
            class="video-iframe"
            allowfullscreen
            loading="lazy"
          ></iframe>
          <div class="now-playing">{{ currentVideo.title }}</div>
        </div>
        <div v-else class="placeholder">
          <span>▶️</span>
          <p>请选择视频</p>
        </div>

        <!-- 视频列表 + 下载按钮 -->
        <div class="item-list">
          <div
            v-for="item in videoItems"
            :key="item.id"
            class="item"
            :class="{ active: currentVideo && currentVideo.id === item.id }"
          >
            <span class="item-icon"><i class="fab fa-youtube"></i></span>
            <span class="item-title" @click="playVideo(item)">{{ item.title }}</span>
            <button 
              class="item-download" 
              @click="downloadVideo(item.url)" 
              :disabled="isDownloading"
              :title="isDownloading ? '获取下载链接中...' : '下载视频'"
            >
              <i v-if="!isDownloading" class="fas fa-download"></i>
              <span v-else class="loading-spinner-small"></span>
            </button>
            <span class="item-play" @click="playVideo(item)">▶</span>
          </div>
        </div>

        <div class="footer-tip">💡 点击下载按钮，跳转到 y2mate 选择画质下载</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({ visible: Boolean })
const emit = defineEmits(['close'])

const currentVideo = ref(null)
const isDownloading = ref(false)

// ============================================================
// 🔥 你的 YouTube 视频列表
// ============================================================
const videoItems = [
  { id: 1, title: '示例视频 1', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
  { id: 2, title: '示例视频 2', url: 'https://www.youtube.com/watch?v=9bZkp7q19f0' },
  // 添加更多...
]

// ============================================================
// 🔥 API 地址（改成你自己的 Vercel 域名）
// ============================================================
const API_BASE_URL = 'https://youtube-download-api-nine.vercel.app/api/download';

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

// ===== 下载功能 =====
const downloadVideo = async (url) => {
  if (isDownloading.value) return
  isDownloading.value = true

  try {
    const response = await fetch(`${API_BASE_URL}?url=${encodeURIComponent(url)}`)
    const data = await response.json()

    if (data.success && data.downloadUrl) {
      // 跳转到 y2mate 下载页面
      window.open(data.downloadUrl, '_blank')
    } else {
      alert('获取下载链接失败: ' + (data.error || '未知错误'))
    }
  } catch (error) {
    console.error('下载失败:', error)
    alert('下载失败，请稍后重试')
  } finally {
    isDownloading.value = false
  }
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
  padding: 20px 24px 16px;
  overflow-y: auto;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
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
  background: linear-gradient(transparent, rgba(0,0,0,0.7));
  color: #fff;
  font-size: 14px;
  font-weight: 500;
}

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

.item-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-height: 180px;
  overflow-y: auto;
  flex-shrink: 0;
}

.item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: var(--bg-card, rgba(255,255,255,0.03));
  border: 1px solid transparent;
  border-radius: 8px;
  transition: all 0.2s;
  cursor: default;
}

.item:hover {
  background: rgba(255,255,255,0.04);
}
.item.active {
  background: rgba(255,140,0,0.12);
  border-color: #ff8c00;
}

.item-icon { font-size: 16px; color: #ff0000; width: 28px; text-align: center; }
.item-title {
  flex: 1;
  cursor: pointer;
  font-size: 13px;
  color: var(--text-primary, #fff);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.item-title:hover { color: #ff8c00; }

.item-download {
  background: none;
  border: none;
  color: var(--text-secondary, rgba(255,255,255,0.3));
  cursor: pointer;
  padding: 4px 8px;
  font-size: 14px;
  transition: all 0.2s;
  border-radius: 4px;
  min-width: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.item-download:hover:not(:disabled) {
  color: #00c853;
  background: rgba(0, 200, 83, 0.1);
}
.item-download:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.item-play {
  font-size: 11px;
  color: var(--text-secondary, rgba(255,255,255,0.25));
  cursor: pointer;
  padding: 4px 8px;
  transition: color 0.2s;
}
.item:hover .item-play { color: #ff8c00; }
.item.active .item-play { color: #ff8c00; }

.loading-spinner-small {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255,255,255,0.1);
  border-top: 2px solid #00c853;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  display: inline-block;
}
@keyframes spin { to { transform: rotate(360deg); } }

.footer-tip {
  text-align: center;
  padding: 6px 0 2px;
  color: var(--text-secondary, rgba(255,255,255,0.15));
  font-size: 12px;
  border-top: 1px solid var(--border-color, rgba(255,255,255,0.03));
  flex-shrink: 0;
}

@keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
@keyframes scaleIn { from { opacity:0; transform:scale(0.96); } to { opacity:1; transform:scale(1); } }

.item-list::-webkit-scrollbar { width: 3px; }
.item-list::-webkit-scrollbar-track { background: transparent; }
.item-list::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }

/* ===== 浅色模式 ===== */
body.light .page-content { background:#fff; border-color:rgba(0,0,0,0.06); }
body.light .page-title { color:#1a1a2e; }
body.light .item { background:#f5f6f8; }
body.light .item-title { color:#1a1a2e; }
body.light .placeholder { background:#f5f6f8; }
body.light .footer-tip { color:rgba(0,0,0,0.15); }
body.light .item-download { color: rgba(0,0,0,0.3); }
body.light .item-download:hover:not(:disabled) { color: #00c853; background: rgba(0, 200, 83, 0.08); }
body.light .loading-spinner-small { border-color: rgba(0,0,0,0.1); border-top-color: #00c853; }
</style>
