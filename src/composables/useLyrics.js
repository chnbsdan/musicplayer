import { ref, onMounted, onUnmounted, watch } from 'vue'
import { usePlayerStore } from '../stores/playerStore'

export function useLyrics() {
  const store = usePlayerStore()
  const container = ref(null)
  const currentLineEl = ref(null)
  const nextLineEl = ref(null)
  const songTitleEl = ref(null)

  let interval = null
  let dragData = null
  let resizeData = null

  const show = (currentText, nextText) => {
    if (!store.lyricsVisible) return
    if (currentText === store.currentLyric) return

    store.currentLyric = currentText
    if (!currentLineEl.value) return

    currentLineEl.value.innerHTML = ''

    if (currentText && currentText.trim()) {
      container.value.style.display = 'block'
      container.value.style.opacity = '1'

      const typingSpan = document.createElement('span')
      typingSpan.className = 'typing-text'
      typingSpan.textContent = currentText

      const fadeSpan = document.createElement('span')
      fadeSpan.className = 'fade-in-text'
      fadeSpan.textContent = currentText

      if (currentText.length > 15) {
        currentLineEl.value.appendChild(fadeSpan)
      } else {
        currentLineEl.value.appendChild(typingSpan)
      }

      if (nextLineEl.value) {
        nextLineEl.value.textContent = nextText || ''
      }
      container.value.classList.add('show')
    } else {
      hide()
    }
  }

  const hide = () => {
    if (container.value) {
      container.value.style.display = 'none'
      container.value.classList.remove('show')
    }
    store.currentLyric = ''
  }

  const setCurrentSong = (song) => {
    if (songTitleEl.value) {
      songTitleEl.value.textContent = song ? `🎵 ${song.name} - ${song.artist || ''}` : '🎵 点击播放音乐'
    }
  }

  const toggleVisibility = () => {
    const visible = store.toggleLyrics()
    if (visible) {
      container.value.style.display = 'block'
      container.value.classList.add('show')
    } else {
      hide()
    }
    return visible
  }

  const updateFromDOM = () => {
    try {
      if (!store.lyricsVisible) return

      const lrcContainer = document.querySelector('.aplayer-lrc')
      if (!lrcContainer) {
        hide()
        return
      }

      const currentLrc = lrcContainer.querySelector('p.aplayer-lrc-current')
      const allLrcLines = lrcContainer.querySelectorAll('p')

      if (currentLrc && currentLrc.textContent.trim()) {
        const currentText = currentLrc.textContent.trim()
        let nextText = ''
        for (let i = 0; i < allLrcLines.length; i++) {
          if (allLrcLines[i] === currentLrc && i < allLrcLines.length - 1) {
            nextText = allLrcLines[i + 1].textContent.trim()
            break
          }
        }
        show(currentText, nextText)
      } else {
        hide()
      }
    } catch (e) {
      hide()
    }
  }

  const startUpdate = () => {
    if (interval) clearInterval(interval)
    interval = setInterval(updateFromDOM, 200)
  }

  const stopUpdate = () => {
    if (interval) {
      clearInterval(interval)
      interval = null
    }
  }

  // ===== 拖动（鼠标 + 触摸） =====
  const bindDrag = () => {
    const el = container.value
    if (!el) return

    // 鼠标
    el.addEventListener('mousedown', (e) => {
      if (e.target.closest('.lyrics-settings-btn') || e.target.closest('#lyrics-resize-handle')) return
      if (!el.classList.contains('show')) return
      dragData = {
        offsetX: e.clientX - el.offsetLeft,
        offsetY: e.clientY - el.offsetTop,
        isTouch: false
      }
      e.preventDefault()
    })

    el.addEventListener('touchstart', (e) => {
      if (e.target.closest('.lyrics-settings-btn') || e.target.closest('#lyrics-resize-handle')) return
      if (!el.classList.contains('show')) return
      const touch = e.touches[0]
      dragData = {
        offsetX: touch.clientX - el.offsetLeft,
        offsetY: touch.clientY - el.offsetTop,
        isTouch: true
      }
      e.preventDefault()
    }, { passive: false })

    document.addEventListener('mousemove', (e) => {
      if (!dragData || dragData.isTouch) return
      doDrag(e.clientX, e.clientY)
    })

    document.addEventListener('touchmove', (e) => {
      if (!dragData || !dragData.isTouch) return
      const touch = e.touches[0]
      doDrag(touch.clientX, touch.clientY)
      e.preventDefault()
    }, { passive: false })

    document.addEventListener('mouseup', () => { dragData = null })
    document.addEventListener('touchend', () => { dragData = null })
  }

  const doDrag = (clientX, clientY) => {
    const el = container.value
    if (!el || !dragData) return
    let x = clientX - dragData.offsetX
    let y = clientY - dragData.offsetY
    x = Math.max(0, Math.min(window.innerWidth - el.offsetWidth, x))
    y = Math.max(0, Math.min(window.innerHeight - el.offsetHeight, y))
    el.style.left = x + 'px'
    el.style.top = y + 'px'
    el.style.transform = 'none'
  }

  // ===== 缩放 =====
  const bindResize = () => {
    const handle = document.getElementById('lyrics-resize-handle')
    const el = container.value
    if (!handle || !el) return

    handle.addEventListener('mousedown', (e) => {
      e.stopPropagation()
      e.preventDefault()
      if (!el.classList.contains('show')) return
      resizeData = {
        startX: e.clientX,
        startY: e.clientY,
        startW: el.offsetWidth,
        startH: el.offsetHeight,
        isTouch: false
      }
    })

    handle.addEventListener('touchstart', (e) => {
      e.stopPropagation()
      e.preventDefault()
      if (!el.classList.contains('show')) return
      const touch = e.touches[0]
      resizeData = {
        startX: touch.clientX,
        startY: touch.clientY,
        startW: el.offsetWidth,
        startH: el.offsetHeight,
        isTouch: true
      }
    }, { passive: false })

    document.addEventListener('mousemove', (e) => {
      if (!resizeData || resizeData.isTouch) return
      doResize(e.clientX, e.clientY)
    })

    document.addEventListener('touchmove', (e) => {
      if (!resizeData || !resizeData.isTouch) return
      const touch = e.touches[0]
      doResize(touch.clientX, touch.clientY)
      e.preventDefault()
    }, { passive: false })

    document.addEventListener('mouseup', () => { resizeData = null })
    document.addEventListener('touchend', () => { resizeData = null })
  }

  const doResize = (clientX, clientY) => {
    const el = container.value
    if (!el || !resizeData) return
    let newW = resizeData.startW + (clientX - resizeData.startX)
    let newH = resizeData.startH + (clientY - resizeData.startY)
    newW = Math.max(150, newW)
    newH = Math.max(70, newH)
    el.style.width = newW + 'px'
    el.style.height = newH + 'px'
  }

  const applyStyles = () => {
    if (currentLineEl.value) {
      currentLineEl.value.style.color = store.lyricsColor
      currentLineEl.value.style.fontSize = store.lyricsFontSize + 'px'
    }
    if (nextLineEl.value) {
      nextLineEl.value.style.fontSize = Math.max(10, store.lyricsFontSize * 0.45) + 'px'
    }
  }

  const reset = () => {
    if (container.value) {
      container.value.style.left = '50%'
      container.value.style.top = '20px'
      container.value.style.transform = 'translateX(-50%)'
      container.value.style.width = ''
      container.value.style.height = ''
    }
    store.setLyricsColor('#ff4500')
    store.setLyricsFontSize(30)
    applyStyles()
  }

  onMounted(() => {
    bindDrag()
    bindResize()
    applyStyles()
  })

  onUnmounted(() => {
    stopUpdate()
  })

  watch(() => store.lyricsColor, () => applyStyles())
  watch(() => store.lyricsFontSize, () => applyStyles())

  return {
    container,
    currentLineEl,
    nextLineEl,
    songTitleEl,
    show,
    hide,
    setCurrentSong,
    toggleVisibility,
    startUpdate,
    stopUpdate,
    updateFromDOM,
    reset,
    applyStyles
  }
}
