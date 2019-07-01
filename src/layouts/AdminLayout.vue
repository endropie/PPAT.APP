<template>
  <q-layout view="lhh Lpr lFf" :class="{'bg-grey-8': LAYOUT.isDark}">
    <q-header class="header" elevated>
      <q-toolbar color="primary" :class="{'bg-grey-10': LAYOUT.isDark}">
        <q-btn class="cordova-only electron-only" icon="arrow_back" aria-label="Go back" flat round dense v-go-back.single="PAGEMETA.backRoute" />
        <q-toolbar-title>
          <q-icon v-show="$route.meta.icon" style="font-size: 2rem; margin-right: 5px;" :name="$route.meta.icon" />
          {{ $route.meta.title }} -> L: {{LAYOUT.isDark}}
        </q-toolbar-title>
        
        <q-btn
          aria-label="Screen" class="within-iframe-hide"  flat round dense
          @click="$q.fullscreen.toggle()" :icon="$q.fullscreen.isActive ? 'fullscreen_exit' : 'fullscreen'"
        />
        <q-btn aria-label="Logout" class="within-iframe-hide" icon="power_settings_new" flat round dense @click="setLogout()" />
        <q-btn aria-label="Menu" class="within-iframe-hide" icon="menu" flat round dense @click="DRAWER = !DRAWER" />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="DRAWER"
      bordered
      content-class="bg-grey-2"
    >
    <q-scroll-area :class="LAYOUT.isDark ? 'bg-grey-10' : 'bg-grey-3'" style="width: 100%; height: 100%;">
        <div class="row flex-center " :class="LAYOUT.isDark ? 'bg-black' : 'bg-white'" style="height: 115px">
          <!-- <img alt="Quasar logo" src="~assets/quasar-logo.svg" style="height: 75px; width 75px;"> -->
          <q-icon name="widgets" class="text-h3" :color="LAYOUT.isDark ? 'white' : 'primary'" />
          <div class="caption q-ml-md" :class="LAYOUT.isDark ? 'text-white' : 'bg-white'">
            <!-- Quasar v{{ $q.version }} -->
            PPA Play <BR/>V-{{'1.0'}}
          </div>
        </div>
        <admin-menu></admin-menu>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <!-- <router-view /> -->
      <transition enter-active-class="animated bounceInLeft" leave-active-class="animated bounceOutLeft"
        appear :duration="400" @leave="resetScroll">
        <router-view />
      </transition>
      <q-page v-if="!PAGE.enable" >
        <q-inner-loading :visible="!PAGE.enable" :dark="LAYOUT.isDark">
          <q-spinner-dots size="70px" color="primary" />
        </q-inner-loading>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { openURL } from 'quasar'
import { mapState, mapActions } from 'vuex'
import MixPage from '@/mixins/mix-page.vue'
import AdminTabs from 'components/admin-tabs'
import AdminMenu from 'components/AdminMenu'

export default {
  name: 'AdminLayout',
  mixins: [MixPage],
  components: {
    AdminTabs,
    AdminMenu
  },
  data () {
    return {
      leftDrawerOpen: this.$q.platform.is.desktop
    }
  },
  created(){
    console.info('[PLAY] Admin created!')
    // console.log('localStorage', this.$q.localStorage.getAll())
    this.$axios.validToken(
      (response) => {
          this.setAdminStore(response)
      }
    )
  },
  computed: {
    title(){
      return this.$route.meta.title
    },
    DRAWER: {
      get () {
        return this.$store.state.admin.PAGE.drawer
      },
      set (val) {
        this.$store.commit('admin/setDrawer', val)
      }
    },
    ...mapState('admin', [
      'PAGEMETA',
      'AUTH'
    ])
  },
  methods: {
    openURL,
    ...mapActions( {
      // setValue: 'admin/setValue',
      // setAuthClear: 'admin/setLogoff',
    }),
    resetScroll (el, done) {
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
      done()
    },
    setLogout () {
      this.$axios.setHeader([
        {key: 'Accept', value: 'application/json'},
        {key: 'Authorization', value: null}
      ])
      this.$store.commit('admin/setLogoff');
      setTimeout(() => {
        this.$router.push('/')
      }, 500)
    }
  }
}
</script>
<style lang="stylus">
header.header 
  // background-image: linear-gradient(145deg, ()$primary 11%, ()$dark-primary 75%)
  background-image: linear-gradient(145deg, rgba(255,255,255,0) 10%,  rgba(0, 0, 0, 0.5) 90%)
aside.q-drawer
  background #fff0
</style>


