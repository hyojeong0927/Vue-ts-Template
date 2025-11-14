<script setup>
import { computed } from 'vue'

const props = defineProps({
  align: {
    type: String,
    default: 'right', // left | center | right
  },
  direction: {
    type: String,
    default: 'row', // row | column
  },
})

const alignClass = computed(() => `btn-area--${props.align}`)
</script>

<template>
  <div class="btn-area" :class="[alignClass, `btn-area--${direction}`]">
    <slot />
  </div>
</template>
<!-- <BtnArea>
      <button class="primary" @click="onSave">저장</button>
      <button @click="onCancel">취소</button>
    </BtnArea> -->
<style scoped lang="scss">
.btn-area {
  display: flex;
  flex-wrap: wrap;
  margin-top: 1rem;

  &--left {
    justify-content: flex-start;
  }

  &--center {
    justify-content: center;
  }

  &--right {
    justify-content: flex-end;
  }

  button {
    min-width: 100px;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    font-size: 0.9375rem;
    cursor: pointer;
    border: 1px solid #ccc;
    background: #f9f9f9;
    transition: 0.2s;

    &:hover {
      background: #007bff;
      color: #fff;
      border-color: #007bff;
    }

    &.primary {
      background: #007bff;
      color: #fff;
      border-color: #007bff;

      &:hover {
        background: #0069d9;
      }
    }

    &.danger {
      background: #dc3545;
      color: #fff;
      border-color: #dc3545;

      &:hover {
        background: #c82333;
      }
    }
  }
}
</style>
