// import MixGlobal from '../mixins/mix-global'
import { Notify, date } from 'quasar'
import moment from 'moment'
import Modal from '@/components/Modal'
// leave the export, even if you don't use it
export default ({ app, router, Vue }) => {
  // Vue.component('component-a', { /* ... */ })
  // Vue.component('component-b', { /* ... */ })

  Vue.component('modal', Modal)

  Vue.prototype.$app = {
    response: {
      error: function (ErrRes, title = null) {
        if (!ErrRes) {
          Notify.create({
            message: 'Resource connection failed!',
            detail: 'Please contact administrator!',
            position: 'top-left',
            type: 'negative'
          })
        } else {
          let mode = {
            color: 'negative',
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
              mode.color = 'warning'
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
              } else mode.message = ErrRes.statusText
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
        const mode = { color: 'negative' }
        if (typeof values === 'string' || values instanceof String) {
          values = { message: values, detail: description }
        }

        Notify.create(Object.assign(this.prevent, mode, values))
      },
      warning: function (values = {}, description = null) {
        const mode = { color: 'warning' }
        if (typeof values === 'string' || values instanceof String) {
          values = { message: values, detail: description }
        }

        Notify.create(Object.assign(this.prevent, mode, values))
      },
      info: function (values = {}, description = null) {
        const mode = { color: 'info' }
        if (typeof values === 'string' || values instanceof String) {
          values = { message: values, detail: description }
        }

        Notify.create(Object.assign(this.prevent, mode, values))
      },
      success: function (values = {}, description = null) {
        const mode = { color: 'positive' }
        if (typeof values === 'string' || values instanceof String) {
          values = { message: values, detail: description }
        }

        Notify.create(Object.assign(this.prevent, mode, values))
      }
    },

    moment: moment,
    date: date
  }
}
