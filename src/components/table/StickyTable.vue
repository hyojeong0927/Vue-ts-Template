<template>
  <div class="sticky-table-wrapper">
    <!-- LEFT STICKY -->
    <div class="sticky-col left-col" v-if="leftColumns.length">
      <table>
        <thead :class="{ fixed: headerFixed }">
          <tr>
            <th v-for="col in leftColumns" :key="col.key">
              {{ col.label }}
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(row, r) in rows" :key="r">
            <td v-for="col in leftColumns" :key="col.key">
              {{ row[col.key] }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- CENTER SCROLL -->
    <div class="scroll-body" ref="bodyRef" @scroll="syncScroll">
      <table>
        <thead :class="{ fixed: headerFixed }">
          <tr>
            <th v-for="col in centerColumns" :key="col.key">
              {{ col.label }}
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(row, r) in rows" :key="r">
            <td v-for="col in centerColumns" :key="col.key">
              {{ row[col.key] }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- RIGHT STICKY -->
    <div class="sticky-col right-col" v-if="rightColumns.length">
      <table>
        <thead :class="{ fixed: headerFixed }">
          <tr>
            <th v-for="col in rightColumns" :key="col.key">
              {{ col.label }}
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(row, r) in rows" :key="r">
            <td v-for="col in rightColumns" :key="col.key">
              {{ row[col.key] }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  columns: Array,
  rows: Array,
  headerFixed: { type: Boolean, default: true }, // ← 옵션 추가
})

/* 컬럼 분리 */
const leftColumns = props.columns.filter(c => c.sticky === 'left')
const rightColumns = props.columns.filter(c => c.sticky === 'right')
const centerColumns = props.columns.filter(c => !c.sticky)

/* 스크롤 동기화 */
const bodyRef = ref(null)

const syncScroll = () => {
  const top = bodyRef.value.scrollTop
  const left = document.querySelector('.left-col')
  const right = document.querySelector('.right-col')

  if (left) left.scrollTop = top
  if (right) right.scrollTop = top
}
</script>

<style scoped>
.sticky-table-wrapper {
  display: flex;
  width: 100%;
  border: 1px solid #ccc;
}

/* SHARED TABLE */
table {
  border-collapse: collapse;
  width: 100%;
}

th,
td {
  padding: 10px;
  border-bottom: 1px solid #eee;
  background: #fff;
  white-space: nowrap;
}

/* 헤더 고정 클래스 */
thead.fixed th {
  position: sticky;
  top: 0;
  background: #fff;
  z-index: 20;
}

/* LEFT & RIGHT STICKY AREAS */
.sticky-col {
  position: sticky;
  top: 0;
  z-index: 10;
  background: #fff;
  height: 300px;
  overflow-y: hidden;
}

.left-col {
  left: 0;
  border-right: 1px solid #ddd;
}

.right-col {
  right: 0;
  border-left: 1px solid #ddd;
}

/* CENTER SCROLL */
.scroll-body {
  flex: 1;
  overflow: auto;
  max-height: 300px;
}
</style>
