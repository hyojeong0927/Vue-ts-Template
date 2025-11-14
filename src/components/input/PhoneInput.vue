<template>
  <div class="phone-input-group">
    <label v-if="label" class="phone-label">{{ label }}</label>
    <div class="phone-fields">
      <!-- 국번 선택 -->
      <BaseSelect
        v-model="phoneParts.first"
        :options="prefixOptions"
        placeholder="국번"
        class="phone-select"
      />

      <!-- 앞 번호 -->
      <BaseInput
        v-model="phoneParts.middle"
        placeholder="앞 번호"
        maxlength="4"
        type="number"
        class="phone-input"
        @input="onInput"
      />

      <!-- 마지막 번호 -->
      <BaseInput
        v-model="phoneParts.last"
        placeholder="마지막 번호"
        maxlength="4"
        type="number"
        class="phone-input"
        @input="onInput"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import BaseSelect from '@/components/selectbox/Selectbox.vue'
import BaseInput from '@/components/input/InputGroup.vue'

const props = defineProps({
  modelValue: String,
  label: String,
})

const emit = defineEmits(['update:modelValue'])

const phoneParts = ref({
  first: '',
  middle: '',
  last: '',
})

// 국번 리스트
const prefixOptions = [
  { value: '010', label: '010' },
  { value: '011', label: '011' },
  { value: '016', label: '016' },
  { value: '017', label: '017' },
  { value: '018', label: '018' },
  { value: '019', label: '019' },
]

// 전체 번호 조합
const fullPhone = computed(() => {
  const { first, middle, last } = phoneParts.value
  return [first, middle, last].filter(Boolean).join('-')
})

// 부모로 값 전달
watch(fullPhone, val => {
  emit('update:modelValue', val)
})

// 초기값 분리
watch(
  () => props.modelValue,
  val => {
    if (val) {
      const parts = val.split('-')
      phoneParts.value = {
        first: parts[0] || '',
        middle: parts[1] || '',
        last: parts[2] || '',
      }
    }
  },
  { immediate: true }
)

function onInput() {
  // 숫자 외 제거
  phoneParts.value.middle = phoneParts.value.middle.replace(/\D/g, '')
  phoneParts.value.last = phoneParts.value.last.replace(/\D/g, '')
}
</script>

<style scoped>
.phone-input-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
}

.phone-label {
  font-size: 14px;
  font-weight: 500;
}

.phone-fields {
  display: flex;
  gap: 8px;
  align-items: center;
}

.phone-select {
  width: 90px;
}

.phone-input {
  flex: 1;
}
</style>
