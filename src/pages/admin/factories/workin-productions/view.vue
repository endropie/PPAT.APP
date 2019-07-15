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
      
      <div class="column q-gutter-sm" >
        <div class="row justify-around q-col-gutter-sm" >
          <div class="col-auto">
            <q-markup-table dense class="no-shadow" :dark="LAYOUT.isDark">
              <tr><td colspan="100%" class="text-h6 text-center">WORKIN PRODUCTION</td></tr>
              <tr>
                <th class="text-left">Worktime</th><td>{{ getWorktime(rsView.worktime) }}</td>      
              </tr>
              <tr>                               
                <th class="text-left">Line Production</th><td>{{ rsView.line.name  }}</td>
              </tr>
            </q-markup-table>
          </div>
          <div class="col-auto">
            <q-markup-table dense class="bordered no-shadow" separator="cell" :dark="LAYOUT.isDark">
              <tr>
                <th>Number</th>
                <th>Date</th>      
              </tr>
              <tr>                               
                <td>{{rsView.number}}</td>
                <td>{{ $app.moment(rsView.created_at).format('DD/MM/YYYY') }}</td>
              </tr>
            </q-markup-table>
          </div>
        </div>
        <q-table separator="vertical" class="bordered no-shadow" 
          dense hide-bottom color="secondary"
          :dark="LAYOUT.isDark"
          :data="rsView.workin_production_items" 
          no-data-label = "No Production"
          :columns="[
            { name: 'code', label: 'code', align: 'left', field: (v)=> v.item.code},
            { name: 'part_name', label: 'Part name', align: 'left', field: (v)=> v.item.part_name},
            { name: 'quantity', label: 'Quantity', align: 'right', field: (v)=> v.quantity},
            { name: 'unit_id', label: 'Unit', align: 'center', field: (v)=> v.unit.code}
          ]" />
        
        <div>
            <div class="q-my-xs text-italic">Description:</div>
            <div class="q-my-xs text-weight-light" style="min-height:30px">{{ rsView.description }}</div>
        </div>
        <div class="q-gutter-sm print-hide " style="padding-top:50px">
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
          api: '/api/v1/factories/workin-productions',
          uri: '/admin/factories/workin-productions',
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
