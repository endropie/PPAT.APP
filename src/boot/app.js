// import MixGlobal from '../mixins/mix-global'
import { Notify, date } from 'quasar'
import moment from 'moment'

function valueOfObject (obj, strprop) {
  // Property not found
  if (typeof obj === 'undefined') return

  // index of next Property split
  var _index = strprop.indexOf('.')

  // Property split found; recursive call
  if (_index > -1) {
    // get object at Property (before split), pass on remainder
    return valueOfObject(obj[strprop.substring(0, _index)], strprop.substr(_index + 1))
  }

  // no split; get Property
  return obj[strprop]
}

function setValueOfObject (obj, strprop, val) {
  // Property not found
  if (typeof obj === 'undefined') return
  if (typeof val === 'undefined') return

  // index of next Property split
  var _index = strprop.indexOf('.')

  // Property split found; recursive call
  if (_index > -1) {
    // get object at Property (before split), pass on remainder
    return setValueOfObject(obj[strprop.substring(0, _index)], strprop.substr(_index + 1), val)
  }

  // no split; set Property
  if (!obj.hasOwnProperty(strprop)) return
  obj[strprop] = val
  return obj[strprop]
}

// leave the export, even if you don't use it
export default ({ app, router, Vue }) => {
  let application = {
    // config: {
    //   get: function (strprop) {
    //     return valueOfObject(app.store.state.admin.CONFIG, strprop)
    //   },
    //   set: function (strprop, val) {
    //     const value = setValueOfObject(app.store.state.admin.CONFIG, strprop, val)
    //     if (value === val) {
    //       app.store.commit('admin/setConfig')
    //       return value
    //     }
    //     return undefined
    //   }
    // },
    // setting: {
    //   get: function (strprop) {
    //     return valueOfObject(app.store.state.admin.SETTING, strprop)
    //   },
    //   set: function (strprop, val) {
    //     const value = setValueOfObject(app.store.state.admin.SETTING, strprop, val)
    //     if (value === val) {
    //       app.store.commit('admin/setSetting')
    //       return value
    //     }
    //     return undefined
    //   }
    // },
    response: {
      error: function (ErrRes, title = null) {
        if (!ErrRes) {
          Notify.create({
            message: 'Resource connection failed!',
            detail: 'Please contact administrator!',
            position: 'top-left',
            type: 'negative'
          })
        }
        else {
          let mode = {
            type: 'negative',
            position: 'top-right',
            timeout: 3000
          }
          switch (ErrRes.status) {
            case 401:
              mode.message = 'Ops, Authorization invalid!'
              mode.detail = (ErrRes.data.message || ErrRes.statusText)
              break
            case 404:
              mode.message = 'Ops, Data resource not found!'
              mode.detail = (ErrRes.data.message || ErrRes.statusText)
              mode.type = 'warning'
              break
            case 422:
              mode.message = 'The fields was not failed!'
              mode.detail = (ErrRes.data.message || ErrRes.statusText)
              break
            case 501:
              console.error(ErrRes)
              mode.message = (title.title || title || 'PROCESS NOT ALLOWED!')
              mode.detail = (ErrRes.data.message || ErrRes.statusText)
              break
            case 500:
              console.error(ErrRes)
              mode.message = 'Ops, Please contact administrator!'
              mode.detail = (ErrRes.data.message || ErrRes.statusText)
              break
            default:
              if (ErrRes.data) {
                mode.message = (ErrRes.data.message || ErrRes.statusText)
              }
              else mode.message = ErrRes.statusText
              break
          }

          if (mode.type !== false) Notify.create(Object.assign({}, mode))
        }
      }
    },
    notify: {
      prevent: {
        message: 'Application Notify',
        detail: 'The description detail of notification.',
        type: 'negative',
        position: 'top-right',
        timeout: 3000
      },
      error: function (values = {}, description = null) {
        const mode = {type: 'negative'}
        if (typeof values === 'string' || values instanceof String) {
          values = {message: values, detail: description}
        }

        Notify.create(Object.assign(this.prevent, mode, values))
      },
      warning: function (values = {}, description = null) {
        const mode = {type: 'warning'}
        if (typeof values === 'string' || values instanceof String) {
          values = {message: values, detail: description}
        }

        Notify.create(Object.assign(this.prevent, mode, values))
      },
      info: function (values = {}, description = null) {
        const mode = {type: 'info'}
        if (typeof values === 'string' || values instanceof String) {
          values = {message: values, detail: description}
        }

        Notify.create(Object.assign(this.prevent, mode, values))
      },
      success: function (values = {}, description = null) {
        const mode = {type: 'positive'}
        if (typeof values === 'string' || values instanceof String) {
          values = {message: values, detail: description}
        }

        Notify.create(Object.assign(this.prevent, mode, values))
      }
    },

    moment: moment,
    date: date
  }

  Vue.prototype.$app = application
}
