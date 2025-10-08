<template>
  <main
    :class="['main-content', className]"
    :style="{
      padding: padding,
      background: background,
      width: '100%',
      margin: center ? '0 auto' : undefined,
      transition: 'all 0.3s ease-in-out',
    }"
  >
    <slot />
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  padding?: string
  background?: string
  center?: boolean
  className?: string
}

const props = defineProps<Props>()

const padding = computed(() => props.padding || '')
const background = computed(() => props.background || 'transparent')
const center = computed(() => props.center ?? false)
const className = computed(() => props.className || '')
</script>

<style scoped>
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: auto;
  width: 100%;
  transition: all 0.3s ease-in-out;
}

/* 반응형 스타일 */
@media (max-width: 1200px) {
  .main-content {
    padding: 0;
  }
}

@media (max-width: 992px) {
  .main-content {
    padding: 0;
  }
}

@media (max-width: 768px) {
  .main-content {
    padding: 0;
  }
}
</style>
