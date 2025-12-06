<template>
  <div class="table-wrapper">
    <div
      class="body-viewport"
      ref="viewportRef"
      @scroll="onScroll"
      :style="{
        maxHeight: maxHeight + 'px',
        '--header-height': headerHeight + 'px',
      }"
    >
      <table class="base-table">
        <!-- COLGROUP -->
        <colgroup>
          <col v-for="col in flatColumns" :key="col.key" :style="{ width: col.width || 'auto' }" />
        </colgroup>

        <!-- HEADER -->
        <thead>
          <tr v-for="(row, rIndex) in headerRows" :key="rIndex">
            <th
              v-for="cell in row"
              :key="cell._id"
              :rowspan="cell.rowSpan"
              :colspan="cell.colSpan"
              class="th sticky-th"
              :class="[
                cell.isGroup ? 'group-header' : '',
                cell.groupKey ? `group-${cell.groupKey}` : '',
                `depth-${cell.depth}`,
              ]"
              :style="{ top: `calc(var(--header-height) * -1 + ${rIndex * headerRowHeight}px)` }"
            >
              {{ cell.label }}
            </th>
          </tr>
        </thead>

        <!-- BODY -->
        <tbody>
          <tr class="spacer-row">
            <td :style="{ height: offsetTop + 'px' }" :colspan="flatColumns.length" />
          </tr>

          <tr
            v-for="(row, idx) in visibleRows"
            :key="row[rowKey] ?? idx"
            class="data-row"
            :class="{ 'row-selected': isRowSelected(row) }"
          >
            <td
              v-for="col in flatColumns"
              :key="col.key"
              class="td"
              :class="[col.align ? `is-${col.align}` : '']"
            >
              <!-- 체크박스 -->
              <template v-if="useCheckbox && col.type === 'checkbox'">
                <input type="checkbox" :checked="isChecked(row)" @change.stop="toggleCheck(row)" />
              </template>

              <!-- 라디오 -->
              <template v-else-if="useRadio && col.type === 'radio'">
                <input
                  type="radio"
                  :name="radioGroupName"
                  :checked="isRadioSelected(row)"
                  @change.stop="toggleRadio(row)"
                />
              </template>

              <!-- 기본 데이터 -->
              <template v-else>
                <!-- <slot :name="col.key" :row="row" :value="row[col.key]">
                  {{ row[col.key] }}
                </slot> -->
                <slot :name="col.key" :row="row">
                  {{ getCellValue(row, col) }}
                </slot>
              </template>
            </td>
          </tr>

          <tr class="spacer-row">
            <td :style="{ height: bottomSpacer + 'px' }" :colspan="flatColumns.length" />
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useVirtualScroll } from './useVirtualScroll'

const props = defineProps({
  columns: Array,
  rows: Array,
  rowKey: { type: String, default: 'id' },
  selectionMode: { type: String, default: 'none' },
  rowHeight: { type: Number, default: 40 },
  overscan: { type: Number, default: 8 },
  maxHeight: { type: Number, default: 440 },
  headerRowHeight: { type: Number, default: 36 },
})

const emit = defineEmits(['update:selectedKeys', 'update:selectedRadio'])

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

const getLeaf = col => (!col.children ? 1 : col.children.reduce((sum, c) => sum + getLeaf(c), 0))

const getMaxDepth = (cols, depth = 1) =>
  cols.reduce(
    (m, c) => (c.children ? Math.max(m, getMaxDepth(c.children, depth + 1)) : Math.max(m, depth)),
    depth
  )

const maxDepth = computed(() => getMaxDepth(props.columns))

/* ------------------------------------
   HEADER ROWS
------------------------------------ */
const headerRows = computed(() => {
  const rows = []

  const build = (cols, depth, parentKey = null) => {
    rows[depth] = rows[depth] || []

    cols.forEach(col => {
      const isGroup = !!col.children

      const cell = {
        _id: `${col.key}_${depth}_${rows[depth].length}`,
        label: col.label,
        isGroup,
        depth,
        groupKey: parentKey,
        colSpan: isGroup ? getLeaf(col) : 1,
        rowSpan: isGroup ? 1 : maxDepth.value - depth,
      }

      rows[depth].push(cell)

      if (isGroup) {
        build(col.children, depth + 1, col.key)
      }
    })
  }

  build(props.columns, 0)
  return rows
})

/* header 전체 높이 계산 */
const headerHeight = computed(() => headerRows.value.length * props.headerRowHeight)

/* ------------------------------------
   VIRTUAL SCROLL
------------------------------------ */
const rowCount = computed(() => props.rows.length)

const { viewportRef, startIndex, endIndex, offsetTop, visibleHeight, totalHeight, onScroll } =
  useVirtualScroll({
    rowCount,
    rowHeight: props.rowHeight,
    overscan: props.overscan,
  })

const visibleRows = computed(() => props.rows.slice(startIndex.value, endIndex.value))
const bottomSpacer = computed(() => totalHeight() - offsetTop.value - visibleHeight.value)

/* ------------------------------------
   SELECTION
------------------------------------ */
const useCheckbox = computed(() => props.selectionMode === 'checkbox')
const useRadio = computed(() => props.selectionMode === 'radio')

const selectedSet = ref(new Set())
const selectedRadio = ref(null)
const radioGroupName = `vr-${Math.random().toString(36).slice(2)}`

const toggleCheck = row => {
  const key = row[props.rowKey]
  selectedSet.value.has(key) ? selectedSet.value.delete(key) : selectedSet.value.add(key)
}

const isChecked = row => selectedSet.value.has(row[props.rowKey])

watch(selectedSet, val => {
  if (useCheckbox.value) emit('update:selectedKeys', [...val])
})

const toggleRadio = row => (selectedRadio.value = row[props.rowKey])
const isRadioSelected = row => selectedRadio.value === row[props.rowKey]

watch(selectedRadio, val => {
  if (useRadio.value) emit('update:selectedRadio', val)
})

const isRowSelected = row => {
  const key = row[props.rowKey]
  if (useCheckbox.value) return selectedSet.value.has(key)
  if (useRadio.value) return selectedRadio.value === key
  return false
}
</script>

<style scoped>
.table-wrapper {
  width: 100%;
  overflow: hidden;
}

/* ★ header 아래에서 스크롤 시작 */
.body-viewport {
  overflow-y: auto;
  overflow-x: auto;
  position: relative;
  padding-top: var(--header-height);
}

/* sticky header 보정 */
.sticky-th {
  position: sticky;
  top: calc(var(--header-height) * -1);
  background: #fff;
  z-index: 10;
  /* top은 JS에서 계산한 headerHeight 기반 */
}

.base-table {
  width: max-content;
  border-collapse: collapse;
}

th,
td {
  border: 1px solid #ddd;
  padding: 8px 10px;
  white-space: nowrap;
  font-size: 13px;
}

.group-header {
  background: #f3f4f6;
  font-weight: 600;
}

.row-selected {
  background: #e6f4ff;
}

.is-center {
  text-align: center;
}

.is-right {
  text-align: right;
}

.spacer-row td {
  border: none;
  padding: 0;
}
</style>
