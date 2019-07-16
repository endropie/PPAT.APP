<template>
  <q-scroll-area horizontal style="height:110vh;max-width:100vw">
    <q-page padding class="row justify-center"  v-if="SHOW">
      <page-print class="q-pa-md q-pr-lg shadow-2">
        <div slot="header-tags">
          <q-chip tag outline small color="negative" icon="assignment" label="Revised"
            v-if="rsView.revise_id" />
          <q-chip tag outline small color="negative" icon="bookmark" label="void" 
            v-if="rsView.status == 'VOID'" />
        </div>
        <div class="row justify-around q-gutter-y-sm" >
          <div class="text-center">
            <div class="q-headline">FORECAST ORDER</div>
          </div>
          <div class="text-center">
            <table class="q-table table table-bordered" style="width:300px">
              <tr class="bg-grey-3"><th> Number </th><th> Date</th></tr>
              <tr><td> {{ rsView.number }} </td><td> {{ $app.moment(rsView.created_at).format('DD/MM/YYYY') }} </td></tr>
            </table>
          </div>
          <div class="col-12">
              <table class="q-table table table-vertical table-dense ">
                <tr><td class="text-right text-weight-light"> Customer </td><td class="">{{ rsView.customer.name }} ({{ rsView.customer.code }})</td></tr>
                <tr><td class="text-right text-weight-light"> Period </td><td class=""> 
                  {{ rsView.begin_date ? $app.moment(rsView.begin_date).format('DD/MM/YYYY') : '' }} - {{ rsView.until_date ? $app.moment(rsView.until_date).format('DD/MM/YYYY') : '' }}
                </td></tr>
              </table>
          </div>
          <div class="col-12">
            <q-table ref="table" class="d-grid bordered no-shadow" color="secondary" separator="vertical" dense hide-bottom
              :data="rsView.forecast_items" 
              no-data-label = "No Production"
              :columns="[
                { name: 'code', label: 'code', align: 'left', field: (v)=> v.item.code},
                { name: 'part_name', label: 'Part name', align: 'left', field: (v)=> v.item.part_name},
                { name: 'part_number', label: 'Part number', align: 'left', field: (v)=> v.item.part_number},
                { name: 'quantity', label: 'Quantity', align: 'right', field: (v)=> v.quantity},
                { name: 'unit_id', label: 'Unit', align: 'center', field: (v)=> v.unit.code},
              ]"
            >
            
            </q-table>
          </div>
          <div class="col-12">
              <div class="q-my-xs text-italic">Description:</div>
              <div class="q-my-xs text-weight-light" style="min-height:30px">{{ rsView.description }}</div>
          </div>
          <div class="col-12 q-gutter-sm print-hide " style="padding-top:50px">
            <q-btn label="Back" :icon-right="btnIcon('cancel')"  color="dark" :to="`${VIEW.resource.uri}?return`" />
            <q-btn label="Edit" :icon-right="btnIcon('edit')" color="positive" v-if="IS_EDITABLE" :to="`${VIEW.resource.uri}/${$route.params.id}/edit`"  />
            <q-btn label="Print" :icon-right="btnIcon('print')" color="grey" @click.native="print()" />
            <q-btn label="Delete" :icon-right="btnIcon('delete')" color="negative" v-if="IS_EDITABLE" @click="VIEW.delete" outline 
              :class="{'float-right':$q.screen.gt.md}" />
          </div>
        </div>
      </page-print>
    </q-page>
  </q-scroll-area>
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
          uri: '/admin/incomes/forecasts',
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
    setView(data) {
      this.rsView =  data
    }
  }
}
</script>
