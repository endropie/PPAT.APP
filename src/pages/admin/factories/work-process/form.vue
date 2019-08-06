<template>
<q-page padding class="form-page">
  <q-card inline class="main-box q-ma-sm" v-if="FORM.show" :dark="LAYOUT.isDark">
    <q-card-section>
      <form-header :title="FORM.title()" :subtitle="FORM.subtitle()" >
        <template slot="menu-item">
          <list-item :label="$tc('form.remove')" icon="delete" clickable @click="FORM.delete" v-close-popup v-if="$route.params.id"/>
        </template>
      </form-header>
    </q-card-section>
    <q-separator :dark="LAYOUT.isDark" />
    <q-card-section class="row q-col-gutter-x-sm">
      <!-- COLUMN::1st customer Identitity -->
      <q-input class="col-12 col-sm-6 hidden"
        name="number"
        :label="$tc('label.number')"
        v-model="rsForm.number"
        placeholder="[Auto Generate]"
         :dark="LAYOUT.isDark"
        v-validate="$route.meta.mode == 'edit' ? 'required':''"
        :error="errors.has('number')"
        :error-message="errors.first('number')"
        autofocus/>

      <ux-select-filter class="col-12 col-sm-6"
        name="line_id"
        v-model="rsForm.line_id" readonly
        :label="$tc('label.line_production')"
        :dark="LAYOUT.isDark"
        v-validate="'required'"
        :options="LineOptions.filter(x => x.row.ismain)" hide-dropdown-icon
        :error="errors.has('line_id')"
        :error-message="errors.first('line_id')" />

      <div class="col-12 col-sm-6">
        <div class="row q-col-gutter-sm">
          <q-input name="date" type="date" class="col-12 col-sm-6"
            :label="$tc('label.date')" stack-label
            v-model="rsForm.date"  readonly
            v-validate="`required`"
            :dark="LAYOUT.isDark"
            :error="errors.has('date')"
            :error-message="errors.first('date')" />


          <q-select class="col-12 col-sm-6"
            name="shift_id"
            :label="$tc('label.shift')" stack-label
            v-model="rsForm.shift_id"  readonly
            v-validate="'required'"
            :options="ShiftOptions"  hide-dropdown-icon
            map-options emit-value
            :error="errors.has('shift_id')"
          />

        </div>
      </div>

      <div class="col-12">
        <q-table ref="table-items" dense hide-bottom
          class="th-uppercase no-shadow full-width no-highlight" color="secondary"  style="display:grid"
          :dark="LAYOUT.isDark"
          :data="rsForm.work_order_items"
          :rows-per-page-options ="[0]"
          :columns="[
            { name: 'item_id', label: $tc('label.part'), align: 'left'},
            { name: 'unit_id', label: $tc('label.unit'), align: 'center'},
            { name: 'quantity', label: $tc('label.quantity'), align: 'center'},
          ]"
          :pagination=" {sortBy: null, descending: false, page: null, rowsPerPage: 0}">
          <template v-slot:body="{row}">
            <q-tr >
              <q-td key="item_id" width="40%" >
                <ux-select-filter
                  :name="`work_order_items.${row.__index}.item_id`"
                  v-model="row.item_id" readonly
                  :dark="LAYOUT.isDark" color="blue-grey-4"
                  v-validate="'required'"
                  outlined dense hide-bottom-space hide-dropdown-icon
                  :options="ItemOptions"
                  :error="errors.has(`work_order_items.${row.__index}.item_id`)" />

              </q-td>
              <q-td key="unit_id"  width="15%">
                <q-select
                  :name="`work_order_items.${row.__index}.unit_id`"
                  v-model="row.unit_id" readonly
                  outlined  dense hide-bottom-space hide-dropdown-icon
                  :dark="LAYOUT.isDark" color="blue-grey-4"
                  map-options :options="ItemUnitOptions[row.__index]"
                  v-validate="row.item_id ? 'required' : ''"
                  :error="errors.has(`work_order_items.${row.__index}.unit_id`)"
                  :disable="!rsForm.line_id || !rsForm.work_order_items[row.__index].item_id"
                  @input="(val) => setUnitReference(row.__index, val)"
                />
              </q-td>
              <q-td key="process"  width="15%">
                <q-input style="min-width:120px"
                  :name="`work_order_items.${row.__index}.process`" type="number"
                  :dark="LAYOUT.isDark"  color="blue-grey-6"
                  v-model="row.process" min="0"
                  outlined dense hide-bottom-space no-error-icon align="right"
                  v-validate="`required|min_value:0|max_value:${row.quantity}`"
                  :error="errors.has(`work_order_items.${row.__index}.process`)"
                  :error-message="errors.first(`work_order_items.${row.__index}.process`)"
                  :suffix="`/ ${row.quantity}`"
                />
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>
      <!-- COLUMN::4th Description -->
      <div class="col-12 cloumn q-mt-md">
        <q-input name="description" type="textarea" rows="3"
          stack-label :label="$tc('label.description')"
          readonly
          :dark="LAYOUT.isDark"
          v-model="rsForm.description"/>

      </div>
    </q-card-section>
    <q-separator :dark="LAYOUT.isDark" />
    <q-card-actions >
      <q-btn :label="$tc('form.cancel')" icon="cancel" color="dark" @click="FORM.toBack()"></q-btn>
      <q-btn :label="$tc('form.reset')" icon="refresh" color="light" @click="setForm(FORM.data)"></q-btn>
      <q-btn :label="$tc('form.save')" icon="save" color="positive" @click="onSave()"
        :disabled="FORM.has_relationship.length > 0">
      </q-btn>
    </q-card-actions>
  </q-card>
    <q-inner-loading :showing="FORM.loading" :dark="LAYOUT.isDark"><q-spinner-dots size="70px" color="primary" /></q-inner-loading>
</q-page>
</template>

<script>
import MixForm from '@/mixins/mix-form.vue'

export default {
  mixins: [MixForm],
  data () {

    return {
      SETTING:{
        work_orders: {
          item_lines_of_items : false,
          item_lines_customize : false,
        }
      },
      SHEET:{
        customers: {data:[], api:'/api/v1/incomes/customers?mode=all'},
        units: {data:[], api:'/api/v1/references/units?mode=all'},
        items: {data:[], api:'/api/v1/common/items?mode=all&with=prelines'},
        itemstocks: {data:[], api:'/api/v1/common/items?mode=itemstock'},
        lines: {data:[], api:'/api/v1/references/lines?mode=all'},
        shifts: {data:[], api:'/api/v1/references/shifts?mode=all'}
      },
      FORM: {
        resource:{
          uri: '/admin/factories/work-process',
          api: '/api/v1/factories/work-orders',
        },
        validator: {
          quantity: (row, max) => {
            let
              validation = ['required'],
              isMaxValidation = true

            if (row.item_id && isMaxValidation === true) {
              validation.push(`max_value:${max}`)
            }
            return validation.join('|')
          }
        }
      },
      rsForm: {},
      setDefault: () => {
        return {
          number: null,
          line_id: null,
          date: this.$app.moment().format('YYYY-MM-DD'),
          shift_id: null,
          stockist_from: 'FM',
          description: null,
          work_order_items: [
            {
              id:null,
              item_id: null,
              quantity: null,
              target:null,
              unit_id: null,
              unit_rate: 1,
              ngratio: 0,
              item: {}, unit: {},
              work_order_item_lines: [{
                  line_id: null,
                  shift_id: null,
                  begin_date: this.$app.moment().format('YYYY-MM-DD'),
                  until_date: this.$app.moment().format('YYYY-MM-DD'),
              }]
            }
          ]
        }
      }
    }
  },
  created(){
    // Component Page Mounted!
    this.init()

  },
  computed: {
    LineOptions() {
      let data = this.SHEET.lines.data || []
      return data.map(line => ({label: line.name, value: line.id, row:line}))
    },
    ShiftOptions() {
      return (this.SHEET.shifts.data.map(line => ({label: line.name, value: line.id})) || [])
    },
    CustomerOptions() {
      return (this.SHEET.customers.data.map(item => ({label: item.name, value: item.id})) || [])
    },
    UnitOptions() {
      return (this.SHEET.units.data.map(item => ({label: item.code, value: item.id})) || [])
    },
    ItemOptions() {
      let Items = this.SHEET.items.data
      return (Items.map(item => ({
        label: item.part_number + ' - ' + item.part_name,
        sublabel: item.code,
        value: item.id,
        row: item
      })) || [])
    },
    ItemUnitOptions() {
      let vars = []

      for (const i in this.rsForm.work_order_items) {
        if (this.rsForm.work_order_items.hasOwnProperty(i)) {
          let rsItem = this.rsForm.work_order_items[i]
          vars[i] = ( this.UnitOptions || [])
          vars[i] = vars[i].filter((unit)=> {
            if(!rsItem.item_id) return false
            if(rsItem.item) {

              if(rsItem.item.unit_id === unit.value) return true
              if(rsItem.item.item_units) {
                let filtered = rsItem.item.item_units.filter((fill)=> fill.unit_id === unit.value)
                if(filtered.length > 0) return true
              }
            }
            return false;
          })
        }
      }
      return vars
    },
    loadItemStock() {
      const stockist = this.rsForm.stockist_from

      let stockItem =  JSON.parse(JSON.stringify(this.MAPINGKEY['itemstocks']))
      let moveItem = {
        set: function (id, val) {
          if (!this.hasOwnProperty(id)) this[id] = 0
            this[id] += Number(val)
        },
        get: function (id) {
          return this.hasOwnProperty(id) ? this[id] : 0
        }
      }

      this.FORM.data.work_order_items.forEach(item => {
        if (stockItem.hasOwnProperty(item.item_id)) {
          stockItem[item.item_id].totals[this.FORM.data.stockist_from] += Number(item.quantity)
        }
      })

      let data = {}
      this.rsForm.work_order_items.map((detail, index) => {
        if (stockItem[detail.item_id] && detail.item_id) {
          data[index] = Number(stockItem[detail.item_id].totals[stockist] || 0) - Number(moveItem.get(detail.item_id) || 0)
          moveItem.set(detail.item_id, detail.quantity)
        }
      })

      return data
    },
    MAPINGKEY() {
      let variables = {
        'customers' : {},
        'units': {},
        'items': {},
        'itemstocks': {},
      }

      this.SHEET['customers'].data.map(value => { variables['customers'][value.id] = value })
      this.SHEET['units'].data.map(value => { variables['units'][value.id] = value })
      this.SHEET['items'].data.map(value => { variables['items'][value.id] = value })
      this.SHEET['itemstocks'].data.map(value => { variables['itemstocks'][value.id] = value })

      return variables;
    }
  },
  watch:{
      '$route' : 'init'
  },
  methods: {
    init() {
      this.FORM.load((data) => {
        this.setForm(data || this.setDefault())
      })
    },
    setForm(data) {
      this.rsForm =  data

      if(data.hasOwnProperty('has_relationship') && data['has_relationship'].length > 0) {
        this.FORM.has_relationship = data.has_relationship

        let message = data['has_relationship'].join("-")
        this.$q.dialog({
          title: 'Work Order has Related',
          message: message,
          preventClose: true,
          ok: 'Direct to Detail Page',
          cancel: 'Continue'
        }).then(() => {
          this.$router.push(`${this.FORM.resource.uri}/${data.id}`)
        }).catch(() => {
          //
        })
      }
    },
    onSave() {
      this.$validator.validate().then(result => {
        if (!result) {
          this.$q.notify({
            color:'negative', icon:'error', position:'top-right', timeout: 3000,
            message:this.$tc('messages.to_complete_form')
          })
          return
        }
        this.FORM.loading = true
        let {method, mode, apiUrl} = this.FORM.meta();
        apiUrl += `?mode=processed`
        this.$axios.set(method, apiUrl, this.rsForm)
        .then((response) => {
          let message = response.data.number + ' - #' + response.data.id
          this.FORM.response.success({message:message}, 'PROCESS CONFIRM')
          this.FORM.toView(response.data.id)
        })
        .catch((error) => {
          this.FORM.response.fields(error.response)
          this.FORM.response.error(error.response, 'PROCESS CONFIRM')
        })
        .finally(()=>{
          this.FORM.loading = false
        });

      });
    },
  },
}
</script>
