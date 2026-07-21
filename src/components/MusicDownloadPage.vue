<template>
  <div v-if="visible" class="page-overlay" @click="close">
    <div class="page-content" @click.stop>
      <!-- 头部 -->
      <div class="page-header">
        <span class="page-title"><i class="fas fa-download" style="color:#4facfe;"></i> 音乐下载</span>
        <button class="page-close" @click="close"><i class="fas fa-times"></i></button>
      </div>

      <div class="page-body">
        <!-- 搜索框 -->
        <div class="search-box" @click.stop>
          <input
            type="text"
            id="searchInput"
            placeholder="输入歌手或歌曲名..."
            v-model="keyword"
            @keydown.enter="searchMusic"
          />
          <button @click.stop="searchMusic">
            <i class="fas fa-search"></i> 搜索
          </button>
        </div>

        <!-- 统计信息 -->
        <div class="stats-bar" v-if="searchResults.length > 0">
          <i class="fas fa-music" style="color:#4facfe;"></i>
          找到 {{ searchResults.length }} 首歌曲
        </div>

        <!-- 搜索结果列表 -->
        <div class="result-list" v-if="searchResults.length > 0" @click.stop>
          <div
            v-for="(item, index) in searchResults"
            :key="index"
            class="result-item"
            :class="{ 'is-playing': item.isPlaying }"
            @click.stop
          >
            <div class="result-info" @click.stop>
              <span class="result-title">{{ item.title }}</span>
              <span class="result-artist"><i class="fas fa-user" style="font-size:10px;color:#aaa;"></i> {{ item.artist }}</span>
            </div>
            <div class="result-actions" @click.stop>
              <button class="btn-play" @click.stop="togglePlay(item)" :title="item.isPlaying ? '暂停' : '试听'">
                <i v-if="item.isPlaying" class="fas fa-pause"></i>
                <i v-else class="fas fa-play"></i>
              </button>
              <button class="btn-download" @click.stop="downloadSong(item)" title="下载">
                <i class="fas fa-download"></i>
              </button>
            </div>
          </div>
        </div>
        <div v-else-if="searched" class="empty-state" @click.stop>
          <i class="fas fa-music" style="font-size:48px;color:#ddd;"></i>
          <p>没有找到相关歌曲</p>
        </div>
        <div v-else class="empty-state" @click.stop>
          <i class="fas fa-search" style="font-size:48px;color:#ddd;"></i>
          <p>输入歌手或歌曲名搜索音乐</p>
        </div>

        <div class="footer-tip" @click.stop>
          <i class="fas fa-circle" style="color:#48bb78; font-size:0.4rem;"></i>
          数据来自 GD Studio API
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({ visible: Boolean })
const emit = defineEmits(['close'])

const GD_API = 'https://music-api.gdstudio.xyz/api.php'

const keyword = ref('周杰伦')
const searchResults = ref([])
const searched = ref(false)
const isDownloading = ref(false)
let audioPlayer = null
let currentPlayingId = ref(null)

const searchMusic = async () => {
  const trimmed = keyword.value.trim()
  if (!trimmed) return

  searched.value = true
  searchResults.value = []

  try {
    const url = `${GD_API}?types=search&source=netease&name=${encodeURIComponent(trimmed)}&count=30`
    const res = await fetch(url)
    const data = await res.json()

    if (Array.isArray(data) && data.length > 0) {
      searchResults.value = data.map(song => ({
        id: song.id || '',
        title: song.name || '未知歌曲',
        artist: Array.isArray(song.artist) ? song.artist.join(' / ') : (song.artist || '未知'),
        source: song.source || 'netease',
        isPlaying: false
      }))
    }
  } catch (e) {
    console.error('搜索失败:', e)
  }
}

const togglePlay = async (item) => {
  if (currentPlayingId.value === item.id) {
    if (audioPlayer) {
      audioPlayer.pause()
      audioPlayer = null
      currentPlayingId.value = null
      searchResults.value.forEach(s => { s.isPlaying = false })
    }
    return
  }

  if (audioPlayer) {
    audioPlayer.pause()
    audioPlayer = null
    searchResults.value.forEach(s => { s.isPlaying = false })
  }

  try {
    const url = `${GD_API}?types=url&source=${item.source || 'netease'}&id=${item.id}&br=128`
    const res = await fetch(url)
    const data = await res.json()
    const songUrl = data.url

    if (songUrl) {
      audioPlayer = new Audio(songUrl)
      audioPlayer.play()
      currentPlayingId.value = item.id
      item.isPlaying = true

      audioPlayer.onended = () => {
        currentPlayingId.value = null
        item.isPlaying = false
        audioPlayer = null
      }
      audioPlayer.onerror = () => {
        currentPlayingId.value = null
        item.isPlaying = false
        audioPlayer = null
      }
    } else {
      alert('该歌曲暂无播放链接')
    }
  } catch (e) {
    console.error('播放失败:', e)
    alert('播放失败')
  }
}

const downloadSong = async (item) => {
  if (isDownloading.value) return
  isDownloading.value = true

  try {
    let url = `${GD_API}?types=url&source=${item.source || 'netease'}&id=${item.id}&br=320`
    let res = await fetch(url)
    let data = await res.json()
    let songUrl = data.url

    if (!songUrl) {
      url = `${GD_API}?types=url&source=${item.source || 'netease'}&id=${item.id}&br=128`
      res = await fetch(url)
      data = await res.json()
      songUrl = data.url
    }

    if (songUrl) {
      const a = document.createElement('a')
      a.href = songUrl
      a.download = `${item.title}-${item.artist}.mp3`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    } else {
      alert('获取下载链接失败')
    }
  } catch (e) {
    console.error('下载失败:', e)
    alert('下载失败')
  } finally {
    isDownloading.value = false
  }
}

const handleKeydown = (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault()
    document.getElementById('searchInput')?.focus()
  }
  if (e.key === 'Escape' && props.visible) {
    close()
  }
}

const close = () => {
  if (audioPlayer) {
    audioPlayer.pause()
    audioPlayer = null
    currentPlayingId.value = null
    searchResults.value.forEach(s => { s.isPlaying = false })
  }
  emit('close')
}

watch(() => props.visible, (val) => {
  if (val) {
    setTimeout(() => document.getElementById('searchInput')?.focus(), 300)
    document.addEventListener('keydown', handleKeydown)
  } else {
    document.removeEventListener('keydown', handleKeydown)
  }
}, { immediate: true })

onMounted(() => {
  if (keyword.value) searchMusic()
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  if (audioPlayer) {
    audioPlayer.pause()
    audioPlayer = null
  }
})
</script>

<style scoped>
/* 样式和之前完全一样 */
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
  background: #ffffff !important;
  border-radius: 20px;
  width: 92%;
  max-width: 900px;
  max-height: 88vh;
  border: 1px solid rgba(0,0,0,0.06);
  box-shadow: 0 20px 60px rgba(0,0,0,0.15);
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
  border-bottom: 1px solid #e8ecf1;
  flex-shrink: 0;
}
.page-title {
  font-size: 18px;
  font-weight: 700;
  color: #1a1a2e;
  display: flex;
  align-items: center;
  gap: 8px;
}
.page-close {
  background: none;
  border: none;
  color: #999;
  font-size: 20px;
  cursor: pointer;
  transition: all 0.3s;
  padding: 4px 8px;
  border-radius: 6px;
}
.page-close:hover { 
  color: #ff4500; 
  background: rgba(255,69,0,0.08);
}

.page-body {
  padding: 20px 24px 16px;
  overflow-y: auto;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.search-box {
  display: flex;
  gap: 0.5rem;
  background: #f5f6f8;
  padding: 0.3rem;
  border-radius: 60px;
  border: 1px solid #e8ecf1;
  transition: all 0.3s ease;
  flex-shrink: 0;
}
.search-box:focus-within {
  border-color: #4facfe;
  box-shadow: 0 0 0 3px rgba(79,172,254,0.15);
}
.search-box input {
  flex: 1;
  background: transparent;
  border: none;
  padding: 0.8rem 1.2rem;
  color: #1a1a2e;
  font-size: 0.95rem;
  outline: none;
}
.search-box input::placeholder { color: #aaa; }
.search-box button {
  background: linear-gradient(135deg, #4facfe 0%, #2563eb 100%);
  border: none;
  color: #fff;
  padding: 0.7rem 1.8rem;
  border-radius: 40px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.25s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.search-box button:hover {
  transform: scale(1.03);
  box-shadow: 0 4px 20px rgba(79,172,254,0.35);
}

.stats-bar {
  font-size: 12px;
  color: #888;
  padding: 4px 4px 0 4px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 6px;
}

.result-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-height: 420px;
  overflow-y: auto;
  flex: 1;
}

.result-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  background: #f8f9fa;
  border-radius: 10px;
  border: 1px solid #eef1f5;
  transition: all 0.2s;
}
.result-item:hover {
  background: #f0f2f5;
  border-color: #d5dbe3;
}

.result-item.is-playing {
  background: rgba(79, 172, 254, 0.08);
  border-color: #4facfe;
}
.result-item.is-playing .result-title {
  color: #4facfe;
}

.result-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 0;
}
.result-title {
  font-size: 14px;
  font-weight: 600;
  color: #1a1a2e;
}
.result-artist {
  font-size: 12px;
  color: #888;
  display: flex;
  align-items: center;
  gap: 4px;
}

.result-actions {
  display: flex;
  gap: 6px;
  flex-shrink: 0;
}
.result-actions button {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
}
.btn-play {
  background: rgba(74, 222, 128, 0.15);
  color: #22c55e;
}
.btn-play:hover {
  background: #22c55e;
  color: #fff;
}
.btn-play:active {
  transform: scale(0.9);
}
.result-item.is-playing .btn-play {
  background: rgba(245, 87, 108, 0.15);
  color: #f5576c;
}
.result-item.is-playing .btn-play:hover {
  background: #f5576c;
  color: #fff;
}

.btn-download {
  background: rgba(79, 172, 254, 0.15);
  color: #4facfe;
}
.btn-download:hover {
  background: #4facfe;
  color: #fff;
}

.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #bbb;
  gap: 12px;
  min-height: 200px;
}
.empty-state p { font-size: 14px; }

.footer-tip {
  color: #888;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
  padding: 4px 0;
}

@keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
@keyframes scaleIn { from { opacity:0; transform:scale(0.96); } to { opacity:1; transform:scale(1); } }

.result-list::-webkit-scrollbar { width: 4px; }
.result-list::-webkit-scrollbar-track { background: transparent; }
.result-list::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 4px; }
</style>
