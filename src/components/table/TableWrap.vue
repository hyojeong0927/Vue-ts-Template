<template>
  <div class="table-container" ref="containerRef">
    <!-- HEADER (스크롤 밖, sticky) -->
    <table class="base-table header-table" ref="theadTable">
      <colgroup>
        <col
          v-for="(col, i) in flatColumns"
          :key="'h-' + i"
          :style="{ width: colWidths[i] + 'px' }"
        />
      </colgroup>

      <thead>
        <tr v-for="(row, rIndex) in headerRows" :key="'hr-' + rIndex">
          <th
            v-for="cell in row"
            :key="cell._id"
            class="th"
            :rowspan="cell.rowSpan"
            :colspan="cell.colSpan"
            :class="[
              cell.children?.length ? 'group-header' : '',
              cell.align ? `align-${cell.align}` : '',
              cell.isGroup ? 'group-header' : 'leaf-header',
              cell.parentKey ? `group-${cell.parentKey}` : '',
            ]"
          >
            <span class="cell">{{ cell.label }}</span>
          </th>
        </tr>
      </thead>
    </table>

    <!-- BODY (스크롤되는 영역) -->
    <div
      class="scroll-body"
      ref="scrollWrapper"
      @scroll="syncScrollX"
      :class="{ 'force-x-scroll': forceHorizontalScroll }"
    >
      <table class="base-table body-table" ref="tbodyTable">
        <colgroup>
          <col
            v-for="(col, i) in flatColumns"
            :key="'b-' + i"
            :style="{ width: colWidths[i] + 'px' }"
          />
        </colgroup>

        <tbody>
          <tr
            v-for="(row, rIndex) in rows"
            :key="'r-' + rIndex"
            :class="{ 'row-selected': isRowSelected(rIndex) }"
            @click="handleRowClick(rIndex)"
          >
            <td
              v-for="col in flatColumns"
              :key="col.key"
              class="td"
              :class="[col.align ? `align-${col.align}` : '']"
            >
              <!-- RADIO -->
              <template v-if="col.type === 'radio' && radio">
                <input
                  type="radio"
                  name="table-radio"
                  :value="rIndex"
                  v-model="selectedRadio"
                  @change="emitSelectRadio"
                  @click.stop
                />
              </template>

              <!-- CHECKBOX -->
              <template v-else-if="col.type === 'checkbox' && checkbox">
                <input
                  type="checkbox"
                  :value="rIndex"
                  v-model="selectedRows"
                  @change="emitSelect"
                  @click.stop
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

              <!-- SLOT -->
              <template v-else-if="col.slot">
                <slot :name="col.slot" :row="row" :value="row[col.key]" />
              </template>

              <!-- 기본 -->
              <template v-else>
                <span class="cell">{{ row[col.key] }}</span>
              </template>
            </td>
          </tr>

          <!-- 데이터 없음 -->
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
  forceHorizontalScroll: { type: Boolean, default: false },
})

/* -------------------------
   HEADER GROUP 구조 계산
------------------------- */
const countLeaf = c => (c.children?.length ? c.children.reduce((s, v) => s + countLeaf(v), 0) : 1)

const getMaxDepth = cols => {
  const depth = c => (c.children?.length ? 1 + Math.max(...c.children.map(depth)) : 1)
  return Math.max(...cols.map(depth))
}

const headerRows = computed(() => {
  const maxDepth = getMaxDepth(props.columns)
  const rows = Array.from({ length: maxDepth }, () => [])
  let uid = 0

  const walk = (cols, depth, parentKey = null) => {
    cols.forEach(col => {
      const isGroup = col.children?.length
      const cell = { ...col, _id: uid++, parentKey, isGroup }

      cell.colSpan = isGroup ? countLeaf(col) : 1
      cell.rowSpan = isGroup ? 1 : maxDepth - depth

      rows[depth].push(cell)

      if (isGroup) walk(col.children, depth + 1, col.key)
    })
  }

  walk(props.columns, 0)
  return rows
})

/* -------------------------
   leaf columns
------------------------- */
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

/* -------------------------
   선택 기능
------------------------- */
const selectedRows = ref([])
const selectedRadio = ref(null)

const emitSelect = () => emit('update:selected', selectedRows.value)
const emitSelectRadio = () => emit('update:radio', selectedRadio.value)

const isRowSelected = index => selectedRows.value.includes(index)

const handleRowClick = index => {
  if (!props.checkbox) return

  const i = selectedRows.value.indexOf(index)
  if (i > -1) selectedRows.value.splice(i, 1)
  else selectedRows.value.push(index)

  emitSelect()
}

/* -------------------------
   DOM refs
------------------------- */
const tbodyTable = ref(null)
const theadTable = ref(null)
const scrollWrapper = ref(null)

const colWidths = ref([])

/* -------------------------
   HEADER WIDTH 동기화 (핵심)
------------------------- */
const syncHeaderWidth = () => {
  const bodyWidth = tbodyTable.value?.offsetWidth || 0
  if (bodyWidth > 0) {
    theadTable.value.style.width = bodyWidth + 'px'
  }
}

/* -------------------------
   WIDTH 계산 (정수 픽셀 + 3프레임 안정화)
------------------------- */
const measureColWidths = async () => {
  await nextTick()

  return new Promise(resolve => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const firstRow = tbodyTable.value?.querySelector('tbody tr')
          if (!firstRow) {
            resolve()
            return
          }

          const widths = Array.from(firstRow.children).map(td =>
            Math.round(td.getBoundingClientRect().width)
          )

          colWidths.value = widths.map((w, i) => {
            const col = flatColumns.value[i]
            let width = w

            if (col.width) width = Math.round(parseInt(col.width))
            if (col.minWidth) width = Math.max(width, Math.round(parseInt(col.minWidth)))
            if (col.maxWidth) width = Math.min(width, Math.round(parseInt(col.maxWidth)))

            return Math.round(width)
          })

          resolve()
        })
      })
    })
  })
}

/* -------------------------
   SCROLL X 동기화
------------------------- */
const syncScrollX = () => {
  const x = Math.round(scrollWrapper.value.scrollLeft)
  theadTable.value.style.transform = `translateX(-${x}px)`
}

/* -------------------------
   LIFECYCLE
------------------------- */
let resizeObserver = null

onMounted(async () => {
  await measureColWidths()
  syncHeaderWidth()

  resizeObserver = new ResizeObserver(() => {
    measureColWidths().then(syncHeaderWidth)
  })
  resizeObserver.observe(tbodyTable.value)

  window.addEventListener('resize', () => {
    measureColWidths().then(syncHeaderWidth)
  })
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  window.removeEventListener('resize', measureColWidths)
})

watch(
  () => props.rows,
  () => {
    measureColWidths().then(syncHeaderWidth)
  },
  { deep: true }
)

watch(
  () => props.columns,
  () => {
    measureColWidths().then(syncHeaderWidth)
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

/* HEADER 고정 */
.header-table {
  position: sticky;
  top: 0;
  z-index: 20;
  background: #fff;

  /* 흔들림 방지 */
  will-change: transform;
  backface-visibility: hidden;
  transform: translateZ(0);
}

/* BODY 스크롤 */
.scroll-body {
  max-height: 360px;
  overflow-y: auto;
  overflow-x: auto;
}
.force-x-scroll table {
  min-width: calc(100% + 1px); /* 항상 가로 스크롤 생성 */
}
/* TABLE 공통 */
.base-table {
  width: max-content;
  min-width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
  transform: translateZ(0); /* fractional pixel jitter 방지 */
}

/* 그룹 헤더 */
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

/* 셀 */
.th,
.td {
  border-bottom: 1px solid #eee;
  border-left: 1px solid #ddd;
  white-space: nowrap;
  background: #fff;
  box-sizing: border-box;
}

.cell {
  display: block;
  padding: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 선택된 row */
.row-selected td {
  background: #f0f7ff;
  font-weight: 600;
}

/* no data */
.no-data {
  text-align: center;
  padding: 20px;
}
</style>
