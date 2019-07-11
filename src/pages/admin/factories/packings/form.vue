<template>
<q-page padding class="form-page" v-if="SHOW">
  <q-card inline class="q-ma-sm ">
    <q-card-section>
      <form-header :title="FORM.title()" :subtitle="FORM.subtitle()" >
        <template slot="menu-item">
          <list-item :label="$tc('label.remove')" icon="delete" clickable @click="FORM.delete" v-close-popup v-if="$route.params.id"/>
        </template>
      </form-header>
    </q-card-section>
    <q-card-section class="row q-col-gutter-sm">
      
      <!-- COLUMN::Base process work time -->
      <q-field dense borderless class="col-12" prefix="Work Time Process" label-width="3" :error="errors.has('worktime')" :error-message="errors.first('worktime')">
        <q-option-group  name="worktime" type="radio" v-model="rsForm.worktime" inline
          v-validate="'required'"
          :options="[
            { label: 'Reguler', value: 'REGULER' },
            { label: 'Overtime', value: 'OVERTIME', color: 'secondary' },
          ]"
        />
      </q-field>
      <!-- COLUMN::1st customer Identitity -->
      <div class="col-12 col-sm-6" >
        <div class="row q-col-gutter-xs">
          <q-input 
            class="col-12" 
            name="number" 
            placeholder="[Auto Generate]" 
            label="No Transaction" 
            v-model="rsForm.number" 
            v-validate="$route.meta.mode == 'edit' ? 'required':''" autofocus
            :error="errors.has('number')"
            :error-message="errors.first('number')"/>
          
          <select-filter class="col-12"
            name="customer_id" 
            v-model="rsForm.customer_id" 
            label="Customer" 
            :disable="IssetItemID" 
            v-validate="'required'"
            :options="CustomerOptions" filter clearable
            @input="setCustomerReference"
            :error="errors.has('customer_id')" 
            :error-message="errors.first('customer_id')"/>
          <q-tooltip :disable="!IssetItemID" :offset="[0, 10]">Please remove Item Part, first! </q-tooltip>

          
          <q-input class="col-8" name="date" label="Date" v-model="rsForm.date" type="date" 
            v-validate="'required'" :error="errors.has('date')" :error-message="errors.first('date')"/>
      
          <q-input class="col-4" name="time" label="Time" v-model="rsForm.time" type="time" 
            v-validate="'required'"
            :error="errors.has('time')" :error-message="errors.first('time')"/>
        
          <select-filter class="col-12" name="operator_id" v-model="rsForm.operator_id" label="Operator" 
            v-validate="''" :error="errors.has('operator_id')" :error-message="errors.first('operator_id')"
            :options="OperatorOptions" filter clearable
          />
          
        </div>
      </div>
      <!-- COLUMN::2th Items Part lists -->
      <div class="col-12 col-sm-6" >
        <div class="row q-col-gutter-x-xs">
          <select-filter class="col-12" 
            name="packing_items.code" 
            label="Part Code"
            v-model="rsForm.packing_items.item_id" 
            @input="setItemReference" clearable
            :options="ItemOptions" 
            :error="errors.has('packing_items.code')" 
            :error-message="errors.first('packing_items.code')"
            />
            
          <select-filter  class="col-12" 
            name="packing_items.work_order_item_id" 
            label="Part of Work Order"
            v-model="rsForm.packing_items.work_order_item_id"  
            v-validate="''" 
            :options="WorkOrderItemOptions" clearable 
            @input="(val)=> { 
              // setWorkOrderItemReference(val) 
            }"
            :error="errors.has('packing_items.work_order_item_id')" 
            :error-message="errors.first('packing_items.work_order_item_id')" />
          
        
          <q-input class="col-8" 
            name="packing_items.quantity" 
            v-model="rsForm.packing_items.quantity" 
            type="number" min="0" label="Quantity" 
            v-validate="'required'"
            :suffix="rsForm.packing_items.item_id ? `/ (${MaxUnit})` : ''" 
            :warning="rsForm.packing_items.quantity > getItemstock(rsForm.packing_items) ? 'warning' : false" 
            :error="errors.has(`packing_items.quantity`) || rsForm.packing_items.quantity > MaxUnit ? 'error' : false"  
            :error-message="errors.first(`packing_items.quantity`)"
            :after="[
              {icon: 'warning', warning: true, handler () {}}
            ]" 
            
          />
          <q-select class="col-4" 
            name="packing_items.unit_id" 
            v-model="rsForm.packing_items.unit_id" 
            label="Unit" 
            v-validate="'required'" 
            :options="ItemUnitOptions" filter 
            @input="setUnitReference"
            :error="errors.has('packing_items.unit_id')" 
            :error-message="errors.first('packing_items.unit_id')"
          />
        </div>
      </div>
      <!-- COLUMN::4th Items faults lists -->
      <div class="col-12">
        <div class="row q-col-gutter-x-sm q-mb-lg">
          <q-select class="col-12" 
            name="type_fault_id" 
            v-model="rsForm.packing_items.type_fault_id" 
            label="Type of Faulty"  
            :disable="IssetItemFaults" 
            v-validate="''"
            :options="TypeFaultOptions" 
            :error="errors.has('type_fault_id')" :error-message="errors.first('type_fault_id')"
          />
          
          <div class="col-12"> 
            <q-table  color="primary" class="d-grid full-width" dense hide-bottom
              :data="rsForm.packing_items.packing_item_faults" 
              :rows-per-page-options ="[0]"
              :columns="[
                { name: 'prefix', label: '',  align: 'left', style:'width:50px'},
                { name: 'quantity', label: 'Quantity', align: 'center', style:'width:120px'},
                { name: 'fault_id', label: 'Fault of Part', align: 'left'},
              ]"
              :pagination="{sortBy: null, descending: false, page: null, rowsPerPage: 0}"
              >
              <q-tr slot="body" slot-scope="props" :props="props">
                <q-td key="prefix" :props="props" >
                  <q-btn dense  @click="removeItemFault(props.row.__index)" icon="delete" color="negative"/>
                </q-td>
                <q-td key="quantity" :props="props" >
                  <q-input 
                    :name="`packing_items.packing_item_faults.${props.row.__index}.quantity`" 
                    type="number" min="0" align="center"
                    outlined dense hide-bottom-space color="blue-grey" 
                    v-model="props.row.quantity" 
                    v-validate="'required'"
                    :error="errors.has(`packing_items.packing_item_faults.${props.row.__index}.quantity`)"
                    />
                </q-td>
                <q-td key="fault_id" :props="props" >
                  <select-filter
                    :name="`packing_items.packing_item_faults.${props.row.__index}.fault_id`" 
                    outlined style="min-width:150px" 
                    dense hide-bottom-space color="blue-grey"
                    v-model="props.row.fault_id" v-validate="props.row.quantity ? 'required' : ''"
                    :options="FaultOptions" filter
                    :readonly="!IssetTypeFaultID || !IssetItemID"
                    :error="errors.has(`packing_items.packing_item_faults.${props.row.__index}.fault_id`)"
                  />
                  <q-tooltip :disable="IssetItemID" :offset="[0, 20]">Please select The Item of Packing, first! </q-tooltip>
                  <q-tooltip :disable="IssetTypeFaultID" :offset="[0, 10]">Please select The Fault Type, first! </q-tooltip>
                </q-td>
              </q-tr>

              <q-tr slot="bottom-row" slot-scope="props" :props="props">
                <q-td colspan="100%">
                  <strong><q-btn dense  @click="addNewItemFault()" icon="add" color="positive"/></strong>
                </q-td>
              </q-tr>

              <template slot="top-left">
                
              </template>
            </q-table>
          </div>
        </div>
      </div>
        <!-- COLUMN::4th Description -->
        <div class="col-12">
          <q-input class="col-12" filled name="description" type="textarea" rows="3" label="Description" v-model="rsForm.description"/>
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
import MixForm from '@/mixins/mix-form.vue'

export default {
  mixins: [MixForm],
  data () {

    return {
      SETTING: {
       
      },
      SHEET:{
        shifts: {api:'/api/v1/references/shifts?mode=all'},
        faults: {api:'/api/v1/references/faults?mode=all'},
        units: {api:'/api/v1/references/units?mode=all'},
        type_faults: {api:'/api/v1/references/type_faults?mode=all'},
        customers: {api:'/api/v1/incomes/customers?mode=all'},
        operators: {api:'/api/v1/references/operators?mode=all'},
        items: {api:'/api/v1/common/items?mode=all', autoload:false},
        itemstocks: {api:'/api/v1/common/items?mode=itemstock', autoload:false},
        work_orders: {api:'/api/v1/factories/work-orders?mode=items', autoload:false},
      },
      FORM:{
        resource:{
          uri: '/admin/factories/packings',
          api: '/api/v1/factories/packings',
        },
      },
      rsForm: {
        packing_items:{}
      },
      rsData: {},
      setDefault:()=>{
        return {
          number: null,
          customer_id: null,

          date: this.$app.moment().format('YYYY-MM-DD'),
          time: this.$app.moment().format('HH:mm'),
          shift_id: null,
          worktime: 'REGULER',
          description: null,
          operator_id: null,

          packing_items : {
            item_id: null,
            unit_id: null,
            unit_rate: 1,
            item: {},
            unit: {},
            quantity: null,
            work_order_item_id: null,
            type_fault_id: null,
            packing_item_faults:[ 
              {
                id:null, 
                fault_id: null,
                quantity: null,
              }
            ]
          }
        }
      }
    }
  },
  created() {
    // Component Page Mounted!
    this.init()
  },
  computed: {
    IssetItemFaults() {
      if(!this.rsForm.hasOwnProperty('packing_items')) return false;
        let faults = this.rsForm.packing_items.packing_item_faults
        for (const i in faults) {
          if (faults.hasOwnProperty(i)) {
            if(faults[i].fault_id) return true
          }
        }
        return false
    },
    IssetCustomerID() {
      return (this.rsForm.customer_id ? true : false)
    },
    IssetItemID() {
      if(!this.rsForm.hasOwnProperty('packing_items')) return false;

      return (this.rsForm.packing_items.item_id ? true : false)
    },
    IssetTypeFaultID() {
      if(!this.rsForm.hasOwnProperty('packing_items')) return false;
      return (this.rsForm.packing_items.type_fault_id ? true : false)
    },
    TotalQtyFaulties() {
      if(!this.rsForm.hasOwnProperty('packing_items')) return false;
      this.rsForm.packing_items.packing_item_faults.reduce((total, item) => {
        // console.warn(total, item)
      })
    },
    WorktimeOptions() {
      return [
        { label: 'Reguler', value: 'REGULER' },
        { label: 'Overtime', value: 'OVERTIME', color: 'secondary' }
      ]
    },
    WorkOrderItemOptions() {
      if (!this.rsForm.customer_id) return []
      if (this.SHEET.work_orders.data.length == 0 ) return []

      let subLabel = (itemID) => this.MAPINGKEY['items'][itemID]
        ? this.MAPINGKEY['items'][itemID].part_name + ' [No. ' +this.MAPINGKEY['items'][itemID].part_number + ']'
        : null

      let data = []
      this.SHEET.work_orders.data.map(rs => {
        rs.work_order_items.map(detail => {
          if (this.FORM.data.packing_items && this.FORM.data.packing_items.work_order_item_id === detail.id) {
            detail.total_packing_item -= (this.FORM.data.packing_items.quantity * this.FORM.data.packing_items.unit_rate)
          }

          if(detail.item_id === this.rsForm.packing_items.item_id && detail.unit_amount > detail.total_packing_item) {
            detail.work_order_number = rs.number
            data.push(detail)
          }
        })
      })

      return data.map(q => {
        return ({
          label: q.work_order_number,
          value: q.id,
          data: q,
          stamp: q.total_packing_item +'/'+ q.unit_amount
        })
      })
    },
    OperatorOptions() {
      return (this.SHEET.operators.data.map(item => ({label: item.name, value: item.id})) || [])
    },
    TypeFaultOptions() {
      return (this.SHEET.type_faults.data.map(item => ({label: item.name, value: item.id})) || [])
    },
    FaultOptions() {
      if (!this.rsForm.packing_items.type_fault_id) return []

      let data = this.SHEET.faults.data
      data = data.filter(x => x.type_fault_id === this.rsForm.packing_items.type_fault_id)

      return (data.map(item => ({label: item.name, value: item.id})) || [])
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
      let items = this.SHEET.items.data.filter((item) => item.customer_id == this.rsForm.customer_id )
      return (items.map(item => ({
        label: (item.part_name +' NO.'+ item.part_number),
        sublabel: item.code,
        value: item.id, 
        data:item
      })) || [])
    },
    ItemUnitOptions() {
      let vars = []
      
      let rsItem = this.rsForm.packing_items
      vars = ( this.UnitOptions || [])
      vars = vars.filter((unit)=> {
        if(!rsItem.item_id) return false
        if(rsItem.item) {
          if(rsItem.item.unit_id === unit.value) return true
          if(rsItem.item.item_units) {
            let filters = rsItem.item.item_units.filter((fill)=> fill.unit_id === unit.value)
            if(filters.length > 0) return true
          }
        }
        return false;
      })
      return vars
    },
    MaxUnit() {
      let rsItem = this.rsForm.packing_items
      if(!rsItem.item_id) return 0
      if(this.WorkOrderItemOptions.length == 0) return 0

      const find = this.WorkOrderItemOptions.find(opt => {
        return opt.data.id === rsItem.work_order_item_id
      })

      console.log('rate', find.data.unit_rate)

      return !find ? 0 : (Number(find.data.unit_amount) - Number(find.data.total_packing_item))
    },
    MAPINGKEY() {
      let variables = {
        'work_orders': {},
        'customers' : {},
        'units': {},
        'items': {}
      }

      this.SHEET['work_orders'].data.map(value => {
        variables['work_orders'][value.id] = value 
      })
      this.SHEET['customers'].data.map(value => { variables['customers'][value.id] = value })
      this.SHEET['units'].data.map(value => { variables['units'][value.id] = value })
      this.SHEET['items'].data.map(value => { variables['items'][value.id] = value })

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
      this.rsForm =  data
      
      if(data.customer_id) this.SHEET.load('items', 'customer_id='+ data.customer_id)
      if(data.packing_items.item_id) this.SHEET.load('work_orders', 'item_id='+ data.packing_items.item_id)

      if(data.hasOwnProperty('has_relationship') && data['has_relationship'].length > 0) {
        this.FORM.has_relationship = data.has_relationship
        this.FORM.onRelationship({
          title: 'Request order has relation!',
          message: data['has_relationship'].join("-"),
          then: () => this.$router.push(`${this.FORM.resource.uri}/${data.id}/view`)
        })
      }
      
    },
    getItemstock(rsItem) {
      if(!rsItem.item_id) return;
      let value = 0
      
        // console.log('CEK::NOW', this.rsForm, this.FORM.data)
      let stock =  this.SHEET['itemstocks'].data.find(stock => stock.id === rsItem.item_id)
      if(stock && stock.hasOwnProperty('totals')) {
        if(rsItem.unit_rate &&  rsItem.unit_rate != 1) {
          value += Number(stock.totals['WO']) * Number(rsItem.unit_rate)
        }
        else {
          value += Number(stock.totals['WO'])
        }
      }
      let defaults =  this.FORM.data.packing_items
      if(defaults && defaults.hasOwnProperty('quantity') && defaults.hasOwnProperty('item_id')) 
      {
        if(defaults.quantity && defaults.item_id && defaults.item_id === rsItem.item_id) {
          if(defaults.unit_rate &&  defaults.unit_rate != 1) {
            value += Number(defaults.quantity) * Number(rsItem.unit_rate)
          }
          else {
            value += Number(defaults.quantity)
          }
        }
      } 

      return value;
    },
    
    getTotalHanger(qty, thanger, unit) {
      if(qty > 0 && thanger > 0) {
        let mod = Number(qty) % Number(thanger)
        let tot = Number(qty) / Number(thanger)
        return Number.parseInt(tot) + (mod > 0 ? ' + (' + mod + ' ' + unit + ')' :'')
      }
    },
    setCustomerReference(val) {
      if(!val) {
        this.rsForm.packing_items.item_id = null
      }
      else {
        this.SHEET.load('items', 'customer_id='+val)  
      }
    },
    setItemReference(val) {
      if(!val) {
        this.rsForm.packing_items.unit_id = null
        this.rsForm.packing_items.unit = {}
        this.rsForm.packing_items.item = {}
      }
      else{
        let baseUnitID = this.MAPINGKEY['items'][val].unit_id
        this.rsForm.packing_items.unit_id = baseUnitID
        this.rsForm.packing_items.unit_rate = 1

        this.rsForm.packing_items.item = this.MAPINGKEY['items'][val]
        this.rsForm.packing_items.unit = this.MAPINGKEY['units'][baseUnitID]
        
        this.rsForm.packing_items.work_order_item_id = null
        this.SHEET.load('work_orders', 'item_id='+val)
      }
    },
    // setWorkOrderItemReference(val) {
    //   if(!val) {
    //      this.rsForm.packing_items.item_id = null
    //     this.rsForm.packing_items.unit_id = null
    //     this.rsForm.packing_items.unit = {}
    //     this.rsForm.packing_items.item = {}
    //   }
    //   else{
    //     let itemID = this.MAPINGKEY['work_orders'][val].item_id
    //     this.rsForm.packing_items.item_id = itemID

    //     let baseUnitID = this.MAPINGKEY['items'][val].unit_id
    //     this.rsForm.packing_items.unit_id = baseUnitID
    //     this.rsForm.packing_items.unit_rate = 1

    //     this.rsForm.packing_items.item = this.MAPINGKEY['items'][val]
    //     this.rsForm.packing_items.unit = this.MAPINGKEY['units'][baseUnitID]
    //   }
    // },

    setUnitReference(val) {
      if(!val) return;
      else if (this.rsForm.packing_items.item.unit_id === val) {
        this.rsForm.packing_items.unit_rate = 1
      }
      else {
        if(this.rsForm.packing_items.item.item_units) {
          this.rsForm.packing_items.item.item_units.map((unitItem)=> {
            if (unitItem.unit_id == val) this.rsForm.packing_items.unit_rate = unitItem.rate
          })
        }
      }
    },

    addNewItemFault(autofocus = true){
      let newEntri =  this.setDefault().packing_items.packing_item_faults[0];
      
      this.rsForm.packing_items.packing_item_faults.push(newEntri)
    },
    removeItemFault(index) {
        this.rsForm.packing_items.packing_item_faults.splice(index, 1)
        if(this.rsForm.packing_items.packing_item_faults.length < 1) this.addNewItemFault()
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