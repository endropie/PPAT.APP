
export default function access ({store, next, to}) {
  // console.warn('app', store.state.admin.AUTH)
  if (!store.state.admin.AUTH.hasOwnProperty('access') || !store.state.admin.AUTH.access.token) {
    return next({
      path: '/auth',
      query: { redirect: to.fullPath }
    })
  }
  return next()
}
