<template>
  <div class="checkbox-group">
    <div class="checkbox-list">
      <CheckboxItem
        v-for="(item, index) in items"
        :key="index"
        :label="item.label"
        :modelValue="item.checked"
        :disabled="item.disabled"
        @update:modelValue="val => updateItem(index, val)"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import CheckboxItem from './CheckboxItem.vue'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
  options: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['update:modelValue'])

// 내부 상태 구성
const items = ref([])

function initItems() {
  items.value = props.options.map(opt => {
    const option = typeof opt === 'string' ? { label: opt } : opt
    return {
      label: option.label,
      disabled: option.disabled || false,
      checked: props.modelValue.includes(option.label),
    }
  })
}

initItems()

// "전체 선택" 존재 여부
const hasAllOption = computed(() => items.value.some(i => i.label === '전체 선택'))

// 전체 선택 상태 계산
const isAllChecked = computed(() =>
  items.value.filter(i => i.label !== '전체 선택' && !i.disabled).every(i => i.checked)
)

// 항목 업데이트
function updateItem(index, val) {
  const item = items.value[index]
  if (item.disabled) return

  item.checked = val

  // "전체 선택"이면 전체 토글
  if (item.label === '전체 선택' && hasAllOption.value) {
    toggleAll(val)
    return
  }

  // 전체 선택 상태 갱신
  if (hasAllOption.value) {
    const allItem = items.value.find(i => i.label === '전체 선택')
    if (allItem && !allItem.disabled) {
      allItem.checked = isAllChecked.value
    }
  }

  emitSelected()
}

// 전체 선택 토글
function toggleAll(val) {
  items.value.forEach(i => {
    if (i.label !== '전체 선택' && !i.disabled) {
      i.checked = val
    }
  })
  emitSelected()
}

// 선택된 항목 목록을 부모로 전달
function emitSelected() {
  const selected = items.value.filter(i => i.checked).map(i => i.label)
  emit('update:modelValue', selected)
}

// props.modelValue 변경 시 반영
watch(
  () => props.modelValue,
  newVal => {
    items.value.forEach(i => {
      i.checked = newVal.includes(i.label)
    })
  }
)

// options 변경 시 재초기화
watch(
  () => props.options,
  () => initItems(),
  { deep: true }
)
</script>

<style scoped>
.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 8px;
  width: 220px;
}

.checkbox-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
</style>
