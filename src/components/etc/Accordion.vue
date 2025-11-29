<template>
  <main class="terms-page">
    <div v-for="(item, index) in items" :key="index" class="acc-item">
      <!-- HEADER (sticky) -->
      <div
        :ref="el => setHeaderRef(el, index)"
        class="acc-header"
        :class="{ active: activeIndex === index }"
      >
        <!-- 체크 + 제목 -->
        <div class="agree-label" @click.stop="toggleCheck(index)">
          <div
            class="check-icon"
            :class="{ checked: checkStates[index] || activeIndex === index }"
          ></div>

          <span class="acc-title">{{ item.title }}</span>
        </div>

        <!-- 펼침 아이콘 -->
        <div class="acc-toggle" @click.stop="toggleSection(index)">
          <span class="acc-icon" :class="{ open: activeIndex === index }"></span>
        </div>
      </div>

      <!-- BODY -->
      <transition name="acc">
        <div v-show="activeIndex === index" class="acc-body">
          <div class="acc-inner">
            <component
              :is="$slots[`content-${index}`]"
              v-bind="{ openNext: () => openNext(index) }"
            />
          </div>
        </div>
      </transition>
    </div>
  </main>
</template>

<script setup>
import { ref, reactive, watch, nextTick, onMounted } from 'vue'

/* props */
const props = defineProps({
  items: { type: Array, required: true },
})

/* 상태 */
const activeIndex = ref(0)
const checkStates = ref([])

const headerRefs = reactive([])
const globalHeaderHeight = ref(0)

/* ref setter */
const setHeaderRef = (el, index) => {
  if (el) headerRefs[index] = el
}

/* 체크 배열 초기화 */
watch(
  () => props.items,
  items => {
    checkStates.value = Array(items.length).fill(false)
  },
  { immediate: true }
)

/* 글로벌 헤더 높이 계산 */
onMounted(() => {
  const gh = document.querySelector('.global-header')
  globalHeaderHeight.value = gh ? gh.offsetHeight : 64
  document.documentElement.style.setProperty('--sticky-top', globalHeaderHeight.value + 'px')
})

/* 아코디언 토글 */
const toggleSection = async index => {
  activeIndex.value = index
  await nextTick()
  scrollToHeader(index)
}

/* 체크 토글 */
const toggleCheck = index => {
  checkStates.value[index] = !checkStates.value[index]
}

/* 스크롤 이동 + 마지막 항목 보정 */
const scrollToHeader = async index => {
  const el = headerRefs[index]
  if (!el) return

  await nextTick()

  const rect = el.getBoundingClientRect()
  const extraOffset = window.innerWidth < 600 ? 36 : 8

  let targetY = window.scrollY + rect.top - globalHeaderHeight.value - extraOffset

  /* ★★★ 마지막 항목 보정 — 한계 넘어가면 최대 스크롤로 고정 */
  const maxScrollable = document.body.scrollHeight - window.innerHeight
  if (targetY > maxScrollable) {
    targetY = maxScrollable
  }

  window.scrollTo({
    top: targetY,
    behavior: 'smooth',
  })

  /* sticky 안정화 후 2차 보정 */
  setTimeout(() => {
    const rect2 = el.getBoundingClientRect()
    let adjustY = window.scrollY + rect2.top - globalHeaderHeight.value - extraOffset

    if (adjustY > maxScrollable) {
      adjustY = maxScrollable
    }

    window.scrollTo({
      top: adjustY,
      behavior: 'auto',
    })
  }, 180)
}

/* 다음 버튼 */
const openNext = async currentIndex => {
  const next = currentIndex + 1
  if (next >= props.items.length) return

  activeIndex.value = next
  checkStates.value[next] = true

  await nextTick()
  scrollToHeader(next)
}
</script>

<style scoped>
/* 페이지 */
.terms-page {
  margin-top: 64px;
  padding-bottom: 200px;
}

/* item */
.acc-item {
  border-bottom: 1px solid #eee;
}

/* sticky header */
.acc-header {
  position: sticky;
  top: var(--sticky-top);
  z-index: 20;
  background: #fff;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: box-shadow 0.25s ease;
}
.acc-header.active {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

/* 제목 + 아이콘 */
.agree-label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.acc-title {
  font-weight: 600;
}

/* 체크 아이콘 */
.check-icon {
  width: 22px;
  height: 22px;
  border: 2px solid #555;
  border-radius: 50%;
  position: relative;
  transition: all 0.2s ease;
}

.check-icon.checked {
  background: #0ab;
  border-color: #0ab;
}

.check-icon.checked::after {
  content: '✔';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #fff;
  font-size: 14px;
  font-weight: bold;
}

/* 우측 토글 아이콘 */
.acc-toggle {
  padding: 8px;
  cursor: pointer;
}

.acc-icon {
  width: 16px;
  height: 16px;
  border: 2px solid #333;
  border-radius: 2px;
  transition: transform 0.25s ease;
}

.acc-icon.open {
  transform: rotate(45deg);
}

/* body */
.acc-body {
  overflow: hidden;
}

.acc-inner {
  padding: 16px;
}

/* transition */
.acc-enter-from,
.acc-leave-to {
  max-height: 0;
  opacity: 0;
}

.acc-enter-active,
.acc-leave-active {
  transition:
    max-height 0.25s ease,
    opacity 0.25s ease;
}

.acc-enter-to,
.acc-leave-from {
  max-height: 600px;
  opacity: 1;
}
</style>
