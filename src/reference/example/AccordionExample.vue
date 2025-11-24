<template>
  <div>
    <h3>Accordion</h3>
    <Accordion :items="accordionItems">
      <template #content-0="{ openNext }">
        <Sample />
        <button @click="openNext">동의하고 다음</button>
      </template>

      <!-- 두번째 아코디언 콘텐츠 -->
      <template #content-1="{ openNext }">
        내용2
        <button @click="openNext">다음</button>
      </template>
      <template #content-2="{ openNext }">
        <Sample />
        <button @click="openNext">다음</button>
      </template>
      <template #content-3="{ openNext }">
        <Sample />
        <button @click="openNext">다음</button>
      </template>
      <template #content-4="{ openNext }">
        <Sample />
        <button @click="openNext">다음</button>
      </template>
      <template #content-5="{ openNext }">
        <Sample />
        <button @click="openNext">완료</button>
      </template>
    </Accordion>
  </div>
</template>

<script setup>
import Accordion from '@/components/etc/Accordion.vue'
import Sample from './Sample.vue'
const accordionItems = [
  { title: '제목1' },
  { title: '제목2' },
  { title: '제목3' },
  { title: '제목4' },
  { title: '제목5' },
]
</script>

<style lang="scss" scoped></style>
