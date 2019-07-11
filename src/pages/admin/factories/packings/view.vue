<template>
  <q-page padding class="row justify-center" v-if="SHOW" :dark="LAYOUT.isDark">
    <page-print class="q-pa-md q-pr-lg shadow-2" style="max-width:210mm;">
      <div slot="header" style="padding-bottom:45px">
        <div class="icon">
          <q-icon name="widgets" class="q-display-3" color="primary" />
        </div>
        <div class="title">
          <div class="q-title ">Priuk Perkasa Abadi, PT</div>
          <div class="q-caption small">Planing & Production Control Division</div>  
        </div>
        <div class="no-print float-right">
          <q-chip tag outline small color="negative" v-if="rsView.revise_id">
            Revised
          </q-chip>
        </div>
      </div>
      <div class="row  q-gutter-md" >
        <div class="col-12">
          <div class="row justify-around q-gutter-sm" >
            <div class="self-center text-center">
                <span class="q-headline">PACKING GOODS</span>
            </div>
            <div class="">
              <q-table ref="table" class="top-table table-bordered d-grid no-shadow" color="secondary" separator="cell" grid dense hide-bottom :dark="LAYOUT.isDark"
                :data="[{
                  number: rsView.number,
                  created_at: $app.moment(rsView.created_at).format('DD/MM/YYYY'),
                }]" 
                :columns="[
                  { name: 'number', label: 'Number', align: 'center', field: 'number', classes:'text-weight-medium'},
                  { name: 'created_at', label: 'Date', align: 'center', field:'created_at'},
                ]"
            />
            </div>
          </div>
        </div>
        <div class="col-12">
          <dl class=" horizontal">                                
            <dt class="text-weight-light">Worktime</dt><dd>{{ getWorktime(rsView.worktime) }}</dd>
            <dt class="text-weight-light">Customer</dt><dd>{{ rsView.customer.name }}</dd>
            <dt class="text-weight-light">Operator</dt><dd>{{ rsView.operator.name }}</dd>
            <dt class="text-weight-light">Process at</dt><dd>{{ rsView.date ? $app.moment(rsView.date +' '+ rsView.time).format('DD/MM/YYYY hh:mm') : '' }}</dd>
            
          </dl>
        </div>
        <div class="col-12">
          <q-table ref="table" class="main-table table-border d-grid no-shadow" color="secondary" separator="vertical" hide-bottom :dark="LAYOUT.isDark"
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
        <div class="col-12 group print-hide " style="padding-top:50px">
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
