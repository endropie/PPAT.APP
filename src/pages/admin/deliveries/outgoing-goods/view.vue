<template>
  <q-page padding class="row justify-center" >
    <page-print v-if="VIEW.show" class="q-pa-md q-pr-lg shadow-2" :class="{'header-minimaze': $q.screen.lt.md} " style="max-width:210mm;">
      <!-- AVAILBLE "slot" = [header, header-icon, header-title, header-subtitle, header-tags] -->
      <div slot="header-title">
        OUTGOING GOOD
      </div>

      <div class="row q-col-gutter-sm" >
        <div class="col-12">
          <div class="row justify-between ">
            <div class="col profile">
              <div class="text-weight-medium uppercase">To: {{rsView.customer_name}}</div>
              <address class="text-weight-light">{{rsView.customer_address}}</address>
              <div class="text-weight-light ">Phone: {{rsView.customer_phone}}</div>
            </div>
            <div class="col-auto info">
              <q-markup-table class="bordered super-dense no-highlight no-shadow" separator="cell">
                <tr>
                  <td class="text-weight-light">No</td>
                  <td>
                    {{ rsView.number }}
                    <span v-text="'REV.'+rsView.revise_number" v-if="Boolean(rsView.revise_number)"/>
                  </td>
                </tr>
                <tr>
                  <td class="text-weight-light">{{$tc('label.date')}}</td>
                  <td>{{$app.date_format(rsView.date)}}</td>
                </tr>
                 <tr>
                  <td class="text-weight-light">{{$tc('label.transaction')}}</td>
                  <td>{{ rsView.transaction }}</td>
                </tr>
              </q-markup-table>
            </div>
          </div>
        </div>
        <div class="col-12" >
          <q-table ref="table" class="bordered no-shadow no-highlight" color="secondary" :dark="LAYOUT.isDark"
            separator="vertical" dense hide-bottom
            :data="rsView.outgoing_good_items"
            no-data-label = "No Production"
            :columns="[
              { name: 'id', label: '#', align: 'left', field:'id', format:(v)=> `${v}`},
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
        <div class="col-12 q-gutter-xs print-hide " style="padding-top:50px">
          <q-btn :label="$tc('form.cancel')" :icon="btnIcon('cancel')"  color="dark" :to="`${VIEW.resource.uri}?return`" />
          <q-btn :label="$tc('form.print')" :icon="btnIcon('print')" color="grey" @click.native="print()" />

          <ux-btn-dropdown :label="$tc('label.others')" color="blue-grey" no-caps class="float-right"
            :options="[
              { label: $tc('form.add_new'), color:'green', icon: 'add',
                hidden: !$app.can('outgoing-goods-create'),
                detail: $tc('messages.process_create'),
                actions: () => {
                  $router.push(`${VIEW.resource.uri}/create`)
                }
              },
              // NO DELETE BUTTON //
              { label: 'VOID', color:'red', icon: 'block',
                detail: $tc('messages.process_void'),
                hidden: !IS_VOID || !$app.can('outgoing-goods-void'),
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
          api: '/api/v1/warehouses/outgoing-goods',
          uri: '/admin/deliveries/outgoing-goods',
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
      if (this.deleted_at) return false
      if (['VOID'].find(x => x === this.rsView.status)) return false
      return true
    },
    IS_EDITABLE() {
      if (this.rsView.revise_id) return false
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
