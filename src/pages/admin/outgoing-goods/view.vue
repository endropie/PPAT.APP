<template>
  <q-page class="row justify-center" :dark="LAYOUT.isDark" style="min-width:210mm;">
    <page-print v-if="VIEW.show" class="q-ma-md q-pr-lg shadow-2" style="max-width:210mm;" minimaze>
      <span slot="header-title" style="">Priuk Perkasa Abadi, PT</span>
      <span slot="header-subtitle" style="">Warehouses - Outgoing Good</span>
      <div slot="header-tags" class="print-hide">
      <q-chip square outline
        color="blue-grey" text-color="white"
        label="RET" v-if="rsView.transaction === 'RETURN'" />
        <ux-chip-status :row="rsView" tag outline small square icon='bookmark' />
      </div>
      <div class="row q-col-gutter-md" >
        <div class="col-12">
          <div class="row justify-between q-gutter-sm" >
            <div class="items-end">
              <q-markup-table class="super-dense no-shadow" :dark="LAYOUT.isDark">
                <tr>
                  <th class="text-left">{{$tc('general.customer')}}</th>
                  <td>{{ rsView.customer.name }}</td>
                </tr>
                <tr>
                  <th class="text-left">{{$tc('label.phone')}}</th>
                  <td>{{ rsView.customer_phone || '-'}}</td>
                </tr>
                <tr>
                  <th class="text-left vertical-top" style="XXvertical-align:top">{{$tc('label.address')}}</th>
                  <td><address class="address">{{ rsView.customer_address || '-'}}</address></td>
                </tr>
              </q-markup-table>
            </div>
            <div>
              <q-markup-table bordered class="super-dense no-shadow" separator="cell" :dark="LAYOUT.isDark">
                <tr>
                  <th>{{$tc('label.number')}}</th>
                  <td>
                    {{rsView.full_number}}
                  </td>
                </tr>
                <tr>
                  <th>{{$tc('label.date')}}</th>
                  <td>{{ $app.date_format(rsView.date) }}</td>
                </tr>
              </q-markup-table>
            </div>
          </div>
        </div>
        <div class="col-12">
          <q-table ref="table" class="no-highlight bordered no-shadow" color="secondary" separator="vertical" dense hide-bottom :dark="LAYOUT.isDark"
            :data="rsView.outgoing_good_items"
            no-data-label = "No Detail"
            :rows-per-page-options ="[0]"
            :pagination="{page: null, rowsPerPage: 0 }"
            :columns="[
              { name: 'code', label:  this.$tc('label.code'), align: 'left', field: (v)=> v.item.code},
              { name: 'part_name', label: this.$tc('items.part_name'), align: 'left', field: (v)=> v.item.part_name},
              { name: 'part_number', label: this.$tc('items.part_number'), align: 'left', field: (v)=> v.item.part_number},
              { name: 'unit_id', label: $tc('label.unit'), align: 'center', field: (v)=> v.unit.code},
              { name: 'quantity', label: $tc('label.quantity'), align: 'right',
                field: (v)=> v.quantity, format: (v) => $app.number_format(v)},
              { name: 'note', label: $tc('label.note'), align: 'left', field: (v)=> v.note},
            ]"
          >
          </q-table>
        </div>
        <div class="col-12">
            <div class="q-my-xs text-italic">{{$tc('label.description')}}:</div>
            <div class="q-my-xs text-weight-light" style="min-height:30px">{{ rsView.description }}</div>
        </div>
        <div class="col-12">
          <q-markup-table class="signature no-shadow">
            <tr class="text-center">
              <td width="21%">
                <div class="sign-name">Diterima Oleh</div>
                <div class="sign-tag">( . . . . . . . . . . . . . . )</div>
              </td>
              <td width="21%">
                <div class="sign-name">Gudang Oleh</div>
                <div class="sign-tag">( . . . . . . . . . . . . . . )</div>
              </td>
              <td width="21%">
                <div class="sign-name">Security</div>
                <div class="sign-tag">( . . . . . . . . . . . . . . )</div>
              </td>
              <td width="35%">
                <div class="sign-name">Hormat Kami</div>
                <div class="sign-tag">( . . . . . . . . . . . . . . )</div>
              </td>
            </tr>
          </q-markup-table>
        </div>
      </div>
      <div class="q-gutter-xs print-hide" style="padding-top:50px">
        <q-btn :label="$tc('form.back')" color="dark" icon="cancel" :to="`${VIEW.resource.uri}?return`" />
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
            { label: String('Delete').toUpperCase(), color:'red', icon: 'delete',
              hidden: !IS_EDITABLE || !isCanDelete,
              detail: $tc('messages.process_delete'),
              actions: () => {
                VIEW.delete()
              }
            },
            { label: $tc('form.validation').toUpperCase(), color:'teal', icon: 'check',
              hidden: !IS_EDITABLE || !this.$app.can('outgoing-goods-validation'),
              detail:$tc('messages.process_validation'),
              actions: () => {
                setValidation()
              }
            },
            { label: (`${$tc('form.revision')}`).toUpperCase(), color:'teal', icon: 'check',
              hidden: !IS_REVISE || rsView.status !== 'VALIDATED' || !this.$app.can('outgoing-goods-revision'),
              // detail:$tc('messages.process_revision'),
              actions: () => {
                setRevision()
              }
            },
            { label: (`${$tc('form.revision')} [${rsView.status}]`).toUpperCase(), color:'teal', icon: 'check',
              hidden: !IS_REVISE || rsView.status !== 'REJECTED' || !this.$app.can('outgoing-goods-create'),
              // detail:$tc('messages.process_revision'),
              actions: () => {
                setRestoration()
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
          api: '/api/v1/warehouses/outgoing-goods',
          uri: '/admin/outgoing-goods',
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
      return this.$app.can('outgoing-goods-create')
    },
    isCanUpdate() {
      return this.$app.can('outgoing-goods-update')
    },
    isCanDelete() {
      return this.$app.can('outgoing-goods-delete')
    },
    IS_REVISE() {
      if (this.IS_EDITABLE) return false
      if (this.rsView.deleted_at) return false
      if (['VOID','OPEN'].find(x => x === this.rsView.status)) return false
      return true
    },
    IS_VOID() {
      if (this.IS_EDITABLE) return false
      if (this.rsView.deleted_at) return false
      if (!this.$app.can('outgoing-goods-void')) return false
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
    setRevision () {
      this.$router.push(`${this.VIEW.resource.uri}/${this.ROUTE.params.id}/revision`)
    },
    setValidation () {
      const submit = () => {

        this.VIEW.loading = true
        let apiUrl = this.VIEW.resource.api + '/' + this.ROUTE.params.id
        apiUrl += '?mode=validation&nodata=true'
        this.$axios.put(apiUrl, {})
        .then((response) => {
          this.$app.notify.success({
            message: this.$tc('messages.success_validated').toUpperCase(),
            detail: this.$tc('messages.form_has_validated',1, {v:response.data.number})
          })
          this.init()
        })
        .catch((error) => {
          this.$app.response.error(error.response || error, 'VALIDATION FAILED');
        })
        .finally(()=>{
          setTimeout(() => {
            this.VIEW.loading = false
          }, 1000)

        });
      }

      this.$q.dialog({
        title: this.$tc('form.confirm'),
        message: this.$tc('messages.to_sure', 1, {v: this.$tc('form.validation')}),
        cancel: true,
        persistent: true
      }).onOk(() => {
        submit()
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
      this.rsView =  JSON.parse(JSON.stringify(data))
    },
  }
}
</script>

<style lang="stylus">
.signature
  table { page-break-inside:auto }
  tr    { page-break-inside:avoid; page-break-after:auto }
.sign-name
  height 50px
.address
  white-space: pre-line
</style>
