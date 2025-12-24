import { firestore } from "../firebase/index";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { defineStore } from 'pinia'
import axios from 'axios';
import { ref } from 'vue';

export const useStore = defineStore('store', {
  state: () => {
    return {
      movies: [],
      cart: new Map(),
      inventory: new Map(),
      watchlist: new Map(),
      watchProgress: new Map(), // Track watch progress: { movieId: { progress: 0-100, lastWatched: timestamp } }
    }
  },
  actions: {
    async populateFirestore() {
      const genres = new Map([[28, "Action"], [10751, "Family"], [878, "Science Fiction"], [12, "Adventure"], [14, "Fantasy"]]);

      genres.forEach(async (value, key) => {
        let data = (await axios.get("https://api.themoviedb.org/3/discover/movie", {
          params: {
            api_key: "d2efec38e7d74d12122672897f241cbf",
            with_genres: key,
            include_adult: false,
          }
        })).data.results;
        data = data.map((movie) => {
          return {
            id: movie.id,
            poster: movie.poster_path,
          }
        });
        await setDoc(doc(firestore, "Genre", value), { data });
      });
    },
    
    async getMovies(genre) {
      this.movies = (await getDoc(doc(firestore, "Genre", genre))).data().data;
    },

    addToCart(id, data) {
      // Check if movie is already in inventory
      if (this.inventory.has(id)) {
        return false; // Cannot add to cart if already in inventory
      }
      this.cart.set(id, data);
      return true;
    },

    removeFromCart(id) {
      this.cart.delete(id);
    },

    completePurchase() {
      // Move all cart items to inventory
      this.cart.forEach((movie, id) => {
        this.inventory.set(id, movie);
      });
      // Clear cart after purchase
      this.cart.clear();
    },

    removeFromInventory(id) {
      this.inventory.delete(id);
    },

    isInInventory(id) {
      return this.inventory.has(id);
    },

    addToWatchlist(id, data) {
      this.watchlist.set(id, data);
    },

    removeFromWatchlist(id) {
      this.watchlist.delete(id);
    },

    isInWatchlist(id) {
      return this.watchlist.has(id);
    },

    updateWatchProgress(id, progress) {
      // progress is 0-100
      this.watchProgress.set(id, {
        progress: Math.min(100, Math.max(0, progress)),
        lastWatched: new Date().toISOString(),
      });
    },

    getWatchProgress(id) {
      return this.watchProgress.get(id) || { progress: 0, lastWatched: null };
    },

    markAsWatched(id) {
      this.watchProgress.set(id, {
        progress: 100,
        lastWatched: new Date().toISOString(),
      });
    },

    resetWatchProgress(id) {
      this.watchProgress.delete(id);
    }
  }
});

export const isLoggedIn = ref(false);