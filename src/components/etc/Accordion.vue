<script setup>
import { ref, nextTick } from 'vue'

const props = defineProps({
  items: { type: Array, required: true },
  allowMultiple: { type: Boolean, default: false },
  agree: { type: Boolean, default: false }, // 약관모드 여부
})

/* 열림 상태 */
const activeIndexes = ref([0])

/* DOM refs */
const itemRefs = ref({})

/* 아코디언 토글 */
const checkStates = ref({})
const toggle = async index => {
  const isOpen = activeIndexes.value.includes(index)

  if (props.allowMultiple) {
    activeIndexes.value = isOpen
      ? activeIndexes.value.filter(i => i !== index)
      : [...activeIndexes.value, index]
  } else {
    activeIndexes.value = isOpen ? [] : [index]
  }

  // ⭐ 버튼 클릭 시 체크박스도 선택되게
  if (props.agree) {
    checkStates.value[index] = !checkStates.value[index]
  }

  await nextTick()

  if (!isOpen) scrollToHeader(index)
}

/* 약관용 다음 버튼(agree=true 일 때만 사용됨) */
const openNext = async index => {
  if (!props.agree) return // ⭐ 일반 모드에서는 실행 금지

  const next = index + 1
  if (next >= props.items.length) return

  activeIndexes.value = [next]
  await nextTick()
  scrollToHeader(next)
}

/* 스크롤 이동 */
const scrollToHeader = index => {
  const el = itemRefs.value[index]
  if (!el) return

  el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<template>
  <div class="accordion">
    <div
      v-for="(item, index) in items"
      :key="index"
      class="accordion__item"
      :ref="
        el => {
          if (!el) return
          if (!itemRefs.value) itemRefs.value = {}
          itemRefs.value[index] = el
        }
      "
    >
      <!-- 약관(agree=true) 모드 -->
      <button class="accordion__header" @click="toggle(index)" v-show="agree">
        <label class="agree-label" @click.stop>
          <input type="checkbox" v-model="checkStates[index]" @click.stop />
          {{ item.title }}
        </label>

        <span :class="['accordion__icon', activeIndexes.includes(index) && 'active']">
          <i v-if="activeIndexes.includes(index)" class="icon-open"></i>
          <i v-else class="icon-close"></i>
        </span>
      </button>

      <!-- 일반 모드 -->
      <button class="accordion__header" @click="toggle(index)" v-show="!agree">
        {{ item.title }}
        <span :class="['accordion__icon', activeIndexes.includes(index) && 'active']">
          <i v-if="activeIndexes.includes(index)" class="icon-open"></i>
          <i v-else class="icon-close"></i>
        </span>
      </button>

      <!-- 콘텐츠 -->
      <transition name="acc">
        <div v-show="activeIndexes.includes(index)" class="accordion__content">
          <div class="accordion__inner">
            <!-- ⭐ agree 모드일 때만 openNext 전달 -->
            <slot v-if="agree" :name="'content-' + index" :openNext="() => openNext(index)" />

            <!-- ⭐ 일반 모드: openNext 전달 없음 -->
            <slot v-else :name="'content-' + index" />
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

.accordion__item {
  scroll-margin-top: 80px;
}

.accordion__item + .accordion__item {
  border-top: 1px solid #ddd;
}

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

.agree-label {
  display: flex;
  align-items: center;
  gap: 8px;
}

.accordion__icon {
  transition: transform 0.3s;
}

.accordion__icon.active {
  transform: rotate(45deg);
}

/* transition */
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
