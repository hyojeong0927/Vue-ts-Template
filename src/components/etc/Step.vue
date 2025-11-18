<template>
  <div :class="['step-wrapper', `step--${direction}`]">
    <div
      v-for="(step, index) in normalizedSteps"
      :key="index"
      :class="['step-item', { active: index === current - 1, done: index < current - 1 }]"
    >
      <!-- numberOnly -->
      <template v-if="numberOnly">
        <div class="step-number">{{ index + 1 }}</div>
      </template>

      <!-- iconOnly -->
      <template v-else-if="iconOnly">
        <div class="step-icon">
          <i v-if="step.icon" :class="`icon-${step.icon}`"></i>
          <span v-else>{{ index + 1 }}</span>
        </div>
      </template>

      <!-- 기본 구성 -->
      <template v-else>
        <div class="step-number" v-if="showNumber">
          {{ index + 1 }}
        </div>
        <div class="step-icon" v-if="step.icon">
          <i :class="`icon-${step.icon}`"></i>
        </div>
        <div class="step-label">{{ step.label }}</div>
        <div class="step-desc" v-if="step.desc">{{ step.desc }}</div>
      </template>

      <!-- 연결선 -->
      <div v-if="index < normalizedSteps.length - 1" class="step-line"></div>
    </div>
  </div>
</template>

<script setup>
import { computed, defineProps } from 'vue'

const props = defineProps({
  showNumber: {
    type: Boolean,
    default: false,
  },
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
  iconOnly: {
    type: Boolean,
    default: false,
  },
  direction: {
    type: String,
    default: 'row', // row | column
  },
})

const normalizedSteps = computed(() =>
  props.steps.map(step =>
    typeof step === 'string'
      ? { label: step, desc: '', icon: '' }
      : { label: step.label || '', desc: step.desc || '', icon: step.icon || '' }
  )
)
</script>

<style scoped lang="scss">
.step-wrapper {
  display: flex;
  align-items: flex-start;

  &.step--row {
    flex-direction: row;
  }
  &.step--column {
    flex-direction: column;
  }
}

.step-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  text-align: center;
  flex: 1;

  &.active .step-icon,
  &.active .step-number {
    background-color: #007bff;
    color: #fff;
  }

  &.done .step-icon,
  &.done .step-number {
    background-color: #28a745;
    color: #fff;
  }

  .step-number,
  .step-icon {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: #eee;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 4px;
    font-weight: bold;
  }

  .step-label {
    font-size: 0.875rem;
  }

  .step-desc {
    font-size: 0.75rem;
    color: #888;
  }

  /* 연결선 */
  .step-line {
    position: absolute;
    top: 16px;
    left: 50%;
    width: 100%;
    height: 2px;
    background-color: #ccc;
    z-index: -1;

    /* column 방향일 때 */
    .step--column & {
      top: 50%;
      left: 16px;
      width: 2px;
      height: 100%;
    }
  }
}

/* 반응형 예시 */
@media (max-width: 600px) {
  .step-wrapper.step--row {
    flex-direction: column;
  }
}
</style>
