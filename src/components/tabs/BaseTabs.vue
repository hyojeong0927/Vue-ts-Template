<template>
  <div class="tabs-container" :class="variant">
    <!-- 탭 헤더 -->
    <div class="tabs-header" role="tablist">
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
        <span
          v-if="closable && !tab.disabled"
          class="close-btn"
          @click.stop="removeTab(tab)"
          title="닫기"
          >✕</span
        >
      </button>
    </div>

    <!-- 탭 콘텐츠 -->
    <div class="tabs-body">
      <slot :name="currentTab"></slot>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

const props = defineProps({
  tabs: {
    type: Array,
    required: true,
  },
  modelValue: {
    type: String,
    required: true,
  },
  variant: {
    type: String,
    default: 'line',
  },
  closable: Boolean,
})

const emit = defineEmits(['update:modelValue', 'remove'])

const currentTab = ref('')
const localTabs = ref(props.tabs || [])

// props.tabs 변경 감지
watch(
  () => props.tabs,
  newTabs => {
    localTabs.value = newTabs || []
    if (newTabs && newTabs.length > 0 && !currentTab.value) {
      currentTab.value = props.modelValue !== undefined ? props.modelValue : newTabs[0].value
      emit('update:modelValue', currentTab.value)
    }
  },
  { immediate: true }
)

// 탭 선택
function selectTab(value) {
  currentTab.value = value
  emit('update:modelValue', value)
}

// 탭 제거
function removeTab(tab) {
  localTabs.value = localTabs.value.filter(t => t.value !== tab.value)
  emit('remove', tab)

  if (currentTab.value === tab.value) {
    currentTab.value = localTabs.value[0] ? localTabs.value[0].value : ''
    emit('update:modelValue', currentTab.value)
  }
}

// props.modelValue 변경 감지
watch(
  () => props.modelValue,
  val => {
    if (val !== undefined) currentTab.value = val
  }
)

// 마운트 시 초기값 설정
onMounted(() => {
  if (!currentTab.value && localTabs.value.length > 0) {
    currentTab.value = localTabs.value[0].value
    emit('update:modelValue', currentTab.value)
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
  display: flex;
  gap: 4px;
  border-bottom: 1px solid #ddd;
}

.tab-btn {
  position: relative;
  padding: 8px 16px;
  font-size: 14px;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.tab-btn:hover:not(.disabled) {
  color: #1976d2;
}

.tab-btn.disabled {
  color: #aaa;
  cursor: not-allowed;
}

.close-btn {
  font-size: 12px;
  cursor: pointer;
  opacity: 0.6;
}
.close-btn:hover {
  opacity: 1;
  color: #e53935;
}

/* variants */
.tabs-container.line .tab-btn {
  border-bottom: 2px solid transparent;
}
.tabs-container.line .tab-btn.active {
  color: #1976d2;
  border-bottom-color: #1976d2;
  font-weight: 600;
}

.tabs-container.box .tabs-header {
  border-bottom: none;
}
.tabs-container.box .tab-btn {
  border: 1px solid #ddd;
  border-radius: 6px;
  background: #f9f9f9;
}
.tabs-container.box .tab-btn.active {
  background: #1976d2;
  color: white;
  border-color: #1976d2;
}

.tabs-container.pill .tabs-header {
  background: #f2f2f2;
  border-radius: 50px;
  padding: 4px;
}
.tabs-container.pill .tab-btn {
  border-radius: 50px;
  padding: 6px 16px;
}
.tabs-container.pill .tab-btn.active {
  background: #1976d2;
  color: white;
  font-weight: 600;
}

.tabs-body {
  padding: 16px 0;
}
</style>
