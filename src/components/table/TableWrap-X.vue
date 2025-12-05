<template>
  <div class="table-wrapper">
    <!-- SCROLL BODY -->
    <div class="scroll-body" ref="scrollBody" @scroll="syncScroll">
      <table class="base-table">
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
                cell.isGroup ? `group-depth-${cell.depth}` : '',
              ]"
            >
              {{ cell.label }}
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
                {{ row[col.key] }}
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Horizontal Scrollbar -->
    <div class="scrollbar-horizontal" @mousedown="startHorizontalDrag">
      <div class="scrollbar-thumb-horizontal" ref="thumbX"></div>
    </div>

    <!-- Vertical Scrollbar -->
    <div class="scrollbar-vertical" @mousedown="startVerticalDrag">
      <div class="scrollbar-thumb-vertical" ref="thumbY"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const emit = defineEmits(['update:radio', 'update:checkbox'])

const props = defineProps({
  columns: Array,
  rows: Array,
  checkbox: { type: Boolean, default: false },
  radio: { type: Boolean, default: false },
})

/* -----------------------------
        HEADER GROUP 계산
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
      const cell = {
        ...col,
        _id: uid++,
        isGroup: !!col.children,
        colSpan: col.children ? countLeaf(col) : 1,
        rowSpan: col.children ? 1 : rows.length - depth,
        depth,
        groupKey: parentKey,
      }
      rows[depth].push(cell)

      if (col.children) walk(col.children, depth + 1, col.key)
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

/* -----------------------------
      체크박스 / 라디오
------------------------------ */

const selectedRows = ref([])
const selectedRadio = ref(null)

const isRowSelected = idx => selectedRows.value.includes(idx)

const toggleRow = idx => {
  if (!props.checkbox) return
  const i = selectedRows.value.indexOf(idx)
  if (i >= 0) selectedRows.value.splice(i, 1)
  else selectedRows.value.push(idx)
  emitCheck()
}

const emitCheck = () => emit('update:checkbox', selectedRows.value)
const emitRadio = () => emit('update:radio', selectedRadio.value)

/* -----------------------------
      CUSTOM SCROLLBAR
------------------------------ */

const scrollBody = ref(null)
const thumbX = ref(null)
const thumbY = ref(null)

const syncScroll = () => {
  updateVerticalThumb()
  updateHorizontalThumb()
}

/* --- Vertical --- */
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
  const maxThumb = body.clientHeight - thumb.offsetHeight
  const maxScroll = body.scrollHeight - body.clientHeight
  body.scrollTop = startScrollTop + (delta / maxThumb) * maxScroll
}

const stopVerticalDrag = () => {
  draggingY = false
  document.removeEventListener('mousemove', onVerticalDrag)
  document.removeEventListener('mouseup', stopVerticalDrag)
}

/* --- Horizontal --- */
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
  const maxThumb = body.clientWidth - thumb.offsetWidth
  const maxScroll = body.scrollWidth - body.clientWidth
  body.scrollLeft = startScrollLeft + (delta / maxThumb) * maxScroll
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

/* Scroll area */
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

/* Horizontal bar */
.scrollbar-horizontal {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 8px;
  height: 10px;
}
.scrollbar-thumb-horizontal {
  position: absolute;
  height: 10px;
  background: #b5b5b5;
  border-radius: 4px;
}

/* Vertical bar */
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

/* TABLE */
.base-table {
  width: max-content !important;
  min-width: max-content !important;
  border-collapse: collapse;
}

/* Sticky header */
thead th {
  position: sticky;
  top: 0;
  background: #fff;
  z-index: 20;
}

/* Align */
.align-left {
  text-align: left;
}
.align-center {
  text-align: center;
}
.align-right {
  text-align: right;
}

/* Base cell */
.th,
.td {
  padding: 10px;
  border: 1px solid #eee;
  white-space: nowrap;
}

/* row selected */
.row-selected td {
  background: #f0f7ff;
  font-weight: 600;
}
</style>
