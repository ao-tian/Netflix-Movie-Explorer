<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();
const navigate = (link) => {
  router.push(link);
}

const props = defineProps({
  Login: Boolean,
});

</script>

<template>
  <nav class="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black via-black/95 to-transparent transition-all duration-300 backdrop-blur-sm header-nav">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-20">
        <!-- Logo Section -->
        <div class="flex items-center space-x-4">
          <div class="logo-container">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Netflix_logo.svg/2560px-Netflix_logo.svg.png"
              alt="Netflix Logo"
              class="h-8 sm:h-10 w-auto transform transition-transform duration-300 hover:scale-110"
            />
          </div>
          <div class="logo-container-2">
            <img 
              src="https://cdn-images-1.medium.com/max/1200/1*ty4NvNrGg4ReETxqU2N3Og.png" 
              alt="Movie Explorer"
              class="h-8 sm:h-10 w-auto hidden sm:block transform transition-transform duration-300 hover:scale-110"
            />
          </div>
        </div>

        <!-- Navigation Links -->
        <div class="flex items-center space-x-2 sm:space-x-4">
          <!-- Guest Navigation -->
          <template v-if="!Login">
            <router-link to="/Login" custom v-slot="{ navigate }">
              <button 
                @click="navigate" 
                role="link"
                class="btn-secondary text-sm sm:text-base px-3 sm:px-6 py-2"
              >
                Sign In
              </button>
            </router-link>
            <router-link to="/Register" custom v-slot="{ navigate }">
              <button 
                @click="navigate" 
                role="link"
                class="btn-primary text-sm sm:text-base px-3 sm:px-6 py-2"
              >
                Sign Up
              </button>
            </router-link>
          </template>

          <!-- Authenticated Navigation -->
          <template v-if="Login">
            <router-link to="/LoginHome" custom v-slot="{ navigate }">
              <button 
                @click="navigate" 
                role="link"
                class="text-white hover:text-netflix-red transition-colors duration-200 text-sm sm:text-base px-2 sm:px-4 py-2 font-medium"
              >
                Home
              </button>
            </router-link>
            <router-link to="/Movie" custom v-slot="{ navigate }">
              <button 
                @click="navigate" 
                role="link"
                class="text-white hover:text-netflix-red transition-colors duration-200 text-sm sm:text-base px-2 sm:px-4 py-2 font-medium"
              >
                Movies
              </button>
            </router-link>
            <router-link to="/Inventory" custom v-slot="{ navigate }">
              <button 
                @click="navigate" 
                role="link"
                class="text-white hover:text-netflix-red transition-colors duration-200 text-sm sm:text-base px-2 sm:px-4 py-2 font-medium"
              >
                Inventory
              </button>
            </router-link>
            <router-link to="/Watchlist" custom v-slot="{ navigate }">
              <button 
                @click="navigate" 
                role="link"
                class="text-white hover:text-netflix-red transition-colors duration-200 text-sm sm:text-base px-2 sm:px-4 py-2 font-medium"
              >
                Watchlist
              </button>
            </router-link>
            <router-link to="/Cart" custom v-slot="{ navigate }">
              <button 
                @click="navigate" 
                role="link"
                class="relative p-2 hover:bg-white/10 rounded-full transition-all duration-200"
              >
                <img 
                  src="../assets/cart.png" 
                  alt="Cart"
                  class="h-6 w-6 sm:h-8 sm:w-8"
                >
              </button>
            </router-link>
            <router-link to="/" custom v-slot="{ navigate }">
              <button 
                @click="navigate" 
                role="link"
                class="btn-secondary text-sm sm:text-base px-3 sm:px-6 py-2"
              >
                Logout
              </button>
            </router-link>
          </template>
        </div>
      </div>
    </div>
  </nav>
  <!-- Spacer to account for fixed header -->
  <div class="h-20"></div>
</template>

<style scoped>
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes glow {
  0%, 100% {
    box-shadow: 0 0 5px rgba(229, 9, 20, 0.3);
  }
  50% {
    box-shadow: 0 0 20px rgba(229, 9, 20, 0.6);
  }
}

.header-nav {
  animation: fadeInDown 0.6s ease-out;
  border-bottom: 1px solid transparent;
  transition: border-color 0.3s ease;
}

.header-nav:hover {
  border-bottom-color: rgba(229, 9, 20, 0.3);
}

.logo-container,
.logo-container-2 {
  animation: fadeInDown 0.8s ease-out;
  position: relative;
}

.logo-container::after,
.logo-container-2::after {
  content: '';
  position: absolute;
  inset: -5px;
  border-radius: 8px;
  padding: 5px;
  background: linear-gradient(45deg, transparent, rgba(229, 9, 20, 0.3), transparent);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.logo-container:hover::after,
.logo-container-2:hover::after {
  opacity: 1;
  animation: glow 2s ease-in-out infinite;
}

/* Button hover effects */
.btn-primary:hover,
.btn-secondary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(229, 9, 20, 0.3);
}

/* Smooth transitions for all interactive elements */
button {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>