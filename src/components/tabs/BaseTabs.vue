<template>
  <div class="tabs-wrap" :class="[variant]" ref="tabsWrap">
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

    <!-- 탭 콘텐츠 -->
    <div class="tabs-content" ref="contentRef" :class="{ 'no-scroll': !scrollBody }">
      <slot :name="currentTab"></slot>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'

/* ------------------------
   Props
------------------------ */
const props = defineProps({
  tabs: { type: Array, required: true },
  modelValue: { type: String, default: '' },
  variant: { type: String, default: 'line' },
  bottomFixedRef: { type: Object, default: null },
  bottomFixedHeight: { type: Number, default: 50 },
  scrollBody: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue'])

/* ------------------------
   Refs
------------------------ */
const topRef = ref(null)
const headerRef = ref(null)
const contentRef = ref(null)

const localTabs = ref([...props.tabs])
const currentTab = ref(props.modelValue || props.tabs?.[0]?.value || '')

/* ------------------------
   Tab Change
------------------------ */
function selectTab(val) {
  if (val === currentTab.value) return
  currentTab.value = val
  emit('update:modelValue', val)
}

/* ------------------------
   Scroll Lock
------------------------ */
const didLock = ref(false)

function lockBody() {
  const main = document.querySelector('main')
  if (!main) return

  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth

  main.style.paddingRight = `${scrollbarWidth}px`
  main.classList.add('overflow-hidden')
  didLock.value = true
}

function unlockBody() {
  if (!didLock.value) return

  const main = document.querySelector('main')
  if (!main) return

  main.style.paddingRight = ''
  main.classList.remove('overflow-hidden')
  didLock.value = false
}

/* ------------------------
   Dynamic Height
------------------------ */
function updateBodyHeight() {
  nextTick(() => {
    if (!contentRef.value) return

    if (!props.scrollBody) {
      contentRef.value.style.height = 'auto'
      return
    }

    const vh = window.innerHeight
    const top = topRef.value?.offsetHeight || 0
    const header = headerRef.value?.offsetHeight || 0
    const bottom = props.bottomFixedRef?.value?.offsetHeight || props.bottomFixedHeight

    const height = vh - top - header - bottom
    contentRef.value.style.height = `${height}px`
  })
}

/* ------------------------
   ResizeObserver
------------------------ */
let observer

onMounted(() => {
  // body scroll lock
  if (props.scrollBody) lockBody()

  updateBodyHeight()

  observer = new ResizeObserver(updateBodyHeight)
  if (topRef.value) observer.observe(topRef.value)
  if (headerRef.value) observer.observe(headerRef.value)

  window.addEventListener('resize', updateBodyHeight)
})

onBeforeUnmount(() => {
  observer?.disconnect()
  window.removeEventListener('resize', updateBodyHeight)
  unlockBody()
})

/* ------------------------
   Watchers
------------------------ */
watch(
  () => props.scrollBody,
  val => {
    if (val) lockBody()
    else unlockBody()
    updateBodyHeight()
  }
)

watch(
  () => props.tabs,
  val => {
    localTabs.value = [...val]
  }
)
</script>

<style>
html,
body {
  overscroll-behavior: none;
  -webkit-overflow-scrolling: touch;
}

main.overflow-hidden {
  overflow: hidden !important;
}

.tabs-wrap {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.tabs-top {
  flex: 0 0 auto;
}

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

.tabs-content {
  overflow-y: auto;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
}

.tabs-content.no-scroll {
  overflow-y: hidden;
}
</style>
