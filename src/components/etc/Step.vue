<template>
  <div class="step-wrapper">
    <div
      v-for="(step, index) in normalizedSteps"
      :key="index"
      :class="['step-item', { active: index + 1 === current }]"
    >
      <!-- 숫자만 표시하는 경우 -->
      <template v-if="numberOnly">
        <div class="step-number">{{ index + 1 }}</div>
      </template>

      <!-- 기본 구성 (아이콘 + 라벨 + 설명) -->
      <template v-else>
        <div class="step-icon" v-if="step.icon">
          <i :class="`icon-${step.icon}`"></i>
        </div>

        <div class="step-label">{{ step.label }}</div>
        <div class="step-desc" v-if="step.desc">{{ step.desc }}</div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { computed, defineProps } from 'vue'

const props = defineProps({
  steps: {
    type: Array,
    required: true,
  },
  current: {
    type: Number,
    default: 1,
  },
  numberOnly: {
    type: Boolean,
    default: false,
  },
})

const normalizedSteps = computed(() =>
  props.steps.map(step =>
    typeof step === 'string' ? { label: step, desc: null, icon: null } : step
  )
)
</script>
