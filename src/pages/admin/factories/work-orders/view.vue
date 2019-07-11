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
                <span class="q-headline">WORK ORDERS</span>
            </div>
            <div class="">
                <q-table ref="table" class="table-bordered d-grid no-shadow" color="secondary" separator="cell" grid dense hide-bottom :dark="LAYOUT.isDark"
                :data="[{
                number: rsView.number,
                created_at: $app.moment(rsView.created_at).format('DD/MM/YYYY'),
                }]" 
                :columns="[
                { name: 'number', label: 'Number', align: 'center', field: 'number', classes:'q-headline text-weight-medium'},
                { name: 'created_at', label: 'Date', align: 'center', field:'created_at'},
                ]"
            />
            </div>
          </div>
        </div>
        <div class="col-12">
          <dl class=" horizontal">
            <dt class="text-weight-light">Customer</dt><dd>{{ rsView.line.name }}</dd>                                     
            <dt class="text-weight-light">Material of</dt><dd>{{ getStockistFrom(rsView.stockist_from) }}</dd>
          </dl>
        </div>
        <div class="col-12">
          <q-table ref="table" class="table-border d-grid no-shadow" color="secondary" separator="vertical" dense hide-bottom :dark="LAYOUT.isDark"
            :data="rsView.work_order_items" 
            no-data-label = "No Production"
            :columns="[
              { name: 'code', label: 'code', align: 'left', field: (v)=> v.item.code},
              { name: 'part_name', label: 'Part name', align: 'left', field: (v)=> v.item.part_name},
              { name: 'target', label: 'Quantity', align: 'right', field: (v)=> v.target},
              { name: 'unit_id', label: 'Unit', align: 'center', field: (v)=> v.unit.code},
              { name: 'ngratio', label: 'NG Ratio', align: 'right', format:(v)=> v ? `${Number(v)}%` : '-', field: (v)=> v.ngratio},
              { name: 'total', label: 'Total', align: 'right', format:(v)=> `${Math.round(v)}`, field: (v)=> Number(v.quantity)},
            ]"
          >
          <template slot="Xbody" slot-scope="propItem">
            <q-tr :propItem="propItem" style="height:20px">
              <q-td key="code" style="width:50px">
                {{propItem.row.item.code}}
              </q-td>
              <q-td key="part_name" style="width:50px">
                {{propItem.row.item.code}}
              </q-td>
              <q-td key="target" style="width:50px">
                {{propItem.row.item.code}}
              </q-td>
              <q-td key="unit_id" style="width:50px">
                {{propItem.row.item.code}}
              </q-td>
              <q-td key="ngratio" style="width:50px">
                {{propItem.row.item.code}}
              </q-td>
              <q-td key="total" style="width:50px">
                {{propItem.row.item.code}}
              </q-td>
            </q-tr>
          </template>
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
          api: '/api/v1/factories/work-orders',
          uri: '/admin/factories/work-orders',
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
    getBaseUnit(detail) {
      if(detail.unit_rate == 1) return ''
      return `(${detail.unit_amount} ${detail.item.unit.code})`
    },
    getStockistFrom(val) {
    const stockist = [
      {value: 'FM', label: 'FRESH MATERIAL'},
      {value: 'NG', label: 'NOT GOOD',  color: 'warning' },
      {value: 'NGR', label: 'REPAIR',  color: 'orange-8' },
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
