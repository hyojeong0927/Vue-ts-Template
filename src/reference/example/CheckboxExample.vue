<template>
  <div>
    <h3>Checkbox & Radio</h3>

    <!-- 전체 선택 포함 -->
    <h3>✅ 전체 선택 포함</h3>
    <CheckboxGroup
      v-model="selected"
      :options="[
        '전체 선택',
        { label: 'HTML' },
        { label: 'CSS', disabled: true },
        { label: 'JavaScript' },
        { label: 'Vue', disabled: true },
      ]"
    />
    <p>선택된 항목: {{ selected.join(', ') || '없음' }}</p>

    <hr />

    <!-- 전체 선택 제외 -->
    <h3>❌ 전체 선택 없음</h3>
    <CheckboxGroup v-model="selectedWithoutAll" :options="['HTML', 'CSS', 'JavaScript', 'Vue']" />
    <p>선택된 항목: {{ selectedWithoutAll.join(', ') || '없음' }}</p>

    <hr />

    <h3>Radio 예시</h3>
    <BaseRadio v-model="selectedRadio" :options="radioOptions" name="example" />
    <BaseRadioButton v-model="selectedRadio" :options="radioOptions" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import CheckboxGroup from '@/components/checkbox/CheckboxGroup.vue'
import BaseRadio from '@/components/checkbox/BaseRadio.vue'
import BaseRadioButton from '@/components/checkbox/BaseRadioButton.vue'

// --- TypeScript 제거: ref<string[]> → ref([]) ---
const selected = ref([])

const selectedWithoutAll = ref(['Vue'])
const selectedRadio = ref('option1')

const radioOptions = [
  { label: '옵션 1', value: 'option1' },
  { label: '옵션 2', value: 'option2' },
  { label: '옵션 3', value: 'option3', disabled: true },
]
</script>
