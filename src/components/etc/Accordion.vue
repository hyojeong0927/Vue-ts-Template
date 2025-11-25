<script setup>
import { ref, nextTick } from 'vue'

const props = defineProps({
  items: { type: Array, required: true },
  allowMultiple: { type: Boolean, default: false },
})

/* 열림 상태 */
const activeIndexes = ref([0])

/* 각 아코디언 DOM 저장 */
const itemRefs = ref([])

/* 아코디언 토글 */
const toggle = async index => {
  const isOpen = activeIndexes.value.includes(index)

  if (props.allowMultiple) {
    activeIndexes.value = isOpen
      ? activeIndexes.value.filter(i => i !== index)
      : [...activeIndexes.value, index]
  } else {
    activeIndexes.value = isOpen ? [] : [index]
  }

  await nextTick()

  if (!isOpen) scrollToHeader(index)
}

/* 약관 다음 버튼 기능 */
const openNext = async index => {
  const next = index + 1
  if (next >= props.items.length) return

  activeIndexes.value = [next]
  await nextTick()
  scrollToHeader(next)
}

const scrollToHeader = index => {
  const el = itemRefs.value[index]
  if (!el) return

  el.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  })
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
        <span class="accordion__icon">
          <i class="" v-if="activeIndexes.includes(index)"></i>
          <i v-else></i>
        </span>
      </button>

      <transition name="acc">
        <div v-show="activeIndexes.includes(index)" class="accordion__content">
          <div class="accordion__inner">
            <slot :name="'content-' + index" :openNext="() => openNext(index)" />
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
}

/* ⭐ 현재 아이템을 상단에 정렬할 여백 확보 */
.accordion__item {
  scroll-margin-top: 80px; /* 상단 헤더 or 여백 높이에 맞게 조정 */
}

/* 구분선 */
.accordion__item + .accordion__item {
  border-top: 1px solid #ddd;
}

/* 헤더 버튼 */
.accordion__header {
  width: 100%;
  padding: 14px 16px;
  background: #fff;
  font-weight: 600;
  display: flex;
  justify-content: space-between;
  cursor: pointer;
  border-bottom: 1px solid #eee;
}

.accordion__icon {
  transition: transform 0.3s;
}
.accordion__icon.active {
  transform: rotate(45deg);
}

/* 열림/닫힘 애니메이션 */
.acc-enter-from,
.acc-leave-to {
  max-height: 0;
  opacity: 0;
}
.acc-enter-to,
.acc-leave-from {
  max-height: 600px;
  opacity: 1;
}
.acc-enter-active,
.acc-leave-active {
  transition: all 0.3s ease;
}

.accordion__content {
  overflow: hidden;
  background: #fff;
}

.accordion__inner {
  padding: 16px;
}
</style>
