<template>
  <q-page padding class="row justify-center" :dark="LAYOUT.isDark" style="min-width:210mm;">
    <page-print v-if="VIEW.show" class="q-ma-md shadow-2" style="max-width:210mm;">
      <div slot="header-tags">
        <ux-chip-status :row="rsView" tag outline small square icon='bookmark'/>
      </div>
      <span slot="header-title" style="font-size:26px">Priuk Perkasa Abadi, PT</span>
      <span slot="header-subtitle" style="font-size:16px">Planing & Production Control Division</span>

      <div class="row q-col-gutter-sm" >
        <div class="col-12">
          <div class="row justify-between q-col-gutter-sm" >
            <div class="col-auto items-end">
              <span class="text-h6 q-px-xs">
                WORK IN PROCESS
              </span>
              <q-markup-table class="super-dense no-shadow"
                :dark="LAYOUT.isDark">
                <tr>
                  <th class="text-left">{{$tc('general.customer')}}</th><td>{{ rsView.line.name }}</td>
                </tr>
                <tr>
                  <th class="text-left">Material of</th><td>{{ getStockistFrom(rsView.stockist_from) }}</td>
                </tr>
              </q-markup-table>
            </div>
            <div class="col-auto">
              <q-markup-table class="super-dense bordered no-shadow" separator="cell" :dark="LAYOUT.isDark">
                <tr>
                  <th>{{$tc('label.number')}}</th>
                  <td>{{rsView.number}}</td>
                </tr>
                <tr>
                  <th>{{$tc('label.date')}}</th>
                  <td>{{ $app.moment(rsView.created_at).format('DD/MM/YYYY') }}</td>
                </tr>
                <tr>
                  <th>{{$tc('label.shift')}}</th>
                  <td>{{rsView.shift.name}}</td>
                </tr>
              </q-markup-table>
            </div>
          </div>

        </div>
        <div class="col-12">
          <q-table class="bordered no-shadow"
            color="secondary"
            separator="vertical"
            dense hide-bottom :dark="LAYOUT.isDark"
            :data="rsView.work_order_items"
            no-data-label = "No Production"
            :columns="[
              { name: 'code', label: 'code', align: 'left', field: (v)=> v.item.code},
              { name: 'part_name', label: this.$tc('label.name', 1, {v:this.$tc('label.part')}), align: 'left', field: (v)=> v.item.part_name},
              { name: 'target', label: $tc('label.quantity'), align: 'right', field: (v)=> v.target},
              { name: 'unit_id', label: $tc('label.unit'), align: 'center', field: (v)=> v.unit.code},
              { name: 'ngratio', label: '% NG', align: 'right', format:(v)=> v ? `${Number(v)}%` : '-', field: (v)=> v.ngratio},
              { name: 'quantity', label: $tc('label.plan'), align: 'right',
                format:(v)=> `${Math.round(v)}`,
                field: (v)=> Number(v.quantity)
              },
              { name: 'Process', label: $tc('label.actual'), align: 'right',
                format:(v)=> `${Math.round(v)}`,
                field: (v)=> Number(v.process)
              },
            ]"
          />
        </div>

        <div class="col-12">
            <div class="q-my-xs text-italic">{{$tc('label.description')}}:</div>
            <div class="q-my-xs text-weight-light" style="min-height:30px">{{ rsView.description }}</div>
        </div>
        <div class="col-12 q-gutter-xs print-hide " style="padding-top:50px">
          <q-btn :label="$tc('form.back')" :icon-right="btnIcon('cancel')"  color="dark" :to="`${VIEW.resource.uri}?return`"></q-btn>
          <!-- <q-btn :label="$tc('form.edit')" color="positive" :icon-right="btnIcon('edit')" :to="`${VIEW.resource.uri}/${ROUTE.params.id}/edit`" v-if="IS_EDITABLE"></q-btn> -->
          <q-btn :label="$tc('form.print')" :icon-right="btnIcon('print')" color="grey" @click.native="print()" ></q-btn>
          <!-- <q-btn :label="$tc('form.delete')" :icon-right="btnIcon('delete')" color="negative" outline @click="VIEW.delete" v-if="IS_EDITABLE"></q-btn> -->
        </div>
      </div>
    </page-print>

    <q-inner-loading :showing="VIEW.loading">
        <q-spinner-dots size="50px" color="primary" />
    </q-inner-loading>
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
        resource:{
          api: '/api/v1/factories/work-orders',
          uri: '/admin/factories/work-process',
          params: '?mode=view'
        }
      },
      rsView: {},
      count: 0,
    }
  },
  created() {
    this.init()
  },
  computed: {
    IS_EDITABLE() {
      if (this.rsView.hasOwnProperty('has_relathinship') && this.rsView.has_relationship.length > 0) return false

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
    getStockistFrom(val) {
    const stockist = [
      {value: 'FM', label: 'FRESH MATERIAL'},
      {value: 'NG', label: 'NOT GOOD',  color: 'warning' },
      {value: 'RET', label: 'REPAIR',  color: 'orange-8' },
    ]
    const v = stockist.find(x => x.value === val)
    return v ? v.label : 'N/A'

    },
    setView(data) {
      this.rsView =  data
    }
  }
}
</script>
