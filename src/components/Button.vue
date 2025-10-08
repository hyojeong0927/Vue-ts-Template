<template>
  <button :class="buttonClasses" :disabled="disabled" @click="$emit('click', $event)">
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits(['click'])

// 기본 클래스 계산
const buttonClasses = computed(() => {
  const base = 'base-button'
  const variantClass = props.variant ? `btn-${props.variant}` : 'btn-primary'
  const sizeClass = props.size ? `btn-${props.size}` : 'btn-medium'
  const disabledClass = props.disabled ? 'btn-disabled' : ''
  return [base, variantClass, sizeClass, disabledClass].join(' ')
})
</script>

<style scoped>
.base-button {
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 8px 16px;
}

.base-button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

/* Variants */
.btn-primary {
  background-color: #1976d2;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #155a9c;
}

.btn-secondary {
  background-color: #e0e0e0;
  color: #333;
}

.btn-secondary:hover:not(:disabled) {
  background-color: #c7c7c7;
}

.btn-danger {
  background-color: #e53935;
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background-color: #b71c1c;
}

/* Sizes */
.btn-small {
  padding: 4px 10px;
  font-size: 12px;
}

.btn-medium {
  padding: 8px 16px;
  font-size: 14px;
}

.btn-large {
  padding: 12px 20px;
  font-size: 16px;
}
</style>
