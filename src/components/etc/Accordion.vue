<script setup>
import { ref, defineProps, nextTick } from 'vue'

const props = defineProps({
  items: {
    type: Array,
    required: true,
    default: () => [],
  },
  allowMultiple: {
    type: Boolean,
    default: false,
  },
})

const activeIndexes = ref([])

const toggle = async index => {
  if (props.allowMultiple) {
    if (activeIndexes.value.includes(index)) {
      activeIndexes.value = activeIndexes.value.filter(i => i !== index)
    } else {
      activeIndexes.value.push(index)
    }
  } else {
    activeIndexes.value = activeIndexes.value[0] === index ? [] : [index]
  }
}
</script>

<template>
  <div class="accordion">
    <div v-for="(item, index) in items" :key="index" class="accordion__item">
      <button class="accordion__header" @click="toggle(index)">
        {{ item.title }}
        <span class="accordion__icon">
          {{ activeIndexes.includes(index) ? '−' : '+' }}
        </span>
      </button>

      <transition
        name="accordion-slide"
        enter-active-class="accordion-slide-enter-active"
        leave-active-class="accordion-slide-leave-active"
      >
        <div v-if="activeIndexes.includes(index)" class="accordion__content">
          {{ item.content }}
        </div>
      </transition>
    </div>
  </div>
</template>
<!-- <Accordion :items="accordionItems" :allowMultiple="true" />
const accordionItems = [
  { title: '아코디언 1', content: '내용 1입니다.' },
  { title: '아코디언 2', content: '내용 2입니다.' },
  { title: '아코디언 3', content: '내용 3입니다.' },
] -->
<style scoped>
.accordion {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
}
.accordion__item + .accordion__item {
  border-top: 1px solid #ddd;
}
.accordion__header {
  width: 100%;
  padding: 12px 16px;
  background: #f8f8f8;
  font-weight: 600;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}
.accordion__content {
  padding: 12px 16px;
  background: #fff;
  overflow: hidden;
}

/* 슬라이드 애니메이션 */
.accordion-slide-enter-active,
.accordion-slide-leave-active {
  transition:
    max-height 0.3s ease,
    padding 0.3s ease;
}
.accordion-slide-enter-from,
.accordion-slide-leave-to {
  max-height: 0;
  padding-top: 0;
  padding-bottom: 0;
}
.accordion-slide-enter-to,
.accordion-slide-leave-from {
  max-height: 500px; /* 최대 높이 조정 가능 */
  padding-top: 12px;
  padding-bottom: 12px;
}
</style>
