<template>
  <div class="button-demo">
    <h3>버튼 컴포넌트 예시</h3>

    <BaseButton variant="primary" to="/guide/rule">Primary 버튼</BaseButton>

    <BaseButton variant="secondary" size="small" to="/guide/rule" new-tab>
      Secondary Small
    </BaseButton>

    <BaseButton variant="danger" size="large">Danger Large</BaseButton>

    <BaseButton :disabled="true">Disabled 버튼</BaseButton>
  </div>
</template>

<script setup>
import BaseButton from '../../components/Button.vue'
</script>
<style scoped>
.button-demo {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px 20px;
}
</style>
