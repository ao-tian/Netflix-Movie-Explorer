<script setup>
import HeaderVue from '../components/Header.vue';
import InventoryVue from '../components/Inventory.vue';
</script>

<template>
  <div>
    <HeaderVue v-bind:Login="true" />
    <InventoryVue />
  </div>
</template>

<style scoped>

</style>

