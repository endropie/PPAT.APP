<template>
<q-page padding class="form-page row justify-center" v-if="SHOW">
  <q-card inline class="main-box self-start" :dark="LAYOUT.isDark">
    <q-card-section>
      <form-header :title="FORM.title()" :subtitle="FORM.subtitle()" >
        <template slot="menu-item">
          <list-item :label="$tc('label.remove')" icon="delete" clickable @click="FORM.delete" v-close-popup v-if="$route.params.id"/>
        </template>
      </form-header>
    </q-card-section>
    <q-card-section>
      <div class="row q-col-gutter-sm q-gutter-x-lg q-mb-lg">
        <q-input class="col-12 col-sm-6" 
          name="code"
          :label="$tc('label.code')" 
          v-model="rsForm.code" 
          v-validate="'required'" 
          :dark="LAYOUT.isDark"
          :error="errors.has('code')" 
          :error-message="errors.first('code')"
           />

        <q-input class="col-12 col-sm-6" 
          name="name"
          :label="$tc('label.name')" 
          v-model="rsForm.name" 
          v-validate="'required'" 
          :dark="LAYOUT.isDark" 
          :error="errors.has('name')" 
          :error-message="errors.first('name')"/>

        <q-input class="col-12 col-sm-4" 
          name="times_spray_white" 
          :label="$tc('items.white_spray')"
          :hint="$tc('label.in', 1, {v:$tc('label.second', 2)})"
          v-model="rsForm.times_spray_white" 
          type="number"  
          v-validate="'required'" 
          :dark="LAYOUT.isDark" 
          :error="errors.has('times_spray_white')" 
          :error-message="errors.first('times_spray_white')"/>

        <q-input class="col-12 col-sm-4" 
          name="times_spray_red" 
          :label="$tc('items.red_spray')"
          :hint="$tc('label.in', 1, {v:$tc('label.second', 2)})"
          type="number"  
          v-model="rsForm.times_spray_red" 
          v-validate="'required'" 
          :dark="LAYOUT.isDark" 
          :error="errors.has('times_spray_red')" 
          :error-message="errors.first('times_spray_red')"/>

        <q-select class="col-12 col-sm-4" 
          name="color_id" 
          :label="$tc('label.color')"
          v-model="rsForm.color_id"  
          v-validate="'required'" :dark="LAYOUT.isDark"
          :options="ColorOptions" 
          map-options 
          :error="errors.has('color_id')" 
          :error-message="errors.first('color_id')" />

        <q-input class="col-12 q-mb-md"
          :label="$tc('label.description')" 
          v-model="rsForm.description" 
          type="textarea" rows="3"
          dense 
          :dark="LAYOUT.isDark"/>
      
        <!-- PLATING DETAIL -->
        <form-detail class="col-12" :list="$q.screen.lt.md"
          :title="$tc('label.of', 2, {b:$tc('items.specification',2), a:$tc('label.detail') })"
          :columns="[
            {name:'thick', label: 'Label Thick'},
            {name:'plate', label: 'Label Plate'},
          ]"
          :data="rsForm.specification_details"
          :label-new="$t('label.new', {v:$tc('items.specification')})"
          :new-data="{id: null, plate:null, thick:null }"
          :dark="LAYOUT.isDark"
          min-length="-1">
          
          <template v-slot:field-thick="rs">
            <q-input  class="col-12 col-sm-3"
            :name="`specification_details.${rs.row.__index}.thick`" 
            :label="$tc('items.thick',2)"
            type="number" 
            v-model="rs.row.thick" 
            v-validate="'required'" 
            filled dense hide-bottom-space 
            :dark="LAYOUT.isDark" 
            :error="errors.has(`specification_details.${rs.row.__index}.plate`)"  
            :error-message="errors.first(`specification_details.${rs.row.__index}.plate`)">
            </q-input> 

          </template>
          <template v-slot:field-plate="rs" >
            <q-input class="col-12 col-sm-9"
              :name="`specification_details.${rs.row.__index}.plate`"
              :label="$tc('label.name', 3, {v:$tc('items.plate')})" 
              v-model="rs.row.plate" 
              filled dense hide-bottom-space
              :dark="LAYOUT.isDark" 
              :error="errors.has(`specification_details.${rs.row.__index}.plate`)" 
              :error-message="errors.first(`specification_details.${rs.row.__index}.plate`)" >

              
            </q-input>
          </template>
          
          
        </form-detail>
      </div>
    </q-card-section>
    <q-separator :dark="LAYOUT.isDark" />
    <q-card-actions class="group float-right">
      <q-btn :label="$tc('label.cancel')" icon="cancel" color="dark" @click="FORM.toBack()"></q-btn>
      <q-btn :label="$tc('label.reset')" icon="refresh" color="light" @click="FORM.reset()"></q-btn>
      <q-btn :label="$tc('label.save')" icon="save" color="positive" @click="onSave()"></q-btn>
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
      test: null,
      selected:[],
      SHEET:{
        colors: {data:[], api:'/api/v1/references/colors?mode=all'},
      },
      FORM:{    
        resource:{
          uri: '/admin/references/specifications',
          api: '/api/v1/references/specifications',
        },
      },
      rsForm:{},
      setDefault:()=>{
        return {
          name:null,
          description:null,
          color_id:null,
          times_spray_white:null,
          times_spray_red:null,

          
          specification_details:[ {id:null} ],

          thick_1:null, plate_1:null, 
          thick_2:null, plate_2:null, 
          thick_3:null, plate_3:null, 
          thick_4:null, plate_4:null, 
        }
      }
    }
  },
  created(){
    // Component Page Mounted!
    this.init()
    // this.$validator.validate()
  },
  computed:{
    ColorOptions() {
      return (this.SHEET.colors.data.map(item => ({label: item.name, value: item.id})) || [])
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
      this.rsForm = JSON.parse(JSON.stringify(data))
    },

    routing() {
      if(this.$route.meta.mode === 'edit') {

        this.FORM.loading = true
        let url = this.FORM.resource.api +'/'+ this.$route.params.id
        this.$axios.get(url)
          .then((response) => { 
            
            this.rsForm = response.data 
            this.FORM.show = true;
            this.FORM.loading = false
          })
          .catch(error => { 
            console.warn('[FORM:routing]', error)
            
            this.$app.response.error(error.response, 'Load Form')

          })
        
      }
      else{
        this.rsForm = this.setDefault()
        this.FORM.show = true;
      }
    },

    addNewDetail () {
      const newEntri = {id:null};
      this.rsForm.specification_details.push(newEntri)
    },

    removeDetail (index) {
      this.rsForm.specification_details.splice(index, 1)
      // if(this.rsForm.specification_details.length < 1) this.addNewDetail()
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
          let message = response.data.name + ' - #' + response.data.id
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
