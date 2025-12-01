<template>
  <div>
    <BaseStickyTable :columns="columns2" :rows="rows2" header-fixed checkbox> </BaseStickyTable>
  </div>
</template>

<script setup>
import BaseStickyTable from '../../components/table/StickyTable.vue'
const columns2 = [
  {
    label: '사용자 정보',
    children: [{ key: 'name', label: '이름' }],
  },
  {
    label: '연락처',
    children: [
      { key: 'email', label: '이메일' },
      { key: 'phone', label: '전화번호', sticky: 'right' },
    ],
  },
]

const rows2 = Array.from({ length: 50 }).map((_, i) => ({
  id: i + 1,
  name: `사용자${i + 1}`,
  position: ['디자이너', '개발자', 'PM'][i % 3],
  age: 20 + (i % 10),
  email: `user${i + 1}@email.com`,
  phone: '010-0000-0000',
}))
</script>

<style lang="scss" scoped></style>
