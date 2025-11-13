<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: {
    type: [String, Number],
    default: '',
  },
  variant: {
    type: String,
    default: 'default', // 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'outline'
  },
  color: {
    type: String,
    default: '', // outline일 때 커스텀 색 지정 가능 (선택사항)
  },
  size: {
    type: String,
    default: 'md', // 'sm' | 'md' | 'lg'
  },
  dot: {
    type: Boolean,
    default: false, // true면 점만 표시
  },
  outline: {
    type: Boolean,
    default: false, // true면 outline 스타일로 강제 적용
  },
})

const classes = computed(() => [
  'badge',
  `badge--${props.size}`,
  props.outline ? `badge--outline-${props.variant}` : `badge--${props.variant}`,
  { 'badge--dot': props.dot },
])
const styleVars = computed(() => ({
  '--badge-color': props.color || 'inherit',
}))
</script>

<template>
  <span :class="classes" :style="styleVars">
    <slot>
      <template v-if="!dot">{{ label }}</template>
    </slot>
  </span>
</template>
<!-- <Badge label="기본" /> -->
<!-- <Badge label="Primary" variant="primary" /> -->
<!-- <Badge :label="5" variant="primary" /> -->
<!-- <Badge label="Outline" variant="primary" outline /> -->
<style scoped lang="scss">
.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  font-weight: 500;
  white-space: nowrap;
  line-height: 1;
  transition: all 0.2s ease;
  border: 1px solid transparent;

  &--sm {
    font-size: 0.75rem;
    padding: 0.15rem 0.4rem;
  }

  &--md {
    font-size: 0.8125rem;
    padding: 0.25rem 0.6rem;
  }

  &--lg {
    font-size: 0.875rem;
    padding: 0.35rem 0.75rem;
  }

  /* ─── 기본 variant ─────────────────────────────────────────── */
  &--default {
    background: #e9ecef;
    color: #333;
  }

  &--primary {
    background: #007bff;
    color: #fff;
  }

  &--success {
    background: #28a745;
    color: #fff;
  }

  &--warning {
    background: #ffc107;
    color: #212529;
  }

  &--danger {
    background: #dc3545;
    color: #fff;
  }

  /* ─── outline variant ───────────────────────────────────────── */
  &--outline-default {
    background: transparent;
    color: #333;
    border-color: #ccc;
  }

  &--outline-primary {
    background: transparent;
    color: #007bff;
    border-color: #007bff;
  }

  &--outline-success {
    background: transparent;
    color: #28a745;
    border-color: #28a745;
  }

  &--outline-warning {
    background: transparent;
    color: #ffc107;
    border-color: #ffc107;
  }

  &--outline-danger {
    background: transparent;
    color: #dc3545;
    border-color: #dc3545;
  }

  /* ─── 커스텀 색상 지원 ─────────────────────────────────────── */
  &[style*='--badge-color'] {
    color: var(--badge-color);
    border-color: var(--badge-color);
  }

  /* ─── 점 형태 ───────────────────────────────────────────────── */
  &--dot {
    width: 10px;
    height: 10px;
    padding: 0;
    border-radius: 50%;
  }
}
</style>
