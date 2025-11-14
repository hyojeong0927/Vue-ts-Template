<template>
  <header class="header">
    <div class="logo">My Vue App</div>

    <button class="menu-toggle" @click="toggleMenu">☰</button>

    <nav :class="{ open: menuOpen }">
      <!-- Home -->
      <RouterLink to="/" :class="{ active: isActive('/') }">Publish Status</RouterLink>
      <!-- Components -->
      <div class="menu-item" @mouseover="handleMouseOver('components')" @mouseout="handleMouseOut">
        <RouterLink
          to="/example/agree"
          @click.prevent="toggleSubmenu('components')"
          :class="{ active: isActive('/example') }"
        >
          Components ▾
        </RouterLink>

        <div class="submenu" :class="{ open: openMenu === 'components' }">
          <RouterLink to="/example/agree" :class="{ active: isActive('/example/agree') }"
            >Agree Form</RouterLink
          >
          <RouterLink to="/example/button" :class="{ active: isActive('/example/button') }"
            >Button</RouterLink
          >
          <RouterLink to="/example/checkbox" :class="{ active: isActive('/example/checkbox') }"
            >Checkbox&Radio</RouterLink
          >
          <RouterLink to="/example/datepicker" :class="{ active: isActive('/example/datepicker') }"
            >DatePicker</RouterLink
          >
          <RouterLink
            to="/example/floatingbar"
            :class="{ active: isActive('/example/floatingbar') }"
            >FloatingBar</RouterLink
          >
          <RouterLink to="/example/form" :class="{ active: isActive('/example/form') }"
            >Form</RouterLink
          >
          <RouterLink to="/example/modal" :class="{ active: isActive('/example/modal') }"
            >Modal</RouterLink
          >
          <RouterLink to="/example/selectbox" :class="{ active: isActive('/example/selectbox') }"
            >Selectbox</RouterLink
          >
          <RouterLink to="/example/step" :class="{ active: isActive('/example/step') }"
            >Step</RouterLink
          >
          <RouterLink to="/example/tab" :class="{ active: isActive('/example/tab') }"
            >Tab</RouterLink
          >
        </div>
      </div>

      <!-- Guide -->
      <div class="menu-item" @mouseover="handleMouseOver('guide')" @mouseout="handleMouseOut">
        <RouterLink
          to="/guide/rule"
          @click.prevent="toggleSubmenu('guide')"
          :class="{ active: isActive(['/guide']) }"
        >
          Guide ▾
        </RouterLink>

        <div class="submenu" :class="{ open: openMenu === 'guide' }">
          <RouterLink to="/guide/rule" :class="{ active: isActive('/guide/rule') }"
            >Rule</RouterLink
          >
          <RouterLink to="/guide/term" :class="{ active: isActive('/guide/term') }"
            >Term</RouterLink
          >
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const menuOpen = ref(false)
const openMenu = ref<string | null>(null)
const route = useRoute()

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value
}

const isActive = (path: string | string[]) => {
  if (Array.isArray(path)) {
    return path.some(p => route.path === p || route.path.startsWith(p + '/'))
  }
  return route.path === path || route.path.startsWith(path + '/')
}

const toggleSubmenu = (menuName: string) => {
  if (isMobile()) {
    openMenu.value = openMenu.value === menuName ? null : menuName
  }
}

const handleMouseOver = (menuName: string) => {
  if (!isMobile()) {
    openMenu.value = menuName
  }
}

const handleMouseOut = (e: MouseEvent) => {
  const target = e.currentTarget as HTMLElement
  const related = e.relatedTarget as HTMLElement | null

  if (related && target.contains(related)) return
  if (!isMobile()) openMenu.value = null
}

const isMobile = () => window.innerWidth <= 768
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #2c3e50;
  color: white;
  padding: 10px 20px;
}

.logo {
  font-weight: bold;
  font-size: 1.2rem;
}

nav {
  display: flex;
  gap: 15px;
}

nav a {
  color: white;
  text-decoration: none;
}

nav a.active {
  font-weight: bold;
  text-decoration: underline;
}

.menu-item {
  position: relative;
}

/* 드롭다운 메뉴 */
.submenu {
  display: none;
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: #34495e;
  flex-direction: column;
  min-width: 150px;
  z-index: 10;
}

.submenu.open {
  display: flex;
}

.submenu a {
  padding: 10px;
  color: white;
}

.submenu a:hover {
  background: rgba(255, 255, 255, 0.1);
}

.menu-toggle {
  display: none;
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
}

@media (max-width: 768px) {
  .menu-toggle {
    display: block;
  }

  nav {
    display: none;
    flex-direction: column;
    position: absolute;
    top: 60px;
    left: 0;
    right: 0;
    background: #2c3e50;
  }

  nav.open {
    display: flex;
  }

  .menu-item {
    flex-direction: column;
    width: 100%;
  }

  .menu-item > a {
    padding: 10px;
    border-top: 1px solid rgba(255, 255, 255, 0.2);
  }

  .submenu {
    position: static;
    left: 0;
    transform: none;
    background: #3b4c5a;
    display: none;
  }

  .submenu.open {
    display: flex;
  }

  .submenu a {
    padding-left: 30px;
  }
}
</style>
