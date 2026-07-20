<template>
  <div v-if="visible" class="page-overlay" @click="close">
    <div class="page-content" @click.stop>
      <div class="page-header">
        <span class="page-title">🎵 在线音乐</span>
        <button class="page-close" @click="close">&times;</button>
      </div>
      <div class="page-body">
        <div class="music-table-wrapper">
          <table class="music-table">
            <thead>
              <tr>
                <th style="width:60px;">#</th>
                <th>歌曲</th>
                <th style="width:280px;">播放器</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in musicItems" :key="item.id">
                <td>{{ item.id }}</td>
                <td>{{ item.title }}</td>
                <td>
                  <audio controls :src="item.url" style="height:32px;width:100%;max-width:260px;"></audio>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="footer-tip">💡 在 MusicPage.vue 的 musicItems 中增删改</div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({ visible: Boolean })
const emit = defineEmits(['close'])

// ============================================================
// 🔥 在这里添加你的音乐
// ============================================================
const musicItems = [
  { id: 1, title: '清流映明月', url: 'https://img.hangdn.com/mp4/02.清流映明月.mp3' },
  { id: 2, title: '一场游戏一场梦', url: 'https://img.hangdn.com/mp4/一场游戏一场梦.mp3' },
  { id: 3, title: '光辉岁月 - BEYOND', url: 'https://img.hangdn.com/mp4/光辉岁月 - BEYOND.mp3' },
  { id: 4, title: '只为碎银几两 - 周林枫, L(桃籽)', url: 'https://img.hangdn.com/mp4/只为碎银几两 - 周林枫, L（桃籽）.mp3' },
  { id: 5, title: '城里的月光 - 许美静', url: 'https://img.hangdn.com/mp4/城里的月光 - 许美静.mp3' },
  { id: 6, title: '夏天的风', url: 'https://img.hangdn.com/mp4/夏天的风.mp3' },
  { id: 7, title: '少年', url: 'https://img.hangdn.com/mp4/少年.mp3' },
  { id: 8, title: '我的梦 - 张靓颖', url: 'https://img.hangdn.com/mp4/我的梦 - 张靓颖.mp3' },
  { id: 9, title: '无悔这一生 - BEYOND', url: 'https://img.hangdn.com/mp4/无悔这一生 - BEYOND.mp3' },
  { id: 10, title: '海阔天空 - BEYOND', url: 'https://img.hangdn.com/mp4/海阔天空 - BEYOND.mp3' },
  { id: 11, title: '渡情 - 左宏元, 张慧清', url: 'https://img.hangdn.com/mp4/渡情 - 左宏元, 张慧清.mp3' },
  { id: 12, title: '真的爱你 - BEYOND', url: 'https://img.hangdn.com/mp4/真的爱你 - BEYOND.mp3' },
  { id: 13, title: '英雄泪', url: 'https://img.hangdn.com/mp4/英雄泪.mp3' },
  { id: 14, title: '虞兮叹 - 闻人听書_', url: 'https://img.hangdn.com/mp4/虞兮叹 - 闻人听書_.mp3' },
  { id: 15, title: '青花瓷 - 周杰伦', url: 'https://img.hangdn.com/mp4/青花瓷 - 周杰伦.mp3' },
  { id: 16, title: '南屏晚钟', url: 'https://img.hangdn.com/01.南屏晚钟.mp3' },
  { id: 17, title: '不装饰你的梦', url: 'https://img.hangdn.com/01.不装饰你的梦.mp3' },
  { id: 18, title: '秦淮河畔', url: 'https://img.hangdn.com/17.秦淮河畔.mp3' },
  { id: 19, title: '大地 - BEYOND', url: 'https://img.hangdn.com/大地 - BEYOND.mp3' },
  { id: 20, title: '下辈子不一定遇见', url: 'https://fly.hangdn.com/assets/music/下辈子不一定遇见.mp3' },
  { id: 21, title: '世界那么大还是遇见你', url: 'https://fly.hangdn.com/assets/music/世界那么大还是遇见你.mp3' },
  { id: 22, title: '别知己 - 海来阿木', url: 'https://fly.hangdn.com/assets/music/别知己 - 海来阿木.mp3' },
  { id: 23, title: '你永远不懂我 (现场) - 乔丽娜', url: 'https://fly.hangdn.com/assets/music/你永远不懂我 (现场) - 乔丽娜.mp3' },
  { id: 24, title: '你永远不懂我 - 雨中百合', url: 'https://fly.hangdn.com/assets/music/你永远不懂我 - 雨中百合.mp3' },
  { id: 25, title: '使一颗心免于哀伤-哼唱', url: 'https://fly.hangdn.com/assets/music/使一颗心免于哀伤-哼唱.mp3' },
  { id: 26, title: '再度重相逢 - 孙露', url: 'https://fly.hangdn.com/assets/music/再度重相逢 - 孙露.mp3' },
  { id: 27, title: '凉凉 - 杨宗纬, 张碧晨', url: 'https://fly.hangdn.com/assets/music/凉凉 - 杨宗纬, 张碧晨.mp3' },
  { id: 28, title: '初恋情人 - 刘小慧', url: 'https://fly.hangdn.com/assets/music/初恋情人 - 刘小慧.mp3' },
  { id: 29, title: '孟婆求你赐我忘情汤 - 铃花儿', url: 'https://fly.hangdn.com/assets/music/孟婆求你赐我忘情汤 - 铃花儿.mp3' },
  { id: 30, title: '流泪的飞蛾 - 孙艺琪', url: 'https://fly.hangdn.com/assets/music/流泪的飞蛾 - 孙艺琪.mp3' },
  { id: 31, title: '漂洋过海来看你 - 王丽坤, 朱亚文', url: 'https://fly.hangdn.com/assets/music/漂洋过海来看你 - 王丽坤, 朱亚文.mp3' },
  { id: 32, title: '盛夏的果实', url: 'https://fly.hangdn.com/assets/music/盛夏的果实.mp3' },
  { id: 33, title: '离别的秋天 - 孙露', url: 'https://fly.hangdn.com/assets/music/离别的秋天 - 孙露.mp3' },
  { id: 34, title: '童年蔡国权', url: 'https://fly.hangdn.com/assets/music/童年蔡国权.mp3' },
  { id: 35, title: '美人吟', url: 'https://fly.hangdn.com/assets/music/美人吟.mp3' },
  { id: 36, title: '谁为我停留 - 张玮伽', url: 'https://fly.hangdn.com/assets/music/谁为我停留 - 张玮伽.mp3' },
  { id: 37, title: '高山流水 - 纯音乐', url: 'https://fly.hangdn.com/assets/music/高山流水 - 纯音乐.mp3' },
  { id: 38, title: 'My Heart Will Go On', url: 'https://fly.hangdn.com/assets/music/My Heart Will Go On.mp3' },
  { id: 39, title: '人间烟火 - 程响', url: 'https://fly.hangdn.com/assets/music/人间烟火 - 程响.mp3' },
  { id: 40, title: '只想一生跟你走 - 张学友', url: 'https://fly.hangdn.com/assets/music/只想一生跟你走 - 张学友.mp3' },
]

const close = () => { emit('close') }
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
  max-width: 820px;
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
}

.music-table-wrapper {
  overflow-y: auto;
  flex: 1;
  border-radius: 10px;
  border: 1px solid var(--border-color, rgba(255,255,255,0.06));
}

.music-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.music-table thead {
  position: sticky;
  top: 0;
  z-index: 10;
}

.music-table th {
  background: var(--bg-card, rgba(255,255,255,0.06));
  color: var(--text-secondary, rgba(255,255,255,0.6));
  font-weight: 600;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 10px 14px;
  text-align: left;
  border-bottom: 1px solid var(--border-color, rgba(255,255,255,0.06));
}

.music-table td {
  padding: 6px 14px;
  border-bottom: 1px solid var(--border-color, rgba(255,255,255,0.04));
  color: var(--text-primary, #fff);
  vertical-align: middle;
}

.music-table tbody tr:hover {
  background: var(--bg-card, rgba(255,255,255,0.04));
}

.music-table td:first-child {
  color: var(--text-secondary, rgba(255,255,255,0.4));
  font-weight: 500;
  text-align: center;
}

.music-table audio {
  height: 32px;
  width: 100%;
  max-width: 260px;
  border-radius: 6px;
}

.footer-tip {
  text-align: center;
  padding: 10px 0 4px;
  color: var(--text-secondary, rgba(255,255,255,0.2));
  font-size: 12px;
  border-top: 1px solid var(--border-color, rgba(255,255,255,0.04));
  flex-shrink: 0;
  margin-top: 12px;
}

@keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
@keyframes scaleIn { from { opacity:0; transform:scale(0.96); } to { opacity:1; transform:scale(1); } }

/* ===== 滚动条 ===== */
.music-table-wrapper::-webkit-scrollbar,
.page-body::-webkit-scrollbar {
  width: 4px;
}
.music-table-wrapper::-webkit-scrollbar-track,
.page-body::-webkit-scrollbar-track {
  background: transparent;
}
.music-table-wrapper::-webkit-scrollbar-thumb,
.page-body::-webkit-scrollbar-thumb {
  background: rgba(255,255,255,0.12);
  border-radius: 4px;
}

/* ===== 浅色模式 ===== */
body.light .page-content {
  background: #ffffff;
  border-color: rgba(0,0,0,0.06);
}
body.light .page-title { color: #1a1a2e; }
body.light .music-table th {
  background: #f0f2f5;
  color: rgba(0,0,0,0.5);
  border-bottom-color: #e8ecf1;
}
body.light .music-table td {
  color: #1a1a2e;
  border-bottom-color: #eef1f5;
}
body.light .music-table tbody tr:hover {
  background: #f5f6f8;
}
body.light .music-table td:first-child {
  color: rgba(0,0,0,0.3);
}
body.light .footer-tip { color: rgba(0,0,0,0.2); }
</style>
