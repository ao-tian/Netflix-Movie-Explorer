<script setup>
import { useStore } from "../store/index.js"
import { ref } from "vue"
import Modal from "./Modal.vue"

const store = useStore();
const showDeleteConfirm = ref(false);
const movieToDelete = ref(null);
const showModal = ref(false);
const selectedMovie = ref(null);

const openModal = (movie) => {
  selectedMovie.value = { id: movie.id, poster: movie.poster };
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const confirmDelete = (movie) => {
  movieToDelete.value = movie;
  showDeleteConfirm.value = true;
};

const cancelDelete = () => {
  showDeleteConfirm.value = false;
  movieToDelete.value = null;
};

const deletePermanently = () => {
  if (movieToDelete.value) {
    store.removeFromInventory(movieToDelete.value.id);
    showDeleteConfirm.value = false;
    movieToDelete.value = null;
  }
};
</script>

<template>
  <div class="min-h-screen bg-netflix-black py-8">
    <!-- Delete Confirmation Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div 
          v-if="showDeleteConfirm"
          class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          @click.self="cancelDelete"
        >
          <div class="bg-netflix-dark rounded-2xl shadow-2xl max-w-md w-full border border-gray-800 p-6">
            <h3 class="text-2xl font-bold text-white mb-4">Delete Movie Permanently?</h3>
            <p class="text-gray-300 mb-2">
              Are you sure you want to permanently delete 
              <span class="font-semibold text-white">{{ movieToDelete?.title }}</span> 
              from your inventory?
            </p>
            <p class="text-red-400 text-sm mb-6">
              This action cannot be undone. You will need to purchase this movie again to add it back.
            </p>
            <div class="flex gap-4 justify-end">
              <button 
                @click="cancelDelete"
                class="btn-secondary px-6 py-2"
              >
                Cancel
              </button>
              <button 
                @click="deletePermanently"
                class="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded transition-all duration-200"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-white mb-2">My Inventory</h1>
        <p class="text-gray-400">
          {{ Array.from(store.inventory.values()).length }} movie(s) in your inventory
        </p>
      </div>

      <!-- Empty Inventory State -->
      <div v-if="Array.from(store.inventory.values()).length === 0" class="text-center py-16">
        <svg class="mx-auto h-24 w-24 text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
        <h2 class="text-2xl font-bold text-white mb-2">Your inventory is empty</h2>
        <p class="text-gray-400 mb-6">Start browsing movies to build your collection!</p>
        <router-link to="/Movie">
          <button class="btn-primary px-8 py-3">
            Browse Movies
          </button>
        </router-link>
      </div>

      <!-- Inventory Items -->
      <div v-else>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div 
            v-for="movie in Array.from(store.inventory.values())"
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
              <p class="text-gray-400 text-sm mb-2">
                Release Date: {{ movie.date || 'N/A' }}
              </p>
              
              <!-- Watch Progress Indicator -->
              <div v-if="store.getWatchProgress(movie.id).progress > 0" class="mb-3">
                <div class="flex items-center justify-between text-xs text-gray-400 mb-1">
                  <span>Watch Progress</span>
                  <span>{{ Math.round(store.getWatchProgress(movie.id).progress) }}%</span>
                </div>
                <div class="w-full bg-gray-700 rounded-full h-1.5">
                  <div 
                    class="bg-netflix-red h-1.5 rounded-full transition-all duration-300"
                    :style="{ width: `${store.getWatchProgress(movie.id).progress}%` }"
                  ></div>
                </div>
              </div>
              
              <button 
                @click.stop="confirmDelete(movie)"
                class="w-full bg-red-600 hover:bg-red-700 text-white py-2 text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <Modal v-if="showModal" @toggleModal="closeModal()" :value="selectedMovie" context="inventory" />
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Modal Animation */
.modal-enter-active {
  transition: all 0.3s ease-out;
}

.modal-leave-active {
  transition: all 0.3s ease-in;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from > div,
.modal-leave-to > div {
  transform: scale(0.9);
}
</style>

