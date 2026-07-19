<template>
  <Teleport to="body">
    <div id="chat-modal" ref="modalRef" :style="{ display: isOpen ? 'flex' : 'none' }" @click="onBackdropClick">
      <div class="chat-modal-content" @click.stop>
        <div class="chat-header">
          <span>💬 热聊区 · 音乐交流</span>
          <button @click="close">&times;</button>
        </div>
        <div class="chat-tags">
          <span v-for="tag in tags" :key="tag.text" class="chat-tag" @click="fillTag(tag.text)">
            {{ tag.label }}
          </span>
        </div>
        <div class="chat-body" id="chat-body">
          <div id="twikoo-container" ref="containerRef"></div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'

const modalRef = ref(null)
const containerRef = ref(null)
const isOpen = ref(false)
let twikooInstance = null
let isInitialized = false

const tags = [
  { label: '🎵 单曲循环', text: '推荐一首最近单曲循环的歌' },
  { label: '🎶 华语新歌', text: '求推荐好听的华语新歌' },
  { label: '🎧 听歌设备', text: '大家用什么设备听歌' },
  { label: '📂 宝藏歌单', text: '求推荐宝藏歌单' },
  { label: '🎤 演唱会', text: '聊聊最近看的演唱会' },
  { label: '🌙 深夜歌单', text: '求推荐适合深夜听的歌' }
]

const open = () => {
  isOpen.value = true
  document.body.style.overflow = 'hidden'
  nextTick(() => {
    setTimeout(initTwikoo, 500)
  })
}

const close = () => {
  isOpen.value = false
  document.body.style.overflow = ''
}

const toggle = () => {
  isOpen.value ? close() : open()
}

const onBackdropClick = (e) => {
  if (e.target === modalRef.value) close()
}

const fillTag = (text) => {
  if (!isOpen.value) open()
  setTimeout(() => {
    const input = document.querySelector('#twikoo-container .tk-input textarea')
    if (input) {
      input.value = '🎵 ' + text + ' \n\n'
      input.focus()
      input.dispatchEvent(new Event('input'))
    }
  }, 800)
}

const initTwikoo = () => {
  if (isInitialized || !containerRef.value) return

  if (typeof twikoo === 'undefined') {
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/twikoo@1.6.39/dist/twikoo.min.js'
    script.onload = () => initTwikoo()
    document.head.appendChild(script)
    return
  }

  try {
    containerRef.value.innerHTML = ''
    twikooInstance = twikoo.init({
      el: containerRef.value,
      envId: 'https://twikoo.hangdn.com',
      region: 'ap-guangzhou'
    })
    isInitialized = true
  } catch (e) {
    console.warn('Twikoo init error:', e)
    containerRef.value.innerHTML = `<div style="padding:40px;text-align:center;color:#666;">评论加载失败</div>`
  }
}

const onKeydown = (e) => {
  if (e.key === 'Escape' && isOpen.value) close()
}

defineExpose({ open, close, toggle })

onMounted(() => {
  document.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown)
})
</script>

<style scoped>
#chat-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999999;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(6px);
  align-items: center;
  justify-content: center;
  animation: chatFadeIn 0.25s ease;
}

.chat-modal-content {
  background: #ffffff;
  border-radius: 16px;
  width: 92%;
  max-width: 640px;
  max-height: 85vh;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  border: 1px solid #e8ecf1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 22px;
  border-bottom: 1px solid #e8ecf1;
  background: #f8f9fa;
  flex-shrink: 0;
}

.chat-header span {
  font-weight: 700;
  color: #1a1a2e;
  font-size: 16px;
}

.chat-header button {
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  font-size: 24px;
  padding: 0 6px;
}

.chat-header button:hover {
  color: #ff4500;
}

.chat-tags {
  padding: 12px 22px 8px 22px;
  border-bottom: 1px solid #eef1f5;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  background: #fafbfc;
  flex-shrink: 0;
}

.chat-tag {
  display: inline-block;
  padding: 4px 14px;
  border-radius: 14px;
  font-size: 12px;
  cursor: pointer;
  font-weight: 500;
  transition: transform 0.2s;
}

.chat-tag:nth-child(1) {
  background: #fff5e6;
  color: #e67e22;
  border: 1px solid #fde8d0;
}
.chat-tag:nth-child(2) {
  background: #e8f4fd;
  color: #2980b9;
  border: 1px solid #d4e8f5;
}
.chat-tag:nth-child(3) {
  background: #e8f8ed;
  color: #27ae60;
  border: 1px solid #d0f0dc;
}
.chat-tag:nth-child(4) {
  background: #fef9e7;
  color: #d4a017;
  border: 1px solid #fcf3d0;
}
.chat-tag:nth-child(5) {
  background: #fde8ef;
  color: #c0392b;
  border: 1px solid #fad0db;
}
.chat-tag:nth-child(6) {
  background: #ede7f6;
  color: #7b1fa2;
  border: 1px solid #ddd0eb;
}

.chat-tag:hover {
  transform: scale(1.04);
}

.chat-body {
  padding: 16px 22px 22px 22px;
  flex: 1;
  overflow-y: auto;
  max-height: calc(85vh - 150px);
  background: #ffffff;
}

@keyframes chatFadeIn {
  from {
    opacity: 0;
    transform: scale(0.96);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* ===== 直接暴力覆盖 Twikoo 所有文字 ===== */
:deep(#twikoo-container) {
  color: #1a1a2e !important;
}

:deep(#twikoo-container .tk-input) {
  color: #1a1a2e !important;
}

:deep(#twikoo-container .tk-input::placeholder) {
  color: #aaa !important;
}

:deep(#twikoo-container textarea) {
  color: #1a1a2e !important;
}

:deep(#twikoo-container input) {
  color: #1a1a2e !important;
}

:deep(#twikoo-container input::placeholder) {
  color: #aaa !important;
}

:deep(#twikoo-container label) {
  color: #1a1a2e !important;
}

:deep(#twikoo-container .tk-label) {
  color: #1a1a2e !important;
}

:deep(#twikoo-container .tk-nick) {
  color: #1a1a2e !important;
}

:deep(#twikoo-container .tk-content) {
  color: #1a1a2e !important;
}

:deep(#twikoo-container .tk-time) {
  color: #999 !important;
}

:deep(#twikoo-container .tk-comment) {
  background: #f5f6f8 !important;
  border-radius: 10px !important;
  padding: 14px 18px !important;
  margin-bottom: 12px !important;
  border: 1px solid #e8ecf1 !important;
}

:deep(#twikoo-container .tk-comment .tk-nick) {
  color: #1a1a2e !important;
  font-weight: 700 !important;
}

:deep(#twikoo-container .tk-comment .tk-content) {
  color: #1a1a2e !important;
  line-height: 1.8 !important;
}

:deep(#twikoo-container .tk-comment .tk-time) {
  color: #999 !important;
}

:deep(#twikoo-container .tk-submit) {
  background: #f5f6f8 !important;
  border-radius: 10px !important;
  padding: 16px !important;
  border: 1px solid #e8ecf1 !important;
}

:deep(#twikoo-container .tk-submit .tk-input) {
  background: #ffffff !important;
  color: #1a1a2e !important;
  border: 1px solid #d5dbe3 !important;
  border-radius: 8px !important;
  padding: 10px 14px !important;
}

:deep(#twikoo-container .tk-submit .tk-input:focus) {
  border-color: #ff8c00 !important;
}

:deep(#twikoo-container .tk-submit .tk-btn) {
  background: linear-gradient(135deg, #ff8c00, #ff4500) !important;
  color: #ffffff !important;
  border: none !important;
  border-radius: 8px !important;
  padding: 8px 24px !important;
  font-weight: 600 !important;
  cursor: pointer !important;
}

:deep(#twikoo-container .tk-submit .tk-btn:hover) {
  transform: scale(1.03) !important;
}

:deep(#twikoo-container .tk-reply .tk-input) {
  background: #ffffff !important;
  color: #1a1a2e !important;
  border: 1px solid #d5dbe3 !important;
  border-radius: 6px !important;
}

:deep(#twikoo-container .tk-reply .tk-btn) {
  background: linear-gradient(135deg, #ff8c00, #ff4500) !important;
  color: #ffffff !important;
  border: none !important;
  border-radius: 6px !important;
  padding: 6px 16px !important;
  cursor: pointer !important;
}

:deep(#twikoo-container .tk-count) {
  color: #888 !important;
}

:deep(#twikoo-container .tk-more) {
  color: #2563eb !important;
  cursor: pointer !important;
}

:deep(#twikoo-container .tk-pinned) {
  background: #fff8e1 !important;
  color: #1a1a2e !important;
}

:deep(#twikoo-container .tk-owner) {
  background: #e3f2fd !important;
  color: #1a1a2e !important;
}

:deep(#twikoo-container .tk-actions) {
  color: #1a1a2e !important;
}

:deep(#twikoo-container .tk-like) {
  color: #1a1a2e !important;
}

:deep(#twikoo-container .tk-dislike) {
  color: #1a1a2e !important;
}
</style>
