<template>
  <div>
    <h3>DatePicker 예시</h3>

    <BaseDatePicker
      v-model="selectedDate"
      label="시작일"
      placeholder="날짜를 선택하세요"
      clearable
      min="2024-01-01"
      max="2026-12-31"
    />

    <p>선택된 날짜: {{ selectedDate || '없음' }}</p>

    <!-- 빠른 선택 버튼 표시 -->
    <BaseDateRangePicker v-model="period1" label="조회 기간" clearable showQuickSelect />

    <!-- 버튼 숨김 -->
    <BaseDateRangePicker v-model="period2" label="기간 선택" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import BaseDatePicker from '@/components/datepicker/BaseDatePicker.vue'
import BaseDateRangePicker from '@/components/datepicker/BaseDateRangePicker.vue'

const selectedDate = ref('')

const period1 = ref({
  start: '',
  end: '',
})

const period2 = ref({
  start: '',
  end: '',
})
</script>
