<template>
  <div class="base-phone-input">
    <label v-if="label" class="phone-label">{{ label }}</label>
    <div class="phone-inputs">
      <input
        type="text"
        v-model="areaCode"
        placeholder="국번"
        @blur="validatePart(areaCode, 'areaCode')"
      />
      <span class="divider">-</span>
      <input
        type="text"
        v-model="firstPart"
        placeholder="앞 번호"
        @blur="validatePart(firstPart, 'firstPart')"
      />
      <span class="divider">-</span>
      <input
        type="text"
        v-model="lastPart"
        placeholder="마지막 번호"
        @blur="validatePart(lastPart, 'lastPart')"
      />
    </div>

    <p v-if="error" class="error-msg">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'

interface Props {
  modelValue: string
  label?: string
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue'])

const areaCode = ref('')
const firstPart = ref('')
const lastPart = ref('')

const error = ref<string | null>(null)

watch([areaCode, firstPart, lastPart], () => {
  emit('update:modelValue', `${areaCode.value}-${firstPart.value}-${lastPart.value}`)
})

function validatePart(value: string, part: string) {
  const regex = /^[0-9]*$/
  if (!regex.test(value)) {
    error.value = '숫자만 입력 가능합니다.'
    return false
  }
  if (value.length < 2) {
    error.value = '각 번호는 최소 2자리 이상이어야 합니다.'
    return false
  }
  error.value = null
  return true
}
</script>

<style scoped>
.base-phone-input {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.phone-label {
  font-weight: 500;
  font-size: 14px;
}

.phone-inputs {
  display: flex;
  align-items: center;
  gap: 4px;
}

.phone-inputs input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
}

.divider {
  font-size: 16px;
  padding: 0 4px;
}

.error-msg {
  color: #e53935;
  font-size: 12px;
}
</style>
