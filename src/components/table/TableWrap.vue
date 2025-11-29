<template>
  <div class="table-container" ref="containerRef">
    <!-- HEADER TABLE -->
    <table class="base-table header-table" ref="theadTable">
      <colgroup>
        <col
          v-for="(col, i) in internalColumns"
          :key="'h-' + i"
          :style="{ width: colWidths[i] + 'px' }"
        />
      </colgroup>

      <thead>
        <tr>
          <th v-for="col in internalColumns" :key="col.key" class="th">
            <template v-if="col.type === 'checkbox' && checkbox">
              <input type="checkbox" v-model="allChecked" @change="toggleAll" />
            </template>
            <template v-else>{{ col.label }}</template>
          </th>
        </tr>
      </thead>
    </table>

    <!-- BODY TABLE -->
    <div class="tbody-wrapper" ref="tbodyWrapper">
      <table class="base-table body-table" ref="tbodyTable">
        <colgroup>
          <col
            v-for="(col, i) in internalColumns"
            :key="'b-' + i"
            :style="{ width: colWidths[i] + 'px' }"
          />
        </colgroup>

        <tbody>
          <tr v-for="(row, rIndex) in rows" :key="rIndex">
            <td v-for="col in internalColumns" :key="col.key" class="td">
              <template v-if="col.type === 'checkbox' && checkbox">
                <input
                  type="checkbox"
                  :value="rIndex"
                  v-model="selectedRows"
                  @change="emitSelect"
                />
              </template>
              <!-- 이메일 링크 -->
              <template v-else-if="col.type === 'email'">
                <a :href="`mailto:${row[col.key]}`">{{ row[col.key] }}</a>
              </template>

              <!-- URL 링크 -->
              <template v-else-if="col.type === 'link'">
                <a :href="row[col.key]" target="_blank">{{ row[col.key] }}</a>
              </template>

              <!-- 일반 데이터 -->
              <template v-else>
                <span v-if="!col.slot">{{ row[col.key] }}</span>
                <slot v-else :name="col.slot" :row="row" :value="row[col.key]" />
              </template>
            </td>
          </tr>

          <tr v-if="rows.length === 0">
            <td :colspan="internalColumns.length" class="no-data">데이터가 없습니다.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted, onBeforeUnmount, watch } from 'vue'

const emit = defineEmits(['update:selected'])

const props = defineProps({
  columns: { type: Array, required: true },
  rows: { type: Array, required: true },
  stickyHeader: { type: Boolean, default: true },
  checkbox: { type: Boolean, default: false },
})

/* internalColumns */
const internalColumns = ref([])

const buildColumns = () => {
  if (props.checkbox) {
    internalColumns.value = [{ key: '_checkbox', type: 'checkbox', width: 48 }, ...props.columns]
  } else {
    internalColumns.value = [...props.columns]
  }
}

/* checkbox */
const selectedRows = ref([])
const allChecked = ref(true)

const toggleAll = () => {
  if (!props.checkbox) return

  if (allChecked.value === true) {
    // 전체 선택
    selectedRows.value = props.rows.map((_, i) => i)
  } else {
    // 전체 해제
    selectedRows.value = []
  }

  emitSelect()
}

const emitSelect = () => {
  if (!props.checkbox) return

  allChecked.value = selectedRows.value.length === props.rows.length
  emit('update:selected', selectedRows.value)
}

/* Table */
const containerRef = ref(null)
const theadTable = ref(null)
const tbodyTable = ref(null)
const tbodyWrapper = ref(null)

const colWidths = ref([])

const calculateColWidths = () => {
  const thList = theadTable.value.querySelectorAll('th')
  colWidths.value = Array.from(thList).map(th => th.offsetWidth)
}

/* 가로 스크롤 제거 → table width는 항상 100% */
const applyTableWidth = () => {
  theadTable.value.style.width = '100%'
  tbodyTable.value.style.width = '100%'
}

/* update */
const updateTable = () => {
  buildColumns()

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      calculateColWidths()
      requestAnimationFrame(() => applyTableWidth())
    })
  })
}

/* ResizeObserver + DPR */
let resizeObserver = null
let lastDPR = window.devicePixelRatio

const handleResize = () => updateTable()

onMounted(() => {
  updateTable()
  resizeObserver = new ResizeObserver(() => updateTable())
  resizeObserver.observe(containerRef.value)
  window.addEventListener('resize', handleResize)

  const dprWatcher = setInterval(() => {
    if (window.devicePixelRatio !== lastDPR) {
      lastDPR = window.devicePixelRatio
      updateTable()
    }
  }, 300)

  onBeforeUnmount(() => clearInterval(dprWatcher))
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  window.removeEventListener('resize', handleResize)
})

/* watchers */
watch(() => props.rows, updateTable, { deep: true })
watch(() => props.checkbox, updateTable)
</script>

<style scoped>
.table-container {
  position: relative;
  /* width: 100%; */
  overflow-x: hidden; /* 가로 스크롤 제거 */
  border: 1px solid #ddd;
}

.base-table {
  border-collapse: collapse;
  table-layout: fixed;
  width: 100%; /* 항상 100% */
}

.header-table {
  width: 100%;
}

.tbody-wrapper {
  max-height: 300px;
  overflow-y: auto; /* 세로 스크롤만 */
  overflow-x: hidden;
}

.body-table {
  width: 100%;
}

.th,
.td {
  padding: 12px;
  white-space: nowrap;
  border-bottom: 1px solid #eee;
  background: #fff;
}

.sticky-header {
  position: sticky;
  top: 0;
  z-index: 15;
  background: #fafafa;
}

.no-data {
  text-align: center;
  padding: 20px;
}
</style>
