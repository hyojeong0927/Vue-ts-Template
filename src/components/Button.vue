<template>
  <button :class="buttonClasses" :disabled="disabled" @click="handleClick">
    <slot />
  </button>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps({
  to: { type: [String, Object], default: null },
  newPage: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
})

const emit = defineEmits(['click'])

const resolvedHref = computed(() => {
  if (!props.to) return null
  if (typeof props.to === 'string' && props.to.startsWith('http')) {
    return props.to
  }
  return router.resolve(props.to).href
})

const handleClick = e => {
  if (props.disabled) {
    e.preventDefault()
    return
  }

  if (props.newPage && props.to) {
    window.open(resolvedHref.value, '_blank')
    return
  }

  if (props.to) {
    router.push(props.to)
    return
  }

  emit('click', e)
}

const buttonClasses = computed(() => 'base-button')
</script>
