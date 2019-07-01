<template>
<q-page padding class="form-page row justify-center" v-if="PAGE.enable">
  <q-card inline class="main-box self-start" :dark="LAYOUT.isDark" :class="{ 'bg-grey-9': LAYOUT.isDark}">
    <q-card-section class="text-primary">
      {{ FORM.title() }}
      <span slot="subtitle" class="text-tertiary">{{ FORM.subtitle() }}</span>
      <q-toggle slot="right" v-model="rsForm.enable" :true-value="1" :false-value="0" />
      <q-btn slot="right" icon="more_vert" round flat>
        <q-popover>
          <q-list link class="no-border">
            <q-item v-if="$route.params.id" v-close-overlay @click.native="FORM.delete">
              <q-icon name="delete"></q-icon>
              <q-item-label label="Remove"  class="q-mx-sm"/>
            </q-item>
            <q-item-separator></q-item-separator>
          </q-list>
        </q-popover>
      </q-btn>
    </q-card-section>
    <q-card-section>
      <div class="row q-col-gutter-md">
        <!-- ROW::1st -->
        <div class="col-12 col-md-6" >
          <div class="row q-mb-lg">
            <q-select
              class="col-12"
              name="customer_id"
              v-model="rsForm.customer_id"
              label="Customer"
              v-validate="'required'"
              :dark="LAYOUT.isDark"
              :options="CustomerOptions"
              @input="setCode" 
              select-filter
              options-cover
              clearable
              use-input
              fill-input
              hide-selected
              emit-value
              map-options
              options-dense
              :error="errors.has('customer_id')"
              :error-label="errors.first('customer_id')"
            />
            <select-filter 
              class="col-12" 
              name="brand_id" 
              label="Brand [ATPM]" 
              v-model="rsForm.brand_id" 
              v-validate="'required'"
              :dark="LAYOUT.isDark"
              :options="BrandOptions" 
              @input="setCode"
              options-dense
              input-debounce="0"
              :error="errors.has('brand_id')" 
              :error-label="errors.first('brand_id')"
            />
            <q-select 
              class="col-12" 
              name="specification_id" 
              v-model="rsForm.specification_id" 
              label="Specification" 
              v-validate="'required'"
              :dark="LAYOUT.isDark"
              :options="SpecificationOptions" 
              @input="setCode" 
              :error="errors.has('specification_id')" 
              :error-label="errors.first('specification_id')"
            />
          </div>
        </div>
        <div class="col-12 col-md-6" >
          <div class="row q-mb-lg">
            <q-input
              name="code"
              label="Intern Code [auto generate]"
              v-model="rsForm.code"
              v-validate="'required'"
              disable
              :dark="LAYOUT.isDark"
              class="col-12"
              icon="code"
              :error="errors.has('code')"
              :error-label="errors.first('code')"
            />
            <q-select
              name="category_item_id"
              v-model="rsForm.category_item_id"
              label="Category of Items"
              v-validate="'required'"
              class="col-12"
              icon="table_chart"
              :dark="LAYOUT.isDark"
              :options="CategoyOptions"
              :error="errors.has('category_item_id')"
              :error-label="errors.first('category_item_id')"
            ></q-select>
            <q-select
              name="type_item_id"
              label="Type of Items"
              class="col-12"
              icon="dehaze"
              v-model="rsForm.type_item_id"              
              v-validate="'required'"
              :dark="LAYOUT.isDark"
              :options="TypeOptions"
              :error="errors.has('type_item_id')"
              :error-label="errors.first('type_item_id')"
            ></q-select>
          </div>
        </div>
        <!-- ROW::2nd -->
        <div class="q-subheading text-tertiary full-width">
          Reference Items
          <!-- <hr class="text-tertiary"/> -->
        </div>
        <div class="col-12 col-md-4">
          <div class="row q-col-gutter-sm  q-mb-lg">
            <q-input 
              name="part_number" 
              label="Part Number" 
              class="col-12" 
              icon="layers" 
              v-model="rsForm.part_number" 
              v-validate="'required'" 
              :error="errors.has('part_number')" 
              :error-label="errors.first('part_number')" 
              :dark="LAYOUT.isDark"
            />
          
            <q-input 
                name="part_name" 
                label="Part name" 
                v-model="rsForm.part_name" 
                v-validate="'required'" 
                :dark="LAYOUT.isDark" 
                class="col-12" 
                icon="label" 
                :error="errors.has('part_name')" 
                :error-label="errors.first('part_name')"
            />
            <q-input 
              name="part_alias" 
              label="Part alias Finished" 
              v-model="rsForm.part_alias" 
              v-validate="''" 
              :dark="LAYOUT.isDark" 
               class="col-12" icon="beenhere" :error="errors.has('part_alias')" :error-label="errors.first('part_alias')"
            />
          </div>
        </div>
        <div class="col-12 col-md-4 col-sm-6">
          <div class="row q-col-gutter-sm q-mb-lg">
            <q-input 
              name="packing_duration" 
              label="Packing duration" 
              type="number" 
              class="col-12" 
              icon="timer" 
              v-model="rsForm.packing_duration" 
              v-validate="'required'" 
              :dark="LAYOUT.isDark"
              :error="errors.has('packing_duration')" 
              :error-label="errors.first('packing_duration')" 
            />
          
            <q-input 
              name="sa_area" 
              label="SA area" 
              v-model="rsForm.sa_area" 
              type="number" 
              v-validate="'required'" 
              :dark="LAYOUT.isDark"
              class="col-12" 
              color="dark" 
              :error="errors.has('sa_area')" 
              :error-label="errors.first('sa_area')"
            />
            
            <q-input 
              name="weight" 
              label="Weight" 
              v-model="rsForm.weight" 
              type="number" 
              v-validate="'required'" 
              :dark="LAYOUT.isDark"
              class="col-12" 
              :error="errors.has('weight')" 
              :error-label="errors.first('weight')"
            />

          </div>
        </div>
        <div class="col-12 col-md-4 col-sm-6">
          <div class="row q-col-gutter-sm  q-mb-lg">
            <q-input 
              name="number_hanger" 
              label="units of each hanger" 
              type="number" 
              class="col-12" 
              v-model="rsForm.number_hanger"
              v-validate="'required'" 
              :dark="LAYOUT.isDark"
              :error="errors.has('number_hanger')" 
              :error-label="errors.first('number_hanger')"  
            />
            <q-select 
              name="size_id" 
              v-model="rsForm.size_id" 
              label="Size" 
              v-validate="'required'"
              :dark="LAYOUT.isDark"
              :options="SizeOptions" 
              class="col-12" 
              icon="format_size" 
              :error="errors.has('size_id')" 
              :error-label="errors.first('size_id')"
            /> 
            <q-select 
              name="unit_id" 
              v-model="rsForm.unit_id" 
              label="Unit" 
              v-validate="'required'"
              :dark="LAYOUT.isDark"
              :options="UnitOptions" 
              class="col-12" icon="web_asset" 
              :error="errors.has('unit_id')" 
              :error-label="errors.first('unit_id')"
            />
          </div>
        </div>
        <!-- ROW::3th -->
        <div class="col-12">
          <div class="row border q-col-gutter-sm" color="black">
            <q-input 
              name="price" 
              label="Normal Price" 
              v-model="rsForm.price" 
              v-validate="'required'" 
              type="number" 
              color="tertiary" 
              align="center" 
              inverted
              class="col-12 col-sm-4"
              :error="errors.has('price')" 
              :error-label="errors.first('price')"
            />
            <q-input  
              name="price_area" 
              label="Price in DM" 
              :value="price_area" 
              type="number" 
              color="tertiary" 
              align="center" 
              inverted
              class="col-12 col-sm-4"
              :error="errors.has('price_area')" 
              :error-label="errors.first('price_area')"  
            />
            <q-input 
              name="price_packaged" 
              label="Price in BRL" 
              :value="price_packaged" 
              type="number" 
              color="tertiary" 
              align="center" 
              inverted
              class="col-12 col-sm-4" 
              :error="errors.has('price_packaged')" 
              :error-label="errors.first('price_packaged')"  
            />
          </div>
        </div>
          <!-- ROW::4th Pre Production -->
        <div class="col-12">
          <div class="row q-col-gutter-x-sm">
            <!-- ITEM - PRELINE -->
            <div class="col-12 col-md-6">
            <q-list class="q-pa-xs ">
              <q-item-label header>Pre Line Production</q-item-label>
              <q-item v-for="(item, index) in rsForm.item_prelines" :key="index" class="no-padding">
                <q-item-section>
                  <q-select 
                    :name="`pre-line-${index}`" 
                    v-model="rsForm.item_prelines[index].line_id" 
                    v-validate="'required'"
                    :dark="LAYOUT.isDark"
                    inverted dense
                    color="primary" 
                    :prefix="`${index+1}. `"
                    :options="LineOptions" 
                    :error="errors.has(`pre-line-${index}`)"  
                    :error-label="errors.first(`pre-line-${index}`)"
                  />
                </q-item-section>
                <q-item-section side>
                  <q-btn dense flat @click="removeProduction(index)" icon="clear" color="red-5"/>
                </q-item-section>
              </q-item>
              <q-item  class="no-padding">
                <q-item-section side>
                  <q-btn dense label="new production" @click="addNewProduction()" icon="add" color="positive" />
                </q-item-section>
              </q-item>
            </q-list>
            </div>
            <!-- ITEM - CONVERTION -->
            <div class="col-12 col-md-6">
            <q-list class="q-pa-xs" dense>
              <q-item-label header>Unit Convertion</q-item-label>
              <q-item v-for="(item, index) in rsForm.item_units" :key="index" class="no-padding">
                <q-item-section>
                  <div class="row no-wrap q-gutter-sm">
                    <q-select 
                      :name="`unit-${index}`" 
                      label="unit" 
                      prefix="1- " 
                      v-model="rsForm.item_units[index].unit_id" 
                      v-validate="'required'"
                      :dark="LAYOUT.isDark" 
                      inverted dense
                      color="primary"
                      :options="UnitOptions" 
                      style="min-width:150px"
                      :error="errors.has(`unit-${index}`)"  
                      :error-label="errors.first(`unit-${index}`)" 
                    />
                    <q-input 
                      :name="`unit-${index}`" 
                      label="rate" 
                      type="number" 
                      v-model="rsForm.item_units[index].rate"  
                      v-validate="'required'" 
                      :dark="LAYOUT.isDark"  
                      dense
                      :error="errors.has(`unit-${index}`)"  
                      :error-label="errors.first(`unit-${index}`)"
                    />

                  </div>
                </q-item-section>
                <q-item-section side>
                  <q-btn dense round flat @click="removeUnit(index)" icon="clear" color="red-4"/>
                </q-item-section>
              </q-item>
              <q-item  class="no-padding">
                <q-item-section side>
                  <q-btn dense label="New convertion" icon="add" color="positive" @click="addNewUnit()" />
                </q-item-section>
              </q-item>
            </q-list>
            </div>
          </div>
        </div>
        <!-- ROW::5th Description -->
        <div class="col-12">
          <q-input v-model="rsForm.description" type="textarea" rows="3"  label="Description" :dark="LAYOUT.isDark"/>
        </div>
      </div>
    </q-card-section>
    <q-separator spaced />
    <q-card-actions class="group">
      <q-btn label="Cancel" icon="cancel" color="grey-14" @click="FORM.toBack()" />
      <q-btn label="Reset" icon="refresh" color="grey" @click="setForm(FORM.data)" />
      <q-btn label="Save" icon="save" color="positive" @click="onSave()" :loading="FORM.loading">
        <q-spinner-facebook slot="loading" />
      </q-btn>     
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
      SHEET: {
        colors: {data:[], api:'/api/v1/references/colors?mode=all'},
        type_items: {data:[], api:'/api/v1/references/type_items?mode=all'},
        category_items: {data:[], api:'/api/v1/references/category_items?mode=all'},
        sizes: {data:[], api:'/api/v1/references/sizes?mode=all'},
        units: {data:[], api:'/api/v1/references/units?mode=all'},
        brands: {data:[], api:'/api/v1/references/brands?mode=all'},
        specifications: {data:[], api:'/api/v1/references/specifications?mode=all'},
        customers: {data:[], api:'/api/v1/incomes/customers?mode=all'},
        lines: {data:[], api:'/api/v1/references/lines?mode=all'},
        
      },
      FORM: {
        resource:{
          uri: '/admin/common/items',
          api: '/api/v1/common/items',
        },
      },
      rsForm:{},
      setDefault:()=>{
        return {
          code:null,
          customer_id:null,
          brand_id:null,
          specification_id:null,

          part_name:null,
          part_alias:null,
          part_number:null,

          number_hanger: null,
          packing_duration: null,
          sa_area: null,
          weight: null,

          category_item_id: null,
          type_item_id: null,
          size_id: null,
          unit_id: null,

          price: null,
          item_prelines:[ {id:null, line_id: null, note: null} ],
          item_units:[ {id:null, unit_id:null, rate:null} ],
          item_contacts:[ {id:null} ],
          enable: true,
          description:null,
        }
      }
    }
  },
  created() {
    // Component Page Mounted!
    this.init()

  },
  computed: {
    LineOptions() {
      return (this.SHEET.lines.data.map(item => ({label: item.name, value: item.id})) || [])
    },
    CategoyOptions() {
      return (this.SHEET.category_items.data.map(item => ({label: item.name, value: item.id})) || [])
    },
    TypeOptions() {
      return (this.SHEET.type_items.data.map(item => ({label: item.name, value: item.id})) || [])
    },
    CustomerOptions() {
      return (this.SHEET.customers.data.map(item => ({
        label: [item.code, item.name].join(' - '), 
        value: item.id
      })) || [])
    },
    BrandOptions() {
      return (this.SHEET.brands.data.map(item => ({
        label: [item.code, item.name].join(' - '), 
        value: item.id
      })) || [])
    },
    SpecificationOptions() {
      return (this.SHEET.specifications.data.map(item => ({
        label: [item.code, item.name].join(' - '),
        value: item.id
      })) || [])
    },
    SizeOptions() {
      return (this.SHEET.sizes.data.map(item => ({
        label: item.name,
        value: item.id
      })) || [])
    },
    UnitOptions() {
      return (this.SHEET.units.data.map(item => ({
        label: item.code,
        value: item.id
      })) || [])
    },
    price_area() {
      if(!Number(this.rsForm.price) || !Number(this.rsForm.sa_area)) return 0
      return Number(this.rsForm.price) / Number(this.rsForm.sa_area)
    },
    price_packaged() {
      return Number(this.rsForm.number_hanger|| 0) * Number(this.rsForm.price || 0)
    },
    MAPINGKEY(){
      let variables = {
        'brands' : {},
        'customers': {},
        'specifications': {}
      }
      this.SHEET['brands'].data.map(item => { variables['brands'][item.id] = item })
      this.SHEET['customers'].data.map(item => { variables['customers'][item.id] = item })
      this.SHEET['specifications'].data.map(item => { variables['specifications'][item.id] = item })

      return variables;
    }
  },
  watch:{
      '$route' : 'init'
  },
  methods: {
    init() {
      // this.PAGE.hide()
      this.FORM.onLoad(
        (data) => {
          this.setForm(data)
          setTimeout(() => {
            this.PAGE.show()
          }, 500) 
        }
      )
    },
    setForm(data) {
      this.rsForm = JSON.parse(JSON.stringify(data))
    },

    setCode() {
      let brand_id = this.rsForm.brand_id,
        customer_id = this.rsForm.customer_id,
        specification_id = this.rsForm.specification_id;

      let BRAND = this.MAPINGKEY['brands'][this.rsForm.brand_id] || {}
      let CUST = this.MAPINGKEY['customers'][this.rsForm.customer_id] || {}
      let SPEC = this.MAPINGKEY['specifications'][this.rsForm.specification_id] || {}

      // Set unique code 
      this.rsForm['code'] = [CUST.code, BRAND.code, SPEC.code].join('-')
    },

    addNewProduction (autofocus = true) {
      var newEntri =this.setDefault().item_prelines[0];
      
      this.rsForm.item_prelines.push(newEntri)
    },

    removeProduction (index) {
        this.rsForm.item_prelines.splice(index, 1)
        if(this.rsForm.item_prelines.length < 1) this.addNewProduction()
    },

    addNewUnit (autofocus = true) {
      var newEntri =this.setDefault().item_units[0];
      
      this.rsForm.item_units.push(newEntri)
    },

    removeUnit (index) {
        this.rsForm.item_units.splice(index, 1)
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
          let message = response.data.code + ' - #' + response.data.id
          this.FORM.response.success({message:message})
          this.FORM.toIndex()
        })
        .catch((error) => { 
          console.warn(error)
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
<!-- style lang="stylus">
@import '~variables'
.frame-box 
  .frame-main
    padding 5px 15px 15px
    box-shadow $shadow-up-1
    border-top solid 1px #848484
    border-radius-g 2px
</style -->
