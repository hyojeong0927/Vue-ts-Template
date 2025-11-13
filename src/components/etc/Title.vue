<script setup>
import { computed } from 'vue'

// Props 정의
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    default: '',
  },
  align: {
    type: String,
    default: 'left', // 'left' | 'center' | 'right'
  },
})

// 정렬 클래스 계산
const alignClass = computed(() => `title--${props.align}`)
</script>

<template>
  <div class="title-wrap" :class="alignClass">
    <div class="title-texts">
      <h2 class="title">{{ title }}</h2>
      <p v-if="subtitle" class="subtitle">{{ subtitle }}</p>
    </div>

    <!-- 버튼 슬롯 -->
    <div class="title-btn">
      <slot name="titleBtn" />
    </div>
  </div>
</template>
<!-- <Title title="게시판" subtitle="전체 게시글 조회" /> -->

<style scoped lang="scss">
.title-wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 1rem;
  border-bottom: 1px solid #ddd;

  &.title--center {
    justify-content: center;
    text-align: center;
  }

  &.title--right {
    justify-content: flex-end;
    text-align: right;
  }

  .title-texts {
    .title {
      font-size: 1.5rem;
      font-weight: 600;
      margin: 0;
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
