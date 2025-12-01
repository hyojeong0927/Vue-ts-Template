<template>
  <div class="table-container" ref="containerRef">
    <!-- HEADER -->
    <table class="base-table header-table" ref="theadTable">
      <colgroup>
        <col
          v-for="(col, i) in flatColumns"
          :key="'h-' + i"
          :style="{
            width: colWidths[i] + 'px',
            minWidth: colWidths[i] + 'px',
            maxWidth: colWidths[i] + 'px',
          }"
        />
      </colgroup>

      <thead>
        <tr v-for="(row, rIndex) in headerRows" :key="'header-row-' + rIndex">
          <th
            v-for="cell in row"
            :key="cell._id"
            class="th"
            :rowspan="cell.rowSpan"
            :colspan="cell.colSpan"
            :ref="el => setHeaderCellRef(el, cell)"
          >
            <!-- 체크박스 헤더 -->
            <template v-if="cell.type === 'checkbox-header'">
              <input type="checkbox" v-model="allChecked" @change="toggleAll" />
            </template>

            <!-- 일반 헤더 -->
            <template v-else>
              {{ cell.label }}
            </template>
          </th>
        </tr>
      </thead>
    </table>

    <!-- BODY -->
    <div class="tbody-wrapper" ref="tbodyWrapper">
      <table class="base-table body-table" ref="tbodyTable">
        <colgroup>
          <col
            v-for="(col, i) in flatColumns"
            :key="'b-' + i"
            :style="{
              width: colWidths[i] + 'px',
              minWidth: colWidths[i] + 'px',
              maxWidth: colWidths[i] + 'px',
            }"
          />
        </colgroup>

        <tbody>
          <tr v-for="(row, rIndex) in rows" :key="'row-' + rIndex">
            <td
              v-for="col in flatColumns"
              :key="col.key"
              class="td"
              :rowspan="getRowspan(col, rIndex)"
              :style="getCellStyle(col, rIndex)"
            >
              <!-- 체크박스 -->
              <template v-if="col.type === 'checkbox' && checkbox">
                <input
                  type="checkbox"
                  :value="rIndex"
                  v-model="selectedRows"
                  @change="emitSelect"
                />
              </template>

              <!-- 이메일 -->
              <template v-else-if="col.type === 'email'">
                <a :href="`mailto:${row[col.key]}`">{{ row[col.key] }}</a>
              </template>

              <!-- 링크 -->
              <template v-else-if="col.type === 'link'">
                <a :href="row[col.key]" target="_blank">{{ row[col.key] }}</a>
              </template>

              <!-- 슬롯 -->
              <template v-else-if="col.slot">
                <slot :name="col.slot" :row="row" :value="row[col.key]" />
              </template>

              <!-- 기본 텍스트 -->
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
import { ref, computed, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'

const emit = defineEmits(['update:selected'])

const props = defineProps({
  columns: { type: Array, required: true },
  rows: { type: Array, required: true },
  checkbox: { type: Boolean, default: false },
})

// --------------------
// BODY ROWSPAN TARGET
// --------------------
const ROWSPAN_COLUMNS = ['field01', 'field05']

/* -----------------------------------------------------------
 * 1) HEADER 구조 → headerRows, flatColumns
 * ----------------------------------------------------------- */

const headerRootColumns = computed(() => {
  if (!props.checkbox) return props.columns
  return [
    {
      key: '_checkbox',
      label: '',
      type: 'checkbox-header',
    },
    ...props.columns,
  ]
})

// leaf 개수
const countLeaf = col => {
  if (col.children && col.children.length) {
    return col.children.reduce((sum, c) => sum + countLeaf(c), 0)
  }
  return 1
}

// header 최대 depth 계산
const getMaxDepth = cols => {
  const dfs = col =>
    col.children && col.children.length ? 1 + Math.max(...col.children.map(dfs)) : 1
  return Math.max(...cols.map(dfs))
}

// headerRows 만들기
const headerRows = computed(() => {
  const root = headerRootColumns.value
  if (!root.length) return []

  const maxDepth = getMaxDepth(root)
  const rows = Array.from({ length: maxDepth }, () => [])
  let uid = 0

  const walk = (cols, depth) => {
    cols.forEach(col => {
      const isGroup = col.children && col.children.length > 0
      const cell = { ...col, _id: uid++ }

      if (isGroup) {
        cell.colSpan = countLeaf(col)
        cell.rowSpan = 1
      } else {
        cell.colSpan = 1
        cell.rowSpan = col.rowSpan ?? maxDepth - depth
      }

      rows[depth].push(cell)

      if (isGroup) walk(col.children, depth + 1)
    })
  }

  walk(root, 0)
  return rows
})

// leaf-only columns (tbody 렌더링 대상)
const flatColumns = computed(() => {
  const list = []
  const walk = cols => {
    cols.forEach(col => {
      if (col.children && col.children.length) walk(col.children)
      else {
        if (col.type === 'checkbox-header') {
          list.push({ key: '_checkbox', type: 'checkbox' })
        } else list.push(col)
      }
    })
  }
  walk(headerRootColumns.value)
  return list
})

/* -----------------------------------------------------------
 * 2) BODY 자동 rowspan
 * ----------------------------------------------------------- */

const rowspanMap = ref({})

const computeRowspan = () => {
  const map = {}

  ROWSPAN_COLUMNS.forEach(key => {
    const spans = Array(props.rows.length).fill(0)

    let start = 0
    while (start < props.rows.length) {
      const val = props.rows[start]?.[key]
      let end = start + 1

      while (end < props.rows.length && props.rows[end]?.[key] === val) {
        end++
      }

      spans[start] = end - start
      start = end
    }
    map[key] = spans
  })

  rowspanMap.value = map
}

const isRowspanCol = col => ROWSPAN_COLUMNS.includes(col.key)

const getRowspan = (col, rIndex) => {
  if (!isRowspanCol(col)) return 1
  const span = rowspanMap.value[col.key]?.[rIndex] || 0
  return span > 0 ? span : 1
}

const getCellStyle = (col, rIndex) => {
  if (isRowspanCol(col)) {
    if (rowspanMap.value[col.key]?.[rIndex] === 0) return { display: 'none' }
  }
  return {}
}

/* -----------------------------------------------------------
 * 3) 체크박스 동기화
 * ----------------------------------------------------------- */

const selectedRows = ref([])
const allChecked = ref(false)

const emitSelect = () => {
  allChecked.value = props.rows.length > 0 && selectedRows.value.length === props.rows.length
  emit('update:selected', selectedRows.value)
}

const toggleAll = () => {
  if (allChecked.value) {
    selectedRows.value = props.rows.map((_, i) => i)
  } else {
    selectedRows.value = []
  }
  emitSelect()
}

/* -----------------------------------------------------------
 * 4) WIDTH 측정 (해상도 변화에도 정확)
 * ----------------------------------------------------------- */

const containerRef = ref(null)
const theadTable = ref(null)
const tbodyTable = ref(null)

const colWidths = ref([])

const headerLeafRefs = ref([])

const setHeaderCellRef = (el, cell) => {
  if (!el) return

  // 그룹 헤더는 대상 아님
  if (cell.children && cell.children.length) return

  const idx = flatColumns.value.findIndex(c => {
    if (cell.type === 'checkbox-header') return c.key === '_checkbox'
    return c.key === cell.key
  })

  if (idx !== -1) headerLeafRefs.value[idx] = el
}

// ⚡ 고정된 방식: header-leaf + body-leaf 중 더 큰 값으로 동일화
const measureColWidths = () => {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const headerWidths = headerLeafRefs.value.map(el => (el ? el.offsetWidth : 0))

      const firstRow = tbodyTable.value?.querySelector('tbody tr')
      const bodyWidths = firstRow
        ? Array.from(firstRow.children).map(td => td.offsetWidth || 0)
        : []

      const finalWidths = headerWidths.map((hw, i) => Math.max(hw, bodyWidths[i] || 0))

      colWidths.value = finalWidths
    })
  })
}

let resizeObserver = null
let dprWatcher = null
let lastDPR = window.devicePixelRatio

onMounted(() => {
  computeRowspan()
  measureColWidths()

  resizeObserver = new ResizeObserver(() => measureColWidths())
  resizeObserver.observe(containerRef.value)

  dprWatcher = setInterval(() => {
    if (window.devicePixelRatio !== lastDPR) {
      lastDPR = window.devicePixelRatio
      measureColWidths()
    }
  }, 300)

  window.addEventListener('resize', measureColWidths)
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  clearInterval(dprWatcher)
  window.removeEventListener('resize', measureColWidths)
})

/* -----------------------------------------------------------
 * 5) watchers
 * ----------------------------------------------------------- */

watch(
  () => props.rows,
  () => {
    selectedRows.value = []
    allChecked.value = false
    computeRowspan()
    measureColWidths()
  },
  { deep: true }
)

watch(
  () => props.columns,
  () => {
    headerLeafRefs.value = []
    measureColWidths()
  },
  { deep: true }
)

watch(
  () => props.checkbox,
  () => {
    selectedRows.value = []
    allChecked.value = false
    headerLeafRefs.value = []
    measureColWidths()
  }
)
</script>

<style scoped>
.table-container {
  position: relative;
  border: 1px solid #ddd;
  overflow-x: hidden;
}

.base-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

.header-table {
  width: 100%;
}

.tbody-wrapper {
  max-height: 360px;
  overflow-y: auto;
  overflow-x: hidden;
}

.th,
.td {
  padding: 12px;
  white-space: nowrap;
  border-bottom: 1px solid #eee;
  border-left: 1px solid #ddd;
  background: #fff;
  font-size: 14px;
}

.no-data {
  text-align: center;
  padding: 20px;
}
</style>
