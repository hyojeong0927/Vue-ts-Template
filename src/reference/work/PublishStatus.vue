<template>
  <div class="dashboard">
    <h2>퍼블리싱 현황판</h2>

    <!-- 요약 통계 -->
    <div class="summary">
      <div class="card total">
        <p class="label">전체</p>
        <p class="value">{{ publishStore.totalCount }}</p>
      </div>
      <div class="card done">
        <p class="label">완료</p>
        <p class="value">{{ publishStore.doneCount }}</p>
      </div>
      <div class="card progress">
        <p class="label">진행중</p>
        <p class="value">{{ publishStore.progressCount }}</p>
      </div>
      <div class="card wait">
        <p class="label">대기</p>
        <p class="value">{{ publishStore.waitCount }}</p>
      </div>
      <div class="card rate">
        <p class="label">완료율</p>
        <p class="value">{{ publishStore.doneRate }}</p>
      </div>
    </div>

    <!-- 리스트 -->
    <PublishList />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue'
import { usePublishStore } from '@/stores/publish.store'
import PublishList from './PublishList.vue'

export default defineComponent({
  components: { PublishList },
  setup() {
    const publishStore = usePublishStore()

    const category = ref<'전체' | 'main' | 'auth' | 'other'>('전체')

    onMounted(() => {
      publishStore.fetchPublishList()
    })

    watch(category, val => {
      publishStore.setCategoryFilter(val)
    })

    return { publishStore, category }
  },
})
</script>

<style scoped>
.dashboard {
  padding: 5px 20px 10px;
}
.summary {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}
.card {
  flex: 1;
  padding: 5px;
  border-radius: 8px;
  text-align: center;
  color: #fff;
  font-weight: bold;
}
.total {
  background-color: #666;
}
.done {
  background-color: #4caf50;
}
.progress {
  background-color: #ff9800;
}
.wait {
  background-color: #9e9e9e;
}
.rate {
  background-color: #2196f3;
}
.label {
  margin: 4px 0;
  font-size: 0.8rem;
}
.value {
  margin: 4px 0;
  font-size: 1rem;
}
</style>
