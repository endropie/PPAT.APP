import { Dialog, Notify, date } from 'quasar'
import _lodash from 'lodash'
import moment from 'moment'

// leave the export, even if you don't use it
export default async ({ app, store, router, Vue }) => {
  Vue.prototype.$_ = _lodash
  Vue.prototype.$app = {
    can: (v = null) => {
      // console.warn('CAN', v, (v === null || (typeof v === 'string' && v === '') || (typeof v === 'object' && v.length === 0)) ? 'SKIP' : 'NEXT')
      if (v === null || (typeof v === 'string' && v === '') || (typeof v === 'object' && v.length === 0)) return true

      const UserPermiss = (store.getters['admin/USER'].permiss || [])
      let permiss = []

      if (typeof v === 'string' && v !== '') permiss = v.split(';')
      if (Array.isArray(v) && v.length > 0) permiss = v

      if (permiss.length > 0) {
        for (const i in permiss) {
          if (UserPermiss.some(x => x === permiss[i])) {
            return true
          }
        }

        // console.warn('CAN', false, v)
        return false
      }
      return true
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
          if (process.env.DEV) console.error('[PLAY] response errors!', ErrRes)

          let mode = {
            icon: 'error',
            color: 'negative',
            position: 'top-right',
            timeout: 3000
          }
          console.warn('errstatus', ErrRes.status)
          switch (ErrRes.status) {
            case 401:
              // mode.message = 'Ops, Authorization invalid!'
              // mode.title = (ErrRes.data.message || ErrRes.statusText)
              if (router.history.current.fullPath === '/auth') return false

              Dialog.create({
                title: (ErrRes.data.message || ErrRes.statusText),
                message: 'Ops, Authorization invalid! please to login again'
              }).onOk(() => {
                router.replace({
                  path: '/auth',
                  query: { redirect: router.history.current.fullPath }
                })
              })

              return false

            case 403:
              mode.message = 'Ops, Authorization forbidden!'
              mode.detail = (ErrRes.data.message || ErrRes.statusText)
              mode.color = 'warning'
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
              mode.message = (title || 'PROCESS NOT ALLOWED!')
              mode.detail = (ErrRes.data.message || ErrRes.statusText)
              break

            case 500:
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
      getMode: function (values, desc = null) {
        if (typeof values === 'string' || values instanceof String) values = { message: values, detail: desc }
        if (values.hasOwnProperty('detail') && values.detail) {
          values.message += `<BR><small style="display:block;line-height:90%">${values.detail}</small>`
          values.html = true
        }
        return Object.assign(this.prevent, values)
      },
      error: function (values = {}, desc) {
        Notify.create({ ...this.getMode(values, desc), color: 'red-10', icon: 'error' })
      },
      warning: function (values = {}, desc) {
        Notify.create({ ...this.getMode(values, desc), color: 'orange-7', icon: 'warning' })
      },
      info: function (values = {}, desc) {
        Notify.create({ ...this.getMode(values, desc), color: 'cyan-7', icon: 'info' })
      },
      success: function (values = {}, desc) {
        Notify.create({ ...this.getMode(values, desc), color: 'green-7', icon: 'check_circle' })
      }
    },
    number_format (number, decimals, decimator, separator, isABS = false) {
      var settings = {
        decimals: 2,
        decimator: ',',
        separator: '.'
      }

      if (isABS) number = Math.abs(number)

      let n = !isFinite(+number) ? 0 : +number,
        prec = !isFinite(+decimals) ? Math.abs(settings.decimals) : Math.abs(decimals),
        sep = (typeof separator === 'undefined') ? settings.separator : separator,
        dec = (typeof decimator === 'undefined') ? settings.decimator : decimator,
        toFixedFix = function (n, prec) {
          // Fix for IE parseFloat(0.55).toFixed(0) = 0;
          let k = Math.pow(10, prec)
          return Math.round(n * k) / k
        },
        s = (prec ? toFixedFix(n, prec) : Math.round(n)).toString().split('.')
      if (s[0].length > 3) {
        s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep)
      }
      if ((s[1] || '').length < prec && Number(decimals) > 0) {
        s[1] = s[1] || ''
        s[1] += new Array(prec - s[1].length + 1).join('0')
      }
      return s.join(dec)
    },
    date_format (date, format = undefined) {
      if (!date) return ''
      return moment(date).format(format || 'DD/MM/YYYY')
    },
    moment: moment,
    date: date
  }
}
