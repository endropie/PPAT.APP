<template>
<q-page padding class="form-page justify-center"  v-if="FORM.show">
  <q-card inline class="main-box " :dark="LAYOUT.isDark">
    <q-card-section>
      <form-header :title="FORM.title()" :subtitle="FORM.subtitle()" :dark="LAYOUT.isDark">

        <template slot="menu-item">
          <list-item :label="$tc('form.remove')" icon="delete" clickable @click="FORM.delete" v-close-popup v-if="$route.params.id"/>
          <list-item :label="'void'" icon="block" clickable @click="FORM.void" v-close-popup v-if="$route.params.id"/>
        </template>
      </form-header>
    </q-card-section>
    <!-- COLUMN:: Transaction Identitity -->
    <q-card-section class="row q-col-gutter-y-sm q-col-gutter-x-md">
      <q-field class="col-12"
        label="Transaction mode" stack-label
        borderless hide-bottom-space
        :dark="LAYOUT.isDark"
        :error="errors.has('transaction')"
        :error-message="errors.first('transaction')"
        v-if="this.$route.meta.mode !== 'edit'">

        <q-option-group name="transaction" type="radio" inline
          v-model="rsForm.transaction"
          :options="$store.state.admin.CONFIG.options.transaction_mode"
          :disable="this.$route.meta.mode == 'edit'"
          :dark="LAYOUT.isDark"
          v-validate="'required'"
        />
      </q-field>
      <div class="col-12 col-sm-6" >
        <div class="row q-col-gutter-sm">
          <!-- <q-input name="number" class="col-12"
            label="No Transaction"
            placeholder="[Auto Generate]"
            v-model="rsForm.number"
            v-validate="$route.meta.mode == 'edit' ? 'required':''"
            :dark="LAYOUT.isDark"
            :error="errors.has('number')"
            :error-message="errors.first('number')"/> -->

          <ux-select-filter name="customer" class="col-12"
            :label="$tc('general.customer')"
            :hint="rsForm.order_mode ? `Order type [${rsForm.order_mode}]` : undefined"
            v-model="rsForm.customer_id"
            v-validate="'required'"
            :disable="IssetItemDetails || (rsForm.request_order_id != null )"
            :options="CustomerOptions" filter clearable
            @input="setCustomerReference"
            :dark="LAYOUT.isDark" :options-dark="LAYOUT.isDark"
            :error="errors.has('customer')"
            :error-message="errors.first('customer')" >

            <q-tooltip v-if="IssetItemDetails" :offset="[0, 10]">To change, Please remove all detail parts, first!</q-tooltip>
          </ux-select-filter>
          <!-- <q-field class="col-12 col-md-6" :error="errors.has(`trans_qty`)" :error-message="errors.first(`trans_qty`)">
            <q-input name="trans_qty" stack-label label="Qty Trans" v-model="rsForm.trans_qty" type="number" v-validate="'required'"/>
          </q-field>
          <q-field class="col-12 col-md-6" :error="errors.has(`rit_id`)" :error-message="errors.first(`rit_id`)">
            <q-select name="rit_id"  stack-label label="R I T" v-model="rsForm.rit_id" v-validate="'required'"
              :options="[{value:1,label:'Rit-1'},{value:2,label:'Rit-2'},{value:13,label:'Rit-3'}]"
            />
          </q-field> -->
          <q-input name="plan_begin_date"  type="date" class="col-12 col-sm-6"
            stack-label label="Begin date of Plan"
            v-model="rsForm.plan_begin_date"
            v-validate="'required'"
            :dark="LAYOUT.isDark"
            :error="errors.has('plan_begin_date')"
            :error-message="errors.first('plan_begin_date')"/>

          <q-input name="plan_until_date" type="date" class="col-12 col-sm-6"
            stack-label label="Until date of Plan"
            v-model="rsForm.plan_until_date"
            v-validate="'required'"
            :dark="LAYOUT.isDark"
            :error="errors.has('plan_until_date')"
            :error-message="errors.first('plan_until_date')" />

        </div>
      </div>

      <div class="col-12 col-sm-6" >
        <div class="row q-col-gutter-x-md">
          <q-input name="customer_name" class="col-12 col-sm-7"
            stack-label label="Name"
            v-model="rsForm.customer_name"
            v-validate="'required'"
            hide-bottom-space
            :dark="LAYOUT.isDark"
            :error="errors.has('customer_name')"/>

          <q-input name="customer_phone" class="col-12 col-sm-5"
            stack-label label="phone"
            v-model="rsForm.customer_phone"
            v-validate="'required'"
            hide-bottom-space
            :dark="LAYOUT.isDark"
            :error="errors.has('customer_phone')"/>

          <q-input name="customer_address" class="col-12"
            stack-label label="Address"
            v-model="rsForm.customer_address"
            type="textarea" rows="3"
            :dark="LAYOUT.isDark"
            :error="errors.has('customer_address')"/>
        </div>
      </div>

      <!-- COLUMN::3th Items lists -->
      <!-- <div class="col-12">
        <div class="row q-col-gutter-sm">
          <q-select name="order_mode" radio class="col-12"
            label="Request orders mode"
            v-model="rsForm.order_mode" disable
            outlined dense hide-dropdown-icon
            :options="$store.state.admin.CONFIG.options.order_mode"
            :dark="LAYOUT.isDark"
          />
        </div>
      </div> -->
      <div class="col-12">
        <q-table ref="table" dense hide-bottom
          :data="rsForm.pre_delivery_items"
          :dark="LAYOUT.isDark"
          class="bordered no-shadow"
          :rows-per-page-options ="[0]"
          :columns="[
            { name: 'prefix', label: '',  align: 'left'},
            { name: 'item_id', label: $tc('label.part'), align: 'left'},
            { name: 'quantity', label: $tc('label.quantity'), align: 'center'},
            { name: 'unit_id', label: $tc('label.unit'), align: 'center'},
          ]"
          :pagination="{rowsPerPage: 0}"
          >
          <template slot="body" slot-scope="propItem">
            <q-tr :propItem="propItem">
              <q-td key="prefix">
                <q-btn dense  @click="removeItem(propItem.row.__index)" icon="delete" color="blue-grey-5"/>
              </q-td>
              <q-td key="item_id" width="50%" style="min-width:150px">
                <ux-select-filter :name="`pre_delivery_items.${propItem.row.__index}.item_id`"
                  v-model="propItem.row.item_id"
                  outlined dense hide-bottom-space color="blue-grey-5"
                  :readonly="!IssetCustomerID"
                  :options="ItemOptions" filter
                  v-validate="`required|excluded:${rsForm.pre_delivery_items.map((x,index) => index !==propItem.row.__index ? x.item_id : -1)}`"
                  :dark="LAYOUT.isDark"
                  :error="errors.has(`pre_delivery_items.${propItem.row.__index}.item_id`)"
                  :error-message="errors.first(`pre_delivery_items.${propItem.row.__index}.item_id`)"
                  @input="(val)=>{ setItemReference(propItem.row.__index, val) }"
                />
                <q-tooltip v-if="!IssetCustomerID" :offset="[0, 10]">Select a customer, first! </q-tooltip>
              </q-td>
              <q-td style="min-width:120px" key="quantity" width="30%">
                <q-input :name="`pre_delivery_items.${propItem.row.__index}.quantity`"
                  v-model="propItem.row.quantity" type="number" minimal
                  outlined dense hide-bottom-space color="blue-grey-5"
                  :suffix="' / ' + strUnitConvertion(propItem.row, MaxMount[propItem.row.__index])"
                  :warning="propItem.row.quantity > MaxStock[propItem.row.__index]"
                  :before="[{icon: 'warning', warning: true, handler () {}}]"
                  v-validate="FORM.validator.quantity(propItem.row, numUnitConvertion(propItem.row, MaxMount[propItem.row.__index]))"
                  :dark="LAYOUT.isDark"
                  :error="errors.has(`pre_delivery_items.${propItem.row.__index}.quantity`)"
                  @input="(val)=> {propItem.row.unit_qty = (val) * (propItem.row.unit_rate)}"/>
              </q-td>
              <q-td key="unit_id" width="15%">
                <q-select
                  minimal :name="`pre_delivery_items.${propItem.row.__index}.unit_id`"
                  v-model="propItem.row.unit_id"
                  outlined dense hide-bottom-space color="blue-grey-5"
                  :options="ItemUnitOptions[propItem.row.__index]"
                  map-options
                  @input="(val)=> { setUnitReference(propItem.row.__index, val) }"
                  :dark="LAYOUT.isDark"
                  :error="errors.has(`pre_delivery_items.${propItem.row.__index}.unit_id`)"
                  :error-message="errors.first(`pre_delivery_items.${propItem.row.__index}.unit_id`)"
                />
              </q-td>
            </q-tr>
            <!-- <q-tr v-if="propItem.row.item">
              <q-td></q-td>
              <q-td >
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
                    <tr>
                      <td>Quantity    </td>
                      <td>{{ formatNumber(propItem.row.quantity * propItem.row.unit_rate) }} {{ MAPINGKEY["items"][propItem.row.item_id] ? MAPINGKEY["items"][propItem.row.item_id].unit.name :'' }}</td>
                    </tr>
                    <tr><td>FG #alias    </td><td>{{ propItem.row.item.part_alias }}</td></tr>
                  </table>
                </div>
              </q-td>
              <q-td colspan="100%"> </q-td>
            </q-tr> -->
          </template>

          <q-tr slot="bottom-row" slot-scope="propItem" >
            <q-td colspan="100%" :propItem="propItem">
              <strong><q-btn dense  @click="addNewItem()" icon="add" color="positive"/></strong>
            </q-td>
          </q-tr>
        </q-table>
      </div>
      <!-- COLUMN::4th Description -->
      <q-input name="description" type="textarea" rows="3" class="col-12"
        stack-label :label="$tc('label.description')"
        filled
        :dark="LAYOUT.isDark"
        v-model="rsForm.description">
      <q-icon name="rate_review" slot="before"/>
      </q-input>

    </q-card-section>
    <q-separator :dark="LAYOUT.isDark" />
    <q-card-actions class="q-mx-lg">
      <q-btn :label="$tc('form.cancel')" icon="cancel" color="dark" @click="FORM.toBack()" />
      <q-btn :label="$tc('form.reset')" icon="refresh" color="light" @click="setForm(FORM.data)" />
      <q-btn :label="$tc('form.save')" icon="save" color="positive" @click="onSave()" v-if="IS_EDITABLE"
      :loading="FORM.loading"/>
      <!-- <q-btn label="test" @click="test()"></q-btn>      -->
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
      SHEET: {
        // request_orders: {data:[], api:'/api/v1/incomes/request-orders?mode=all&--with=request_order_items;customer:name,phone,address'},
        customers: {data:[], api:'/api/v1/incomes/customers?mode=all'},
        units: {data:[], api:'/api/v1/references/units?mode=all'},
        items: {autoload:false, api:'/api/v1/common/items?mode=all'},
        itemstocks: {data:[], api:'/api/v1/common/items?mode=itemstock'},
      },
      FORM: {
        resource: {
          api: '/api/v1/incomes/pre-deliveries',
          uri: '/admin/incomes/delivery/pre-deliveries',
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
      submitLoading: 0,
      setDefault:()=>{
        return {
          number: null,
          transaction: null,

          customer_id: null,
          rit_id: null,
          trans_qty: null,
          plan_begin_date: this.$app.moment().format('YYYY-MM-DD'),
          plan_until_date: this.$app.moment().format('YYYY-MM-DD'),

          description: null,
          order_mode: null,
          request_order_id: null,
          pre_delivery_items:[
            {
              id:null,
              item_id: null,
              unit_id: null,
              unit_rate: 1,
              unit_qty: null,
              quantity: null,

              request_order_item_id: null
            }
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
      if (this.rsForm.order_mode === 'NONE') return false
      if (Object.keys(this.rsForm.has_relationship || {}).length > 0) return false

      return true
    },
    IssetItemDetails() {
        let items = this.rsForm.pre_delivery_items
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
      return (this.SHEET.customers.data.map(item => ({label: [item.code, item.name].join(' - '), value: item.id})) || [])
    },
    UnitOptions() {
      return (this.SHEET.units.data.map(item => ({label: item.code, value: item.id})) || [])
    },
    ItemOptions() {
      if (this.MAPINGKEY['itemstocks'].length == 0) return []

      let data = this.SHEET.items.data.filter((item) => {
        // console.log('item['+ item.id +']->', item.customer_id === this.rsForm.customer_id && (this.FORM.data.pre_delivery_items.find(x => x.item_id == item.id) || this.MAPINGKEY['itemstocks'][item.id].totals['RO'] > 0))
        return item.customer_id === this.rsForm.customer_id
          && (this.FORM.data.pre_delivery_items.find(x => x.item_id == item.id) || this.MAPINGKEY['itemstocks'][item.id].totals['RO'] > 0)
      })

      return (data.map(item => ({label: `${item.code} ${item.part_name}`, sublabel:item.part_number, value: item.id})) || [])
    },
    ItemUnitOptions() {
      // return varItemUnits
      return this.rsForm.pre_delivery_items.map(rsItem => {
        return this.UnitOptions.filter((unit)=> {
            if(!rsItem.item_id) return
            if(rsItem.item.unit_id === unit.value) return true
            if(this.MAPINGKEY['items'][rsItem.item_id]) return this.MAPINGKEY['items'][rsItem.item_id].item_units.some((fill)=> fill.unit_id == unit.value)
            return
          })
      })
    },
    MaxMount() {
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
      this.FORM.data.pre_delivery_items.forEach(item => {
        if (stockItem.hasOwnProperty(item.item_id)) {
          stockItem[item.item_id].totals['RO'] += Number(item.quantity)
        }
      })

      let data = {}
      this.rsForm.pre_delivery_items.map((detail, index) => {
        if (stockItem[detail.item_id] && detail.item_id) {
          data[index] = Number(stockItem[detail.item_id].totals['RO'] || 0) - Number(moveItem.get(detail.item_id) || 0)
          moveItem.set(detail.item_id, detail.quantity)
        }
      })

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
      this.FORM.data.pre_delivery_items.forEach(item => {
        if (stockItem.hasOwnProperty(item.item_id)) {
          stockItem[item.item_id].totals['PRE'] += Number(item.quantity)
        }
      })

      let data = {}
      this.rsForm.pre_delivery_items.map((detail, index) => {
        if (stockItem[detail.item_id] && detail.item_id) {
          data[index] = Number(stockItem[detail.item_id].totals['PRE'] || 0) - Number(moveItem.get(detail.item_id) || 0)
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
        'itemstocks': {}
      }

      this.SHEET['customers'].data.map(value => { variables['customers'][value.id] = value })
      this.SHEET['units'].data.map(value => { variables['units'][value.id] = value })
      this.SHEET['items'].data.map(value => { variables['items'][value.id] = value })
      this.SHEET['itemstocks'].data.map(value => {
        value.totals['PRE'] = Number(value.totals['FM']) + Number(value.totals['WO'])
        variables['itemstocks'][value.id] = value
      })

      return variables;
    }
  },
  watch:{
      '$route' : 'init',
  },
  methods: {
    init() {
      this.FORM.load((data) => {
        this.setForm(data || this.setDefault())
      })
    },
    strUnitConvertion(row, val = 0) {
      if(val < 0) return '(-)'
      return this.numUnitConvertion(row, val)
    },
    numUnitConvertion(row, val = 0) {
      let result = Number(val) / Number(row.unit_rate || 1)
      let fix = ((+result).toFixed(20)).replace(/^-?\d*\.?|0+$/g, '').length;
      if(fix > 2) fix = 2
      return result.toFixed(fix)
    },
    setCustomerReference(val) {
      this.rsForm.request_order_id = null

      if(!val) {
        this.rsForm.order_mode = null
        this.rsForm.customer_name = null
        this.rsForm.customer_phone = null
        this.rsForm.customer_address = null
      }
      else{
        this.rsForm.customer_name = this.MAPINGKEY['customers'][val].name
        this.rsForm.customer_phone = this.MAPINGKEY['customers'][val].phone
        this.rsForm.customer_address = this.MAPINGKEY['customers'][val].address_raw

        this.SHEET.load('items', 'customer_id='+ val)

        if (this.MAPINGKEY['customers'].hasOwnProperty(val)) {
          this.rsForm.order_mode = this.MAPINGKEY['customers'][val].order_mode
        }
      }
    },
    setRequestOrderItemReference(index, val) {
      const detail = this.RequestOrderItemOptions.find(x => x.data.id === val)
      if(!detail) {
        console.warn('[PLAY] Set item part invalid!')
        return
      }

      const itemID = detail.data.item_id
      this.rsForm.pre_delivery_items[index].item_id = itemID

      this.setItemReference(index, itemID)
    },
    setItemReference(index, val) {
      this.rsForm.pre_delivery_items[index].item = this.MAPINGKEY['items'][val]

      let unitID = this.MAPINGKEY['items'][val].unit_id
      this.rsForm.pre_delivery_items[index].unit_id = unitID
      this.rsForm.pre_delivery_items[index].unit_rate = 1
      this.rsForm.pre_delivery_items[index].unit = this.MAPINGKEY['units'][unitID]
    },
    setUnitReference(index, val) {
      let detail = this.rsForm.pre_delivery_items[index]

      if(!val && !detail.hasOwnProperty('item')) return;
      else if (detail.item.unit_id === val) {
        this.rsForm.pre_delivery_items[index].unit_rate = 1
      }
      else {
        if(detail.item.item_units) {
          detail.item.item_units.map((unitItem)=> {
            if (unitItem.unit_id == val) this.rsForm.pre_delivery_items[index].unit_rate = unitItem.rate
          })
        }
      }
      // this.rsForm.pre_delivery_items[index].unit_rate = this.MAPINGKEY['items'][val].unit_id
    },
    hasDetailItems(index) {
      const hasItems = []
      const details = this.rsForm.pre_delivery_items
      for (let i = 0; i < details.length; i++) {
        if(index !== i) {
          hasItems.push(details[i].item_id)
        }
      }
      return hasItems
    },
    setForm(data) {
      this.rsForm =  JSON.parse(JSON.stringify(data))

      if(this.rsForm.customer_id) {
        this.SHEET.load('items', 'customer_id='+ this.rsForm.customer_id)
      }

      if(data.hasOwnProperty('has_relationship') && Object.keys(data['has_relationship']).length > 0) {
        this.FORM.response.relationship({
          title: 'Pre-Delivery has relations!',
          messages: data['has_relationship'],
          then: () => this.$router.push(`${this.FORM.resource.uri}/${data.id}`)
        })
      }
    },
    addNewItem(){
      let newEntri = this.setDefault().pre_delivery_items[0] // {id:null, item_id: null, quantity: null};

      this.rsForm.pre_delivery_items.push(newEntri)
    },
    removeItem(index) {
        this.rsForm.pre_delivery_items.splice(index, 1)
        if(this.rsForm.pre_delivery_items.length < 1) this.addNewItem()
    },
    onSave() {

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
