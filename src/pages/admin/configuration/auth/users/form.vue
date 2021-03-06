<template>
<q-page padding class="form-page row justify-center" >
  <q-card inline class="main-box self-start" :dark="LAYOUT.isDark" v-if="FORM.show">
    <q-card-section>
     <form-header :title="FORM.title()" :subtitle="FORM.subtitle()" >
        <template slot="menu-item">
          <list-item :label="$tc('form.remove')" icon="delete" clickable @click="FORM.delete" v-close-popup v-if="ROUTE.params.id"/>
        </template>
      </form-header>
    </q-card-section>
    <q-card-section>
      <div class="row q-col-gutter-sm " >
        <q-input class="col-sm-6"
          name="name"
          label="Name"
          :readonly="IS_ADMIN"
          v-model="rsForm.name"
          v-validate="'required|min:5'"
          :dark="LAYOUT.isDark"
          :error="errors.has('name')"
          :error-message="errors.first('name')"
        />
        <q-input class="col-sm-6"
          name="email"
          label="Email"
          type="email"
          v-model="rsForm.email"
          v-validate="'required|email'"
          :dark="LAYOUT.isDark"
          :error="errors.has('email')"
          :error-message="errors.first('email')"
        />
        <q-input class="col-sm-6"
          name="password"
          label="Password"
          type="password"
          v-model="rsForm.password"
          v-validate="'required|min:8'"
          v-if="ROUTE.meta.mode !== 'edit'"
          :dark="LAYOUT.isDark"
          :error="errors.has('password')"
          :error-message="errors.first('password')"
        />
        <q-input class="col-sm-6"
          name="password_confirmation"
          label="Confirm Password"
          type="password"
          v-model="rsForm.password_confirmation"
          v-validate="'required'"
          v-if="ROUTE.meta.mode !== 'edit'"
          :dark="LAYOUT.isDark"
          :error="errors.has('password_confirmation')"
          :error-message="errors.first('password_confirmation')"
        />
        <div  class="col-12">
          <q-list>
            <q-expansion-item label="RULES" expand-separator >
              <div class="row q-col-gutter-sm ">
                <q-checkbox v-for="(role, index) in RoleOptions" :key="index"
                  class="col-12 col-sm-6 col-md-3" :dark="LAYOUT.isDark"
                  v-model="rsForm.has_role" :val="role.value" :label="role.value"
                  :readonly="IS_ADMIN"
                />
              </div>
            </q-expansion-item>

            <q-expansion-item label="PERMISSION" expand-separator>
              <div class="row q-col-gutter-sm ">
                <q-checkbox v-for="(permission, index) in PermissionOptions"
                  class="col-12 col-sm-6 col-md-3" :dark="LAYOUT.isDark"
                  v-model="rsForm.has_permission"
                  :val="permission.value"
                  :label="permission.value"
                  :readonly="IS_ADMIN"
                  :key="index"
                />
              </div>
            </q-expansion-item>
          </q-list>
        </div>
      </div>
    </q-card-section>
    <q-separator/>
    <q-card-actions class="q-mx-lg">
        <q-btn color="grey-8" @click="FORM.toBack()">Cancel</q-btn>
        <q-btn color="grey-5" @click="setForm(FORM.data)">Reset</q-btn>
        <q-btn color="positive" @click="onSave()">Save</q-btn>
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
        roles: {data:[], api:'/api/v1/auth/roles?mode=all'},
        permissions: {data:[], api:'/api/v1/auth/permissions?mode=all'},
      },
      FORM: {
        resource:{
          api: '/api/v1/auth/users',
          uri: '/admin/configuration/auth/users',
        },
      },
      rsForm:{},
      setDefault:()=>{
        return {
          name:null,
          email:null,
          password:null,
          password_confirmation:null,
          has_role: [],
          has_permission: [],
        }
      }
    }
  },
  created() {
    // Component Page Created!
    this.init()
  },
  computed:{
    IS_ADMIN() {
      return this.rsForm.id === 1
    },
    RoleOptions() {
      return (this.SHEET.roles.data.map(item => ({label: item.name, value: item.name})))
    },
    PermissionOptions() {
      return (this.SHEET.permissions.data.map(item => ({label: item.name, value: item.name})))
    },
  },
  watch:{
      '$route' : 'init',
  },
  methods: {
    init() {
      this.FORM.load((data) => {
        console.warn('DATA', data, this)
        this.setForm(data || this.setDefault())
      })
    },
    setForm(data) {
      this.rsForm = JSON.parse(JSON.stringify(data))
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
          let message = response.data.name + ' - #' + response.data.id
          this.FORM.response.success({message:message})
          this.FORM.toIndex()
        })
        .catch((error) => {

          this.FORM.response.fields(error.response)
          this.FORM.response.error(error.response || error, 'Submit')
        })
        .finally(()=>{
          this.FORM.loading = false
        });

      });
    },
  },
}
</script>
