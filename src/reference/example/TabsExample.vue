<template>
  <section style="height: 1000px">
    <h3>라인형 탭</h3>

    <BaseTabs
      v-model="active1"
      :tabs="tabs1"
      variant="line"
      :bottomFixedRef="bottomArea"
      :scrollBody="true"
    >
      <!-- 상단 영역 -->
      <template #top>
        <div class="content-box" style="min-height: 100px">유동적 사이즈의 이미지가 들어 감</div>
      </template>

      <!-- 탭 콘텐츠 -->
      <template #home>
        <BaseTabs v-model="active2" :tabs="tabs2" variant="box">
          <template #tabmenu1></template>
          <template #tabmenu2>
            <div style="height: 700px">스크롤 없음</div>
          </template>
        </BaseTabs>
      </template>
      <template #profile>
        <div style="height: 700px">profile</div>
      </template>
      <template #settings>설정 콘텐츠</template>
      <template #extra>추가 콘텐츠</template>
    </BaseTabs>

    <!-- 하단 고정 영역 (반드시 ref 필요) -->
    <div
      ref="bottomArea"
      style="position: fixed; bottom: 0; width: 100%; background-color: #000; height: 50px"
    ></div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import BaseTabs from '@/components/tabs/BaseTabs.vue'

const tabs1 = [
  { label: '홈', value: 'home' },
  { label: '프로필', value: 'profile' },
  { label: '설정', value: 'settings' },
  { label: '추가', value: 'extra' },
]
const tabs2 = [
  { label: 'menu1', value: 'menu1' },
  { label: 'menu2', value: 'menu2' },
]

const active1 = ref('home')
const active2 = ref('tabmenu1')

// ★ 여기가 핵심!
const bottomArea = ref(null)
</script>
