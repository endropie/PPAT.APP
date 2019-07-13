<template>
  <div class="form-header column">
    <div class="header-top">
      <div class="header-menu row justify-end float-right">
        
        <slot name="menu-prepend"></slot>
        <q-btn round flat icon="more_vert" v-if="!hideMenu">
          <q-menu :content-class="{'bg-faded text-light':LAYOUT.isDark}">
            <slot name="menu" >
              <q-list  :dark="LAYOUT.isDark" class="table-menu" style="min-width: 150px">
                <slot name="menu-item" />
                
              </q-list>
            </slot>
          </q-menu>
        </q-btn>
        <slot name="menu-append"></slot>
      </div>
      <div class="header-title">
        <div class="text-h6">{{ title }}</div>
        <div class="text-subtitle-2 text-faded text-weight-light">{{ subtitle }}</div>
      </div>

    </div>
    <div class="header-main"> 
      <slot />
    </div>
  </div>
</template>

<script>

export default {
  name: 'table-header',
  inheritAttrs: false,
  props:{
      'hide-menu': Boolean,
      'title': {
          type: String,
          default: null
      },
      'subtitle': {
          type: String,
          default: null
      }
  },
  computed: {
    LAYOUT () {
      return this.$store.state.admin.LAYOUT
    },
  },
}
</script>

<style lang="stylus">
.form-header
  min-height 40px
</style>


