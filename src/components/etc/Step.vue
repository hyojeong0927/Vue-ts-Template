<template>
  <div :class="['step-wrapper', `step--${direction}`]">
    <div v-for="(step, index) in normalizedSteps" :key="index">
      <!-- step-item 전체를 링크 컴포넌트로 감싸기 -->
      <component
        :is="getLinkComponent(step, index)"
        :to="useRouterLink(step, index) ? step.to : null"
        :href="getHref(step, index)"
        class="step-item"
        :target="shouldOpenNewTab(step, index) ? '_blank' : null"
        :rel="shouldOpenNewTab(step, index) ? 'noopener noreferrer' : null"
        @click="handleClick(step, index)"
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

        <!-- 기본 -->
        <template v-else>
          <div class="step-number" v-if="showNumber">{{ index + 1 }}</div>
          <div class="step-icon" v-if="step.icon">
            <i :class="`icon-${step.icon}`"></i>
          </div>
          <div class="step-label">{{ step.label }}</div>
          <div class="step-desc" v-if="step.desc">{{ step.desc }}</div>
        </template>

        <!-- 연결선 -->
        <div v-if="index < normalizedSteps.length - 1" class="step-line"></div>
      </component>
    </div>
  </div>
</template>

<script setup>
import { computed, defineProps, defineEmits } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const emit = defineEmits(['step-click'])

const props = defineProps({
  showNumber: Boolean,
  steps: Array,
  current: { type: Number, default: 1 },
  numberOnly: Boolean,
  iconOnly: Boolean,
  direction: { type: String, default: 'row' },
  autoNavigate: { type: Boolean, default: false },
  linkOnActive: { type: Boolean, default: false },
  openInNewTab: { type: Boolean, default: false },
})

const isActive = index => index === props.current - 1

const normalizedSteps = computed(() =>
  props.steps.map(step =>
    typeof step === 'string'
      ? { label: step, desc: '', icon: '', href: '', to: '' }
      : {
          label: step.label || '',
          desc: step.desc || '',
          icon: step.icon || '',
          href: step.href || '',
          to: step.to || '',
        }
  )
)

/* -------------------------------------------------
 * 공통 규칙: step.to 또는 step.href 가 있어야 링크 처리됨
 * linkOnActive = true → 현재 active 단계만 링크 허용
 -------------------------------------------------- */
const isLinkEnabled = (step, index) => {
  if (!(step.to || step.href)) return false
  if (props.linkOnActive && !isActive(index)) return false
  return true
}

/* 새 창 정책 */
const shouldOpenNewTab = (step, index) => {
  if (!props.openInNewTab) return false
  return isLinkEnabled(step, index)
}

/* href 계산: 필요한 경우에만 router.resolve */
const getHref = (step, index) => {
  if (!isLinkEnabled(step, index)) return null
  if (step.to) return router.resolve(step.to).href
  return step.href || null
}

/* router-link 사용 여부 */
const useRouterLink = (step, index) => {
  if (!isLinkEnabled(step, index)) return false
  if (props.openInNewTab) return false // 새창이면 router-link 금지
  return !!step.to
}

/* 실제 렌더링 컴포넌트 결정 */
const getLinkComponent = (step, index) => {
  if (useRouterLink(step, index)) return 'router-link'
  if (isLinkEnabled(step, index)) return 'a'
  return 'span'
}

/* 클릭 이벤트 */
const handleClick = (step, index) => {
  emit('step-click', { step, index })
}
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

  .step-line {
    position: absolute;
    top: 16px;
    left: 50%;
    width: 100%;
    height: 2px;
    background-color: #ccc;
    z-index: -1;

    .step--column & {
      top: 50%;
      left: 16px;
      width: 2px;
      height: 100%;
    }
  }
}

@media (max-width: 600px) {
  .step-wrapper.step--row {
    flex-direction: column;
  }
}
</style>
