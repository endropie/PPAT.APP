import { colors, LocalStorage } from 'quasar'

export const setDrawer = (state, val) => {
  state.PAGE.drawer = val
}

export const setPageMeta = (state, meta) => {
  state.PAGEMETA = {
    title: '',
    hash: '',
    icon: '',
    iframeTabs: false,
    backRoute: '/admin',
    tabs: [],
    ...meta
  }
  // console.error('update->PAGEMETA', state.PAGEMETA, meta)
}

export const setLogin = (state, val) => {
  state.AUTH = Object.assign(state.AUTH, val)
  LocalStorage.set('store:auth', JSON.stringify(state.AUTH))
}

export const setLocked = (state) => {
  state.AUTH = Object.assign(state.AUTH, {access: null})
  LocalStorage.set('store:auth', JSON.stringify(state.AUTH))
}

export const setLogoff = (state) => {
  state.AUTH = {}
  LocalStorage.remove('store:auth')
}

export const setSetting = (state, values) => {
  state.SETTING = Object.assign(state.SETTING, values)
  LocalStorage.set('store:setting', JSON.stringify(state.SETTING))
}

export const setConfig = (state, values) => {
  state.CONFIG = Object.assign(state.CONFIG, values)
  LocalStorage.set('store:setting', JSON.stringify(state.CONFIG))
}

export const setTheme = (state, name) => {
  console.log('actions->setValue', state, colors)
  const newColor = state.THEMES[name]
  console.warn('state.LAYOUT', state.LAYOUT)
  state.LAYOUT.color = Object.assign(state.LAYOUT.color, newColor)
  const object = state.LAYOUT.color
  for (const i in object) {
    if (object.hasOwnProperty(i)) {
      const c = colors.getBrand(object[i]) || object[i]
      state.LAYOUT.color[i] = c
      colors.setBrand(i, c)
    }
  }
  // Save to storage
  LocalStorage.set('store:layout', JSON.stringify(state.LAYOUT))
}

export const setMode = (state, mode) => {
  if (typeof mode === 'boolean') {
    state.LAYOUT.isDark = mode
  }
  else {
    state.LAYOUT.isDark = !state.LAYOUT.isDark
  }
  // Save to storage
  LocalStorage.set('store:layout', JSON.stringify(state.LAYOUT))
}
