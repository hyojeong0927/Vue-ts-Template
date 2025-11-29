<template>
  <div class="sticky-table-wrapper">
    <!-- LEFT STICKY -->
    <div class="sticky-col left-col" v-if="leftColumns.length">
      <table>
        <colgroup>
          <col v-for="(w, i) in colWidths.left" :key="'l' + i" :style="{ width: w + 'px' }" />
        </colgroup>

        <thead :class="{ fixed: headerFixed }">
          <tr>
            <th v-for="col in leftColumns" :key="col.key">
              <!-- 체크박스 전체 선택 -->
              <template v-if="col.type === 'checkbox'">
                <input type="checkbox" v-model="allSelected" @change="toggleSelectAll" />
              </template>

              <!-- 일반 헤더 -->
              <template v-else>
                {{ col.label }}
              </template>
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(row, rIndex) in rows" :key="rIndex">
            <td v-for="col in leftColumns" :key="col.key">
              <!-- 체크박스 ROW -->
              <template v-if="col.type === 'checkbox'">
                <input type="checkbox" :value="row" v-model="selectedRows" />
              </template>

              <!-- SLOT -->
              <template v-else-if="col.slot">
                <slot :name="col.slot" :row="row" :value="row[col.key]" />
              </template>

              <!-- TEXT -->
              <template v-else>
                {{ row[col.key] }}
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- CENTER TABLE (기준) -->
    <div class="scroll-body" ref="bodyRef" @scroll="syncScroll">
      <table ref="centerTableRef">
        <colgroup>
          <col v-for="(w, i) in colWidths.center" :key="'c' + i" :style="{ width: w + 'px' }" />
        </colgroup>

        <thead :class="{ fixed: headerFixed }">
          <tr>
            <th v-for="col in centerColumns" :key="col.key">
              {{ col.label }}
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(row, rIndex) in rows" :key="rIndex">
            <td v-for="col in centerColumns" :key="col.key">
              <template v-if="col.slot">
                <slot :name="col.slot" :row="row" :value="row[col.key]" />
              </template>

              <template v-else>
                {{ row[col.key] }}
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- RIGHT STICKY -->
    <div class="sticky-col right-col" v-if="rightColumns.length">
      <table>
        <colgroup>
          <col v-for="(w, i) in colWidths.right" :key="'r' + i" :style="{ width: w + 'px' }" />
        </colgroup>

        <thead :class="{ fixed: headerFixed }">
          <tr>
            <th v-for="col in rightColumns" :key="col.key">
              {{ col.label }}
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(row, rIndex) in rows" :key="rIndex">
            <td v-for="col in rightColumns" :key="col.key">
              <template v-if="col.slot">
                <slot :name="col.slot" :row="row" :value="row[col.key]" />
              </template>

              <template v-else>
                {{ row[col.key] }}
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, nextTick, onMounted } from 'vue'

/* -------- PROPS -------- */
const props = defineProps({
  columns: Array,
  rows: Array,
  checkbox: { type: Boolean, default: false },
  headerFixed: { type: Boolean, default: true },
})

/* -------- 1. 내부 columns 구성 -------- */
const internalColumns = ref([])

const buildColumns = () => {
  if (props.checkbox) {
    internalColumns.value = [
      { key: '__check__', label: '', type: 'checkbox', sticky: 'left' },
      ...props.columns,
    ]
  } else {
    internalColumns.value = [...props.columns]
  }
}

buildColumns()

watch(() => props.columns, buildColumns, { deep: true })

watch(
  () => props.checkbox,
  val => {
    buildColumns()
    if (!val) {
      selectedRows.value = []
      allSelected.value = false
    }
  }
)

/* -------- 2. 컬럼 분리 -------- */
const leftColumns = computed(() => internalColumns.value.filter(c => c.sticky === 'left'))
const rightColumns = computed(() => internalColumns.value.filter(c => c.sticky === 'right'))
const centerColumns = computed(() => internalColumns.value.filter(c => !c.sticky))

/* -------- 3. 체크박스 선택 기능 -------- */
const selectedRows = ref([])
const allSelected = ref(false)

const toggleSelectAll = () => {
  props.rows && props.rows.length
    ? (selectedRows.value = [...props.rows])
    : (selectedRows.value = [])
}

watch(selectedRows, () => {
  allSelected.value = selectedRows.value.length === props.rows.length && props.rows.length > 0
})

/* -------- 4. 폭 자동 계산 -------- */
const centerTableRef = ref(null)

const colWidths = ref({
  left: [],
  center: [],
  right: [],
})

const updateWidths = () => {
  const ths = centerTableRef.value?.querySelectorAll('thead th')
  if (!ths) return

  const widths = Array.from(ths).map(th => th.offsetWidth)
  colWidths.value.center = widths

  // left widths
  colWidths.value.left = leftColumns.value.map((_, i) => widths[i])

  // right widths
  const start = widths.length - rightColumns.value.length
  colWidths.value.right = rightColumns.value.map((_, i) => widths[start + i])
}

onMounted(async () => {
  await nextTick()
  updateWidths()

  window.addEventListener('resize', () => {
    updateWidths()
  })
})

/* -------- 5. 스크롤 동기화 -------- */
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
  position: relative;
}

/* 공통 */
table {
  border-collapse: collapse;
  width: 100%;
}
th,
td {
  padding: 10px;
  white-space: nowrap;
  border-bottom: 1px solid #eee;
  background: #fff;
}

/* 헤더 고정 */
thead.fixed th {
  position: sticky;
  top: 0;
  background: #fff;
  z-index: 30;
}

/* 왼쪽 / 오른쪽 고정 */
.sticky-col {
  position: sticky;
  top: 0;
  z-index: 10;
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

/* 중앙 스크롤 */
.scroll-body {
  flex: 1;
  overflow: auto;
  max-height: 300px;
}
</style>
