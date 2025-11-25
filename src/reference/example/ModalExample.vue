<template>
  <div>
    <h3>Modal 예시</h3>
    <div class="button-group">
      <BaseButton variant="primary" @click="openModal = true">팝업 기본</BaseButton>
      <BaseButton variant="primary" @click="openModalLarge = true">팝업 large</BaseButton>
      <BaseButton variant="primary" @click="showAlert = true">Alert 팝업</BaseButton>
      <BaseButton variant="primary" @click="showConfirm = true">Confirm 팝업 small</BaseButton>
    </div>

    <!-- 기본 팝업 -->
    <BaseModal
      :visible="openModal"
      title="회원 정보 확인"
      @close="openModal = false"
      :closeOnOverlay="false"
    >
      <p>이 팝업은 재사용 가능한 컴포넌트입니다.</p>
      <template #footer>
        <button class="btn" @click="openModal = false">닫기</button>
        <button class="btn" style="background: #28a745">확인</button>
      </template>
    </BaseModal>

    <BaseModal
      :visible="openModalLarge"
      title="회원 정보 확인"
      size="large"
      @close="openModalLarge = false"
    >
      <p>이 팝업은 재사용 가능한 컴포넌트입니다.</p>
      <template #footer>
        <button class="btn" @click="openModalLarge = false">닫기</button>
        <button class="btn" style="background: #28a745">확인</button>
      </template>
    </BaseModal>

    <!-- Alert -->
    <BaseModal
      :visible="showAlert"
      type="alert"
      title="알림"
      message="작업이 완료되었습니다."
      @close="showAlert = false"
    />

    <!-- Confirm -->
    <BaseModal
      :visible="showConfirm"
      type="confirm"
      title="확인"
      message="정말 삭제하시겠습니까?"
      size="small"
      @close="showConfirm = false"
      @confirm="onConfirm"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import BaseModal from '@/components/modal/BaseModal.vue'
import BaseButton from '@/components/Button.vue'

const openModal = ref(false)
const openModalLarge = ref(false)
const showAlert = ref(false)
const showConfirm = ref(false)

function onConfirm() {
  alert('삭제 완료!')
  showConfirm.value = false
}
</script>

<style scoped>
.button-group {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}
</style>
