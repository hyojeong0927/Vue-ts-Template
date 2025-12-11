<template>
  <button @click="openPopup('userInfo')">사용자 정보</button>
  <button @click="openPopup('edit')">편집 팝업</button>
  <button @click="openPopup('deleteConfirm')">삭제 확인</button>

  <!-- Popup Wrapper -->
  <PopupWrapper :visible="popupVisible" @close="closePopup">
    <!-- 동적 컴포넌트로 외부 팝업 불러오기 -->
    <component :is="currentPopup" @close="closePopup" />
  </PopupWrapper>
</template>

<script setup>
import { ref, computed } from 'vue'
import PopupWrapper from '../../components/modal/Popup.vue'

/* 외부 팝업 불러오기 */
import UserInfoPopup from './UserInfoPopup.vue'
// import EditPopup from './EditPopup.vue'
// import DeleteConfirmPopup from './DeleteConfirmPopup.vue'

const popupVisible = ref(false)
const popupType = ref('')

const popupMap = {
  userInfo: UserInfoPopup,
  //   edit: EditPopup,
  //   deleteConfirm: DeleteConfirmPopup,
}

const currentPopup = computed(() => popupMap[popupType.value] || null)

const openPopup = type => {
  popupType.value = type
  popupVisible.value = true
}

const closePopup = () => {
  popupVisible.value = false
}
</script>
