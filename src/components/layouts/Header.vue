<template>
  <header class="header global-header">
    <div class="logo">My Vue App</div>

    <!-- 모바일 메뉴 버튼 -->
    <button class="menu-toggle" @click="toggleMenu">☰</button>

    <nav :class="{ open: menuOpen }">
      <!-- 1차 메뉴 반복 -->
      <div
        v-for="(item, index) in menuData"
        :key="index"
        class="menu-item"
        @mouseover="onHover(item)"
        @mouseout="onLeave"
      >
        <!-- 1차 메뉴 -->
        <RouterLink
          :to="item.to"
          :class="{ active: isActive(item.to) }"
          @click.prevent="onClickMenu(item)"
        >
          {{ item.label }}
          <span v-if="item.children && item.children.length">▾</span>
        </RouterLink>

        <!-- 서브메뉴 -->
        <div class="submenu" :class="{ open: openMenu === item.key }">
          <RouterLink
            v-for="child in item.children"
            :key="child.to"
            :to="child.to"
            :class="{ active: isActive(child.to) }"
            class="submenu-link"
            @click="closeMobileMenu"
          >
            {{ child.label }}
          </RouterLink>
        </div>
      </div>
    </nav>
  </header>
</template>
<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

/* -----------------------------------------
   메뉴 데이터 (JS 버전)
----------------------------------------- */
const menuData = [
  {
    key: 'home',
    label: 'Publish Status',
    to: '/',
  },
  {
    key: 'components',
    label: 'Components',
    to: '/example/agree',
    children: [
      { label: 'Accordion', to: '/example/accordion' },
      { label: 'Agree Form', to: '/example/agree' },
      { label: 'Button', to: '/example/button' },
      { label: 'Checkbox & Radio', to: '/example/checkbox' },
      { label: 'DatePicker', to: '/example/datepicker' },
      { label: 'etc', to: '/example/etc' },
      { label: 'FloatingBar', to: '/example/floatingbar' },
      { label: 'Form', to: '/example/form' },
      { label: 'Modal', to: '/example/modal' },
      { label: 'Selectbox', to: '/example/selectbox' },
      { label: 'Step', to: '/example/step' },
      { label: 'Tab', to: '/example/tab' },
      { label: 'Table', to: '/example/table' },
    ],
  },
  {
    key: 'guide',
    label: 'Guide',
    to: '/guide/rule',
    children: [
      { label: 'Rule', to: '/guide/rule' },
      { label: 'Term', to: '/guide/term' },
    ],
  },
]

/* -----------------------------------------
   상태값
----------------------------------------- */
const menuOpen = ref(false) // 모바일 전체 메뉴 열림
const openMenu = ref(null) // 어떤 서브메뉴가 열렸는지

/* -----------------------------------------
   함수 정의
----------------------------------------- */
const isMobile = () => window.innerWidth <= 768

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value
}

const closeMobileMenu = () => {
  if (isMobile()) menuOpen.value = false
}

const isActive = path => {
  return route.path === path || route.path.startsWith(path + '/')
}

/* PC - 호버 시 열기 */
const onHover = item => {
  if (!isMobile() && item.children) {
    openMenu.value = item.key
  }
}

const onLeave = () => {
  if (!isMobile()) openMenu.value = null
}

/* 모바일 - 두 번 클릭 시 이동 */
const onClickMenu = item => {
  if (!isMobile()) return

  if (!item.children) {
    router.push(item.to)
    closeMobileMenu()
    return
  }

  if (openMenu.value === item.key) {
    router.push(item.to)
    closeMobileMenu()
  } else {
    openMenu.value = item.key
  }
}
</script>
<style scoped>
/* -----------------------------------------
   PC 기본 스타일
----------------------------------------- */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #2c3e50;
  color: white;
  padding: 10px 20px;
}

.logo {
  font-size: 1.2rem;
  font-weight: bold;
}

nav {
  display: flex;
  gap: 20px;
}

nav a {
  color: white;
  text-decoration: none;
}

nav a.active {
  font-weight: 700;
  text-decoration: underline;
}

/* 드롭다운 */
.menu-item {
  position: relative;
}

.submenu {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  background: #34495e;
  min-width: 160px;
  z-index: 100;
  flex-direction: column;
}

.submenu.open {
  display: flex;
}

.submenu a {
  padding: 10px;
}

.submenu a:hover {
  background: rgba(255, 255, 255, 0.1);
}

/* -----------------------------------------
   모바일 스타일
----------------------------------------- */
.menu-toggle {
  display: none;
  font-size: 1.5rem;
  background: none;
  border: none;
  color: white;
}

@media (max-width: 768px) {
  .global-header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 80px;
    z-index: 999;
    box-sizing: border-box;
  }

  .menu-toggle {
    display: block;
  }

  nav {
    position: absolute;
    top: 60px;
    left: 0;
    right: 0;
    display: none;
    flex-direction: column;
    background: #2c3e50;
  }

  nav.open {
    display: flex;
  }

  .menu-item > a {
    padding: 15px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  }

  .submenu {
    display: none;
    position: static;
    background: #3b4c5a;
  }

  .submenu.open {
    display: flex;
  }

  .submenu-link {
    padding-left: 30px !important;
  }
}
</style>
