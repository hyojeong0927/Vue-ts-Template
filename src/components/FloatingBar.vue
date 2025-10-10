<template>
  <div class="floating-bar" :class="[variant, position]">
    <div class="floating-content">
      <slot />
    </div>
    <button class="floating-toggle" @click="toggle">
      {{ collapsed ? '▲' : '▼' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'default', // default, dark, primary
  },
  collapsed: {
    type: Boolean,
    default: false,
  },
  position: {
    type: String,
    default: 'bottom-right', // 위치 옵션 기본값
    validator: (value: string) => {
      return ['bottom-right', 'bottom-left', 'top-right', 'top-left'].includes(value)
    },
  },
})

const emit = defineEmits(['update:collapsed'])

function toggle() {
  emit('update:collapsed', !props.collapsed)
}
</script>

<style scoped>
.floating-bar {
  position: fixed;
  display: flex;
  align-items: center;
  background: white;
  padding: 10px 15px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  z-index: 1000;
}

/* 위치 옵션 */
.floating-bar.bottom-right {
  bottom: 20px;
  right: 20px;
}
.floating-bar.bottom-left {
  bottom: 20px;
  left: 20px;
}
.floating-bar.top-right {
  top: 20px;
  right: 20px;
}
.floating-bar.top-left {
  top: 20px;
  left: 20px;
}

/* 스타일 variants */
.floating-bar.default {
  background: white;
}
.floating-bar.dark {
  background: #333;
  color: white;
}
.floating-bar.primary {
  background: #1976d2;
  color: white;
}

.floating-content {
  display: flex;
  gap: 8px;
}

.floating-toggle {
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 14px;
  margin-left: 8px;
}
</style>
