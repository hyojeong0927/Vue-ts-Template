<template>
  <div class="tabs-container" :class="variant" ref="tabsContainer">
    <!-- 상단 슬롯: 탭 외부 콘텐츠 -->
    <slot name="top"></slot>

    <!-- 탭 헤더 -->
    <div class="tabs-header" ref="headerRef" role="tablist">
      <div class="tabs-scroll">
        <button
          v-for="tab in localTabs"
          :key="tab.value"
          class="tab-btn"
          :class="{ active: currentTab === tab.value, disabled: tab.disabled }"
          role="tab"
          :aria-selected="currentTab === tab.value"
          :tabindex="currentTab === tab.value ? 0 : -1"
          @click="selectTab(tab.value)"
        >
          {{ tab.label }}
        </button>
      </div>
    </div>

    <!-- 탭 콘텐츠 (스크롤) -->
    <div class="tabs-body" ref="bodyRef">
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
  bottomFixedHeight: { type: Number, default: 50 }, // 하단 버튼 높이
})

const emit = defineEmits(['update:modelValue', 'remove'])

const localTabs = ref([...props.tabs])
const currentTab = ref(props.modelValue || props.tabs?.[0]?.value || '')

const tabsContainer = ref(null)
const headerRef = ref(null)
const bodyRef = ref(null)

/* modelValue 변경 → currentTab 반영 */
watch(
  () => props.modelValue,
  val => {
    if (val !== currentTab.value) currentTab.value = val
  }
)

/* tabs 변경 → localTabs 갱신 */
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

/* 현재 탭 선택 */
function selectTab(value) {
  if (value === currentTab.value) return
  currentTab.value = value
  emit('update:modelValue', value)
}

/* tabs-body 높이 계산 */
function updateBodyHeight() {
  nextTick(() => {
    if (!bodyRef.value || !tabsContainer.value) return

    const containerHeight = window.visualViewport
      ? window.visualViewport.height
      : window.innerHeight

    const topSlot = tabsContainer.value.querySelector('[slot="top"]')
    const topHeight = topSlot?.offsetHeight || 0
    const headerHeight = headerRef.value?.offsetHeight || 0
    const bottomHeight = props.bottomFixedHeight

    const bodyHeight = containerHeight - topHeight - headerHeight - bottomHeight
    bodyRef.value.style.height = `${bodyHeight}px`
  })
}

function handleResize() {
  updateBodyHeight()
}

/* mounted & resize listener */
onMounted(() => {
  updateBodyHeight()
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', handleResize)
  } else {
    window.addEventListener('resize', handleResize)
  }
})

onBeforeUnmount(() => {
  if (window.visualViewport) {
    window.visualViewport.removeEventListener('resize', handleResize)
  } else {
    window.removeEventListener('resize', handleResize)
  }
})
</script>

<style scoped>
.tabs-container {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.tabs-header {
  overflow-x: auto;
  white-space: nowrap;
  -webkit-overflow-scrolling: touch;
}

.tabs-scroll {
  display: inline-flex;
  gap: 12px;
}

.tab-btn {
  flex: 0 0 auto;
  padding: 8px 16px;
  border: none;
  background: transparent;
  cursor: pointer;
}

.tab-btn.active {
  font-weight: 600;
  color: #1976d2;
}

.tab-btn.disabled {
  color: #aaa;
  cursor: not-allowed;
}

.close-btn {
  font-size: 12px;
  margin-left: 4px;
  cursor: pointer;
  opacity: 0.6;
}

.close-btn:hover {
  opacity: 1;
  color: #e53935;
}

.tabs-body {
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}
</style>
