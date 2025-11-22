<template>
  <div class="button-demo">
    <h3>버튼 컴포넌트 예시</h3>

    <BaseButton variant="primary" to="/guide/rule">Primary 버튼</BaseButton>

    <BaseButton variant="secondary" size="small" to="/guide/rule" newPage>
      Secondary Small
    </BaseButton>

    <BaseButton variant="danger" size="large">Danger Large</BaseButton>

    <BaseButton :disabled="true">Disabled 버튼</BaseButton>
    <button @click="openPage({ name: 'home' })">홈으로</button>
    <button @click="openPage({ path: '/guide/rule' })">규칙 페이지</button>
    <button @click="openPage({ path: '/about' })">어바웃</button>
  </div>
</template>

<script setup>
import BaseButton from '../../components/Button.vue'
import { useRouter } from 'vue-router'
const router = useRouter()

const openPage = pathOrName => {
  const url = router.resolve(pathOrName).href
  window.open(url, '_blank')
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
