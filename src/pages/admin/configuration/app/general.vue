<template>
  <q-page padding>
    <q-list highlight class="main-box" :dark="LAYOUT.isDark" v-if="FORM.show">
      <q-item-label icon="settings" header>Application setting</q-item-label>
      <q-item>
        <q-item-section>
          <form class="form" novalidate @submit.prevent="validateForm()">
            <div class="row q-gutter-xs" >
              <q-input
                name="app_name"
                label="App Name"
                v-model="rsForm.app_name"
                v-validate="'required|min:1|max:8'"
                class="col-12"
                :dark="LAYOUT.isDark"
                :error="errors.has('app_name')"
                :error-message="errors.first('app_name')"
              />
              <q-input
                name="app_subname"
                v-model="rsForm.app_subname"
                v-validate="'required|max:20'"
                class="col-12" label="Sub name"
                :dark="LAYOUT.isDark"
                :error="errors.has('app_subname')"
                :error-message="errors.first('app_subname')"
              />
              <div class="col-12" align="right">
                <!-- <q-btn color="light" size="sm" @click="setForm(FORM.data)">Reset</q-btn> -->
                <q-btn color="positive" size="sm" @click="onSave()">Save</q-btn>
              </div>
            </div>
          </form>
        </q-item-section>
      </q-item>
    </q-list>
    <q-inner-loading :showing="FORM.loading" :dark="LAYOUT.isDark"><q-spinner-dots size="70px" color="primary" /></q-inner-loading>

  </q-page>
</template>

<script>
import MixForm from '@/mixins/mix-form.vue'

export default {
  mixins: [MixForm],
  data () {
    return {
      FORM: {
        show: false,
        resource:{
          api: '/api/v1/auth',
          uri: '/admin/configuration/profile'
        },
      },
      rsForm: {},
    }
  },
  created() {
    // Component Page Created!

  },
  mounted(){

    this.FORM.loading = true
    setTimeout(() => {
      this.FORM.loading = false
      this.routing()
    }, 500)



  },
  watch:{
      '$route' : 'init',
  },
  methods: {
    routing() {
      if(!this.$store.state.admin.SETTING) return

      const SETTING = this.$store.state.admin.SETTING
      this.rsForm.app_name = SETTING.general.app_name
      this.rsForm.app_subname = SETTING.general.app_subname
    },

    onSave() {

      this.$validator.validateAll('form-pass').then(result => {
        if (!result) {
          this.$q.notify({
            color:'negative', icon:'error', position:'top-right', timeout: 3000,
            message:this.$tc('messages.to_complete_form')
          });

          return;
        }
        this.FORM.loading = true
        this.$axios.set('POST', `${this.FORM.resource.api}/change-password`, this.rsPass)
          .then((response) => {
            this.FORM.response.success({ mode:'edit', label:'change password'})
            this.rsPass = {
              password:null,
              newpassword:null,
              c_newpassword:null,
            }
            this.$nextTick(() => this.$validator.reset())
          })
          .catch((error) => {

            this.FORM.response.fields(error.response)
          this.FORM.response.error(error.response, 'Submit')
            this.FORM.onError(error.response, 'form-pass')

          })
          .finally(()=>{
            this.FORM.loading = false
          });

          console.warn('$validator', this.$validator)
      });
    },
  },
}
</script>
