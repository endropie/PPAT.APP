<template>
<q-page padding class="form-page">
  <q-card inline class="main-box" :dark="LAYOUT.isDark" v-if="FORM.show">
    <q-card-section>
      <form-header :title="FORM.title()" :subtitle="FORM.subtitle()" >
        <q-chip slot="optional" v-if="rsForm.status === 'VOID'"
          icon="bookmark"  class="text-weight-medium"
          label="void" color="negative" outline/>

      </form-header>
    </q-card-section>
    <q-separator :dark="LAYOUT.isDark"></q-separator>
    <!-- COLUMN::1st Transaction details -->
    <q-card-section class="row q-col-gutter-x-md">
      <div class="col-12 col-sm-6" >
        <div class="row q-col-gutter-x-sm">
          <ux-select-filter autofocus name="customer" class="col-12"
            :label="$tc('general.customer')"
            v-model="rsForm.customer_id"
            :options="CustomerOptions" clearable
            :disable="Boolean(rsForm.id) || rsForm.outgoing_good_items.some(x => Boolean(x.item_id))"
            v-validate="'required'"
            :dark="LAYOUT.isDark" :options-dark="LAYOUT.isDark"
            :error="errors.has('customer')"
            :error-message="errors.first('customer')"
            @input="(val) => setCustomerReference(val)">
          </ux-select-filter>

          <ux-date name="date" type="date" class="col-12"
            :label="$tc('label.date')" stack-label
            v-model="rsForm.date"
            v-validate="`required|date_format:yyyy-MM-dd|before:${$app.moment().add(1,'days').format('YYYY-MM-DD')}`"
            :date-options="(date) => date <= $app.moment().format('YYYY/MM/DD')"
            :dark="LAYOUT.isDark"
            :error="errors.has('date')"
            :error-message="errors.first('date')"
            @input="setDateReference"/>

          <div class="row q-col-gutter-x-sm full-width">
            <ux-select-filter class="col" style="min-width:100px"
              name="vehicle_id"
              :label="$tc('transports.seri')" stack-label
              v-model="rsForm.vehicle_id"
              autocomplete="off"
              :options="VehicleOptions"
              :dark="LAYOUT.isDark"
              :error="errors.has('vehicle_id')"
              :error-message="errors.first('vehicle_id')" />

            <q-input class="col-auto" style="max-width:100px"
              input-class="text-weight-bold"
              input-style="text-align:center"
              name="rit" type="number" min="0"
              label="RIT" stack-label
              v-model="rsForm.rit"
              no-error-icon
              v-validate="'min_value:0'"
              :error="errors.has('rit')" />
          </div>
        </div>
      </div>
      <div class="col-12 col-sm-6" >
        <div class="row q-col-gutter-x-sm">
          <!-- Customer Info -->
           <q-input name="customer_name" class="col-12"
            stack-label label="Name"
            v-model="rsForm.customer_name"
            :dark="LAYOUT.isDark"
            v-validate="'required'" />

          <q-input name="customer_phone" class="col-12"
            stack-label label="phone"
            v-model="rsForm.customer_phone"
            :dark="LAYOUT.isDark" />

          <q-input name="customer_address" class="col-12"
            type="textarea" rows="3"
            stack-label label="Address"
            v-model="rsForm.customer_address"
            :dark="LAYOUT.isDark" />
        </div>
      </div>
    </q-card-section>
    <!-- COLUMN::2nd Request orders -->
    <q-separator inset spaced :dark="LAYOUT.isDark"></q-separator>
    <q-card-section class="row q-col-gutter-sm">

      <div class="col-12">
        <q-markup-table class="main-box bordered no-shadow no-highlight th-uppercase"
          dense separator="horizontal"
          :dark="LAYOUT.isDark">
          <q-tr>
            <q-th key="prefix"></q-th>
            <q-th key="item_id">{{$tc('items.part_name')}}</q-th>
            <q-th key="part_number">{{$tc('general.incoming_good')}}</q-th>
            <q-th key="quantity">{{$tc('label.quantity')}}</q-th>
            <q-th key="unit_id">{{$tc('label.unit')}}</q-th>
          </q-tr>
          <q-tr v-for="(row, index) in rsForm.outgoing_good_items" :key="index">
            <q-td  style="width:50px">
              <q-btn dense flat round icon="clear" color="red" tabindex="100" @click="removeItem(index)"/>
            </q-td>
            <q-td width="45%">
              <ux-select-filter autofocus
                :name="`outgoing_good_items.${index}.item_id`"
                :data-vv-as="$tc('items.part_name')"
                dense outlined hide-bottom-space color="blue-grey-5"
                v-model="row.item_id"
                v-validate="'required'"
                map-options emit-value
                :options="ItemOptions" clearable
                :options-dark="LAYOUT.isDark"
                :dark="LAYOUT.isDark"
                :readonly="Boolean(row.request_order_item_id)"
                @input="(val)=>{ setItemReference(index, val) }"
                :loading="SHEET['items'].loading"
                :error="errors.has(`outgoing_good_items.${index}.item_id`)"
                :error-message="errors.first(`outgoing_good_items.${index}.item_id`)"
              />
              <q-tooltip v-if="!IssetCustomerID" :offset="[0, 10]">Select a customer, first! </q-tooltip>

            </q-td>
            <q-td key="incoming_good_item_id" width="35%" style="min-width:150px">
              <ux-select-filter
                :name="`outgoing_good_items.${index}.incoming_good_item_id`"
                :data-vv-as="$tc('items.part_name')"
                dense outlined hide-bottom-space color="blue-grey-5"
                v-model="row.incoming_good_item_id"
                v-validate="'required'"
                map-options emit-value
                :options="IncomingGoodItemOptions.filter(x => x.rowdata.item_id === row.item_id)" clearable
                :options-dark="LAYOUT.isDark"
                :dark="LAYOUT.isDark"
                :readonly="!Boolean(row.item_id)"
                :loading="SHEET['incoming_goods'].loading"
                :error="errors.has(`outgoing_good_items.${index}.incoming_good_item_id`)"
                :error-message="errors.first(`outgoing_good_items.${index}.incoming_good_item_id`)"
              />
            </q-td>
            <q-td width="25%">
              <q-input type="number" min="0" style="min-width:120px"
                :name="`outgoing_good_items.${index}.quantity`"
                :data-vv-as="$tc('label.quantity')"
                v-model="row.quantity"
                dense outlined hide-bottom-space no-error-icon color="blue-grey-5"
                :dark="LAYOUT.isDark"
                v-validate="row.item_id ? `required|gt_value:0|max_value:${MaxStock[index] / (row.unit_rate||1)}` : ''"
                :error="errors.has(`outgoing_good_items.${index}.quantity`)">
                <span slot="append" v-if="Boolean(row.incoming_good_item_id)" class="text-subtitle2">/ {{$app.number_format(MaxStock[index] / (row.unit_rate||1))}}</span>
              </q-input>
            </q-td>
            <q-td width="25%">
              <q-select style="min-width:100px"
                :name="`outgoing_good_items.${index}.unit_id`"
                :data-vv-as="$tc('label.unit')"
                v-model="row.unit_id"
                dense outlined hide-bottom-space color="blue-grey-5"
                @input="(val)=> { setUnitReference(index, val) }"
                :options="ItemUnitOptions[index]"
                map-options emit-value
                :dark="LAYOUT.isDark" :options-dark="LAYOUT.isDark"
                v-validate="row.item_id ? 'required' : ''"
                :error="errors.has(`outgoing_good_items.${index}.unit_id`)"/>
              <q-input class="hidden" v-model="row.unit_rate" />
            </q-td>
          </q-tr>
          <q-tr>
            <q-td></q-td>
            <q-td>
              <q-btn dense outline color="blue-grey" :label="$tc('form.add')" icon-right="add_circle" class="full-width" @click="addNewItem()"></q-btn>
            </q-td>
            <q-td colspan="100%"></q-td>
          </q-tr>
        </q-markup-table>
      </div>
      <!-- COLUMN::4th Description -->
      <q-input class="col-12"
        name="description" type="textarea" rows="3"
        stack-label :label="$tc('label.description')"
        filled
        :dark="LAYOUT.isDark"
        v-model="rsForm.description"/>
    </q-card-section>
    <q-separator :dark="LAYOUT.isDark" />
    <q-card-actions class="q-mx-lg">
      <q-btn :label="$tc('form.cancel')" icon="cancel" color="dark" @click="FORM.toBack()"></q-btn>
      <q-btn :label="$tc('form.reset')" icon="refresh" color="light" @click="setForm(FORM.data)"></q-btn>
      <q-btn :label="$tc('form.revision')" icon="save" color="red" @click="onSave()" v-if="IS_REVISION" />
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
      SHEET:{
        units: {api:'/api/v1/references/units?mode=all'},
        customers: {api:'/api/v1/incomes/customers?mode=all'},
        vehicles: {api:'/api/v1/references/vehicles?mode=all'},
        items: {autoload:false, api:'/api/v1/common/items?mode=all'},
        incoming_goods: {autoload:false, api:'/api/v1/warehouses/incoming-goods?mode=all'}
      },
      FORM:{
        resource:{
          uri: '/admin/outgoing-goods',
          api: '/api/v1/warehouses/outgoing-goods',
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
          reference_date: null,

          transaction: null,
          order_mode: null,

          vehicle_id: null,
          rit: null,
          description: null,
          exclude_items: [],
          outgoing_good_items:[
            {
              id:null,
              item_id: null, item: {},
              quantity: null,
              unit_id: null,
              unit_rate: 1,
              incoming_good_item_id: null
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
    IS_REVISION() {
      if (this.FORM.data.deleted_at) return false
      if (this.FORM.data.status === 'REVISED') return false

      return this.$app.can('outgoing-goods-validation')
    },
    IssetItemDetails() {
        let items = this.rsForm.outgoing_good_items
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
    IncomingGoodItemOptions() {
      if (this.SHEET['incoming_goods'].data.length <= 0) return []
      const incoming_goods = this.SHEET['incoming_goods'].data
      let details = []
      for (let i = 0; i < incoming_goods.length; i++) {
        incoming_goods[i].incoming_good_items.map(x => {
          details.push(Object.assign(x, {incoming_good_number:incoming_goods[i].full_number}))
        })

      }
      return (details.map(item => ({
        label: `${item.incoming_good_number} [#${item.id}]`,
        value: item.id,
        rowdata: item
      })) || [])
    },
    CustomerOptions() {
      // let label = [item.code, item.name].join('-')
      return (this.SHEET.customers.data.map(item => ({label: [item.code, item.name].join(' - '), value: item.id})) || [])
    },
    VehicleOptions() {
      return this.SHEET.vehicles.data.map(item =>  ({
          label: item.number,
          value: item.id
        })
      )
    },
    UnitOptions() {
      return (this.SHEET.units.data.map(item => ({label: item.code, value: item.id})) || [])
    },
    ItemOptions() {
        let orItems = []
        if(this.FORM.data.outgoing_good_items) {
          orItems = this.FORM.data.outgoing_good_items.map(item => item.item_id)
        }

        let Items = this.SHEET.items.data || []
        Items = Items.filter((item) => {
          if(!item.enable && !orItems.find(x => x === item.id)) return false
          return item.customer_id === this.rsForm.customer_id
        })

        return (Items.map(item => ({
          label: item.part_name,
          sublabel: `[${item.customer_code}] - No.${item.part_number}`,
          disable: !item.enable,
          value: item.id}) || []))
    },
    ItemUnitOptions() {
      let vars = []
      for (const i in this.rsForm.outgoing_good_items) {
        if (this.rsForm.outgoing_good_items.hasOwnProperty(i)) {
          let rsItem = this.rsForm.outgoing_good_items[i]
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
    MaxStock() {
      let stockItem =  {}
      let moveItem = {
        set: function (id, val) {
          if (!this.hasOwnProperty(id)) this[id] = 0
            this[id] += Number(val)
        },
        get: function (id) {
          return this.hasOwnProperty(id) ? this[id] : 0
        }
      }

      this.IncomingGoodItemOptions.map(detail => {
        stockItem[detail.rowdata.id] = Number(detail.rowdata.unit_amount) - Number(detail.rowdata.amount_outgoing)
      })

      if (this.FORM.data.outgoing_good_items) {
          this.FORM.data.outgoing_good_items.map(detail => {
            if (stockItem.hasOwnProperty(detail.incoming_good_item_id)) {
              stockItem[detail.incoming_good_item_id] += Number(detail.unit_amount)
          }
        })
      }

      return this.rsForm.outgoing_good_items.map((detail, index) => {
        let max = 0
        if (detail.incoming_good_item_id) {
          max = Number(stockItem[detail.incoming_good_item_id] || 0) - Number(moveItem.get(detail.incoming_good_item_id) || 0)
          moveItem.set(detail.incoming_good_item_id, detail.quantity * detail.unit_rate)
        }
        return max
      })
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
      this.FORM.load((data) => {
        this.setForm(data || this.setDefault())
      })
    },
    setForm(data) {
      this.rsForm = Object.assign(this.setDefault(), JSON.parse(JSON.stringify(data)))

      if(data.customer_id) {
        const or = data.outgoing_good_items.map(x => x.incoming_good_item_id)
        this.SHEET.load('items', `customer_id=${data.customer_id}`)
        this.SHEET.load('incoming_goods',`transaction=${data.transaction}&customer_id=${data.customer_id}&has_amount_outgoing=true&or_detail_ids=${or}`)
      }

    },
    setDateReference (val) {
      if (this.ROUTE.meta.mode === 'create') {
        if (this.rsForm.date < this.$app.moment().format('YYYY-MM-DD')) this.rsForm.time = null
        else if (this.rsForm.date === this.$app.moment().format('YYYY-MM-DD')) {
          this.rsForm.time = this.$app.moment().format('HH:mm')
        }

      }
    },
    setCustomerReference(val) {
      if(!val){
        this.rsForm.order_mode = null
        return
      }

      if(this.rsForm.customer_id) {
        this.SHEET.load('items', 'customer_id='+ this.rsForm.customer_id)
        this.SHEET.load('incoming_goods',`transaction=${this.rsForm.transaction}&customer_id=${val}&has_amount_outgoing=true`)
      }

      if (this.rsForm.transaction !== 'RETURN') {
        const customer = this.MAPINGKEY['customers'][val]
        if (customer) {
          this.rsForm.order_mode = this.MAPINGKEY['customers'][val].order_mode
        }
      }
      else this.rsForm.order_mode = 'NONE'

    },
    setItemReference(index, val) {

      if(!val) {
        this.rsForm.outgoing_good_items[index].unit_id = null
        this.rsForm.outgoing_good_items[index].unit_rate = 1
        this.rsForm.outgoing_good_items[index].unit = {}
        this.rsForm.outgoing_good_items[index].item = {}
      }
      else {
        this.rsForm.outgoing_good_items[index].item = this.MAPINGKEY['items'][val]

        let baseUnitID = this.MAPINGKEY['items'][val].unit_id
        this.rsForm.outgoing_good_items[index].unit_id = baseUnitID
        this.rsForm.outgoing_good_items[index].unit_rate = 1
        this.rsForm.outgoing_good_items[index].unit = this.MAPINGKEY['units'][baseUnitID]
      }

    },
    setUnitReference(index, val) {

      if(!val) return;
      else if (this.rsForm.outgoing_good_items[index].item.unit_id === val) {
        this.rsForm.outgoing_good_items[index].unit_rate = 1
      }
      else {
        if(this.rsForm.outgoing_good_items[index].item.item_units) {
          this.rsForm.outgoing_good_items[index].item.item_units.map((unitItem)=> {
            if (unitItem.unit_id == val) this.rsForm.outgoing_good_items[index].unit_rate = unitItem.rate
          })
        }
      }
    },

    addNewItem(){
      let newEntri = this.setDefault().outgoing_good_items[0]
      this.rsForm.outgoing_good_items.push(newEntri)
    },
    removeItem(index) {
      if (this.rsForm.outgoing_good_items[index].request_order_item_id) {
        this.rsForm.exclude_items.push(Object.assign({},this.rsForm.outgoing_good_items[index]))
      }
      this.rsForm.outgoing_good_items.splice(index, 1)
      // if (this.rsForm.outgoing_good_items.length < 1) this.addNewItem()
    },
    includeItem(index) {
      if (this.rsForm.exclude_items[index]) {
        this.rsForm.outgoing_good_items.push(Object.assign({},this.rsForm.exclude_items[index]))
        this.rsForm.exclude_items.splice(index, 1)
      }
    },

    onSave() {
      this.$validator.validate().then(result => {
        if (!result) {
          return this.$q.notify({
            color:'negative', icon:'error', position:'top-right', timeout: 3000,
            message:this.$tc('messages.to_complete_form')
          });
        }
        this.FORM.loading = true
        let {method, mode, apiUrl} = this.FORM.meta();
        apiUrl += `?mode=revision`
        this.$axios.set(method, apiUrl, this.rsForm)
        .then((response) => {
          let message = response.data.number + ' - #' + response.data.id
          this.FORM.response.success({message:message})
          this.FORM.toView(response.data.id)
        })
        .catch((error) => {
          this.FORM.response.error(error.response || error, 'UPDATE FAILED');
          this.FORM.response.fields(error.response);
        })
        .finally(()=>{
          setTimeout(() => {
            this.FORM.loading = false
          }, 2000)

        });

      });
    },
  },
}
</script>
