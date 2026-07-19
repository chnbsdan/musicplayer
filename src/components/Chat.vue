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
        <div class="chat-body">
          <div id="twikoo-container" ref="containerRef">
            <div style="text-align:center;padding:40px 0;color:#666;">
              <span style="font-size:24px;">💬</span>
              <p style="margin-top:12px;">加载评论中...</p>
            </div>
          </div>
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
  console.log('🔥 热聊区打开')
  isOpen.value = true
  document.body.style.overflow = 'hidden'
  nextTick(() => {
    setTimeout(() => {
      initTwikoo()
    }, 500)
  })
}

const close = () => {
  console.log('🔥 热聊区关闭')
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
    } else {
      setTimeout(() => {
        const input2 = document.querySelector('#twikoo-container .tk-input textarea')
        if (input2) {
          input2.value = '🎵 ' + text + ' \n\n'
          input2.focus()
          input2.dispatchEvent(new Event('input'))
        }
      }, 1000)
    }
  }, 600)
}

const initTwikoo = () => {
  if (isInitialized) return
  if (!containerRef.value) return

  if (typeof twikoo === 'undefined') {
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/twikoo@1.6.39/dist/twikoo.min.js'
    script.onload = () => {
      initTwikoo()
    }
    script.onerror = () => {
      containerRef.value.innerHTML = `
        <div style="text-align:center;padding:40px 20px;color:#666;">
          <span style="font-size:32px;">😅</span>
          <p style="margin-top:12px;">评论服务加载失败</p>
          <button onclick="location.reload()" style="margin-top:16px;padding:8px 24px;border-radius:8px;border:1px solid #ddd;background:#f5f5f5;color:#333;cursor:pointer;">刷新重试</button>
        </div>
      `
    }
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
    console.log('✅ Twikoo 初始化成功')
  } catch (e) {
    containerRef.value.innerHTML = `
      <div style="text-align:center;padding:40px 20px;color:#666;">
        <span style="font-size:32px;">😅</span>
        <p style="margin-top:12px;">评论加载失败: ${e.message}</p>
        <button onclick="location.reload()" style="margin-top:16px;padding:8px 24px;border-radius:8px;border:1px solid #ddd;background:#f5f5f5;color:#333;cursor:pointer;">刷新重试</button>
      </div>
    `
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
/* ===== 弹窗遮罩 ===== */
#chat-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999999;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  align-items: center;
  justify-content: center;
  animation: chatFadeIn 0.25s ease;
}

/* ===== 弹窗内容 ===== */
.chat-modal-content {
  background: #ffffff;
  border-radius: 16px;
  width: 92%;
  max-width: 640px;
  max-height: 85vh;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  border: 1px solid #e8ecf1;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
}

/* ===== 标题栏 ===== */
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
  transition: all 0.3s;
  padding: 0 6px;
  line-height: 1;
}

.chat-header button:hover {
  color: #ff4500;
}

/* ===== 话题标签 ===== */
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
  transition: all 0.2s;
  user-select: none;
  font-weight: 500;
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

/* ===== 评论主体 ===== */
.chat-body {
  padding: 16px 22px 22px 22px;
  flex: 1;
  overflow-y: auto;
  max-height: calc(85vh - 150px);
  background: #ffffff;
}

/* ===== 动画 ===== */
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

/* ===== Twikoo 样式覆盖 - 全部黑色文字 ===== */
:deep(#twikoo-container) {
  color: #1a1a2e !important;
  font-family: inherit !important;
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
  font-size: 14px !important;
}

:deep(#twikoo-container .tk-comment .tk-content) {
  color: #1a1a2e !important;
  line-height: 1.8 !important;
  font-size: 14px !important;
}

:deep(#twikoo-container .tk-comment .tk-time) {
  color: #999 !important;
  font-size: 12px !important;
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
  font-size: 14px !important;
}

:deep(#twikoo-container .tk-submit .tk-input::placeholder) {
  color: #aaa !important;
}

:deep(#twikoo-container .tk-submit .tk-input:focus) {
  border-color: #ff8c00 !important;
  box-shadow: 0 0 0 3px rgba(255, 140, 0, 0.12) !important;
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
  box-shadow: 0 4px 20px rgba(255, 140, 0, 0.3) !important;
}

:deep(#twikoo-container .tk-count) {
  color: #888 !important;
}

:deep(#twikoo-container .tk-reply) {
  color: #1a1a2e !important;
}

:deep(#twikoo-container .tk-reply .tk-input) {
  background: #ffffff !important;
  color: #1a1a2e !important;
  border: 1px solid #d5dbe3 !important;
}

:deep(#twikoo-container .tk-reply .tk-btn) {
  background: linear-gradient(135deg, #ff8c00, #ff4500) !important;
  color: #ffffff !important;
  border: none !important;
  border-radius: 6px !important;
  padding: 6px 16px !important;
  cursor: pointer !important;
}
</style>
