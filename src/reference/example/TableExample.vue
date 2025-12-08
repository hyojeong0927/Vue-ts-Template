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
import TableWrap from '../../components/table/TableWrap-x.vue'

const columns = [
  // { key: '_radio', label: '', type: 'radio', align: 'center', width: '40px' },
  {
    key: '_checkbox',
    label: '',
    type: 'checkbox',
    align: 'center',
    width: '40px',
  },
  {
    key: 'groupInfo',
    label: '그룹 정보',
    children: [
      { key: 'field01', label: '그룹1', align: 'center', width: '80px' },
      { key: 'field05', label: '그룹2', align: 'center', width: '80px' },
    ],
  },
  {
    key: 'userInfo',
    label: '사용자 정보',
    children: [
      { key: 'name', label: '이름', align: 'left', width: '120px' },
      { key: 'email', label: '메일', type: 'email', align: 'center', width: '140px' },
      { key: 'position', label: '직책', align: 'left', width: '100px' },
    ],
  },
  { key: 'memo', label: '메모', slot: 'memoSlot', width: '200px' },
  { key: 'action', label: '관리', slot: 'action', align: 'center', width: '80px' },
  { key: 'memo', label: '메모', slot: 'memoSlot', width: '200px' },
  { key: 'action', label: '관리', slot: 'action', align: 'center', width: '80px' },
  { key: 'memo', label: '메모', slot: 'memoSlot', width: '100px' },
  { key: 'action', label: '관리', slot: 'action', align: 'center', width: '80px' },
  { key: 'memo', label: '메모', slot: 'memoSlot', width: '200px' },
  { key: 'action', label: '관리', slot: 'action', align: 'center', width: '80px' },
  { key: 'memo', label: '메모', slot: 'memoSlot', width: '100px' },
  { key: 'action', label: '관리', slot: 'action', align: 'center', width: '80px' },
  { key: 'memo', label: '메모', slot: 'memoSlot', width: '100px' },
  { key: 'action', label: '관리', slot: 'action', align: 'center', width: '80px' },
  { key: 'memo', label: '메모', slot: 'memoSlot', width: '100px' },
  { key: 'action', label: '관리', slot: 'action', align: 'center', width: '80px' },
  { key: 'memo', label: '메모', slot: 'memoSlot', width: '100px' },
  { key: 'action', label: '관리', slot: 'action', align: 'center', width: '80px' },
  { key: 'memo', label: '메모', slot: 'memoSlot', width: '100px' },
  { key: 'action', label: '관리', slot: 'action', align: 'center', width: '80px' },
  { key: 'memo', label: '메모', slot: 'memoSlot', width: '200px' },
  { key: 'action', label: '관리', slot: 'action', align: 'center', width: '80px' },
  { key: 'memo', label: '메모', slot: 'memoSlot', width: '200px' },
  { key: 'action', label: '관리', slot: 'action', align: 'center', width: '80px' },
  { key: 'memo', label: '메모', slot: 'memoSlot', width: '100px' },
  { key: 'action', label: '관리', slot: 'action', align: 'center', width: '80px' },
  { key: 'memo', label: '메모', slot: 'memoSlot', width: '200px' },
  { key: 'action', label: '관리', slot: 'action', align: 'center', width: '80px' },
  { key: 'memo', label: '메모', slot: 'memoSlot', width: '100px' },
  { key: 'action', label: '관리', slot: 'action', align: 'center', width: '80px' },
  { key: 'memo', label: '메모', slot: 'memoSlot', width: '100px' },
  { key: 'action', label: '관리', slot: 'action', align: 'center', width: '80px' },
  { key: 'memo', label: '메모', slot: 'memoSlot', width: '100px' },
  { key: 'action', label: '관리', slot: 'action', align: 'center', width: '80px' },
  { key: 'memo', label: '메모', slot: 'memoSlot', width: '100px' },
  { key: 'action', label: '관리', slot: 'action', align: 'center', width: '80px' },
  { key: 'memo', label: '메모', slot: 'memoSlot', width: '100px' },
  { key: 'action', label: '관리', slot: 'action', align: 'center', width: '80px' },
]

const rows = [
  {
    field01: 'A',
    field05: 'A-1',
    id: 1,
    name: '김철수',
    position: '개발자',
    email: 'a1@g.com',
    memo: '',
  },
  {
    field01: 'A',
    field05: 'A-1',
    id: 2,
    name: '김영희',
    position: 'PM',
    email: 'a2@g.com',
    memo: '',
  },
  {
    field01: 'A',
    field05: 'A-2',
    id: 3,
    name: '박민수',
    position: '디자이너',
    email: 'a3@g.com',
    memo: '',
  },
  {
    field01: 'B',
    field05: 'B-1',
    id: 4,
    name: '최가을',
    position: '개발자',
    email: 'b1@g.com',
    memo: '',
  },
  {
    field01: 'B',
    field05: 'B-1',
    id: 5,
    name: '강동희',
    position: '개발자',
    email: 'b2@g.com',
    memo: '',
  },
  {
    field01: 'A',
    field05: 'A-1',
    id: 1,
    name: '김철수',
    position: '개발자',
    email: 'a1@g.com',
    memo: '',
  },
  {
    field01: 'A',
    field05: 'A-1',
    id: 2,
    name: '김영희',
    position: 'PM',
    email: 'a2@g.com',
    memo: '',
  },
  {
    field01: 'A',
    field05: 'A-2',
    id: 3,
    name: '박민수',
    position: '디자이너',
    email: 'a3@g.com',
    memo: '',
  },
  {
    field01: 'B',
    field05: 'B-1',
    id: 4,
    name: '최가을',
    position: '개발자',
    email: 'b1@g.com',
    memo: '',
  },
  {
    field01: 'B',
    field05: 'B-1',
    id: 5,
    name: '강동희',
    position: '개발자',
    email: 'b2@g.com',
    memo: '',
  },
]
</script>
