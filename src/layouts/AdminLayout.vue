<template>
  <q-layout view="lhh Lpr lFf" :class="LAYOUT.isDark ? 'bg-grey-10 text-white' : 'bg-white text-dark'">
    <q-header class="header" elevated>
      <admin-header :class="LAYOUT.isDark ? ' ': ''" />
    </q-header>

    <q-drawer
      v-model="DRAWER"
      bordered
      content-class="bg-grey-2"
    >
      <q-scroll-area :class="LAYOUT.isDark ? 'bg-black text-primary' : 'bg-white text-primary'" style="width: 100%; height: 100%;">
        <div class="row flex-center opacity-1" :class="LAYOUT.isDark ? 'bg-primary text-white' : 'bg-grey-2 text-primary'" style="height: 115px">
          <!-- <img alt="Quasar logo" src="~assets/quasar-logo.svg" style="height: 75px; width 75px;"> -->
          <q-icon name="widgets" class="text-h3" />
          <div class="caption q-ml-md">
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
      <q-page v-if="!SHOW" >
        <q-inner-loading :showing="!SHOW" :dark="LAYOUT.isDark">
          <q-spinner-facebook  size="70px" color="primary" />
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
import AdminHeader from 'components/AdminHeader'

export default {
  mixins: [MixPage],
  components: {
    AdminTabs,
    AdminMenu,
    AdminHeader,
  },
  data () {
    return {
      // data..
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

  .q-toolbar
    height 50px
aside.q-drawer
  background #fff0
</style>


