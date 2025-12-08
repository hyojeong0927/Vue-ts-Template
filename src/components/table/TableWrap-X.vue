<template>
  <div class="table-wrapper">
    <!-- Scroll Area -->
    <div class="scroll-body" ref="scrollBody" @scroll="syncScroll">
      <table class="base-table">
        <!-- COLGROUP -->
        <colgroup>
          <col
            v-for="(col, i) in flatColumns"
            :key="'col-' + i"
            :style="{ width: col.width || 'auto' }"
          />
        </colgroup>

        <!-- HEADER -->
        <thead>
          <tr v-for="(row, rIndex) in headerRows" :key="'hr-' + rIndex">
            <th
              v-for="cell in row"
              :key="cell._id"
              :rowspan="cell.rowSpan"
              :colspan="cell.colSpan"
              class="th"
              :class="[
                cell.isGroup ? 'group-header' : 'leaf-header',
                cell.groupKey ? `group-${cell.groupKey}` : '',
                cell.depth !== undefined ? `group-depth-${cell.depth}` : '',
                cell.align ? `align-${cell.align}` : '',
              ]"
            >
              <span class="cell">{{ cell.label }}</span>
            </th>
          </tr>
        </thead>

        <!-- BODY -->
        <tbody>
          <tr
            v-for="(row, rIndex) in rows"
            :key="rIndex"
            :class="{ 'row-selected': isRowSelected(rIndex) }"
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
                  @change="emitRadio"
                  @click.stop
                />
              </template>

              <!-- CHECKBOX -->
              <template v-else-if="col.type === 'checkbox' && checkbox">
                <input
                  type="checkbox"
                  :value="rIndex"
                  v-model="selectedRows"
                  @change="emitCheck"
                  @click.stop
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

              <!-- DEFAULT -->
              <template v-else>
                <span class="cell">{{ row[col.key] }}</span>
              </template>
            </td>
          </tr>

          <!-- no data -->
          <tr v-if="rows.length === 0">
            <td :colspan="flatColumns.length" class="no-data">데이터가 없습니다.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Custom Horizontal Scrollbar -->
    <div class="scrollbar-horizontal">
      <div class="scrollbar-thumb-horizontal" ref="thumbX" @mousedown="startHorizontalDrag"></div>
    </div>

    <!-- Custom Vertical Scrollbar -->
    <div class="scrollbar-vertical">
      <div class="scrollbar-thumb-vertical" ref="thumbY" @mousedown="startVerticalDrag"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const emit = defineEmits(['update:radio', 'update:checkbox'])

const props = defineProps({
  columns: Array,
  rows: Array,
  checkbox: Boolean,
  radio: Boolean,
})

/* ------------------------------
   HEADER GROUP + FLAT COLUMNS
------------------------------ */

const countLeaf = c => (c.children?.length ? c.children.reduce((s, v) => s + countLeaf(v), 0) : 1)

const getMaxDepth = cols => {
  const depth = c => (c.children?.length ? 1 + Math.max(...c.children.map(depth)) : 1)
  return Math.max(...cols.map(depth))
}

const headerRows = computed(() => {
  const rows = Array.from({ length: getMaxDepth(props.columns) }, () => [])
  let uid = 0

  const walk = (cols, depth, parentKey = null) => {
    cols.forEach(col => {
      const isGroup = !!col.children
      const groupKey = isGroup ? col.key : parentKey

      rows[depth].push({
        ...col,
        _id: uid++,
        isGroup,
        colSpan: isGroup ? countLeaf(col) : 1,
        rowSpan: isGroup ? 1 : rows.length - depth,
        depth,
        groupKey,
      })

      if (isGroup) walk(col.children, depth + 1, col.key)
    })
  }

  walk(props.columns, 0)
  return rows
})

const flatColumns = computed(() => {
  const list = []
  const walk = cols => {
    cols.forEach(col => {
      if (col.children) walk(col.children)
      else list.push(col)
    })
  }
  walk(props.columns)
  return list
})

/* ------------------------------
   RADIO / CHECKBOX SELECT
------------------------------ */

const selectedRows = ref([])
const selectedRadio = ref(null)

const isRowSelected = idx => {
  if (props.checkbox && selectedRows.value.includes(idx)) return true
  if (props.radio && selectedRadio.value === idx) return true
  return false
}

const emitCheck = () => emit('update:checkbox', selectedRows.value)
const emitRadio = () => emit('update:radio', selectedRadio.value)

/* ------------------------------
   CUSTOM SCROLLBAR
------------------------------ */

const scrollBody = ref(null)
const thumbX = ref(null)
const thumbY = ref(null)

const syncScroll = () => {
  updateVerticalThumb()
  updateHorizontalThumb()
}

/* ------------------------------
      VERTICAL BAR
------------------------------ */

let draggingY = false
let startY = 0
let startScrollTop = 0

const updateVerticalThumb = () => {
  if (!scrollBody.value || !thumbY.value) return

  const body = scrollBody.value
  const thumb = thumbY.value
  const maxScroll = body.scrollHeight - body.clientHeight

  if (maxScroll <= 0) {
    thumb.style.height = '0'
    thumb.style.top = '0'
    return
  }

  const ratio = body.clientHeight / body.scrollHeight
  thumb.style.height = `${ratio * 100}%`

  const scrollRatio = body.scrollTop / maxScroll
  thumb.style.top = `${scrollRatio * (body.clientHeight - thumb.offsetHeight)}px`
}

const startVerticalDrag = e => {
  draggingY = true
  startY = e.clientY
  startScrollTop = scrollBody.value.scrollTop

  window.addEventListener('mousemove', onVerticalDrag)
  window.addEventListener('mouseup', stopVerticalDrag)
}

const onVerticalDrag = e => {
  if (!draggingY) return

  const body = scrollBody.value
  const thumb = thumbY.value

  const maxThumb = body.clientHeight - thumb.offsetHeight
  const maxScroll = body.scrollHeight - body.clientHeight

  const delta = e.clientY - startY
  const scrollDelta = (delta / maxThumb) * maxScroll

  body.scrollTop = startScrollTop + scrollDelta
}

const stopVerticalDrag = () => {
  draggingY = false
  window.removeEventListener('mousemove', onVerticalDrag)
  window.removeEventListener('mouseup', stopVerticalDrag)
}

/* ------------------------------
      HORIZONTAL BAR
------------------------------ */

let draggingX = false
let startX = 0
let startScrollLeft = 0

const updateHorizontalThumb = () => {
  // ⭐ 드래그 중일 때는 scroll 이벤트로 움직이지 않도록 막음
  if (draggingX) return

  const body = scrollBody.value
  const thumb = thumbX.value
  if (!body || !thumb) return

  const maxScroll = body.scrollWidth - body.clientWidth
  if (maxScroll <= 0) {
    thumb.style.width = '0'
    thumb.style.left = '0'
    return
  }

  const ratio = body.clientWidth / body.scrollWidth
  thumb.style.width = `${ratio * 100}%`

  const scrollRatio = body.scrollLeft / maxScroll
  thumb.style.left = `${scrollRatio * (body.clientWidth - thumb.offsetWidth)}px`
}

const startHorizontalDrag = e => {
  draggingX = true
  startX = e.clientX
  startScrollLeft = scrollBody.value.scrollLeft

  window.addEventListener('mousemove', onHorizontalDrag)
  window.addEventListener('mouseup', stopHorizontalDrag)
}

const onHorizontalDrag = e => {
  if (!draggingX) return

  const body = scrollBody.value
  const thumb = thumbX.value

  const maxThumb = body.clientWidth - thumb.offsetWidth
  const maxScroll = body.scrollWidth - body.clientWidth

  const delta = e.clientX - startX
  const scrollDelta = (delta / maxThumb) * maxScroll

  body.scrollLeft = startScrollLeft + scrollDelta
}

const stopHorizontalDrag = () => {
  draggingX = false
  window.removeEventListener('mousemove', onHorizontalDrag)
  window.removeEventListener('mouseup', stopHorizontalDrag)
}

/* ------------------------------
      MOUNTED
------------------------------ */
onMounted(() => {
  syncScroll()
  requestAnimationFrame(syncScroll)
})
</script>

<style scoped>
.table-wrapper {
  position: relative;
  border: 1px solid #ddd;
}

/* scroll area */
.scroll-body {
  max-height: 300px;
  overflow: auto;
  overflow-x: auto !important;

  scrollbar-width: none;
  -ms-overflow-style: none;
}
.scroll-body::-webkit-scrollbar {
  display: none;
}

/* horizontal bar outside */
.scrollbar-horizontal {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 8px; /* vertical bar 공간 */
  height: 10px;
}

.scrollbar-thumb-horizontal {
  position: absolute;
  height: 10px;
  background: #b5b5b5;
  border-radius: 4px;
  cursor: pointer;
}

/* vertical bar */
.scrollbar-vertical {
  position: absolute;
  top: 0;
  right: 0;
  width: 8px;
  height: 100%;
}

.scrollbar-thumb-vertical {
  position: absolute;
  width: 8px;
  background: #b5b5b5;
  border-radius: 4px;
}

/* table */
.base-table {
  width: max-content !important;
  min-width: max-content !important;
  border-collapse: collapse;
}

thead {
  position: sticky;
  top: 0;
  background: #fff;
  z-index: 20;
}

.cell {
  display: block;
  padding: 10px;
  white-space: nowrap;
}

/* align classes */
.align-left {
  text-align: left;
}
.align-center {
  text-align: center;
}
.align-right {
  text-align: right;
}

.th,
.td {
  border: 1px solid #eee;
  white-space: nowrap;
}

/* row selected */
.row-selected td {
  background: #f0f7ff;
  font-weight: 600;
}

/* 예시: group / depth 별 스타일 주고 싶으면 이런 식으로 */
.group-userInfo {
  /* 예: 사용자 정보 그룹 아래 leaf header 배경 */
  background: #f9fbff;
}

.group-depth-0 {
  /* 최상단 그룹 */
  background: #f5f5f5;
}

.group-depth-1 {
  /* 2단계 그룹/leaf */
}
</style>
