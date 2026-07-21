<template>
  <div class="nav-menu-wrapper">
    <button class="nav-menu-btn" @click="toggleMenu" title="导航菜单">
      <span class="menu-icon">☰</span>
    </button>

    <div v-show="isOpen" class="nav-dropdown" @click.stop>
      <div class="nav-item" @click="openPage('video')">
        <span class="nav-icon">▶</span> 在线视频
      </div>
      <div class="nav-item" @click="openPage('music')">
        <span class="nav-icon">♪</span> 在线音乐
      </div>
      <div class="nav-item" @click="openPage('search')">
        <span class="nav-icon"><i class="fas fa-search"></i></span> 音乐搜索
      </div>
      <div class="nav-item" @click="openPage('download')">
        <span class="nav-icon"><i class="fas fa-download" style="color:#4facfe;"></i></span> 音乐下载
      </div>
      <div class="nav-item" @click="openPage('youtube')">
        <span class="nav-icon"><i class="fab fa-youtube"></i></span> YouTube
      </div>
      <div class="nav-item" @click="openPage('bilibili')">
        <span class="nav-icon"><i class="fab fa-bilibili"></i></span> Bilibili
      </div>
      <div class="nav-item" @click="openPage('links')">
        <span class="nav-icon">🔗</span> 影音友链
      </div>
    </div>

    <!-- 页面组件 -->
    <VideoPage :visible="pageVisible && pageType === 'video'" @close="pageVisible = false" />
    <MusicPage :visible="pageVisible && pageType === 'music'" @close="pageVisible = false" />
    <MusicSearchPage :visible="pageVisible && pageType === 'search'" @close="pageVisible = false" />
    <MusicDownloadPage :visible="pageVisible && pageType === 'download'" @close="pageVisible = false" />
    <YouTubePage :visible="pageVisible && pageType === 'youtube'" @close="pageVisible = false" />
    <BilibiliPage :visible="pageVisible && pageType === 'bilibili'" @close="pageVisible = false" />
    <LinksPage :visible="pageVisible && pageType === 'links'" @close="pageVisible = false" />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import VideoPage from './VideoPage.vue'
import MusicPage from './MusicPage.vue'
import MusicSearchPage from './MusicSearchPage.vue'
import MusicDownloadPage from './MusicDownloadPage.vue'
import YouTubePage from './YouTubePage.vue'
import BilibiliPage from './BilibiliPage.vue'
import LinksPage from './LinksPage.vue'

const isOpen = ref(false)
const pageVisible = ref(false)
const pageType = ref('video')

const toggleMenu = () => { isOpen.value = !isOpen.value }

const openPage = (type) => {
  isOpen.value = false
  pageType.value = type
  pageVisible.value = true
}

const handleClickOutside = (e) => {
  const wrapper = document.querySelector('.nav-menu-wrapper')
  if (wrapper && !wrapper.contains(e.target)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* 样式和之前一样，保持不变 */
.nav-menu-wrapper {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 50000;
}

.nav-menu-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid var(--border-color, rgba(255, 255, 255, 0.15));
  background: var(--btn-bg, rgba(255, 255, 255, 0.10));
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  color: var(--text-primary, #fff);
  font-size: 22px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.nav-menu-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.05);
}

.nav-menu-btn .menu-icon {
  line-height: 1;
  margin-top: -2px;
}

.nav-dropdown {
  position: absolute;
  top: 54px;
  left: 0;
  min-width: 160px;
  background: var(--dropdown-bg, rgba(20, 20, 40, 0.92));
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--border-color, rgba(255, 255, 255, 0.08));
  border-radius: 12px;
  padding: 6px 0;
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.4);
  animation: dropDown 0.2s ease;
}

@keyframes dropDown {
  from {
    opacity: 0;
    transform: translateY(-8px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.nav-item {
  padding: 10px 18px;
  cursor: pointer;
  color: var(--text-secondary, rgba(255, 255, 255, 0.8));
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.15s ease;
  border-radius: 6px;
  margin: 0 4px;
}

.nav-item:hover {
  background: rgba(255, 140, 0, 0.15);
  color: #ff8c00;
}

.nav-item .nav-icon {
  font-size: 14px;
  width: 24px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-item .nav-icon i {
  font-size: 16px;
}

/* 浅色模式 */
body.light .nav-menu-btn {
  background: rgba(0, 0, 0, 0.06);
  border-color: rgba(0, 0, 0, 0.08);
  color: #1a1a2e;
}

body.light .nav-menu-btn:hover {
  background: rgba(0, 0, 0, 0.12);
}

body.light .nav-dropdown {
  background: rgba(255, 255, 255, 0.92);
  border-color: rgba(0, 0, 0, 0.08);
}

body.light .nav-item {
  color: rgba(0, 0, 0, 0.7);
}

body.light .nav-item:hover {
  background: rgba(255, 140, 0, 0.12);
  color: #e67e22;
}
</style>
