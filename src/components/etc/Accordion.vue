<template>
  <div class="terms-page">
    <!-- Accordion list -->
    <section v-for="(item, index) in items" :key="index" class="acc-section">
      <!-- TRUE HEADER (sticky 동작) -->
      <button
        class="acc-header"
        :class="{ 'is-open': activeIndex === index }"
        :ref="el => setHeaderRef(el, index)"
        @click="handleHeaderClick(index)"
      >
        <label class="agree-label" @click.stop>
          <input type="checkbox" v-model="checkStates[index]" @click.stop />
          <span class="agree-title">{{ item.title }}</span>
        </label>

        <span class="acc-icon" :class="{ active: activeIndex === index }"></span>
      </button>

      <!-- CONTENT -->
      <transition name="acc">
        <div v-show="activeIndex === index" class="acc-content">
          <div class="acc-inner">
            <component
              :is="$slots[`content-${index}`]"
              v-bind="{ openNext: () => openNext(index) }"
            />
          </div>
        </div>
      </transition>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive, nextTick, onMounted } from 'vue'

/* props */
const props = defineProps({
  items: { type: Array, required: true },
})

/* states */
const activeIndex = ref(0)
const checkStates = ref({})
const headerRefs = reactive([])

const globalHeaderHeight = ref(0)

/* ref setter */
const setHeaderRef = (el, index) => {
  if (el) headerRefs[index] = el
}

/* init */
onMounted(() => {
  // 체크박스 초기화
  props.items.forEach((_, i) => {
    if (checkStates.value[i] === undefined) checkStates.value[i] = false
  })

  // 글로벌 헤더 높이를 CSS 변수에 자동 삽입
  const globalHeader = document.querySelector('.global-header')
  globalHeaderHeight.value = globalHeader ? globalHeader.offsetHeight : 80

  document.documentElement.style.setProperty('--sticky-top', globalHeaderHeight.value + 'px')
})

/* Header 클릭 시 open + scroll 조정 */
const handleHeaderClick = async index => {
  activeIndex.value = index

  await nextTick()
  scrollToHeader(index)
}

/* 부드러운 스크롤 이동 */
const scrollToHeader = index => {
  const el = headerRefs[index]
  if (!el) return

  const rect = el.getBoundingClientRect()
  const top =
    window.pageYOffset + rect.top - globalHeaderHeight.value /* native sticky top 만큼 보정 */ - 2

  window.scrollTo({
    top,
    behavior: 'smooth',
  })
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
.terms-page {
  padding-bottom: 200px;
}

/* SECTION */
.acc-section {
  border-bottom: 1px solid #eee;
}

/* ==== STICKY HEADER (실제 헤더) ==== */
.acc-header {
  position: sticky;
  top: var(--sticky-top);
  z-index: 10;
  background: #fff;
  padding: 16px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition:
    box-shadow 0.25s ease,
    background 0.25s ease;
}

.acc-header.is-open {
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

/* 체크박스 + 제목 */
.agree-label {
  display: flex;
  align-items: center;
  gap: 8px;
}
input[type='checkbox'] {
  width: 20px;
  height: 20px;
}
.agree-title {
  font-weight: 600;
}

/* 아이콘 */
.acc-icon {
  width: 16px;
  height: 16px;
  border: 2px solid #333;
  border-radius: 2px;
  transition: transform 0.25s ease;
}
.acc-icon.active {
  transform: rotate(45deg);
}

/* CONTENT */
.acc-content {
  overflow: hidden;
  background: #fff;
}
.acc-inner {
  padding: 16px;
}

/* Animation */
.acc-enter-from,
.acc-leave-to {
  max-height: 0;
  opacity: 0;
}
.acc-enter-active,
.acc-leave-active {
  transition:
    max-height 0.3s ease,
    opacity 0.3s ease;
}
.acc-enter-to,
.acc-leave-from {
  max-height: 800px;
  opacity: 1;
}
</style>
