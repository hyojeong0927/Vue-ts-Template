<template>
  <Header2 />

  <Accordion :items="accordionItems">
    <template #content-0="{ openNext }">
      <Sample />
      <button @click="openNext">동의하고 다음</button>
    </template>

    <template #content-1="{ openNext }">
      두 번째 내용
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
      <button @click="openNext">다음</button>
    </template>

    <template #content-6="{ openNext }">
      <Sample />
      <button @click="openNext">다음</button>
    </template>

    <template #content-7="{ openNext }">
      <Sample />
      <button @click="openNext">다음</button>
    </template>

    <template #content-8="{ openNext }">
      <Sample />
      <button @click="openNext">다음</button>
    </template>

    <template #content-9="{ openNext }">
      <Sample />
      <button @click="openNext">다음</button>
    </template>
  </Accordion>
</template>

<script setup>
import Accordion from '@/components/etc/Accordion.vue'
import Header2 from '@/components/layouts/Header2.vue'
import Sample from './Sample.vue'

const accordionItems = [
  { title: '제목1' },
  { title: '제목2' },
  { title: '제목3' },
  { title: '제목4' },
  { title: '제목5' },
  { title: '제목6' },
  { title: '제목7' },
  { title: '제목8' },
  { title: '제목9' },
  { title: '제목10' },
]
</script>
