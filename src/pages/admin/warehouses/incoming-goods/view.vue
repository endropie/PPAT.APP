<template>
  <q-page padding class="row justify-center" v-if="SHOW" :dark="LAYOUT.isDark">
    <page-print class="q-pa-md q-pr-lg shadow-2" style="max-width:210mm;">
      <div slot="header-title">
        PPA - INCOMING GOODS
      </div>
      <div slot="header-tags">
        <q-chip tag outline small color="negative" v-if="rsView.revise_id">
          Revised
        </q-chip>
      </div>
      <div class="row  q-gutter-md" >
        <div class="col-12">
          <div class="row q-gutter-sm" :class="$q.screen.lt.sm ? 'justify-start':'justify-between'">
              <q-list class="identity" no-border dense>
                <q-item multiline>
                  <q-item-section>
                    <q-item-label>{{ rsView.customer.name }}</q-item-label>
                    <q-item-label caption>Customer</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item multiline>
                  <q-item-section>
                    <q-item-label>{{ rsView.reference_number || '-'}}</q-item-label>
                    <q-item-label caption>
                      Refrence {{ rsView.reference_date ? 'at '+$app.moment(rsView.reference_date).format('DD/MM/YYYY') : ''}}
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
              <q-list class="identity" no-border dense>
                <q-item multiline>
                  <q-item-section>
                    <q-item-label>No. {{rsView.number}}</q-item-label>
                    <q-item-label caption>created at {{ rsView.created_at ? $app.moment(rsView.created_at).format('DD/MM/YYYY hh:mm') : '' }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item multiline>
                  <q-item-section>
                    <q-item-label>No. REG {{rsView.registration}}</q-item-label>
                    <q-item-label caption>Income at {{ rsView.date ? $app.moment(rsView.date +' '+ rsView.time).format('DD/MM/YYYY hh:mm') : '' }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
          </div>
        </div>
        <div class="col-12">
          <q-table ref="table" class="table-border d-grid no-shadow" color="secondary" separator="vertical" dense hide-bottom :dark="LAYOUT.isDark"
            :data="rsView.incoming_good_items" 
            no-data-label = "No Production"
            :columns="[
              { name: 'code', label: 'code', align: 'left', field: (v)=> v.item.code},
              { name: 'part_name', label: 'Part name', align: 'left', field: (v)=> v.item.part_name},
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
        <div class="col-12 q-gutter-xs " style="padding-top:50px">
          <q-btn label="Back" color="dark" :icon-right="btnIcon('cancel')"  :to="`${VIEW.resource.uri}?return`"></q-btn>
          <q-btn label="Edit" color="positive" :icon-right="btnIcon('edit')" :to="`${VIEW.resource.uri}/${$route.params.id}/edit`" v-if="IS_EDITABLE"></q-btn>
          <q-btn label="Print" color="grey" :icon-right="btnIcon('print')" @click.native="print()" ></q-btn>
          <q-btn label="Delete" color="negative" :icon-right="btnIcon('delete')" outline @click="VIEW.delete" v-if="IS_EDITABLE"></q-btn>
        </div>
      </div>
    </page-print>
    
    <q-inner-loading :visible="VIEW.loading">
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
    IS_EDITABLE() {
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
