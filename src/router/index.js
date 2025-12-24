import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/Login.vue";
import Home from "../views/HomeView.vue";
import Movie from "../views/Movie.vue";
import Cart from "../views/Cart.vue";
import LoginHome from "../views/LoginHome.vue";
import Register from "../views/Register.vue";
import Inventory from "../views/Inventory.vue";
import Watchlist from "../views/Watchlist.vue";

const routes = [
  {
    path: '/',
    component:Home,
  },
  {
    path: '/Register',
    component: Register,
  },
  {
    path: '/Login',
    component:Login,
  },
  {
    path: '/Movie',
    component: Movie,
  },
  {
    path: '/Cart',
    component: Cart,
  },
  {
    path: '/LoginHome',
    component: LoginHome,
  },
  {
    path: '/Inventory',
    component: Inventory,
  },
  {
    path: '/Watchlist',
    component: Watchlist,
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;