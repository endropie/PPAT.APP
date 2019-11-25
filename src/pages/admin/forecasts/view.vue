<template>
  <q-page padding class="row justify-center" >
    <page-print v-if="VIEW.show" class="q-pa-md q-pr-lg shadow-2">
      <div slot="header-tags" class="print-hide">
        <ux-chip-status :row="rsView" tag outline small square icon='bookmark'/>
      </div>
      <div class="row justify-around q-gutter-y-sm" >
        <div class="col-12 col-sm-6 self-end">
          <div class="text-h6">FORECAST ORDER</div>
        </div>
        <div class="col-12 col-sm-auto  self-end items-end">
          <q-markup-table class="super-dense bordered no-shadow">
            <tr>
              <td>{{$tc('label.number')}}</td>
              <td>{{rsView.number}}</td>
            </tr>
            <tr><td> Customer </td><td class="">{{ rsView.customer.name }}</td></tr>
            <tr><td> Period </td><td class="">
              {{ $app.date_format(rsView.begin_date) }} - {{ $app.date_format(rsView.until_date) }}
            </td></tr>
          </q-markup-table>
        </div>
        <div class="col-12">
          <q-table ref="table" class="d-grid bordered no-shadow no-highlight" color="secondary" separator="vertical" dense hide-bottom
            :data="rsView.forecast_items"
            no-data-label = "No Production"
            :columns="[
              { name: 'code', label: 'code', align: 'left', field: (v)=> v.item.code},
              { name: 'part_name', label: this.$tc('label.name', 1, {v:this.$tc('label.part')}), align: 'left', field: (v)=> v.item.part_name},
              { name: 'part_number', label: this.$tc('label.number', 1, {v:this.$tc('label.part')}), align: 'left', field: (v)=> v.item.part_number},
              { name: 'quantity', label: $tc('label.quantity'), align: 'right', field: (v)=> v.quantity},
              { name: 'unit_id', label: $tc('label.unit'), align: 'center', field: (v)=> v.unit.code},
            ]"
          >

          </q-table>
        </div>
        <div class="col-12">
            <div class="q-my-xs text-italic">{{$tc('label.description')}}:</div>
            <div class="q-my-xs text-weight-light" style="min-height:30px">{{ rsView.description }}</div>
        </div>
        <div class="col-12 q-gutter-xs print-hide " style="padding-top:50px">
          <q-btn :label="$tc('form.back')" :icon-right="btnIcon('cancel')"  color="dark" :to="`${VIEW.resource.uri}?return`" />
          <q-btn :label="$tc('form.edit')" :icon-right="btnIcon('edit')" color="positive" v-if="IS_EDITABLE" :to="`${VIEW.resource.uri}/${ROUTE.params.id}/edit`"  />
          <q-btn :label="$tc('form.print')" :icon-right="btnIcon('print')" color="grey" @click.native="print()" />
          <q-btn :label="$tc('form.delete')" :icon-right="btnIcon('delete')" color="negative" v-if="IS_EDITABLE" @click="VIEW.delete" outline
            :class="{'float-right':$q.screen.gt.md}" />
        </div>
      </div>
    </page-print>
  </q-page>
</template>

<script>

import MixView from '@/mixins/mix-view.vue'
import PagePrint from '@/components/page-print'
import PagePrintBreak from '@/components/page-print-break'

export default {
  mixins: [MixView],
  components: { PagePrint, PagePrintBreak },
  data () {
    return {
      VIEW: {
        data: {},
        resource:{
          api: '/api/v1/incomes/forecasts',
          uri: '/admin/forecasts',
        }
      },
      rsView: {},
      count: 0,
    }
  },
  created() {
    this.init()
  },
  watch:{
      '$route' : 'init',
  },
  computed: {
    IS_EDITABLE() {
      if (this.rsView.revise_id) return false
      if (this.rsView.hasOwnProperty('has_relationship') && Object.keys(this.rsView.has_relationship).length > 0) return false

      return true
    },
  },
  methods: {
    init() {
      this.VIEW.load((data) => {
        this.setView(data || {})
      })
    },
    btnIcon (str) {
      return !this.$q.screen.lt.sm ? str : ''
    },
    print() {
      window.print()
    },
    getBaseUnit(detail) {
      if(detail.unit_rate == 1) return ''
      return `(${detail.unit_amount} ${detail.item.unit.code})`
    },
    setView(data) {
      this.rsView =  data
    }
  }
}
</script>
