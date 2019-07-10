<template>
<q-page padding class="form-page" v-if="SHOW">
  <q-card inline class="main-box" :dark="LAYOUT.isDark">
    <q-card-section>
      <form-header :title="FORM.title()" :subtitle="FORM.subtitle()" >
        <q-chip slot="optional" v-if="rsForm.status === 'VOID'"
          icon="bookmark"  class="text-weight-medium"
          label="void" color="negative" outline/>
        <template slot="menu-item">
          <list-item :label="$tc('label.remove')" icon="delete" clickable @click="FORM.delete" v-close-popup v-if="$route.params.id"/>
          <list-item label="void" icon="block" clickable @click="FORM.void" v-close-popup v-if="$route.params.id"/>
        </template>
      </form-header>
    </q-card-section>
    <q-separator :dark="LAYOUT.isDark"></q-separator>
    <!-- COLUMN::1st Transaction details -->
    <q-card-section class="row q-col-gutter-sm">
      <q-field class="col-12"
        borderless dense
        prefix="Transaction mode" 
        :dark="LAYOUT.isDark"
        :error="errors.has('transaction')" 
        v-if="this.$route.meta.mode !== 'edit'">
        <q-option-group 
          name="transaction" type="radio" inline
          v-model="rsForm.transaction" 
          v-validate="'required'"
          :dark="LAYOUT.isDark"
          :disable="this.$route.meta.mode == 'edit'"
          :options="[
            { label: 'REGULER', value: 'REGULER' },
            { label: 'RETURN', value: 'RETURN' }
          ]"
          @input="(val) => setTransactionReference(val)"
        />
      </q-field>
      <div class="col-12 col-sm-6" >
        <div class="row q-col-gutter-x-sm">
          <q-input  name="number" class="col-12"
            :label="$tc('label.number')" 
            placeholder="[Auto Generate]" 
            :dark="LAYOUT.isDark"
            v-model="rsForm.number" 
            v-validate="$route.meta.mode == 'edit' ? 'required':''"
            :error="errors.has('number')" :error-message="errors.first('number')"
          />
          <q-input name="registration" class="col-12" 
            :label="$tc('incoming_goods.registration')" 
            v-model="rsForm.registration" 
            v-validate="'required'"
            :dark="LAYOUT.isDark"
            :error="errors.has('registration')" :error-message="errors.first('registration')"
          />
          
          <q-input name="date" type="date" class="col-12 col-sm-8"
            :label="$tc('label.date')" stack-label
            v-model="rsForm.date"  
            v-validate="'required|date_format:yyyy-MM-dd|before:2019-09-09'"
            :dark="LAYOUT.isDark"
            :error="errors.has('date')" 
            :error-message="errors.first('date')">
          </q-input>
         
          <q-input name="time" type="time" class="col-12 col-sm-4"  
            :label="$tc('label.time')" stack-label
            v-model="rsForm.time" 
            v-validate="'required'"
            :dark="LAYOUT.isDark"
            :error="errors.has('time')" :error-message="errors.first('time')"/>
        </div>
      </div>
      <div class="col-12 col-sm-6" >
        <div class="row q-col-gutter-x-sm">
          <select-filter name="customer" class="col-12"
            :label="$tc('general.customer')"  
            v-model="rsForm.customer_id" 
            :options="CustomerOptions" clearable
            :disable="IssetItemDetails"
            v-validate="'required'"
            :dark="LAYOUT.isDark" :options-dark="LAYOUT.isDark"
            :error="errors.has('customer')" 
            :error-message="errors.first('customer')"
            @input="(val) => setCustomerReference(val)"/>
          <q-tooltip :disable="!IssetItemDetails" :offset="[0, 10]">To change, Please delete Item goods first!</q-tooltip>
          <!--  -->
          <q-input class="col-12"
            name="reference_number" 
            stack-label label="No. Ref." 
            v-model="rsForm.reference_number" 
            v-validate="''"
            :dark="LAYOUT.isDark"
            :error="errors.has('reference_number')" 
            :error-message="errors.first('reference_number')"/>
         
         
          <q-input class="col-12"
            name="reference_date" type="date"
            stack-label label="Ref. Date" 
            v-model="rsForm.reference_date" 
            v-validate="''"
            :dark="LAYOUT.isDark"
            :error="errors.has('reference_date')" 
            :error-message="errors.first('reference_date')"/>

        </div>
      </div>
    </q-card-section>
    <!-- COLUMN::2nd Request orders -->
    <q-separator inset spaced :dark="LAYOUT.isDark"></q-separator>
    <q-card-section class="row q-col-gutter-sm">
      <div class="col-12">
        <div class="row q-col-gutter-x-sm">
          <select-filter class="col-12 col-sm-4"
            name="order_mode" 
            v-model="rsForm.order_mode" 
            disable filled borderless hide-dropdown-icon
            label="Request orders mode" 
            :options="$store.state.admin.CONFIG.options.order_mode"
            v-validate="'required'"
            :dark="LAYOUT.isDark"
            :error="errors.has('order_mode')" 
            :error-message="errors.first('order_mode')"/>
          
          
          <select-filter class="col-12 col-sm-8" v-if="rsForm.request_order_id != null"
            name="request_order_id" 
            v-model="rsForm.request_order_id" 
            label="Request Orders" 
            disable filled borderless hide-dropdown-icon
            :options="RequestOrderOptions" 
            :dark="LAYOUT.isDark"
            :error="errors.has('request_order_id')" 
            :error-message="errors.first('request_order_id')" />
        
        </div>
      </div>
      <!-- Incoming Items lists -->
      
      <div class="col-12">
        <q-table ref="table" class="main-box bordered no-shadow"
          :data="rsForm.incoming_good_items" dense
          :dark="LAYOUT.isDark"
          :rows-per-page-options ="[0]" hide-bottom
          :columns="[
            { name: 'prefix', field: 'prefix', label: '',  align: 'left'},
            { name: 'item_id', field: 'item_id', label: 'Item details', align: 'left'},
            { name: 'quantity', field: 'quantity', label: 'Quantity', align: 'center'},
            { name: 'unit_id', field: 'unit_id', label: 'Unit', align: 'center'},
          ]"
          :pagination="{ sortBy: null, descending: false, page: null, rowsPerPage: 0 }"
          >
          
            <template v-slot:body-cell-prefix="{row}">
              <q-td  style="width:50px">
                <q-btn dense  @click="removeItem(row.__index)" icon="delete" color="negative"/>
              </q-td>
            </template>
            <template v-slot:body-cell-item_id="{row}">  
              <q-td width="45%">
                <select-filter 
                  :name="`items.${row.__index}.item_id`" 
                  dense outlined hide-bottom-space color="blue-grey-5"
                  v-model="row.item_id" 
                  v-validate="'required'"
                  emit-value map-options clearable
                  :options="ItemOptions"
                  :dark="LAYOUT.isDark" :options-dark="LAYOUT.isDark"
                  :readonly="!IssetCustomerID"
                  @input="(val)=>{ setItemReference(row.__index, val) }"
                  :error="errors.has(`items.${row.__index}.item_id`)"
                  :error-message="errors.first(`items.${row.__index}.item_id`)"
                />
                <q-tooltip :v-if="IssetCustomerID" :offset="[0, 10]">Select a customer, first! </q-tooltip>
                
              </q-td>
            </template>
            <template v-slot:body-cell-quantity="{row}">
              <q-td width="25%">
                <q-input 
                  :name="`items.${row.__index}.quantity`" type="number"
                  v-model="row.quantity" 
                  v-validate="row.item_id ? 'required' : ''"
                  dense outlined hide-bottom-space color="blue-grey-5"
                  :dark="LAYOUT.isDark"
                  :error="errors.has(`items.${row.__index}.quantity`)"/>
              </q-td>
            </template>
            <template v-slot:body-cell-unit_id="{row}">
              <q-td width="25%">
                <q-select :name="`items.${row.__index}.unit_id`" 
                  v-model="row.unit_id" 
                  dense outlined hide-bottom-space color="blue-grey-5"
                  @input="(val)=> { setUnitReference(row.__index, val) }"
                  :options="ItemUnitOptions[row.__index]" 
                  map-options
                  :dark="LAYOUT.isDark" :options-dark="LAYOUT.isDark"
                  v-validate="row.item_id ? 'required' : ''"
                  :error="errors.has(`items.${row.__index}.unit_id`)"/>
              
                <q-input v-model="row.unit_rate" class="hidden" />
              </q-td>
            </template>

          <q-tr slot="bottom-row" slot-scope="props" :props="props">
            <q-td colspan="100%">
              <strong><q-btn dense  @click="addNewItem()" icon="add" color="positive"/></strong>
            </q-td>
          </q-tr>
        </q-table>
      </div>
      <!-- COLUMN::4th Description -->
      <div class="col-12">
        <div class="row q-col-gutter-x-md q-mb-md">
          <q-input class="col-12 col-md-6"
            name="transport_number"  
            label="Transport number" stack-label 
            v-model="rsForm.transport_number" 
            autocomplete="off"
            :dark="LAYOUT.isDark"
            :error="errors.has('transport_number')" 
            :error-message="errors.first('transport_number')" />

          <q-input class="col-12 col-md-6"
            name="transport_rate" type="number"
            label="Rate" 
            v-model="rsForm.transport_rate" 
            v-validate="''" 
            :dark="LAYOUT.isDark"
            :error="errors.has('transport_rate')" 
            :error-message="errors.first('transport_rate')" />

          <q-input class="col-12"
            name="description" type="textarea" rows="3" 
            stack-label label="Description" 
            :dark="LAYOUT.isDark"
            v-model="rsForm.description"/>
        </div>
      </div>
    </q-card-section>
    <q-separator :dark="LAYOUT.isDark" />
    <q-card-actions class="q-mx-lg">
      <q-btn :label="$tc('label.cancel')" icon="cancel" color="dark" @click="FORM.toBack()"></q-btn>
      <q-btn :label="$tc('label.reset')" icon="refresh" color="light" @click="setForm(FORM.data)"></q-btn>
      <q-btn :label="$tc('label.save')" icon="save" color="positive" @click="onSave()" v-if="IS_EDITABLE"></q-btn>     
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
      SHEET:{
        customers: {data:[], api:'/api/v1/incomes/customers?mode=all'},
        request_orders: {data:[], api:'/api/v1/incomes/request-orders?mode=detail-items&fields=customer_id,number'},
        brands: {data:[], api:'/api/v1/references/brands?mode=all'},
        units: {data:[], api:'/api/v1/references/units?mode=all'},
        vehicles: {data:[], api:'/api/v1/references/vehicles?mode=all'},
        items: {data:[], api:'/api/v1/common/items?mode=all'}
      },
      FORM:{
        resource:{
          uri: '/admin/warehouses/incoming-goods',
          api: '/api/v1/warehouses/incoming-goods',
        },
      },
      rsForm: {},
      setDefault:()=>{
        return {
          number: null,
          date: this.$app.moment().format('YYYY-MM-DD'),
          time: this.$app.moment().format('HH:mm'),

          customer_id: null,
          reference_number: null,
          reference_date: null, // this.$app.moment().format('YYYY-MM-DD'),

          transaction: null,
          order_mode: null,
          request_order_id: null,

          transport_number: null,
          tranport_rate: null,
          description: null,
          
          incoming_good_items:[ 
            {
              id:null, 
              item_id: null, item: {},
              quantity: null,

              unit_id: null,
              unit_rate: 1,

              request_order_id: null
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
    IS_EDITABLE() {
      if (this.rsData.hasOwnProperty('has_relationship') && Object.keys(this.rsData.has_relationship).length > 0) {
        return false
      }

      return true
    },
    IssetItemDetails() {
        let items = this.rsForm.incoming_good_items
        for (const i in items) {
          if (items.hasOwnProperty(i)) {
            if(items[i].item_id) return true
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
    RequestOrderOptions() {
      // let label = [item.code, item.name].join('-')
      let cid = this.rsForm.customer_id
      let data = this.SHEET.request_orders.data
      
      if (cid) data = data.filter(rs=> rs.customer_id == cid)
      return (data.map(rs => ({label: [rs.number].join(' - '), value: rs.id})) || [])
    },
    BrandOptions() {
      return (this.SHEET.brands.data.map(item => ({label: item.name, value: item.id})) || [])
    },
    TransportOptions() {
      return this.SHEET.vehicles.data.map(item =>  ({
          label: item.name,
          value: item.name
        })
      )
    },
    UnitOptions() {
      return (this.SHEET.units.data.map(item => ({label: item.code, value: item.id})) || [])
    },
    RequestOrderItemOptions() {
      if(this.rsForm.order_mode === 'PO') {
        // Filter in RequestOrder
        console.log('Filter in RequestOrder')
        let row = this.MAPINGKEY['request_orders'][this.rsForm.request_order_id] || {}
        let details = row.request_order_items || []
        return (details.map(detail => {
          let item = this.MAPINGKEY['items'][detail.item_id] || {}
          let unit = this.MAPINGKEY['units'][detail.unit_id] || {}
            return {label: `[${item.code}] ${item.part_name} (${detail.quantity} ${unit.code}) `, value: detail.id}
        }) || [] )
      }

      return []
    },
    ItemOptions() {
      
        // Filter in Customer
        let Items = this.SHEET.items.data || []
        Items = Items.filter((item) => item.customer_id === this.rsForm.customer_id)

        return (Items.map(item => ({label: item.part_name, sublabel: `[${item.code}] - No.${item.part_number}`, value: item.id}) || []))
    },
    ItemUnitOptions() {
      let vars = []
      for (const i in this.rsForm.incoming_good_items) {
        if (this.rsForm.incoming_good_items.hasOwnProperty(i)) {
          let rsItem = this.rsForm.incoming_good_items[i]
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
    MAPINGKEY() {
      let variables = {
        'customers' : {},
        'units': {},
        'items': {},
        'request_orders': {}
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
    setForm(data) {
      this.rsData =  JSON.parse(JSON.stringify(data))
      this.rsForm =  JSON.parse(JSON.stringify(data))

      if(data.hasOwnProperty('has_relationship') && Object.keys(data['has_relationship']).length > 0) {
        
        this.FORM.response.relationship({
          title: 'Incoming goods has relations!',
          messages: data['has_relationship'],
          then: () => this.$router.push(`${this.FORM.resource.uri}/${data.id}`)
        })
      }
    },
    setTransactionReference(val) {    
      if (val == 'RETURN') {
        this.rsForm.order_mode = 'NONE'
        return false
      }
      else if (val == 'REGULER' && this.rsForm.customer_id) {
        this.setCustomerReference(this.rsForm.customer_id)
      }
    },
    setCustomerReference(val) {
      if(!val){
        this.rsForm.order_mode = null
        return
      }
      if (this.rsForm.transaction == 'RETURN') {
        this.rsForm.order_mode = 'NONE'
      }
      else{
        const customer = this.MAPINGKEY['customers'][val]
        if (customer) {
          this.rsForm.order_mode = this.MAPINGKEY['customers'][val].order_mode
        }
      }
    },
    setItemReference(index, val) {
      
      if(!val){
        this.rsForm.incoming_good_items[index].unit_id = null
        this.rsForm.incoming_good_items[index].unit_rate = 1
        this.rsForm.incoming_good_items[index].unit = {}
        this.rsForm.incoming_good_items[index].item = {}
      }
      else{
        this.rsForm.incoming_good_items[index].item = this.MAPINGKEY['items'][val]

        let baseUnitID = this.MAPINGKEY['items'][val].unit_id
        this.rsForm.incoming_good_items[index].unit_id = baseUnitID
        this.rsForm.incoming_good_items[index].unit_rate = 1
        this.rsForm.incoming_good_items[index].unit = this.MAPINGKEY['units'][baseUnitID]
      }

    },
    setUnitReference(index, val) {
      
      if(!val) return;
      else if (this.rsForm.incoming_good_items[index].item.unit_id === val) {
        this.rsForm.incoming_good_items[index].unit_rate = 1
      }
      else {
        if(this.rsForm.incoming_good_items[index].item.item_units) {
          this.rsForm.incoming_good_items[index].item.item_units.map((unitItem)=> {
            if (unitItem.unit_id == val) this.rsForm.incoming_good_items[index].unit_rate = unitItem.rate
          })
        }
      }
    },

    addNewItem(autofocus){
      autofocus = autofocus || false
      let newEntri = this.setDefault().incoming_good_items[0] // {id:null, item_id: null, quantity: null};
      
      this.rsForm.incoming_good_items.push(newEntri)
    },
    removeItem(index) {
        this.rsForm.incoming_good_items.splice(index, 1)
        if(this.rsForm.incoming_good_items.length < 1) this.addNewItem()
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
          this.FORM.response.error(error.response, 'UPDATE FAILED');
          this.FORM.response.fields(error.response);
        })
        .finally(()=>{
          this.FORM.loading = false
        });
        
      });
    },
  },
}
</script>