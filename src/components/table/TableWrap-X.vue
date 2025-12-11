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
                  :checked="selectedRadio === rIndex"
                  @change="onRadioChange(rIndex)"
                  :disabled="props.radioDisabled || (col.disabled && col.disabled(row))"
                  @click.stop
                />
              </template>

              <!-- CHECKBOX -->
              <template v-else-if="col.type === 'checkbox' && props.checkbox">
                <input
                  type="checkbox"
                  class="checkbox"
                  :checked="selectedRows.includes(rIndex)"
                  @change="onCheckboxChange($event, rIndex)"
                  :disabled="props.checkboxDisabled || (col.disabled && col.disabled(row))"
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

          <tr v-if="rows.length === 0">
            <td :colspan="flatColumns.length" class="no-data">데이터가 없습니다.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Custom Horizontal Scrollbar -->
    <div class="scrollbar-horizontal">
      <!-- ★ thumb에 직접 mousedown -->
      <div class="scrollbar-thumb-horizontal" ref="thumbX" @mousedown="startHorizontalDrag"></div>
    </div>

    <!-- Custom Vertical Scrollbar -->
    <div class="scrollbar-vertical">
      <!-- ★ thumb에 직접 mousedown -->
      <div class="scrollbar-thumb-vertical" ref="thumbY" @mousedown="startVerticalDrag"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'

/* ---------------------------
      PROPS & EMITS
---------------------------- */
const props = defineProps({
  columns: { type: Array, required: true },
  rows: { type: Array, required: true },

  checkbox: { type: Boolean, default: false },
  radio: { type: Boolean, default: false },

  // v-model:checkbox
  modelValueCheckbox: {
    type: Array,
    default: () => [],
  },

  // v-model:radio
  modelValueRadio: {
    type: Number,
    default: null,
  },

  checkboxDisabled: { type: Boolean, default: false },
  radioDisabled: { type: Boolean, default: false },
})

const emit = defineEmits(['update:radio', 'update:checkbox', 'scroll-bottom'])

/* ---------------------------
      HEADER GROUP 계산
---------------------------- */
const countLeaf = c => (c.children?.length ? c.children.reduce((s, v) => s + countLeaf(v), 0) : 1)

const getMaxDepth = cols => {
  const depth = c => (c.children?.length ? 1 + Math.max(...c.children.map(depth)) : 1)
  return Math.max(...cols.map(depth))
}

const headerRows = computed(() => {
  if (!props.columns.length) return []
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
      if (col.children?.length) walk(col.children)
      else list.push(col)
    })
  }
  walk(props.columns)
  return list
})

/* ---------------------------
      CHECKBOX / RADIO
---------------------------- */
const selectedRows = ref([...props.modelValueCheckbox])
const selectedRadio = ref(props.modelValueRadio)

/* 부모 reset → 자식 state 동기화 */
watch(
  () => props.modelValueCheckbox,
  v => (selectedRows.value = [...v])
)
watch(
  () => props.modelValueRadio,
  v => (selectedRadio.value = v)
)

/* 체크박스 핸들러 */
const onCheckboxChange = (e, idx) => {
  let newList = [...selectedRows.value]
  if (e.target.checked) {
    if (!newList.includes(idx)) newList.push(idx)
  } else {
    newList = newList.filter(v => v !== idx)
  }
  selectedRows.value = newList
  emit('update:checkbox', newList)
}

/* 라디오 핸들러 */
const onRadioChange = idx => {
  selectedRadio.value = idx
  emit('update:radio', idx)
}

/* row-selected (props 기반) */
const isRowSelected = idx => selectedRows.value.includes(idx) || selectedRadio.value === idx

watch(
  () => props.modelValueCheckbox,
  v => {
    selectedRows.value = [...v]
  }
)

/* ---------------------------
   Scroll & Custom Scrollbar
---------------------------- */
const scrollBody = ref(null)
const thumbX = ref(null)
const thumbY = ref(null)

const bottomLock = ref(false)

const checkScrollBottom = () => {
  const body = scrollBody.value
  if (!body) return false
  return body.scrollTop + body.clientHeight >= body.scrollHeight - 5
}

/* 메인 스크롤 핸들러: thumb 업데이트 + 바닥 감지 */
const syncScroll = () => {
  updateVerticalThumb()
  updateHorizontalThumb()

  if (!bottomLock.value && checkScrollBottom()) {
    bottomLock.value = true
    emit('scroll-bottom')

    setTimeout(() => {
      bottomLock.value = false
    }, 200)
  }
}

/* ----- Vertical Bar ----- */
const updateVerticalThumb = () => {
  const body = scrollBody.value
  const thumb = thumbY.value
  if (!body || !thumb) return

  const maxScroll = body.scrollHeight - body.clientHeight
  if (maxScroll <= 0) {
    // 스크롤 필요 없으면 숨김
    thumb.style.height = '0px'
    thumb.style.top = '0px'
    return
  }

  const ratio = body.clientHeight / body.scrollHeight
  thumb.style.height = `${ratio * 100}%`

  const scrollRatio = body.scrollTop / maxScroll
  const trackHeight = thumb.parentElement.clientHeight
  const maxThumbTop = trackHeight - thumb.offsetHeight
  thumb.style.top = `${scrollRatio * maxThumbTop}px`
}

/* Vertical drag 상태 값 */
const isDraggingY = ref(false)
const dragStartY = ref(0)
const scrollStartTop = ref(0)

/* 드래그 시작 (세로) */
const startVerticalDrag = e => {
  const body = scrollBody.value
  const thumb = thumbY.value
  if (!body || !thumb) return

  isDraggingY.value = true
  dragStartY.value = e.clientY
  scrollStartTop.value = body.scrollTop

  document.addEventListener('mousemove', onVerticalDrag)
  document.addEventListener('mouseup', stopVerticalDrag)
  e.preventDefault()
}

/* 드래그 중 (세로) */
const onVerticalDrag = e => {
  if (!isDraggingY.value) return
  const body = scrollBody.value
  const thumb = thumbY.value
  if (!body || !thumb) return

  const maxScroll = body.scrollHeight - body.clientHeight
  const track = thumb.parentElement
  const trackHeight = track.clientHeight
  const thumbHeight = thumb.offsetHeight
  const maxThumbTop = trackHeight - thumbHeight

  if (maxScroll <= 0 || maxThumbTop <= 0) return

  const deltaY = e.clientY - dragStartY.value
  const scrollRatio = maxScroll / maxThumbTop

  body.scrollTop = scrollStartTop.value + deltaY * scrollRatio
  updateVerticalThumb()
}

/* 드래그 끝 (세로) */
const stopVerticalDrag = () => {
  if (!isDraggingY.value) return
  isDraggingY.value = false
  document.removeEventListener('mousemove', onVerticalDrag)
  document.removeEventListener('mouseup', stopVerticalDrag)
}

/* ----- Horizontal Bar ----- */
const updateHorizontalThumb = () => {
  const body = scrollBody.value
  const thumb = thumbX.value
  if (!body || !thumb) return

  const maxScroll = body.scrollWidth - body.clientWidth
  if (maxScroll <= 0) {
    thumb.style.width = '0px'
    thumb.style.left = '0px'
    return
  }

  const ratio = body.clientWidth / body.scrollWidth
  thumb.style.width = `${ratio * 100}%`

  const scrollRatio = body.scrollLeft / maxScroll
  const trackWidth = thumb.parentElement.clientWidth
  const maxThumbLeft = trackWidth - thumb.offsetWidth
  thumb.style.left = `${scrollRatio * maxThumbLeft}px`
}

/* Horizontal drag 상태 값 */
const isDraggingX = ref(false)
const dragStartX = ref(0)
const scrollStartLeft = ref(0)

/* 드래그 시작 (가로) */
const startHorizontalDrag = e => {
  const body = scrollBody.value
  const thumb = thumbX.value
  if (!body || !thumb) return

  isDraggingX.value = true
  dragStartX.value = e.clientX
  scrollStartLeft.value = body.scrollLeft

  document.addEventListener('mousemove', onHorizontalDrag)
  document.addEventListener('mouseup', stopHorizontalDrag)
  e.preventDefault()
}

/* 드래그 중 (가로) */
const onHorizontalDrag = e => {
  if (!isDraggingX.value) return
  const body = scrollBody.value
  const thumb = thumbX.value
  if (!body || !thumb) return

  const maxScroll = body.scrollWidth - body.clientWidth
  const track = thumb.parentElement
  const trackWidth = track.clientWidth
  const maxThumbLeft = trackWidth - thumb.offsetWidth

  if (maxScroll <= 0 || maxThumbLeft <= 0) return

  const deltaX = e.clientX - dragStartX.value
  const scrollRatio = maxScroll / maxThumbLeft

  body.scrollLeft = scrollStartLeft.value + deltaX * scrollRatio
  updateHorizontalThumb()
}

/* 드래그 끝 (가로) */
const stopHorizontalDrag = () => {
  if (!isDraggingX.value) return
  isDraggingX.value = false
  document.removeEventListener('mousemove', onHorizontalDrag)
  document.removeEventListener('mouseup', stopHorizontalDrag)
}

/* ---------------------------
   Lifecycle
---------------------------- */
onMounted(() => {
  // 처음 렌더 이후 스크롤바 계산
  requestAnimationFrame(syncScroll)
})

onBeforeUnmount(() => {
  // 혹시 남아 있을 이벤트 클린업
  document.removeEventListener('mousemove', onVerticalDrag)
  document.removeEventListener('mouseup', stopVerticalDrag)
  document.removeEventListener('mousemove', onHorizontalDrag)
  document.removeEventListener('mouseup', stopHorizontalDrag)
})

/* rows / columns 바뀔 때 스크롤 재계산 */
watch(
  () => [props.rows, props.columns],
  () => {
    requestAnimationFrame(syncScroll)
  },
  { deep: true }
)
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
