<template>
  <div class="checkbox-select-box">
    <!-- Select Box 모양 -->
    <div class="select-display" @click="toggleDropdown" :class="{ disabled }">
      <span :class="displayText === placeholderText ? placeholderClass : ''" class="display-text">
        {{ displayText }}
      </span>
      <span class="arrow">▾</span>
    </div>

    <!-- Dropdown -->
    <div v-if="dropdownOpen" class="dropdown">
      <!-- 전체 선택 -->
      <label class="checkbox-option all-select">
        <input type="checkbox" :checked="allSelected" @change="toggleAll" :disabled="disabled" />
        전체 선택
      </label>

      <!-- 옵션 목록 -->
      <div class="checkbox-options">
        <label v-for="option in options" :key="option.value" class="checkbox-option">
          <input
            type="checkbox"
            :value="option.value"
            :checked="isChecked(option.value)"
            @change="toggleOption(option.value)"
            :disabled="disabled"
          />
          {{ option.label }}
        </label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface SelectOption {
  value: string | number
  label: string
}

interface Props {
  modelValue: Array<string | number>
  options: SelectOption[]
  disabled?: boolean
  placeholder?: string
  placeholderClass?: string
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue'])

const dropdownOpen = ref(false)

function toggleDropdown() {
  if (!props.disabled) dropdownOpen.value = !dropdownOpen.value
}

const isChecked = (value: string | number) => props.modelValue.includes(value)

function toggleOption(value: string | number) {
  const newValue = [...props.modelValue]
  const index = newValue.indexOf(value)
  if (index > -1) {
    newValue.splice(index, 1)
  } else {
    newValue.push(value)
  }
  emit('update:modelValue', newValue)
}

const allSelected = computed(() => {
  return props.options.every(opt => props.modelValue.includes(opt.value))
})

function toggleAll() {
  if (allSelected.value) {
    emit('update:modelValue', [])
  } else {
    emit(
      'update:modelValue',
      props.options.map(opt => opt.value)
    )
  }
}

const placeholderText = computed(() => props.placeholder || '선택하세요')

const displayText = computed(() => {
  if (!props.modelValue.length) return placeholderText.value

  const selectedLabels = props.options
    .filter(opt => props.modelValue.includes(opt.value))
    .map(opt => opt.label)

  const text = selectedLabels.join(', ')
  return text.length > 20 ? text.slice(0, 20) + '...' : text
})
</script>

<style scoped>
.checkbox-select-box {
  position: relative;
  width: 250px;
  font-family: Arial, sans-serif;
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
  max-height: 200px;
  overflow-y: auto;
  z-index: 10;
  padding: 8px;
}

.checkbox-option {
  display: flex;
  align-items: center;
  gap: 8px;
}

.all-select {
  font-weight: bold;
  margin-bottom: 8px;
}
</style>
