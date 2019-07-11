<template>
<q-page padding class="form-page" v-if="SHOW">
  <q-card inline class="q-ma-sm" >
    <q-card-section>
      <form-header :title="FORM.title()" :subtitle="FORM.subtitle()" >
        <template slot="menu-item">
          <list-item :label="$tc('label.remove')" icon="delete" clickable @click="FORM.delete" v-close-popup v-if="$route.params.id"/>
        </template>
      </form-header>
    </q-card-section>
    <q-separator :dark="LAYOUT.isDark" />
    <q-card-section class="row q-col-gutter-sm">

      <!-- COLUMN::Base process work time -->
      <q-field class="col-12" prefix="Work Time Process" dense borderless :error="errors.has('worktime')">
        <q-option-group name="worktime" type="radio" v-model="rsForm.worktime" inline
          v-validate="'required'"
          :options="[
            { label: 'Reguler', value: 'REGULER' },
            { label: 'Overtime', value: 'OVERTIME', color: 'secondary' },
          ]"
        />
      </q-field>
      <!-- COLUMN::1st customer Identitity -->
      <div class="col-12 col-sm-6" >
        <div class="row q-col-gutter-x-md q-mb-lg">
          <q-input class="col-12" 
            name="number" 
            label="No Transaction" 
            placeholder="[Auto Generate]" 
            v-model="rsForm.number" 
            v-validate="$route.meta.mode == 'edit' ? 'required':''" 
            :error="errors.has('number')" 
            :error-message="errors.first('number')"
            autofocus/>

          <select-filter class="col-12" 
            name="line_id" 
            v-model="rsForm.line_id" 
            label="Line Production" 
            :disable="IssetLineItems" 
            :options="LineOptions" clearable
            v-validate="'required'"
            :error="errors.has('line_id')" 
            :error-message="errors.first('line_id')"
            />
        </div>
      </div>
      <!-- COLUMN::2nd Transaction details -->
      <div class="col-12 col-sm-6" >
        <div class="row q-col-gutter-x-sm">
          <q-input class="col-12"
            name="date" 
            label="Date" stack-label 
            v-model="rsForm.date" 
            type="date" 
            v-validate="'required'"
            :error="errors.has('date')"/>
            
          <q-select class="col-12"
            name="shift_id" 
            label="Shift" stack-label 
            v-model="rsForm.shift_id"  
            v-validate="'required'" 
            :options="ShiftOptions" filter 
            :error="errors.has('shift_id')"
          />
        </div>
      </div>
        
      <!-- COLUMN::3nd Item details -->
      <div class="col-12">
        <q-table color="primary" class="d-grid full-width no-shadow" dense hide-bottom
          :data="rsForm.workin_production_items" 
          :rows-per-page-options ="[0]"
          :columns="[
            { name: 'prefix', label: '',  align: 'left'},
            { name: 'work_order_item_id', label: 'Work Order Part', align: 'left'},
            { name: 'item_id', label: 'Item Part', align: 'left'},
            { name: 'quantity', label: 'Quantity', align: 'center'},
            { name: 'unit_id', label: 'unit', align: 'center', },
          ]"
          :pagination="{rowsPerPage: 0}"
          >

          <template slot="body" slot-scope="propItem">
            <q-tr :propItem="propItem" width="30%">
              <q-td key="prefix"  style="max-width:70px" >
                <div class="">
                  <q-btn class="no-padding" dense flat size="md" @click="removeItem(propItem.row.__index)" icon="delete" color="blue-grey-5">
                    <q-tooltip :offset="[10, 10]">Remove</q-tooltip>
                  </q-btn>
                  <q-btn class="no-padding" dense flat size="md"  @click="cloneItem(propItem.row.__index)" icon="queue" color="blue-grey-4">
                    <q-tooltip :offset="[10, 10]">clone</q-tooltip>
                  </q-btn>
                </div>
              </q-td>
              <q-td key="work_order_item_id"  >
                <q-select 
                  :name="`workin_production_items.${propItem.row.__index}.work_order_item_id`" 
                  v-model="propItem.row.work_order_item_id" 
                  outlined hide-bottom-space dense color="blue-grey-5"
                  :readonly="!IssetLineID" 
                  :options="WorkOrderItemOptions" filter clearable
                  @input="(val)=>{ setWorkOrderItemReference(propItem.row.__index, val) }"
                  :error="errors.has(`workin_production_items.${propItem.row.__index}.work_order_item_id`)"
                />
                <q-tooltip :disable="IssetLineID" :offset="[0, 10]">Select The Line Production, first! </q-tooltip>
                
              </q-td>
              <q-td key="item_id"  width="35%">
                <q-select 
                  :name="`workin_production_items.${propItem.row.__index}.item_id`" 
                  v-model="propItem.row.item_id" class="full-width" 
                  outlined hide-bottom-space dense color="blue-grey-5"
                  :readonly="!IssetLineID || (propItem.row.work_order_item_id ? true : false)" 
                  :options="ItemOptions" 
                  v-validate="'required'" 
                  :error="errors.has(`workin_production_items.${propItem.row.__index}.item_id`)"
                  @input="(val)=>{ setItemReference(propItem.row.__index, val) }"
                />
                <q-tooltip :disable="IssetLineID" :offset="[0, 10]">Select The Line Production, first! </q-tooltip>
              
              </q-td>
              <q-td key="quantity"  width="20%">
                <q-input 
                  :name="`workin_production_items.${propItem.row.__index}.quantity`" 
                  v-model="propItem.row.quantity" type="number" min="0" align="center" 
                  outlined hide-bottom-space dense color="blue-grey-5"
                  :warning="propItem.row.quantity > numUnitConvertion(propItem.row, LoadUnitAvailable[propItem.row.__index]) ? 'warning' : false" 
                  :suffix="' / ' + strUnitConvertion(propItem.row, LoadUnitAvailable[propItem.row.__index])"
                  v-validate="propItem.row.item_id ? 'required' : ''"
                  :error="errors.has(`workin_production_items.${propItem.row.__index}.quantity`)"
                />
              </q-td>
              <q-td key="unit_id"  width="15%">
                <q-select 
                  :name="`workin_production_items.${propItem.row.__index}.unit_id`" 
                  v-model="propItem.row.unit_id" 
                  outlined hide-bottom-space dense color="blue-grey-5"
                  @input="(val)=> { setUnitReference(propItem.row.__index, val) }"
                  :options="ItemUnitOptions[propItem.row.__index]"
                  v-validate="propItem.row.item_id ? 'required' : ''"
                  :error="errors.has(`workin_production_items.${propItem.row.__index}.unit_id`)"
                />
                
              </q-td>
            </q-tr>
            <!-- Item detail Description -->
            <q-tr class="" :propItem="propItem">
              <q-td></q-td>
              <q-td  colspan="2">
                <div class="text-left">
                  <q-markup-table class="no-border no-shadow">
                    <tr><td>No Plate    </td><td>{{ propItem.row.item.part_number }}</td></tr>
                    <tr><td>Plate name  </td><td>{{ propItem.row.item.part_name }}</td></tr>
                  </q-markup-table>
                </div>
              </q-td>
                <q-td colspan="2">
                <div class="text-left" >
                  <q-markup-table class="no-border no-shadow">
                    <tr><td>Quantity    </td><td>{{ formatNumber(Number(propItem.row.quantity) * Number(propItem.row.unit_rate)) }} {{ (propItem.row.item.unit ? propItem.row.item.unit.name : '') }}</td></tr>
                    <tr><td>FG #alias    </td><td>{{ (propItem.row.item.part_alias || '') }}</td></tr>
                  </q-markup-table>
                </div>
              </q-td>
              <q-td colspan="100%"> </q-td>
            </q-tr>
          </template>
          <q-tr slot="bottom-row" slot-scope="propItem" :propItem="propItem">
            <q-td colspan="100%">
              <q-btn class="full-width" 
                label="New Part"  
                 dense 
                color="positive" 
                @click="addNewItem()"/>
            </q-td>
          </q-tr>
          <template slot="top-left">
            
          </template>
        </q-table>
      </div>
      <!-- COLUMN::4th Description -->
      <div class="col-12 q-mt-md">
        <div class="row q-col-gutter-x-lg ">
          <q-input class="col-12" 
            name="description" 
            type="textarea" rows="3" 
            stack-label label="Description" 
            filled
            v-model="rsForm.description"/>
        </div>
      </div>
      
    </q-card-section>
    <q-separator :dark="LAYOUT.isDark" />
    <q-card-actions class="q-mx-lg">
      <q-btn :label="$tc('label.cancel')" icon="cancel" color="dark" @click="FORM.toBack()"></q-btn>
      <q-btn :label="$tc('label.reset')" icon="refresh" color="light" @click="setForm(FORM.data)"></q-btn>
      <q-btn :label="$tc('label.save')" icon="save" color="positive" @click="onSave()"></q-btn>     
    </q-card-actions>
  </q-card>
    <q-inner-loading :visible="FORM.loading" :dark="LAYOUT.isDark"><q-spinner-dots size="70px" color="primary" /></q-inner-loading>
</q-page>
</template>

<script>
import Vue from 'vue'
import MixForm from '@/mixins/mix-form.vue'

export default {
  mixins: [MixForm],
  data () {

    return {
      SHEET:{
        work_order_items: {data:[], api:'/api/v1/factories/work-orders?mode=item-lines'},
        work_orders: {data:[], api:'/api/v1/factories/work-orders?mode=item-lines'},
        lines: {data:[], api:'/api/v1/references/lines?mode=all'},
        shifts: {data:[], api:'/api/v1/references/shifts?mode=all'},
        customers: {data:[], api:'/api/v1/incomes/customers?mode=all'},
        units: {data:[], api:'/api/v1/references/units?mode=all'},
        items: {data:[], api:'/api/v1/common/items?mode=all'},
        itemstocks: {data:[], api:'/api/v1/common/items?mode=itemstock'}
      },
      FORM:{
        resource:{
          uri: '/admin/factories/workin-productions',
          api: '/api/v1/factories/workin-productions',
        },
      },
      rsForm: {},
      setDefault:()=>{
        return {
          number: null,
          date: this.$app.moment().format('YYYY-MM-DD'),
          time: this.$app.moment().format('HH:mm'),

          line_id: null,
          shift_id: null,
          worktime: 'REGULER',

          description: null,
          
          workin_production_items:[ 
            {
              id:null, 
              item_id: null, item: {},
              unit_id: null, unit: {},
              unit_rate: 1,
              quantity: null,
              work_order_item_id: null
            }
          ]

        }
      }
    }
  },
  created(){
    this.init()

  },
  computed: {
    IssetLineItems() {
        let items = this.rsForm.workin_production_items
        for (const i in items) {
          if (items.hasOwnProperty(i)) {
            if(items[i].item_id) return true
          }
        }

        return false
    },
    IssetLineID() {
      return (this.rsForm.line_id ? true : false)
    },
    TotalQuantity() {
      this.rsForm.workin_production_items.reduce((total, item) => {
        console.warn(total, item)
      })
    },
    WorkOrderItemOptions() {
      if (!this.rsForm.line_id) return []
      if (this.SHEET.work_orders.data.length === 0) return []

      const work_orders = this.SHEET.work_orders.data || []
      let data = []

      let subLabel = (itemID) => this.MAPINGKEY['items'][itemID]
        ? '[' +this.MAPINGKEY['items'][itemID].code + '] ' + this.MAPINGKEY['items'][itemID].part_name
        : null

      work_orders.map(wo => {
        wo.work_order_items.map(item => {
          if (item.work_order_item_lines.some(line => line.line_id == this.rsForm.line_id)) {
            item.work_order = {id: wo.id, number: wo.number, line_id: wo.line_id,}
            data.push(item)
          }
        }) 
      })

      return data.map(item => ({
        data: item,
        label: `${item.work_order.number} #${item.id}`, 
        sublabel: subLabel(item.item_id),
        value: item.id
      }))
    },
    LineOptions() {
      return (this.SHEET.lines.data.map(item => ({label: item.name, value: item.id})) || [])
    },
    ShiftOptions() {
      return (this.SHEET.shifts.data.map(item => ({label: item.name, value: item.id})) || [])
    },
    CustomerOptions() {
      return (this.SHEET.customers.data.map(item => ({label: [item.code, item.name].join(' - '), value: item.id})) || [])
    },
    UnitOptions() {
      return (this.SHEET.units.data.map(item => ({label: item.code, value: item.id})) || [])
    },
    ItemOptions() {
      let data = this.SHEET.items.data.filter((item) => {
        return item.item_prelines.some((preline) => preline.line_id === this.rsForm.line_id )
      })
      // let ITEM = this.SHEET.items.data
      return (data.map(item => ({label: item.code +' '+ item.part_name, value: item.id})) || [])
    },
    ItemUnitOptions() {
      let vars = []
      for (const i in this.rsForm.workin_production_items) {
        if (this.rsForm.workin_production_items.hasOwnProperty(i)) {
          let rsItem = this.rsForm.workin_production_items[i]
          vars[i] = ( this.UnitOptions || [])
          vars[i] = vars[i].filter((unit)=> {
            if(!rsItem.item_id) return false
            if(rsItem.item) {
              if(rsItem.item.unit_id === unit.value) return true
              if(rsItem.item.item_units) {
                let filtered = rsItem.item.item_units.filter((fill)=> fill.unit_id == unit.value)
                if(filtered.length > 0) return true
              }
            }
            return false;
          })
        }
      }
      return vars
    },
    LoadUnitAvailable() {
      let maxitem = {}
      let moveItem = {
        set: function (id, val) {
          if (!this.hasOwnProperty(id)) this[id] = 0
            this[id] += Number(val)
        },
        get: function (id) {
          return this.hasOwnProperty(id) ? this[id] : 0
        }
      }
      
      if(this.FORM.data)
      this.FORM.data.workin_production_items.forEach(detail => {
        if(!maxitem.hasOwnProperty(detail.work_order_item_id)) maxitem[detail.work_order_item_id] = 0
        maxitem[detail.work_order_item_id] += (Number(detail.quantity || 0) * Number(detail.unit_rate || 0))
      })
      
      this.WorkOrderItemOptions.map((opt) => {
        if(!maxitem.hasOwnProperty(opt.data.id)) maxitem[opt.data.id] = 0
        let line = opt.data.work_order_item_lines.find(x => x.line_id === this.rsForm.line_id)
        maxitem[opt.data.id] += (Number(opt.data.unit_amount || 0) - Number( line.total_workin_production_item || 0))
        // console.log('c:', opt.data.unit_amount, line.total_workin_production_item)
      })

      let data = {}
      if(this.rsForm.workin_production_items) {
        this.rsForm.workin_production_items.map((detail, index) => {
          if (maxitem[detail.work_order_item_id] && detail.work_order_item_id) {
            data[index] = Number(maxitem[detail.work_order_item_id] || 0) - Number(moveItem.get(detail.work_order_item_id) || 0)
            moveItem.set(detail.work_order_item_id, (Number(detail.quantity) * Number(detail.unit_rate)) )
          }
        })
      }
      
      return data
    },
    LoadItemStock() {
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
      this.FORM.data.workin_production_items.forEach(item => {
        if (stockItem.hasOwnProperty(item.item_id)) {
          stockItem[item.item_id].totals['FG'] += Number(item.quantity)
        }
      })

      let data = {}
      this.rsForm.workin_production_items.map((detail, index) => {
        if (stockItem[detail.item_id] && detail.item_id) {
          data[index] = Number(stockItem[detail.item_id].totals['FG'] || 0) - Number(moveItem.get(detail.item_id) || 0)
          moveItem.set(detail.item_id, detail.quantity)
        }
        
      })
      
      return data
    },
    MAPINGKEY() {
      let variables = {
        'work_order_items': {},
        'units': {},
        'items': {},
        'itemstocks': {}
      }
      
      // this.SHEET['work_order_items'].data.map(value => { variables['work_order_items'][value.work_order_item_id] = value })
      this.SHEET['units'].data.map(value => { variables['units'][value.id] = value })
      this.SHEET['items'].data.map(value => { variables['items'][value.id] = value })
      this.SHEET['itemstocks'].data.map(value => { variables['itemstocks'][value.id] = value })

      this.SHEET['work_orders'].data.map(wo => { 
        wo.work_order_items.map(item => {
          variables['work_order_items'][item.id] = item
        })        
      })

      return variables;
    }
  },
  watch:{
      '$route' : 'init',
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
      this.rsForm = JSON.parse(JSON.stringify(data))

      if(data.hasOwnProperty('has_relationship') && data['has_relationship'].length > 0) {
        this.FORM.has_relationship = data.has_relationship
        this.FORM.onRelationship({
          title: 'Request order has relation!',
          message: data['has_relationship'].join("-"),
          then: () => this.$router.push(`${this.FORM.resource.uri}/${data.id}/view`)
        })
      }
    },
    strUnitConvertion(row, val = 0) {
      if(val < 0) return '(-)'
      return Number(val) / Number(row.unit_rate || 1)
    },
    numUnitConvertion(row, val = 0) {
      return Number(val) / Number(row.unit_rate || 1)
    },    
    setWorkOrderItemReference(index, val) {      
      if(!val) {
        this.rsForm.workin_production_items[index].item_id = null
        this.setItemReference(index, null)
      }
      else if(this.MAPINGKEY['work_order_items'][val]){
        let itemID = this.MAPINGKEY['work_order_items'][val].item_id
        this.rsForm.workin_production_items[index].item_id = itemID
        this.setItemReference(index, itemID)
      }
    },
    setItemReference(index, val) {
      if(!val) {
        this.rsForm.workin_production_items[index].unit_id = null
        this.rsForm.workin_production_items[index].unit = {}
        this.rsForm.workin_production_items[index].item = {}
      }
      else {
        let unitID = this.MAPINGKEY['items'][val].unit_id
        this.rsForm.workin_production_items[index].unit_id = unitID
        this.rsForm.workin_production_items[index].unit_rate = 1

        this.rsForm.workin_production_items[index].item = this.MAPINGKEY['items'][val]
        this.rsForm.workin_production_items[index].unit = this.MAPINGKEY['units'][unitID]
      }
    },
    setUnitReference(index, val) {
      let detail = this.rsForm.workin_production_items[index]

      if(!val && !detail.hasOwnProperty('item')) return;
      else if (detail.item.unit_id === val) {
        this.rsForm.workin_production_items[index].unit_rate = 1
      }
      else {
        if(detail.item.item_units) {
          detail.item.item_units.map((unitItem)=> {
            if (unitItem.unit_id == val) this.rsForm.workin_production_items[index].unit_rate = unitItem.rate
          })
        }
      }
    },

    addNewItem(){
      let newEntri =  this.setDefault().workin_production_items[0];      
      this.rsForm.workin_production_items.push(newEntri)
    },
    cloneItem(index) {
      let newEntri =  this.rsForm.workin_production_items[index];
      this.rsForm.workin_production_items.push(newEntri)
    },
    removeItem(index) {
        this.rsForm.workin_production_items.splice(index, 1)
        if(this.rsForm.workin_production_items.length < 1) this.addNewItem()
    },
    
    onSave() {

      this.$validator.validate().then(result => {
        if (!result) {
          this.$q.notify({
            color:'negative', icon:'error', position:'top-right', timeout: 3000,
            message:'Please complete the form fields'
          }); 
          
          return;
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