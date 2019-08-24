<template>
    <q-card highlight class="main-box no-margin no-shadow" :dark="LAYOUT.isDark">
      <q-card-section>
        <span class="text-h4" header>{{$tc('label.general')}}</span>
      </q-card-section>
      <q-card-section class="row q-gutter-xs" v-if="FORM.show">
        <q-input class="col-12"
          name="app_name"
          label="App Name"
          v-model="rsForm.app_name"
          v-validate="'required|min:4|max:25'"
          :dark="LAYOUT.isDark"
          :error="errors.has('app_name')"
          :error-message="errors.first('app_name')"
        />
        <q-input class="col-12"
          name="app_subname"
          label="Sub name"
          v-model="rsForm.app_subname"
          v-validate="'max:191'"
          :dark="LAYOUT.isDark"
          :error="errors.has('app_subname')"
          :error-message="errors.first('app_subname')"
        />
      </q-card-section>
      <q-card-actions class="q-gutter-sm" align="right">
          <!-- <q-btn color="light" size="sm" @click="setForm(FORM.data)">Reset</q-btn> -->
          <q-btn dense color="positive"  @click="onSave()">Save</q-btn>
      </q-card-actions>

    <q-inner-loading :showing="FORM.loading" :dark="LAYOUT.isDark">
      <q-spinner-dots size="70px" color="primary" />
    </q-inner-loading>
    </q-card>
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
          name: 'general',
          api: '/api/v1/setting',
        },
      },
      rsForm: {},
    }
  },
  created() {
    // Component Page Created!
    this.init()
  },
  watch:{
      '$route' : 'init',
  },
  methods: {
    init() {
      this.FORM.loading = true
      this.FORM.show = false
      this.rsForm = this.$store.state.admin.SETTING[this.FORM.resource.name]

      setTimeout(() => {
        this.FORM.loading = false
        this.FORM.show = true

      }, 500)
    },
    onSave() {

      this.$validator.validateAll().then(result => {
        if (!result) {
          this.$q.notify({
            color:'negative', icon:'error', position:'top-right', timeout: 3000,
            message:this.$tc('messages.to_complete_form')
          });

          return;
        }
        this.FORM.loading = true
        this.$axios.set('POST', `${this.FORM.resource.api}/${this.FORM.resource.name}`, this.rsForm)
          .then((response) => {
            this.FORM.response.success({ mode:'edit', label:'Setting'})
            this.$store.commit('admin/setSetting', response.data)
            this.$nextTick(() => this.$validator.reset())
          })
          .catch((error) => {
            this.FORM.response.fields(error.response)
            this.FORM.response.error(error.response || error, 'Setting')
          })
          .finally(()=>{
            this.FORM.loading = false
          });
      });
    },
  },
}
</script>
