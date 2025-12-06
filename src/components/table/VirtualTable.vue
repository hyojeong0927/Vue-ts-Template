<template>
  <div class="table-wrapper" ref="wrapperRef">
    <!-- 세로 가상 스크롤 + 가로 브라우저 스크롤 -->
    <div
      class="body-viewport"
      ref="viewportRef"
      :style="{ maxHeight: maxHeight + 'px' }"
      @scroll="onScroll"
    >
      <table class="base-table">
        <!-- COLGROUP: flatColumns 기준 -->
        <colgroup>
          <col v-for="col in flatColumns" :key="col.key" :style="{ width: col.width || 'auto' }" />
        </colgroup>

        <!-- HEADER (rowspan/colspan + sticky) -->
        <thead>
          <tr v-for="(row, rIndex) in headerRows" :key="'hr-' + rIndex">
            <th
              v-for="cell in row"
              :key="cell._id"
              :rowspan="cell.rowSpan"
              :colspan="cell.colSpan"
              class="th sticky-th"
              :class="[
                cell.isGroup ? 'group-header' : 'leaf-header',
                cell.groupKey ? `group-${cell.groupKey}` : '',
                cell.depth !== undefined ? `depth-${cell.depth}` : '',
              ]"
              :style="{
                top: rIndex * headerRowHeight + 'px',
                textAlign: cell.align || 'center',
              }"
            >
              {{ cell.label }}
            </th>
          </tr>
        </thead>

        <!-- BODY (세로 가상 스크롤) -->
        <tbody>
          <!-- 위쪽 spacer -->
          <tr v-if="topSpacerHeight > 0" class="spacer-row">
            <td :colspan="flatColumns.length" :style="{ height: topSpacerHeight + 'px' }"></td>
          </tr>

          <!-- 실제 보여줄 구간 -->
          <tr
            v-for="(row, vIndex) in visibleRows"
            :key="row.id ?? startIndex + vIndex"
            class="body-row"
          >
            <td
              v-for="col in flatColumns"
              :key="col.key"
              class="td"
              :class="col.className || ''"
              :style="{ textAlign: col.align || 'left' }"
            >
              <!-- 기본 렌더링 + 슬롯 기반 커스터마이징 -->
              <slot :name="col.key" :row="row" :value="row[col.key]">
                {{ row[col.key] }}
              </slot>
            </td>
          </tr>

          <!-- 아래쪽 spacer -->
          <tr v-if="bottomSpacerHeight > 0" class="spacer-row">
            <td :colspan="flatColumns.length" :style="{ height: bottomSpacerHeight + 'px' }"></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'

const props = defineProps({
  /** headerRows 예시: [[{ _id, label, rowSpan, colSpan, isGroup, depth, groupKey }], ...] */
  headerRows: {
    type: Array,
    required: true,
  },
  /** flatColumns 예시: [{ key, label, width, align, className }, ...] */
  flatColumns: {
    type: Array,
    required: true,
  },
  /** 실제 데이터 row 배열 */
  rows: {
    type: Array,
    required: true,
  },
  /** 한 줄 높이(px) - 고정 row height 기준 */
  rowHeight: {
    type: Number,
    default: 40,
  },
  /** header 한 줄 높이(px) */
  headerRowHeight: {
    type: Number,
    default: 40,
  },
  /** 가상 스크롤 버퍼(위/아래 여유 row 수) */
  buffer: {
    type: Number,
    default: 5,
  },
  /** 세로 최대 높이(px) - 외부에서 조정 가능 */
  maxHeight: {
    type: Number,
    default: 400,
  },
})

const wrapperRef = ref(null)
const viewportRef = ref(null)

/* 현재 스크롤 기준 시작/끝 인덱스 */
const startIndex = ref(0)
const endIndex = ref(0)

/* 화면에 실제로 필요한 row 수 */
const visibleCount = ref(0)

/* rows 길이 변화 감지해서 끝 인덱스 보정 */
watch(
  () => props.rows.length,
  () => {
    updateVisibleCount()
    updateRangeByScroll()
  }
)

/* 화면에 보여줄 rows */
const visibleRows = computed(() => {
  return props.rows.slice(startIndex.value, endIndex.value)
})

/* spacer 높이 계산 */
const topSpacerHeight = computed(() => startIndex.value * props.rowHeight)
const bottomSpacerHeight = computed(() => {
  const total = props.rows.length * props.rowHeight
  const used = endIndex.value * props.rowHeight
  const remain = total - used
  return remain > 0 ? remain : 0
})

/* 처음/창 크기 변경 시 화면에 보여줄 row 수 계산 */
const updateVisibleCount = () => {
  if (!viewportRef.value) return
  const vh = viewportRef.value.clientHeight || props.maxHeight
  visibleCount.value = Math.ceil(vh / props.rowHeight) + props.buffer * 2
}

/* 스크롤 위치 기반으로 start/end 계산 */
const updateRangeByScroll = () => {
  if (!viewportRef.value) return

  const scrollTop = viewportRef.value.scrollTop
  const first = Math.floor(scrollTop / props.rowHeight) - props.buffer
  const safeStart = Math.max(0, first)
  const safeEnd = Math.min(props.rows.length, safeStart + visibleCount.value)

  startIndex.value = safeStart
  endIndex.value = safeEnd
}

/* 스크롤 이벤트 핸들러 */
const onScroll = () => {
  updateRangeByScroll()
}

/* 리사이즈 대응 */
const handleResize = () => {
  updateVisibleCount()
  updateRangeByScroll()
}

onMounted(() => {
  updateVisibleCount()
  updateRangeByScroll()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.table-wrapper {
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
}

/* 세로 + 가로 스크롤 영역 */
.body-viewport {
  overflow: auto; /* 가로/세로 모두 브라우저 기본 스크롤 */
  position: relative;
}

/* 테이블 기본 */
.base-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

.th,
.td {
  border: 1px solid #e0e0e0;
  padding: 4px 8px;
  font-size: 13px;
  box-sizing: border-box;
  background: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* HEADER */
thead .th {
  background: #f8f8f8;
  font-weight: 600;
}

/* sticky header */
.sticky-th {
  position: sticky;
  z-index: 3; /* body 위에 오도록 */
}

/* 그룹/leaf header 스타일 예시 */
.group-header {
  background: #f0f3ff;
}

.leaf-header {
  background: #f8f8f8;
}

/* depth별 예시 */
.depth-0 {
  font-size: 14px;
}
.depth-1 {
  font-size: 13px;
}
.depth-2 {
  font-size: 12px;
}

/* body row hover */
.body-row:hover .td {
  background: #fafafa;
}

/* spacer row는 보이지 않게 */
.spacer-row td {
  border: none;
  padding: 0;
  background: transparent;
}
</style>
