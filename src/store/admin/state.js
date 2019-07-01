import { colors, LocalStorage } from 'quasar'
import config from '@/assets/app-config'

function getData () {
  const layout = Object.assign({}, JSON.parse(LocalStorage.getItem('store:layout')))
  if (layout.hasOwnProperty('color')) {
    for (const i in layout.color) {
      if (layout.color.hasOwnProperty(i)) {
        const c = colors.getBrand(layout.color[i]) || layout.color[i]
        colors.setBrand(i, c)
      }
    }
  }

  return layout
}

export default {
  PAGE: {
    enable: true,
    drawer: true
  },
  LAYOUT: {
    isDark: false,
    color: {

    },
    ...getData()
  },
  THEMES: {
    indigo: {
      primary: '#3f51b5',
      secondary: '#3044a3',
      tertiary: '#2b3c91',
      info: '#31ccec',
      warning: '#f2c037',
      negative: '#db2828'
    },
    pink: {
      primary: '#e91e63',
      secondary: '#ca0b4c',
      tertiary: '#ae0840',
      info: '#31ccec',
      warning: '#f2c037',
      negative: '#db2828'
    },
    green: {
      primary: '#26a69a',
      secondary: '#1f8279',
      tertiary: '#196861',
      info: '#31ccec',
      warning: '#f2c037',
      negative: '#db2828'
    },
    yellow: {
      primary: '#e0cb0f',
      secondary: '#938719',
      tertiary: '#766c14',
      info: '#31ccec',
      warning: '#f2c037',
      negative: '#db2828'
    },
    red: {
      primary: '#f44336',
      secondary: '#a51b11',
      tertiary: '#8d2018',
      info: '#31ccec',
      warning: '#f2c037',
      negative: '#db2828'
    },
    orange: {
      primary: '#d88100',
      secondary: '#d28513',
      tertiary: '#a36406',
      info: '#31ccec',
      warning: '#f2c037',
      negative: '#db2828'
    },
    purple: {
      primary: '#9c27b0',
      secondary: '#7f218f',
      tertiary: '#64066a',
      info: '#31ccec',
      warning: '#f2c037',
      negative: '#db2828'
    },
    blue: {
      primary: '#2196f3',
      secondary: '#156fb6',
      tertiary: '#0b5493',
      info: '#31ccec',
      warning: '#f2c037',
      negative: '#db2828'
    },
    cyan: {
      primary: '#00bcd4',
      secondary: '#0c8797',
      tertiary: '#046774',
      info: '#31ccec',
      warning: '#f2c037',
      negative: '#db2828'
    },
    lime: {
      primary: '#cddc39',
      secondary: '#8f9924',
      tertiary: '#6c7415',
      info: '#31ccec',
      warning: '#f2c037',
      negative: '#db2828'
    },
    brown: {
      primary: '#8c5743',
      secondary: '#5b3122',
      tertiary: '#430e06',
      info: '#31ccec',
      warning: '#f2c037',
      negative: '#db2828'
    }
  },
  AUTH: Object.assign({}, JSON.parse(LocalStorage.getItem('store:auth'))),
  CONFIG: Object.assign({}, config, JSON.parse(LocalStorage.getItem('store:config'))),
  SETTING: Object.assign({}, JSON.parse(LocalStorage.getItem('store:setting'))),
  PAGEMETA: {}
}
