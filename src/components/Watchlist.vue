<script setup>
import { useStore } from "../store/index.js"
import { ref } from "vue"
import Modal from "./Modal.vue"

const store = useStore();
const showModal = ref(false);
const selectedMovie = ref(null);

const openModal = (movie) => {
  selectedMovie.value = { id: movie.id, poster: movie.poster };
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};
</script>

<template>
  <div class="min-h-screen bg-netflix-black py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-white mb-2">My Watchlist</h1>
        <p class="text-gray-400">
          {{ Array.from(store.watchlist.values()).length }} movie(s) in your watchlist
        </p>
      </div>

      <!-- Empty Watchlist State -->
      <div v-if="Array.from(store.watchlist.values()).length === 0" class="text-center py-16">
        <svg class="mx-auto h-24 w-24 text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        <h2 class="text-2xl font-bold text-white mb-2">Your watchlist is empty</h2>
        <p class="text-gray-400 mb-6">Start adding movies to your watchlist to keep track of what you want to watch!</p>
        <router-link to="/Movie">
          <button class="btn-primary px-8 py-3">
            Browse Movies
          </button>
        </router-link>
      </div>

      <!-- Watchlist Items -->
      <div v-else>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5 md:gap-6">
          <div 
            v-for="movie in Array.from(store.watchlist.values())"
            :key="movie.id"
            @click="openModal(movie)"
            class="movie-card group cursor-pointer"
          >
            <img 
              :src="movie.poster ? `https://image.tmdb.org/t/p/w500${movie.poster}` : 'https://via.placeholder.com/500x750?text=No+Image'"
              :alt="movie.title"
              class="w-full h-full object-cover"
            />
            <div class="movie-overlay flex flex-col justify-end p-4">
              <h3 class="text-white font-bold text-sm sm:text-base mb-2 line-clamp-2">
                {{ movie.title }}
              </h3>
              <p class="text-gray-300 text-xs line-clamp-2" v-if="movie.overview">
                {{ movie.overview }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <Modal v-if="showModal" @toggleModal="closeModal()" :value="selectedMovie" context="watchlist" />
  </div>
</template>

<style scoped>
.movie-card {
  aspect-ratio: 2/3;
  overflow: hidden;
  border-radius: 0.375rem;
  background-color: #1F1F1F;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.3);
}

.movie-card:hover {
  transform: scale(1.08);
  box-shadow: 0 10px 25px -5px rgba(229, 9, 20, 0.5);
}

.movie-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.7) 50%, transparent 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.movie-card:hover .movie-overlay {
  opacity: 1;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

