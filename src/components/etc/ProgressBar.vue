<template>
  <div class="progress-bar">
    <div class="progress-bar-fill" :style="{ width: percent + '%' }"></div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  percent: {
    type: Number,
    default: 0,
  },
})
</script>

<style scoped lang="scss">
.progress-bar {
  position: relative;
  height: 4px;
  width: 100%;
  background: #e5e5e5;
  border-radius: 2px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background: #007bff;
  width: 0%;
  transition: width 0.3s ease;
}
</style>
