<script>
// import axios from 'axios'
import GlobalMix from './mix-global.vue'
import MixPage from '@/mixins/mix-page.vue'
import MixSheet from '@/mixins/mix-sheet.vue'

import SelectFilter from '@/components/SelectFilter'
// import VueAutonumeric from '@/components/VueAutonumeric'
// import QNumeric from '@/components/QNumeric'

import '@/css/form-page.styl'

export default {
  mixins: [GlobalMix, MixPage, MixSheet],
  components: {
    SelectFilter
    // VueAutonumeric,
    // QNumeric
  },
  data () {
    return {
      SHEET: {},
      FORM: {
        // show: false,
        loading: false,
        data: {},
        title: () => this.FORM__Title,
        subtitle: () => this.FORM__Subtitle,
        toIndex: () => this.FORM__toIndex(),
        toBack: () => this.FORM__toBack(),
        toView: (id) => this.FORM__toView(id),
        meta: () => this.FORM__meta(),
        onLoad: (callback) => this.FORM__onLoad(callback),
        delete: () => this.FORM__delete(),
        response: {
          relationship: (values) => this.FORM__response_relationship(values),
          fields: (ErrRes = {}, form) => this.FORM__response_fields(ErrRes, form),
          error: (ErrRes = {}, title = '') => this.FORM__response_error(ErrRes, title),
          success: (values) => this.FORM__response_success(values),
        },
        options: {},
        has_relationship: [],
        resource: {
          api: null,
          uri: null,
          params: ''
        }
      }
    }
  },
  mounted () {
    // console.info('[PLAY] MIX-FORM is Mounted!')
  },
  computed: {
    FORM__Title () {
      const title = (this.$route.meta.title || '').toUpperCase()
      if (this.$route.meta.mode === 'revision') {
        return 'REVISION - ' + title
      }
      else return 'FORM - ' + title
    },
    FORM__Subtitle () {
      if (this.$route.meta.mode === 'edit') {
        return 'Update data #' + this.$route.params.id
      }
      else if (this.$route.meta.mode === 'revision') {
        return 'Correction from #' + this.$route.params.id
      }
      else return 'Create new  ' + (this.$route.meta.title || '').toLowerCase()
    }
  },
  methods: {
    FORM__onLoad (callback) {
      if (typeof callback !== 'function') console.warn('*[PLAY]* - callback is function required')

      const callBase = () => {
        if (['edit', 'revision'].find(x => x === this.$route.meta.mode)) {
          let url = this.FORM.resource.api + '/' + this.$route.params.id + this.FORM.resource.params
          this.$axios.get(url)
            .then((response) => {
              this.FORM.data = JSON.parse(JSON.stringify(response.data))
              callback(response.data)
            })
            .catch(error => {
              console.warn(error, 'Load Form')
              this.$app.response.error(error.response, 'Load Form')
            })
        }
        else {
          const data = this.setDefault()
          this.FORM.data = JSON.parse(JSON.stringify(data))
          callback(data)
        }
      }
      
      this.SHEET.assign()
      this.SHEET.request(
        callBase()
      )
    },

    FORM__meta () { // Return Properties for axios set(POST, PATCH, PUT)
      let status = 'create',
        method = 'POST',
        apiUrl = this.FORM.resource.api

      if (this.$route.meta.mode === 'edit') {
        status = 'update'
        method = 'PUT'
        apiUrl += `/${this.$route.params.id}`
      }

      return {
        method: method,
        status: status,
        apiUrl: apiUrl
      }
    },

    FORM__change(data, rsForm) {
        if(typeof data === 'undefined') data = this.FORM.data
        if(typeof rsForm === 'undefined') rsForm = this.rsForm
        const  isEquivalent= (a, b) => {
            // Create arrays of property names
            var aProps = Object.getOwnPropertyNames(a);
            var bProps = Object.getOwnPropertyNames(b);

            // If number of properties is different,
            // objects are not equivalent
            if (aProps.length != bProps.length) {
                return false;
            }

            for (var i = 0; i < aProps.length; i++) {
                var propName = aProps[i];

                // If values of same property are not equal,
                // objects are not equivalent
                if (a[propName] !== b[propName]) {
                    return false;
                }
            }

            // If we made it this far, objects
            // are considered equivalent
            return true;
        }

        return isEquivalent(data, rsForm)
    },

    FORM__response_fields (ErrRes, form = null) {
      if (ErrRes.hasOwnProperty('status') && ErrRes.status === 422) {
        if (this.hasOwnProperty('$validator') && ErrRes.data.hasOwnProperty('errors')) {
          this.$validator.errors.clear()
          const ErrorFields = ErrRes.data.errors
          const scope = form ? {scope: form} : {}

          for (const field in ErrorFields) {
            if (ErrorFields.hasOwnProperty(field)) {
              const basefield = Object.assign({field: field, msg: ErrorFields[field][0]}, scope)
              this.$validator.errors.add(basefield)
            }
          }
        }
      }
    },

    FORM__response_error (ErrRes, title) { 
      this.$app.response.error(ErrRes, {'title': title})
    },

    FORM__response_relationship (dialog = {}) {
      if(!dialog) {
        this.$app.notify.warning({message: 'This data form has been relationship'})
      }
      else {
        if(dialog.messages) {
          let messages = []
          for (const key in dialog.messages) {
            if (dialog.messages.hasOwnProperty(key)) {
              messages.push(key)
            }
          }
          dialog.messages = "The data was relationships with: \n" + messages.join("\n")
        }
        this.$q.dialog({
          title: dialog.title || 'The data was Related',
          message: dialog.messages || dialog.message || '',
          preventClose: true,
          stackLabel: true,
          color: 'orange',
          icon: 'warning',
          ok: {
            label: 'Direct to Detail Page',
            color: 'warning'
          },
          cancel: 'Continue'
        }).then(() => {
          if (dialog.hasOwnProperty('then')) {
            dialog.then()
          }
        }).catch(() => {
          if (dialog.hasOwnProperty('catch')) {
            dialog.catch()
          }
          else this.$q.notify({message:`The form is not allowed to be changed!`, type:'warning'})
          
        })
      }
    },

    FORM__response_success (params = {}) {
      let txtMessage = (params.mode || this.$route.meta.mode || 'SUBMIT').toUpperCase() + ' SUCCESS'
      let txtDetail  = (params.message || 'The processing has excecute!')
      
      this.$app.notify.success({message: txtMessage, detail: txtDetail})
    },

    FORM__delete () {
      this.$q.dialog({
        title: 'Delete Confirm',
        message: 'Are you sure to delete the record ?',
        preventClose: true,
        ok: 'Yes, please!',
        cancel: 'Cancel'
      }).then(() => {
        this.$axios.delete(`${this.FORM.resource.api}/${this.$route.params.id}`)
          .then((response) => {
            // console.warn(response)
            if (response.data.success) {
              let txtMessage = 'The record has been deleted!'
              this.$q.notify({message: txtMessage, color: 'positive', icon: 'check', position: 'top-right', timeout: 3000})
              this.FORM__toIndex()
            }
          })
          .catch(error => {
            if (error.hasOwnProperty('response')) {
              console.error(error.response)
            }
            else console.error(error)
          })
      })
        .catch(() => {})
    },

    FORM__toIndex () { // Back history page with 1 step
      if (!this.FORM.resource.uri) {
        console.warn('[] WARNING - Property "FORM.resource.uri" is not undefined!')
        return
      }

      setTimeout(() => {
        this.$router.push(this.FORM.resource.uri)
      }, 500)
    },

    FORM__toView (id) { // Back history page with 1 step
      if (!this.FORM.resource.uri) {
        console.warn('[] WARNING - Property "FORM.resource.uri" is not undefined!')
        return
      }

      setTimeout(() => {
        this.$router.push(`${this.FORM.resource.uri}/${id}`)
      }, 500)
    },

    FORM__toBack () { // Back history page with 1 step
      if (!this.FORM.resource.uri) {
        console.warn('[] WARNING - Property "FORM.resource.uri" is not undefined!')
        return
      }

      setTimeout(() => {
        this.$router.push(this.FORM.resource.uri + '?return')
      }, 500)
    },

    selectfilter (val, update, abort, p) {
      console.log(p)
      if (val.length < 2) {
        abort()
        return
      }

      update(() => {
        const needle = val.toLowerCase()
        this.options = this.options.filter(v => v.toLowerCase().indexOf(needle) > -1)
      })
    }
  }
}

</script>
