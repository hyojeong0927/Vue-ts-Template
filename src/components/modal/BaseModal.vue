<template>
  <transition name="fade">
    <div v-if="visible" class="modal-overlay" @click.self="close">
      <transition name="slide">
        <div class="modal-content" :class="sizeClass">
          <!-- 헤더 -->
          <header class="modal-header" v-if="title">
            <h3 class="modal-title">{{ title }}</h3>
            <button class="close-btn" @click="close">×</button>
          </header>

          <!-- 내용 -->
          <section class="modal-body">
            <slot />
            <p v-if="message">{{ message }}</p>
          </section>

          <!-- 푸터 -->
          <footer class="modal-footer">
            <template v-if="type === 'confirm'">
              <button class="btn cancel" @click="close">취소</button>
              <button class="btn ok" @click="confirm">확인</button>
            </template>
            <template v-else-if="type === 'alert'">
              <button class="btn ok" @click="close">확인</button>
            </template>
            <template v-else>
              <slot name="footer">
                <button class="btn" @click="close">닫기</button>
              </slot>
            </template>
          </footer>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  visible: { type: Boolean, default: false },
  title: { type: String, default: '' },
  message: { type: String, default: '' },
  size: { type: String, default: 'medium' }, // small, medium, large
  type: { type: String, default: 'default' }, // default, alert, confirm
})

const emit = defineEmits(['close', 'confirm'])

const close = () => emit('close')
const confirm = () => emit('confirm')

const sizeClass = computed(() => {
  switch (props.size) {
    case 'small':
      return 'modal-sm'
    case 'large':
      return 'modal-lg'
    default:
      return 'modal-md'
  }
})
</script>

<style scoped>
/* Overlay */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

/* Content */
.modal-content {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
  overflow: hidden;
  transition: all 0.25s ease;
}
.modal-sm {
  width: 300px;
}
.modal-md {
  width: 420px;
}
.modal-lg {
  width: 600px;
}

/* Header */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f5f5f5;
  padding: 12px 18px;
  border-bottom: 1px solid #ddd;
}
.modal-title {
  font-size: 1.1rem;
  font-weight: 600;
}
.close-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
}

/* Body */
.modal-body {
  padding: 20px;
  line-height: 1.6;
}

/* Footer */
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 12px 18px;
  border-top: 1px solid #eee;
}
.btn {
  padding: 6px 14px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
}
.btn.ok {
  background-color: #007bff;
  color: #fff;
}
.btn.cancel {
  background-color: #ccc;
}
.btn.ok:hover {
  background-color: #0069d9;
}

/* Animations */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.25s ease;
}
.slide-enter-from {
  transform: translateY(-10px);
}
.slide-leave-to {
  transform: translateY(-10px);
}
</style>
