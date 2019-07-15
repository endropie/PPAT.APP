import AdminMenus from 'assets/admin-menus'
import AdminLayout from 'layouts/AdminLayout'
// import access from '@/router/middleware/access'

let AdminPages = []

function setUrl (base, link) {
  link = (link !== '/') ? ('/' + link) : ''
  return base + link
}

function parseMenuNode (node, __path) {
  const prefix = setUrl(__path, node.path)

  if (node.children !== void 0) {
    node.children.forEach(node => parseMenuNode(node, prefix))
  } else if (node.tabs !== void 0) {
    node.tabs.forEach(tab => {
      const hash = setUrl(prefix, tab.path)
      if (tab.resources !== void 0) {
        tab.resources.forEach(tabres => {
          const hashres = setUrl(hash, tabres.path)
          // console.warn('hash', hash, hashres, `@/pages/${hash.substring(1)}/${tabres.page}`)
          AdminPages.push({
            path: hashres,
            meta: {
              title: tab.name,
              icon: tab.icon,
              hash: prefix,
              tabs: node.tabs || [],
              iframeTabs: node.iframeTabs,
              ...tabres.meta
            },
            component: () => import(`@/pages/${hash.substring(1)}/${tabres.page}`)
          })
        })
      } else {
        AdminPages.push({
          path: hash,
          meta: {
            title: tab.name,
            icon: tab.icon,
            hash: prefix,
            tabs: node.tabs || [],
            iframeTabs: node.iframeTabs,
            ...tab.meta
          },
          component: () => import(`@/pages/${prefix.substring(1)}/${tab.path}`)
        })
      }
    })

    const redir = setUrl(prefix, node.first || node.tabs[0].path)
    AdminPages.push({
      path: prefix,
      redirect: redir
    })
  } else if (node.resources !== void 0) {
    node.resources.forEach(res => {
      const hash = prefix + (res.path ? ('/' + res.path) : '')
      AdminPages.push({
        path: hash,
        meta: {
          title: node.name,
          icon: node.icon,
          hash: hash,
          ...res.meta
        },
        component: () => import(`@/pages/${prefix.substring(1)}/${res.page}`)
      })
    })
  } else {
    // let file = `@/pages/${prefix.substring(1)}`
    // if (node.file) file = node.file
    // console.error(`@/pages/${prefix.substring(1)}`)
    // console.warn(file)

    AdminPages.push({
      path: prefix,
      meta: {
        title: node.name,
        icon: node.icon,
        tabs: node.tabs || [],
        hash: prefix
      },
      // component: () => import(`${file}`)
      component: () => import(`@/pages/${prefix.substring(1)}`)
    })
  }
}

AdminMenus.forEach(node => {
  parseMenuNode(node, '/admin')
})

const routes = [
  {
    path: '/admin',
    redirect: '/admin/desktop'
  },
  {
    path: '/admin',
    component: AdminLayout,
    meta: {
      authenticated: true
    },
    children: [
      ...AdminPages,
      {
        path: '/admin/403',
        component: () => import('pages/admin/error403.vue')
      },
      {
        path: '/admin/*',
        component: () => import('pages/admin/error404.vue')
      }
    ]
  }
]

export default routes
