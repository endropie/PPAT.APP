// import MixGlobal from '../mixins/mix-global'
import { Notify, date } from 'quasar'
import _lodash from 'lodash'
import moment from 'moment'
import Modal from '@/components/Modal'
import AdminMenuItem from '@/components/AdminMenuItem'
import AdminPanel from '@/components/AdminPanel'
import AdminMessage from '@/components/AdminMessage'
import AdminMessagePanel from '@/components/AdminMessagePanel'
import AdminContact from '@/components/AdminContact'
import AdminTabs from 'components/AdminTabs'
import AdminHeader from 'components/AdminHeader'

// leave the export, even if you don't use it
export default async ({ app, store, router, Vue }) => {
  Vue.component('modal', Modal)
  Vue.component('admin-panel', AdminPanel)
  Vue.component('admin-message', AdminMessage)
  Vue.component('admin-message-panel', AdminMessagePanel)
  Vue.component('admin-contact', AdminContact)
  Vue.component('AdminTabs', AdminTabs)
  Vue.component('admin-header', AdminHeader)
  Vue.component('admin-menu-item', AdminMenuItem)

  Vue.prototype.$_ = _lodash
  Vue.prototype.$app = {
    can: (v = null) => {
      console.warn('CAN', v, (v === null || (typeof v === 'string' && v === '') || (typeof v === 'object' && v.length === 0)) ? 'SKIP' : 'NEXT')
      if (v === null || (typeof v === 'string' && v === '') || (typeof v === 'object' && v.length === 0)) return true

      const UserPermiss = (store.getters['admin/USER'].permiss || [])
      let permiss = []

      if (typeof v === 'string' && v !== '') permiss = v.split('|')
      if (typeof v === 'object' && v.length > 0) permiss = v

      for (const i in permiss) {
        if (UserPermiss.some(x => x === permiss[i])) {
          return true
        }
      }

      console.warn('CAN', false, v)
      return false
    },
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
            icon: 'error',
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
              mode.message = (title || 'PROCESS NOT ALLOWED!')
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

          if (mode.detail) {
            mode.html = true
            mode.message += `<br><smal style="font-size:80%">${mode.detail}</small>`
          }
          if (mode.message) Notify.create(Object.assign({}, mode))
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
