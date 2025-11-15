<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: {
    type: [String, Number],
    default: '',
  },
  variant: {
    type: String,
    default: 'default',
  },
  color: {
    type: String,
    default: '',
  },
  size: {
    type: String,
    default: 'md',
  },
  dot: {
    type: Boolean,
    default: false,
  },
  outline: {
    type: Boolean,
    default: false,
  },
})

const badgeClass = computed(() => ({
  badge: true,
  [`badge--${props.size}`]: true,
  [`badge--${props.variant}`]: !props.outline,
  [`badge--outline`]: props.outline,
  'badge--dot': props.dot,
}))
</script>

<template>
  <span :class="badgeClass">
    <template v-if="!dot">
      <slot>{{ label }}</slot>
    </template>
  </span>
</template>

<style scoped lang="scss">
// @use '@/styles/mixins.scss' as *;
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
  background: var(--badge-bg, initial);
  color: var(--badge-color, inherit);

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

  /* preset variants */
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

  /* outline 공통 처리 */
  &--outline {
    background: transparent !important;
    border-color: var(--badge-color, currentColor);
    color: var(--badge-color, currentColor);
  }

  /* dot 형태 */
  &--dot {
    width: 10px;
    height: 10px;
    padding: 0;
    border-radius: 50%;
    border-width: 2px;
  }
}
</style>
