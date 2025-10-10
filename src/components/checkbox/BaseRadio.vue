<template>
  <div class="radio-group">
    <label
      v-for="option in options"
      :key="option.value"
      class="radio-label"
      :class="{ disabled: option.disabled || disabled }"
    >
      <input
        type="radio"
        :value="option.value"
        :disabled="option.disabled || disabled"
        :name="name"
        v-model="internalValue"
      />
      <span class="radio-custom"></span>
      {{ option.label }}
    </label>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface RadioOption {
  label: string
  value: string | number
  disabled?: boolean
}

const props = defineProps({
  modelValue: {
    type: [String, Number],
    required: true,
  },
  options: {
    type: Array as () => RadioOption[],
    required: true,
  },
  name: {
    type: String,
    default: 'radio-group',
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

watch(internalValue, val => {
  emit('update:modelValue', val)
})
</script>

<style scoped>
.radio-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.radio-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 14px;
  position: relative;
}

.radio-label.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.radio-label input[type='radio'] {
  display: none;
}

.radio-custom {
  width: 16px;
  height: 16px;
  border: 2px solid #1976d2;
  border-radius: 50%;
  margin-right: 8px;
  position: relative;
}

.radio-label input[type='radio']:checked + .radio-custom::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 8px;
  height: 8px;
  background: #1976d2;
  border-radius: 50%;
  transform: translate(-50%, -50%);
}
</style>
