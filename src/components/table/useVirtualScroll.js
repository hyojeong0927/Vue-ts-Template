import { ref, onMounted, onBeforeUnmount, watch } from 'vue'

export function useVirtualScroll(options) {
  const {
    rowCount, // computed(() => rows.length)
    rowHeight = 40,
    overscan = 5,
  } = options

  const viewportRef = ref(null)

  const startIndex = ref(0)
  const endIndex = ref(0)
  const offsetTop = ref(0)
  const visibleHeight = ref(0)

  const totalHeight = () => rowCount.value * rowHeight

  let rafId = null
  let resizeObserver = null

  const calcRange = () => {
    const el = viewportRef.value
    if (!el) return

    const st = el.scrollTop
    const ch = el.clientHeight

    const rawStart = Math.floor(st / rowHeight)
    const visibleCount = Math.ceil(ch / rowHeight)

    const safeStart = Math.max(rawStart - overscan, 0)
    const safeEnd = Math.min(safeStart + visibleCount + overscan * 2, rowCount.value)

    startIndex.value = safeStart
    endIndex.value = safeEnd

    offsetTop.value = safeStart * rowHeight
    visibleHeight.value = (safeEnd - safeStart) * rowHeight
  }

  const onScroll = () => {
    if (rafId) cancelAnimationFrame(rafId)
    rafId = requestAnimationFrame(() => {
      calcRange()
      rafId = null
    })
  }

  onMounted(() => {
    calcRange()

    const el = viewportRef.value
    if (el && 'ResizeObserver' in window) {
      resizeObserver = new ResizeObserver(() => {
        calcRange()
      })
      resizeObserver.observe(el)
    }
  })

  onBeforeUnmount(() => {
    if (rafId) cancelAnimationFrame(rafId)

    if (resizeObserver) {
      const el = viewportRef.value
      if (el) resizeObserver.unobserve(el)
      resizeObserver.disconnect()
      resizeObserver = null
    }
  })

  watch(rowCount, () => {
    calcRange()
  })

  return {
    viewportRef,
    startIndex,
    endIndex,
    offsetTop,
    visibleHeight,
    totalHeight,
    onScroll,
  }
}
