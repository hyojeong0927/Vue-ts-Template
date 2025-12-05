<template>
  <div class="table-wrapper">
    <!-- table scroll area -->
    <div class="scroll-body" ref="scrollBody" @scroll="syncScroll">
      <table class="base-table">
        <thead>
          <tr v-for="(row, rIndex) in headerRows" :key="'hr-' + rIndex">
            <th
              v-for="cell in row"
              :key="cell._id"
              :rowspan="cell.rowSpan"
              :colspan="cell.colSpan"
              class="th"
              :class="[cell.isGroup ? 'group-header' : 'leaf-header']"
            >
              {{ cell.label }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, r) in rows" :key="r">
            <td v-for="col in flatColumns" :key="col.key" class="td">
              {{ row[col.key] }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- horizontal scrollbar (scroll-body 바깥에 둠!!) -->
    <div class="scrollbar-horizontal" @mousedown="startHorizontalDrag">
      <div class="scrollbar-thumb-horizontal" ref="thumbX"></div>
    </div>

    <!-- vertical scrollbar -->
    <div class="scrollbar-vertical" @mousedown="startVerticalDrag">
      <div class="scrollbar-thumb-vertical" ref="thumbY"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
  columns: Array,
  rows: Array,
})

/* ----------------------------
   HEADER GROUP 계산
----------------------------- */
const countLeaf = c => (c.children?.length ? c.children.reduce((s, v) => s + countLeaf(v), 0) : 1)

const getMaxDepth = cols => {
  const depth = c => (c.children?.length ? 1 + Math.max(...c.children.map(depth)) : 1)
  return Math.max(...cols.map(depth))
}

const headerRows = computed(() => {
  const rows = Array.from({ length: getMaxDepth(props.columns) }, () => [])
  let uid = 0

  const walk = (cols, depth) => {
    cols.forEach(col => {
      const cell = {
        ...col,
        _id: uid++,
        isGroup: !!col.children,
        colSpan: col.children ? countLeaf(col) : 1,
        rowSpan: col.children ? 1 : rows.length - depth,
      }
      rows[depth].push(cell)
      if (col.children) walk(col.children, depth + 1)
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

/* ----------------------------
   스크롤 & 커스텀 바 동기화
----------------------------- */

const scrollBody = ref(null)
const thumbX = ref(null)
const thumbY = ref(null)

const syncScroll = () => {
  updateVerticalThumb()
  updateHorizontalThumb()
}

/* -------- 세로 -------- */
const updateVerticalThumb = () => {
  const body = scrollBody.value
  const thumb = thumbY.value

  const ratio = body.clientHeight / body.scrollHeight
  thumb.style.height = `${ratio * 100}%`

  const scrollRatio = body.scrollTop / (body.scrollHeight - body.clientHeight)

  thumb.style.top = `${scrollRatio * (body.clientHeight - thumb.offsetHeight)}px`
}

let draggingY = false
let startY = 0
let startScrollTop = 0

const startVerticalDrag = e => {
  if (!thumbY.value.contains(e.target)) return
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

  const delta = e.clientY - startY
  const maxThumbMove = body.clientHeight - thumb.offsetHeight
  const maxScroll = body.scrollHeight - body.clientHeight
  const scrollDelta = (delta / maxThumbMove) * maxScroll

  body.scrollTop = startScrollTop + scrollDelta
}

const stopVerticalDrag = () => {
  draggingY = false
  document.removeEventListener('mousemove', onVerticalDrag)
  document.removeEventListener('mouseup', stopVerticalDrag)
}

/* -------- 가로 -------- */
const updateHorizontalThumb = () => {
  const body = scrollBody.value
  const thumb = thumbX.value

  const ratio = body.clientWidth / body.scrollWidth
  thumb.style.width = `${ratio * 100}%`

  const scrollRatio = body.scrollLeft / (body.scrollWidth - body.clientWidth)

  thumb.style.left = `${scrollRatio * (body.clientWidth - thumb.offsetWidth)}px`
}

let draggingX = false
let startX = 0
let startScrollLeft = 0

const startHorizontalDrag = e => {
  if (!thumbX.value.contains(e.target)) return
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

  const delta = e.clientX - startX
  const maxThumbMove = body.clientWidth - thumb.offsetWidth
  const maxScroll = body.scrollWidth - body.clientWidth
  const scrollDelta = (delta / maxThumbMove) * maxScroll

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

/* horizontal bar now OUTSIDE scroll-body */
.scrollbar-horizontal {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 8px; /* vertical bar 공간 */
  height: 10px;
  background: transparent;
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
  cursor: pointer;
}

/* -----------------------------------
   테이블
----------------------------------- */
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

.th,
.td {
  padding: 10px;
  border: 1px solid #eee;
  white-space: nowrap;
}
</style>
