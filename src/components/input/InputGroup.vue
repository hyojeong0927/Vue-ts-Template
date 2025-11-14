<template>
  <div class="base-input-wrapper">
    <label v-if="label" class="input-label">{{ label }}</label>
    <div class="input-inner">
      <input
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        @blur="validate"
      />
      <button v-if="buttonLabel" type="button" @click="$emit('button-click', modelValue)">
        {{ buttonLabel }}
      </button>
    </div>
    <p v-if="error" class="error-msg">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: String,
  label: String,
  placeholder: String,
  type: {
    type: String,
    default: 'text',
  },
  disabled: Boolean,
  error: String,
  validateFn: Function,
  buttonLabel: String,
})

const emit = defineEmits(['update:modelValue', 'button-click'])

const error = ref(null)

watch(
  () => props.modelValue,
  () => {
    validate()
  }
)

function validate() {
  if (props.validateFn) {
    error.value = props.validateFn(props.modelValue)
  }
}
</script>

<style scoped>
.base-input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
}

.input-label {
  font-size: 14px;
  font-weight: 500;
}

.input-inner {
  display: flex;
  align-items: center;
  gap: 4px;
}

input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 6px;
}

button {
  padding: 6px 12px;
  border: none;
  background: #1976d2;
  color: white;
  border-radius: 6px;
  cursor: pointer;
}

button:hover {
  background: #1565c0;
}

.error-msg {
  font-size: 12px;
  color: #e53935;
}
</style>
