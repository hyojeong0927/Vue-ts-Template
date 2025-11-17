<script setup>
import { ref, defineProps, nextTick } from 'vue'

const props = defineProps({
  items: {
    type: Array,
    default: () => [],
  },
  allowMultiple: {
    type: Boolean,
    default: false,
  },
})

const activeIndexes = ref([])

/* -------------------------------
   아코디언 토글
-------------------------------- */
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
}

/* -------------------------------
   Transition Hooks
-------------------------------- */
const enter = el => {
  el.style.height = '0px'
  el.style.overflow = 'hidden'

  const height = el.scrollHeight

  requestAnimationFrame(() => {
    el.style.height = height + 'px'
  })

  el.addEventListener(
    'transitionend',
    () => {
      el.style.height = 'auto'
      el.style.overflow = 'hidden'
    },
    { once: true }
  )
}

const leave = el => {
  const height = el.scrollHeight

  el.style.height = height + 'px'
  el.style.overflow = 'hidden'

  requestAnimationFrame(() => {
    el.style.height = '0px'
  })
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

      <transition @enter="enter" @leave="leave">
        <div v-show="activeIndexes.includes(index)" class="accordion__content">
          <div class="accordion__inner">
            {{ item.content }}
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
  overflow: hidden;
  transition: height 0.3s ease;
}

.accordion__inner {
  padding: 12px 16px;
  background: #fff;
}
</style>
