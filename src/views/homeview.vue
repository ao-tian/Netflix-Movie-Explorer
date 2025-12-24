<script setup>
import { onMounted } from 'vue';
import HeaderVue from '../components/Header.vue';
import HeroVue from '../components/Hero.vue';
import FooterVue from '../components/Footer.vue';

onMounted(() => {
  // Add smooth scroll behavior
  document.documentElement.style.scrollBehavior = 'smooth';
});
</script>

<template>
  <div class="min-h-screen bg-netflix-black relative overflow-hidden">
    <!-- Enhanced Animated gradient background -->
    <div class="fixed inset-0 -z-10">
      <div class="absolute inset-0 bg-gradient-to-br from-netflix-black via-black to-netflix-black"></div>
      
      <!-- Subtle radial gradients -->
      <div class="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(229,9,20,0.08),transparent_60%)] animate-pulse-slow"></div>
      <div class="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(229,9,20,0.05),transparent_60%)] animate-pulse-slower"></div>
      <div class="absolute top-1/2 left-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(229,9,20,0.03),transparent_70%)] animate-float-slow"></div>
      
      <!-- Subtle mesh gradient overlay -->
      <div class="absolute inset-0 opacity-10" style="background-image: radial-gradient(circle at 2px 2px, rgba(229,9,20,0.15) 1px, transparent 0); background-size: 40px 40px;"></div>
    </div>
    
    <HeaderVue v-bind:Login="false" />
    <HeroVue />
    <FooterVue />
    <Router-View />
  </div>
</template>

<style scoped>
@keyframes pulse-slow {
  0%, 100% {
    opacity: 0.5;
  }
  50% {
    opacity: 0.8;
  }
}

@keyframes pulse-slower {
  0%, 100% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.6;
  }
}

@keyframes float-slow {
  0%, 100% {
    transform: translateY(0px) translateX(0px) scale(1);
    opacity: 0.4;
  }
  50% {
    transform: translateY(-30px) translateX(20px) scale(1.1);
    opacity: 0.6;
  }
}

.animate-pulse-slow {
  animation: pulse-slow 4s ease-in-out infinite;
}

.animate-pulse-slower {
  animation: pulse-slower 6s ease-in-out infinite;
}

.animate-float-slow {
  animation: float-slow 8s ease-in-out infinite;
}
</style>