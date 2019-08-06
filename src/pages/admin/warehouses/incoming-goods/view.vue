<template>
  <q-page class="row justify-center" v-if="VIEW.show" :dark="LAYOUT.isDark" style="min-width:210mm;">
    <page-print class="q-ma-md q-pr-lg shadow-2" style="max-width:210mm;">
      <span slot="header-title" style="font-size:26px">Priuk Perkasa Abadi, PT</span>
      <span slot="header-subtitle" style="font-size:16px">Warehouses - Incoming Good</span>
      <div slot="header-tags">
        <q-chip tag outline small color="negative" label="Revised"
          v-if="rsView.revise_id" />
        <ux-chip-status :row="rsView" tag outline small square icon='bookmark' />
      </div>
      <div class="row q-col-gutter-md" >
        <div class="col-12">
          <div class="row justify-between q-gutter-sm" >
            <div class="items-end q-pt-lg">
              <div class="text-h6">
                INCOMING GOOD
              </div>
              <q-markup-table class="super-dense no-shadow" :dark="LAYOUT.isDark">
                <tr>
                  <th class="text-left">{{$tc('general.customer')}}</th>
                  <td>{{ rsView.customer.name }}</td>
                </tr>
                <tr>
                  <th class="text-left">{{$tc('warehouses.reference_number')}}</th>
                  <td>{{ rsView.reference_number || '-'}}</td>
                </tr>
              </q-markup-table>
            </div>
            <div>
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
                  <th>{{$tc('warehouses.registration')}}</th>
                  <td>{{rsView.registration}}</td>
                </tr>
              </q-markup-table>
            </div>
          </div>
        </div>
        <div class="col-12">
          <q-table ref="table" class="no-highlight bordered no-shadow" color="secondary" separator="vertical" dense hide-bottom :dark="LAYOUT.isDark"
            :data="rsView.incoming_good_items"
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
          <q-btn :label="$tc('form.cancel')" color="dark" :icon="btnIcon('cancel')"  :to="`${VIEW.resource.uri}?return`"></q-btn>
          <q-btn :label="$tc('form.edit')" color="positive" :icon="btnIcon('edit')" :to="`${VIEW.resource.uri}/${$route.params.id}/edit`" v-if="IS_EDITABLE"></q-btn>
          <q-btn :label="$tc('form.print')" color="grey" :icon="btnIcon('print')" @click.native="print()" ></q-btn>

          <ux-btn-dropdown :label="$tc('label.others')" color="blue-grey" no-caps class="float-right"
            :options="[
              { label: 'Delete', color:'red', icon: 'delete', hidden: !IS_EDITABLE,
                detail: $tc('messages.process_delete'),
                actions: () => {
                  VIEW.delete()
                }
              },
              { label: $tc('form.validation'), color:'teal', icon: 'check', hidden: !IS_EDITABLE,
                detail:$tc('messages.process_validation'),
                actions: () => {
                  setValidation()
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
import { error } from 'util';

export default {
  mixins: [MixView],
  components: { PagePrint, PagePrintBreak },
  data () {
    return {
      VIEW: {
        resource:{
          api: '/api/v1/warehouses/incoming-goods',
          uri: '/admin/warehouses/incoming-goods',
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
      if (this.rsView.deleted_at || this.rsView.status !== 'OPEN') return false
      if (Object.keys(this.rsView.has_relationship || {}).length > 0) return false

      return true
    },
  },
  methods: {
    setValidation () {
      this.$q.dialog({
        dark: this.LAYOUT.isDark,
        title: this.$tc('form.validation'),
        message: this.$tc('messages.to_sure', 1, {v:this.$tc('form.validation')}),
        cancel: true,
        persistent: true
      }).onOk(() => {

        this.$axios.set('PUT', `${this.VIEW.resource.api}/${this.rsView.id}?mode=validation`, this.rsView)
        .then(response => {
          this.$app.notify.success({
            message: this.$tc('messages.success_validated').toUpperCase(),
            detail: this.$tc('messages.form_has_validated',1, {v: this.rsView.number})
          })
          setTimeout(() => {
            this.init()
          }, 1500)

        })
        .catch(error => {
          this.$app.response.error(error.response, this.$tc('messages.fail', 1, {v: this.$tc('form.validation')}))
        })
      })
      .onCancel(() => {
          // console.info('>>>> Canceled!!')
      })

    },
    init() {
      this.VIEW.load((data) => {
        this.setView(data || {})
      })
    },
    btnIcon (str) {
      return !this.$q.screen.lt.sm ? str : undefined
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
