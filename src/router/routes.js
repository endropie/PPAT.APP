import RouteAdmin from './route-admin'

const routes = [
  {
    path: '/',
    component: () => import('pages/landing.vue')
  },
  {
    path: '/auth',
    component: () => import('pages/login.vue'),
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

RouteAdmin.forEach(link => {
  routes.push(link)
})

export default routes
