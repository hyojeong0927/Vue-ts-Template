<template>
  <!-- 오버레이 -->
  <div v-if="visible" class="sheet-overlay" @click="close"></div>

  <!-- 바텀시트 -->
  <transition name="bottom-sheet">
    <div v-if="visible" class="bottom-sheet">
      <slot />
    </div>
  </transition>
</template>
<script setup>
const props = defineProps({
  visible: { type: Boolean, default: false },
})

const emit = defineEmits(['close'])

const close = () => emit('close')
</script>
<style scoped>
/* 오버레이 페이드 */
.sheet-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(2px);
  z-index: 998;
}

/* 바텀시트 기본 */
.bottom-sheet {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  max-height: 85vh;
  background: #fff;
  border-radius: 16px 16px 0 0;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
  z-index: 999;
  overflow-y: auto;
}

/* ⭐ 등장 애니메이션 */
.bottom-sheet-enter-from {
  transform: translateY(100%);
  opacity: 0;
}
.bottom-sheet-enter-to {
  transform: translateY(0);
  opacity: 1;
}
.bottom-sheet-enter-active {
  transition:
    transform 0.35s ease,
    opacity 0.3s ease;
}

/* ⭐ 닫힘 애니메이션 */
.bottom-sheet-leave-from {
  transform: translateY(0);
  opacity: 1;
}
.bottom-sheet-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
.bottom-sheet-leave-active {
  transition:
    transform 0.3s ease,
    opacity 0.25s ease;
}
</style>
