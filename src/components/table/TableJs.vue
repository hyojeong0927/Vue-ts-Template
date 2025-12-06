<template>
  <div class="table-wrapper">
    <!-- 1) HEADER TABLE -->
    <div class="header-wrapper" ref="headerWrapper">
      <table class="header-table" ref="headerTable">
        <colgroup>
          <col v-for="(w, i) in colWidths" :key="i" :style="{ width: w + 'px' }" />
        </colgroup>

        <thead>
          <tr v-for="(row, rIndex) in headerRows" :key="rIndex">
            <th
              v-for="cell in row"
              :key="cell._id"
              :colspan="cell.colSpan"
              :rowspan="cell.rowSpan"
              class="th"
            >
              {{ cell.label }}
            </th>
          </tr>
        </thead>
      </table>
    </div>

    <!-- 2) BODY TABLE -->
    <div class="body-wrapper" ref="bodyWrapper" @scroll="syncScroll">
      <table class="body-table" ref="bodyTable">
        <colgroup>
          <col v-for="(w, i) in colWidths" :key="i" :style="{ width: w + 'px' }" />
        </colgroup>

        <tbody>
          <!-- top spacer -->
          <tr class="spacer-row">
            <td :style="{ height: offsetTop + 'px' }" :colspan="flatColumns.length" />
          </tr>

          <!-- visible rows -->
          <tr v-for="(row, idx) in visibleRows" :key="idx">
            <td v-for="col in flatColumns" :key="col.key" class="td">
              <!-- slot 우선 -->
              <slot :name="col.key" :row="row">
                {{ row[col.key] }}
              </slot>
            </td>
          </tr>

          <!-- bottom spacer -->
          <tr class="spacer-row">
            <td :style="{ height: bottomSpacer + 'px' }" :colspan="flatColumns.length" />
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useVirtualScroll } from './useVirtualScroll'

/* Props */
const props = defineProps({
  columns: Array,
  rows: Array,
  rowHeight: { type: Number, default: 40 },
  overscan: { type: Number, default: 8 },
})

/* ------------------------------------
   FLAT COLUMNS
------------------------------------ */
const flatColumns = computed(() => {
  const out = []
  const walk = cols => {
    cols.forEach(col => {
      if (col.children) walk(col.children)
      else out.push(col)
    })
  }
  walk(props.columns)
  return out
})

/* ------------------------------------
   HEADER GROUP BUILD
------------------------------------ */
const getLeaf = col => (!col.children ? 1 : col.children.reduce((sum, c) => sum + getLeaf(c), 0))

const getMaxDepth = (cols, depth = 1) =>
  cols.reduce(
    (m, c) => (c.children ? Math.max(m, getMaxDepth(c.children, depth + 1)) : Math.max(m, depth)),
    depth
  )

const maxDepth = computed(() => getMaxDepth(props.columns))

const headerRows = computed(() => {
  const rows = []

  const build = (cols, depth) => {
    rows[depth] = rows[depth] || []

    cols.forEach(col => {
      const cell = {
        _id: `${col.key}_${depth}_${rows[depth].length}`,
        label: col.label,
        colSpan: col.children ? getLeaf(col) : 1,
        rowSpan: col.children ? 1 : maxDepth.value - depth,
      }

      rows[depth].push(cell)

      if (col.children) build(col.children, depth + 1)
    })
  }

  build(props.columns, 0)
  return rows
})

/* ------------------------------------
   REFS
------------------------------------ */
const headerTable = ref(null)
const bodyWrapper = ref(null)
const headerWrapper = ref(null)
const colWidths = ref([])

/* ------------------------------------
   WIDTH SYNC (leaf header only)
------------------------------------ */
const syncWidths = () => {
  const allTh = headerTable.value.querySelector('tbody td')

  const leafThList = Array.from(allTh).filter(td => {
    return td.colSpan === 1 // leaf header의 유일한 특징
  })

  const widths = leafThList.map(td => td.offsetWidth)

  colWidths.value = widths
}

/* ------------------------------------
   SCROLL SYNC
------------------------------------ */
const syncScroll = () => {
  headerWrapper.value.scrollLeft = bodyWrapper.value.scrollLeft
}

/* ------------------------------------
   VIRTUAL SCROLL
------------------------------------ */
const rowCount = computed(() => props.rows.length)

const { offsetTop, startIndex, endIndex, visibleHeight, totalHeight } = useVirtualScroll({
  rowCount,
  rowHeight: props.rowHeight,
  overscan: props.overscan,
})

const visibleRows = computed(() => props.rows.slice(startIndex.value, endIndex.value))

const bottomSpacer = computed(() => totalHeight() - offsetTop.value - visibleHeight.value)

/* ------------------------------------
   INIT
------------------------------------ */
onMounted(async () => {
  await nextTick()
  syncWidths()
  window.addEventListener('resize', syncWidths)
})
</script>

<style scoped>
.table-wrapper {
  width: 100%;
  border: 1px solid #ddd;
  box-sizing: border-box;
}

/* HEADER */
.header-wrapper {
  overflow: hidden;
  background: #fff;
  border-bottom: 1px solid #ddd;
}

.header-table {
  width: max-content;
  table-layout: fixed;
  border-collapse: collapse;
}

/* BODY */
.body-wrapper {
  overflow-y: auto;
  overflow-x: auto;
  max-height: 400px;
  background: #fff;
}

.body-table {
  width: max-content;
  table-layout: fixed;
  border-collapse: collapse;
}

th,
td {
  padding: 8px 12px;
  border: 1px solid #ddd;
  background: #fff;
  white-space: nowrap;
}

.spacer-row td {
  border: none;
  padding: 0;
  background: transparent;
}
</style>
