<template>
<q-page padding class="main-page row justify-center" v-if="SHOW">
  <q-card inline class="main-box self-start">
    <q-card-section>
      <form-header :title="FORM.title()" :subtitle="FORM.subtitle()" >
        <template slot="menu-item">
          <list-item :label="$tc('label.remove')" icon="delete" clickable @click="FORM.delete" v-close-popup v-if="$route.params.id"/>
        </template>
      </form-header>
    </q-card-section>
    <q-card-section>
      <div class="row q-gutter-sm q-gutter-x-md">
        <!-- COLUMN::1st customer Identitity -->
        <q-field class="col-12" :error="errors.has('customer_id')" :error-message="errors.first('customer_id')">
          <q-select name="customer_id" v-model="rsForm.customer_id" stack-label label="Customer"  v-validate="'required'"
            :options="CustomerOptions" filter clearable
            @input="setCustomerReference"
          />
        </q-field>
        <!-- COLUMN::2th Part items lists -->
        <div class="col-12 q-my-md full-width-100">
          <span class="hidden">{{ MaxMount }}</span> 
          <q-table ref="table" :data="rsForm.ship_delivery_items" dense hide-bottom class="d-grid no-shadow"
            :rows-per-page-options ="[0]"
            :columns="[
              { name: 'prefix', label: '',  align: 'left'},
              { name: 'item_id', label: 'Part item', align: 'left'},
              { name: 'quantity', label: 'Quantity', align: 'center'},
              { name: 'unit_id', label: 'unit', align: 'center'},
            ]"
            :pagination="{ rowsPerPage: 0}"
            >
            <template slot="body" slot-scope="propItem">
              <q-tr :propItem="propItem">
                <q-td key="prefix" style="width:50px">
                  <!-- <q-btn dense  @click="removeItem(propItem.row.__index)" icon="delete" color="blue-grey-5"/> -->
                </q-td>
                <q-td key="item_id" width="50%" >
                  <q-field style="min-width:150px" :error="errors.has(`ship_delivery_items.${propItem.row.__index}.item_id`)">
                    <q-select :name="`ship_delivery_items.${propItem.row.__index}.item_id`" v-model="propItem.row.item_id"	inverted color="blue-grey-5" 
                      v-validate="'required'" 
                      :options="ItemOptions" filter
                      readonly
                    />
                    <q-tooltip :disable="IssetCustomerID" :offset="[0, 10]">Select a customer, first! </q-tooltip>
                  </q-field>
                </q-td>
                <q-td key="quantity" width="25%">
                    <q-field  style="min-width:120px" :error="errors.has(`ship_delivery_items.${propItem.row.__index}.quantity`)" >
                      <q-input :name="`ship_delivery_items.${propItem.row.__index}.quantity`" v-model="propItem.row.quantity" type="number" align="center" inverted color="blue-grey-5"
                        :suffix="propItem.row.item_id ? `&nbsp;/&nbsp; ${propItem.row.maximum}` : ''"
                        v-validate="FORM.validator.quantity(propItem.row, propItem.row.maximum)"
                      />
                    </q-field>
                </q-td>
                <q-td key="unit_id" width="20%" >
                  <q-field  style="min-width:100px" :error="errors.has(`ship_delivery_items.${propItem.row.__index}.unit_id`)" >
                    <q-select :name="`ship_delivery_items.${propItem.row.__index}.unit_id`" v-model="propItem.row.unit_id"	inverted color="blue-grey-5"
                      :options="ItemUnitOptions[propItem.row.__index]"
                      v-validate="propItem.row.item_id ? 'required' : ''"
                      @input="(val)=>{ setUnitReference(propItem.row.__index, val) }"
                    />
                  </q-field>
                </q-td>
              </q-tr>
              <!-- <q-tr  class="" :propItem="propItem" v-if=" propItem.row.item_id">
                <q-td></q-td>
                <q-td colspan="2">
                  <div class="text-left">
                    <table class="table-description full-width">
                      <tr><td>No Plate    </td><td>{{ propItem.row.item.part_number }}</td></tr>
                      <tr><td>Plate name  </td><td>{{ propItem.row.item.part_name }}</td></tr>
                    </table>
                  </div>
                </q-td>
                  <q-td colspan="2">
                  <div class="text-left" >
                    <table class="table-description full-width">
                      <tr><td>Quantity    </td><td>{{ formatNumber(Number(propItem.row.quantity) * Number(propItem.row.unit_rate)) }} {{ propItem.row.unit.name }}</td></tr>
                      <tr><td>FG #alias    </td><td>{{ propItem.row.item.part_alias }}</td></tr>
                    </table>
                  </div>
                </q-td>
              </q-tr> -->
            </template>
            <q-tr slot="bottom-row" slot-scope="prop" :scope="prop">
              <q-td colspan="100%" class="text-center" v-if="rsForm.ship_delivery_items && rsForm.ship_delivery_items.length == 0">
                <span>No data</span> 
              </q-td>
            </q-tr>
          </q-table>
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
      SHEET: {
        customers: {api:'/api/v1/incomes/customers?mode=all'},
        units: {api:'/api/v1/references/units?mode=all'},
        items: {api:'/api/v1/common/items?mode=all', autoload:false},
        // itemstocks: {api:'/api/v1/common/items?mode=itemstock'},
      },
      FORM:{
        resource:{
          api: '/api/v1/incomes/ship-delivery-items',
          uri: '/admin/incomes/delivery/ship-delivery-items',
        },
        validator: {
          quantity: (row, max) => {
            let 
              validation = [],
              isMaxValidation = this.$store.state.admin.CONFIG.model.pre_deliveries.max_quantity_validation

            if (row.item_id && isMaxValidation === true) {
              validation.push(`max_value:${max}`)
            }
            return validation.join('|')
          }
        }
      },
      rsForm: {},
      setDefault:()=>{
        return {
        
          customer_id: null,    
          pre_delivery_id: null,
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
    IssetIncomeItems() {
        let items = this.rsForm.ship_delivery_items
        for (const i in items) {
          if (items.hasOwnProperty(i) && items[i].item_id) {
            return true
          }
        }

        return false
    },
    IssetCustomerID() {
      return (this.rsForm.customer_id ? true : false)
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
    MaxMount() {
      if(! this.rsForm.customer_id || this.SHEET.items.data.length == 0) return []
     
      let data = []
      data.slice()

      this.SHEET.items.data.map((detail, index) => {
        
        if (detail.customer_id === this.rsForm.customer_id && Number(detail.totals['PDO']) > 0) {
          data.push({
            item_id: detail.id, 
            unit_id: detail.unit_id,
            unit_rate: 1, 
            quantity: null, 
            maximum: Number(detail.totals['PDO']),
            item: detail,
            })
        }
      })

      this.rsForm.ship_delivery_items = data
      return data
    },
    MAPINGKEY(){
      let variables = {
        'customers' : {},
        'units': {},
        'items': {}
      }
      
      this.SHEET['customers'].data.map(value => { variables['customers'][value.id] = value })
      this.SHEET['units'].data.map(value => { variables['units'][value.id] = value })
      this.SHEET['items'].data.map(value => { variables['items'][value.id] = value })
      // this.SHEET['itemstocks'].data.map(value => { variables['itemstocks'][value.id] = value })

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
    numUnitConvertion(row, val = 0) {
      return Number(val) / Number(row.unit_rate || 1)
    },
    onItemReference() {
      if(!this.rsForm.customer_id) {
        this.$q.notify('Select a customer !')
      }
    },
    setCustomerReference(val) {
      if(this.rsForm.customer_id) {
        this.rsForm.customer_name = this.MAPINGKEY['customers'][val].name
        this.rsForm.customer_phone = this.MAPINGKEY['customers'][val].phone
        this.rsForm.customer_address = this.MAPINGKEY['customers'][val].address_raw

        this.SHEET.load('items', 'customer_id='+ val)
        this.rsForm.ship_delivery_items = this.MaxMount
      }
      else {
        this.rsForm.customer_name = null
        this.rsForm.customer_phone = null
        this.rsForm.customer_address = null
      }
    },
    setUnitReference(index, val) {
      if(!val) return;
      else if (this.rsForm.ship_delivery_items[index].item.unit_id === val) {
        this.rsForm.ship_delivery_items[index].unit_rate = 1
      }
      else {
        if(this.rsForm.ship_delivery_items[index].item.item_units) {
          this.rsForm.ship_delivery_items[index].item.item_units.map((itemUnit)=> {
            if (itemUnit.unit_id == val) this.rsForm.ship_delivery_items[index].unit_rate = itemUnit.rate
          })
        }
      }
    },
    setForm(data) {
      this.rsForm =  JSON.parse(JSON.stringify(data))

      if(data.customer_id) this.SHEET.load('items', 'customer_id='+ data.customer_id)

      if(data.hasOwnProperty('has_relationship') && Object.keys(data['has_relationship']).length > 0) {  
        this.FORM.response.relationship({
          title: 'Verify has relations!',
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
        
        if (0 === this.rsForm.ship_delivery_items.reduce((total, x) => total + Number(x.quantity || 0),0)) {
          console.warn('invalide!')
          this.$app.notify.error('Submit Invalid', 'Total must be grather than 0!')
          return;
        }
        this.FORM.loading = true
        let {method, mode, apiUrl} = this.FORM.meta();

        this.$axios.set(method, apiUrl, this.rsForm)
        .then((response) => { 
          let message = 'The Items parts has been created!'
          this.FORM.response.success({message:message})
          this.FORM.toIndex()
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