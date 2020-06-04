import Vue from 'vue'
import VueRouter from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import Profile from '../views/Profile.vue'
import Team from '../views/Team.vue'
import Home from '../views/Home.vue'
import { authGuard } from "../auth"

Vue.use(VueRouter)

const routes = [
  
  {
    meta: {title: 'Home'},
    path: '/',
    name: 'home',
    component: Home
  },
  {
    meta: {title: 'Dashboard'},
    path: '/Dashboard',
    name: 'dashboard',
    component: Dashboard,
    beforeEnter: authGuard
  },
  {
    meta: {title: 'Profile'},
    path: '/profile',
    name: 'profile',
    component: Profile,
    beforeEnter: authGuard
  },
  {
    meta: {title: 'Admin'},
    path: '/team',
    name: 'team',
    component: Team,
    beforeEnter: authGuard
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.afterEach((to) => {
  Vue.nextTick( () => {
    document.title = to.meta.title ? to.meta.title : 'default title';
  });
})

export default router
