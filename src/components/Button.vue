<template>
  <component
    :is="componentTag"
    :to="isRouterLink ? to : null"
    :href="isExternalLink ? resolvedHref : null"
    :target="isExternalLink ? '_blank' : null"
    :rel="isExternalLink ? 'noopener noreferrer' : null"
    :class="buttonClasses"
    :disabled="isButton && disabled"
    @click="handleClick"
  >
    <span v-if="leftIcon" class="btn-icon btn-icon--left">
      <i :class="leftIcon"></i>
    </span>

    <span class="btn-label">
      <slot />
    </span>

    <span v-if="rightIcon" class="btn-icon btn-icon--right">
      <i :class="rightIcon"></i>
    </span>
  </component>
</template>

<script setup>
import { computed, defineProps, defineEmits } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const props = defineProps({
  variant: { type: String, default: 'primary' },
  size: { type: String, default: 'medium' },
  disabled: { type: Boolean, default: false },
  to: { type: [String, Object], default: null },
  newTab: { type: Boolean, default: false },
  leftIcon: { type: String, default: '' },
  rightIcon: { type: String, default: '' },
})
const emit = defineEmits(['click'])

/* 렌더링 타입 결정 */
const isExternalLink = computed(() => props.to && props.newTab)
const isRouterLink = computed(() => props.to && !props.newTab)
const isButton = computed(() => !props.to)
const componentTag = computed(() => {
  if (isExternalLink.value) return 'a'
  if (isRouterLink.value) return 'router-link'
  return 'button'
})

/* new-tab href 계산 */
const resolvedHref = computed(() => {
  if (!props.to) return null
  try {
    return router.resolve(props.to).href
  } catch (err) {
    console.warn('[BaseButton] Invalid route:', props.to)
    return null
  }
})

/* 클릭 핸들러 */
const handleClick = event => {
  if (props.disabled) {
    event.preventDefault()
    return
  }

  if (props.newTab && props.to) {
    const url = typeof props.to === 'string' ? props.to : resolvedHref.value
    if (url) window.open(url, '_blank')
    return
  }

  if (isButton.value) {
    emit('click', event)
  }
}

/* 클래스 */
const buttonClasses = computed(() =>
  [
    'base-button',
    `btn-${props.variant}`,
    `btn-${props.size}`,
    props.disabled ? 'btn-disabled' : '',
    props.leftIcon ? 'btn--with-left-icon' : '',
    props.rightIcon ? 'btn--with-right-icon' : '',
  ].join(' ')
)
</script>
