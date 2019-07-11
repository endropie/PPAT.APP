<script>
import axios from 'axios'
import GlobalMix from './mix-global.vue'
import MixPage from '@/mixins/mix-page.vue'
import MixSheet from '@/mixins/mix-sheet.vue'
import { Script } from 'vm';

export default {
  mixins: [GlobalMix, MixPage, MixSheet],
  data () {
    return {
      VIEW: {
        // show: false,
        // loading: false,
        title: () => this.VIEW__Title,
        subtitle: () => this.VIEW__Subtitle,
        onLoad: (callback) => this.VIEW__onLoad(callback),
        onCatch: (errors, title) => this.VIEW__onCatch(errors, title),
        toIndex: () => this.VIEW__toIndex(),
        delete: () => this.VIEW__delete(),
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
    console.info('[PLAY] MIX-VIEW is Mounted!')
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
    VIEW__onLoad (callback) {
      if (typeof callback !== 'function') console.warn('*[PLAY]* - callback is function required')

      const callBase = () => {
        const apiUrl = this.VIEW.resource.api + '/' + this.$route.params.id + this.VIEW.resource.params

        this.$axios.get(apiUrl)
          .then((response) => {
            this.VIEW.data = JSON.parse(JSON.stringify(response.data))
            callback(response.data)
          })
          .catch(error => {
            console.warn(error, 'Load Form')
            this.$app.response.error(error.response, 'Load Form')
          })
      }

      this.SHEET.request(
        callBase()
      )
    },
    VIEW__onLoaded (callback) { // Call Run axios.all(this.VIEW.options) && paraemeter callback
      let requests = []
      for (const i in this.VIEW.options) {
        if (this.VIEW.options.hasOwnProperty(i)) {
          requests.push(
            axios.get(this.VIEW.options[i].api)
              .then(response => { this.VIEW.options[i].data = response.data })
          )
        }
      }

      axios.all(requests).then(() => {
        return callback
      })
    },

    VIEW__onCatch (ErrorResponse, title) { // Handle Catch error of Axios
      this.$app.response.error(error.response, title)
    },

    

    VIEW__delete () {
      this.$q.dialog({
        title: 'Delete Confirm',
        message: 'Are you sure to delete the record ?',
        preventClose: true,
        ok: 'Yes, please!',
        cancel: 'Cancel'
      }).onOk(() => {
        this.$axios.delete(`${this.VIEW.resource.api}/${this.$route.params.id}`)
          .then((response) => {
            // console.warn(response)
            if (response.data.success) {
              let txtMessage = 'The data has been deleted!'
              this.$q.notify({message: txtMessage, color: 'positive', icon: 'check', position: 'top-right', timeout: 3000})

              this.VIEW__toIndex()
            }
          })
          .catch(error => {
            this.$app.response.error(error.response, 'Deleting Invalid!')
          })
      })
    },

    VIEW__toIndex () { // Back history page with 1 step
      if (!this.VIEW.resource.uri) {
        console.warn('Property "VIEW.resource.uri" is not undefined!')
        return
      }

      setTimeout(() => {
        this.$router.replace(this.VIEW.resource.uri)
      }, 500)
    },

    VIEW__back () { // Back history page with 1 step
      // history.back(-1)
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
