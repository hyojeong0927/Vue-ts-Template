<template>
  <div class="date-range-group">
    <label v-if="label" class="date-range-label">{{ label }}</label>

    <div class="date-range-wrapper">
      <input
        type="date"
        class="date-input"
        v-model="localStart"
        :max="localEnd || max"
        :min="min"
      />
      <span class="divider">~</span>
      <input
        type="date"
        class="date-input"
        v-model="localEnd"
        :min="localStart || min"
        :max="max"
      />

      <button
        v-if="clearable && (localStart || localEnd)"
        type="button"
        class="clear-btn"
        @click="clearRange"
        aria-label="기간 초기화"
      >
        ✕
      </button>
    </div>

    <!-- ✅ showQuickSelect 옵션으로 노출 제어 -->
    <div v-if="showQuickSelect" class="quick-select">
      <button type="button" class="quick-btn" @click="setPeriod(1)">1개월</button>
      <button type="button" class="quick-btn" @click="setPeriod(2)">2개월</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from 'vue'

interface DateRange {
  start: string
  end: string
}

interface Props {
  modelValue: DateRange
  label?: string
  min?: string
  max?: string
  clearable?: boolean
  showQuickSelect?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue'])

const localStart = ref(props.modelValue.start)
const localEnd = ref(props.modelValue.end)

watch(
  () => props.modelValue,
  newVal => {
    localStart.value = newVal.start
    localEnd.value = newVal.end
  },
  { deep: true }
)

watch([localStart, localEnd], ([start, end]) => {
  emit('update:modelValue', { start, end })
})

const clearRange = () => {
  localStart.value = ''
  localEnd.value = ''
}

const setPeriod = (months: number) => {
  const today = new Date()
  const startDate = new Date(today)
  const endDate = new Date(today)
  endDate.setMonth(today.getMonth() + months)

  const format = (date: Date) => date.toISOString().split('T')[0]

  localStart.value = format(startDate)
  localEnd.value = format(endDate)
}
</script>

<style scoped>
.date-range-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
}

.date-range-label {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.date-range-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
}

.date-input {
  flex: 1;
  padding: 8px 12px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 8px;
  outline: none;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
}

.date-input:focus {
  border-color: #2196f3;
  box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.15);
}

.divider {
  font-weight: bold;
  color: #666;
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

.quick-select {
  display: flex;
  gap: 8px;
  margin-top: 6px;
}

.quick-btn {
  flex: 1;
  padding: 6px 10px;
  font-size: 13px;
  border: 1px solid #bbb;
  border-radius: 6px;
  background-color: #f8f8f8;
  cursor: pointer;
  transition: all 0.2s;
}

.quick-btn:hover {
  background-color: #e0e0e0;
  border-color: #999;
}
</style>
