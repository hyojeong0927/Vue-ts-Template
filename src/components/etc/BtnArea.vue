<script setup>
import { computed } from 'vue'

const { align, direction } = defineProps({
  align: { type: String, default: 'right' },
  direction: { type: String, default: 'row' },
})

const alignClass = computed(() => `btn-area--${align}`)
</script>

<template>
  <div class="btn-area" :class="[alignClass, `btn-area--${direction}`]">
    <slot />
  </div>
</template>

<style scoped lang="scss">
.btn-area {
  display: flex;
  flex-wrap: wrap;
  margin-top: 1rem;
  gap: 0.5rem;

  &--row {
    flex-direction: row;
  }

  &--column {
    flex-direction: column;

    button {
      margin-bottom: 0.5rem;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }
  &--left {
    justify-content: flex-start;
  }
  &--right {
    justify-content: flex-end;
  }
  &--center {
    justify-content: center;
  }
  &--between {
    justify-content: space-between;
  }
}
</style>
