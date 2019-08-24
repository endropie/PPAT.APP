<template>
  <q-page class="row justify-center" :dark="LAYOUT.isDark" style="min-width:210mm;">
    <page-print v-if="VIEW.show" class="q-ma-md q-pr-lg shadow-2" style="max-width:210mm;">
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
              { name: 'code', label:  this.$tc('label.code'), align: 'left', field: (v)=> v.item.code},
              { name: 'part_name', label: this.$tc('items.part_name'), align: 'left', field: (v)=> v.item.part_name},
              { name: 'part_number', label: this.$tc('items.part_number'), align: 'left', field: (v)=> v.item.part_number},
              { name: 'unit_id', label: $tc('label.unit'), align: 'center', field: (v)=> v.unit.code},
              { name: 'quantity', label: $tc('label.quantity'), align: 'right',
                field: (v)=> v.quantity, format: (v) => $app.number_format(v)},
              { name: 'valid', label: $tc('label.qty', 1,{v:'Valid'}), align: 'right',
                field: (v)=> v.valid, format: (v) => $app.number_format(v)},
              { name: 'note', label: $tc('label.note'), align: 'left', field: (v)=> v.note},
            ]"
          >
          </q-table>
        </div>
        <div class="col-12">
            <div class="q-my-xs text-italic">{{$tc('label.description')}}:</div>
            <div class="q-my-xs text-weight-light" style="min-height:30px">{{ rsView.description }}</div>
        </div>
      </div>
      <div class="q-gutter-xs print-hide" style="padding-top:50px">
        <q-btn :label="$tc('form.cancel')" color="dark" icon="cancel" :to="`${VIEW.resource.uri}?return`" />
        <q-btn :label="$tc('form.print')" color="grey" icon="print" @click.native="print()" />
        <q-btn :label="$tc('form.edit')" color="green" icon="edit" :to="`${VIEW.resource.uri}/${ROUTE.params.id}/edit`"
          v-if="IS_EDITABLE && isCanUpdate" />

        <ux-btn-dropdown color="blue-grey" no-caps class="float-right"
          :label="$tc('label.others')"
          :options="[
            { label: $tc('form.add_new'), color:'green', icon: 'add',
              hidden: !isCanCreate,
              detail: $tc('messages.process_create'),
              actions: () => {
                $router.push(`${VIEW.resource.uri}/create`)
              }
            },
            { label: 'Delete', color:'red', icon: 'delete',
              hidden: !IS_EDITABLE || !isCanDelete,
              detail: $tc('messages.process_delete'),
              actions: () => {
                VIEW.delete()
              }
            },
            { label: $tc('form.validation'), color:'teal', icon: 'check',
              hidden: !IS_EDITABLE || !isCanValidation,
              detail:$tc('messages.process_validation'),
              actions: () => {
                setValidation()
              }
            },
            { label: 'VOID', color:'red', icon: 'block',
              hidden: !IS_VOID,
              detail: $tc('messages.process_void'),
              actions: () => {
                VIEW.void(()=> init() )
              }
            },
          ]"/>
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
    isCanCreate() {
      return this.$app.can('incoming-goods-create')
    },
    isCanUpdate() {
      return this.$app.can('incoming-goods-update')
    },
    isCanDelete() {
      return this.$app.can('incoming-goods-delete')
    },
    isCanValidation() {
      return this.$app.can('incoming-goods-delete')
    },
    IS_VOID() {
      if (this.IS_EDITABLE) return false
      if (this.rsView.deleted_at) return false
      if (!this.$app.can('incoming-goods-void')) return false
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
      this.$router.push(`${this.VIEW.resource.uri}/${this.ROUTE.params.id}/validation`)
      return false

      this.$q.dialog({
        title: this.$tc('form.validation'),
        message: this.$tc('messages.to_sure', 1, {v:this.$tc('form.validation')}),
        dark: this.LAYOUT.isDark, cancel: true, persistent: true,
      }).onOk(() => {

        this.$axios.set('PUT', `${this.VIEW.resource.api}/${this.rsView.id}?mode=validation&nodata`, null)
        .then(response => {
          this.$app.notify.success({
            message: this.$tc('messages.success_validated').toUpperCase(),
            detail: this.$tc('messages.form_has_validated',1, {v: this.rsView.number})
          })
          setTimeout(() => {
            this.init()
          }, 500)

        })
        .catch(error => {
          this.$app.response.error(error.response, this.$tc('messages.fail', 1, {v: this.$tc('form.validation')}))
        })
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
    setView(data) {
      this.rsView =  data
    },
  }
}
</script>
