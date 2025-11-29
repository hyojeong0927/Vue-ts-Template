<template>
  <TableWrap :columns="columns1" :rows="rows1" checkbox>
    <!-- 액션 영역 -->
    <template #action="{ row }">
      <button @click="alert(row.name)">보기</button>
    </template>
    <!-- 특정 인덱스(예: memo 컬럼)에 input text 삽입 -->
    <template #memoSlot="{ row }">
      <input type="text" v-model="row.memo" placeholder="메모 입력" style="width: 100%" />
    </template>
  </TableWrap>
  <br />
  <BaseStickyTable :columns="columns2" :rows="rows2" header-fixed checkbox>
    <template #action="{ row }">
      <button @click="alert(row.name)">보기</button>
    </template>
  </BaseStickyTable>
</template>

<script setup>
import TableWrap from '../../components/table/TableWrap.vue'
import BaseStickyTable from '../../components/table/StickyTable.vue'

const columns1 = [
  { key: 'id', label: 'ID', width: '80px', align: 'center' },
  { key: 'name', label: '이름', width: '150px', sticky: 'left' },
  { key: 'position', label: '직책', width: '150px', type: 'link' },
  { key: 'email', label: '이메일', width: '250px', type: 'email' },
  { key: 'memo', label: '메모', slot: 'memoSlot' },
  { key: 'action', label: '관리', slot: 'action', width: '120px', align: 'center' },
]

const rows1 = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  name: `사용자${i + 1}`, // name 자동 생성
  position: ['디자이너', '개발자', 'PM'][i % 3], // 기준 key 유지 + 반복 사용
  email: `test${i + 1}@example.com`, // email 자동 생성
}))

const columns2 = [
  { key: 'id', label: 'ID', sticky: 'left' },
  { key: 'name', label: '이름', sticky: 'left' },
  { key: 'email', label: '이메일' },
  { key: 'age', label: '나이' },
  { key: 'job', label: '직업' },
  { key: 'phone', label: '전화번호', sticky: 'right' },
]

const rows2 = Array.from({ length: 50 }).map((_, i) => ({
  id: i + 1,
  name: `사용자${i + 1}`,
  email: `user${i + 1}@email.com`,
  age: 20 + (i % 10),
  job: '개발자',
  phone: '010-0000-0000',
}))
</script>

<style lang="scss" scoped></style>
