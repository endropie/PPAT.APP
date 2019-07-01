<template>
  <q-page padding class="page-admin">
    <div class="admin-top text-center">
      <p class="caption">
       <!-- No caption -->
      </p>
    </div>
    <div class="row justify-center">
      <div style="width: 850px; max-width: 90vw;" class="row">
        <div v-for="(page, index) in menus" :key="index" class="col-xs-6 col-sm-4 col-lg-3">
          <div class="card text-center menu-link text-primary" @click="show(page, page.path)">
            <q-icon :name="page.icon ? page.icon : `star`" />
            <p class="caption" :class="{'text-blue-grey-4 text-bold': LAYOUT.isDark}">{{ page.name }}</p>
          </div>
        </div>
      </div>
    </div>

    <q-page-sticky v-show="page" position="bottom-right" :offset="[18, 18]">
      <q-btn round color="secondary" @click="page = false" class="animate-pop">
        <q-icon name="keyboard_backspace" />
      </q-btn>
    </q-page-sticky>
  </q-page>
</template>

<script>
import MixPage from '@/mixins/mix-page.vue'
import AdminMenus from '@/assets/admin-menus'

export default {
  mixins:[MixPage],
  data () {
    return {
      page: false,
      path: ''
    }
  },
  created() {
    console.log('DESKTOP!!', this.menus)
  },
  computed: {
    menus () {
      return this.page || AdminMenus
    }
  },
  methods: {
    show (link) {
      if (link.children) {
        this.page = link.children.map((item) => {
          item.prefix = link.prefix ?  link.prefix + '/' + link.path : link.path
          return item
        })
        return
      }
      this.$router.push(`/admin/` + (link.prefix ? link.prefix + '/' + link.path : link.path) )
    }
  }
}
</script>

<style lang="stylus">

.page-admin
  img
    width 100px
    height 100px
    margin-bottom 15px
  .admin-top
    margin-bottom 35px
    .q-alert
      max-width 500px
  .card
    cursor pointer
    position relative
    padding 16px
    .q-icon
      font-size 56px
    p
      color rgba(0, 0, 0, .87)
      margin 15px 0 0 0 !important
    &:before
      content ''
      position absolute
      top 0
      right 0
      bottom 0
      left 0
      border-radius 2px
      opacity 0
      transition opacity .2s
      background currentColor
    &:hover:before
      opacity .4
</style>
