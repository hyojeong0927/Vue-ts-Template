<template>
  <section
    :class="[
      'container',
      fluid ? 'container--fluid' : '',
      center ? 'container--center' : '',
      className,
    ]"
    :style="customStyle"
  >
    <slot />
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  fluid?: boolean // 전체 폭 사용
  center?: boolean // 텍스트 중앙 정렬
  padding?: string // 패딩 커스터마이즈
  maxWidth?: string // 최대 폭 지정
  className?: string // 추가 클래스
}

const props = defineProps<Props>()

const customStyle = computed(() => ({
  padding: props.padding || '0',
  maxWidth: props.fluid ? '100%' : props.maxWidth || '1920px',
  margin: '0 auto',
  transition: 'all 0.3s ease-in-out', // 애니메이션 추가
}))
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-height: 100vh; /* 화면 전체 높이 확보 */
  box-sizing: border-box;
  transition: all 0.3s ease-in-out; /* 반응형 애니메이션 */
}

/* 중앙 정렬 */
.container--center {
  text-align: center;
}

/* 반응형 스타일 */
@media (max-width: 1200px) {
  .container {
    padding: 0 16px;
    max-width: 1000px;
  }
}

@media (max-width: 992px) {
  .container {
    padding: 0 12px;
    max-width: 800px;
  }
}

@media (max-width: 768px) {
  .container {
    padding: 0 8px;
    max-width: 100%;
  }
}
</style>
