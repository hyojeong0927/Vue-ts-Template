<template>
  <div class="base-select-wrapper">
    <label v-if="label">{{ label }}</label>
    <select
      :value="modelValue"
      @change="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    >
      <option disabled value="">{{ placeholder }}</option>
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
interface SelectOption {
  value: string | number
  label: string
}

interface Props {
  modelValue: string | number
  options: SelectOption[]
  label?: string
  placeholder?: string
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue'])
</script>

<style scoped>
.base-select-wrapper {
  display: flex;
  flex-direction: column;
}

label {
  font-size: 14px;
  font-weight: 500;
}

select {
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 14px;
}
</style>
