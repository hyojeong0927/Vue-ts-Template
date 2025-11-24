<template>
  <Container fluid>
    <Header />
    <div class="contents">
      <Main background="#f9f9f9" maxWidth="1200px" center>
        <RouterView />
      </Main>
      <Footer />
    </div>
  </Container>
</template>

<script setup lang="ts">
import Header from './Header.vue'
import Footer from './Footer.vue'
import Container from './Container.vue'
import Main from './Main.vue'
import { RouterView } from 'vue-router'
</script>

<style scoped>
.contents {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}
</style>
