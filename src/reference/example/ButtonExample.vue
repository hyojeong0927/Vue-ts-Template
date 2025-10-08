<template>
  <div class="button-demo">
    <h3>버튼 컴포넌트 예시</h3>

    <BaseButton variant="primary" @click="onClick">Primary 버튼</BaseButton>

    <BaseButton variant="secondary" size="small" @click="onClick">Secondary Small</BaseButton>

    <BaseButton variant="danger" size="large" @click="onClick">Danger Large</BaseButton>

    <BaseButton :disabled="true" @click="onClick">Disabled 버튼</BaseButton>
  </div>
</template>

<script setup lang="ts">
import BaseButton from '../../components/common/Button.vue'

function onClick() {
  alert('버튼 클릭!')
}
</script>
<style scoped>
.button-demo {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px 20px;
}
</style>
