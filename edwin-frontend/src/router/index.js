import Vue from 'vue'
import VueRouter from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import Profile from '../views/Profile.vue'
import Team from '../views/Team.vue'
import Login from '../views/Login.vue'

Vue.use(VueRouter)

const routes = [
  {
    meta: {title: 'Dashboard'},
    path: '/',
    name: 'dashboard',
    component: Dashboard
  },
  {
    meta: {title: 'Profile'},
    path: '/profile',
    name: 'profile',
    component: Profile
  },
  {
    meta: {title: 'Admin Groups'},
    path: '/team',
    name: 'team',
    component: Team
  },
  {
    meta: {title: 'Login'},
    path: '/login',
    name: 'login',
    component: Login
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
