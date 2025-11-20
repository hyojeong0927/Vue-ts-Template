<template>
  <section>
    <h3>라인형 탭</h3>
    <div class="content-box" style="min-height: 100px">유동적 사이즈의 이미지가 들어 감</div>
    <BaseTabs v-model="active1" :tabs="tabs" variant="line" :bottomFixedHeight="50">
      <template #home>
        <div style="height: 700px">홈</div>
      </template>
      <template #profile>프로필 콘텐츠</template>
      <template #settings>설정 콘텐츠</template>
    </BaseTabs>
    <div
      style="position: fixed; bottom: 0; width: 100%; background-color: #000; height: 50px"
    ></div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import BaseTabs from '@/components/tabs/BaseTabs.vue'

const tabs = [
  { label: '홈', value: 'home' },
  { label: '프로필', value: 'profile' },
  { label: '설정', value: 'settings' },
  { label: '추가', value: 'extra' },
]

const active1 = ref('home')
</script>
