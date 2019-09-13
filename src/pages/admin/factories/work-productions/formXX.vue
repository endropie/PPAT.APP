<template>
  <q-page padding class="form-page">
    <q-card inline class="main-box q-ma-sm" v-if="FORM.show" :dark="LAYOUT.isDark">
      <q-card-section>
        <form-header :title="FORM.title()" :subtitle="FORM.subtitle()" >
        </form-header>
      </q-card-section>
      <q-separator :dark="LAYOUT.isDark" />
      <q-card-section class="row q-col-gutter-x-lg">
        <!-- COLUMN::1st customer Identitity -->
        <div class="col-12 col-sm-6">
          <div class="row q-col-gutter-x-sm">
            <ux-select-filter class="col-12"
              name="line_id"
              v-model="rsForm.line_id"
              :label="$tc('label.line_production')"
              :disable="IssetWorkProductionItems"
              :dark="LAYOUT.isDark"
              :options="LineOptions.filter(x => x.row.ismain)" clearable
              v-validate="'required'"
              :error="errors.has('line_id')"
              :error-message="errors.first('line_id')"
              @input="(val) => val ? loadItemOptions() : false" />

          </div>
        </div>
        <div class="col-12 col-sm-6">
          <div class="row q-col-gutter-x-sm">
            <ux-date name="date" type="date" class="col-12" style="min-width:200px"
              :label="$tc('label.date')" stack-label
              v-model="rsForm.date"
              v-validate="`required|date_format:yyyy-MM-dd` + FORM.ifCreate(`|after:${$app.moment().add(-1,'days').format('YYYY-MM-DD')}`,'')"
              :date-options="(date) => FORM.ifCreate(date >= $app.moment().format('YYYY/MM/DD'), true)"
              :dark="LAYOUT.isDark"
              :error="errors.has('date')"
              :error-message="errors.first('date')">

              <q-select slot="after" class="no-padding" style="min-width:80px"
                name="shift_id"
                :label="$tc('label.shift')" stack-label
                v-model="rsForm.shift_id"
                :dark="LAYOUT.isDark"
                :options="ShiftOptions" filter
                map-options emit-value
                v-validate="'required'"
                :error="errors.has('shift_id')"
              />
            </ux-date>
          </div>
        </div>
        <div class="col-12">
          <q-table dense hide-bottom
            class="no-shadow th-uppercase no-highlight"
            :dark="LAYOUT.isDark"
            :data="GroupDetails"
            :rows-per-page-options ="[0]"
            :columns="[
              { name: 'prefix', label: '',  align: 'left', visibility:false},
              { name: 'item_id', label: $tc('items.part_name'), align: 'left'},
              { name: 'part_number', label: $tc('items.part_number'), align: 'left'},
              { name: 'work_order_item_line_id', label: 'WO [#]', align: 'left'},
              { name: 'unit_id', label: $tc('label.unit'), align: 'center'},
              { name: 'quantity', label: $tc('label.quantity'), align: 'center'},
            ]"
            :pagination=" {sortBy: null, descending: false, page: null, rowsPerPage: 0}">
            <template slot="body" slot-scope="rsGroup">

              <q-tr v-for="(rsItem, index) in rsGroup.row" :key="rsItem.rowkey+'.'+index">
                <q-td key="prefix" :rsItem="rsItem" style="width:50px">
                  {{rsItem.rowkey}}::{{index}}
                  <q-btn dense flat round icon="clear" size="md" color="negative"
                    v-show="!Boolean(index)"
                    @click="removeGroup(rsItem.rowkey)"/>
                </q-td>
                <q-td key="item_id" width="30%" >
                  <ux-select-filter autofocus
                    :name="`work_production_items.${rsItem.__index}.item_id`"
                    :dark="LAYOUT.isDark"
                    v-model="rsItem.item_id"
                    v-validate="'required'"
                    outlined dense hide-bottom-space color="blue-grey-4"
                    :disable="!rsForm.line_id"
                    :options="ItemOptions" clearable
                    @input="(val) => setItemReference(rsItem.__index, val)"
                    :error="errors.has(`work_production_items.${rsItem.__index}.item_id`)"
                    :loading="SHEET['items'].loading">
                  </ux-select-filter>
                </q-td>
                <q-td key="part_number" width="30%" style="min-width:150px">
                  <q-input readonly
                    :value="rsItem.item ? rsItem.item.part_number : null"
                    outlined dense hide-bottom-space color="blue-grey-5"
                    :dark="LAYOUT.isDark" />
                </q-td>
                <q-td key="work_order_item_line_id" width="30%" >
                  <ux-select-filter autofocus
                    :name="`work_production_items.${rsItem.__index}.work_order_item_line_id`"
                    :dark="LAYOUT.isDark"
                    v-model="rsItem.work_order_item_line_id"
                    v-validate="'required'"
                    outlined dense hide-bottom-space color="blue-grey-4"
                    :disable="!rsForm.line_id"
                    :options="WorkOrderItemLineOptions.filter(x => x.item_id === rsItem.item.id)" clearable
                    :error="errors.has(`work_production_items.${rsItem.__index}.work_order_item_line_id`)"
                    :loading="SHEET['work_orders'].loading"
                  >
                    <q-tooltip v-if="!rsForm.line_id" :offset="[0, 10]">Select a Pre-Line , first! </q-tooltip>
                  </ux-select-filter>

                </q-td>
                <q-td key="unit_id"  width="15%">
                  <q-select
                    :name="`work_production_items.${rsItem.__index}.unit_id`"
                    :dark="LAYOUT.isDark"
                    v-model="rsItem.unit_id"
                    outlined dense hide-bottom-space color="blue-grey-4"
                    :options="ItemUnitOptions[rsItem.__index]"
                    map-options  emit-value
                    v-validate="rsItem.item_id ? 'required' : ''"
                    :error="errors.has(`work_production_items.${rsItem.__index}.unit_id`)"
                    :disable="!rsForm.line_id || !rsItem.item_id"
                    @input="(val) => setUnitReference(rsItem.__index, val)"
                  />
                </q-td>
                <q-td key="quantity"  width="15%">
                  <q-input type="number" style="min-width:120px"
                    :name="`work_production_items.${rsItem.__index}.quantity`"
                    :dark="LAYOUT.isDark" color="blue-grey-6"
                    v-model="rsItem.quantity"
                    outlined dense hide-bottom-space no-error-icon align="right"
                    v-validate="`required|gt_value:0|max_value:${MaxStock[rsItem.__index]}`"
                    :error="errors.has(`work_production_items.${rsItem.__index}.quantity`)"
                    :suffix="' / '+ $app.number_format(MaxStock[rsItem.__index] / (rsItem.unit_rate||1))">
                    <q-btn slot="after" dense round size="sm" icon="remove" color="red"
                      @click="removeItemRow(index)" />
                    <q-btn slot="after" dense round size="sm" icon="add" color="green"
                      :class="{'invisible': rsGroup.row.length !== (index+1)}"
                      @click="addNewItemRow(rsItem.rowkey)" />
                  </q-input>
                </q-td>
              </q-tr>
            </template>
            <q-tr slot="bottom-row">
              <q-td colspan="100%">
                <q-btn round dense @click="addNewGroup()"  icon="add" color="positive"/>
              </q-td>
            </q-tr>
          </q-table>
        </div>
        <!-- COLUMN::4th Description -->
        <div class="col-12 cloumn q-mt-md">
          <q-input name="description" type="textarea" rows="3"
            stack-label :label="$tc('label.description')"
            filled
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
      SHEET:{
        customers: {api:'/api/v1/incomes/customers?mode=all'},
        units: {api:'/api/v1/references/units?mode=all'},
        lines: {api:'/api/v1/references/lines?mode=all'},
        shifts: {api:'/api/v1/references/shifts?mode=all'},
        items: {autoload:false, api:'/api/v1/common/items?mode=all'},
        work_orders: {autoload:false, api:'/api/v1/factories/work-orders?mode=item-lines'},
      },
      FORM: {
        resource:{
          uri: '/admin/factories/work-productions',
          api: '/api/v1/factories/work-productions',
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
          work_production_items: [
            {
              id:null,
              item_id: null,
              quantity: null,
              target:null,
              unit_id: null,
              unit_rate: 1,
              ngratio: 0,
              item: {}, unit: {},
              rowkey: 0,
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
    GroupDetails: {
      get() {
        if(!this.rsForm.work_production_items.length) return []
        return Object.values(this.$_.groupBy(this.rsForm.work_production_items, 'rowkey'))
      }
    },
    IssetWorkProductionItems() {
      if (this.rsForm.work_production_items) {
        return this.rsForm.work_production_items.some((item) => item.item_id)
      }
      return false
    },
    WorkOrderItemLineOptions() {
      if (!this.rsForm.line_id) return []
      if (!this.SHEET['work_orders'].data.length) return []

      let Data = []
      let Item = []
      this.SHEET['work_orders'].data.map(rs => {
        rs.work_order_item_lines.map(detail => {
          if (this.rsForm.line_id !== detail.line_id) return false
          // console.warn('dd',detail)
          if (detail.unit_amount <= detail.amount_line) return false
          detail.work_order_number = rs.number
          Data.push(detail)
          if (!Item.find(x => x === (detail.work_order_item.item_id || null))) Item.push(detail.work_order_item.item_id)
        })
      })

      if(Item.length) this.SHEET.load('items', `or_ids=${Item.join(',')}`)

      return Data.map(detail => {
        let total = (Number(detail.unit_amount) - Number(detail.amount_line))
        return ({
          label: detail.work_order_number,
          value: detail.id,
          stamp: `#${detail.id}`,
          item_id: (detail.work_order_item.item_id || null),
          rowdata: detail
        })
      })
    },
    LineOptions() {
      let data = this.SHEET.lines.data || []
      return data.map(line => ({label: line.name, value: line.id, row:line}))
    },
    ShiftOptions() {
      return (this.SHEET.shifts.data.map(line => ({label: line.name, value: line.id})) || [])
    },
    UnitOptions() {
      return (this.SHEET.units.data.map(item => ({label: item.code, value: item.id})) || [])
    },
    ItemOptions() {
      if (this.SHEET.items.data.length <= 0) return []

      const stockist = 'WO'
      let OrKeys = this.FORM.data.work_production_items.map(x => x.item_id, [])

      let ITEM = this.SHEET.items.data.filter((item) => {
        if (!item.item_prelines || !item.item_prelines.length) return false
        if (item.item_prelines[0].line_id !== this.rsForm.line_id) return false
        if(item.totals[stockist] <= 0 && !OrKeys.find(x=> x === item.id)) return false
        else return true
      })
      return (ITEM.map(item => ({
        label: item.part_name,
        sublabel: `[${item.code}] ${item.part_number}`,
        value: item.id,
        disable: !item.enable,
        row: item
      })) || [])
    },
    ItemUnitOptions() {
      let vars = []

      for (const i in this.rsForm.work_production_items) {
        if (this.rsForm.work_production_items.hasOwnProperty(i)) {
          let rsItem = this.rsForm.work_production_items[i]
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
    MaxStock() {
      const stockist = this.rsForm.stockist_from

      let stockItem =  JSON.parse(JSON.stringify(this.MAPINGKEY['items']))
      let moveItem = {
        set: function (id, val) {
          if (!this.hasOwnProperty(id)) this[id] = 0
            this[id] += Number(val)
        },
        get: function (id) {
          return this.hasOwnProperty(id) ? this[id] : 0
        }
      }

      this.FORM.data.work_production_items.forEach(item => {
        if (stockItem.hasOwnProperty(item.item_id)) {
          stockItem[item.item_id].totals[this.FORM.data.stockist_from] += Number(item.unit_amount)
        }
      })

      let data = {}
      this.rsForm.work_production_items.map((detail, index) => {
        if (stockItem[detail.item_id] && detail.item_id) {
          data[index] = Number(stockItem[detail.item_id].totals[stockist] || 0) - Number(moveItem.get(detail.item_id) || 0)
          moveItem.set(detail.item_id, detail.quantity * detail.unit_rate)
        }
      })

      return data
    },
    MAPINGKEY() {
      let variables = {
        'customers' : {},
        'units': {},
        'items': {},
      }

      this.SHEET['customers'].data.map(value => { variables['customers'][value.id] = value })
      this.SHEET['units'].data.map(value => { variables['units'][value.id] = value })
      this.SHEET['items'].data.map(value => { variables['items'][value.id] = value })

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
      this.rsForm =  JSON.parse(JSON.stringify(data))
      if(data.id) this.loadItemOptions(data)
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
    loadItemOptions(data = this.FORM.data) {
      // let params = ['has_stocks=WO']
      // this.SHEET.load('items', params.join('&'))
      let params = ['has_amount_line=true', `work_order_item_line_id=${data.line_id}`]
      this.SHEET.load('work_orders', params.join('&'))

    },
    setItemReference(index, val) {

       if(!val){
        this.rsForm.work_production_items[index].unit_id = null
        this.rsForm.work_production_items[index].unit = {}
        this.rsForm.work_production_items[index].item = {}
      }
      else{
        this.rsForm.work_production_items[index].item = this.MAPINGKEY['items'][val]

        let baseUnitID = this.MAPINGKEY['items'][val].unit_id
        this.rsForm.work_production_items[index].unit_id = baseUnitID
        this.rsForm.work_production_items[index].unit_rate = 1
        this.rsForm.work_production_items[index].unit = this.MAPINGKEY['units'][baseUnitID]
      }
    },
    setUnitReference(index, val) {

      if(!val) return;
      else if (this.rsForm.work_production_items[index].item.unit_id === val) {
        this.rsForm.work_production_items[index].unit_rate = 1
      }
      else {
        if(this.rsForm.work_production_items[index].item.item_units) {
          this.rsForm.work_production_items[index].item.item_units.find((unitItem)=> {
            if (unitItem.unit_id == val) {
              this.rsForm.work_production_items[index].unit_rate = unitItem.rate
              return true
            }
          })
        }
      }
    },
    addNewGroup() {
      let newEntri = Object.assign(this.setDefault().work_production_items[0], {'rowkey': this.GroupDetails.length || 0})
      this.rsForm.work_production_items.push(newEntri)
    },
    removeGroup(rowkey) {
      this.rsForm.work_production_items = this.rsForm.work_production_items.filter(x => x.rowkey !== rowkey)
        // if(this.rsForm.work_production_items.length < 1) this.addNewGroup()
    },
    addNewItemRow(rowkey) {
      if (typeof itemIndex === 'undefined') return console.warn('INDEXT NOT DEFINED!')
      let newEntri = Object.assign(this.setDefault().work_production_items[0], {'rowkey': rowkey})

      this.rsForm.work_production_items.push(newEntri)
    },
    removeItemRow(itemIndex, lineIndex) {
      this.rsForm.work_production_items = this.rsForm.work_production_items.map(x => {
        if (x.rowkey === rowkey) {

        }
      })
      this.rsForm.work_production_items[itemIndex].work_order_item_lines.splice(lineIndex, 1)
      if(this.rsForm.work_production_items[itemIndex].work_order_item_lines.length < 1) this.addNewItemRow(itemIndex)
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

        // console.warn(this.rsForm)
        // return;
        this.FORM.loading = true
        let {method, mode, apiUrl} = this.FORM.meta();
        this.$axios.set(method, apiUrl, this.rsForm)
        .then((response) => {
          let message = response.data.number + ' - #' + response.data.id
          this.FORM.response.success({message:message})
          this.FORM.toView(response.data.id)
        })
        .catch((error) => {
          this.FORM.response.fields(error.response)
          this.FORM.response.error(error.response || error, this.$tc('messages.fail', 1, {v:this.$tc('form.save')}).toUpperCase())
        })
        .finally(()=>{
          this.FORM.loading = false
        });

      });
    },
  },
}
</script>

<style lang="stylus">
.fit-input.q-field
  .q-field__control,
  .q-field__native
    min-height 24px !important

  .q-field__control, .q-field__marginal
    height 36px
    padding 0 6px
  .q-field__native, .q-field__prefix, .q-field__suffix
    line-height 24px

  .q-select__input
    line-height 24px

</style>

