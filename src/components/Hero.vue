<template>
  <!-- Hero Section 1 - Netflix Movie Explorer -->
  <section class="py-8 sm:py-10 lg:py-12 bg-gradient-to-b from-black via-[#2a2a2a] to-netflix-black relative overflow-hidden" style="background-color: #1a1a1a;">
    <!-- Enhanced Animated Background Effects -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <!-- Subtle gradient mesh -->
      <div class="absolute inset-0 bg-gradient-to-br from-black via-[#1a1a1a]/80 to-netflix-black"></div>
      
      <!-- Animated orbs -->
      <div class="absolute top-1/3 right-1/3 w-96 h-96 bg-netflix-red/8 rounded-full blur-3xl animate-pulse-slow"></div>
      <div class="absolute bottom-1/3 left-1/3 w-96 h-96 bg-netflix-red/5 rounded-full blur-3xl animate-pulse-slower"></div>
      <div class="absolute bottom-1/2 left-1/4 w-64 h-64 bg-netflix-red/6 rounded-full blur-2xl animate-float-slow"></div>
      
      <!-- Subtle grid pattern -->
      <div class="absolute inset-0 opacity-5" style="background-image: linear-gradient(rgba(229,9,20,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(229,9,20,0.1) 1px, transparent 1px); background-size: 50px 50px;"></div>
      
      <!-- Moving particles effect -->
      <div class="absolute top-0 left-0 w-full h-full">
        <div class="particle"></div>
        <div class="particle"></div>
        <div class="particle"></div>
        <div class="particle"></div>
        <div class="particle"></div>
      </div>
    </div>
    
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div class="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
        <div class="w-full lg:w-1/2 text-center lg:text-left hero-text-container-2 py-4">
            <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 hero-title-shimmer-2">
              Netflix Movie Explorer
            </h2>
            <p class="text-lg sm:text-xl text-gray-300 mb-4 leading-relaxed hero-text-2">
              Netflix Movie Explorer is a powerful movie discovery platform that helps you search and explore
              movies from around the world. Browse through thousands of films, discover new releases, and find
              your next favorite movie with our comprehensive search and filtering system.
            </p>
            <p class="text-lg sm:text-xl text-gray-300 mb-6 leading-relaxed hero-text-2">
              Our database includes a vast collection of movies across all genres. Search by title, explore by genre,
              and discover award-winning films, blockbusters, documentaries, and more. The more you explore, the
              better you'll discover movies that match your interests.
            </p>
            <h3 class="text-2xl sm:text-3xl font-bold mb-4 hero-title-shimmer-2">
              Our Slogan
            </h3>
            <p class="text-xl sm:text-2xl text-white font-semibold italic hero-slogan">
              Always something more to see.
            </p>
          </div>
          <div class="w-full lg:w-1/2 hero-image-container-2">
            <div class="relative group">
              <div class="absolute -inset-1 bg-gradient-to-r from-netflix-red to-red-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
              <img 
                src="https://help.nflxext.com/43e0db2f-fea0-4308-bfb9-09f2a88f6ee4_what_is_netflix_1_en.png" 
                alt="Netflix"
                class="relative w-full h-auto rounded-lg shadow-2xl transform transition-all duration-500 group-hover:scale-105"
              >
            </div>
          </div>
        </div>
      </div>
    </section>

  <!-- Hero Section 2 - Watch Everywhere -->
  <section class="py-8 sm:py-10 lg:py-12 bg-gradient-to-b from-netflix-black via-[#050505] to-black relative overflow-hidden" style="background-color: #0a0a0a;">
    <!-- Enhanced Animated Background Effects -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <!-- Subtle gradient mesh -->
      <div class="absolute inset-0 bg-gradient-to-br from-netflix-black via-[#0a0a0a]/80 to-black"></div>
      
      <!-- Animated orbs -->
      <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-netflix-red/8 rounded-full blur-3xl animate-pulse-slow"></div>
      <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-netflix-red/5 rounded-full blur-3xl animate-pulse-slower"></div>
      <div class="absolute top-1/2 right-1/3 w-64 h-64 bg-netflix-red/6 rounded-full blur-2xl animate-float-slow"></div>
      
      <!-- Subtle grid pattern -->
      <div class="absolute inset-0 opacity-5" style="background-image: linear-gradient(rgba(229,9,20,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(229,9,20,0.1) 1px, transparent 1px); background-size: 50px 50px;"></div>
      
      <!-- Moving particles effect -->
      <div class="absolute top-0 left-0 w-full h-full">
        <div class="particle"></div>
        <div class="particle"></div>
        <div class="particle"></div>
        <div class="particle"></div>
        <div class="particle"></div>
      </div>
    </div>
    
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div class="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
        <div class="w-full lg:w-1/2 order-2 lg:order-1 hero-image-container">
            <div class="relative group">
              <div class="absolute -inset-1 bg-gradient-to-r from-netflix-red to-red-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
              <img 
                src="https://help.nflxext.com/0af6ce3e-b27a-4722-a5f0-e32af4df3045_what_is_netflix_5_en.png" 
                alt="Watch Everywhere"
                class="relative w-full h-auto rounded-lg shadow-2xl transform transition-all duration-500 group-hover:scale-105"
              >
            </div>
          </div>
          <div class="w-full lg:w-1/2 order-1 lg:order-2 text-center lg:text-left hero-text-container py-4">
            <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 hero-title-shimmer">
              Search Everywhere
            </h2>
            <p class="text-lg sm:text-xl text-gray-300 mb-6 leading-relaxed hero-text">
              Access our movie database from any device - your phone, tablet, laptop, or desktop. Search and explore
              movies wherever you are, whenever you want.
            </p>
            <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 mt-8 hero-title-shimmer">
              Browse by Genre
            </h2>
            <p class="text-lg sm:text-xl text-gray-300 mb-6 leading-relaxed hero-text">
              Filter movies by genre including Action, Adventure, Fantasy, Science Fiction, Family, and more.
              Discover new films in your favorite categories.
            </p>
            <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 mt-8 hero-title-shimmer">
              Detailed Movie Information
            </h2>
            <p class="text-lg sm:text-xl text-gray-300 leading-relaxed hero-text">
              Get comprehensive details about any movie including plot summaries, release dates, ratings, and more!
            </p>
          </div>
        </div>
      </div>
    </section>
</template>

<style scoped>
/* Fade-in animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes pulse-slow {
  0%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 0.6;
    transform: scale(1.1);
  }
}

@keyframes pulse-slower {
  0%, 100% {
    opacity: 0.2;
    transform: scale(1);
  }
  50% {
    opacity: 0.4;
    transform: scale(1.15);
  }
}

@keyframes shimmer {
  0% {
    background-position: -200% center;
  }
  100% {
    background-position: 200% center;
  }
}

@keyframes float-slow {
  0%, 100% {
    transform: translateY(0px) translateX(0px);
  }
  33% {
    transform: translateY(-20px) translateX(10px);
  }
  66% {
    transform: translateY(10px) translateX(-10px);
  }
}

.animate-float-slow {
  animation: float-slow 8s ease-in-out infinite;
}

/* Particle animation */
.particle {
  position: absolute;
  width: 2px;
  height: 2px;
  background: rgba(229, 9, 20, 0.6);
  border-radius: 50%;
  animation: particle-float 15s infinite ease-in-out;
}

.particle:nth-child(1) {
  left: 10%;
  top: 20%;
  animation-delay: 0s;
  animation-duration: 12s;
}

.particle:nth-child(2) {
  left: 30%;
  top: 60%;
  animation-delay: 2s;
  animation-duration: 15s;
}

.particle:nth-child(3) {
  left: 60%;
  top: 30%;
  animation-delay: 4s;
  animation-duration: 18s;
}

.particle:nth-child(4) {
  left: 80%;
  top: 70%;
  animation-delay: 6s;
  animation-duration: 14s;
}

.particle:nth-child(5) {
  left: 50%;
  top: 80%;
  animation-delay: 8s;
  animation-duration: 16s;
}

@keyframes particle-float {
  0%, 100% {
    transform: translateY(0) translateX(0) scale(1);
    opacity: 0.3;
  }
  25% {
    transform: translateY(-30px) translateX(20px) scale(1.2);
    opacity: 0.6;
  }
  50% {
    transform: translateY(-60px) translateX(-15px) scale(0.8);
    opacity: 0.4;
  }
  75% {
    transform: translateY(-30px) translateX(10px) scale(1.1);
    opacity: 0.5;
  }
}

.animate-pulse-slow {
  animation: pulse-slow 4s ease-in-out infinite;
}

.animate-pulse-slower {
  animation: pulse-slower 6s ease-in-out infinite;
}

/* Hero text animations */
.hero-text-container {
  animation: fadeInRight 1s ease-out;
}

.hero-text-container-2 {
  animation: fadeInLeft 1s ease-out;
}

.hero-image-container {
  animation: fadeInLeft 1s ease-out;
}

.hero-image-container-2 {
  animation: fadeInRight 1s ease-out;
}

/* Shimmer effect for titles (similar to slogan) */
.hero-title-shimmer {
  animation: fadeInUp 0.8s ease-out 0.2s both, shimmer 4s linear infinite;
  background: linear-gradient(90deg, #E50914, #ff1a2e, #E50914, #ff1a2e);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: inline-block;
  padding-bottom: 0.25rem;
  line-height: 1.2;
  overflow: visible;
}

.hero-title-shimmer-2 {
  animation: fadeInUp 0.8s ease-out 0.2s both, shimmer 4s linear infinite;
  background: linear-gradient(90deg, #E50914, #ff1a2e, #E50914, #ff1a2e);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: inline-block;
  padding-bottom: 0.25rem;
  line-height: 1.2;
  overflow: visible;
}

.hero-text {
  animation: fadeInUp 0.8s ease-out 0.4s both;
}

.hero-text-2 {
  animation: fadeInUp 0.8s ease-out 0.4s both;
}

.hero-slogan {
  animation: fadeInUp 0.8s ease-out 0.6s both;
  background: linear-gradient(90deg, #ffffff, #E50914, #ffffff);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: fadeInUp 0.8s ease-out 0.6s both, shimmer 3s linear infinite;
}

/* Image hover effects */
.group:hover img {
  filter: brightness(1.1);
}

/* Smooth transitions */
* {
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
</style>