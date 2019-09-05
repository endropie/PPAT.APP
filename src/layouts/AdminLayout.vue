<template>
  <q-layout view="lHh LpR lFf" :class="LAYOUT.isDark ? 'bg-grey-10 text-white' : 'bg-white text-dark'">
    <q-header class="header print-hide" elevated>

      <q-toolbar color="primary" >
        <q-btn v-if="!NODRAWER"
          icon="menu" flat round dense
          aria-label="Menu" class="within-iframe-hide"
          @click="LEFTDRAWER = !LEFTDRAWER" />
        <q-btn v-else
          icon="mdi-arrow-left" flat round dense
          aria-label="Menu" class="within-iframe-hide"
          @click.native="$router.go(-1)" />
        <q-separator inset vertical spaced color="white" />
        <q-btn class="cordova-only electron-only" icon="arrow_back" aria-label="Go back" flat rounded dense v-go-back.single="PAGEMETA.backRoute" />
        <q-toolbar-title class="q-px-xs">
          <!-- <q-avatar v-show="$route.meta.icon" :icon="$route.meta.icon" size="24px"  color="red" /> -->
          <q-icon v-show="$route.meta.icon" style="font-size:larger; margin-right: 5px;" :name="$route.meta.icon" />
          <span class="text-uppercase text-weight-reguler q-mx-sm" v-text="$route.meta.title" />
        </q-toolbar-title>
        <admin-header :class="LAYOUT.isDark ? ' ': ''" />
        <!-- <q-btn v-show="false" aria-label="Menu" class="within-iframe-hide" icon="assignment" flat round dense @click="RIGHTDRAWER = !RIGHTDRAWER" /> -->

      </q-toolbar>
    </q-header>

    <q-drawer class="print-hide" bordered
      content-class="bg-grey-2"
      v-model="LEFTDRAWER"
      v-if="!NODRAWER">
      <q-scroll-area :class="LAYOUT.isDark ? 'bg-black text-primary' : 'bg-white text-primary'" style="width: 100%; height: 100%;">
        <div class="row flex-center opacity-1" :class="LAYOUT.isDark ? 'bg-primary text-white' : 'bg-grey-2 text-primary'" style="height: 115px">
          <!-- <img alt="Quasar logo" src="~assets/quasar-logo.svg" style="height: 75px; width 75px;"> -->
          <q-icon name="widgets" class="text-h3" />
          <div class="caption q-ml-md">
            <!-- Quasar v{{ $q.version }} -->
            PPA Play <BR/>V-{{'1.0'}}
          </div>
        </div>
        <q-list class="menu">
          <template v-for="(node, index) in DataMenu">
            <admin-menu-item :node="node" :isIndent="false" :prefix="`/admin/${node.path}`" :key="index" :dark="LAYOUT.isDark"/>
          </template>
        </q-list>
      </q-scroll-area>
    </q-drawer>
    <q-drawer class="hidden print-hide " side="right"
      content-class="bg-lime-2"
      v-model="RIGHTDRAWER"
      :width="300" bordered
      v-if="!NODRAWER" >
    </q-drawer>

    <q-page-container>
      <transition enter-active-class="animated fadeInLeft" leave-active-class="animated fadeInRight"
        :duration="1500" @leave="resetScroll">
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
import DataMenu from "@/assets/data-menu"
import { type } from 'os';

export default {
  mixins: [MixPage],
  data () {
    return {
      DataMenu,
      PANELTAB:'messages'
    }
  },
  created() {
    this.$axios.validToken(
      (response) => {
        // if(process.env.DEV) console.warn('$axios.validToken', (typeof response).toUpperCase(), response)
        if(response.status === 401) {
          this.setLogoff()
        }
      }
    )
  },
  computed: {
    ...mapState('admin', [
      'NOW',
      'PAGEMETA',
      'AUTH',
      'USER'
    ]),
    NODRAWER() {
      return ['view','print','edit','create'].some(x => x === this.$route.meta.mode)
    }
  },
  methods: {
    openURL,
    ...mapActions( {
      setTime: 'admin/TIMESTART'
    }),
    resetScroll (el, done) {
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
      done()
    },
    setLogoff () {
      this.$axios.setHeader([
        {key: 'Accept', value: 'application/json'},
        {key: 'Authorization', value: null}
      ])
      this.$store.commit('admin/setLogoff');
      setTimeout(() => {
        this.$router.push('/auth')
      }, 500)
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
    // height 50px
aside.q-drawer
  background #fff0

@media print
  .q-loading-bar
    display none
</style>


