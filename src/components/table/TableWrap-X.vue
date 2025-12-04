<template>
  <div class="table-container" ref="containerRef">
    <!-- 스크롤은 여기 한 군데에서만 발생 -->
    <div class="table-scroll" ref="scrollRef">
      <table class="base-table" ref="tableRef">
        <colgroup>
          <col
            v-for="(col, i) in flatColumns"
            :key="'col-' + i"
            :style="{
              width: colWidths[i] + 'px',
              minWidth: col.minWidth ? col.minWidth : colWidths[i] + 'px',
              maxWidth: col.maxWidth ? col.maxWidth : colWidths[i] + 'px',
            }"
          />
        </colgroup>

        <thead>
          <tr v-for="(row, rIndex) in headerRows" :key="'hr-' + rIndex">
            <th
              v-for="cell in row"
              :key="cell._id"
              class="th"
              :class="[
                cell.children?.length ? 'group-header' : '',
                cell.align ? `align-${cell.align}` : '',
              ]"
              :rowspan="cell.rowSpan"
              :colspan="cell.colSpan"
            >
              {{ cell.label }}
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(row, rIndex) in rows" :key="'r-' + rIndex">
            <td
              v-for="col in flatColumns"
              :key="col.key"
              class="td"
              :class="col.align ? `align-${col.align}` : ''"
            >
              <!-- RADIO -->
              <template v-if="col.type === 'radio' && radio">
                <input
                  type="radio"
                  name="table-radio"
                  :value="rIndex"
                  v-model="selectedRadio"
                  @change="emitSelectRadio"
                />
              </template>

              <!-- CHECKBOX -->
              <template v-else-if="col.type === 'checkbox' && checkbox">
                <input
                  type="checkbox"
                  :value="rIndex"
                  v-model="selectedRows"
                  @change="emitSelect"
                />
              </template>

              <!-- EMAIL -->
              <template v-else-if="col.type === 'email'">
                <a :href="`mailto:${row[col.key]}`">{{ row[col.key] }}</a>
              </template>

              <!-- LINK -->
              <template v-else-if="col.type === 'link'">
                <a :href="row[col.key]" target="_blank">{{ row[col.key] }}</a>
              </template>

              <!-- SLOT -->
              <template v-else-if="col.slot">
                <slot :name="col.slot" :row="row" :value="row[col.key]" />
              </template>

              <!-- DEFAULT TEXT -->
              <template v-else>
                {{ row[col.key] }}
              </template>
            </td>
          </tr>

          <tr v-if="rows.length === 0">
            <td :colspan="flatColumns.length" class="no-data">데이터가 없습니다.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, onBeforeUnmount, watch } from 'vue'

const emit = defineEmits(['update:selected', 'update:radio'])

const props = defineProps({
  columns: { type: Array, required: true },
  rows: { type: Array, required: true },
  checkbox: { type: Boolean, default: false },
  radio: { type: Boolean, default: false },
})

/* ------------------------------------------
 * HEADER 구조 생성 (그룹 헤더)
 * ------------------------------------------ */
const countLeaf = c => (c.children?.length ? c.children.reduce((s, v) => s + countLeaf(v), 0) : 1)

const getMaxDepth = cols => {
  const depth = c => (c.children?.length ? 1 + Math.max(...c.children.map(depth)) : 1)
  return Math.max(...cols.map(depth))
}

const headerRows = computed(() => {
  const root = props.columns
  const maxDepth = getMaxDepth(root)
  const rows = Array.from({ length: maxDepth }, () => [])
  let uid = 0

  const walk = (cols, depth) => {
    cols.forEach(col => {
      const isGroup = col.children?.length
      const cell = { ...col, _id: uid++ }

      cell.colSpan = isGroup ? countLeaf(col) : 1
      cell.rowSpan = isGroup ? 1 : maxDepth - depth

      rows[depth].push(cell)
      if (isGroup) walk(col.children, depth + 1)
    })
  }

  walk(root, 0)
  return rows
})

/* ------------------------------------------
 * Leaf Columns (tbody에서 쓸 컬럼)
 * ------------------------------------------ */
const flatColumns = computed(() => {
  const list = []
  const walk = cols => {
    cols.forEach(col => {
      if (col.children?.length) walk(col.children)
      else list.push(col)
    })
  }
  walk(props.columns)
  return list
})

/* ------------------------------------------
 * 체크박스 / 라디오
 * ------------------------------------------ */
const selectedRows = ref([])
const selectedRadio = ref(null)

const emitSelect = () => emit('update:selected', selectedRows.value)
const emitSelectRadio = () => emit('update:radio', selectedRadio.value)

/* ------------------------------------------
 * Width 측정 (tbody 기준)
 * ------------------------------------------ */
const containerRef = ref(null)
const scrollRef = ref(null)
const tableRef = ref(null)

const colWidths = ref([])

const measureColWidths = async () => {
  await nextTick()

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const firstRow = tableRef.value?.querySelector('tbody tr')

      if (!firstRow) {
        // rows가 없을 때: width / minWidth 기본값 사용
        colWidths.value = flatColumns.value.map(col => {
          if (col.width) return parseInt(col.width)
          if (col.minWidth) return parseInt(col.minWidth)
          return 80
        })
        return
      }

      const bodyWidths = Array.from(firstRow.children).map(td => td.getBoundingClientRect().width)

      const finalWidths = flatColumns.value.map((col, i) => {
        let w = bodyWidths[i] || 80
        if (col.width) w = parseInt(col.width)
        if (col.minWidth) w = Math.max(w, parseInt(col.minWidth))
        if (col.maxWidth) w = Math.min(w, parseInt(col.maxWidth))
        return w
      })

      colWidths.value = finalWidths
    })
  })
}

/* ------------------------------------------
 * Lifecycle
 * ------------------------------------------ */
let resizeObserver = null

onMounted(() => {
  measureColWidths()

  resizeObserver = new ResizeObserver(() => measureColWidths())
  resizeObserver.observe(containerRef.value)

  window.addEventListener('resize', measureColWidths)
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  window.removeEventListener('resize', measureColWidths)
})

watch(
  () => props.rows,
  () => {
    selectedRows.value = []
    selectedRadio.value = null
    measureColWidths()
  },
  { deep: true }
)

watch(
  () => props.columns,
  () => {
    measureColWidths()
  },
  { deep: true }
)
</script>

<style scoped>
.table-container {
  border: 1px solid #ddd;
  position: relative;
  overflow: hidden;
}

/* 스크롤은 여기서만 발생 */
.table-scroll {
  max-height: 360px;
  overflow-y: auto;
  overflow-x: auto;
}

/* 하나의 테이블에 sticky header 적용 */
.base-table {
  table-layout: fixed;
  width: max-content;
  min-width: 100%;
  border-collapse: collapse;
}

/* sticky header: 세로만 고정, 가로는 같이 스크롤 */
.base-table thead th {
  position: sticky;
  top: 0;
  z-index: 5;
  background: #fff;
}

/* 그룹 헤더 스타일 */
.group-header {
  background: #f8f8f8;
  font-weight: 600;
  border-bottom: 1px solid #ddd;
}

/* 정렬 */
.align-left {
  text-align: left;
}
.align-center {
  text-align: center;
}
.align-right {
  text-align: right;
}

/* 셀 공통 스타일 */
.th,
.td {
  padding: 12px;
  border-bottom: 1px solid #eee;
  border-right: 1px solid #ddd;
  white-space: nowrap;
  background: #fff;
  overflow: hidden;
  text-overflow: ellipsis;
  box-sizing: border-box;
}

/* no data */
.no-data {
  text-align: center;
  padding: 20px;
}
</style>
