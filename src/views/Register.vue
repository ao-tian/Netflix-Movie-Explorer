<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { auth } from "../firebase/index";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { isLoggedIn } from "../store/index";
import netflixBg from '../assets/Netflix.webp'

const router = useRouter();
const pass = ref(false);
const pass2 = ref(true);
const errorMessage = ref("");
const username = ref("");
const email = ref("");
const password1 = ref("");
const password2 = ref("");

const registerUserByEmail = async () => {
  // Reset states
  pass.value = false;
  pass2.value = true;
  errorMessage.value = "";

  // Trim whitespace from inputs
  const trimmedPassword1 = password1.value.trim();
  const trimmedPassword2 = password2.value.trim();
  const trimmedEmail = email.value.trim();

  // Check if passwords match
  if (trimmedPassword1 !== trimmedPassword2) {
    pass.value = true;
    pass2.value = true;
    errorMessage.value = "Passwords do not match. Please try again.";
    return;
  }

  // Validate password length
  if (trimmedPassword1.length < 6) {
    pass.value = true;
    pass2.value = true;
    errorMessage.value = "Password must be at least 6 characters long.";
    return;
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmedEmail)) {
    pass.value = true;
    pass2.value = true;
    errorMessage.value = "Please enter a valid email address.";
    return;
  }

  try {
    await createUserWithEmailAndPassword(auth, trimmedEmail, trimmedPassword1);
    // Registration successful
    pass.value = true;
    pass2.value = false;
    isLoggedIn.value = true;
    
    // Redirect after a short delay to show success message
    setTimeout(() => {
      router.push("/Movie");
    }, 1500);
  } catch (error) {
    // Registration failed - show specific error message
    pass.value = true;
    pass2.value = true;
    
    // Handle specific Firebase errors
    switch (error.code) {
      case "auth/email-already-in-use":
        errorMessage.value = "This email is already registered. Please sign in instead.";
        break;
      case "auth/invalid-email":
        errorMessage.value = "Invalid email address. Please check and try again.";
        break;
      case "auth/weak-password":
        errorMessage.value = "Password is too weak. Please choose a stronger password.";
        break;
      case "auth/operation-not-allowed":
        errorMessage.value = "Email/password accounts are not enabled. Please contact support.";
        break;
      default:
        errorMessage.value = error.message || "Registration failed. Please try again.";
    }
    console.error("Registration error:", error);
  }
};

const registerUserByGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
    isLoggedIn.value = true;
    router.push("/Movie");
  } catch (error) {
    console.error("Google sign-in error:", error);
  }
};
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
          <h1 class="text-3xl font-bold text-white mb-2">Create Account</h1>
          <p class="text-gray-400">Join us to explore unlimited movies and TV shows.</p>
        </div>

        <!-- Google Sign Up -->
        <div class="mb-6">
          <button 
            @click="registerUserByGoogle"
            class="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-black font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign up with Google
          </button>
        </div>

        <!-- Divider -->
        <div class="relative mb-6">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-700"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-4 bg-netflix-dark text-gray-400">Or register with email</span>
          </div>
        </div>

        <!-- Email Registration Form -->
        <form @submit.prevent="registerUserByEmail()" class="space-y-4">
          <div>
            <input 
              v-model="username" 
              type="text" 
              placeholder="Username"
              required
              class="w-full px-4 py-3 bg-netflix-black border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-netflix-red focus:border-transparent transition-all duration-200"
            />
          </div>
          <div>
            <input 
              v-model="email" 
              type="email" 
              placeholder="Email address"
              required
              class="w-full px-4 py-3 bg-netflix-black border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-netflix-red focus:border-transparent transition-all duration-200"
            />
          </div>
          <div>
            <input 
              v-model="password1" 
              type="password" 
              placeholder="Password"
              required
              class="w-full px-4 py-3 bg-netflix-black border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-netflix-red focus:border-transparent transition-all duration-200"
            />
          </div>
          <div>
            <input 
              v-model="password2" 
              type="password" 
              placeholder="Confirm password"
              required
              class="w-full px-4 py-3 bg-netflix-black border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-netflix-red focus:border-transparent transition-all duration-200"
            />
          </div>

          <!-- Success/Error Messages -->
          <div 
            v-if="pass && !pass2"
            class="bg-green-900/50 border border-green-700 text-green-200 px-4 py-3 rounded-lg text-sm"
          >
            Registration successful! Redirecting...
          </div>
          <div 
            v-if="pass && pass2 && errorMessage"
            class="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg text-sm"
          >
            {{ errorMessage }}
          </div>

          <!-- Submit Button -->
          <button 
            type="submit"
            class="w-full btn-primary py-3 text-lg font-semibold"
          >
            Create Account
          </button>
        </form>

        <!-- Login Link -->
        <div class="mt-6 text-center">
          <p class="text-gray-400">
            Already have an account? 
            <router-link to="/Login" class="text-netflix-red hover:text-red-600 font-semibold transition-colors duration-200">
              Sign in
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
