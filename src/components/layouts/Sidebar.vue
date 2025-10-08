<template>
  <aside :class="['sidebar', { open: isOpen }]">
    <button class="sidebar-toggle" @click="toggleSidebar">☰</button>
    <nav>
      <RouterLink to="/" :class="{ active: isActive('/') }">Home</RouterLink>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const isOpen = ref(false)
const route = useRoute()

const toggleSidebar = () => {
  isOpen.value = !isOpen.value
}

const isActive = (path: string) => {
  return route.path === path
}
</script>

<style scoped>
.sidebar {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 240px;
  height: 100%;
  background: #2c3e50;
  color: white;
  flex-direction: column;
  transition: transform 0.3s ease;
  z-index: 1000;
  padding-top: 60px;
}

.sidebar nav {
  display: flex;
  flex-direction: column;
}

.sidebar nav a {
  color: white;
  text-decoration: none;
  padding: 10px;
}

.sidebar nav a.active {
  background: #1abc9c;
}

.sidebar-toggle {
  position: fixed;
  top: 10px;
  left: 10px;
  background: none;
  border: none;
  color: white;
  font-size: 2rem;
  z-index: 1100;
}

@media (max-width: 992px) {
  .sidebar {
    display: flex;
    transform: translateX(-100%);
  }
  .sidebar.open {
    transform: translateX(0);
  }
}
</style>
