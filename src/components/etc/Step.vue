<script setup>
import { computed } from 'vue'

const props = defineProps({
  steps: {
    type: Array,
    required: true, // 예: ['정보 입력', '확인', '완료']
  },
  current: {
    type: Number,
    default: 1, // 현재 단계 (1부터 시작)
  },
  align: {
    type: String,
    default: 'center', // left | center | right
  },
})

// 상태 계산
const getStepStatus = index => {
  if (index + 1 < props.current) return 'done'
  if (index + 1 === props.current) return 'active'
  return 'pending'
}

const alignClass = computed(() => `step--${props.align}`)
</script>

<template>
  <div class="step" :class="alignClass">
    <ul class="step__list">
      <li
        v-for="(step, index) in steps"
        :key="index"
        class="step__item"
        :class="getStepStatus(index)"
      >
        <span class="step__num">{{ index + 1 }}</span>
        <span class="step__label">{{ step }}</span>
      </li>
    </ul>
  </div>
</template>
<!-- <Step :steps="['정보 입력', '확인', '완료']" :current="2" /> -->
<!-- <Step :steps="['Step1', 'Step2', 'Step3', 'Step4']" :current="1" align="left" /> -->
<style scoped lang="scss">
.step {
  width: 100%;
  &--left {
    justify-content: flex-start;
  }
  &--center {
    justify-content: center;
  }
  &--right {
    justify-content: flex-end;
  }

  .step__list {
    display: flex;
    justify-content: center;
    align-items: center;
    list-style: none;
    padding: 0;
    margin: 0;
    gap: 2rem;

    .step__item {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      color: #aaa;

      &::after {
        content: '';
        position: absolute;
        top: 12px;
        right: -2rem;
        width: 2rem;
        height: 2px;
        background-color: #ddd;
      }

      &:last-child::after {
        display: none;
      }

      .step__num {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 28px;
        height: 28px;
        border-radius: 50%;
        background: #ddd;
        color: #fff;
        font-weight: 600;
        margin-bottom: 0.25rem;
        font-size: 0.875rem;
      }

      .step__label {
        font-size: 0.875rem;
      }

      &.done {
        color: #007bff;

        .step__num {
          background: #007bff;
        }

        &::after {
          background: #007bff;
        }
      }

      &.active {
        color: #000;

        .step__num {
          background: #007bff;
          box-shadow: 0 0 0 4px rgba(0, 123, 255, 0.2);
        }
      }

      &.pending {
        color: #ccc;
      }
    }
  }
}
</style>
