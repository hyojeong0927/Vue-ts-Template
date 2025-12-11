<template>
  <teleport to="body">
    <div v-if="visible" class="popup-overlay" @click.self="close">
      <div class="popup-container">
        <!-- HEADER -->
        <div class="popup-header">
          <slot name="header">
            <h3>{{ title }}</h3>
          </slot>
        </div>

        <!-- BODY -->
        <div class="popup-body">
          <slot> 기본 내용입니다. </slot>
        </div>

        <!-- FOOTER -->
        <div class="popup-footer">
          <slot name="footer">
            <button @click="close">닫기</button>
          </slot>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
const props = defineProps({
  visible: Boolean,
  title: String,
})

const emit = defineEmits(['close'])
const close = () => emit('close')
</script>

<style scoped>
.popup-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
}
.popup-container {
  width: 400px;
  background: white;
  border-radius: 8px;
  overflow: hidden;
}
.popup-header,
.popup-footer {
  padding: 16px;
  border-bottom: 1px solid #eee;
}
.popup-body {
  padding: 16px;
}
</style>
