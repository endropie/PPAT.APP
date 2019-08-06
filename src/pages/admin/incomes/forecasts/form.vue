<template>
<q-page padding class="form-page justify-center" v-if="FORM.show">
  <q-card inline class="q-ma-sm ">
    <q-card-section>
      <form-header :title="FORM.title()" :subtitle="FORM.subtitle()" >
        <template slot="menu-item">
          <list-item :label="$tc('form.remove')" icon="delete" clickable @click="FORM.delete" v-close-popup v-if="$route.params.id"/>
        </template>
      </form-header>
    </q-card-section>
    <q-card-section>
      <div class="row q-col-gutter-sm q-col-gutter-x-lg q-mb-lg">
        <!-- COLUMN::1st customer Identitity -->
        <div class="col-12 col-sm-6" >
          <div class="column q-col-gutter-sm">
            <q-input name="number"
              label="No Transaction"
              v-model="rsForm.number"
              placeholder="[Auto Generate]" autofocus
              v-validate="$route.meta.mode == 'edit' ? 'required':''"
              :error="errors.has('number')"
              :error-message="errors.first('number')" />

            <ux-select-filter name="customer_id"
              v-model="rsForm.customer_id"
              :label="$tc('general.customer')"
              :disable="IssetIncomeItems"
              v-validate="'required'"
              :options="CustomerOptions" filter clearable
              @input="setCustomerReference"
              :error="errors.has('customer_id')" :error-message="errors.first('customer_id')">
              <q-tooltip v-if="IssetIncomeItems" :offset="[0, 10]">To change, Please clear Delivery items first!</q-tooltip>
            </ux-select-filter>
          </div>
        </div>
        <!-- COLUMN::2nd Transaction details -->
        <div class="col-12 col-sm-6" >
          <div class="column q-col-gutter-sm">
            <ux-date name="begin_date" stack-label label="Begin Date" v-model="rsForm.begin_date" type="date"
              v-validate="'required'"
              :error="errors.has('begin_date')" :error-message="errors.first('begin_date')"/>
            <ux-date name="until_date"
              stack-label label="Until Date"
              v-model="rsForm.until_date" type="date"
              v-validate="'required'"
              :error="errors.has('until_date')" :error-message="errors.first('until_date')"/>
          </div>
        </div>
        <!-- COLUMN::3th Items lists -->
        <div class="col-12">
          <q-table ref="table" color="primary" :data="rsForm.forecast_items" dense style="min-width:100%;max-width:100%;display:inline-grid"
            :rows-per-page-options ="[0]"
            :columns="[
              { name: 'prefix', label: '', align: 'left'},
              { name: 'item_id', label: this.$tc('label.code', 1, {v:this.$tc('label.part')}), align: 'left'},
              { name: 'quantity', label: 'Qty', align: 'center', style:'width:100px'},
              { name: 'unit_id', label: $tc('label.unit'), align: 'center', style:'width:100px'},
              { name: 'price', label: 'Price', align: 'center', style:'width:150px'},
              { name: 'total_price', label: 'Total price', align: 'center', style:'width:150px'},
            ]"
            :pagination="{sortBy: null, descending: false, page: null, rowsPerPage: 0}"
            >
            <template v-slot:body="rsItem">
              <q-tr >
                <q-td key="prefix"  style="width:50px">
                  <q-btn dense  @click="removeItem(rsItem.row.__index)" icon="delete" color="negative"/>
                </q-td>
                <q-td key="item_id"  >
                  <ux-select-filter :name="`forecast_items.${rsItem.row.__index}.item`"  style="min-width:150px"
                    v-model="rsItem.row.item_id"
                    dense hide-bottom-space
                    filled color="blue-grey-5"
                    :dark="LAYOUT.isDark"
                    v-validate="'required'"
                    :options="ItemOptions" filter
                    :readonly="!IssetCustomerID"
                    @input="(val)=>{ setItemReference(rsItem.row.__index, val) }"
                    :error="errors.has(`forecast_items.${rsItem.row.__index}.item`)"
                    :error-message="errors.first(`forecast_items.${rsItem.row.__index}.item`)" >
                    <q-tooltip v-if="!IssetCustomerID" :offset="[0, 10]">Select a customer, first! </q-tooltip>
                  </ux-select-filter>
                </q-td>
                <q-td key="quantity" >
                  <q-input :name="`forecast_items.${rsItem.row.__index}.quantity`" style="min-width:50px"
                    v-model="rsItem.row.quantity" type="number" min="0"
                    filled color="blue-grey-5"
                    :dark="LAYOUT.isDark"
                    dense hide-bottom-space
                    v-validate="rsItem.row.item_id ? 'required' : ''"
                    :error="errors.has(`forecast_items.${rsItem.row.__index}.quantity`)" />
                </q-td>
                <q-td key="unit_id"  >
                  <q-select :name="`forecast_items.${rsItem.row.__index}.unit_id`" style="min-width:70px"
                    v-model="rsItem.row.unit_id"
                    filled color="blue-grey-5"
                    :dark="LAYOUT.isDark"
                    dense hide-bottom-space
                    v-validate="rsItem.row.item_id ? 'required' : ''"
                    @input="(val)=> { setUnitReference(rsItem.row.__index, val) }"
                    :options="ItemUnitOptions[rsItem.row.__index]"
                    map-options emit-value
                    :error="errors.has(`forecast_items.${rsItem.row.__index}.unit_id`)" />
                </q-td>
                <q-td key="price" >
                  <ux-numeric :name="`forecast_items.${rsItem.row.__index}.price`" style="min-width:100px"
                    v-model="rsItem.row.price"
                    filled color="blue-grey-5" align="right"
                    :dark="LAYOUT.isDark"
                    dense hide-bottom-space
                    v-validate="rsItem.row.item_id ? 'required' : ''"
                    :error="errors.has(`forecast_items.${rsItem.row.__index}.price`)" />
                </q-td>
                <q-td key="total_price"  >
                  <ux-numeric :name="`forecast_items.${rsItem.row.__index}.total_price`"
                    style="min-width:120px"  input-class="text-weight-bold"
                    borderless color="blue-grey-5"
                    dense hide-bottom-space readonly
                    :value="rsItem.row.quantity * rsItem.row.price"
                    :error="errors.has(`forecast_items.${rsItem.row.__index}.total_price`)" />
                </q-td>
              </q-tr>
              <!-- Item detail Description -->
              <q-tr >
                <q-td></q-td>
                <q-td >
                  <div class="text-left">
                    <q-markup-table class="bordered no-shadow">
                      <tr><td>No Plate    </td><td>{{ rsItem.row.item.part_number }}</td></tr>
                      <tr><td>Plate name  </td><td>{{ rsItem.row.item.part_name }}</td></tr>
                    </q-markup-table>
                  </div>
                </q-td>
                  <q-td colspan="2">
                  <div class="text-left" >
                    <q-markup-table class="bordered no-shadow">
                      <tr><td>Quantity    </td><td>{{ formatNumber(Number(rsItem.row.quantity) * Number(rsItem.row.unit_rate)) }} {{ (rsItem.row.item.unit ? rsItem.row.item.unit.name : '') }}</td></tr>
                      <tr><td>FG #alias    </td><td>{{ (rsItem.row.item.part_alias || '') }}</td></tr>
                    </q-markup-table>
                  </div>
                </q-td>
                <q-td colspan="100%">
                  <q-input filled v-model="rsItem.row.note" stack-label label="Note" color="blue-grey-6" />
                </q-td>
              </q-tr>
            </template>

            <q-tr slot="bottom-row" >
              <q-td colspan="100%">
                <strong><q-btn dense  @click="addNewItem()" icon="add" color="positive"/></strong>
              </q-td>
            </q-tr>
          </q-table>
        </div>
        <!-- COLUMN::4th Description -->
        <q-input class="col-12" name="description" type="textarea" rows="3"
          stack-label :label="$tc('label.description')"
          filled
          v-model="rsForm.description">
          <q-icon slot="prepend" name="rate_review" />
        </q-input>
      </div>
    </q-card-section>
    <q-separator :dark="LAYOUT.isDark" />
    <q-card-actions class="q-mx-lg">
      <q-btn :label="$tc('form.cancel')" icon="cancel" color="dark" @click="FORM.toBack()"></q-btn>
      <q-btn :label="$tc('form.reset')" icon="refresh" color="light" @click="setForm(FORM.data)"></q-btn>
      <q-btn :label="$tc('form.save')" icon="save" color="positive" @click="onSave()" :loading="FORM.loading" />
    </q-card-actions>
  </q-card>
  <q-inner-loading :showing="FORM.loading" :dark="LAYOUT.isDark"><q-spinner-dots size="70px" color="primary" /></q-inner-loading>
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
        customers: {data:[], api:'/api/v1/incomes/customers?mode=all'},
        transports: {data:[], api:'/api/v1/warehouses/transports?mode=all'},
        operators: {data:[], api:'/api/v1/references/operators?mode=all'},
        vehicles: {data:[], api:'/api/v1/references/vehicles?mode=all'},
        units: {data:[], api:'/api/v1/references/units?mode=all'},
        items: {data:[], api:'/api/v1/common/items?mode=all'}
      },
      FORM:{
        resource:{
          uri: '/admin/incomes/forecasts',
          api: '/api/v1/incomes/forecasts',
        },
      },
      rsForm: {},
      setDefault:()=>{
        return {
          number: null,
          begin_date: this.$app.moment().startOf('month').format('YYYY-MM-DD'),
          until_date: this.$app.moment().endOf('month').format('YYYY-MM-DD'),

          customer_id: null,
          description: null,

          forecast_items:[
            {
              id:null,
              item_id: null, item: {},
              unit_id: null, unit: {},
              unit_rate: 1,
              unit_amount: null,
              quantity: null,
              price: null,
              note: null
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
    IssetIncomeItems() {
        let items = this.rsForm.forecast_items
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
    TransportOptions() {
      return (this.SHEET.transports.data.map(item => ({label: item.name, value: item.id})) || [])
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
      return (ITEM.map(item => ({label: item.code, sublabel:item.part_name, value: item.id})) || [])
    },
    ItemUnitOptions() {
      let vars = []
      for (const i in this.rsForm.forecast_items) {
        if (this.rsForm.forecast_items.hasOwnProperty(i)) {
          let rsItem = this.rsForm.forecast_items[i]
          vars[i] = ( this.UnitOptions || [])
          vars[i] = vars[i].filter((unit)=> {
            if(!rsItem.item_id) return false
            if(rsItem.item) {
              if(rsItem.item.unit_id === unit.value) return true
              // console.log('item-unit', i, rsItem.item.item_units)
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
        'items': {}
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
    setCustomerReference(val) {
      if(!val) {
        this.rsForm.customer_name = null
        this.rsForm.customer_phone = null
        this.rsForm.customer_address = null
      }
      else {
        this.rsForm.customer_name = this.MAPINGKEY['customers'][val].name
        this.rsForm.customer_phone = this.MAPINGKEY['customers'][val].phone
        this.rsForm.customer_address = this.MAPINGKEY['customers'][val].address_raw
      }
    },
    setItemReference(index, val) {
      if(!val){
        this.rsForm.forecast_items[index].unit_id = null
        this.rsForm.forecast_items[index].unit = {}
        this.rsForm.forecast_items[index].item = {}
      }
      else{
        this.rsForm.forecast_items[index].item = this.MAPINGKEY['items'][val]

        let baseUnitID = this.MAPINGKEY['items'][val].unit_id
        this.rsForm.forecast_items[index].unit_id = baseUnitID
        this.rsForm.forecast_items[index].unit_rate = 1
        this.rsForm.forecast_items[index].unit = this.MAPINGKEY['units'][baseUnitID]
        this.rsForm.forecast_items[index].price = this.MAPINGKEY['items'][val].price
      }

    },
    setUnitReference(index, val) {

      if(!val) return;
      else if (this.rsForm.forecast_items[index].item.unit_id === val) {
        this.rsForm.forecast_items[index].unit_rate = 1
      }
      else {
        if(this.rsForm.forecast_items[index].item.item_units) {
          this.rsForm.forecast_items[index].item.item_units.map((unitItem)=> {
            if (unitItem.unit_id == val) this.rsForm.forecast_items[index].unit_rate = unitItem.rate
          })
        }
      }
    },

    setForm(data) {
      this.rsForm =  data

      if(data.hasOwnProperty('has_relationship') && data['has_relationship'].length > 0) {
        this.FORM.has_relationship = data.has_relationship
        this.FORM.onRelationship({
          title: 'Forecast has relation!',
          message: data['has_relationship'].join("-"),
          then: () => this.$router.push(`${this.FORM.resource.uri}/${data.id}/view`)
        })
      }
    },
    setRsForm(data) {
      this.rsForm =  data
      if(!this.rsForm.forecast_items) {
        this.rsForm.forecast_items = this.setDefault().forecast_items
      }

    },
    setRsData(data) {
      this.FORM.data =  JSON.parse(JSON.stringify(data))
      if(!this.FORM.data.forecast_items) {
        this.FORM.data.forecast_items = this.setDefault().forecast_items
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
            this.FORM.loading = false
          });
      }
      else{
        this.rsForm = this.setDefault()
      }
    },

    addNewItem(autofocus = true){
      let newEntri = this.setDefault().forecast_items[0] // {id:null, item_id: null, quantity: null};

      this.rsForm.forecast_items.push(newEntri)
    },
    removeItem(index) {
        this.rsForm.forecast_items.splice(index, 1)
        if(this.rsForm.forecast_items.length < 1) this.addNewItem()
    },

    onSave() {
      // console.warn(this.$validator)
      this.$validator.validate().then(result => {
        if (!result) {
          this.$q.notify({
            color:'negative', icon:'error', position:'top-right', timeout: 3000,
            message:this.$tc('messages.to_complete_form')
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
          setTimeout(() => {
            this.FORM.loading = false
          }, 2000);
        });

      });
    },
  },
}
</script>
