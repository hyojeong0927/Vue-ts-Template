<template>
  <div>
    <h3>icon + label + desc + row</h3>
    <Step
      :steps="[
        { icon: 'shopping-cart', label: '주문', desc: '상품 선택' },
        { icon: 'credit-card', label: '결제', desc: '결제 진행' },
        { icon: 'truck', label: '배송', desc: '상품 배송' },
        { icon: 'check', label: '완료' },
      ]"
      :current="2"
    />
    <h3>number only + row</h3>
    <Step :steps="['Step1', 'Step2', 'Step3']" numberOnly :current="3" />
    <h3>icon only + column</h3>
    <Step
      :steps="[{ icon: 'shopping-cart' }, { icon: 'credit-card' }, { icon: 'truck' }]"
      iconOnly
      :current="1"
      direction="column"
    />
  </div>
</template>

<script setup>
import Step from '@/components/etc/Step.vue'
</script>

<style lang="scss" scoped></style>
