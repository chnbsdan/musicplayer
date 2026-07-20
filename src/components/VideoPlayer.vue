<template>
  <div v-if="visible" class="page-overlay" @click="close">
    <div class="page-content" @click.stop>
      <!-- 头部 -->
      <div class="page-header">
        <span class="page-title">
          <i v-if="icon" :class="icon" :style="{ color: iconColor }"></i>
          {{ title }}
        </span>
        <button class="page-close" @click="close">&times;</button>
      </div>

      <div class="page-body">
        <!-- 加载状态 -->
        <div v-if="loading" class="loading-state">
          <span class="loading-spinner"></span>
          <p>加载中...</p>
        </div>

        <!-- 播放器 -->
        <div v-else-if="currentItem" class="player-wrapper">
          <template v-if="type === 'video'">
            <video :src="currentItem.url" controls autoplay class="video-player"></video>
          </template>
          <template v-else-if="type === 'youtube'">
            <iframe
              :src="getYoutubeEmbedUrl(currentItem.url)"
              class="video-iframe"
              allowfullscreen
              loading="lazy"
            ></iframe>
          </template>
          <template v-else-if="type === 'bilibili'">
            <iframe
              :src="getBilibiliEmbedUrl(currentItem.url)"
              class="video-iframe"
              allowfullscreen
              loading="lazy"
            ></iframe>
          </template>
          <div class="now-playing">{{ currentItem.title }}</div>
        </div>

        <!-- 空状态 -->
        <div v-else class="placeholder">
          <span>▶️</span>
          <p>请选择视频</p>
        </div>

        <!-- 分组列表 -->
        <div class="item-list">
          <template v-for="(group, groupName) in groupedItems" :key="groupName">
            <div v-if="group.length > 0" class="group-label">{{ groupName }}</div>
            <div
              v-for="item in group"
              :key="item.id"
              class="item"
              :class="{ active: currentItem && currentItem.id === item.id }"
              @click="playItem(item)"
            >
              <span class="item-icon">{{ type === 'youtube' ? '▶️' : type === 'bilibili' ? '📺' : '🎬' }}</span>
              <span class="item-title">{{ item.title }}</span>
              <span class="item-play">▶</span>
            </div>
          </template>
        </div>

        <div class="footer-tip">💡 在对应的配置文件中增删改</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  visible: Boolean,
  items: { type: Array, default: () => [] },
  title: { type: String, default: '视频' },
  type: { type: String, default: 'video' }, // 'video' | 'youtube' | 'bilibili'
  icon: { type: String, default: '' },
  iconColor: { type: String, default: '' }
})

const emit = defineEmits(['close'])

const currentItem = ref(null)
const loading = ref(false)

// 按分组整理
const groupedItems = computed(() => {
  const groups = {}
  props.items.forEach(item => {
    const group = item.group || '默认'
    if (!groups[group]) groups[group] = []
    groups[group].push(item)
  })
  return groups
})

// 播放
const playItem = (item) => {
  loading.value = true
  currentItem.value = item
  setTimeout(() => { loading.value = false }, 300)
}

// 关闭
const close = () => {
  currentItem.value = null
  emit('close')
}

// YouTube 嵌入 URL
const getYoutubeEmbedUrl = (url) => {
  let videoId = ''
  let match = url.match(/[?&]v=([^&]+)/)
  if (match) { videoId = match[1] }
  match = url.match(/youtu\.be\/([^?&]+)/)
  if (match) { videoId = match[1] }
  return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0` : url
}

// Bilibili 嵌入 URL
const getBilibiliEmbedUrl = (url) => {
  let match = url.match(/\/video\/(BV[^/?]+)/)
  if (match) {
    return `https://player.bilibili.com/player.html?bvid=${match[1]}&autoplay=1&page=1`
  }
  match = url.match(/\/bangumi\/play\/ss(\d+)/)
  if (match) {
    return `https://www.bilibili.com/bangumi/play/ss${match[1]}?autoplay=1`
  }
  match = url.match(/\/bangumi\/play\/ep(\d+)/)
  if (match) {
    return `https://www.bilibili.com/bangumi/play/ep${match[1]}?autoplay=1`
  }
  return url
}

watch(() => props.visible, (val) => {
  if (val && props.items.length > 0) {
    currentItem.value = props.items[0]
  }
}, { immediate: true })
</script>

<style scoped>
/* ===== 遮罩 ===== */
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

/* ===== 内容 ===== */
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

/* ===== 头部 ===== */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 24px;
  border-bottom: 1px solid var(--border-color, rgba(255,255,255,0.06));
  flex-shrink: 0;
}
.page-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary, #fff);
  display: flex;
  align-items: center;
  gap: 8px;
}
.page-close {
  background: none; border: none;
  color: var(--text-secondary, rgba(255,255,255,0.5));
  font-size: 28px; cursor: pointer;
  transition: all 0.3s;
}
.page-close:hover { color: #ff4500; transform: rotate(90deg); }

/* ===== 主体 ===== */
.page-body {
  padding: 20px 24px 16px;
  overflow-y: auto;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* ===== 加载状态 ===== */
.loading-state {
  background: #1a1a2e;
  border-radius: 12px;
  aspect-ratio: 16/9;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary, rgba(255,255,255,0.3));
  gap: 12px;
}
.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255,255,255,0.1);
  border-top: 3px solid #ff8c00;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ===== 播放器 ===== */
.player-wrapper {
  background: #000;
  border-radius: 12px;
  overflow: hidden;
  aspect-ratio: 16/9;
  position: relative;
  flex-shrink: 0;
}
.video-player { width: 100%; height: 100%; display: block; }
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

/* ===== 空状态 ===== */
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

/* ===== 分组列表 ===== */
.item-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-height: 180px;
  overflow-y: auto;
  flex-shrink: 0;
}
.group-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary, rgba(255,255,255,0.4));
  padding: 6px 4px 2px 4px;
  border-bottom: 1px solid var(--border-color, rgba(255,255,255,0.04));
  margin-top: 4px;
}
.group-label:first-of-type { margin-top: 0; }

.item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 12px;
  background: var(--bg-card, rgba(255,255,255,0.03));
  border: 1px solid transparent;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}
.item:hover { background: rgba(255,140,0,0.06); border-color: rgba(255,140,0,0.15); }
.item.active { background: rgba(255,140,0,0.12); border-color: #ff8c00; }
.item-icon { font-size: 14px; width: 24px; text-align: center; }
.item-title {
  font-size: 13px;
  color: var(--text-primary, #fff);
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.item-play {
  font-size: 11px;
  color: var(--text-secondary, rgba(255,255,255,0.25));
  transition: color 0.2s;
}
.item:hover .item-play { color: #ff8c00; }
.item.active .item-play { color: #ff8c00; }

/* ===== 底部 ===== */
.footer-tip {
  text-align: center;
  padding: 6px 0 2px;
  color: var(--text-secondary, rgba(255,255,255,0.15));
  font-size: 12px;
  border-top: 1px solid var(--border-color, rgba(255,255,255,0.03));
  flex-shrink: 0;
}

/* ===== 动画 ===== */
@keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
@keyframes scaleIn { from { opacity:0; transform:scale(0.96); } to { opacity:1; transform:scale(1); } }

/* ===== 滚动条 ===== */
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
body.light .loading-state { background:#f5f6f8; }
body.light .loading-spinner { border-color: rgba(0,0,0,0.1); border-top-color: #ff8c00; }
body.light .group-label { color: rgba(0,0,0,0.3); }
</style>
