import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Play from '../views/Play.vue'
import Search from '../views/Search.vue'

import store from '@/store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/play/:name',
    name: 'Play',
    component: Play
  },
  {
    path: '/search/:term',
    name: 'Search',
    component: Search
  },
  {
    path: '/all',
    name: 'All',
    component: () => import(/* webpackChunkName: "all" */ '../views/All.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue')
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.name !== 'Login' && !store.state.user) {
    fetch('/api/auth/user')
      .then(res => {
        if (res.status !== 200) {
          throw Error('Could not log in')
        } else {
          return res
        }
      })
      .then(res => res.json())
      .then(user => {
        if (user) {
          store.commit('login', user)
          next()
        } else {
          next({ name: 'Login', query: { redirect: to.path } })
        }
      })
      .catch(_ => {
        next({ name: 'Login', query: { redirect: to.path } })
      })
  } else {
    next()
  }
})

export default router
