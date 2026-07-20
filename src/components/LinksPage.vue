<template>
  <div v-if="visible" class="page-overlay" @click="close">
    <div class="page-content" @click.stop>
      <div class="page-header">
        <span class="page-title">🔗 影音友链</span>
        <button class="page-close" @click="close">&times;</button>
      </div>
      <div class="page-body">
        <div class="link-grid">
          <a
            v-for="item in linkItems"
            :key="item.id"
            :href="item.url"
            target="_blank"
            class="link-card"
          >
            <div class="link-icon">{{ item.icon }}</div>
            <div class="link-title">{{ item.title }}</div>
            <div class="link-desc">{{ item.desc }}</div>
          </a>
        </div>
        <div class="footer-tip">💡 在 LinksPage.vue 的 linkItems 中增删改</div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({ visible: Boolean })
const emit = defineEmits(['close'])

// ============================================================
// 🔥 在这里添加你的友链
// ============================================================
const linkItems = [
  { id: 1, icon: '🌐', title: 'GitHub', desc: '代码托管平台', url: 'https://github.com' },
  { id: 2, icon: '📖', title: '掘金', desc: '技术社区', url: 'https://juejin.cn' },
  { id: 3, icon: '🎨', title: 'Dribbble', desc: '设计灵感', url: 'https://dribbble.com' },
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
  max-width: 720px;
  max-height: 85vh;
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
  padding: 24px;
  overflow-y: auto;
  flex: 1;
}
.link-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 16px;
}
.link-card {
  display: block;
  padding: 18px 16px;
  background: var(--bg-card, rgba(255,255,255,0.04));
  border: 1px solid var(--border-color, rgba(255,255,255,0.06));
  border-radius: 14px;
  text-decoration: none;
  color: var(--text-primary, #fff);
  transition: all 0.3s ease;
}
.link-card:hover {
  transform: translateY(-4px);
  border-color: #ff8c00;
  box-shadow: 0 8px 30px rgba(255,140,0,0.12);
}
.link-icon { font-size: 32px; margin-bottom: 8px; }
.link-title { font-size: 16px; font-weight: 600; }
.link-desc { font-size: 12px; color: var(--text-secondary, rgba(255,255,255,0.5)); margin-top: 4px; }
.footer-tip {
  text-align: center;
  padding: 16px 0 4px;
  color: var(--text-secondary, rgba(255,255,255,0.2));
  font-size: 12px;
  border-top: 1px solid var(--border-color, rgba(255,255,255,0.04));
  margin-top: 20px;
}
@keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
@keyframes scaleIn { from { opacity:0; transform:scale(0.96); } to { opacity:1; transform:scale(1); } }
.page-body::-webkit-scrollbar { width:4px; }
.page-body::-webkit-scrollbar-track { background:transparent; }
.page-body::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.12); border-radius:4px; }

body.light .page-content { background:#fff; border-color:rgba(0,0,0,0.06); }
body.light .page-title { color:#1a1a2e; }
body.light .link-card { background:#f5f6f8; border-color:#e8ecf1; color:#1a1a2e; }
body.light .link-card:hover { border-color:#ff8c00; }
body.light .link-desc { color:rgba(0,0,0,0.4); }
body.light .footer-tip { color:rgba(0,0,0,0.2); }
</style>
