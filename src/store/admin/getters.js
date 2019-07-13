import { date } from 'quasar'

export const CONFIG = (state, getters) => state.CONFIG

export const AUTH = (state, getters) => {
  return {
    isTokenValid: () => {
      if (!state.AUTH.hasOwnProperty('access')) return false
      return state.AUTH && state.AUTH.access.token && !getters.isTokenExpired
    },
    isTokenExpired: () => {
      if (state.AUTH.access.expires_in) {
        return getters.numTokenExpired >= Number(state.AUTH.access.expires_in)
      } else return undefined
    },
    numTokenExpired: () => {
      if (state.AUTH.access.login_at && state.AUTH.access.login_at instanceof Date) {
        return date.getDateDiff(new Date(), new Date(state.AUTH.access.login_at), 'second')
      } else return undefined
    },
    ...state.AUTH
  }
}

export const LAYOUT = (state) => {
  const themes = []
  for (const i in state.THEMES) {
    if (state.THEMES.hasOwnProperty(i)) {
      themes.push(i)
    }
  }
  return {
    themes: themes,
    ...state.LAYOUT
  }
}
