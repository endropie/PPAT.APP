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
    <q-separator :dark="LAYOUT.isDark"></q-separator>
    <!-- ROW::1st Customer Identitity -->
    <q-card-section class="row q-col-gutter-x-sm">
      <div class="col-12 col-sm-6" >
        <div class="row q-col-gutter-x-md">
          <q-input name="code" class="col-8"
            label="Intern. code" 
            v-model="rsForm.code" 
            v-validate="'required'" 
            :dark="LAYOUT.isDark"
            :error="errors.has('code')" 
            :error-message="errors.first('code')"/>
        
          <q-input name="name" class="col-12"
            label="Nama" 
            v-model="rsForm.name" 
            v-validate="'required'" 
            :dark="LAYOUT.isDark"
            :error="errors.has('name')" 
            :error-message="errors.first('name')"/>
            
          <q-input name="phone" class="col-12 col-sm-6"
            label="Phone" 
            v-model="rsForm.phone" 
            v-validate="'required'" 
            :dark="LAYOUT.isDark"
            :error="errors.has('phone')" 
            :error-message="errors.first('phone')"/>
        
          <q-input name="fax" class="col-12 col-sm-6"
            label="Fax" v-model="rsForm.fax" 
            :dark="LAYOUT.isDark"
            :error="errors.has('fax')" 
            :error-message="errors.first('fax')"/>
            
          <q-input name="email" class="col-12"
            label="Email" v-model="rsForm.email" v-validate="''" 
            :dark="LAYOUT.isDark"
            :error="errors.has('email')" :error-message="errors.first('email')"/>
            
          <q-input name="address" class="col-12"
            type="textarea" rows="2" 
            label="Address" stack-label
            v-model="rsForm.address" 
            :dark="LAYOUT.isDark" />
        
          <q-input name="subdistrict" class="col-12 col-sm-6"
            label="Sub-district" v-model="rsForm.subdistrict" :dark="LAYOUT.isDark"
            :error="errors.has('subdistrict')" :error-message="errors.first('subdistrict')"/>
        
          <q-input name="district" class="col-12 col-sm-6"
            label="District" 
            v-model="rsForm.district" 
            :dark="LAYOUT.isDark"
            :error="errors.has('district')" :error-message="errors.first('district')"/>
        
          <select-filter name="province_id" class="col-12 col-sm-8"
            label="Province"
            v-model="rsForm.province_id" 
            :dark="LAYOUT.isDark"
            :options="ProvinceOptions" filter
            :error="errors.has('province_id')" :error-message="errors.first('province_id')" />
            
          <q-input name="zipcode" class="col-12 col-sm-4"
              label="Zip Code" 
              v-model="rsForm.zipcode" 
              :dark="LAYOUT.isDark" 
              :error="errors.has('zipcode')" :error-message="errors.first('zipcode')" />
              
        </div>
      </div>
      <!-- COLUMN::2nd Customer Coporation details -->
      <div class="col-12 col-sm-6" >
        <div class="column q-mb-lg">
        
          <q-input name="pkp" class="col-12"
            label="No. PKP" 
            v-model="rsForm.pkp" 
            v-validate="''" 
            :dark="LAYOUT.isDark"
            :error="errors.has('pkp')" 
            :error-message="errors.first('pkp')" />

          <q-input name="npwp" class="col-12" 
            label="NPWP" 
            v-model="rsForm.npwp" 
            v-validate="''" 
            :dark="LAYOUT.isDark"
            :error="errors.has('npwp')" 
            :error-message="errors.first('npwp')"/>

          <q-input name="bank_account" class="col-12" 
              label="Bank Account" 
              v-model="rsForm.bank_account" 
              v-validate="''" 
              :dark="LAYOUT.isDark"
              :error="errors.has('bank_account')" 
              :error-message="errors.first('bank_account')" />
          
          <q-list bordered :dark="LAYOUT.isDark">
            <q-item-label header>Taxes</q-item-label>
            <q-separator :dark="LAYOUT.isDark"></q-separator>
            <q-item>
              <q-item-section >
                <div class="row q-col-gutter-sm">
                  <q-field class="col-4" borderless >
                    <q-toggle name="with_tax" 
                      label="Tax" 
                      v-model="rsForm.with_tax" 
                      :false-value="0" 
                      :true-value="1" 
                      :dark="LAYOUT.isDark"/>
                  </q-field>
                  <q-field class="col-8" borderless>
                    <q-toggle name="with_pph" 
                      label="PPH" 
                      v-model="rsForm.with_pph" 
                      :false-value="0" 
                      :true-value="1" 
                      :dark="LAYOUT.isDark"/>
                  </q-field>
                  <q-input name="tax" class="col-4" 
                    label="Tax [PPN]" type="number" 
                    filled
                    v-model="rsForm.tax" 
                    :dark="LAYOUT.isDark"
                    :error="errors.has('tax')" 
                    :error-message="errors.first('tax')" />
                  <q-input name="pph_material" class="col-4" 
                    label="Material" type="number" 
                    filled
                    v-model="rsForm.pph_material" 
                    :dark="LAYOUT.isDark"
                    :error="errors.has('pph_material')" 
                    :error-message="errors.first('pph_material')" />
              
                  <q-input name="pph_service" class="col-4" 
                    label="Service" type="number" 
                    filled
                    v-model="rsForm.pph_service" 
                    :dark="LAYOUT.isDark"
                    :error="errors.has('pph_service')" 
                    :error-message="errors.first('pph_service')" />
              
                </div>

              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </div>
    </q-card-section>
    
    <q-card-section class="row q-col-gutter-sm q-col-gutter-x-md q-mb-lg">
      <!-- COLUMN::3th Contact lists -->
      <div class="col-12">
        <q-list dense class="main-box" :dark="LAYOUT.isDark" color="secondary" separator bordered>
          <q-item-label header >Contact List</q-item-label>
          <q-separator  :dark="LAYOUT.isDark" />
          <q-item v-for="(item, index) in rsForm.customer_contacts" :key="index">
            <q-item-section class="">
              <div class="row q-col-gutter-xs">

                
                <q-input :name="`customer_contacts.${index}.name`" class="col-12 col-sm-5"
                  label="Name"  stack-label 
                  placeholder="Enter fullname ..." 
                  dense filled hide-bottom-space
                  v-model="rsForm.customer_contacts[index].name" 
                  v-validate="rsForm.customer_contacts[index].phone ? 'required' : ''"
                  :error="errors.has(`customer_contacts.${index}.name`)"  
                  :error-message="errors.first(`customer_contacts.${index}.name`)"/>
                  
                <q-input :name="`customer_contacts.${index}.label`"  class="col-12 col-sm-3" 
                  v-model="rsForm.customer_contacts[index].label" 
                  stack-label label="Position" 
                  placeholder="Enter Position ..."
                  dense filled  hide-bottom-space
                  :error="errors.has(`customer_contacts.${index}.label`)" 
                  :error-message="errors.first(`customer_contacts.${index}.label`)"/>
                
                <q-input :name="`customer_contacts.${index}.phone`" class="col-12 col-sm-4"
                  v-model="rsForm.customer_contacts[index].phone" 
                  label="Phone" stack-label 
                  placeholder="xxx-xxxx-xxxx" 
                  dense filled hide-bottom-space
                  v-validate="rsForm.customer_contacts[index].name ? 'required' : ''"
                  :error="errors.has(`customer_contacts.${index}.phone`)"  
                  :error-message="errors.first(`customer_contacts.${index}.phone`)" />
              </div>
            </q-item-section>
            <q-item-section side>
              <q-btn dense flat icon="clear" color="red" @click="removeContact(index)" />
            </q-item-section>
          </q-item>
          <q-separator spaced inset :dark="LAYOUT.isDark" />
          <q-item>
            <q-item-section align="q-pb-sm">
              <q-btn align="center" dense icon="add" color="positive" label="New contact" @click="addNewContact()" />
            </q-item-section>
          </q-item>
        </q-list>
      </div>
      <!-- COLUMN::4th Reference Mode Picker -->
      <div class="col-12">
        <div class="row items-start q-col-gutter-md q-mb-md" :class="{'text-white': LAYOUT.isDark}">
          <q-field class="col-12 col-sm-4" 
            label="Invoice Type" stack-label
            :error="errors.has('invoice_mode')" 
            :error-message="errors.first('invoice_mode')"
            :dark="LAYOUT.isDark"
            hint="Pick the mode for bill of customers">
            
              <q-option-group 
                name="invoice_mode" type="radio" class="q-pa-sm"
                v-model="rsForm.invoice_mode" 
                v-validate="'required'"
                :dark="LAYOUT.isDark" dense
                :options="SETTING.customer.invoice_mode" />
            
          </q-field>
          <q-field class="col-12 col-sm-4" 
            label="Delivery Type"  stack-label
            hint="Pick the mode for Delivery documents"
            :error="errors.has('delivery_mode')" 
            :error-message="errors.first('delivery_mode')">
            
            <q-option-group name="delivery_mode" type="radio" class="q-pa-sm"
              v-model="rsForm.delivery_mode" 
              v-validate="'required'"
              :dark="LAYOUT.isDark" dense
              :options="SETTING.customer.delivery_mode" />

          </q-field>
          <q-field class="col-12 col-sm-4" 
            label="PO type"  stack-label
            hint="Pick the mode for Sales documents"
            :error="errors.has('order_mode')" 
            :error-message="errors.first('order_mode')">
            
            <q-option-group 
              name="order_mode" type="radio" class="q-pa-sm"
              v-model="rsForm.order_mode" 
              v-validate="'required'"
              :dark="LAYOUT.isDark" dense
              :options="SETTING.customer.order_mode" />

          </q-field>
        </div>
      </div>
      
    </q-card-section>
    <q-separator :dark="LAYOUT.isDark" />
    <q-card-actions class="q-mx-lg">
      <q-btn :label="$tc('label.cancel')" icon="cancel" color="dark" @click="FORM.toBack()"></q-btn>
      <q-btn :label="$tc('label.reset')" icon="refresh" color="light" @click="init()"></q-btn>
      <q-btn :label="$tc('label.save')" icon="save" color="positive" @click="onSave()"></q-btn>     
    </q-card-actions>
  </q-card>
    <q-inner-loading :visible="FORM.loading" :dark="LAYOUT.isDark"><q-spinner-dots size="70px" color="primary" /></q-inner-loading>
</q-page>
</template>

<script>
import MixForm from '@/mixins/mix-form.vue'
import Readme from '@/../README.md'

export default {
  mixins: [MixForm],
  components: {
    Readme
  },
  data () {
    return {
      SETTING: {
        customer:{
          invoice_mode: [
            { label: 'Service & material are joined', value: 'JOIN', color: 'positive' },
            { label: 'Service & material are separated', value: 'SEPARATE', color: 'orange' },
            { label: 'Service & material Specified', value: 'DETAIL', color: 'blue'}
          ],
          delivery_mode: [
            { label: 'Service & material are joined', value: 'JOIN', color: 'positive' },
            { label: 'Service & material are separated', value: 'SEPARATE', color: 'orange' },
            { label: 'Service & material Specified', value: 'DETAIL', color: 'blue'},
            { label: 'Units of service & material Specified', value: 'UNIT_DETAIL', color: 'info'}
          ],
          order_mode: [
            { label: 'Non-PO (PO Harian)', value: 'NONE', color: 'blue-grey' },
            { label: 'PO', value: 'PO', color: 'blue' },
            { label: 'PO Akumulasi', value: 'ACCUMULATE', color: 'positive'}
          ],
        }
      },
      SHEET:{
        provinces: {data:[], api:'/api/v1/references/provinces?mode=all'},
      },
      FORM:{
        resource:{
          uri: '/admin/incomes/customers',
          api: '/api/v1/incomes/customers',
        },
      },
      rsForm: {},
      setDefault:()=>{
        return {
          code:null,
          name: null,
          phone: null,
          fax: null,
          email: null,
          address: null,
          subdistrict: null,
          district: null,
          province_id: null,
          zipcode: null,

          pkp: null,
          npwp: null,
          bank_account: null,

          with_tax: 1,
          with_pph: 1,
          tax: 0,
          pph_material: 0,
          pph_service: 0,


          invoice_mode: null,
          delivery_mode: null,
          order_mode: null,
          customer_contacts:[ {id:null} ]

        }
      }
    }
  },
  created(){
    // Component Page Mounted!
    this.init()

  },
  computed:{
    ProvinceOptions() {
      return (this.SHEET.provinces.data.map(item => ({label: item.name, value: item.id})) || [])
    }
  },
  watch:{
    '$route' : 'init',
  },
  methods: {
    init() {
      this.SHOW = true
      this.FORM.load(
        (data) => {
          this.setForm(data)
          setTimeout(() => {
            this.SHOW = true
          }, 500) 
        }
      )
    },

    setForm (data) {
      this.rsForm = JSON.parse(JSON.stringify(data))
    },

    addNewContact(autofocus = true){
      let newEntri = {id:null, label:null, name: null, phone:null};
      
      this.rsForm.customer_contacts.push(newEntri)
    },
    removeContact(index) {
        this.rsForm.customer_contacts.splice(index, 1)
        if(this.rsForm.customer_contacts.length < 1) this.addNewContact()
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
          let label = response.data.name + ' - #' + response.data.id
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