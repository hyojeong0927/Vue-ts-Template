<template>
  <div>
    <h2>Checkbox 예시</h2>
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
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CheckboxGroup from '@/components/checkbox/CheckboxGroup.vue'
const selected = ref<string[]>([])
const selectedWithAll = ref<string[]>([])
const selectedWithoutAll = ref<string[]>(['Vue'])
</script>
