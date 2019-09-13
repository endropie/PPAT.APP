<template>
  <q-page padding class="row justify-center" :dark="LAYOUT.isDark" style="min-width:210mm;">
    <page-print v-if="VIEW.show" class="q-ma-md shadow-2" style="max-width:210mm;">
      <div slot="header-tags">
        <ux-chip-status :row="rsView" tag outline small square icon='bookmark' />
      </div>
      <span slot="header-title" style="font-size:26px">Priuk Perkasa Abadi, PT</span>
      <span slot="header-subtitle" style="font-size:16px">Planing & Production Control Division</span>

      <div class="row q-col-gutter-xs" >
        <div class="col-12">
          <div class="row justify-between q-col-gutter-sm" >
            <div class="col-auto self-end">
              <span class="text-h6 text-center q-pt-lg q-pl-sm">WORK ORDER</span>

              <q-markup-table class="super-dense no-shadow"
                :dark="LAYOUT.isDark">
                <tr>
                  <th class="text-left">{{$tc('general.line')}}</th><td>{{ rsView.line.name }}</td>
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
                  <td>{{ $app.moment(rsView.date).format('DD/MM/YYYY') }}</td>
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
        </div>
        <div class="col-12">
          <q-table class="no-highlight bordered no-shadow"
            color="secondary"
            separator="vertical"
            dense hide-bottom :dark="LAYOUT.isDark"
            :data="rsView.work_production_items"
            no-data-label = "No Production"
            :columns="[
              { name: 'code', label: 'code', align: 'left', field: (v)=> v.item.code},
              { name: 'part_name', label: this.$tc('label.name', 1, {v:this.$tc('label.part')}), align: 'left', field: (v)=> v.item.part_name},
              { name: 'part_number', label: this.$tc('label.name', 1, {v:this.$tc('label.part')}), align: 'left', field: (v)=> v.item.part_number},
              { name: 'unit_id', label: $tc('label.unit'), align: 'center', field: (v)=> v.unit.code},
              { name: 'quantity', label: $tc('label.quantity'), align: 'right', format:(v)=> `${Math.round(v)}`, field: (v)=> Number(v.quantity)},
            ]"
          />
        </div>
        <div class="col-12">
            <div class="q-my-xs text-italic">{{$tc('label.description')}}:</div>
            <div class="q-my-xs text-weight-light" style="min-height:30px">{{ rsView.description }}</div>
        </div>
      </div>
      <div class="row q-col-gutter-xs" >
        <div class="col-12 q-gutter-xs print-hide " style="padding-top:50px">
          <q-btn :label="$tc('form.back')" icon="cancel" color="dark" :to="`${VIEW.resource.uri}?return`"></q-btn>
          <q-btn :label="$tc('form.edit')" icon="edit" color="green" :to="`${VIEW.resource.uri}/${ROUTE.params.id}/edit`" v-if="IS_EDITABLE"></q-btn>
          <q-btn :label="$tc('form.print')" icon="print" color="grey" @click.native="$router.push(`${VIEW.resource.uri}/${ROUTE.params.id}/prelines`)" ></q-btn>

          <ux-btn-dropdown :label="$tc('label.others')" color="blue-grey" no-caps class="float-right"
            :options="[
              { label: $tc('form.add_new'), color:'primary', icon: 'add',
                detail: $tc('messages.process_create'),
                hidden: !$app.can('work-orders-create'),
                actions: () => {
                  $router.push(`${VIEW.resource.uri}/create`)
                }
              },
              { label: 'Delete', color:'red', icon: 'delete',
                detail: $tc('messages.process_delete'),
                hidden: !IS_EDITABLE || !$app.can('work-orders-delete'),
                actions: () => {
                  VIEW.delete()
                }
              },
              { label: 'VOID', color:'red', icon: 'block',
                detail: $tc('messages.process_void'),
                hidden: !IS_VOID || !$app.can('work-orders-void'),
                actions: () => {
                  VIEW.void(()=> init() )
                }
              },
            ]">
          </ux-btn-dropdown>
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
          api: '/api/v1/factories/work-productions',
          uri: '/admin/factories/work-productions',
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
    IS_VOID() {
      if (this.IS_EDITABLE) return false
      if (this.rsView.deleted_at) return false
      if (['VOID'].find(x => x === this.rsView.status)) return false
      return true
    },
    IS_EDITABLE() {
      if (this.rsView.deleted_at) return false
      if (this.rsView.status !== 'OPEN') return false
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
    print() {
      window.print()
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
