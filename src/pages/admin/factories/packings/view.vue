<template>
  <q-page padding class="row justify-center" v-if="SHOW" :dark="LAYOUT.isDark">
    <page-print class="q-pa-md q-pr-lg shadow-2" style="max-width:210mm;">
     <div slot="header-tags">
        <q-chip label="Revised" v-if="!!rsView.revise_id"
          icon="bookmark" color="negative"
          tag outline small dense />
      </div>
      <span slot="header-title" style="font-size:26px">Priuk Perkasa Abadi, PT</span>
      <span slot="header-subtitle" style="font-size:16px">Planing & Production Control Division</span>
      
      <div class="column  q-gutter-md" >
        <div class="row justify-around q-col-gutter-sm" >
          <div class="col-6 self-center text-center">
              <span class="text-h6">PACKING GOODS</span>
          </div>
          <div class="col-6">
             <q-markup-table class="bordered no-shadow" separator="cell" dense :dark="LAYOUT.isDark">
              <tr><th>Number</th><th>Date</th></tr>
              <tr>                               
                <td>{{rsView.number}}</td>
                <td>{{ $app.moment(rsView.created_at).format('DD/MM/YYYY') }}</td>
              </tr>
            </q-markup-table>
          </div>
        </div>
        <q-markup-table class="bordered no-shadow" separator="vertical" dense :dark="LAYOUT.isDark">
          <tr>
            <th class="text-weight-light">Worktime</th><td>{{ getWorktime(rsView.worktime) }}</td>
    
            <th class="text-weight-light">Customer</th><td>{{ rsView.customer.name }}</td>
          </tr>
          <tr>
            <th class="text-weight-light">Operator</th><td>{{ rsView.operator.name }}</td>
          
            <th class="text-weight-light">Process at</th><td>{{ rsView.date ? $app.moment(rsView.date +' '+ rsView.time).format('DD/MM/YYYY hh:mm') : '' }}</td>
          </tr>
        </q-markup-table>
        <div class="col-12">
          <q-table ref="table" class="bordered no-shadow" color="secondary" separator="vertical" dense hide-bottom :dark="LAYOUT.isDark"
            :data="[rsView.packing_items]" 
            no-data-label = "No Production"
            :columns="[
              { name: 'work_order_item', label: 'Work Order', align: 'left', field: (v)=> v.work_order_item.work_order.number},
              { name: 'code', label: 'Part code', align: 'left', field: (v)=> v.item.code},
              { name: 'part_name', label: 'Part name', align: 'left', field: (v)=> v.item.part_name},
              { name: 'quantity', label: 'Quantity', align: 'right', field: (v)=> v.quantity},
              { name: 'unit_id', label: 'Unit', align: 'center', field: (v)=> v.unit.code}
            ]"
          >
          </q-table>
        </div>
        
        <div class="col-12">
            <div class="q-my-xs text-italic">Description:</div>
            <div class="q-my-xs text-weight-light" style="min-height:30px">{{ rsView.description }}</div>
        </div>
        <div class="col-12 q-gutter-xs print-hide " style="padding-top:50px">
          <q-btn label="Back" :icon-right="btnIcon('cancel')"  color="dark" :to="`${VIEW.resource.uri}?return`"></q-btn>
          <q-btn color="positive" :icon-right="btnIcon('edit')" label="Edit" :to="`${VIEW.resource.uri}/${$route.params.id}/edit`" v-if="IS_EDITABLE"></q-btn>
          <q-btn label="Print" :icon-right="btnIcon('print')" color="grey" @click.native="print()" ></q-btn>
          <q-btn color="negative" :icon-right="btnIcon('delete')" label="Delete" outline @click="VIEW.delete" v-if="IS_EDITABLE"></q-btn>
        </div>
      </div>
    </page-print>
    
    <q-inner-loading :visible="VIEW.loading">
        <q-spinner-gears size="50px" color="primary" />
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
          api: '/api/v1/factories/packings',
          uri: '/admin/factories/packings',
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
      this.SHOW = false
      this.VIEW.onLoad(
        (data) => {
          this.setView(data)
          setTimeout(() => {
            this.SHOW = true
          }, 500) 
        }
      )
    },
    btnIcon (str) {
      return !this.$q.screen.lt.sm ? str : ''
    },
    print() {
      window.print()
    },
    getWorktime(val) {
    const stockist = [
        { label: 'Reguler', value: 'REGULER' },
        { label: 'Overtime', value: 'OVERTIME', color: 'secondary' },
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
