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
    SIDETAB: {
      get () {
        return this.$store.state.admin.PAGE.sideTab
      },
      set (val) {
        this.$store.commit('admin/SetSideTab', val)

      }
    },
    LEFTDRAWER: {
      get () {
        return this.$store.state.admin.PAGE.leftDrawer
      },
      set (val) {
        this.$store.commit('admin/SetLeftDrawer', val)
      }
    },
    RIGHTDRAWER: {
      get () {
        return this.$store.state.admin.PAGE.rightDrawer
      },
      set (val) {
        this.$store.commit('admin/SetRightDrawer', val)
      }
    },
    SHOW: {
      get () {
        // console.warn('GET SHOW ->')
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
    setLoginStore (response) {
      if (response && response.data.valid === true) {
        this.$axios.setHeader([
          {key: 'Accept', value: 'application/json'},
          {key: 'Authorization', value: `Bearer ${response.data.access.token}`}
        ])

        this.$store.commit('admin/setLogin', {
          auth: {
            token: response.data.access.token,
            login_in: response.data.access.expires_in,
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
