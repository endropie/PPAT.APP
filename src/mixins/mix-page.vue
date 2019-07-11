<script>import { mapGetters } from 'vuex'
import '@/css/app.styl'

export default {
  data () {
    return {
      // code...
    }
  },
  created () {
    // this.SHOW = this.$store.admin.page.show
    // console.info('[PLAY] MIX-TABLE is Created!')
  },
  computed: {
    title() {
      return this.$route.meta.title || ''
    },
    DRAWER: {
      get () {
        return this.$store.state.admin.PAGE.drawer
      },
      set (val) {
        this.$store.commit('admin/setPageDrawer', val)
      }
    },
    SHOW: {
      get () {
        return this.$store.state.admin.PAGE.show
      },
      set (val) {
        this.$store.commit('admin/setPageShow', val)
      }
    },
    ...mapGetters('admin', ['LAYOUT'])
  },
  methods: {
    directToAdmin () {
      setTimeout(() => {
        this.$router.push('/admin')
      }, 100)
    },
    directToLogin () {
      setTimeout(() => {
        this.$router.push('/auth')
      }, 100)
    },
    setAdminStore (response) {
      if (response.data && response.data.valid === true) {
        this.$axios.setHeader([
          {key: 'Accept', value: 'application/json'},
          {key: 'Authorization', value: `Bearer ${response.data.access.token}`}
        ])

        this.$store.commit('admin/setLogin', {
          access: {
            token: response.data.access.token,
            expires_in: response.data.access.token,
            login_at: new Date()
          },
          user: {
            permiss: response.data.user.all_permission,
            name: response.data.user.name,
            email: response.data.user.email,
            id: response.data.user.id
          }
        })

        this.$store.commit('admin/setSetting', response.data.settings)
      }
      else {
        this.$axios.setHeader([
          {key: 'Accept', value: 'application/json'},
          {key: 'Authorization', value: null}
        ])
        this.$store.commit('admin/setLocked')
        this.directToLogin()
      }
    }
  }
}
</script>
