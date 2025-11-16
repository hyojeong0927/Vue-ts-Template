<template>
  <section>
    <h3>라인형 탭</h3>
    <BaseTabs v-model="active1" :tabs="tabs" variant="line">
      <template #home>홈 콘텐츠</template>
      <template #profile>프로필 콘텐츠</template>
      <template #settings>설정 콘텐츠</template>
    </BaseTabs>

    <h3>박스형 탭</h3>
    <BaseTabs v-model="active2" :tabs="tabs" variant="box">
      <template #home>홈 콘텐츠</template>
      <template #profile>프로필 콘텐츠</template>
      <template #settings>설정 콘텐츠</template>
    </BaseTabs>

    <h3>필형 탭</h3>
    <BaseTabs v-model="active3" :tabs="tabs" variant="pill">
      <template #home>홈 콘텐츠</template>
      <template #profile>프로필 콘텐츠</template>
      <template #settings>설정 콘텐츠</template>
    </BaseTabs>

    <h3>닫기 버튼 있는 탭</h3>
    <BaseTabs v-model="active" :tabs="tabs" variant="box" closable @remove="onTabRemove">
      <template #home>홈 콘텐츠</template>
      <template #profile>프로필 콘텐츠</template>
      <template #settings>설정 콘텐츠</template>
    </BaseTabs>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import BaseTabs from '@/components/tabs/BaseTabs.vue'

// --- TypeScript 제거: TabItem 타입 제거
const tabs = [
  { label: '홈', value: 'home' },
  { label: '프로필', value: 'profile' },
  { label: '설정', value: 'settings' },
  { label: '추가', value: 'extra' },
]

const active = ref('home')
const active1 = ref('home')
const active2 = ref('home')
const active3 = ref('home')

function onTabRemove(tab) {
  console.log('탭 삭제됨:', tab)
}
</script>
