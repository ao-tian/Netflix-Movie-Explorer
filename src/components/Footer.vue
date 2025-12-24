<template>
  <footer class="bg-netflix-black border-t border-gray-800 mt-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- About Section -->
        <div>
          <h2 class="text-2xl font-bold text-netflix-red mb-4">About Us</h2>
          <p class="text-gray-400 leading-relaxed">
            Netflix Movie Explorer is your gateway to discovering and exploring movies from around the world.
          </p>
        </div>

        <!-- Contact Section -->
        <div>
          <h2 class="text-2xl font-bold text-netflix-red mb-4">Contact</h2>
          <p class="text-gray-400 mb-2">
            <span class="text-white font-semibold">Questions?</span>
          </p>
          <p class="text-gray-400">
            Call <a href="tel:1-437-972-2432" class="text-netflix-red hover:text-red-600 transition-colors duration-200">1-437-972-2432</a>
          </p>
        </div>
      </div>

      <!-- Copyright -->
      <div class="mt-8 pt-8 border-t border-gray-800 text-center">
        <p class="text-gray-400">
          © {{ new Date().getFullYear() }} Netflix Movie Explorer. All rights reserved.
        </p>
        <p class="text-gray-500 text-sm mt-2">
          This project is for educational purposes only. Not affiliated with Netflix.
        </p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
/* Additional custom styles if needed */
</style>