<template>
  <div class="date-picker-group">
    <label v-if="label" class="date-picker-label">{{ label }}</label>

    <div class="date-picker-wrapper">
      <input
        type="date"
        class="date-picker-input"
        :value="modelValue"
        :placeholder="placeholder"
        :min="min"
        :max="max"
        @input="onInput"
      />

      <button
        v-if="clearable && modelValue"
        type="button"
        class="clear-btn"
        @click="clearDate"
        aria-label="날짜 지우기"
      >
        ✕
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

interface Props {
  modelValue: string | null
  label?: string
  placeholder?: string
  min?: string
  max?: string
  clearable?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue'])

const onInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

const clearDate = () => {
  emit('update:modelValue', '')
}
</script>

<style scoped>
.date-picker-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
}

.date-picker-label {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.date-picker-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.date-picker-input {
  width: 100%;
  padding: 8px 36px 8px 12px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 8px;
  outline: none;
  transition: all 0.2s;
}

.date-picker-input:focus {
  border-color: #2196f3;
  box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.15);
}

.clear-btn {
  position: absolute;
  right: 8px;
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 14px;
  color: #999;
  transition: color 0.2s;
}

.clear-btn:hover {
  color: #333;
}
</style>
