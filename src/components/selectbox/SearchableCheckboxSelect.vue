<template>
  <div class="searchable-select" tabindex="0" @keydown="onKeydown">
    <!-- Select Box -->
    <div class="select-display" @click="toggleDropdown" :class="{ disabled }">
      <span class="display-text">{{ displayText }}</span>
      <span class="arrow">▾</span>
    </div>

    <!-- Dropdown -->
    <div v-if="dropdownOpen" class="dropdown">
      <!-- 검색 입력 -->
      <input
        type="text"
        v-model="search"
        class="search-input"
        placeholder="검색..."
        @keydown.stop
      />

      <!-- 옵션 목록 -->
      <div class="options-list">
        <div
          v-for="(option, index) in filteredOptions"
          :key="option.value"
          :class="['option-item', { highlighted: index === highlightedIndex }]"
          @click="selectOption(option)"
          @mouseenter="highlightedIndex = index"
        >
          {{ option.label }}
        </div>

        <div v-if="filteredOptions.length === 0" class="no-results">검색 결과가 없습니다.</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

interface SelectOption {
  value: string | number
  label: string
}

interface Props {
  modelValue: string | number | null
  options: SelectOption[]
  disabled?: boolean
  placeholder?: string
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue'])

const dropdownOpen = ref(false)
const search = ref('')
const highlightedIndex = ref(0)

function toggleDropdown() {
  if (!props.disabled) {
    dropdownOpen.value = !dropdownOpen.value
    if (dropdownOpen.value) {
      setTimeout(() => {
        highlightedIndex.value = 0
      }, 0)
    }
  }
}

function selectOption(option: SelectOption) {
  emit('update:modelValue', option.value)
  dropdownOpen.value = false
  search.value = ''
}

const selectedOption = computed(
  () => props.options.find(opt => opt.value === props.modelValue) || null
)

const placeholderText = computed(() => props.placeholder || '선택하세요')

const displayText = computed(() => {
  return selectedOption.value ? selectedOption.value.label : placeholderText.value
})

// 즉시 검색 지원 (한 글자 입력도 바로 반영)
const filteredOptions = computed(() => {
  if (!search.value) return props.options

  const keyword = search.value.trim().toLowerCase()

  return props.options.filter(option => {
    const labelNormalized = option.label.replace(/\s+/g, '').toLowerCase()
    return labelNormalized.indexOf(keyword) !== -1
  })
})

// 검색값 변경 시 하이라이트 초기화
watch(search, () => {
  highlightedIndex.value = 0
})

function onKeydown(e: KeyboardEvent) {
  if (!dropdownOpen.value) {
    if (e.key === 'ArrowDown' || e.key === 'Enter') {
      toggleDropdown()
    }
    return
  }

  if (e.key === 'ArrowDown') {
    highlightedIndex.value = (highlightedIndex.value + 1) % filteredOptions.value.length
    scrollToHighlighted()
  } else if (e.key === 'ArrowUp') {
    highlightedIndex.value =
      (highlightedIndex.value - 1 + filteredOptions.value.length) % filteredOptions.value.length
    scrollToHighlighted()
  } else if (e.key === 'Enter') {
    if (filteredOptions.value[highlightedIndex.value]) {
      selectOption(filteredOptions.value[highlightedIndex.value])
    }
  } else if (e.key === 'Escape') {
    dropdownOpen.value = false
  }
}

function scrollToHighlighted() {
  const container = document.querySelector('.options-list')
  const highlightedItem = container?.children[highlightedIndex.value] as HTMLElement
  highlightedItem?.scrollIntoView({ block: 'nearest' })
}
</script>

<style scoped>
.searchable-select {
  position: relative;
  width: 250px;
  font-family: Arial, sans-serif;
  outline: none;
}

.select-display {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.select-display.disabled {
  background: #f9f9f9;
  cursor: not-allowed;
}

.display-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 200px;
}

.arrow {
  font-size: 12px;
}

.dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #ccc;
  border-radius: 6px;
  max-height: 300px;
  overflow-y: auto;
  z-index: 10;
  padding: 8px;
}

.search-input {
  width: 100%;
  padding: 6px;
  margin-bottom: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.options-list {
  max-height: 200px;
  overflow-y: auto;
}

.option-item {
  padding: 6px 8px;
  cursor: pointer;
}

.option-item.highlighted {
  background: #f0f0f0;
}

.no-results {
  padding: 6px;
  color: #999;
}
</style>
