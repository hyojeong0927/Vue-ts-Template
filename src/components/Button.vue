<template>
  <button :class="buttonClasses" :disabled="disabled" @click="handleClick">
    <!-- 왼쪽 아이콘 -->
    <span v-if="leftIcon" class="btn-icon btn-icon--left">
      <i :class="leftIcon"></i>
    </span>

    <!-- 기본 슬롯 (텍스트) -->
    <span class="btn-label">
      <slot />
    </span>

    <!-- 오른쪽 아이콘 -->
    <span v-if="rightIcon" class="btn-icon btn-icon--right">
      <i :class="rightIcon"></i>
    </span>
  </button>
</template>

<script setup>
import { computed, defineProps, defineEmits } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary', // primary | secondary | danger
  },
  size: {
    type: String,
    default: 'medium', // small | medium | large
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  leftIcon: {
    type: String,
    default: '',
  },
  rightIcon: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['click'])

const handleClick = event => {
  if (!props.disabled) {
    emit('click', event)
  }
}

const buttonClasses = computed(() => {
  return [
    'base-button',
    `btn-${props.variant}`,
    `btn-${props.size}`,
    props.disabled ? 'btn-disabled' : '',
    props.leftIcon ? 'btn--with-left-icon' : '',
    props.rightIcon ? 'btn--with-right-icon' : '',
  ].join(' ')
})
</script>
