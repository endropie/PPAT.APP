<template>
  <div
  v-bind="$attrs"
  v-on="$listeners"
  class="row q-col-gutter-xs" >
  steswreeeeeee
    <ux-select-filter class="col-8 col-sm-4"
      name="line_id"
      v-model="fill.line_id.value" clearable
      :label="$tc('label.line')" stack-label
      :placeholder="$tc('form.select_a', null, {v:$tc('label.line')})"
      dense hide-bottom-space hide-dropdown-icon
      standout="bg-blue-grey-5 text-white"
      :bg-color="dark ? 'blue-grey-9' : 'blue-grey-1'"
      :dark="dark" :options-dark="dark"
      :options="LineOptions"
      @input="submit" />

    <q-select class="col-4 col-sm-2 "
      v-model="fill.status.value" clearable
      :options="['OPEN', 'CLOSED']"
      :label=" $tc('label.state')"
      dense hide-bottom-space hide-dropdown-icon
      standout="bg-blue-grey-5 text-white"
      :bg-color="dark ? 'blue-grey-9' : 'blue-grey-1'"
      :dark="dark"
      @input="submit" />

    <ux-date class="col-8 col-sm-4"
      stack-label :label="$tc('label.date')"
      v-model="fill.date.value" type="date"  clearable
      dense hide-bottom-space
      standout="bg-blue-grey-5 text-white"
      :bg-color="dark ? 'blue-grey-9' : 'blue-grey-1'"
      :dark="dark"
      @input="submit"/>

    <q-select class="col-4 col-sm-2"
      map-options emit-value
      v-model="fill.shift_id.value" clearable
      :options="ShiftOptions"
      :label="$tc('label.shift')"
      dense hide-bottom-space hide-dropdown-icon
      standout="bg-blue-grey-5 text-white"
      :bg-color="dark ? 'blue-grey-9' : 'blue-grey-1'"
      :dark="dark"
      @input="submit"/>

    <q-select class="col-12" autocomplete="off"
      multiple use-chips use-input new-value-mode="add"
      dense hide-dropdown-icon
      v-model="search" emit-value
      :placeholder="`${$tc('form.search',2)}...`"
      standout="bg-blue-grey-5 text-white"
      :bg-color="dark ? 'blue-grey-9' : 'blue-grey-1'"
      :dark="dark">

      <template slot="append">
        <q-btn flat dense icon="search" color="fadded" @click="submit"/>
      </template>
    </q-select>


  </div>
</template>

<script>

import MixSheet from '@/mixins/mix-sheet.vue'
export default {
  mixins: [MixSheet],
  props: {
    filterable: Object,
    dark: Boolean,
  },
  data() {
    return {
      SHEET: {
        lines: {data:[], api:'/api/v1/references/lines?mode=all'},
        shifts: {data:[], api:'/api/v1/references/shifts?mode=all'}
      },
      search: [],
      fill: {
        ...this.$attrs.fill,
        line_id: {
          value: null,
          type: 'integer',
          transform: (value) => { return null }
        },
        status: {
          value: null,
          type: 'string',
          transform: (value) => { return null }
        },
        date: {
          value: null,
          type: 'date',
          transform: (value) => { return null }
        },
        shift_id: {
          value: null,
          type: 'integer',
          transform: (value) => { return null }
        },
        // ...this.$attrs.filterable.fill
      }
    }
  },
  created() {
    this.SHEET.assign()
    this.SHEET.request()
  },
  computed: {
    ShiftOptions() {
      return (this.SHEET.shifts.data.map(line => ({label: line.name, value: line.id})) || [])
    },
    LineOptions() {
      return (this.SHEET.lines.data.map(item => ({label: item.name, value: item.id})) || [])
    },
  },
  methods:{
    submit() {
      console.warn('SUBMIT')
      this.$emit('fill', this.fill)
      this.filterable.submit()
    }
  }
}
</script>
