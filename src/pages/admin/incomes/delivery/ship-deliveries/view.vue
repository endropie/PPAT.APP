<template>
  <q-page padding class="row justify-center"  v-if="SHOW">
    <page-print class="Xheader-hide Xright" :class="{'header-minimaze': $q.screen.lt.md} " style="max-width:210mm;">
      <!-- AVAILBLE "slot" = [header, header-icon, header-title, header-subtitle, header-tags] -->
      <div slot="header-title">
        SHIP-DELIVERY ORDER
      </div>
      
      <div class="row justify-between q-gutter-sm" >
        <div class="profile">
          <div class="text-weight-regular uppercase">To: {{rsView.customer_name}}</div>
          <address class="text-weight-light">{{rsView.customer_address}}</address>
          <div class="text-weight-light ">Phone: {{rsView.customer_phone}}</div>
        </div>
        <div class="info">
          <dl class="horizontal text-weight-medium" style="min-width: 200px;">
            <dt class="text-weight-light">No</dt><dd>{{ rsView.number }}</dd>
            <dt class="text-weight-light">Date</dt><dd>{{ $app.moment(rsView.created_at).format('DD/MM/YYYY') }}</dd>
          </dl>
        </div>
        <div class="col-12" >
          <q-table ref="table" class="table-border d-grid no-shadow no-radius" color="secondary" :dark="LAYOUT.isDark"
            separator="vertical" dense hide-bottom
            :data="rsView.ship_delivery_items" 
            no-data-label = "No Production"
            :columns="[
              { name: 'id', label: 'code', align: 'left', field:'id', format:(v)=> `#${v}`},
              { name: 'code', label: 'code', align: 'left', field: (v)=> v.item.code},
              { name: 'part_name', label: 'Part name', align: 'left', field: (v)=> v.item.part_name},
              { name: 'part_number', label: 'Part number', align: 'left', field: (v)=> v.item.part_number},
              { name: 'quantity', label: 'Quantity', align: 'right', field: (v)=> v.quantity},
              { name: 'unit_id', label: 'Unit', align: 'center', field: (v)=> v.unit.code},
            ]">
          </q-table>
        </div>
        <div class="col-12 text-weight-light text-italic" v-if="rsView.plan_begin_date || rsView.plan_until_date">
            Delivery plan from {{ rsView.plan_begin_date ? $app.moment(rsView.plan_begin_date).format('DD/MM/YYYY') : '' }}
            until then {{ rsView.plan_until_date ? $app.moment(rsView.plan_until_date).format('DD/MM/YYYY') : '' }}
        </div>
        <div class="col-12">
            <div class="q-my-xs text-italic">Description:</div>
            <div class="q-my-xs text-weight-light" style="min-height:30px">{{ rsView.description }}</div>
        </div>
        <div class="col-12 group print-hide " style="padding-top:50px">
          <q-btn label="Back" :icon-right="btnIcon('cancel')"  color="dark" :to="`${VIEW.resource.uri}?return`" />
          <q-btn label="Print" :icon-right="btnIcon('print')" color="grey" @click.native="print()" />
          <q-btn label="Delete" :icon-right="btnIcon('delete')" color="negative" v-if="IS_EDITABLE" @click="VIEW.delete" outline 
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
          api: '/api/v1/incomes/ship-deliveries',
          uri: '/admin/incomes/delivery/ship-deliveries',
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
      if (this.rsView.revise_id) return false
      if (this.rsView.hasOwnProperty('has_relationship')) {
        if (Object.keys(this.rsView.has_relationship).length > 0) return false
      }
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
