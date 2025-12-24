<script setup>
import axios from "axios";
import { ref, onMounted } from "vue";
import Modal from "../components/Modal.vue";
import { useStore } from "../store/index.js";

const store = useStore();
const genre = ref(null);
const selectedGenreName = ref("");
const criteria = ref("");
const searchResults = ref([]);
const popularMovies = ref([]);
const page = ref(1);
const totalPages = ref(0);
const showModal = ref(false);
const selectedId = ref(0);
const sidebarOpen = ref(false);
const filtersOpen = ref(false);
const isSearchActive = ref(false);
const searchSuggestions = ref([]);
const showSuggestions = ref(false);
const debounceTimer = ref(null);

// Filter states
const timeFilter = ref("");
const filtersApplied = ref(false);

// Get current year
const currentYear = new Date().getFullYear();

// TMDB Genre IDs mapping
const genres = [
  { id: null, name: "Popular" },
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 14, name: "Fantasy" },
  { id: 36, name: "History" },
  { id: 27, name: "Horror" },
  { id: 10402, name: "Music" },
  { id: 9648, name: "Mystery" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Science Fiction" },
  { id: 10770, name: "TV Movie" },
  { id: 53, name: "Thriller" },
  { id: 10752, name: "War" },
  { id: 37, name: "Western" },
];

const openModal = (value) => {
  showModal.value = true;
  selectedId.value = value;
  showSuggestions.value = false;
};

const handleSimilarMovie = (movie) => {
  // Close current modal first
  showModal.value = false;
  // Reset selectedId
  selectedId.value = null;
  // Then open new modal with the similar movie after a brief delay
  setTimeout(() => {
    selectedId.value = movie;
    showModal.value = true;
    showSuggestions.value = false;
  }, 300);
};

const closeModal = () => {
  showModal.value = false;
};

const buildFilterParams = () => {
  const params = {
    api_key: "d2efec38e7d74d12122672897f241cbf",
    include_adult: false,
    page: 1,
  };

  // Time filter
  if (timeFilter.value === "this-year") {
    params["primary_release_date.gte"] = `${currentYear}-01-01`;
    params["primary_release_date.lte"] = `${currentYear}-12-31`;
  } else if (timeFilter.value === "last-year") {
    params["primary_release_date.gte"] = `${currentYear - 1}-01-01`;
    params["primary_release_date.lte"] = `${currentYear - 1}-12-31`;
  } else if (timeFilter.value === "even-earlier") {
    params["primary_release_date.lte"] = `${currentYear - 2}-12-31`;
  }

  return params;
};

const fetchPopularMovies = async () => {
  try {
    const params = buildFilterParams();
    const data = (
      await axios.get("https://api.themoviedb.org/3/movie/popular", { params })
    ).data;

    popularMovies.value = data.results.map((movie) => {
      return {
        id: movie.id,
        title: movie.title,
        original_title: movie.original_title,
        release_date: movie.release_date,
        overview: movie.overview,
        poster: movie.poster_path,
      };
    });
  } catch (error) {
    console.error("Error fetching popular movies:", error);
  }
};

const fetchMoviesByGenre = async (genreId) => {
  try {
    const params = buildFilterParams();
    params.with_genres = genreId;
    
    const data = (
      await axios.get("https://api.themoviedb.org/3/discover/movie", { params })
    ).data;

    store.movies = data.results.map((movie) => {
      return {
        id: movie.id,
        title: movie.title,
        original_title: movie.original_title,
        release_date: movie.release_date,
        overview: movie.overview,
        poster: movie.poster_path,
      };
    });
  } catch (error) {
    console.error("Error fetching movies by genre:", error);
    store.movies = [];
  }
};

const selectGenre = async (genreId, genreName) => {
  genre.value = genreId;
  selectedGenreName.value = genreName;
  searchResults.value = [];
  popularMovies.value = [];
  criteria.value = "";
  page.value = 1;
  
  // Apply current filters when changing genre
  if (genreId === null) {
    store.movies = [];
    await fetchPopularMovies();
  } else {
    await fetchMoviesByGenre(genreId);
  }
  
  // Close sidebar on mobile after selection
  if (window.innerWidth < 1024) {
    sidebarOpen.value = false;
  }
};

const applyFilters = async () => {
  filtersApplied.value = true;
  page.value = 1;
  
  // If there's an active search, re-run it with filters
  if (criteria.value.trim()) {
    await search(0);
  } else {
    searchResults.value = [];
    if (genre.value === null) {
      store.movies = [];
      await fetchPopularMovies();
    } else if (genre.value) {
      await fetchMoviesByGenre(genre.value);
    }
  }
};

const clearFilters = async () => {
  timeFilter.value = "";
  filtersApplied.value = false;
  page.value = 1;
  
  // If there's an active search, re-run it without filters
  if (criteria.value.trim()) {
    await search(0);
  } else {
    searchResults.value = [];
    if (genre.value === null) {
      store.movies = [];
      await fetchPopularMovies();
    } else if (genre.value) {
      await fetchMoviesByGenre(genre.value);
    }
  }
};

const fetchSearchSuggestions = async (query) => {
  if (!query.trim() || query.length < 2) {
    searchSuggestions.value = [];
    showSuggestions.value = false;
    return;
  }

  try {
    const response = await axios.get("https://api.themoviedb.org/3/search/movie", {
      params: {
        api_key: "d2efec38e7d74d12122672897f241cbf",
        query: query,
        include_adult: false,
        page: 1,
      },
    });
    searchSuggestions.value = response.data.results.slice(0, 5);
    showSuggestions.value = true;
  } catch (error) {
    console.error("Error fetching search suggestions:", error);
  }
};

const handleSearchInput = () => {
  // Clear previous debounce timer
  if (debounceTimer.value) {
    clearTimeout(debounceTimer.value);
  }

  if (!criteria.value.trim()) {
    searchResults.value = [];
    searchSuggestions.value = [];
    showSuggestions.value = false;
    isSearchActive.value = false;
    page.value = 1;
    if (genre.value === null) {
      fetchPopularMovies();
    } else if (genre.value) {
      fetchMoviesByGenre(genre.value);
    }
    return;
  }

  // Debounce search suggestions
  debounceTimer.value = setTimeout(() => {
    fetchSearchSuggestions(criteria.value);
  }, 300);
};

const selectSuggestion = (movie) => {
  criteria.value = movie.title;
  showSuggestions.value = false;
  search(0);
};

const openModalFromSuggestion = (movie) => {
  showModal.value = true;
  selectedId.value = { id: movie.id, poster: movie.poster_path };
  showSuggestions.value = false;
};

const handleSearchFocus = () => {
  if (searchSuggestions.value.length > 0) {
    showSuggestions.value = true;
  }
};

const handleSearchBlur = () => {
  setTimeout(() => {
    showSuggestions.value = false;
  }, 200);
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const search = async (direction) => {
  if (!criteria.value.trim()) {
    searchResults.value = [];
    isSearchActive.value = false;
    if (genre.value === null) {
      await fetchPopularMovies();
    } else if (genre.value) {
      await fetchMoviesByGenre(genre.value);
    }
    return;
  }

  // Mark that a search is active
  isSearchActive.value = true;

  if (direction === 0) {
    page.value = 1;
  } else {
  page.value += direction;
    // Scroll to top when navigating pages
    scrollToTop();
  }

  let data = (
    await axios.get("https://api.themoviedb.org/3/search/movie", {
      params: {
        api_key: "d2efec38e7d74d12122672897f241cbf",
        query: criteria.value,
        include_adult: false,
        page: page.value,
      },
    })
  ).data;

  totalPages.value = data.total_pages;

  let results = data.results.map((movie) => {
    return {
      id: movie.id,
      title: movie.title,
      original_title: movie.original_title,
      release_date: movie.release_date,
      overview: movie.overview,
      poster: movie.poster_path,
    };
  });

  // Apply time filter to search results
  if (filtersApplied.value && timeFilter.value) {
    results = results.filter((movie) => {
      if (!movie.release_date) return false;
      const movieYear = new Date(movie.release_date).getFullYear();
      
      if (timeFilter.value === "this-year") {
        return movieYear === currentYear;
      } else if (timeFilter.value === "last-year") {
        return movieYear === currentYear - 1;
      } else if (timeFilter.value === "even-earlier") {
        return movieYear < currentYear - 1;
      }
      return true;
    });
  }

  searchResults.value = results;
};

// Load popular movies on mount
onMounted(async () => {
  if (!criteria.value && genre.value === null && store.movies.length === 0) {
    await fetchPopularMovies();
  }
});
</script>

<template>
  <div class="min-h-screen bg-netflix-black py-8">
    <div class="flex gap-3 lg:gap-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Sidebar for Genres -->
      <aside 
        :class="[
          'fixed lg:sticky top-20 left-0 h-[calc(100vh-5rem)] z-40 bg-netflix-dark/95 backdrop-blur-sm border-r border-gray-800/50 transition-transform duration-300 ease-in-out overflow-y-auto',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          'w-48 lg:w-40'
        ]"
      >
        <div class="p-3">
          <!-- Sidebar Header -->
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-sm font-bold text-netflix-red uppercase tracking-wider">Genres</h2>
            <button 
              @click="sidebarOpen = false"
              class="lg:hidden p-1.5 hover:bg-white/10 rounded transition-colors"
            >
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Genre List -->
          <ul class="space-y-1">
            <li 
              v-for="g in genres" 
              :key="g.id"
              @click="selectGenre(g.id, g.name)"
              :class="[
                'px-3 py-2 rounded-md cursor-pointer transition-all duration-200 text-sm',
                genre === g.id 
                  ? 'bg-netflix-red text-white font-semibold shadow-lg shadow-netflix-red/50' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              ]"
            >
              {{ g.name }}
            </li>
          </ul>
        </div>
      </aside>

      <!-- Overlay for mobile sidebar -->
      <div 
        v-if="sidebarOpen"
        @click="sidebarOpen = false"
        class="fixed inset-0 bg-black/50 z-30 lg:hidden"
      ></div>

      <!-- Main Content -->
      <div class="flex-1 min-w-0">
        <!-- Search and Filter Section -->
        <div class="mb-8">
          <div class="flex items-center gap-4 mb-4">
            <!-- Mobile Menu Button -->
            <button 
              @click="sidebarOpen = true"
              class="lg:hidden p-2 bg-netflix-dark border border-gray-700 rounded-lg hover:bg-netflix-red transition-colors"
            >
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <!-- Search Input -->
            <div class="flex-1 relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input 
                type="search" 
                v-model="criteria" 
                @keydown.enter="search(0); showSuggestions = false"
                @input="handleSearchInput"
                @focus="handleSearchFocus"
                @blur="handleSearchBlur"
                placeholder="Search movies..." 
                class="w-full pl-12 pr-4 py-3 bg-netflix-dark border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-netflix-red focus:border-transparent transition-all duration-200"
              />
              
              <!-- Search Suggestions Dropdown -->
              <div 
                v-if="showSuggestions && searchSuggestions.length > 0"
                class="absolute top-full left-0 right-0 mt-2 bg-netflix-dark border border-gray-700 rounded-lg shadow-2xl z-50 max-h-96 overflow-y-auto"
              >
                <div 
                  v-for="movie in searchSuggestions" 
                  :key="movie.id"
                  @click="openModalFromSuggestion(movie)"
                  class="p-3 hover:bg-netflix-red/20 cursor-pointer flex items-center gap-3 border-b border-gray-700 last:border-b-0 transition-colors"
                >
                  <img 
                    :src="movie.poster_path ? `https://image.tmdb.org/t/p/w92${movie.poster_path}` : 'https://via.placeholder.com/92x138?text=No+Image'"
                    :alt="movie.title"
                    class="w-12 h-16 object-cover rounded"
                  />
                  <div class="flex-1">
                    <p class="text-white font-semibold text-sm">{{ movie.title }}</p>
                    <p class="text-gray-400 text-xs">{{ movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A' }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Filter Toggle Button -->
            <button 
              @click="filtersOpen = !filtersOpen"
              :class="[
                'p-3 bg-netflix-dark border rounded-lg transition-colors relative',
                filtersApplied 
                  ? 'border-netflix-red bg-netflix-red/20' 
                  : 'border-gray-700 hover:bg-netflix-red'
              ]"
            >
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <!-- Filter indicator dot -->
              <span 
                v-if="filtersApplied"
                class="absolute top-1 right-1 w-2 h-2 bg-netflix-red rounded-full"
              ></span>
            </button>
          </div>

          <!-- Filter Panel -->
          <div 
            v-if="filtersOpen"
            class="bg-netflix-dark border border-gray-700 rounded-lg p-6 mb-4"
          >
            <div class="max-w-md">
              <!-- Time Filter -->
              <div>
                <label class="block text-sm font-semibold text-gray-300 mb-3">Time Period</label>
                <select 
                  v-model="timeFilter"
                  class="w-full px-4 py-3 bg-netflix-black border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-netflix-red focus:border-transparent transition-all duration-200"
                >
                  <option value="">All Time</option>
                  <option value="this-year">This Year ({{ currentYear }})</option>
                  <option value="last-year">Last Year ({{ currentYear - 1 }})</option>
                  <option value="even-earlier">Even Earlier</option>
  </select>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="mt-6 flex items-center justify-between gap-4">
              <button 
                @click="clearFilters"
                class="px-6 py-2 text-sm text-gray-400 hover:text-white transition-colors"
              >
                Clear Filter
              </button>
              <button 
                @click="applyFilters"
                class="btn-primary px-6 py-2 text-sm font-semibold"
              >
                Apply Filter
              </button>
            </div>
          </div>
        </div>

      <!-- Section Title -->
      <div v-if="!isSearchActive && (popularMovies.length || store.movies.length)" class="mb-6">
        <h2 class="text-2xl sm:text-3xl font-bold text-white">
          <span v-if="popularMovies.length">Popular Movies Right Now</span>
          <span v-else-if="store.movies.length">{{ selectedGenreName }} Movies</span>
        </h2>
      </div>

      <!-- Empty Search Results Message -->
      <div v-if="isSearchActive && !searchResults.length" class="text-center py-12">
        <p class="text-gray-400 text-lg mb-2">No movies found matching your search.</p>
        <p class="text-gray-500 text-sm">Try adjusting your search terms or filters.</p>
    </div>

      <!-- Movie Grid -->
      <div v-if="searchResults.length || !isSearchActive" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5 md:gap-6">
    <template v-if="searchResults.length">
          <div 
            v-for="movie in searchResults" 
            :key="movie.id"
            class="movie-card group"
            @click="openModal(movie)"
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
              <p class="text-gray-300 text-xs line-clamp-2">
                {{ movie.overview }}
              </p>
            </div>
          </div>
        </template>
        <template v-else-if="store.movies.length">
          <div 
            v-for="movie in store.movies" 
            :key="movie.id"
            class="movie-card group"
            @click="openModal(movie)"
          >
            <img 
              :src="movie.poster ? `https://image.tmdb.org/t/p/w500${movie.poster}` : 'https://via.placeholder.com/500x750?text=No+Image'"
              :alt="movie.title || 'Movie'"
              class="w-full h-full object-cover"
            />
            <div class="movie-overlay flex flex-col justify-end p-4">
              <h3 class="text-white font-bold text-sm sm:text-base mb-2 line-clamp-2">
                {{ movie.title || 'Movie' }}
              </h3>
              <p class="text-gray-300 text-xs line-clamp-2" v-if="movie.overview">
                {{ movie.overview }}
              </p>
            </div>
          </div>
    </template>
        <template v-else-if="popularMovies.length">
          <div 
            v-for="movie in popularMovies" 
            :key="movie.id"
            class="movie-card group"
            @click="openModal(movie)"
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
              <p class="text-gray-300 text-xs line-clamp-2">
                {{ movie.overview }}
              </p>
            </div>
          </div>
    </template>
      </div>

      <!-- Empty State (only when not searching) -->
      <div v-if="!isSearchActive && !searchResults.length && !store.movies.length && !popularMovies.length" class="text-center py-16">
        <svg class="mx-auto h-24 w-24 text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
        </svg>
        <p class="text-gray-400 text-lg">No movies found. Try searching or selecting a genre!</p>
      </div>

      <!-- Pagination (only show when search results exist) -->
      <div v-if="searchResults.length" class="flex items-center justify-center gap-4 mt-8 mb-8">
        <button 
          v-show="page > 1" 
          @click="search(-1)"
          class="btn-secondary px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="page <= 1"
        >
          ← Previous
        </button>
        <span class="text-white font-semibold text-lg px-4">
          Page {{ page }} of {{ totalPages }}
        </span>
        <button 
          v-show="page < totalPages" 
          @click="search(1)"
          class="btn-secondary px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="page >= totalPages"
        >
          Next →
        </button>
      </div>
      </div>
    </div>

    <!-- Modal -->
    <Modal v-if="showModal" @toggleModal="closeModal()" @openSimilarMovie="handleSimilarMovie" :value="selectedId" />
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
  box-shadow: 0 15px 20px -5px rgba(0, 0, 0, 0.5), 0 8px 8px -5px rgba(0, 0, 0, 0.2);
  z-index: 10;
}

.movie-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.movie-card:hover img {
  transform: scale(1.1);
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Sidebar scrollbar styling */
aside::-webkit-scrollbar {
  width: 6px;
}

aside::-webkit-scrollbar-track {
  background: #1F1F1F;
}

aside::-webkit-scrollbar-thumb {
  background: #E50914;
  border-radius: 3px;
}

aside::-webkit-scrollbar-thumb:hover {
  background: #B20710;
}
</style>
