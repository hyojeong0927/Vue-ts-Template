<template>
  <header class="global-header">
    <div class="logo">My Vue App</div>
  </header>
</template>

<style scoped>
.global-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 64px; /* sticky 기준 */
  background: #2c3e50;
  color: white;
  padding: 0 20px;
  z-index: 999;
  display: flex;
  align-items: center;
}

.logo {
  font-size: 1.2rem;
  font-weight: bold;
}
</style>
