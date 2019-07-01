<template>
<div>
  <q-select
    ref="select-filter"
    v-model="model"
    v-bind="$attrs"
    v-on="$listeners"
    @filter="filterFunc"
    :options="opt"
    hide-selected
    use-input
    fill-input
    emit-value
    map-options
    autocomplete="off"
  >
    <!-- :options="this.selfFilter ? this.options : this.$attrs.options" -->
    <!-- @filter="(v, f, c) => { this.selfFilter ? filterFn(v, f, c) : $emit('filter', v, f, c) }" -->
    <template v-slot:no-option>
      <q-item>
        <q-item-section class="text-grey">
          No results
        </q-item-section>
      </q-item>
    </template>
  </q-select>

</div>
</template>
<script>

export default {
  name: 'q-select-filter',
  inheritAttrs: false,
  props: {
    selfFilter: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      model:  null,
      options: [] // this.$attrs.options
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
      console.warn('SET VALUE', this.$attrs.value)
      this.model = v
    },
    setOptions(v) {
      console.warn('SET OPTIONS', this.$attrs.options)
      this.options = v
    },
    // use this default filter function
    filterFn (val, update) {
      if (!this.selfFilter) {
        console.warn('EMIT')
         this.$emit('filter', v, u, a)
        return
      }

      update(() => {
        const needle = val.toLowerCase()
        this.options = this.$attrs.options.filter(v => v.label.toLowerCase().includes(needle))
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
