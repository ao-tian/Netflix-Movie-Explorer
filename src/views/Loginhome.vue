<script setup>
import HeaderVue from '../components/Header.vue';
import HeroVue from '../components/Hero.vue';
import FooterVue from '../components/Footer.vue';

</script>

<template>
  <div class="min-h-screen bg-netflix-black">
    <HeaderVue v-bind:Login="true" />
    <HeroVue />
    <FooterVue />
    <Router-View />
  </div>
</template>

<style scoped>
/* Additional custom styles if needed */
</style>