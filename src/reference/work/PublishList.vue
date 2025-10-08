<template>
  <div class="publish-list">
    <!-- 필터 -->
    <div class="filter-bar">
      <input v-model="search" placeholder="Depth 검색" class="input" />
      <select v-model="depth1" class="select">
        <option value="전체">전체 Depth1</option>
        <option v-for="depth in depth1Options" :key="depth" :value="depth">{{ depth }}</option>
      </select>
      <select v-model="status" class="select">
        <option value="전체">전체 상태</option>
        <option value="완료">완료</option>
        <option value="진행중">진행중</option>
        <option value="대기">대기</option>
      </select>
      <!-- 퍼블 시작일 -->
      <div class="filter-item">
        <label for="startDate">시작일</label>
        <input type="date" id="startDate" v-model="startDate" class="input" />
      </div>
      <!-- 개발시작일 -->
      <div class="filter-item">
        <label for="devStartDate">개발시작일</label>
        <input type="date" id="devStartDate" v-model="devStartDate" class="input" />
      </div>

      <!-- 디자인 유무 -->
      <div class="filter-item">
        <label for="hasDesign">디자인 유무</label>
        <select id="hasDesign" v-model="hasDesign" class="select">
          <option value="전체">전체</option>
          <option value="예">예</option>
          <option value="아니오">아니오</option>
        </select>
      </div>
    </div>

    <!-- 테이블 -->
    <div v-if="publishStore.loading">데이터 불러오는 중...</div>
    <div v-else>
      <table class="table">
        <colgroup>
          <col width="7%" />
          <col width="10%" />
          <col width="10%" />
          <col width="10%" />
          <col width="5%" />
          <col width="5%" />
          <col width="6%" />
          <col width="6%" />
          <col width="6%" />
          <col width="6%" />
          <col width="5%" />
          <col width="*" />
        </colgroup>
        <thead>
          <tr>
            <th>ID</th>
            <th>Depth1</th>
            <th>Depth2</th>
            <th>Depth3</th>
            <th>Type</th>
            <th>Status</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Modified Date</th>
            <th>Dev Start Date</th>
            <th>Has Design</th>
            <th>History</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(items, depth1) in publishStore.groupedByDepth1" :key="depth1">
            <tr v-for="(item, index) in items" :key="item.id">
              <td>{{ item.id }}</td>
              <td v-if="index === 0" :rowspan="items.length">{{ depth1 }}</td>
              <td>{{ item.depth2 || '-' }}</td>
              <td>{{ item.depth3 || '-' }}</td>
              <td>{{ item.type || '-' }}</td>
              <td>
                <span class="status-label" :class="statusClass(item.status)">{{
                  item.status
                }}</span>
              </td>
              <td>{{ item.startDate }}</td>
              <td>{{ item.endDate }}</td>
              <td class="modify">{{ item.modifiedDate }}</td>
              <td>{{ item.devStartDate }}</td>
              <td>{{ item.hasDesign ? '예' : '아니오' }}</td>
              <td>
                <ul class="history-list">
                  <li v-for="(h, i) in item.history" :key="i" v-html="h"></li>
                </ul>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from 'vue'
import { StatusType, usePublishStore } from '@/stores/publish.store'

export default defineComponent({
  setup() {
    const publishStore = usePublishStore()

    const search = ref('')
    const depth1 = ref('전체')
    const status = ref<StatusType>('전체')
    const startDate = ref('')
    const devStartDate = ref('')
    const hasDesign = ref<'전체' | '예' | '아니오'>('전체')

    watch(search, val => publishStore.setSearchKeyword(val))
    watch(status, val => publishStore.setStatusFilter(val))
    watch(depth1, val => publishStore.setDepth1Filter(val))
    watch(startDate, val => publishStore.setStartDateFilter(val))
    watch(devStartDate, val => publishStore.setDevStartDateFilter(val))
    watch(hasDesign, val => publishStore.setHasDesignFilter(val))

    const depth1Options = computed(() =>
      Array.from(new Set(publishStore.publishList.map(p => p.depth1)))
    )
    function statusClass(status: string) {
      if (status === '완료') return 'done'
      if (status === '진행중') return 'progress'
      if (status === '대기') return 'wait'
      return ''
    }
    return {
      publishStore,
      search,
      status,
      depth1,
      depth1Options,
      startDate,
      devStartDate,
      hasDesign,
      statusClass,
    }
  },
})
</script>

<style scoped>
.filter-bar {
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
}
.filter-item {
  display: flex;
  align-items: center;
  gap: 5px;
}
.filter-item label {
  font-size: 0.7rem;
}
.table {
  width: 100%;
  border-collapse: collapse;
}
th,
td {
  padding: 6px 8px;
  border: 1px solid #ddd;
  font-size: 0.8rem;
  font-weight: normal;
}
th {
  color: #666;
  background-color: #ddd;
}

.table ul {
  padding-left: 16px;
  margin: 0;
}
.filter-bar {
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}
.input,
.select {
  padding: 6px 8px;
  width: fit-content;
  font-size: 0.8rem;
}
.history-list li {
  margin-bottom: 2px;
  text-align: left;
  font-size: 0.8rem;
}
.status-label {
  border-radius: 3px;
  padding: 2px 5px 3px;
  width: fit-content;
  font-size: 0.7rem;
}
.done {
  background-color: #4caf50;
  color: white;
}
.progress {
  background-color: #ff9800;
  color: white;
}
.wait {
  background-color: #9e9e9e;
  color: white;
}
.modify {
  color: red;
}
</style>
