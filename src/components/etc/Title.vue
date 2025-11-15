<template>
  <div class="title-wrap" :class="alignClass">
    <div class="title-texts">
      <component :is="tag" class="title">{{ title }}</component>
      <p v-if="subtitle" class="subtitle">{{ subtitle }}</p>
    </div>

    <div class="title-btn" v-if="$slots.titleBtn">
      <slot name="titleBtn" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  align: { type: String, default: 'left' }, // left | center | right
  tag: { type: String, default: 'h2' }, // h1 ~ h6
})

const alignClass = computed(() => `title--${props.align}`)
</script>

<style scoped lang="scss">
.title-wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  padding-bottom: 1rem;
  border-bottom: 1px solid #ddd;

  &.title--center {
    justify-content: center;
    text-align: center;

    .title-btn {
      margin-left: 0;
      margin-top: 0.5rem;
    }
  }

  &.title--right {
    justify-content: flex-end;
    text-align: right;
  }

  .title-texts {
    .title {
      font-weight: 600;
      margin: 0;
      font-size: 1.5rem; /* 기본 h2 기준, 필요시 태그별 폰트 조절 가능 */
    }

    .subtitle {
      font-size: 0.875rem;
      color: #777;
      margin-top: 0.25rem;
    }
  }

  .title-btn {
    margin-left: auto;

    button {
      font-size: 0.875rem;
      padding: 0.5rem 0.75rem;
      background: #007bff;
      color: #fff;
      border: none;
      border-radius: 4px;
      cursor: pointer;

      &:hover {
        background: #0069d9;
      }
    }
  }
}
</style>
