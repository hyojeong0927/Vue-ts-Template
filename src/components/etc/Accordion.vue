<script setup>
import { ref, nextTick } from 'vue'

const props = defineProps({
  items: Array,
  allowMultiple: { type: Boolean, default: false },
})

/* ------------------------------------
   기본 상태
------------------------------------ */
const activeIndexes = ref([0]) // 첫 번째 제목 기본 오픈
const itemRefs = ref([])

/* ------------------------------------
   Toggle
------------------------------------ */
const toggle = async index => {
  const isActive = activeIndexes.value.includes(index)

  if (props.allowMultiple) {
    activeIndexes.value = isActive
      ? activeIndexes.value.filter(i => i !== index)
      : [...activeIndexes.value, index]
  } else {
    activeIndexes.value = isActive ? [] : [index]
  }

  await nextTick()

  // 열릴 때 scroll
  if (!isActive) {
    waitTransitionEnd(index, () => scrollToHeader(index))
  }
}

/* ------------------------------------
   약관 플로우: 다음 항목 열기
------------------------------------ */
const openNext = async index => {
  const nextIndex = index + 1
  if (nextIndex >= props.items.length) return

  activeIndexes.value = [nextIndex]

  await nextTick()
  scrollToHeader(nextIndex)
}

/* ------------------------------------
   transition 종료 감지
------------------------------------ */
const waitTransitionEnd = (index, callback) => {
  const el = itemRefs.value[index]
  if (!el) return

  const contentEl = el.querySelector('.accordion__content')
  if (!contentEl) return

  const onEnd = () => {
    contentEl.removeEventListener('transitionend', onEnd)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        callback()
      })
    })
  }

  contentEl.addEventListener('transitionend', onEnd)
}

/* ------------------------------------
   Scroll Parent 자동 감지
------------------------------------ */
const getScrollParent = element => {
  let parent = element.parentElement

  while (parent) {
    const style = window.getComputedStyle(parent)
    const overflowY = style.overflowY
    const canScroll =
      (overflowY === 'auto' || overflowY === 'scroll') && parent.scrollHeight > parent.clientHeight

    if (canScroll) return parent
    parent = parent.parentElement
  }

  return window
}

/* ------------------------------------
   Header 바로 아래로 위치시키기
------------------------------------ */
const scrollToHeader = index => {
  const el = itemRefs.value[index]
  if (!el) return

  const headerEl = el.querySelector('.accordion__header')
  if (!headerEl) return

  const scrollParent = getScrollParent(el)

  const fixedHeader = document.querySelector('.global-header')
  const headerHeight = fixedHeader ? fixedHeader.getBoundingClientRect().height : 0

  const offset = headerHeight

  const parentRect = scrollParent === window ? { top: 0 } : scrollParent.getBoundingClientRect()

  const currentScroll = scrollParent === window ? window.scrollY : scrollParent.scrollTop

  const target = headerEl.getBoundingClientRect().top - parentRect.top + currentScroll - offset

  const safeTarget = Math.ceil(target)

  scrollParent.scrollTo({
    top: safeTarget,
    behavior: 'smooth',
  })
}

/* ------------------------------------
   Transition (열기/닫기)
------------------------------------ */
const enter = el => {
  el.style.height = '0px'
  el.style.opacity = '0'
  el.style.transform = 'translateY(20px)'
  el.style.overflow = 'hidden'
  el.style.transition = 'height 0.3s ease, opacity 0.3s ease, transform 0.3s ease'

  const height = el.scrollHeight

  requestAnimationFrame(() => {
    el.style.height = height + 'px'
    el.style.opacity = '1'
    el.style.transform = 'translateY(0)'
  })

  el.addEventListener(
    'transitionend',
    () => {
      el.style.height = 'auto'
      el.style.transform = 'none'
    },
    { once: true }
  )
}

const leave = el => {
  const height = el.scrollHeight

  el.style.height = height + 'px'
  el.style.opacity = '1'
  el.style.transform = 'translateY(0)'
  el.style.transition = 'height 0.25s ease, opacity 0.25s ease, transform 0.25s ease'
  el.style.overflow = 'hidden'

  requestAnimationFrame(() => {
    el.style.height = '0px'
    el.style.opacity = '0'
    el.style.transform = 'translateY(20px)'
  })

  el.addEventListener(
    'transitionend',
    () => {
      // 닫힌 뒤 현재 열린 아코디언 위치 보정
      const currentIndex = activeIndexes.value[0]
      if (currentIndex !== undefined) {
        requestAnimationFrame(() => {
          scrollToHeader(currentIndex)
        })
      }
    },
    { once: true }
  )
}
</script>

<template>
  <div class="accordion">
    <div
      v-for="(item, index) in items"
      :key="index"
      class="accordion__item"
      :ref="el => (itemRefs[index] = el)"
    >
      <button class="accordion__header" @click="toggle(index)">
        {{ item.title }}
        <span class="accordion__icon" :class="{ active: activeIndexes.includes(index) }">
          {{ activeIndexes.includes(index) ? '−' : '+' }}
        </span>
      </button>

      <transition @enter="enter" @leave="leave">
        <div v-show="activeIndexes.includes(index)" class="accordion__content">
          <div class="accordion__inner">
            <slot :name="'content-' + index" :openNext="() => openNext(index)"></slot>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<style scoped>
.accordion {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: visible; /* sticky 정상 작동 필수 */
}

/* 아이템 구분 라인 */
.accordion__item + .accordion__item {
  border-top: 1px solid #ddd;
}

/* ⭐ sticky 적용 */
.accordion__header {
  width: 100%;
  padding: 12px 16px;
  background: #fff;
  font-weight: 600;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;

  position: sticky;
  top: 81px; /* Header 높이에 맞게 조정 */
  z-index: 20;
  border-bottom: 1px solid #eee;
}

/* transition은 JS에서 처리하므로 none */
.accordion__content {
  overflow: hidden;
  transition: none;
}

.accordion__inner {
  padding: 12px 16px;
  background: #fff;
}

.accordion__icon {
  transition: transform 0.3s;
}
.accordion__icon.active {
  transform: rotate(45deg);
}
</style>
