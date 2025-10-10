<template>
  <div class="input-demo">
    <h3>입력폼 예시</h3>
    <form>
      <div class="form-row">
        <BaseInput
          v-model="name"
          label="이름"
          placeholder="이름을 입력하세요"
          :validateFn="validateName"
        />
      </div>
      <div class="form-row">
        <BaseInput
          v-model="email"
          label="이메일"
          placeholder="이메일을 입력하세요"
          type="email"
          :validateFn="validateEmail"
          buttonLabel="검증"
          @button-click="onEmailCheck"
        />
      </div>
      <div class="form-row">
        <BaseInput
          v-model="password"
          label="비밀번호"
          placeholder="비밀번호를 입력하세요"
          type="password"
          :validateFn="validatePassword"
          :disabled="false"
        />
      </div>
      <div class="form-row flex">
        <BaseSelect
          v-model="selectedOption"
          label="국가 선택"
          :options="countryOptions"
          placeholder="국가를 선택하세요"
        />
      </div>
      <div class="form-row">
        <PhoneInput v-model="phone" label="연락처" />
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BaseInput from '@/components/input/InputGroup.vue'
import PhoneInput from '@/components/input/PhoneInput.vue'
import BaseSelect from '@/components/selectbox/Selectbox.vue'

const name = ref('')
const email = ref('')
const password = ref('')
const selectedOption = ref('')
const phone = ref('')

function validateName(value: string) {
  return value.length < 2 ? '이름은 최소 2자 이상이어야 합니다.' : null
}

function validateEmail(value: string) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return !regex.test(value) ? '유효한 이메일 주소를 입력하세요.' : null
}

function validatePassword(value: string) {
  return value.length < 6 ? '비밀번호는 최소 6자 이상이어야 합니다.' : null
}

function onEmailCheck(value: string) {
  alert(`이메일 검증 요청: ${value}`)
}
const countryOptions = [
  { value: 'kr', label: '대한민국' },
  { value: 'us', label: '미국' },
  { value: 'jp', label: '일본' },
  { value: 'cn', label: '중국' },
  { value: 'fr', label: '프랑스' },
  { value: 'de', label: '독일' },
  { value: 'it', label: '이탈리아' },
]
</script>
<style scoped>
.form-row.flex {
  display: flex;
  gap: 8px;
  align-items: flex-start;
}

.form-row > * {
  flex: 1;
}
</style>
