<template>
  <div id="chat-modal" ref="modalRef" @click="onBackdropClick">
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
        <div id="twikoo-container" ref="containerRef">
          <div style="text-align:center;padding:40px 0;color:var(--text-secondary);">
            <span style="font-size:24px;">💬</span>
            <p style="margin-top:12px;">加载评论中...</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'

const modalRef = ref(null)
const containerRef = ref(null)
const isOpen = ref(false)
let twikooInstance = null
let isTwikooLoaded = false

const tags = [
  { label: '🎵 单曲循环', text: '推荐一首最近单曲循环的歌' },
  { label: '🎶 华语新歌', text: '求推荐好听的华语新歌' },
  { label: '🎧 听歌设备', text: '大家用什么设备听歌' },
  { label: '📂 宝藏歌单', text: '求推荐宝藏歌单' },
  { label: '🎤 演唱会', text: '聊聊最近看的演唱会' },
  { label: '🌙 深夜歌单', text: '求推荐适合深夜听的歌' }
]

// ===== 打开弹窗 =====
const open = () => {
  if (isOpen.value) return
  isOpen.value = true
  modalRef.value.style.display = 'flex'
  document.body.style.overflow = 'hidden'
  
  // 延迟初始化 Twikoo，确保 DOM 渲染完成
  nextTick(() => {
    setTimeout(() => {
      initTwikoo()
    }, 500)
  })
}

// ===== 关闭弹窗 =====
const close = () => {
  if (!isOpen.value) return
  isOpen.value = false
  modalRef.value.style.display = 'none'
  document.body.style.overflow = ''
}

const toggle = () => {
  isOpen.value ? close() : open()
}

// ===== 点击背景关闭 =====
const onBackdropClick = (e) => {
  if (e.target === modalRef.value) close()
}

// ===== 点击话题标签 =====
const fillTag = (text) => {
  open()
  setTimeout(() => {
    const input = document.querySelector('#twikoo-container .tk-input textarea')
    if (input) {
      input.value = '🎵 ' + text + ' \n\n'
      input.focus()
      input.dispatchEvent(new Event('input'))
    } else {
      // 如果输入框还没加载，再等一会儿
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

// ===== 初始化 Twikoo =====
const initTwikoo = () => {
  if (isTwikooLoaded || typeof twikoo === 'undefined') {
    if (typeof twikoo === 'undefined') {
      console.warn('Twikoo 库未加载')
      return
    }
    return
  }
  
  if (!containerRef.value) {
    console.warn('Twikoo 容器不存在')
    return
  }

  try {
    isTwikooLoaded = true
    twikooInstance = twikoo.init({
      el: containerRef.value,
      envId: 'https://twikoo.hangdn.com',
      region: 'ap-guangzhou'
    })
    console.log('✅ Twikoo 初始化成功')
  } catch (e) {
    console.warn('Twikoo 初始化失败:', e)
    isTwikooLoaded = false
    // 显示错误信息
    if (containerRef.value) {
      containerRef.value.innerHTML = `
        <div style="text-align:center;padding:40px 20px;color:var(--text-secondary);">
          <span style="font-size:32px;">😅</span>
          <p style="margin-top:12px;">评论加载失败，请刷新重试</p>
          <button onclick="location.reload()" style="margin-top:12px;padding:8px 24px;border-radius:8px;border:1px solid var(--border-color);background:var(--bg-card);color:var(--text-primary);cursor:pointer;">刷新</button>
        </div>
      `
    }
  }
}

// ===== 键盘关闭 =====
const onKeydown = (e) => {
  if (e.key === 'Escape' && isOpen.value) close()
}

// ===== 暴露方法 =====
defineExpose({ open, close, toggle })

// ===== 生命周期 =====
onMounted(() => {
  document.addEventListener('keydown', onKeydown)
  // 预加载 Twikoo 库
  if (typeof twikoo !== 'undefined') {
    isTwikooLoaded = true
  }
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown)
})
</script>
