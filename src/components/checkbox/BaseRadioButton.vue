<template>
  <div class="radio-button-group">
    <button
      v-for="option in options"
      :key="option.value"
      type="button"
      class="radio-button"
      :class="{ active: internalValue === option.value, disabled: option.disabled || disabled }"
      @click="selectOption(option.value)"
      :disabled="option.disabled || disabled"
    >
      {{ option.label }}
    </button>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    required: true,
  },
  options: {
    type: Array,
    required: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue'])

const internalValue = ref(props.modelValue)

watch(
  () => props.modelValue,
  val => {
    internalValue.value = val
  }
)

function selectOption(value) {
  if (props.disabled) return
  internalValue.value = value
  emit('update:modelValue', value)
}
</script>

<style scoped>
.radio-button-group {
  display: flex;
  gap: 8px;
}

.radio-button {
  padding: 8px 16px;
  border: 1px solid #ccc;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
}

.radio-button:hover:not(.disabled) {
  background: #f0f0f0;
}

.radio-button.active {
  background: #1976d2;
  color: white;
  border-color: #1976d2;
}

.radio-button.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
