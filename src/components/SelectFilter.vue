<template>
  <q-select
    ref="select-filter"
    v-model="value"
    v-bind="$attrs"
    v-on="$listeners"
    @filter="filterFunc"
    :options="opt"
    :hide-selected="hideSelected"
    :use-input="useInput"
    :fill-input="fillInput"
    :emit-value="emitValue"
    :map-options="mapOptions"
    autocomplete="off">
    <!-- :options="this.selfFilter ? this.options : this.$attrs.options" -->
    <!-- @filter="(v, f, c) => { this.selfFilter ? filterFn(v, f, c) : $emit('filter', v, f, c) }" -->
    <template v-slot:option="scope">
      <q-item
        v-bind="scope.itemProps"
        v-on="scope.itemEvents"
      >
        <q-item-section avatar v-if="scope.opt.icon">
          <q-icon :name="scope.opt.icon" />
        </q-item-section>
        <q-item-section>
          <q-item-label v-html="scope.opt.label" />
          <q-item-label caption>{{ scope.opt.sublabel }}</q-item-label>
        </q-item-section>
      </q-item>
    </template>
    <template v-slot:no-option>
      <q-item>
        <q-item-section class="text-grey">
          No results
        </q-item-section>
      </q-item>
    </template>
    <template v-slot:selected-item="scope">
      <slot name="selected-item" :scope="scope">
      </slot>
    </template>
    
    <template v-slot:default>
      <slot></slot>
    </template>
  </q-select>
  
</template>
<script>

export default {
  name: 'select-filter',
  inheritAttrs: false,
  props: {
    selfFilter: {type: Boolean, default: true },
    useInput: {type: Boolean, default: true },
    fillInput: {type: Boolean, default: true },
    emitValue: {type: Boolean, default: true },
    mapOptions: {type: Boolean, default: true },
    hideSelected: {type: Boolean, default: false },
  },
  data () {
    return {
      value:  this.$attrs.value || null,
      options: this.$attrs.options || [] // this.$attrs.options
    }
  },
  mounted() {
    // console.warn('MOUNTED', this)
  },
  watch:{
    '$attrs.value': 'setValue',
    '$attrs.options': 'setOptions',
  },
  methods: {
    setValue(v) {
      // console.warn('SET VALUE', this.$attrs.value)
      this.value = v
    },
    setOptions(v) {
      // console.warn('SET OPTIONS', this.$attrs.options)
      this.options = v
    },
    // use this default filter function
    filterFn (val, update) {
      if (!this.selfFilter) {
        this.$emit('filter', v, u, a)
        return
      }

      update(() => {
        const needle = val.toLowerCase()
        this.options = this.$attrs.options.filter(v => {
          if(!v.hasOwnProperty('sublabel')) v.sublabel = ''
          return v.label.toLowerCase().includes(needle) || v.sublabel.toLowerCase().includes(needle)
        })
      })
    },
    filterFunc (v, u, a) {
      this.selfFilter ? this.filterFn(v, u) : this.$emit('filter', v, u, a)
    }
  },
  computed: {
    opt () {
      return this.selfFilter ? this.options : this.$attrs.options
    }
  }
}
</script>
