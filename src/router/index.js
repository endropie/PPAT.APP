import Vue from 'vue'
import VueRouter from 'vue-router'

import routes from './routes'

Vue.use(VueRouter)

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation
 */

export default function ({ store, ssrContext }) {
  const Router = new VueRouter({
    scrollBehavior: () => ({ x: 0, y: 0 }),
    routes,

    // Leave these as is and change from quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE
  })

  // the subsequent Middleware function.
  function nextFactory (context, middleware, index) {
    const subsequentMiddleware = middleware[index]
    if (!subsequentMiddleware) return context.next

    return (...parameters) => {
      context.next(...parameters)
      const nextMiddleware = nextFactory(context, middleware, index + 1)
      subsequentMiddleware({ ...context, next: nextMiddleware })
    }
  }

  Router.beforeEach((to, from, next) => {
    if (to.meta) {
      store.commit('admin/setPageMeta', to.meta)
    }

    to.matched.forEach(Route => {
      if (Route.meta.middleware) {
        const middleware = Array.isArray(Route.meta.middleware)
          ? Route.meta.middleware
          : [Route.meta.middleware]

        const context = {
          store,
          from,
          next,
          to,
          Route,
          Router
        }
        const nextMiddleware = nextFactory(context, middleware, 1)

        return middleware[0]({ ...context, next: nextMiddleware })
      }
    })

    return next()
  })

  return Router
}
