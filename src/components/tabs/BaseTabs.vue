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

const props = defineProps({
  tabs: { type: Array, required: true },
  modelValue: { type: String, default: '' },
  variant: { type: String, default: 'line' },
  bottomFixedRef: { type: Object, default: null },
  bottomFixedHeight: { type: Number, default: 50 },
  scrollBody: { type: Boolean, default: true },
  bodyLock: { type: Boolean, default: true }, // outer만 true
})

const emit = defineEmits(['update:modelValue'])

const localTabs = ref([...props.tabs])
const currentTab = ref(props.modelValue || props.tabs?.[0]?.value || '')

const tabsWrap = ref(null)
const topRef = ref(null)
const headerRef = ref(null)
const contentRef = ref(null)

/* modelValue → currentTab */
watch(
  () => props.modelValue,
  val => {
    if (val !== currentTab.value) currentTab.value = val
  }
)

/* tabs 변경 시 */
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

/* body scroll lock */
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

/* 탭 전환 */
function selectTab(value) {
  if (value === currentTab.value) return

  lockBody() // outer만 작동됨

  currentTab.value = value
  emit('update:modelValue', value)

  nextTick(() => updateBodyHeight())
}

/* 콘텐츠 높이 계산 */
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

/* resize */
function handleResize() {
  updateBodyHeight()
}

/* mount */
onMounted(() => {
  lockBody()
  updateBodyHeight()

  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', handleResize)
  }
  window.addEventListener('orientationchange', handleResize)
  window.addEventListener('resize', handleResize)
})

/* unmount */
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
/* ★ body-hidden은 반드시 글로벌 스타일이어야 동작 */
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
}
.tabs-content.no-scroll {
  overflow-y: hidden !important;
}
</style>
