<template>
<q-page padding class="main-page justify-center" v-if="SHOW">
  <q-card inline class="main-box" :dark="LAYOUT.isDark">
    <q-card-section>
      <form-header :title="FORM.title()" :subtitle="FORM.subtitle()" >
        <template slot="menu-prepend">
          <q-chip tag small color="warning" v-if="rsForm.order_mode">{{ rsForm.order_mode }}</q-chip>
        </template>
        <template slot="menu-item">
          <list-item :label="$tc('label.remove')" icon="delete" clickable @click="FORM.delete" v-close-popup v-if="$route.params.id"/>
        </template>
      </form-header>
    </q-card-section>
    <q-card-section>
      <div class="row q-gutter-sm q-gutter-x-md">
        <!-- COLUMN::1st customer Identitity -->
        <div class="col-12 col-md-6" >
          <div class="row q-gutter-x-sm">
            <q-field class="col-12" :error="errors.has('number')" :error-message="errors.first('number')">
              <q-input name="number" label="No Transaction" v-model="rsForm.number" placeholder="[Auto Generate]" 
                :dark="LAYOUT.isDark"
                v-validate="$route.meta.mode == 'edit' ? 'required':''"
              />
            </q-field>
            <q-field class="col-12" :error="errors.has('date')" :error-message="errors.first('date')">
              <q-input name="date" stack-label label="Date" v-model="rsForm.date" type="date" :dark="LAYOUT.isDark" v-validate="'required'"/>
            </q-field>
          </div>
        </div>
        <!-- COLUMN::2nd Transaction details -->
        <div class="col-12 col-md-6" >
          <div class="row q-gutter-x-sm">
            <q-field class="col-12" :error="errors.has('customer')" :error-message="errors.first('customer')">
              <q-select name="customer" v-model="rsForm.customer_id" label="Customer" :disable="IssetItemDetails" v-validate="'required'"
                :options="CustomerOptions" filter clearable
                :dark="LAYOUT.isDark"
                @input="(val)=>{ setCustomerReference(val) }"
                ></q-select>
              <q-tooltip :disable="!IssetItemDetails" :offset="[0, 10]">To change: Please delete Detail items first!</q-tooltip>
            </q-field>
            <q-field class="col-12" :error="errors.has('reference_number')" :error-message="errors.first('reference_number')">
              <q-input name="reference_number" stack-label label="PO / Qoutation / Memo" v-model="rsForm.reference_number" :dark="LAYOUT.isDark"
                v-validate="rsForm.order_mode === 'PO' ? 'required' :''"/>
            </q-field>
          </div>
        </div>
        <div class="col-12">
          <div class="row q-gutter-x-md">
            <q-field class="col-6 col-sm-6" v-if="rsForm.order_mode !== 'PO'" :error="errors.has('begin-date')" :error-message="errors.first('begin-date')">
              <q-input name="begin-date" stack-label label="Begin date" v-model="rsForm.begin_date" type="date" v-validate="'required'" :dark="LAYOUT.isDark"/>
            </q-field>
            <q-field class="col-6 col-sm-6" v-if="rsForm.order_mode !== 'PO'" :error="errors.has('until-date')" :error-message="errors.first('until-date')">
              <q-input name="until-date" stack-label label="Until date" v-model="rsForm.until_date" type="date" v-validate="'required'" :dark="LAYOUT.isDark"/>
            </q-field>
          </div>

        </div>
        <!-- COLUMN::3th Incoming Items lists -->
        <div class="col-12 q-my-md">
          <q-table ref="table" color="primary" :data="rsForm.request_order_items" dense grid
            class="table-form full-width d-grid" :dark="LAYOUT.isDark"
            :rows-per-page-options ="[0]"
            :columns="[
              { name: 'prefix', label: '',  align: 'left'},
              { name: 'item_id', label: 'Part item', align: 'left'},
              { name: 'quantity', label: 'Qty', align: 'center'},
              { name: 'unit_id', label: 'Unit', align: 'center'},
              { name: 'price', label: 'Price', align: 'center'},
              { name: 'total', label: 'Total', align: 'center'},
            ]"
            :pagination="{sortBy: null, descending: false, page: null,rowsPerPage: 0}"
          >
            <template slot="body" slot-scope="props">
              <q-tr :props="props">
                <q-td key="prefix" :props="props" style="width:50px">
                  <q-btn dense  @click="removeItem(props.row.__index)" icon="delete" color="blue-grey-5"/>
                </q-td>
                <q-td key="item_id" :props="props" width="30%">
                  <q-field :error="errors.has(`item-${props.row.__index+1}`)" >
                    <q-select :name="`item-${props.row.__index+1}`" v-model="props.row.item_id" :readonly="!IssetCustomerID" v-validate="'required'"
                      inverted color="blue-grey-5" :dark="LAYOUT.isDark" 
                      :options="ItemOptions" filter
                      @input="(val)=>{ setItemReference(props.row.__index, val) }"
                    />
                    <q-tooltip :disable="IssetCustomerID" :offset="[0, 10]">Select a customer, first! </q-tooltip>
                  </q-field>
                </q-td>
                <q-td key="quantity" :props="props" width="15%">
                    <q-field :error="errors.has(`quantity-${props.row.__index+1}`)" >
                      <q-input :name="`quantity-${props.row.__index+1}`" v-model="props.row.quantity" type="number" align="center" inverted color="blue-grey-5"
                        v-validate="props.row.item_id ? 'required' : ''"
                      />
                    </q-field>
                </q-td>
                <q-td key="unit_id" :props="props" width="15%">
                  <q-field :error="errors.has(`unit-${props.row.__index+1}`)" >
                      <q-select :name="`unit-${props.row.__index+1}`" v-model="props.row.unit_id" inverted color="blue-grey-5"
                        v-validate="props.row.item_id ? 'required' : ''"
                        @input="(val)=> { setUnitReference(props.row.__index, val) }"
                        :options="ItemUnitOptions[props.row.__index]"
                      />
                    </q-field>
                  <q-input v-model="props.row.unit_rate" class="hidden" />
                </q-td>
                <q-td key="price" :props="props" width="20%" style="min-width:120px">
                    <q-field :error="errors.has(`price-${props.row.__index+1}`)" >
                      <q-numeric :name="`price-${props.row.__index+1}`" v-model="props.row.price" type="number" align="right" inverted color="blue-grey-5"
                        v-validate="props.row.item_id ? 'required' : ''"
                      />
                    </q-field>
                </q-td>
                <q-td key="total" :props="props" width="20%" style="min-width:150px">
                    <q-field :error="errors.has(`total-${props.row.__index+1}`)" >
                      <q-numeric :name="`total-${props.row.__index+1}`" :value="Number(props.row.quantity) * Number(props.row.price)" align="right" inverted color="blue-grey-5"
                        v-validate="props.row.item_id ? '' : ''"
                      />
                    </q-field>
                </q-td>
              </q-tr>
              <!-- Item detail Description -->
              <q-tr  class="" :props="props">
                <q-td></q-td>
                <q-td >
                  <div class="text-left">
                    <table class="table-description full-width">
                      <tr><td>No Plate    </td><td>{{ props.row.item.part_number }}</td></tr>
                      <tr><td>Plate name  </td><td>{{ props.row.item.part_name }}</td></tr>
                    </table>
                  </div>
                </q-td>
                  <q-td colspan="2">
                  <div class="text-left" >
                    <table class="table-description full-width">
                      <tr><td>Quantity    </td><td>{{ formatNumber(Number(props.row.quantity) * Number(props.row.unit_rate)) }} {{ (props.row.item.unit ? props.row.item.unit.name : '') }}</td></tr>
                      <tr><td>FG #alias    </td><td>{{ (props.row.item.part_alias || '') }}</td></tr>
                    </table>
                  </div>
                </q-td>
                <q-td colspan="100%"> </q-td>
              </q-tr>
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
          <div class="row q-gutter-x-lg q-mb-md">
            <q-field class="col-12" icon="rate_review">
              <q-input name="description" type="textarea" rows="3" stack-label label="Description" v-model="rsForm.description" :dark="LAYOUT.isDark"/>
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
  <q-inner-loading :visible="FORM.loading" :dark="LAYOUT.isDark"><q-spinner-dots size="70px" /></q-inner-loading>
</q-page>
</template>

<script>
import MixForm from '@/mixins/mix-form.vue'

export default {
  mixins: [MixForm],
  data () {
    return {
      SHEET: {
        customers: {data:[], api:'/api/v1/incomes/customers?mode=all'},
        brands: {data:[], api:'/api/v1/references/brands?mode=all'},
        units: {data:[], api:'/api/v1/references/units?mode=all'},
        vehicles: {data:[], api:'/api/v1/references/vehicles?mode=all'},
        items: {data:[], api:'/api/v1/common/items?mode=all'}
      },
      FORM: {
        resource: {
          uri: '/admin/incomes/request-orders',
          api: '/api/v1/incomes/request-orders',
        }
      },
      rsForm: {},
      setDefault:()=>{
        return {
          number: null,
          begin_date: this.$app.moment().format('YYYY-MM-DD'),
          until_date: this.$app.moment().format('YYYY-MM-DD'),

          customer_id: null,
          date: null,
          reference_number: null,
          order_mode: null,
          description: null,
          
          request_order_items:[ 
            {
              id:null, 
              item_id: null, item: {},
              quantity: null,
              price: 0,
              unit_id: null,
              unit_rate: 1
            }
          ]

        }
      }
    }
  },
  created(){
    // Component Page Created!
    this.init()
  },
  computed: {
    IS_EDITABLE() {
      if (this.rsForm.hasOwnProperty('has_relationship') && Object.keys(this.rsForm.has_relationship).length > 0) {
        return false
      }
      
      return true
    },
    IssetItemDetails() {
        let items = this.rsForm.request_order_items
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
      
      let data = this.SHEET.customers.data
      if(this.$route.meta.mode !== 'edit'){
        data = data.filter(item => item.order_mode === 'PO')
      }
      
      return (data.map(item => ({label: [item.code, item.name].join(' - '), value: item.id})) || [])
    },
    BrandOptions() {
      return (this.SHEET.brands.data.map(item => ({label: item.name, value: item.id})) || [])
    },
    TransportOptions() {
      return (this.SHEET.vehicles.data.map(item => ({label: item.name, value: item.id})) || [])
    },
    UnitOptions() {
      return (this.SHEET.units.data.map(item => ({label: item.code, value: item.id})) || [])
    },
    ItemOptions() {
      let items = this.SHEET.items.data.filter((item) => item.customer_id === this.rsForm.customer_id)
      const sublabel = (val) => {
        return val != null ? `No.${val}` : null
      }
      return (items.map(item => ({label: `[${item.code}] ${item.part_name}`, sublabel: sublabel(item.part_number), value: item.id})) || [])
    },
    ItemUnitOptions() {
      let vars = []
      for (const i in this.rsForm.request_order_items) {
        if (this.rsForm.request_order_items.hasOwnProperty(i)) {
          let rsItem = this.rsForm.request_order_items[i]
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
        'items': {}
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
      this.rsData = JSON.parse(JSON.stringify(data))
      this.rsForm = JSON.parse(JSON.stringify(data))
      
      if(data.hasOwnProperty('has_relationship') && Object.keys(data['has_relationship']).length > 0) {  
        this.FORM.response.relationship({
          title: 'Sale Orders has relations!',
          messages: data['has_relationship'],
          then: () => this.$router.push(`${this.FORM.resource.uri}/${data.id}`)
        })
      }
    },
    setCustomerReference(val) {
      if(!val) {
        this.rsForm.customer = {};
        this.rsForm.order_mode = null;
      }
      else { 
        this.rsForm.customer = this.MAPINGKEY['customers'][val];
        this.rsForm.order_mode = this.MAPINGKEY['customers'][val].order_mode;

        if(this.rsForm.order_mode == 'PO') {
          this.rsForm.begin_date == null
          this.rsForm.until_date == null
        }
      }
    },
    setItemReference(index, val) {
      if(!val) {
        this.rsForm.request_order_items[index].unit_id = null
        this.rsForm.request_order_items[index].price = null
        this.rsForm.request_order_items[index].unit = {}
        this.rsForm.request_order_items[index].item = {}
      }
      else {
        this.rsForm.request_order_items[index].item = this.MAPINGKEY['items'][val]
        this.rsForm.request_order_items[index].price = this.MAPINGKEY['items'][val].price

        let baseUnitID = this.MAPINGKEY['items'][val].unit_id
        this.rsForm.request_order_items[index].unit_id = baseUnitID
        this.rsForm.request_order_items[index].unit_rate = 1
        this.rsForm.request_order_items[index].unit = this.MAPINGKEY['units'][baseUnitID]
      }
    },
    setUnitReference(index, val) {
      
      if(!val) return;
      else if (this.rsForm.request_order_items[index].item.unit_id === val) {
        this.rsForm.request_order_items[index].unit_rate = 1
      }
      else {
        if(this.rsForm.request_order_items[index].item.item_units) {
          this.rsForm.request_order_items[index].item.item_units.map((unitItem)=> {
            if (unitItem.unit_id == val) this.rsForm.request_order_items[index].unit_rate = unitItem.rate
          })
        }
      }
    },
    routing() {
      if(this.$route.meta.mode === 'edit') {

        this.FORM.loading = true
        let url = this.FORM.resource.api +'/'+ this.$route.params.id
        this.$axios.get(url)
          .then((response) => { 
            const data = response.data
            this.setRsForm(data)
            this.setRsData(data)
            this.setForm(data)
          })
          .catch(error => { 
            console.warn('[FORM:routing]', error)
            this.$app.response.error(error.response, 'Load Form')
          })
          .finally(()=>{
            this.FORM.show = true
            this.FORM.loading = false
          });
        
      }
      else{
        this.rsForm = this.setDefault()
        this.FORM.show = true;
      }
    },
    addNewItem(autofocus = true){
      let newEntri = this.setDefault().request_order_items[0] // {id:null, item_id: null, quantity: null};
      
      this.rsForm.request_order_items.push(newEntri)
    },
    removeItem(index) {
        this.rsForm.request_order_items.splice(index, 1)
        if(this.rsForm.request_order_items.length < 1) this.addNewItem()
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
          this.FORM.response.error(error.response)
          this.FORM.response.fields(error.response)
        })
        .finally(()=>{
          this.FORM.loading = false
        });
        
      });
    },
  },
}
</script>