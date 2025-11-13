<!-- components/List.vue -->
<template>
  <ul :class="['list', `list--${variant}`]">
    <li v-for="(item, index) in items" :key="index">
      <slot name="item" :item="item">
        {{ item }}
      </slot>
    </li>
  </ul>
</template>

<script setup>
defineProps({
  items: Array,
  variant: {
    type: String,
    default: 'default', // 'default', 'bordered', 'striped' 등
  },
})
</script>
<!-- <List :items="['Apple', 'Banana', 'Cherry']" variant="striped" /> -->
<style scoped>
.list--bordered li {
  border: 1px solid #ccc;
  margin-bottom: 4px;
  border-radius: 4px;
}
.list--striped li:nth-child(odd) {
  background: #f9f9f9;
}
</style>
