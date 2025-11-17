<template>
  <div class="box-list">
    <article v-for="(box, index) in boxes" :key="index" :class="['box', `box-${box.variable}`]">
      <div class="title">{{ box.title }}</div>
      <div class="price" v-if="box.price">{{ box.price }}</div>

      <!-- 여러 개 뱃지 -->
      <div class="badge-wrap">
        <Badge
          v-for="(badge, i) in box.badges"
          :key="i"
          :variable="badge.variable"
          :label="badge.label"
        />
      </div>
    </article>
  </div>
</template>

<script setup>
import Badge from './Badge.vue'

const props = defineProps({
  boxes: {
    type: Array,
    default: () => [],
  },
})
</script>

<style scoped lang="scss">
.box-list {
  display: grid;
  gap: 16px;
}

.box {
  padding: 16px;
  border: 1px solid #ddd;
  border-radius: 12px;
  background: #fff;

  &-primary {
    border-color: #4a80f0;
  }

  &-danger {
    border-color: #f04a4a;
  }
}

.title {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 6px;
}

.price {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 12px;
}

.badge-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;
}
</style>
