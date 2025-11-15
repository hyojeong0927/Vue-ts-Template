<template>
  <component :is="tag" :class="['list', `list--${variant}`, { 'list--selectable': selectable }]">
    <template v-if="tag === 'dl'">
      <template v-for="(item, index) in items" :key="index">
        <dt>{{ item.term }}</dt>
        <dd>{{ item.desc }}</dd>
      </template>
    </template>

    <template v-else>
      <li
        v-for="(item, index) in items"
        :key="index"
        :class="{ active: selectedIndex === index }"
        @click="select(index)"
      >
        <slot name="item" :item="item">
          {{ item }}
        </slot>
      </li>
    </template>
  </component>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
  tag: {
    type: String,
    default: 'ul', // ul | ol | dl
  },
  variant: {
    type: String,
    default: 'default', // default | bordered | striped
  },
  selectable: {
    type: Boolean,
    default: false,
  },
})

const emits = defineEmits(['update:selected', 'select'])

const selectedIndex = ref(-1)

const select = index => {
  if (!props.selectable) return
  selectedIndex.value = index
  emits('update:selected', index)
  emits('select', props.items[index])
}
</script>

<style scoped>
.list {
  padding: 0;
  margin: 0;
  list-style: none;

  li {
    padding: 0.5rem;
    cursor: pointer;
    transition: background 0.2s;
  }

  /* selectable 상태 */
  &.list--selectable li.active {
    background-color: #007bff;
    color: #fff;
    border-radius: 4px;
  }

  /* bordered variant */
  &.list--bordered li {
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-bottom: 4px;
  }

  /* striped variant */
  &.list--striped li:nth-child(odd) {
    background: #f9f9f9;
  }

  li:hover {
    background: #e9ecef;
  }

  /* dl 스타일 */
  dt {
    font-weight: bold;
  }
  dd {
    margin-left: 1rem;
    margin-bottom: 0.5rem;
  }
}
</style>
