<script setup>
import axios from "axios";
import { useStore } from "../store/index.js";
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from "vue";
const props = defineProps({
  value: Object,
  context: {
    type: String,
    default: null, // null = normal, "cart" = cart, "watchlist" = watchlist, "inventory" = inventory
  }
});
const emits = defineEmits(["toggleModal", "openSimilarMovie"]);
const store = useStore();
const showSuccessToast = ref(false);
const showErrorToast = ref(false);
const trailerKey = ref(null);
const similarMovies = ref([]);
const cast = ref([]);
const showTrailer = ref(false);
const showWatchPlayer = ref(false);
const watchProgress = ref(0);
const isPlaying = ref(false);
const watchPlayerInterval = ref(null);

const openSimilarMovie = (movie) => {
  // Emit event to open new movie - parent will handle closing current and opening new
  emits('openSimilarMovie', { id: movie.id, poster: movie.poster });
};

const data = ref(null);

// Fetch movie data when component is created or when value changes
const fetchMovieData = async () => {
  if (!props.value || !props.value.id) {
    return;
  }
  try {
    const response = await axios.get(`https://api.themoviedb.org/3/movie/${props.value.id}`, {
    params: {
      api_key: "d2efec38e7d74d12122672897f241cbf",
      include_adult: "false",
    },
    });
    data.value = response.data;
  } catch (error) {
    console.error("Error fetching movie data:", error);
  }
};

// Fetch additional data (trailer, similar movies, cast)
const fetchAdditionalData = async () => {
  if (!props.value || !props.value.id) return;
  
  try {
    // Fetch videos (trailers)
    const videosResponse = await axios.get(`https://api.themoviedb.org/3/movie/${props.value.id}/videos`, {
      params: {
        api_key: "d2efec38e7d74d12122672897f241cbf",
      },
    });
    const trailer = videosResponse.data.results.find(
      (video) => video.type === "Trailer" && video.site === "YouTube"
    );
    if (trailer) {
      trailerKey.value = trailer.key;
    }

    // Fetch similar movies
    const similarResponse = await axios.get(`https://api.themoviedb.org/3/movie/${props.value.id}/similar`, {
      params: {
        api_key: "d2efec38e7d74d12122672897f241cbf",
        page: 1,
      },
    });
    similarMovies.value = similarResponse.data.results.slice(0, 6).map((movie) => ({
      id: movie.id,
      title: movie.title,
      poster: movie.poster_path,
      release_date: movie.release_date,
    }));

    // Fetch cast
    const creditsResponse = await axios.get(`https://api.themoviedb.org/3/movie/${props.value.id}/credits`, {
      params: {
        api_key: "d2efec38e7d74d12122672897f241cbf",
      },
    });
    cast.value = creditsResponse.data.cast.slice(0, 8);
  } catch (error) {
    console.error("Error fetching additional movie data:", error);
  }
};

// Watch for changes in props.value.id
watch(() => props.value?.id, (newId, oldId) => {
  if (newId && newId !== oldId) {
    // Reset data and refetch when movie changes
    data.value = null;
    trailerKey.value = null;
    similarMovies.value = [];
    cast.value = [];
    showTrailer.value = false;
    showWatchPlayer.value = false;
    isPlaying.value = false;
    watchProgress.value = 0;
    if (watchPlayerInterval.value) {
      clearInterval(watchPlayerInterval.value);
      watchPlayerInterval.value = null;
    }
    fetchMovieData();
    fetchAdditionalData();
  } else if (!newId) {
    data.value = null;
  }
}, { immediate: true });

const isInInventory = computed(() => {
  return props.value && props.value.id ? store.isInInventory(props.value.id) : false;
});

const isInWatchlist = computed(() => {
  return props.value && props.value.id ? store.isInWatchlist(props.value.id) : false;
});

const showWatchlistToast = ref(false);
const watchlistAction = ref(''); // 'add' or 'remove'

const toggleWatchlist = () => {
  if (!props.value || !props.value.id || !data.value) return;
  
  if (isInWatchlist.value) {
    store.removeFromWatchlist(props.value.id);
    watchlistAction.value = 'remove';
    showWatchlistToast.value = true;
    setTimeout(() => {
      showWatchlistToast.value = false;
    }, 2000);
  } else {
    store.addToWatchlist(props.value.id, {
      id: data.value.id,
      poster: data.value.poster_path,
      title: data.value.title,
      date: data.value.release_date,
    });
    watchlistAction.value = 'add';
    showWatchlistToast.value = true;
    setTimeout(() => {
      showWatchlistToast.value = false;
    }, 2000);
  }
};

const handleRemoveFromCart = () => {
  if (!props.value || !props.value.id) return;
  store.removeFromCart(props.value.id);
  showSuccessToast.value = true;
  setTimeout(() => {
    showSuccessToast.value = false;
    emits('toggleModal');
  }, 1500);
};

const handleRemoveFromWatchlist = () => {
  if (!props.value || !props.value.id) return;
  store.removeFromWatchlist(props.value.id);
  watchlistAction.value = 'remove';
  showWatchlistToast.value = true;
  setTimeout(() => {
    showWatchlistToast.value = false;
    emits('toggleModal');
  }, 1500);
};

const handleDeleteFromInventory = () => {
  if (!props.value || !props.value.id) return;
  store.removeFromInventory(props.value.id);
  showSuccessToast.value = true;
  setTimeout(() => {
    showSuccessToast.value = false;
    emits('toggleModal');
  }, 1500);
};

// Watch progress tracking
const watchProgressData = computed(() => {
  return props.value && props.value.id ? store.getWatchProgress(props.value.id) : { progress: 0, lastWatched: null };
});

const hasWatchProgress = computed(() => {
  return watchProgressData.value.progress > 0;
});

// Initialize watch progress
watch(() => data.value, (newData) => {
  if (newData && props.value && props.value.id) {
    const progressData = store.getWatchProgress(props.value.id);
    watchProgress.value = progressData.progress;
  }
}, { immediate: true });

// Mock watch functionality
const startWatching = () => {
  showWatchPlayer.value = true;
  isPlaying.value = true;
  // Load current progress
  if (props.value && props.value.id) {
    const progressData = store.getWatchProgress(props.value.id);
    watchProgress.value = progressData.progress;
  }
  
  // Simulate watch progress
  watchPlayerInterval.value = setInterval(() => {
    if (isPlaying.value && watchProgress.value < 100 && props.value && props.value.id) {
      watchProgress.value += 0.5; // Increase by 0.5% per interval
      store.updateWatchProgress(props.value.id, watchProgress.value);
      
      if (watchProgress.value >= 100) {
        store.markAsWatched(props.value.id);
        isPlaying.value = false;
        if (watchPlayerInterval.value) {
          clearInterval(watchPlayerInterval.value);
          watchPlayerInterval.value = null;
        }
      }
    }
  }, 1000); // Update every second
};

const pauseWatch = () => {
  isPlaying.value = false;
  if (watchPlayerInterval.value) {
    clearInterval(watchPlayerInterval.value);
    watchPlayerInterval.value = null;
  }
  if (props.value && props.value.id) {
    store.updateWatchProgress(props.value.id, watchProgress.value);
  }
};

const resumeWatch = () => {
  isPlaying.value = true;
  // Restart progress simulation
  watchPlayerInterval.value = setInterval(() => {
    if (isPlaying.value && watchProgress.value < 100 && props.value && props.value.id) {
      watchProgress.value += 0.5;
      store.updateWatchProgress(props.value.id, watchProgress.value);
      
      if (watchProgress.value >= 100) {
        store.markAsWatched(props.value.id);
        isPlaying.value = false;
        if (watchPlayerInterval.value) {
          clearInterval(watchPlayerInterval.value);
          watchPlayerInterval.value = null;
        }
      }
    }
  }, 1000);
};

const stopWatch = () => {
  isPlaying.value = false;
  if (watchPlayerInterval.value) {
    clearInterval(watchPlayerInterval.value);
    watchPlayerInterval.value = null;
  }
  showWatchPlayer.value = false;
  if (props.value && props.value.id) {
    store.updateWatchProgress(props.value.id, watchProgress.value);
  }
};

// Cleanup interval on unmount
onUnmounted(() => {
  if (watchPlayerInterval.value) {
    clearInterval(watchPlayerInterval.value);
  }
});

// Fetch trailer, similar movies, and cast on mount (watch will handle updates)
onMounted(() => {
  if (props.value && props.value.id) {
    fetchAdditionalData();
  }
});

const handleAddToCart = () => {
  if (!props.value || !props.value.id || !data.value) return;
  
  // Check if already in inventory
  if (isInInventory.value) {
    showErrorToast.value = true;
    setTimeout(() => {
      showErrorToast.value = false;
    }, 3000);
    return;
  }

  const success = store.addToCart(props.value.id, {
    id: data.value.id,
    poster: data.value.poster_path,
    title: data.value.title,
    date: data.value.release_date,
  });

  if (!success) {
    showErrorToast.value = true;
    setTimeout(() => {
      showErrorToast.value = false;
    }, 3000);
    return;
  }
  
  // Show success toast
  showSuccessToast.value = true;
  
  // Auto-dismiss toast and close modal after 2 seconds
  setTimeout(() => {
    showSuccessToast.value = false;
    setTimeout(() => {
      emits('toggleModal');
    }, 300); // Small delay for smooth transition
  }, 2000);
};
</script>

<template>
  <Teleport to="body">
    <!-- Success Toast Notification -->
    <Transition name="toast">
      <div 
        v-if="showSuccessToast"
        class="fixed top-4 left-1/2 transform -translate-x-1/2 z-[60] bg-green-600 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 min-w-[280px] sm:min-w-[320px] animate-slide-down"
      >
        <svg class="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        <span class="font-semibold text-lg">Add successfully!</span>
      </div>
    </Transition>

    <!-- Error Toast Notification -->
    <Transition name="toast">
      <div 
        v-if="showErrorToast"
        class="fixed top-4 left-1/2 transform -translate-x-1/2 z-[60] bg-red-600 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 min-w-[280px] sm:min-w-[320px] animate-slide-down"
      >
        <svg class="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
        <span class="font-semibold text-lg">Movie already in inventory!</span>
      </div>
    </Transition>

    <!-- Watchlist Toast Notification -->
    <Transition name="toast">
      <div 
        v-if="showWatchlistToast"
        class="fixed top-4 left-1/2 transform -translate-x-1/2 z-[60] bg-yellow-600 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 min-w-[280px] sm:min-w-[320px] animate-slide-down"
      >
        <svg class="w-6 h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        <div class="flex flex-col">
          <span class="font-semibold text-lg">
            {{ watchlistAction === 'remove' ? 'Removed from watchlist' : 'Added to watchlist!' }}
          </span>
          <router-link to="/Watchlist" class="text-sm underline hover:text-yellow-200">
            View Watchlist
          </router-link>
        </div>
      </div>
    </Transition>

    <div 
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      @click.self="emits('toggleModal')"
    >
      <div class="relative bg-netflix-dark rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-800">
        <!-- Close Button -->
        <button 
          @click="emits('toggleModal')"
          class="absolute top-4 right-4 z-10 p-2 bg-black/70 hover:bg-netflix-red rounded-full transition-all duration-200 text-white"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- Loading State -->
        <div v-if="!data" class="flex items-center justify-center p-12 min-h-[400px]">
          <div class="text-center">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-netflix-red mb-4"></div>
            <p class="text-white text-lg">Loading movie details...</p>
          </div>
        </div>

        <!-- Modal Content -->
        <div v-else class="flex flex-col md:flex-row">
          <!-- Poster Image -->
          <div class="w-full md:w-2/5 p-6">
            <img 
              :src="props.value.poster ? `https://image.tmdb.org/t/p/w500${props.value.poster}` : 'https://via.placeholder.com/500x750?text=No+Image'"
              :alt="data?.title || 'Movie'"
              class="w-full h-auto rounded-lg shadow-xl"
            />
          </div>

          <!-- Movie Details -->
          <div class="w-full md:w-3/5 p-6 md:p-8">
            <h1 class="text-3xl md:text-4xl font-bold text-white mb-4">
              {{ data.title }}
            </h1>
            
            <div class="space-y-4 mb-6">
              <div class="flex items-center gap-2">
                <svg class="w-5 h-5 text-netflix-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span class="text-gray-300 font-semibold">Release Date:</span>
                <span class="text-white">{{ data.release_date || 'N/A' }}</span>
              </div>

              <div v-if="data.runtime" class="flex items-center gap-2">
                <svg class="w-5 h-5 text-netflix-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span class="text-gray-300 font-semibold">Runtime:</span>
                <span class="text-white">{{ data.runtime }} minutes</span>
              </div>

              <div v-if="data.vote_average" class="flex items-center gap-2">
                <svg class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span class="text-gray-300 font-semibold">Rating:</span>
                <span class="text-white">{{ data.vote_average.toFixed(1) }}/10</span>
              </div>
            </div>

            <div class="mb-6">
              <h2 class="text-xl font-bold text-white mb-2">Overview</h2>
              <p class="text-gray-300 leading-relaxed text-lg">
                {{ data.overview || 'No overview available.' }}
              </p>
            </div>

            <!-- Inventory Status Message (only show in normal context) -->
            <div v-if="!props.context && isInInventory" class="mb-4 p-4 bg-green-600/20 border border-green-600/50 rounded-lg">
              <div class="flex items-center gap-2">
                <svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span class="text-green-400 font-semibold">This movie is already in your inventory!</span>
              </div>
            </div>

            <!-- Mock Watch Player (only for inventory context) - Show at top when active -->
            <div v-if="showWatchPlayer && props.context === 'inventory'" class="mb-6">
              <div class="relative w-full bg-black rounded-lg overflow-hidden shadow-2xl" style="padding-bottom: 56.25%;">
                <!-- Mock Player Background -->
                <div class="absolute inset-0 bg-gradient-to-b from-netflix-red/20 via-netflix-black to-netflix-black flex items-center justify-center">
                  <!-- Movie Poster as Background -->
                  <img 
                    v-if="props.value.poster"
                    :src="`https://image.tmdb.org/t/p/w1280${props.value.poster}`"
                    :alt="data?.title"
                    class="absolute inset-0 w-full h-full object-cover opacity-30 blur-sm"
                  />
                  
                  <!-- Player Controls Overlay -->
                  <div class="absolute inset-0 flex flex-col items-center justify-center z-10">
                    <!-- Play/Pause Button -->
                    <button 
                      @click="isPlaying ? pauseWatch() : resumeWatch()"
                      class="mb-4 p-4 bg-netflix-red/80 hover:bg-netflix-red rounded-full transition-all duration-200 shadow-lg hover:scale-110"
                    >
                      <svg v-if="!isPlaying" class="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                      </svg>
                      <svg v-else class="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                      </svg>
                    </button>
                    
                    <!-- Movie Title -->
                    <h3 class="text-white text-2xl font-bold mb-2">{{ data?.title }}</h3>
                    
                    <!-- Progress Bar -->
                    <div class="w-full max-w-2xl px-4">
                      <div class="w-full bg-gray-700 rounded-full h-2 mb-2">
                        <div 
                          class="bg-netflix-red h-2 rounded-full transition-all duration-300"
                          :style="{ width: `${watchProgress}%` }"
                        ></div>
                      </div>
                      <div class="flex items-center justify-between text-white text-sm">
                        <span>{{ Math.round(watchProgress) }}% Complete</span>
                        <span v-if="data?.runtime">{{ Math.round((watchProgress / 100) * (data.runtime || 120)) }} / {{ data.runtime }} min</span>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Close Button -->
                  <button 
                    @click="stopWatch"
                    class="absolute top-4 right-4 z-20 p-2 bg-black/70 hover:bg-netflix-red rounded-full transition-all duration-200 text-white"
                  >
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  
                  <!-- Status Indicator -->
                  <div class="absolute top-4 left-4 z-20 px-3 py-1 bg-netflix-red/80 rounded-full">
                    <span class="text-white text-sm font-semibold">
                      {{ isPlaying ? '▶ Now Playing' : '⏸ Paused' }}
                    </span>
                  </div>
                </div>
              </div>
              
              <!-- Watch Info -->
              <div class="mt-4 p-4 bg-netflix-dark/50 rounded-lg border border-gray-700">
                <p class="text-gray-300 text-sm">
                  <span class="font-semibold text-white">Note:</span> This is a mock player interface. 
                  {{ hasWatchProgress ? 'Your watch progress is being tracked.' : 'Start watching to track your progress!' }}
                </p>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-wrap gap-3 mb-6">
              <!-- Watch Trailer Button -->
              <button 
                v-if="trailerKey"
                @click="showTrailer = !showTrailer"
                class="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded transition-all duration-200 flex items-center justify-center gap-2"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                </svg>
                {{ showTrailer ? 'Hide Trailer' : 'Watch Trailer' }}
              </button>

              <!-- Context-specific buttons -->
              <template v-if="props.context === 'cart'">
                <!-- Remove from Cart Button -->
                <button 
                  @click="handleRemoveFromCart"
                  class="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Remove from Cart
                </button>
              </template>

              <template v-else-if="props.context === 'watchlist'">
                <!-- Remove from Watchlist Button -->
                <button 
                  @click="handleRemoveFromWatchlist"
                  class="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 px-6 rounded transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  Remove from Watchlist
                </button>
              </template>

              <template v-else-if="props.context === 'inventory'">
                <!-- Watch Now / Continue Watching Button -->
                <button 
                  @click="startWatching"
                  class="bg-netflix-red hover:bg-red-700 text-white font-semibold py-2 px-6 rounded transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                  </svg>
                  {{ hasWatchProgress ? `Continue Watching (${Math.round(watchProgress)}%)` : 'Watch Now' }}
                </button>
                
                <!-- Delete Permanently Button -->
                <button 
                  @click="handleDeleteFromInventory"
                  class="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete Permanently
                </button>
              </template>

              <!-- Normal context buttons (no context prop) -->
              <template v-else>
                <!-- Watchlist Button -->
                <button 
                  @click="toggleWatchlist"
                  :class="[
                    'py-2 px-6 rounded transition-all duration-200 flex items-center justify-center gap-2 font-semibold',
                    isInWatchlist 
                      ? 'bg-yellow-600 hover:bg-yellow-700 text-white' 
                      : 'bg-gray-700 hover:bg-gray-600 text-white'
                  ]"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path v-if="isInWatchlist" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    <path v-else d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  {{ isInWatchlist ? 'In Watchlist' : 'Add to Watchlist' }}
                </button>

                <!-- Add to Cart Button -->
                <button 
                  v-if="!isInInventory"
                  @click="handleAddToCart"
                  class="btn-primary py-2 px-6 text-lg font-semibold flex items-center justify-center gap-2"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Add to Cart
                </button>
                <router-link v-else to="/Inventory" custom v-slot="{ navigate }">
                  <button 
                    @click="navigate"
                    class="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 text-lg rounded transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    View in Inventory
                  </button>
                </router-link>
              </template>
            </div>

            <!-- Trailer Section (hide when watch player is active) -->
            <div v-if="showTrailer && trailerKey && !showWatchPlayer" class="mb-6">
              <div class="relative w-full" style="padding-bottom: 56.25%;">
                <iframe
                  :src="`https://www.youtube.com/embed/${trailerKey}`"
                  class="absolute top-0 left-0 w-full h-full rounded-lg"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen
                ></iframe>
              </div>
            </div>

            <!-- Cast Section -->
            <div v-if="cast.length > 0" class="mb-6">
              <h3 class="text-xl font-bold text-white mb-4">Cast</h3>
              <div class="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-netflix-red scrollbar-track-gray-800">
                <div 
                  v-for="actor in cast" 
                  :key="actor.id"
                  class="flex-shrink-0 text-center"
                >
                  <img 
                    :src="actor.profile_path ? `https://image.tmdb.org/t/p/w185${actor.profile_path}` : 'https://via.placeholder.com/185x278?text=No+Image'"
                    :alt="actor.name"
                    class="w-24 h-32 object-cover rounded-lg mb-2"
                  />
                  <p class="text-white text-sm font-semibold">{{ actor.name }}</p>
                  <p class="text-gray-400 text-xs">{{ actor.character }}</p>
                </div>
              </div>
            </div>

            <!-- Similar Movies Section (only show in normal context) -->
            <div v-if="!props.context && similarMovies.length > 0" class="mb-6">
              <h3 class="text-xl font-bold text-white mb-4">Similar Movies</h3>
              <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                <div 
                  v-for="movie in similarMovies" 
                  :key="movie.id"
                  @click="openSimilarMovie(movie)"
                  class="cursor-pointer group"
                >
                  <img 
                    :src="movie.poster ? `https://image.tmdb.org/t/p/w185${movie.poster}` : 'https://via.placeholder.com/185x278?text=No+Image'"
                    :alt="movie.title"
                    class="w-full h-auto rounded-lg transition-transform duration-300 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-netflix-red/50"
                  />
                  <p class="text-white text-xs mt-2 line-clamp-2 group-hover:text-netflix-red transition-colors">
                    {{ movie.title }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
/* Smooth scrollbar for modal */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #1F1F1F;
}

::-webkit-scrollbar-thumb {
  background: #E50914;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #B20710;
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
