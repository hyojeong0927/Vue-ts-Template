<template>
  <nav class="paging">
    <ul>
      <!-- 처음으로 -->
      <li>
        <button class="btn first" :disabled="currentPage === 1" @click="goToPage(1)">«</button>
      </li>

      <!-- 이전 그룹 -->
      <li>
        <button class="btn prev" :disabled="currentPage === 1" @click="goToPage(currentPage - 1)">
          ‹
        </button>
      </li>

      <!-- 페이지 번호들 -->
      <li v-for="page in pageList" :key="page">
        <button class="btn page" :class="{ active: page === currentPage }" @click="goToPage(page)">
          {{ page }}
        </button>
      </li>

      <!-- 다음 그룹 -->
      <li>
        <button
          class="btn next"
          :disabled="currentPage === totalPage"
          @click="goToPage(currentPage + 1)"
        >
          ›
        </button>
      </li>

      <!-- 마지막으로 -->
      <li>
        <button class="btn last" :disabled="currentPage === totalPage" @click="goToPage(totalPage)">
          »
        </button>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  total: { type: Number, required: true }, // 전체 데이터 개수
  limit: { type: Number, default: 10 }, // 한 페이지당 개수
  pageSize: { type: Number, default: 10 }, // 보여줄 페이지 숫자 개수 (예: 10개씩)
  modelValue: { type: Number, default: 1 }, // 현재 선택된 페이지
})

const emit = defineEmits(['update:modelValue', 'change'])

// 전체 페이지 수
const totalPage = computed(() => Math.ceil(props.total / props.limit))

// 현재 페이지
const currentPage = computed(() => props.modelValue)

// 현재 페이지 그룹 계산
const startPage = computed(() => {
  return Math.floor((currentPage.value - 1) / props.pageSize) * props.pageSize + 1
})

const endPage = computed(() => Math.min(startPage.value + props.pageSize - 1, totalPage.value))

// 페이지 리스트 생성
const pageList = computed(() => {
  const list = []
  for (let i = startPage.value; i <= endPage.value; i++) {
    list.push(i)
  }
  return list
})

// 페이지 이동
const goToPage = page => {
  if (page < 1 || page > totalPage.value) return
  emit('update:modelValue', page)
  emit('change', page)
}
</script>

<style scoped>
.paging {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.paging ul {
  display: flex;
  gap: 4px;
  list-style: none;
  padding: 0;
}

.paging .btn {
  width: 32px;
  height: 32px;
  border: 1px solid #ddd;
  background: #fff;
  cursor: pointer;
  border-radius: 4px;
}

.paging .btn:hover {
  background: #f5f5f5;
}

.paging .btn.active {
  background: #333;
  color: #fff;
  border-color: #333;
}

.paging .btn:disabled {
  opacity: 0.4;
  cursor: default;
}
</style>
