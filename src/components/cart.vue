<script setup>
import { useStore } from "../store/index.js"
import { useRouter } from "vue-router"
import { ref } from "vue"
import Modal from "./Modal.vue"

const store = useStore();
const router = useRouter();
const showSuccessToast = ref(false);
const showModal = ref(false);
const selectedMovie = ref(null);

const openModal = (movie) => {
  selectedMovie.value = { id: movie.id, poster: movie.poster };
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const completePurchase = () => {
  if (store.cart.size === 0) {
    return;
  }
  
  // Move all cart items to inventory
  store.completePurchase();
  
  // Show success toast
  showSuccessToast.value = true;
  
  // Redirect to inventory after 2 seconds
  setTimeout(() => {
    showSuccessToast.value = false;
    router.push('/Inventory');
  }, 2000);
}
</script>

<template>
  <div class="min-h-screen bg-netflix-black py-8">
    <!-- Success Toast Notification -->
    <Transition name="toast">
      <div 
        v-if="showSuccessToast"
        class="fixed top-24 left-1/2 transform -translate-x-1/2 z-[60] bg-green-600 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 min-w-[280px] sm:min-w-[320px] animate-slide-down"
      >
        <svg class="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        <span class="font-semibold text-lg">Purchase completed! Redirecting to inventory...</span>
      </div>
    </Transition>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-white mb-2">My Cart</h1>
        <p class="text-gray-400">
          {{ Array.from(store.cart.values()).length }} item(s) in your cart
        </p>
      </div>

      <!-- Empty Cart State -->
      <div v-if="Array.from(store.cart.values()).length === 0" class="text-center py-16">
        <svg class="mx-auto h-24 w-24 text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <h2 class="text-2xl font-bold text-white mb-2">Your cart is empty</h2>
        <p class="text-gray-400 mb-6">Start adding movies to your cart!</p>
        <router-link to="/Movie">
          <button class="btn-primary px-8 py-3">
            Browse Movies
          </button>
        </router-link>
      </div>

      <!-- Cart Items -->
      <div v-else>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          <div 
            v-for="movie in Array.from(store.cart.values())"
            :key="movie.id"
            @click="openModal(movie)"
            class="bg-netflix-dark rounded-lg overflow-hidden border border-gray-800 hover:border-netflix-red transition-all duration-300 group cursor-pointer"
          >
            <div class="relative">
              <img 
                :src="movie.poster ? `https://image.tmdb.org/t/p/w500${movie.poster}` : 'https://via.placeholder.com/500x750?text=No+Image'"
                :alt="movie.title"
                class="w-full h-64 object-cover"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div class="p-4">
              <h3 class="text-white font-bold text-lg mb-2 line-clamp-2">
                {{ movie.title }}
              </h3>
              <p class="text-gray-400 text-sm mb-4">
                Release Date: {{ movie.date || 'N/A' }}
              </p>
              <button 
                @click.stop="store.removeFromCart(movie.id)"
                class="w-full btn-secondary py-2 text-sm flex items-center justify-center gap-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Remove
              </button>
            </div>
          </div>
        </div>

        <!-- Purchase Button -->
        <div class="bg-netflix-dark rounded-lg p-6 border border-gray-800">
          <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p class="text-gray-400">Total Items:</p>
              <p class="text-2xl font-bold text-white">
                {{ Array.from(store.cart.values()).length }}
              </p>
            </div>
            <button 
              @click="completePurchase"
              class="btn-primary px-8 py-3 text-lg font-semibold w-full sm:w-auto flex items-center justify-center gap-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Complete Purchase
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <Modal v-if="showModal" @toggleModal="closeModal()" :value="selectedMovie" context="cart" />
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Toast Animation */
.toast-enter-active {
  transition: all 0.3s ease-out;
}

.toast-leave-active {
  transition: all 0.3s ease-in;
}

.toast-enter-from {
  opacity: 0;
  transform: translate(-50%, -20px);
}

.toast-leave-to {
  opacity: 0;
  transform: translate(-50%, -20px);
}

@keyframes slide-down {
  from {
    opacity: 0;
    transform: translate(-50%, -20px);
  }
  to {
    opacity: 1;
    transform: translate(-50%, 0);
  }
}

.animate-slide-down {
  animation: slide-down 0.3s ease-out;
}
</style>