<script setup>
import HeaderVue from '../components/Header.vue'
import MovieVue from '../components/Movie.vue'

</script>

<template>
  <HeaderVue v-bind:Login="true" />
  <Suspense>
    <MovieVue />
  </Suspense>
</template>

<style scoped>

</style>