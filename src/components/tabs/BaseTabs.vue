<template>
  <div class="tabs-wrap" :class="variant" ref="tabsWrap">
    <!-- 탑 영역 -->
    <div class="tabs-top" ref="topRef">
      <slot name="top"></slot>
    </div>

    <!-- 탭 헤더 -->
    <div class="tabs-header" ref="headerRef" role="tablist">
      <div class="tabs-header-inner">
        <button
          v-for="tab in localTabs"
          :key="tab.value"
          class="tab-btn"
          :class="{ active: currentTab === tab.value, disabled: tab.disabled }"
          @click="selectTab(tab.value)"
          :disabled="tab.disabled"
        >
          {{ tab.label }}
        </button>
      </div>
    </div>

    <!-- 바디 -->
    <div class="tabs-content" ref="contentRef" :class="{ 'no-scroll': !scrollBody }">
      <slot :name="currentTab"></slot>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'

/* ------------------------
   Props
-------------------------*/
const props = defineProps({
  tabs: { type: Array, required: true },
  modelValue: { type: String, default: '' },
  variant: { type: String, default: 'line' },
  bottomFixedRef: { type: Object, default: null },
  bottomFixedHeight: { type: Number, default: 50 },
  scrollBody: { type: Boolean, default: true },

  /** outer만 true, inner는 false */
  bodyLock: { type: Boolean, default: true },
})

const emit = defineEmits(['update:modelValue'])

/* ------------------------
   State
-------------------------*/
const localTabs = ref([...props.tabs])
const currentTab = ref(props.modelValue || props.tabs?.[0]?.value || '')

const topRef = ref(null)
const headerRef = ref(null)
const contentRef = ref(null)

/* ------------------------
   Watchers
-------------------------*/
watch(
  () => props.modelValue,
  val => {
    if (val !== currentTab.value) currentTab.value = val
  }
)

watch(
  () => props.tabs,
  newVal => {
    localTabs.value = [...newVal]
    if (!localTabs.value.find(t => t.value === currentTab.value)) {
      currentTab.value = localTabs.value[0]?.value || ''
      emit('update:modelValue', currentTab.value)
    }
    updateBodyHeight()
  },
  { deep: true }
)

/* ------------------------
   Body Lock
-------------------------*/
function lockBody() {
  if (props.bodyLock) {
    document.body.classList.add('body-hidden')
  }
}

function unlockBody() {
  if (props.bodyLock) {
    document.body.classList.remove('body-hidden')
  }
}

/* ------------------------
   Tab Change
-------------------------*/
function selectTab(value) {
  if (value === currentTab.value) return

  lockBody()

  currentTab.value = value
  emit('update:modelValue', value)

  nextTick(() => {
    updateBodyHeight()
    requestAnimationFrame(() => {
      preventIOSBounce(contentRef.value)
    })
  })
}

/* ------------------------
   Height Calculation
-------------------------*/
function updateBodyHeight() {
  nextTick(() => {
    if (!contentRef.value) return

    const viewportHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight

    const topHeight = topRef.value?.offsetHeight || 0
    const headerHeight = headerRef.value?.offsetHeight || 0
    const bottomHeight = props.bottomFixedRef?.value?.offsetHeight || props.bottomFixedHeight

    const bodyHeight = viewportHeight - topHeight - headerHeight - bottomHeight
    contentRef.value.style.height = `${bodyHeight}px`
  })
}

/* ------------------------
   Resize 대응
-------------------------*/
function handleResize() {
  updateBodyHeight()
  requestAnimationFrame(() => {
    preventIOSBounce(contentRef.value)
  })
}

/* ------------------------
   iOS Safari Bounce 제거
-------------------------*/
let iosBounceListener = null

function preventIOSBounce(el) {
  if (!el) return

  const isiOS = typeof window !== 'undefined' && /iP(ad|hone|od)/.test(navigator.userAgent)

  if (!isiOS) return

  if (iosBounceListener) {
    el.removeEventListener('touchstart', iosBounceListener)
    iosBounceListener = null
  }

  iosBounceListener = function () {
    const top = el.scrollTop
    const totalScroll = el.scrollHeight
    const currentScroll = top + el.offsetHeight

    if (top <= 0) el.scrollTop = 1
    else if (currentScroll >= totalScroll) el.scrollTop = top - 1
  }

  el.addEventListener('touchstart', iosBounceListener)
}

/* ------------------------
   Lifecycle
-------------------------*/
onMounted(() => {
  lockBody()
  updateBodyHeight()

  requestAnimationFrame(() => {
    preventIOSBounce(contentRef.value)
  })

  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', handleResize)
  }
  window.addEventListener('orientationchange', handleResize)
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  unlockBody()

  if (window.visualViewport) {
    window.visualViewport.removeEventListener('resize', handleResize)
  }
  window.removeEventListener('orientationchange', handleResize)
  window.removeEventListener('resize', handleResize)
})
</script>

<style>
html,
body {
  overscroll-behavior: none; /* Android, Chrome overscroll 방지 */
  -webkit-overflow-scrolling: touch; /* iOS 부드러운 스크롤 */
}

body.body-hidden {
  overflow: hidden !important;
}

/* Wrapper */
.tabs-wrap {
  width: 100%;
  display: flex;
  flex-direction: column;
}

/* top slot */
.tabs-top {
  flex: 0 0 auto;
}

/* header */
.tabs-header {
  flex: 0 0 auto;
}

.tabs-header-inner {
  display: flex;
  gap: 12px;
}

.tab-btn {
  padding: 8px 16px;
  border: none;
  background: transparent;
  cursor: pointer;
}

.tab-btn.active {
  color: #1976d2;
  font-weight: 600;
}

.tab-btn.disabled {
  color: #aaa;
  cursor: not-allowed;
}

/* body scroll */
.tabs-content {
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
}

.tabs-content.no-scroll {
  overflow-y: hidden !important;
}
</style>
