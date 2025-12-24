import { createApp } from 'vue'
import App from './App.vue'
import router from "./router/index.js";
import { createPinia } from 'pinia';
import './assets/main.css'

const pinia = createPinia();

createApp(App).use(router).use(pinia).mount('#app');