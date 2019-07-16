<template>
<q-page padding class="form-page" v-if="SHOW">
  <q-card inline class="main-box q-ma-sm" :dark="LAYOUT.isDark">
    <q-card-section>
      <form-header :title="FORM.title()" :subtitle="FORM.subtitle()" >
        <template slot="menu-item">
          <list-item :label="$tc('label.remove')" icon="delete" clickable @click="FORM.delete" v-close-popup v-if="$route.params.id"/>
        </template>
      </form-header>
    </q-card-section>
    <q-separator :dark="LAYOUT.isDark" />
    <q-card-section class="row q-col-gutter-x-sm">
      <!-- COLUMN::1st customer Identitity -->
      <q-input class="col-12 col-sm-6"
        name="number" 
        label="No Transaction" 
        v-model="rsForm.number" 
        placeholder="[Auto Generate]" 
         :dark="LAYOUT.isDark"
        v-validate="$route.meta.mode == 'edit' ? 'required':''" 
        :error="errors.has('number')" 
        :error-message="errors.first('number')"
        autofocus/>
        
      <select-filter class="col-12 col-sm-6"
        name="line_id" 
        v-model="rsForm.line_id" 
        label="Line Production" 
        :disable="IssetWorkOrderItems" 
        :dark="LAYOUT.isDark"
        v-validate="'required'"
        :options="LineOptions" clearable
        :error="errors.has('line_id')" 
        :error-message="errors.first('line_id')"/>
      <q-tooltip :disable="!IssetWorkOrderItems" :offset="[0, 10]">To change, Please delete Work-Order items first!</q-tooltip>

        
      <!-- COLUMN::2th Detail Items & Lines -->
      <q-field class="col-12" prefix="Material production" borderless dense 
        :dark="LAYOUT.isDark"
        :error="errors.has(`stockist_from`)" 
        :error-message="errors.first('stockist_from')">
        <q-option-group :name="`stockist_from`" type="radio" 
          v-model="rsForm.stockist_from" inline
          :dark="LAYOUT.isDark"
          :options="[
            {value: 'FM', label: 'FRESH MATERIAL'},
            {value: 'NG', label: 'NOT GOOD',  color: 'warning' },
            {value: 'NGR', label: 'REPAIR',  color: 'orange-8' },
          ]"
          v-validate="'required'"
          
        />
      </q-field>
      <div class="col-12">
        <q-table ref="table-items" dense hide-bottom
          class="no-shadow inline full-width no-hightlight" color="secondary"  style="display:grid"
          :dark="LAYOUT.isDark"
          :data="rsForm.work_order_items" 
          :rows-per-page-options ="[0]"
          :columns="[
            { name: 'prefix', label: '',  align: 'left', visibility:false},
            { name: 'item_id', label: 'Part item ', align: 'left'}, 
            { name: 'target', label: 'Quantity', align: 'center'},
            { name: 'unit_id', label: 'Unit', align: 'center'},
            { name: 'ngratio', label: 'NG Ratio', align: 'center'},
            { name: 'quantity', label: 'Total', align: 'center'},
          ]"
          :pagination=" {sortBy: null, descending: false, page: null, rowsPerPage: 0}">
          <template slot="body" slot-scope="rsItem">
            <q-tr :rsItem="rsItem">
              <q-td key="prefix" :rsItem="rsItem" style="width:50px">
                <q-btn dense flat round icon="clear" color="negative" @click="removeItem(rsItem.row.__index)"/>
              </q-td>
              <q-td key="item_id" width="40%" >
                <select-filter
                  :name="`work_order_items.${rsItem.row.__index}.item_id`" 
                  :dark="LAYOUT.isDark"
                  v-model="rsItem.row.item_id" 
                  v-validate="'required'"
                  filled dense hide-bottom-space color="blue-grey-4"
                  :disable="!rsForm.line_id"
                  :options="ItemOptions" clearable
                  @input="(val) => setItemReference(rsItem.row.__index, val)"
                  :error="errors.has(`work_order_items.${rsItem.row.__index}.item_id`)"
                />
                <q-tooltip v-if="!rsForm.line_id" :offset="[0, 10]">Select a Pre-Line , first! </q-tooltip>
                
              </q-td>
              <q-td key="target"  width="15%">
                <q-input
                  :name="`work_order_items.${rsItem.row.__index}.target`" type="number"
                  :min="0" align="center" 
                  :dark="LAYOUT.isDark"
                  v-model="rsItem.row.target"  
                  filled dense hide-bottom-space color="blue-grey-4"
                  v-validate="FORM.validator.quantity(rsItem.row, loadItemStock[rsItem.row.__index])"
                  :error="errors.has(`work_order_items.${rsItem.row.__index}.target`)"
                  :disable="!rsForm.line_id || !rsForm.work_order_items[rsItem.row.__index].item_id"
                  @input="() => { rsItem.row.quantity = calcQuantity(rsItem.row)}"
                />
              </q-td>
              <q-td key="unit_id"  width="15%">
                <q-select 
                  :name="`work_order_items.${rsItem.row.__index}.unit_id`" 
                  :dark="LAYOUT.isDark"
                  v-model="rsItem.row.unit_id" 
                  filled dense hide-bottom-space color="blue-grey-4"
                  :options="ItemUnitOptions[rsItem.row.__index]"
                  map-options
                  v-validate="rsItem.row.item_id ? 'required' : ''"
                  :error="errors.has(`work_order_items.${rsItem.row.__index}.unit_id`)"
                  :disable="!rsForm.line_id || !rsForm.work_order_items[rsItem.row.__index].item_id"
                  @input="(val) => setUnitReference(rsItem.row.__index, val)"
                />
              </q-td>
              <q-td key="ngratio"  width="15%">
                <q-input 
                  :name="`work_order_items.${rsItem.row.__index}.ngratio`" 
                  suffix="%" type="number" 
                  :dark="LAYOUT.isDark"
                  v-model="rsItem.row.ngratio" 
                  filled dense hide-bottom-space align="center" color="blue-grey-4" 
                  v-validate="'required'"
                  :error="errors.has(`work_order_items.${rsItem.row.__index}.ngratio`)"
                  :disable="!rsForm.line_id || !rsForm.work_order_items[rsItem.row.__index].item_id"
                  @input="() => { rsItem.row.quantity = calcQuantity(rsItem.row) }"
                  />
              </q-td>
              <q-td key="quantity"  width="15%">
                <q-input 
                  :name="`work_order_items.${rsItem.row.__index}.quantity`" type="number"
                  :dark="LAYOUT.isDark"
                  v-model="rsItem.row.quantity" 
                  filled dense hide-bottom-space disable align="right" color="blue-grey-6"
                  no-error-icon
                  v-validate="rsItem.row.item_id ? FORM.validator.quantity(rsItem.row, loadItemStock[rsItem.row.__index]) : ''"
                  :error="errors.has(`work_order_items.${rsItem.row.__index}.quantity`)"
                  :suffix="' / '+ convertStock(rsItem.row, loadItemStock[rsItem.row.__index])"
                  :before="[{icon: 'warning', warning: true, handler () { return true } }]"
                />
              </q-td>
            </q-tr>
            <q-tr  :rsItem="rsItem">
              <q-td></q-td>
              <q-td colspan="100%">
                <q-table ref="table-itemlines" class="no-shadow inline full-width" style="display:grid"
                  dense hide-bottom color="secondary" separator="none" 
                  :dark="LAYOUT.isDark" 
                  :data="rsItem.row.work_order_item_lines" 
                  :rows-per-page-options ="[0]"
                  :columns="[
                    { name: 'prefix', label: '',  align: 'left', visibility:false},
                    { name: 'line_id', label: 'Line production', align: 'left'},
                    { name: 'begin_date', label: 'Starting', align: 'center'},
                    { name: 'until_date', label: 'Finished', align: 'center'},
                  ]"
                  :pagination="{sortBy: null, descending: false, page: null, rowsPerPage: 0}">
                  <template slot="body" slot-scope="propLine">
                    <q-tr :propLine="propLine" style="height:20px">
                      <q-td key="prefix" style="width:50px">
                        <q-btn dense flat @click="removeItemLine(rsItem.row.__index, propLine.row.__index)" icon="delete" color="blue-grey-2 no-shadow" text-color="grey-8"
                          v-if="SETTING.work_orders.item_lines_customize"
                        />
                      </q-td>
                      <q-td key="line_id" width="50%" >
                        <select-filter class="field-auto-hight"
                          :name="`work_order_item_lines.${propLine.row.__index}.line_id`" 
                          borderless dense hide-bottom-space hide-dropdown-icon readonly color="blue-grey-1" 
                          :dark="LAYOUT.isDark"
                          v-model="propLine.row.line_id" 
                          v-validate="'required'"
                          :error="errors.has(`work_order_item_lines.${propLine.row.__index}.line_id`)"
                          :options="LineOptions" filter
                        />
                        <q-tooltip v-if="!rsForm.work_order_items[rsItem.row.__index].item_id" :offset="[0, 10]">Select a Part item, first! </q-tooltip>
                  
                      </q-td>
                      <q-td key="begin_date" width="25%">
                        
                        <q-input class="field-auto-hight"
                          v-model="propLine.row.begin_date" type="date" 
                          :dark="LAYOUT.isDark"
                          filled dense hide-bottom-space color="blue-grey-1" 
                          :disable="!rsForm.line_id || !rsForm.work_order_items[rsItem.row.__index].item_id"
                        />
                      </q-td>
                      <q-td key="until_date"  width="25%">
                        <q-input class="field-auto-hight"
                          v-model="propLine.row.until_date" type="date" 
                          :dark="LAYOUT.isDark"
                          filled dense hide-bottom-space color="blue-grey-1"  
                          :disable="!rsForm.line_id || !rsForm.work_order_items[rsItem.row.__index].item_id"
                        />
                      </q-td>
                    </q-tr>
                  </template>
                  <q-tr slot="bottom-row" slot-scope="propLine" :rsItem="propLine"  v-if="SETTING.work_orders.item_lines_customize">
                    <q-td colspan="100%">
                      <q-btn dense  @click="addNewItemLine(rsItem.row.__index)" icon="add" color="positive" />
                    </q-td>
                  </q-tr>
                </q-table>
              </q-td>
            </q-tr>
          </template>
          <q-tr slot="bottom-row" slot-scope="rsItem" :rsItem="rsItem">
            <q-td colspan="100%">
              <q-btn dense @click="addNewItem()"  icon="add" color="positive"/>
            </q-td>
          </q-tr>
        </q-table>
      </div>
      <!-- COLUMN::4th Description -->
      <div class="col-12 cloumn q-mt-md">
        <q-input name="description" type="textarea" rows="3" 
          stack-label label="Description" 
          filled
          :dark="LAYOUT.isDark"
          v-model="rsForm.description"/>
    
      </div>
    </q-card-section>
    <q-separator :dark="LAYOUT.isDark" />
    <q-card-actions >
      <q-btn :label="$tc('label.cancel')" icon="cancel" color="dark" @click="FORM.toBack()"></q-btn>
      <q-btn :label="$tc('label.reset')" icon="refresh" color="light" @click="setForm(FORM.data)"></q-btn>
      <q-btn :label="$tc('label.save')" icon="save" color="positive" @click="onSave()" 
        :disabled="FORM.has_relationship.length > 0">
      </q-btn>
    </q-card-actions>
  </q-card>
    <q-inner-loading :visible="FORM.loading" :dark="LAYOUT.isDark"><q-spinner-dots size="70px" color="primary" /></q-inner-loading>
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
          uri: '/admin/factories/work-orders',
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
    IssetWorkOrderItems() {
        if (this.rsForm.work_order_items) {
          return this.rsForm.work_order_items.some((item) => item.item_id)
        }
        return false
    },
    LineOptions() {
      let data = this.SHEET.lines.data || []
      return data.map(line => ({label: line.name, value: line.id}))
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
      let ITEM = this.SHEET.items.data.filter((item) => item.item_prelines[0].line_id === this.rsForm.line_id)
      return (ITEM.map(item => ({label: item.code + ' - ' + item.part_name, sublabel: item.part_number, value: item.id})) || [])
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
      this.SHOW = false
      this.FORM.load(
        (data) => {
          this.setForm(data)
          setTimeout(() => {
            this.SHOW = true
          }, 500) 
        }
      )
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
    convertStock(row, val = 0) {
      if(val < 0) return '(-)'
      return Number(val || 0) / Number(row.unit_rate || 1)
    },
    calcQuantity(row) {
      // console.log(this.FORM)
      return Math.ceil(Number(row.target) + (Number(row.target) * Number(row.ngratio) / 100))
    },
    setItemReference(index, val) {
    
       if(!val){
        this.rsForm.work_order_items[index].unit_id = null
        this.rsForm.work_order_items[index].unit = {}
        this.rsForm.work_order_items[index].item = {}
      }
      else{
        this.rsForm.work_order_items[index].item = this.MAPINGKEY['items'][val]
        if(this.rsForm.work_order_items[index].item.item_prelines.length > 0) {
          const prelines = this.rsForm.work_order_items[index].item.item_prelines
          this.rsForm.work_order_items[index].work_order_item_lines = []

          for (let i = 0; i < prelines.length; i++) {
            let ex = this.setDefault().work_order_items[0].work_order_item_lines[0]
            ex.line_id = prelines[i].line_id;
            this.rsForm.work_order_items[index].work_order_item_lines.push(ex)
          }
        }
        let baseUnitID = this.MAPINGKEY['items'][val].unit_id
        this.rsForm.work_order_items[index].unit_id = baseUnitID
        this.rsForm.work_order_items[index].unit_rate = 1
        this.rsForm.work_order_items[index].unit = this.MAPINGKEY['units'][baseUnitID]
      }
    },
    setUnitReference(index, val) {
      
      if(!val) return;
      else if (this.rsForm.work_order_items[index].item.unit_id === val) {
        this.rsForm.work_order_items[index].unit_rate = 1
      }
      else {
        if(this.rsForm.work_order_items[index].item.item_units) {
          this.rsForm.work_order_items[index].item.item_units.find((unitItem)=> {
            if (unitItem.unit_id == val) {
              this.rsForm.work_order_items[index].unit_rate = unitItem.rate
              return true
            }
          })
        }
      }
    },
    addNewItem() {
      let newEntri = this.setDefault().work_order_items[0];
      newEntri.work_order_item_lines = []
      
      this.rsForm.work_order_items.push(newEntri)
    },
    removeItem(itemIndex) {
        this.rsForm.work_order_items.splice(itemIndex, 1)
        if(this.rsForm.work_order_items.length < 1) this.addNewItem()
    },
    addNewItemLine(itemIndex) {
      let newEntri = this.setDefault().work_order_items[0].work_order_item_lines[0];
      
      this.rsForm.work_order_items[itemIndex].work_order_item_lines.push(newEntri)
    },
    removeItemLine(itemIndex, lineIndex) {
        this.rsForm.work_order_items[itemIndex].work_order_item_lines.splice(lineIndex, 1)
        if(this.rsForm.work_order_items[itemIndex].work_order_item_lines.length < 1) this.addNewItemLine(itemIndex)
    },
    onSave() {

      this.$validator.validate().then(result => {
        if (!result) {
          this.$q.notify({
            color:'negative', icon:'error', position:'top-right', timeout: 3000,
            message:'Please complete the form fields'
          })
          return
        }
        this.FORM.loading = true
        let {method, mode, apiUrl} = this.FORM.meta();
        this.$axios.set(method, apiUrl, this.rsForm)
        .then((response) => {  
          let message = response.data.number + ' - #' + response.data.id
          this.FORM.response.success({message:message})
          this.FORM.toView(response.data.id)
        })
        .catch((error) => { 
          console.warn('[PLAY] onSave', error)
          this.FORM.response.fields(error.response)
          this.FORM.response.error(error.response, 'Submit')
        })
        .finally(()=>{
          this.FORM.loading = false
        });
        
      });
    },
  },
}
</script>