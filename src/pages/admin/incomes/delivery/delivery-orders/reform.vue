<template>
<q-page padding class="main-page justify-center" v-if="SHOW">
  <q-card inline class="q-ma-sm ">
    <q-card-section>
      <form-header :title="FORM.title()" :subtitle="FORM.subtitle()" >
        <template slot="menu-prepend">
          <q-chip small color="negative" v-if="rsForm.revise_id">
            Revised
          </q-chip>
        </template>
        <template slot="menu-item">
          <list-item :label="$tc('label.remove')" icon="delete" clickable @click="FORM.delete" v-close-popup v-if="$route.params.id"/>
        </template>
      </form-header>
  </q-card-section>
    <q-card-section>
      <div class="row q-gutter-sm q-gutter-x-md">
        <!-- COLUMN::Base Document -->
        <q-field class="col-12 " label="Transaction mode" label-width="3" :error="errors.has('transaction')" :error-message="errors.first('transaction')">
          <div class="row no-wrap">
            <q-option-group class="col" name="transaction" type="radio" v-model="rsForm.transaction" color="secondary" inline
              :options="[
                { label: 'REGULER', value: 'REGULER' },
                { label: 'RETURN', value: 'RETURN' }
              ]"
              v-validate="'required'"/> 
          </div>
        </q-field>
        <!-- COLUMN::1st customer Identitity -->
        <div class="col-12 col-md-6" >
          <div class="row q-gutter-x-sm q-mb-md">
            <q-field class="col-12" :error="errors.has('number')" :error-message="errors.first('number')">
              <div class="row justify no-wrap">
                <q-input class="col" name="number" stack-label label="No Transaction" v-model="rsForm.number" readonly
                  v-validate="$route.meta.mode == 'edit' ? 'required':''"
                />
                <q-input class="col col-auto" name="number" stack-label label="Revision" v-model="rsForm.numrev" readonly 
                  align="center" style="width:70px"
                  v-validate="$route.meta.mode == 'edit' ? 'required':''"
                />
              </div>
            </q-field>
            <q-field class="col-12" :error="errors.has('customer_id')" :error-message="errors.first('customer_id')">
              <q-select name="customer_id" v-model="rsForm.customer_id" :label="$tc('general.customer')" readonly v-validate="'required'"
                :options="CustomerOptions" 
                @input="setCustomerReference"
                ></q-select>
              <q-tooltip :disable="!IssetIncomeItems" :offset="[0, 10]">To change, Please clear Delivery items first!</q-tooltip>
            </q-field>
            <q-field class="col-12 q-pt-lg" :error="errors.has(`request_order_id`)" :error-message="errors.first(`request_order_id`)"
              label="Request Order [PO]" label-width="12">
              <q-select :name="`request_order_id`" v-model="rsForm.request_order_id" readonly
                v-validate="'required'" 
                :options="RequestOrderOptions" 
                @input="setRequestOrderReference"
              />
              <q-tooltip :disable="IssetCustomerID" :offset="[0, 10]">Select a customer, first! </q-tooltip>
              <q-spinner-mat class="field-loading" color="primary" v-if="SHEET['request_orders'].loading"  />
            </q-field>
          </div>
        </div>
        <!-- COLUMN::2nd Transaction details -->
        <div class="col-12 col-md-6" >
          <div class="row q-gutter-x-sm">
            <q-field class="col-12" >
              <q-input name="customer_name" stack-label label="Name" v-model="rsForm.customer_name" v-validate="'required'"/>
            </q-field>
            <q-field class="col-12" >
              <q-input name="customer_phone" stack-label label="phone" v-model="rsForm.customer_phone" v-validate="'required'"/>
            </q-field>
            <q-field class="col-12" >
              <q-input name="customer_address" stack-label label="Address" v-model="rsForm.customer_address"  type="textarea" rows="2" />
            </q-field>
          </div>
        </div>
        <!-- COLUMN::3th Part items lists -->
        <div class="col-12 q-my-md">
          <q-table ref="table" :data="rsForm.delivery_order_items" dense hide-bottom separator="vertical" class="table-border d-grid no-shadow"
            :rows-per-page-options ="[0]"
            :columns="[
              { name: 'item_id', label: 'Part item', align: 'center'},
              { name: 'quantity', label: 'Quantity', align: 'center'},
              { name: 'unit_id', label: 'unit', align: 'center'},
            ]"
            :pagination="{ rowsPerPage: 0}"
            >
            <template slot="body" slot-scope="propItem">
              <q-tr :propItem="propItem">
                <q-td key="item_id" width="50%" >
                  <q-field style="min-width:150px" :error="errors.has(`delivery_order_items.${propItem.row.__index}.item_id`)">
                    <q-select :name="`delivery_order_items.${propItem.row.__index}.item_id`" v-model="propItem.row.item_id"	inverted color="blue-grey-5" 
                      v-validate="'required'" 
                      :options="ItemOptions" filter
                      readonly
                      @input="(val)=>{ setItemReference(propItem.row.__index, val) }"
                    />
                    <q-tooltip :disable="IssetCustomerID" :offset="[0, 10]">Select a customer, first! </q-tooltip>
                  </q-field>
                </q-td>
                <q-td key="quantity" width="25%">
                    <q-field  style="min-width:120px" :error="errors.has(`delivery_order_items.${propItem.row.__index}.quantity`)" >
                      <q-input :name="`delivery_order_items.${propItem.row.__index}.quantity`" v-model="propItem.row.quantity" type="number" align="center" inverted color="blue-grey-5"
                        :suffix="propItem.row.item_id ? `&nbsp;/&nbsp; ${numUnitConvertion(propItem.row, MaxMount[propItem.row.__index])}` : ''"
                        v-validate="FORM.validator.quantity(propItem.row, numUnitConvertion(propItem.row, MaxMount[propItem.row.__index]))"
                      />
                    </q-field>
                </q-td>
                <q-td key="unit_id" width="20%" >
                  <q-field  style="min-width:100px" :error="errors.has(`delivery_order_items.${propItem.row.__index}.unit_id`)" >
                    <q-select :name="`delivery_order_items.${propItem.row.__index}.unit_id`" v-model="propItem.row.unit_id"	inverted color="blue-grey-5"
                      :options="ItemUnitOptions[propItem.row.__index]"
                      v-validate="propItem.row.item_id ? 'required' : ''"
                      @input="(val)=>{ setUnitReference(propItem.row.__index, val) }"
                    />
                  </q-field>
                </q-td>
              </q-tr>
              <q-tr  class="" :propItem="propItem" v-if=" propItem.row.item_id">
                <q-td colspan="1">
                  <div class="text-left">
                    <table class="table-description full-width">
                      <tr><td>No Plate    </td><td>{{ propItem.row.item.part_number }}</td></tr>
                      <tr><td>Plate name  </td><td>{{ propItem.row.item.part_name }}</td></tr>
                    </table>
                  </div>
                </q-td>
                  <q-td colspan="2">
                  <div class="text-left" >
                    <!-- {{propItem.row}} -->
                    <table class="table-description full-width">
                      <tr><td>Quantity    </td><td>{{ formatNumber(Number(propItem.row.quantity) * Number(propItem.row.unit_rate)) }} {{ propItem.row.unit.name }}</td></tr>
                      <tr><td>FG #alias    </td><td>{{ propItem.row.item.part_alias }}</td></tr>
                    </table>
                  </div>
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </div>
        <!-- COLUMN::4th Description -->
        <div class="col-12">
          <div class="row q-gutter-x-lg q-mb-md">
            <q-field class="col-12" :error="errors.has(`operator_id`)" :error-message="errors.first(`operator_id`)">
              <q-select name="operator_id"  stack-label label="Operator" v-model="rsForm.operator_id" :options="OperatorOptions" v-validate="'required'"/>
            </q-field>
            <q-field class="col-12 col-sm-8 col-md-4" :error="errors.has('date')" :error-message="errors.first('date')">
              <q-input name="date" stack-label label="Date" v-model="rsForm.date" type="date" v-validate="'required'"/>
            </q-field>
            <q-field class="col-12 col-sm-4 col-md-2" :error="errors.has('time')" :error-message="errors.first('time')">
              <q-input name="time" stack-label label="Time" v-model="rsForm.time" type="time" v-validate="'required'"/>
            </q-field>
            <q-field class="col-12 col-sm-8 col-md-4" :error="errors.has('due_date')" :error-message="errors.first('due_date')">
              <q-input name="due_date" stack-label label="Due Date" v-model="rsForm.due_date" type="date" v-validate="'required'"/>
            </q-field>
            <q-field class="col-12 col-sm-4 col-md-2" :error="errors.has('due_time')" :error-message="errors.first('due_time')">
              <q-input name="due_time" stack-label label="Due Time" v-model="rsForm.due_time" type="time" v-validate="'required'"/>
            </q-field>
            <q-field class="col-12" icon="rate_review">
              <q-input name="description" type="textarea" rows="3" stack-label label="Description" v-model="rsForm.description"/>
            </q-field>
          </div>
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
        request_orders: {autoload: false, api:'/api/v1/incomes/request-orders?mode=all&--with=request_order_items'},
        customers: {data:[], api:'/api/v1/incomes/customers?mode=all'},
        transports: {data:[], api:'/api/v1/warehouses/transports?mode=all'},
        operators: {data:[], api:'/api/v1/references/operators?mode=all'},
        vehicles: {data:[], api:'/api/v1/references/vehicles?mode=all'},
        units: {data:[], api:'/api/v1/references/units?mode=all'},
        items: {data:[], api:'/api/v1/common/items?mode=all'},
        itemstocks: {data:[], api:'/api/v1/common/items?mode=itemstock'},
      },
      FORM:{
        resource:{
          api: '/api/v1/incomes/delivery-orders',
          uri: '/admin/incomes/delivery/delivery-orders',
        },
        validator: {
          quantity: (row, max) => {
            let 
              validation = ['required'],
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
          number: null,
          num_rev: null,
          transaction: null,

          customer_id: null,
          customer_name: null,
          customer_phone: null,
          customer_address: null,

          operator_id: null,
          // transport_number: null,
          // transport_rate: null,

          date: this.$app.moment().format('YYYY-MM-DD'),
          time: this.$app.moment().format('HH:mm'),
          due_date: this.$app.moment().format('YYYY-MM-DD'),
          due_time: this.$app.moment().format('HH:mm'),

          revise_id: 0,
          description: null,
          delivery_order_items:[ 
            // {
            //   id:null,
            //   item_id: null, item: {},
            //   unit_id: null, unit: {},
            //   unit_rate: 1,
            //   quantity: null
            // }
          ]

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
      if (!this.rsForm.hasOwnProperty('revise_id')) return false

      return !this.rsForm.revise_id
    },
    IssetIncomeItems() {
        let items = this.rsForm.delivery_order_items
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
    RequestOrderOptions() {
      if (!this.rsForm.customer_id) return []

      let data = this.SHEET.request_orders.data || []
      // data = data.filter(row => row.customer_id === this.rsForm.customer_id)

      return data.map(row => ({
        data: row,
        label: `${row.number}`,
        value: row.id
      }))
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
      for (const i in this.rsForm.delivery_order_items) {
        if (this.rsForm.delivery_order_items.hasOwnProperty(i)) {
          let rsItem = this.rsForm.delivery_order_items[i]
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
      if(this.RequestOrderOptions.length == 0) return []
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
      
      this.RequestOrderOptions.map((opt) => {
        opt.data.request_order_items.map((detail) => {
          if(!maxitem.hasOwnProperty(detail.item_id)) maxitem[detail.item_id] = 0
           maxitem[detail.item_id] += Number(detail.unit_amount || 0) 
           maxitem[detail.item_id] -= Number(detail.total_delivery_item || 0)
           // (this.MAPINGKEY['itemstocks'][detail.item_id].totals['PDO'] || 0)  
        })
      })

      let data = []
      if(this.rsForm.delivery_order_items) {
        data = this.rsForm.delivery_order_items.map((detail, index) => {
          let use = 0;
          if (maxitem[detail.item_id] && detail.item_id) {  
            use = Number(moveItem.get(detail.item_id) || 0)
            moveItem.set(detail.item_id, (Number(detail.quantity) * Number(detail.unit_rate)) )
          }
          return Number(maxitem[detail.item_id] || 0) - use
          
        })
      }
      
      return data
    },
    MaxStock() {
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
      this.FORM.data.delivery_order_items.forEach(item => {
        if (stockItem.hasOwnProperty(item.item_id)) {
          stockItem[item.item_id].totals['FG'] += Number(item.quantity)
        }
      })

      let data = {}
      this.rsForm.delivery_order_items.map((detail, index) => {
        if (stockItem[detail.item_id] && detail.item_id) {
          data[index] = Number(stockItem[detail.item_id].totals['FG'] || 0) - Number(moveItem.get(detail.item_id) || 0)
          moveItem.set(detail.item_id, detail.quantity)
        }
        
      })
      
      return data
    },
    MAPINGKEY(){
      let variables = {
        'customers' : {},
        'units': {},
        'items': {},
        'itemstocks': {}
      }
      
      this.SHEET['customers'].data.map(value => { variables['customers'][value.id] = value })
      this.SHEET['units'].data.map(value => { variables['units'][value.id] = value })
      this.SHEET['items'].data.map(value => { variables['items'][value.id] = value })
      this.SHEET['itemstocks'].data.map(value => { variables['itemstocks'][value.id] = value })

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
    setCustomerReference(val) {
      if(this.rsForm.customer_id) {
        this.rsForm.customer_name = this.MAPINGKEY['customers'][val].name
        this.rsForm.customer_phone = this.MAPINGKEY['customers'][val].phone
        this.rsForm.customer_address = this.MAPINGKEY['customers'][val].address_raw

        this.SHEET.load('request_orders', 'customer_id=' + this.rsForm.customer_id)
      }
      else {
        this.rsForm.customer_name = null
        this.rsForm.customer_phone = null
        this.rsForm.customer_address = null
      }
    },
    setRequestOrderReference(val) {
      if(!val) {
        this.rsForm.delivery_order_items = []
      }
      const pre_deliveries = this.SHEET.pre_deliveries.data
      const pre_delivery = pre_deliveries.find(x => x.id === val)
      if(!pre_delivery) {
        console.warn('[PLAY] Set PDO invalid!')
        return
      }

      let data = []
      pre_delivery.pre_delivery_items.map((detail) => {
        data.push({
          pre_delivery_item_id: detail.id,
          item_id: detail.item_id,
          unit_id: detail.unit_id,
          item: this.MAPINGKEY['items'][detail.item_id],
          unit: this.MAPINGKEY['units'][detail.unit_id],
          quantity: null
        })
      })
      
    },
    setItemReference(index, val) {
      if(!val){
        this.rsForm.delivery_order_items[index].unit_id = null
        this.rsForm.delivery_order_items[index].unit = {}
        this.rsForm.delivery_order_items[index].item = {}
      }
      else{
        this.rsForm.delivery_order_items[index].item = this.MAPINGKEY['items'][val]

        let baseUnitID = this.MAPINGKEY['items'][val].unit_id
        this.rsForm.delivery_order_items[index].unit_id = baseUnitID
        this.rsForm.delivery_order_items[index].unit_rate = 1
        this.rsForm.delivery_order_items[index].unit = this.MAPINGKEY['units'][baseUnitID]
      }
    },
    setUnitReference(index, val) {
      if(!val) return;
      else if (this.rsForm.delivery_order_items[index].item.unit_id === val) {
        this.rsForm.delivery_order_items[index].unit_rate = 1
      }
      else {
        if(this.rsForm.delivery_order_items[index].item.item_units) {
          this.rsForm.delivery_order_items[index].item.item_units.map((itemUnit)=> {
            if (itemUnit.unit_id == val) this.rsForm.delivery_order_items[index].unit_rate = itemUnit.rate
          })
        }
      }
    },
    setForm(data) {
      this.rsForm =  data
      
      this.SHEET.load('request_orders',`customer_id=${this.rsForm.customer_id}&id=${this.rsForm.request_order_id}`)

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
          this.$router.push(`${this.FORM.resource.uri}/${data.id}/view`)
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
            message:'Please complete the form fields'
          }); 
          
          return;
        }
        this.FORM.loading = true
        // const {method, mode, apiUrl} = this.FORM.meta();
        const method = 'PATCH'
        const apiUrl = [this.FORM.resource.api, this.$route.params.id, 'revision'].join('/')

        this.$axios.set(method, apiUrl, this.rsForm)
        .then((response) => { 
          let message = response.data.number + ' - #' + response.data.id
          this.FORM.response.success({ message: message})
          this.FORM.toView(response.data.id)
        })
        .catch((error) => {
          this.FORM.response.fields(error.response)
          this.FORM.response.error(error.response, 'REVISION FAILED')
          
        })
        .finally(()=>{
          this.FORM.loading = false
        });
        
      });
    },
  },
}
</script>