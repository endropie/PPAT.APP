<script>
import { setTimeout } from 'timers';
export default {
  data () {
    return {
      SHEET: {
        request: (callbacks) => this.SHEET__REQUEST(callbacks),
        assign: (options) => this.SHEET__ASSIGN(options),
        load: (option, params) => this.SHEET__LOAD(option, params),
        default: () => {
          return {
            api : null,
            autoload: true,
            loading: false,
            params: '',
            data: []
          }
        }
      },

    }
  },
  methods: {
    SHEET__ASSIGN (options) {
      if (typeof options === 'undefined') options = JSON.parse(JSON.stringify(this.SHEET))

      for (const i in options) {
        if (options.hasOwnProperty(i)) {
          if(typeof this.SHEET[i] === 'function') {
            console.error('[PLAY] SHEET assign "'+ i +'" invalid!')
          }
          else {
            this.SHEET[i] = Object.assign( this.SHEET.default(), options[i])
          }
        }
      }
      this.SHEET__REQUEST()
    },
    SHEET__GETURI (option, newOption = {}) {
      let saparator = '?',
          { api, params } = option

      if(newOption.api) api = String(newOption.api)
      if(newOption.params) params = String(newOption.params)
      
      if(api.indexOf('?') !== -1) {
        saparator = '&' 
      }

      return api + saparator + params
      
    },
    SHEET__LOAD (i, newOption) {
      if (this.SHEET.hasOwnProperty(i) && typeof this.SHEET[i] !== 'function') {

        if (typeof newOption === 'string') {
          newOption = {api: null, params: newOption}
        }

        const uri = this.SHEET__GETURI(this.SHEET[i], newOption)
        console.log('SHEET__LOAD->uri = ', uri)
        this.SHEET[i].loading = true
        this.SHEET[i].data = []
        this.$axios.get(uri)
          .then(response => { 
            this.SHEET[i].data = response.data 
          })
          .catch(error => {
            this.$app.response.error(error.response)
          })
          .finally(() => {
            setTimeout(() => { this.SHEET[i].loading = false }, 1000)
          })
      }
    },
    SHEET__REQUEST (callbacks = null) {
      let requests = []
      for (const i in this.SHEET) {
        if (this.SHEET.hasOwnProperty(i)) {
          if (typeof this.SHEET[i] !== 'function' && this.SHEET[i].autoload === true && this.SHEET[i].api != null ) {
            const uri = this.SHEET__GETURI(this.SHEET[i])
            requests.push(
              this.$axios.get(this.SHEET[i].api)
                .then(response => { 
                  // console.log('SHEET__REQUEST->data = ', response.data)
                  this.SHEET[i].data = response.data 
                })
            )
          }
        }
      }
      this.$axios.all(requests)
        .then((x) => {
          const call = (f) => {
            if (typeof f === 'function') return f()
            else if (typeof f === 'undefined') return f
          }

          if (callbacks !== null) callbacks()
            
        })
        .catch(error => {
          this.$app.response.error(error.response, 'ERROR Get Option')
        })
        
    }
  }
}

</script>