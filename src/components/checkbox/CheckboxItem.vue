<template>
  <label class="checkbox-item" :class="{ disabled }">
    <input
      type="checkbox"
      :checked="modelValue"
      :disabled="disabled"
      @change="$emit('update:modelValue', !modelValue)"
    />
    <span class="label">{{ label }}</span>
  </label>
</template>

<script setup lang="ts">
interface Props {
  label: string
  modelValue: boolean
  disabled?: boolean
}

defineProps<Props>()
defineEmits(['update:modelValue'])
</script>

<style scoped>
.checkbox-item {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  user-select: none;
}

.checkbox-item input[type='checkbox'] {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.checkbox-item.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.checkbox-item.disabled input[type='checkbox'] {
  cursor: not-allowed;
}

.label {
  font-size: 14px;
}
</style>
