<template>
  <div class="select-demo">
    <h3>Select Box 예시</h3>

    <BaseSelect
      v-model="selectedOption"
      label="국가 선택"
      :options="countryOptions"
      placeholder="국가를 선택하세요"
    />

    <p>선택된 값: {{ selectedOption }}</p>

    <CheckboxSelectBox
      v-model="selectedValues"
      :options="countryOptions"
      placeholderClass="placeholder-style"
    />

    <p>선택된 값: {{ selectedValues }}</p>

    <SearchableCheckboxSelect
      v-model="selectedSearchValues"
      :options="countryOptions"
      placeholder="국가를 선택하세요"
    />
    <p>선택된 값: {{ selectedSearchValues }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BaseSelect from '@/components/selectbox/Selectbox.vue'
import CheckboxSelectBox from '@/components/selectbox/CheckboxSelectBox.vue'
import SearchableCheckboxSelect from '@/components/selectbox/SearchableCheckboxSelect.vue'

const selectedOption = ref('')
const selectedValues = ref<Array<string | number>>([])
const selectedSearchValues = ref<string | number | null>(null)

const countryOptions = [
  { value: 'kr', label: '대한민국' },
  { value: 'us', label: '미국' },
  { value: 'jp', label: '일본' },
  { value: 'cn', label: '중국' },
  { value: 'fr', label: '프랑스' },
  { value: 'de', label: '독일' },
  { value: 'it', label: '이탈리아' },
]
</script>
