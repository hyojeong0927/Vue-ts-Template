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

    <!-- 탭 콘텐츠 -->
    <div class="tabs-content" ref="contentRef" :class="{ 'no-scroll': !scrollBody }">
      <slot :name="currentTab"></slot>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'

const props = defineProps({
  tabs: { type: Array, required: true },
  modelValue: { type: String, default: '' },
  variant: { type: String, default: 'line' },
  bottomFixedRef: { type: Object, default: null },
  bottomFixedHeight: { type: Number, default: 50 },
  scrollBody: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue'])

const didLock = ref(false)

function lockBody() {
  const target = document.querySelector('main')
  if (!target) return
  target.classList.add('overflow-hidden')
  didLock.value = true
}

function unlockBody() {
  if (!didLock.value) return
  const target = document.querySelector('main')
  if (!target) return
  target.classList.remove('overflow-hidden')
  didLock.value = false
}

const localTabs = ref([...props.tabs])
const currentTab = ref(props.modelValue || props.tabs?.[0]?.value || '')

function selectTab(val) {
  if (val === currentTab.value) return
  currentTab.value = val
  emit('update:modelValue', val)
}

function updateBodyHeight() {
  nextTick(() => {
    const content = document.querySelector('.tabs-content')
    if (!content) return

    if (!props.scrollBody) {
      content.style.height = 'auto'
      return
    }

    const vh = window.innerHeight
    const top = document.querySelector('.tabs-top')?.offsetHeight || 0
    const header = document.querySelector('.tabs-header')?.offsetHeight || 0
    const bottom = props.bottomFixedRef?.value?.offsetHeight || props.bottomFixedHeight

    content.style.height = `${vh - top - header - bottom}px`
  })
}

onMounted(() => {
  if (props.scrollBody) lockBody()
  updateBodyHeight()
  window.addEventListener('resize', updateBodyHeight)
})

onBeforeUnmount(() => {
  unlockBody()
  window.removeEventListener('resize', updateBodyHeight)
})
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
  overflow-y: hidden !important;
  height: auto !important;
}
</style>
