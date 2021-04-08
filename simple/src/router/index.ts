import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

import { adminAccount } from '../common/config'

const routes: Array<RouteRecordRaw> = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: () => import('../views/Login.vue') },
  { path: '/signin/:id', component: () => import('../views/Signin.vue') },
  { 
    path: '/main', 
    component: () => import('../views/Main.vue'),
    children: [
      { 
        path: 'create',
        meta: { keepAlive: true },
        component: () => import('../views/Create.vue')
      },
      { 
        path: 'history',
        component: () => import('../views/History.vue')
      },
      { 
        path: 'show',
        component: () => import('../views/Show.vue')
      }
    ] 
  },
  
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  
  if (to.path.includes('/signin')) {
    next()
    return
  }

  if (to.path != '/' && to.path != '/login') {
    if (adminAccount.value === '') {
      router.push('/login')
    }
    
  }

  next()
})


export default router