<template>
  <q-page padding class="row justify-center">
    <page-print class="q-pa-md q-pr-lg shadow-2 scroll" v-if="VIEW.show" style="max-width:210mm">
      <div slot="header-tags">
        <q-chip tag outline small color="negative" v-if="(rsView.revise_id != null)">
          Revised
        </q-chip>
      </div>
      <div class="row justify-between q-gutter-y-md" >
        <div class="profile">
          <div class="text-weight-regular uppercase">To: {{rsView.customer_name}}</div>
          <address class="text-weight-light">{{rsView.customer_address}}</address>
          <div class="text-weight-light ">Phone: {{rsView.customer_phone}}</div>
        </div>
        <div class="info">
          <q-markup-table separator="cell" dense:dark="LAYOUT.isDark"
            class="bordered super-dense no-shadow no-margin th-text-left">
            <tr>
              <th>No. SJ-OUT</th><td>{{ rsView.number }}</td>
            </tr>
            <tr>
              <th>{{$tc('label.date')}}</th>
              <td>{{ rsView.date ? $app.moment(rsView.date +' '+ rsView.time).format('DD/MM/YYYY hh:mm') : '-'}}</td>
            </tr>
            <tr>
              <th>SALE ORDER</th><td>{{ rsView.request_order ? rsView.request_order.number : '-' }}</td>
            </tr>
          </q-markup-table>
        </div>
        <div class="col-12">
          <q-table ref="table" class="bordered no-shadow no-highlight" color="secondary" separator="vertical" dense hide-bottom
            :data="rsView.delivery_order_items"
            no-data-label = "No Production"
            :columns="[
              { name: 'code', label: 'code', align: 'left', field: (v)=> v.item.code},
              { name: 'part_name', label: this.$tc('label.name', 1, {v:this.$tc('label.part')}), align: 'left', field: (v)=> v.item.part_name},
              { name: 'quantity', label: $tc('label.quantity'), align: 'right', field: (v)=> v.quantity},
              { name: 'unit_id', label: $tc('label.unit'), align: 'center', field: (v)=> v.unit.code},
            ]"
          >

          </q-table>
        </div>
        <div class="col-12">
            <div class="q-my-xs text-italic">{{$tc('label.description')}}:</div>
            <div class="q-my-xs text-weight-light" style="min-height:30px">{{ rsView.description }}</div>
        </div>
        <div class="col-12 q-gutter-xs print-hide" style="padding-top:50px">
          <q-btn :label="$tc('form.back')" :icon-right="btnIcon('cancel')"  color="dark" :to="`${VIEW.resource.uri}?return`"></q-btn>
          <q-btn :label="$tc('form.print')" :icon-right="btnIcon('print')" color="grey" @click.native="print()" ></q-btn>
          <!-- <q-btn color="negative" :icon-right="btnIcon('file_copy')" label="Revision" :to="`${VIEW.resource.uri}/${$route.params.id}/revision`" v-if="IS_EDITABLE"></q-btn> -->

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

    <q-inner-loading :showing="VIEW.loading">
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
          api: '/api/v1/incomes/delivery-orders',
          uri: '/admin/incomes/delivery/delivery-orders',
          params: '?mode=view'
        }
      },
      rsView: {},
    }
  },
  created() {
    this.init()
  },
  computed: {
    IS_VOID() {
      if (this.IS_EDITABLE) return false
      if (['VOID'].find(x => x === this.rsView.status)) return false
      return true
    },
    IS_EDITABLE() {
      if (this.rsView.deleted_at) return false
      if (Object.keys(this.rsView.has_relationship || {}).length > 0) return false
      if (this.rsView.hasOwnProperty('revise_id') && !this.rsView.revise_id) return false
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
    },
    routing() {
        this.VIEW.show = false
        this.VIEW.loading = true
        let url = this.VIEW.resource.api +'/'+ this.$route.params.id + '?mode=view'
        this.$axios.get(url)
          .then((response) => {
            // console.warn('response->', response.data)
            const data = response.data
            this.setRsView(data)
          })
          .catch(error => {
            console.warn('[FORM:routing()]', error)
            this.VIEW.onCatch(error.response, 'Load form')
          })
          .finally(()=>{
            this.VIEW.show = true
            setTimeout(() => {
              this.VIEW.loading = false
            }, 1000);
          })
    },
  }
}
</script>
