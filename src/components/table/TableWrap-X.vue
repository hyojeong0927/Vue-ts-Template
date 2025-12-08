<template>
  <div class="table-wrapper">
    <!-- Scroll Area -->
    <div class="scroll-body" ref="scrollBody" @scroll="syncScroll">
      <table class="base-table">
        <!-- 컬럼 폭 지정용 colgroup (width 지정 시 사용) -->
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
            @click="toggleRow(rIndex)"
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
    <div class="scrollbar-horizontal" @mousedown="startHorizontalDrag">
      <div class="scrollbar-thumb-horizontal" ref="thumbX"></div>
    </div>

    <!-- Custom Vertical Scrollbar -->
    <div class="scrollbar-vertical" @mousedown="startVerticalDrag">
      <div class="scrollbar-thumb-vertical" ref="thumbY"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const emit = defineEmits(['update:radio', 'update:checkbox'])

const props = defineProps({
  columns: { type: Array, required: true },
  rows: { type: Array, required: true },
  checkbox: { type: Boolean, default: false },
  radio: { type: Boolean, default: false },
})

/* ---------------------------
      HEADER GROUP 계산
---------------------------- */
const countLeaf = c => (c.children?.length ? c.children.reduce((s, v) => s + countLeaf(v), 0) : 1)

const getMaxDepth = cols => {
  const depth = c => (c.children?.length ? 1 + Math.max(...c.children.map(depth)) : 1)
  return Math.max(...cols.map(depth))
}

const headerRows = computed(() => {
  const rows = Array.from({ length: getMaxDepth(props.columns) }, () => [])
  let uid = 0

  const walk = (cols, depth, parentGroupKey = null) => {
    cols.forEach(col => {
      const isGroup = !!col.children
      const groupKey = isGroup ? col.key : parentGroupKey

      const cell = {
        ...col,
        _id: uid++,
        isGroup,
        colSpan: isGroup ? countLeaf(col) : 1,
        rowSpan: isGroup ? 1 : rows.length - depth,
        depth,
        groupKey,
      }

      rows[depth].push(cell)

      if (isGroup) walk(col.children, depth + 1, col.key)
    })
  }

  walk(props.columns, 0)
  return rows
})

/* leaf columns */
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

/* ---------------------------
      CHECKBOX / RADIO
---------------------------- */
const selectedRows = ref([])
const selectedRadio = ref(null)

/* 수정된 row 선택 함수 */
const isRowSelected = idx => {
  if (props.checkbox && selectedRows.value.includes(idx)) return true
  if (props.radio && selectedRadio.value === idx) return true
  return false
}

/* row 클릭 -> 체크박스 전용 */
const toggleRow = idx => {
  // 라디오 모드에서는 row 클릭이 선택되지 않음
  if (props.radio) return

  // checkbox 모드만 row 클릭 허용
  if (!props.checkbox) return

  const i = selectedRows.value.indexOf(idx)
  if (i >= 0) selectedRows.value.splice(i, 1)
  else selectedRows.value.push(idx)

  emitCheck()
}

const emitCheck = () => emit('update:checkbox', selectedRows.value)
const emitRadio = () => emit('update:radio', selectedRadio.value)

/* ---------------------------
   커스텀 스크롤바 (세로/가로)
---------------------------- */

const scrollBody = ref(null)
const thumbX = ref(null)
const thumbY = ref(null)

const syncScroll = () => {
  updateVerticalThumb()
  updateHorizontalThumb()
}

/* ----- Y bar ----- */
const updateVerticalThumb = () => {
  const body = scrollBody.value
  const thumb = thumbY.value
  if (!body || !thumb) return

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

let draggingY = false
let startY = 0
let startScrollTop = 0

const startVerticalDrag = e => {
  if (!thumbY.value || !thumbY.value.contains(e.target)) return
  draggingY = true
  startY = e.clientY
  startScrollTop = scrollBody.value.scrollTop
  document.addEventListener('mousemove', onVerticalDrag)
  document.addEventListener('mouseup', stopVerticalDrag)
}

const onVerticalDrag = e => {
  if (!draggingY) return
  const body = scrollBody.value
  const thumb = thumbY.value
  const maxThumb = body.clientHeight - thumb.offsetHeight
  const maxScroll = body.scrollHeight - body.clientHeight
  if (maxThumb <= 0 || maxScroll <= 0) return

  const delta = e.clientY - startY
  const scrollDelta = (delta / maxThumb) * maxScroll
  body.scrollTop = startScrollTop + scrollDelta
}

const stopVerticalDrag = () => {
  draggingY = false
  document.removeEventListener('mousemove', onVerticalDrag)
  document.removeEventListener('mouseup', stopVerticalDrag)
}

/* ----- X bar ----- */
const updateHorizontalThumb = () => {
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

let draggingX = false
let startX = 0
let startScrollLeft = 0

const startHorizontalDrag = e => {
  if (!thumbX.value || !thumbX.value.contains(e.target)) return
  draggingX = true
  startX = e.clientX
  startScrollLeft = scrollBody.value.scrollLeft

  document.addEventListener('mousemove', onHorizontalDrag)
  document.addEventListener('mouseup', stopHorizontalDrag)
}

const onHorizontalDrag = e => {
  if (!draggingX) return
  const body = scrollBody.value
  const thumb = thumbX.value
  const maxThumb = body.clientWidth - thumb.offsetWidth
  const maxScroll = body.scrollWidth - body.clientWidth
  if (maxThumb <= 0 || maxScroll <= 0) return

  const delta = e.clientX - startX
  const scrollDelta = (delta / maxThumb) * maxScroll
  body.scrollLeft = startScrollLeft + scrollDelta
}

const stopHorizontalDrag = () => {
  draggingX = false
  document.removeEventListener('mousemove', onHorizontalDrag)
  document.removeEventListener('mouseup', stopHorizontalDrag)
}

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
