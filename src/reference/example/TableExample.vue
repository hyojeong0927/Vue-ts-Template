<template>
  <TableWrap :columns="columns" :rows="rows" checkbox>
    <template #memoSlot="{ row }">
      <input v-model="row.memo" placeholder="메모 입력" />
    </template>

    <template #action="{ row }">
      <button @click="alert(row.name)">보기</button>
    </template>
  </TableWrap>
</template>

<script setup>
import TableWrap from '../../components/table/TableWrap.vue'

const columns = [
  {
    label: '그룹 정보',
    children: [
      { key: 'field01', label: '그룹1' },
      { key: 'field05', label: '그룹2' },
    ],
  },
  {
    label: '사용자 정보',
    children: [
      { key: 'name', label: '이름' },
      { key: 'email', label: '메일', type: 'email' },
      { key: 'position', label: '직책' },
    ],
  },
  { key: 'memo', label: '메모', slot: 'memoSlot' },
  { key: 'action', label: '관리', slot: 'action' },
]

// 실제 rowspan 테스트용 rows
const rows = [
  { field01: 'A', field05: 'A-1', id: 1, name: '김철수', position: '개발자', email: 'a1@g.com' },
  { field01: 'A', field05: 'A-1', id: 2, name: '김영희', position: 'PM', email: 'a2@g.com' },
  { field01: 'A', field05: 'A-2', id: 3, name: '박민수', position: '디자이너', email: 'a3@g.com' },

  { field01: 'B', field05: 'B-1', id: 4, name: '최가을', position: '개발자', email: 'b1@g.com' },
  { field01: 'B', field05: 'B-1', id: 5, name: '강동희', position: '개발자', email: 'b2@g.com' },
]
</script>
