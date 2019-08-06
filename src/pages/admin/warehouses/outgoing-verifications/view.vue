<template>
  <q-page padding class="row justify-center"  v-if="VIEW.show">
    <page-print class="q-pa-md q-pr-lg shadow-2" style="max-width:210mm;">
      <div slot="header" class="row no-wrap" style="margin-bottom:30px">
        <div class="icon">
          <q-icon name="widgets" class="q-display-3" color="primary" />
        </div>
        <div class="title" style="max-width: calc(100vw - 100px);">
          <div class="q-title ">Priuk Perkasa Abadi, PT</div>
          <div class="q-caption small">Jalan Jati Raya Blok J3 No.7, Cikarang Selatan, Bekasi, Jawa Barat 17530</div>
        </div>
        <div class="no-print float-right">
          <q-chip tag outline small color="negative" v-if="rsView.revise_id">
            Revised
          </q-chip>
        </div>
      </div>
      <div class="row justify-between q-gutter-y-sm" >
        <div class="">
          <span class="text-weight-medium uppercase">{{rsView.customer_name}}</span><br>
          <span class="text-weight-medium ">Phone: {{rsView.customer_phone}}</span><br><br>
          Address:<br/>
          <address style="white-space: pre-wrap;">{{rsView.customer_address}}</address>
        </div>
        <div class="">
          <table class="q-table table table-bordered" style="width:300px">
            <tr><td colspan="2">SHIP-DELIVERY ORDER</td></tr>
            <tr><th> Number </th><td> {{ rsView.number }}</td></tr>
            <tr><th> Date </th><td> {{ $app.moment(rsView.created_at).format('DD/MM/YYYY') }} </td></tr>
          </table>
        </div>
        <div class="col-12">
          <q-table ref="table" class="table-border d-grid no-shadow no-radius" color="secondary" separator="vertical" dense hide-bottom
            :data="rsView.outgoing_items"
            no-data-label = "No Production"
            :columns="[
              { name: 'code', label: 'code', align: 'left', field: (v)=> v.item.code},
              { name: 'part_name', label: this.$tc('label.name', 1, {v:this.$tc('label.part')}), align: 'left', field: (v)=> v.item.part_name},
              { name: 'part_number', label: this.$tc('label.number', 1, {v:this.$tc('label.part')}), align: 'left', field: (v)=> v.item.part_number},
              { name: 'quantity', label: $tc('label.quantity'), align: 'right', field: (v)=> v.quantity},
              { name: 'unit_id', label: $tc('label.unit'), align: 'center', field: (v)=> v.unit.code},
            ]">
          </q-table>
        </div>
        <div class="col-12 text-weight-light text-italic" v-if="rsView.plan_begin_date || rsView.plan_until_date">
            Delivery plan from {{ rsView.plan_begin_date ? $app.moment(rsView.plan_begin_date).format('DD/MM/YYYY') : '' }}
            until then {{ rsView.plan_until_date ? $app.moment(rsView.plan_until_date).format('DD/MM/YYYY') : '' }}
        </div>
        <div class="col-12">
            <div class="q-my-xs text-italic">{{$tc('label.description')}}:</div>
            <div class="q-my-xs text-weight-light" style="min-height:30px">{{ rsView.description }}</div>
        </div>
        <div class="col-12 group print-hide " style="padding-top:50px">
          <q-btn :label="$tc('form.back')" :icon-right="btnIcon('cancel')"  color="dark" :to="`${VIEW.resource.uri}?return`" />
          <q-btn :label="$tc('form.edit')" :icon-right="btnIcon('edit')" color="positive" v-if="IS_EDITABLE" :to="`${VIEW.resource.uri}/${$route.params.id}/edit`"  />
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
          api: '/api/v1/incomes/ship-deliveries',
          uri: '/admin/incomes/delivery/ship-delivery-items',
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
        if (this.rsView.has_relationship.length > 0) return false
      }
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
