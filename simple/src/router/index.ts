import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: () => import('../views/Login.vue') },
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

export default router