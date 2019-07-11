<template>
  <div class="index-table column full-width" 
    v-bind="$attrs"
    v-on="$listeners"
  >
    <div class="full-width q-gutter-x-sm">
      <div class="float-right">
        <q-btn 
          flat round dense 
          color="light" 
          icon="more_vert"
          v-if="!hideMenu"
        >
          <q-menu :content-class="{'bg-faded text-light':LAYOUT.isDark}">
            <slot name="menu" >
              <q-list :dark="LAYOUT.isDark" class="table-menu" style="min-width: 150px">
                <q-item v-if="PREFERENCE" clickable>
                  <q-item-section>Preferences</q-item-section>
                  <q-item-section side>
                    <q-icon name="keyboard_arrow_right" />
                  </q-item-section>
                  <q-menu anchor="top right" self="top left">
                    <q-list>
                      <q-item
                        v-for="n in 3"
                        :key="n"
                        dense
                        clickable
                      >
                        <q-item-section>Submenu Label</q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-item>
                <q-separator :dark="LAYOUT.isDark"/>
                <slot name="menu-item" />
              </q-list>
            </slot>
          </q-menu>
        </q-btn>
      </div>
      <div class="float-left no-margin">
        <div v-if="title" class="text-h6">
          {{title}}
        </div>
        <div v-if="subtitle" class="text-caption  text-light">{{subtitle}}</div>
      </div>
      <div class="float-right" :class="{'full-width': $q.screen.lt.sm}" v-if="!hideSearch">
        <q-input 
          class="table-filter" 
          v-model="model.filter" 
          v-if="filter !== undefined"
          :dark="LAYOUT.isDark" 
          outlined dense 
          autocomplete="off" 
          placeholder="Search..." 
        >
          <template v-slot:append>
            <q-icon name="search" color="light" dense />
          </template>
        </q-input>

      </div>
    </div>
    <div class="full-width">  
      <slot></slot>
    </div>
  </div>
  
</template>

<script>

export default {
  name: 'table-header',
  inheritAttrs: false,
  props:{
      hideSearch: Boolean,
      hideMenu: Boolean,
      filter: String,
      columns: Array,
      title: {
          type: String,
          default: null
      },
      subtitle: {
          type: String,
          default: null
      }
  },
  data () {
    return {
      model:  { 
        filter: this.$attrs.filter || ''
      },
    }
  },
  mounted() {
    // console.warn('MOUNTED', this)
  },
  computed: {
    PREFERENCE () {
      return Boolean (this.columns) 
    },
    LAYOUT () {
      return this.$store.state.admin.LAYOUT
    },
  },
  watch:{
    'model.filter' : 'setFilter'
  },
  methods: {
    setFilter(v) {
      this.$emit('update:filter', v)
    },
  }
}
</script>

<style lang="stylus">
.table-filter.q-field.q-field--dense
  .q-field__control, .q-field__marginal, .q-icon
    height 36px
  .q-field__control:before
    border-color rgba(0,0,0,0)
</style>

