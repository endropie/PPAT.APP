<script>
import axios from 'axios'
// import GlobalMix from './mix-global.vue'
import MixPage from '@/mixins/mix-page.vue'
import MixSheet from '@/mixins/mix-sheet.vue'
import { Script } from 'vm';
import { type } from 'os';
import showVue from '../pages/admin/common/items/show.vue';

export default {
  mixins: [MixPage, MixSheet],
  data () {
    return {
      VIEW: {
        show: false,
        loading: false,
        title: () => this.VIEW__Title,
        subtitle: () => this.VIEW__Subtitle,
        load: (callback) => this.VIEW__load(callback),
        onCatch: (errors, title) => this.VIEW__onCatch(errors, title),
        toIndex: () => this.VIEW__toIndex(),
        delete: () => this.VIEW__delete(),
        void: (callback) => this.VIEW__void(callback),
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
    // console.info('[PLAY] MIX-VIEW is Mounted!')
  },
  computed: {
    VIEW__Title () {
      return (this.$route.meta.title || 'VIEW').toUpperCase()
    },
    VIEW__Subtitle () {
      const stringID = (this.$route.params.id ? '#' + this.$route.params.id : '')
      return 'Data ' + stringID
    }
  },
  methods: {
    VIEW__load (callback) {
      if (typeof callback !== 'function') console.warn('*[PLAY]* - callback is function required')
      this.VIEW.show = false
      this.VIEW.loading = true

      const callBase = () => {
        const apiUrl = this.VIEW.resource.api + '/' + this.$route.params.id + this.VIEW.resource.params

        this.$axios.get(apiUrl)
          .then((response) => {
            this.VIEW.data = JSON.parse(JSON.stringify(response.data))
            if(typeof callback === 'function' ) {
              if(callback) callback(response.data)
              setTimeout(() => this.VIEW.show = true, 500);
            }
          })
          .catch(error => {
            if(!error.response) error.response = {}
            this.$router.replace({
              path: '/admin/error',
              query: {
                // api: apiUrl,
                redirect: this.$route.fullPath,
                code: error.response.status || null,
                message: error.response.statusText ||null
              },
            })

            if(callback) callback()
          })
          .finally(() => {
            setTimeout(() => this.VIEW.loading = false)
          })
      }

      this.SHEET.request(
        callBase()
      )
    },

    VIEW__onCatch (ErrorResponse, title) { // Handle Catch error of Axios
      this.$app.response.error(error.response, title)
    },

    VIEW__void (callback) {
      this.$q.dialog({
        title: 'Void',
        message: this.$tc('messages.to_sure', 1,{v:'void'}),
        preventClose: true,
        ok: this.$tc('messages.yes_to', 1,{v:this.$tc('label.continue')}),
        cancel: this.$tc('form.cancel')
      }).onOk(() => {

        this.$axios.delete(`${this.VIEW.resource.api}/${this.$route.params.id}?mode=void`)
          .then((response) => {
            if (response.data.success) {
              this.$app.notify.success({
                message: this.$tc('messages.success', 1, 'VOID').toUpperCase(),
                detail: this.$tc('messages.form_has_void', 1, {v: `[code: #${this.$route.params.id}]`}),
              })

              if(typeof callback === 'function') {
                callback()
              }
            }
          })
          .catch(error => {
            this.$app.response.error(error.response)
            if(typeof callback === 'function') {
              callback()
            }
          })
      })
    },

    VIEW__delete () {
      this.$q.dialog({
        title: 'Delete',
        message: this.$tc('messages.to_sure', 1,{v:this.$tc('form.delete',2)}),
        preventClose: true,
        ok: this.$tc('messages.yes_to', 1,{v:this.$tc('form.delete')}),
        cancel: this.$tc('form.cancel')
      }).onOk(() => {
        this.$axios.delete(`${this.VIEW.resource.api}/${this.$route.params.id}`)
          .then((response) => {
            // console.warn(response)
            if (response.data.success) {
              this.$app.notify.success({
                message: this.$tc('messages.success_deleted'),
                detail: this.$tc('messages.form_has_deleted', 1, {v: `[code:#${this.$route.params.id}]`}),
              })
              this.VIEW__toIndex()
            }
          })
          .catch(error => {
            this.$app.response.error(error.response, 'Deleting Invalid!')
          })
      })
    },

    VIEW__toIndex () {
      if (!this.VIEW.resource.uri) {
        console.warn('Property "VIEW.resource.uri" is not undefined!')
        return
      }

      setTimeout(() => {
        this.$router.replace(this.VIEW.resource.uri)
      }, 500)
    },

    VIEW__back () {
      this.$router.go(-1)
    }
  }
}
</script>


<style lang="stylus">
.top-table
  .q-table thead tr
    height: 30px
  .q-table thead th
    font-size 16px
    background: rgba(125, 125, 125, 0.12)
  .q-table tbody td
    font-size 16px
    font-weight 500

.main-table
  .q-table thead tr
    height: 40px
  .q-table th, .q-table td
    height: unset
    padding: 10px 12px
</style>
