<template>
  <FloatingBar v-model:collapsed="isCollapsed" variant="primary" position="bottom-right">
    <button @click="onAction">⚙ 설정</button>
    <button @click="onHelp">❓ 도움말</button>
  </FloatingBar>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import FloatingBar from '@/components/FloatingBar.vue'

const isCollapsed = ref(false)

function onAction() {
  alert('설정 버튼 클릭!')
}

function onHelp() {
  alert('도움말 버튼 클릭!')
}
</script>
