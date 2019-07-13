<template>
<q-page padding class="main-page justify-center" v-if="SHOW">
  <q-card inline class="q-ma-sm ">
    <q-card-section>
      <form-header :title="FORM.title()" :subtitle="FORM.subtitle()" >
        <template slot="menu-item">
          <list-item :label="$tc('label.remove')" icon="delete" clickable @click="FORM.delete" v-close-popup v-if="$route.params.id"/>
        </template>
      </form-header>
    </q-card-section>
    <!-- COLUMN::1st customer Identitity -->
    <q-card-section class="row q-col-gutter-sm q-col-gutter-x-md">
      <div class="col-12 col-sm-6" >
        <div class="row q-col-gutter-x-sm q-mb-md">
          <q-input name="number" class="col-12" 
            label="No Transaction" 
            placeholder="[Auto Generate]" 
            v-model="rsForm.number" 
            v-validate="$route.meta.mode == 'edit' ? 'required':''"
            :error="errors.has('number')" 
            :error-message="errors.first('number')"/>
            
          <select-filter name="customer_id" class="col-12" 
            v-model="rsForm.customer_id"
            :label="$tc('general.customer')" 
            :options="CustomerOptions" filter clearable
            v-validate="'required'"
            :error="errors.has('customer_id')" 
            :error-message="errors.first('customer_id')"
            @input="setCustomerReference" />
        </div>
      </div>
      <!-- COLUMN::2nd Transaction details -->
      <div class="col-12 col-sm-6" >
        <div class="row q-col-gutter-x-sm">
          
          <q-input name="customer_name" class="col-12"
            stack-label label="Name" 
            v-model="rsForm.customer_name" 
            v-validate="'required'"/>
            
          <q-input name="customer_phone" class="col-12"
            stack-label label="phone" 
            v-model="rsForm.customer_phone" 
            v-validate="'required'"/>
            
          <q-input name="customer_address" class="col-12"
            type="textarea" rows="2"
            stack-label label="Address" 
            v-model="rsForm.customer_address" />
        </div>
      </div>
      <!-- COLUMN::3th Part items lists -->
      <div class="col-12 q-my-md" v-if="ShipDeliveryItemOptions.length > 0">
        <q-table ref="table" :data="rsForm.ship_delivery_items" dense hide-bottom class="table d-grid full-width shadow-1"
          :rows-per-page-options ="[0]"
          :columns="[
            { name: 'prefix', label: '', field:'id', align: 'left'},
            { name: 'code', label: '#code', align: 'left', field:(v)=> v.item.code, style:'padding:10px 7px'},
            { name: 'item_id', label: 'Part item', align: 'left', field:(v)=> v.item.part_name},
            { name: 'quantity', label: 'Quantity', align: 'center', field: 'quantity'},
            { name: 'unit_id', label: 'unit', align: 'center', field:(v)=> v.unit.name},
          ]"
          :pagination="{ rowsPerPage: 0}"
          >
          
        </q-table>
      </div>
      <!-- COLUMN::4th Description -->
      <div class="col-12">
        <div class="row q-col-gutter-x-sm q-mb-md">
          
          <select-filter name="operator_id" class="col-12"
            stack-label label="Operator" 
            v-model="rsForm.operator_id" 
            :options="OperatorOptions" 
            v-validate="'required'"
            :error="errors.has(`operator_id`)" 
            :error-message="errors.first(`operator_id`)"/>
            
          <q-input name="date" type="date" class="col-12 col-sm-8 col-md-4"
            stack-label label="Date" 
            v-model="rsForm.date" 
            v-validate="'required'"
            :error="errors.has('date')" 
            :error-message="errors.first('date')"/>
            
          <q-input name="time" type="time" class="col-12 col-sm-4 col-md-2"
            stack-label label="Time" 
            v-model="rsForm.time" 
            v-validate="'required'"
            :error="errors.has(`time`)" 
            :error-message="errors.first(`time`)"/>
            
          <q-input name="due_date" type="date" class="col-12 col-sm-8 col-md-4"
            stack-label label="Due Date" 
            v-model="rsForm.due_date" 
            v-validate="'required'" 
            :error="errors.has('due_date')" 
            :error-message="errors.first('due_date')"/>
            
          <q-input name="due_time" type="time" class="col-12 col-sm-4 col-md-2"
            stack-label label="Due Time" 
            v-model="rsForm.due_time"  
            v-validate="'required'"
            :error="errors.has('due_time')" 
            :error-message="errors.first('due_time')"/>
            
          <q-input name="description"  class="col-12" 
            filled type="textarea" rows="3"
            stack-label label="Description" 
            v-model="rsForm.description"/>

        </div>
      </div>
    
    </q-card-section>
    <q-separator :dark="LAYOUT.isDark" />
    <q-card-actions class="group">
      <q-btn :label="$tc('label.cancel')" icon="cancel" color="dark" @click="FORM.toBack()"></q-btn>
      <q-btn :label="$tc('label.reset')" icon="refresh" color="light" @click="setForm(FORM.data)"></q-btn>
      <q-btn :label="$tc('label.save')" icon="save" color="positive" @click="onSave()" v-if="IS_EDITABLE"></q-btn>     
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
      SHEET: {
        ship_delivery_items: {autoload:false, api:'/api/v1/incomes/ship-delivery-items?mode=all&--scope=wait'},
        customers: {data:[], api:'/api/v1/incomes/customers?mode=all'},
        operators: {data:[], api:'/api/v1/references/operators?mode=all'},
        vehicles: {data:[], api:'/api/v1/references/vehicles?mode=all'},
        units: {data:[], api:'/api/v1/references/units?mode=all'},
        items: {data:[], api:'/api/v1/common/items?mode=all'},
        // itemstocks: {data:[], api:'/api/v1/common/items?mode=itemstock'},
      },
      FORM:{
        resource:{
          api: '/api/v1/incomes/ship-deliveries',
          uri: '/admin/incomes/delivery/ship-deliveries',
        }
      },
      rsForm: {},
      setDefault:()=>{
        return {
          number: null,
          date: this.$app.moment().format('YYYY-MM-DD'),
          time: this.$app.moment().format('HH:mm'),

          customer_id: null,
          customer_name: null,
          customer_phone: null,
          customer_address: null,

          operator_id: null,
          transport_number: null,
          transport_rate: null,

          due_date: this.$app.moment().format('YYYY-MM-DD'),
          due_time: this.$app.moment().format('HH:mm'),

          description: null,
          revise_id: 0,
          ship_delivery_items:[]

        }
      }
    }
  },
  created() {
    // Component Page Created!
    this.init()
  },
  computed: {
    IS_EDITABLE() {
      if (this.rsForm.hasOwnProperty('revise_id') && this.rsForm.is_revision == true) return false
      if (this.rsForm.hasOwnProperty('has_relationship')) {
        if (Object.keys(this.rsForm.has_relationship).length > 0) return false
      }
      return true
    },
    ShipDeliveryItemOptions() {
      if (!this.rsForm.customer_id) return []
      
      let data = this.SHEET['ship_delivery_items'].data.slice()
      this.rsForm.ship_delivery_items = data
      return data
    },
    CustomerOptions() {
      // let label = [item.code, item.name].join('-')
      return (this.SHEET.customers.data.map(item => ({label: [item.code, item.name].join(' - '), value: item.id})) || [])
    },
    TransportOptions() {
      return (this.SHEET.vehicles.data.map(item => ({label: item.name, value: item.name})))
    },
    OperatorOptions() {
      return (this.SHEET.operators.data.map(item => ({label: item.name, value: item.id})) || [])
    },
    VehicleOptions() {
      return (this.SHEET.vehicles.data.map(item => ({label: item.name, value: item.id})) || [])
    },
    UnitOptions() {
      return (this.SHEET.units.data.map(item => ({label: item.code, value: item.id})) || [])
    },
    ItemOptions() {
      let ITEM = this.SHEET.items.data.filter((item) => item.customer_id === this.rsForm.customer_id)
      return (ITEM.map(item => ({label: `${item.code} - ${item.part_name}`, value: item.id})) || [])
    },
    ItemUnitOptions() {
      let vars = []
      for (const i in this.rsForm.ship_delivery_items) {
        if (this.rsForm.ship_delivery_items.hasOwnProperty(i)) {
          let rsItem = this.rsForm.ship_delivery_items[i]
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
    MAPINGKEY(){
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
    setCustomerReference(val) {
      if(this.rsForm.customer_id) {
        this.rsForm.customer_name = this.MAPINGKEY['customers'][val].name
        this.rsForm.customer_phone = this.MAPINGKEY['customers'][val].phone
        this.rsForm.customer_address = this.MAPINGKEY['customers'][val].address_raw

        this.SHEET.load('ship_delivery_items', 'customer_id='+val)
      }
      else {
        this.rsForm.customer_name = null
        this.rsForm.customer_phone = null
        this.rsForm.customer_address = null
      }
    },
    setForm(data) {
      this.rsData =  JSON.parse(JSON.stringify(data))
      this.rsForm =  JSON.parse(JSON.stringify(data))
      if(data.hasOwnProperty('has_relationship') && Object.keys(data['has_relationship']).length > 0) {  
        this.FORM.response.relationship({
          title: 'Ship-Delivery has relations!',
          messages: data['has_relationship'],
          then: () => this.$router.push(`${this.FORM.resource.uri}/${data.id}`)
        })
      }
      
    },

    addNewItem(autofocus = true){
      let newEntri = this.setDefault().ship_delivery_items[0] // {id:null, item_id: null, quantity: null};
      
      this.rsForm.ship_delivery_items.push(newEntri)
    },
    removeItem(index) {
        this.rsForm.ship_delivery_items.splice(index, 1)
        // if(this.rsForm.ship_delivery_items.length < 1) this.addNewItem()
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
          console.warn('SAVE-ERROR', error.response)
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