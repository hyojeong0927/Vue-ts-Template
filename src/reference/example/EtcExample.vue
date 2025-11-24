<template>
  <h3>title</h3>
  <Title title="페이지 제목" subtitle="서브타이틀" tag="h1">
    <template #titleBtn>
      <button>추가</button>
    </template>
  </Title>
  <Title title="게시판" tag="h3" align="center" />

  <h3>Badge</h3>
  <Badge>텍스트</Badge>
  <Badge outline>텍스트</Badge>
  <h3>Button Area</h3>
  <BtnArea align="left">
    <button class="primary" @click="onSave">저장</button>
    <button @click="onCancel">취소</button>
  </BtnArea>
  <BtnArea align="right">
    <button class="primary" @click="onSave">저장</button>
    <button @click="onCancel">취소</button>
  </BtnArea>
  <BtnArea align="center">
    <button class="primary" @click="onSave">저장</button>
    <button @click="onCancel">취소</button>
  </BtnArea>
  <BtnArea align="between">
    <button class="primary" @click="onSave">저장</button>
    <button @click="onCancel">취소</button>
  </BtnArea>
  <h3>List ul</h3>
  <List
    :items="['Apple', 'Banana', 'Cherry']"
    variant="striped"
    selectable
    @select="i => console.log(i)"
  />
  <h3>List ol</h3>
  <List tag="ol" :items="['Step1', 'Step2', 'Step3']" variant="bordered" selectable />
  <h3>List dl</h3>
  <List
    tag="dl"
    :items="[
      { term: 'HTML', desc: 'Markup language' },
      { term: 'CSS', desc: 'Style language' },
    ]"
  />
  <BoxList
    :boxes="[
      {
        title: 'Basic',
        price: '10,000원',
        variable: 'primary',
        badges: [
          { variable: 'outline', label: '기본' },
          { variable: 'solid', label: '할인' },
        ],
      },
      {
        title: 'Premium',
        price: '20,000원',
        variable: 'danger',
        badges: [
          { variable: 'outline', label: '추천' },
          { variable: 'solid', label: '인기' },
          { variable: 'outline', label: '혜택' },
        ],
      },
    ]"
  />
  <ProgressBar :percent="50" />
</template>

<script setup>
import Badge from '@/components/etc/Badge.vue'
import BtnArea from '@/components/etc/BtnArea.vue'
import List from '@/components/etc/List.vue'
import Title from '@/components/etc/Title.vue'
import BoxList from '@/components/etc/Box.vue'
import ProgressBar from '@/components/etc/ProgressBar.vue'
</script>

<style lang="scss" scoped></style>
