<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { isLoggedIn } from "../store/index";
import { auth } from '../firebase/index.js'
import { signInWithEmailAndPassword } from 'firebase/auth'
import netflixBg from '../assets/Netflix.webp'

const router = useRouter();
const email = ref("");
const password = ref("");
const data = ref(false);
const submitted = ref(false);

const login = () => {
  submitted.value = true;
  try {
    signInWithEmailAndPassword(auth, email.value, password.value).then(() => {
      data.value = true;
      router.push('/Movie');
      isLoggedIn.value = true;
    });
  } catch (e) {
    data.value = false;
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-netflix-black via-black to-netflix-black relative overflow-hidden">
    <!-- Background Image with Overlay -->
    <div 
      class="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
      :style="{ backgroundImage: `url(${netflixBg})` }"
    ></div>
    <div class="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/80"></div>

    <!-- Content -->
    <div class="relative z-10 w-full max-w-md px-6 py-12">
      <div class="bg-netflix-dark/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-gray-800">
        <!-- Logo -->
        <div class="text-center mb-8">
          <img 
            src="https://cdn-images-1.medium.com/max/1200/1*ty4NvNrGg4ReETxqU2N3Og.png" 
            alt="Netflix Movie Explorer"
            class="h-16 mx-auto mb-4"
          >
          <h1 class="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p class="text-gray-400">Unlimited movies, TV shows, and more.</p>
        </div>

        <!-- Form -->
        <form @submit.prevent="login()" class="space-y-6">
          <div>
            <input 
              type="email" 
              v-model="email" 
              placeholder="Email address"
              required
              class="w-full px-4 py-3 bg-netflix-black border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-netflix-red focus:border-transparent transition-all duration-200"
            />
          </div>
          <div>
            <input 
              type="password" 
              v-model="password" 
              placeholder="Password"
              required
              class="w-full px-4 py-3 bg-netflix-black border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-netflix-red focus:border-transparent transition-all duration-200"
            />
          </div>

          <!-- Error Message -->
          <div 
            v-if="submitted && !data && !isLoggedIn"
            class="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg text-sm"
          >
            Invalid email or password. Please try again.
          </div>

          <!-- Submit Button -->
          <button 
            type="submit"
            class="w-full btn-primary py-3 text-lg font-semibold"
          >
            Sign In
          </button>
        </form>

        <!-- Register Link -->
        <div class="mt-6 text-center">
          <p class="text-gray-400">
            New to Netflix Movie Explorer? 
            <router-link to="/Register" class="text-netflix-red hover:text-red-600 font-semibold transition-colors duration-200">
              Sign up now
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Additional custom styles if needed */
</style>