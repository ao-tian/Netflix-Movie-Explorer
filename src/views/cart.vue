<script setup>
import HeaderVue from '../components/Header.vue';
import cartVue from '../components/Cart.vue';
</script>

<template>
  <div>
    <HeaderVue v-bind:Login="true" />
    <cartVue />
  </div>
</template>

<style scoped>

</style>