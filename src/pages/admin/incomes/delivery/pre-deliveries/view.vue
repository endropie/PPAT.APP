<template>
  <q-page padding class="row justify-center"  v-if="VIEW.show" style="min-width:210mm;">
    <page-print :class="{'header-minimaze':$q.screen.lt.sm}" style="max-width:210mm;">
      <div slot="header-title">PPA - Pre Delivery </div>

      <div class="row justify-between q-col-gutter-y-sm" >
        <div class="profile">
          <div class="text-weight-regular uppercase">To: {{rsView.customer_name}}</div>
          <address class="text-weight-light">{{rsView.customer_address}}</address>
          <div class="text-weight-light ">Phone: {{rsView.customer_phone}}</div>
        </div>
        <div class="info">
          <q-markup-table class="bordered super-dense th-text-left no-shadow" separator="cell" dense>
            <tr><th class="text-weight-light">No</th><td>{{ rsView.number }}</td></tr>
            <tr><th class="text-weight-light">{{$tc('label.date')}}</th><td>{{ $app.moment(rsView.date).format('DD/MM/YYYY') }}</td></tr>
          </q-markup-table>
        </div>
        <div class="col-12">
          <q-table ref="table"
            class="bordered no-shadow no-radius no-highlight"
            color="secondary"
            separator="vertical" dense hide-bottom
            :data="rsView.pre_delivery_items"
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
        <div class="col-12 text-weight-light text-italic" v-if="rsView.plan_begin_date || rsView.plan_until_date">
            Delivery plan from {{ rsView.plan_begin_date ? $app.moment(rsView.plan_begin_date).format('DD/MM/YYYY') : '' }}
            until then {{ rsView.plan_until_date ? $app.moment(rsView.plan_until_date).format('DD/MM/YYYY') : '' }}
        </div>
        <div class="col-12">
            <div class="q-my-xs text-italic">{{$tc('label.description')}}:</div>
            <div class="q-my-xs text-weight-light" style="min-height:30px">{{ rsView.description }}</div>
        </div>
        <div class="col-12 q-gutter-xs print-hide " style="padding-top:50px">
          <q-btn :label="$tc('form.back')" :icon-right="btnIcon('cancel')"  color="dark" :to="`${VIEW.resource.uri}?return`" />
          <q-btn :label="$tc('form.edit')" :icon-right="btnIcon('edit')" color="positive" v-if="IS_EDITABLE" :to="`${VIEW.resource.uri}/${$route.params.id}/edit`"  />
          <q-btn :label="$tc('form.print')" :icon-right="btnIcon('print')" color="grey" @click.native="print()" />
          <!-- <q-btn :label="$tc('form.delete')" :icon-right="btnIcon('delete')" color="negative" v-if="IS_EDITABLE" @click="VIEW.delete" outline
            :class="{'float-right':$q.screen.gt.md}" /> -->
          <ux-btn-dropdown :label="$tc('label.others')" color="blue-grey" no-caps class="float-right"
            :options="[
              { label: 'Delete', color:'red', icon: 'delete', hidden: !IS_EDITABLE,
                detail: $tc('messages.process_delete'),
                actions: () => {
                  VIEW.delete()
                }
              },
              { label: 'VOID', color:'red', icon: 'block', hidden: !IS_VOID,
                detail: $tc('messages.process_void'),
                actions: () => {
                  VIEW.void(()=> init() )
                }
              },
            ]"/>
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
          api: '/api/v1/incomes/pre-deliveries',
          uri: '/admin/incomes/delivery/pre-deliveries',
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
    IS_VOID() {
      if (this.IS_EDITABLE) return false
      if (this.rsView.deleted_at) return false
      if (['VOID'].find(x => x === this.rsView.status)) return false
      return true
    },
    IS_EDITABLE() {
      if (this.rsView.revise_id) return false
      if (this.rsView.order_mode === 'NONE') return false
      if (this.rsView.deleted_at) return false
      if (Object.keys(this.rsView.has_relationship || {}).length > 0) return false
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
