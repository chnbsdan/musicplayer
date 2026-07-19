<template>
  <div id="chat-modal" ref="modal" @click="onBackdropClick">
    <div class="chat-modal-content">
      <div class="chat-header">
        <span>💬 热聊区 · 音乐交流</span>
        <button @click="close">&times;</button>
      </div>
      <div class="chat-tags">
        <span v-for="tag in tags" :key="tag.text" class="chat-tag" @click="fillTag(tag.text)">
          {{ tag.label }}
        </span>
      </div>
      <div class="chat-body">
        <div id="twikoo-container" ref="container"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const modal = ref(null)
const container = ref(null)
const isOpen = ref(false)
let twikooInstance = null

const tags = [
  { label: '🎵 单曲循环', text: '推荐一首最近单曲循环的歌' },
  { label: '🎶 华语新歌', text: '求推荐好听的华语新歌' },
  { label: '🎧 听歌设备', text: '大家用什么设备听歌' },
  { label: '📂 宝藏歌单', text: '求推荐宝藏歌单' },
  { label: '🎤 演唱会', text: '聊聊最近看的演唱会' },
  { label: '🌙 深夜歌单', text: '求推荐适合深夜听的歌' }
]

const open = () => {
  if (isOpen.value) return
  isOpen.value = true
  modal.value.style.display = 'flex'
  document.body.style.overflow = 'hidden'
  setTimeout(initTwikoo, 300)
}

const close = () => {
  if (!isOpen.value) return
  isOpen.value = false
  modal.value.style.display = 'none'
  document.body.style.overflow = ''
}

const onBackdropClick = (e) => {
  if (e.target === modal.value) close()
}

const fillTag = (text) => {
  open()
  setTimeout(() => {
    const input = document.querySelector('#twikoo-container .tk-input textarea')
    if (input) {
      input.value = '🎵 ' + text + ' \n\n'
      input.focus()
      input.dispatchEvent(new Event('input'))
    }
  }, 500)
}

const initTwikoo = () => {
  if (twikooInstance || typeof twikoo === 'undefined') return
  try {
    twikooInstance = twikoo.init({
      el: container.value,
      envId: 'https://twikoo.hangdn.com',
      region: 'ap-guangzhou'
    })
  } catch (e) {
    console.warn('Twikoo 初始化失败:', e)
  }
}

// 键盘关闭
const onKeydown = (e) => {
  if (e.key === 'Escape' && isOpen.value) close()
}

// 暴露给父组件
defineExpose({ open, close, toggle: () => isOpen.value ? close() : open() })

onMounted(() => {
  document.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown)
})
</script>

<style scoped>
#chat-modal {
  display: none;
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
  animation: fadeIn 0.25s ease;
}

#chat-modal .chat-modal-content {
  background: #ffffff;
  border-radius: var(--radius);
  width: 92%;
  max-width: 640px;
  max-height: 85vh;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(0, 0, 0, 0.06);
  overflow: hidden;
  position: relative;
}

:deep(.app:not(.light)) #chat-modal .chat-modal-content {
  background: #1a1a2e;
  border-color: rgba(255, 255, 255, 0.08);
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 22px;
  border-bottom: 1px solid #e8ecf1;
  background: #f8f9fa;
}

:deep(.app:not(.light)) .chat-header {
  background: rgba(255, 255, 255, 0.03);
  border-bottom-color: rgba(255, 255, 255, 0.06);
}

.chat-header span {
  font-weight: 700;
  color: #1a1a2e;
  font-size: 16px;
}

:deep(.app:not(.light)) .chat-header span {
  color: #e8eaf6;
}

.chat-header button {
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  font-size: 24px;
  transition: all 0.3s;
  padding: 0 6px;
  line-height: 1;
}

.chat-header button:hover {
  color: #ff4500;
}

:deep(.app:not(.light)) .chat-header button {
  color: rgba(255, 255, 255, 0.4);
}

.chat-tags {
  padding: 12px 22px 8px 22px;
  border-bottom: 1px solid #eef1f5;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  background: #fafbfc;
}

:deep(.app:not(.light)) .chat-tags {
  background: rgba(255, 255, 255, 0.02);
  border-bottom-color: rgba(255, 255, 255, 0.04);
}

.chat-tag {
  display: inline-block;
  padding: 3px 14px;
  border-radius: 14px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
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

.chat-tag:nth-child(1):hover {
  background: #fde8d0;
}
.chat-tag:nth-child(2):hover {
  background: #d4e8f5;
}
.chat-tag:nth-child(3):hover {
  background: #d0f0dc;
}
.chat-tag:nth-child(4):hover {
  background: #fcf3d0;
}
.chat-tag:nth-child(5):hover {
  background: #fad0db;
}
.chat-tag:nth-child(6):hover {
  background: #ddd0eb;
}

:deep(.app:not(.light)) .chat-tag {
  background: rgba(255, 255, 255, 0.06);
  color: #e8eaf6;
  border-color: rgba(255, 255, 255, 0.08);
}

:deep(.app:not(.light)) .chat-tag:hover {
  background: rgba(255, 255, 255, 0.15);
}

.chat-body {
  padding: 16px 22px 22px 22px;
  max-height: calc(85vh - 150px);
  overflow-y: auto;
  background: #ffffff;
}

:deep(.app:not(.light)) .chat-body {
  background: transparent;
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.96); }
  to { opacity: 1; transform: scale(1); }
}
</style>
