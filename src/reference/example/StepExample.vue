<template>
  <div>
    <!-- 1) 단순 문자열 배열 버전 -->
    <!-- <Step :steps="['정보 입력', '확인', '완료']" :current="2" /> -->

    <!-- 2) 객체 배열 버전 (label / desc / icon 지원) -->
    <Step :steps="steps" :current="1" />
    <Step :steps="steps" :current="1" number-only />
  </div>
</template>

<script setup>
import Step from '@/components/etc/Step.vue'

const steps = [
  { label: '정보 입력', desc: '기본 정보 작성', icon: 'check' },
  { label: '확인', desc: '입력 정보 확인' },
  { label: '완료' },
]
</script>

<style lang="scss" scoped></style>
