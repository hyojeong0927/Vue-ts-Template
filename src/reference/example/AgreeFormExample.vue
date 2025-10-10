<template>
  <form class="terms-form" @submit.prevent="handleSubmit">
    <h3>약관 동의</h3>

    <div class="checkbox-group">
      <!-- 전체 선택 -->
      <CheckboxItem
        v-if="hasAllOption"
        label="전체 선택"
        :modelValue="terms.all.checked"
        @update:modelValue="toggleAll"
      />

      <hr v-if="hasAllOption" />

      <!-- 개별 약관 항목 -->
      <div v-for="(term, index) in termList" :key="term.label" class="term-item">
        <div class="term-header">
          <CheckboxItem
            :label="term.label"
            :modelValue="term.checked"
            :disabled="term.disabled"
            @update:modelValue="val => updateItem(index, val)"
          />

          <button
            v-if="term.content"
            type="button"
            class="toggle-btn"
            @click="toggleAccordion(index)"
          >
            {{ term.open ? '닫기' : '보기' }}
          </button>
        </div>

        <!-- 아코디언 내용 -->
        <transition name="accordion">
          <div v-if="term.open" class="term-content">
            <p>{{ term.content }}</p>
          </div>
        </transition>
      </div>
    </div>

    <!-- 제출 영역 -->
    <div class="submit-area">
      <button type="submit" :disabled="!isAllRequiredChecked" class="submit-btn">다음 단계</button>
      <p v-if="!isAllRequiredChecked" class="warning">* 필수 약관에 모두 동의해야 합니다.</p>
    </div>
  </form>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue'
import CheckboxItem from '../../components/checkbox/CheckboxItem.vue'

interface Term {
  label: string
  content?: string
  required?: boolean
  disabled?: boolean
  checked: boolean
  open: boolean
}

const terms = reactive({
  all: { label: '전체 선택', checked: false, open: false },
  items: [
    {
      label: '이용약관 동의 (필수)',
      required: true,
      checked: false,
      open: false,
      content: '이용약관의 주요 내용은 서비스 이용조건, 금지행위, 면책사항 등을 포함합니다.',
    },
    {
      label: '개인정보 수집 및 이용 동의 (필수)',
      required: true,
      checked: false,
      open: false,
      content: '개인정보는 서비스 제공을 위해 수집되며, 법적 보관기간 이후 즉시 파기됩니다.',
    },
    {
      label: '마케팅 정보 수신 동의 (선택)',
      required: false,
      checked: false,
      open: false,
      content: '신규 서비스, 이벤트 안내 등의 정보를 이메일 또는 문자로 받을 수 있습니다.',
    },
    {
      label: '제3자 정보 제공 동의 (선택)',
      required: false,
      checked: false,
      open: false,
      disabled: true,
      content: '현재 이 항목은 비활성화되어 있으며, 추후 정책 변경 시 안내될 예정입니다.',
    },
  ],
})

// 전체 선택 여부
const hasAllOption = computed(() => true)

const termList = computed(() => terms.items)

const isAllChecked = computed(() => terms.items.filter(t => !t.disabled).every(t => t.checked))

const requiredTerms = computed(() => terms.items.filter(t => t.required && !t.disabled))

const isAllRequiredChecked = computed(() => requiredTerms.value.every(t => t.checked))

// 전체 선택 토글
function toggleAll(val: boolean) {
  terms.all.checked = val
  terms.items.forEach(t => {
    if (!t.disabled) t.checked = val
  })
}

// 개별 체크 토글
function updateItem(index: number, val: boolean) {
  const term = terms.items[index]
  if (term.disabled) return
  term.checked = val

  if (hasAllOption.value) {
    terms.all.checked = isAllChecked.value
  }
}

// 아코디언 토글
function toggleAccordion(index: number) {
  terms.items[index].open = !terms.items[index].open
}

// 제출
function handleSubmit() {
  const agreed = terms.items.filter(t => t.checked && t.label !== '전체 선택').map(t => t.label)

  alert(`동의한 항목:\n${agreed.join('\n')}`)
}
</script>

<style scoped>
.terms-form {
  width: 360px;
  padding: 16px;
  margin: 0 auto;
  border: 1px solid #ddd;
  border-radius: 12px;
  background: #fff;
}

h2 {
  margin-bottom: 12px;
  font-size: 18px;
  font-weight: 600;
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.term-item {
  border: 1px solid #eee;
  border-radius: 8px;
  background: #fafafa;
  padding: 8px;
}

.term-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.toggle-btn {
  border: none;
  background: none;
  color: #1976d2;
  font-size: 13px;
  cursor: pointer;
}

.toggle-btn:hover {
  text-decoration: underline;
}

.term-content {
  margin-top: 6px;
  padding: 8px;
  font-size: 13px;
  color: #444;
  background: #fff;
  border-radius: 6px;
  line-height: 1.4;
}

.accordion-enter-active,
.accordion-leave-active {
  transition: all 0.2s ease;
}
.accordion-enter-from,
.accordion-leave-to {
  max-height: 0;
  opacity: 0;
}
.accordion-enter-to,
.accordion-leave-from {
  max-height: 150px;
  opacity: 1;
}

.submit-area {
  margin-top: 16px;
  text-align: center;
}

.submit-btn {
  padding: 8px 16px;
  font-size: 14px;
  border: none;
  border-radius: 6px;
  background-color: #1976d2;
  color: white;
  cursor: pointer;
  transition: 0.2s;
}

.submit-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.warning {
  margin-top: 6px;
  font-size: 12px;
  color: #e53935;
}
</style>
