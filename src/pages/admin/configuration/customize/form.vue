<template>
<q-page padding style="max-width:900px">
  <q-list class="main-box" :dark="LAYOUT.isDark"  color="primary">
    <p>
        {{ $t('message.hello') }}
    </p>
    <q-item-label header>Language</q-item-label>
    <q-item>
      <q-item-section>
        <div class="row q-col-gutter-xs ">
          <q-select 
              label="Language"
              v-model="LANG"
              class="col-12" 
              :options ="[
                { label: 'English (US)', value: 'en-us' },
                { label: 'Bahasa Indonesia', value: 'id' }
              ]"
            />
        </div>
      </q-item-section>
    </q-item>
    <q-item-label header>Layout</q-item-label>
    <q-item>
      <q-item-section side>Night Mode</q-item-section>
      <q-item-section>
        <q-toggle v-model="NIGHMODE" />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section side>Color Themes</q-item-section>
      <q-item-section>
        <q-btn-group>
          <q-btn label="INDIGO" color="indigo" @click="$store.commit('admin/setTheme', 'indigo')" />
          <q-btn label="PINK" color="pink" @click="$store.commit('admin/setTheme', 'pink')" />
          <q-btn label="GREEN" color="green" @click="$store.commit('admin/setTheme', 'green')" />
          <q-btn-dropdown label="Others" color="grey">
            
            <!-- dropdown content -->
            <q-list link color="primary" >
              <q-item 
                v-for="(name, index) in LAYOUT.themes.filter((n) => !['indigo', 'pink', 'green'].some(f => f === n))" 
                :key="index" 
                :color="name" 
                clickable 
                v-close-popup
                @click.native="$store.commit('admin/setTheme', name)" 
              >
                <q-item-section side :color="name" >{{ name }}</q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </q-btn-group>
      </q-item-section>
    </q-item>

  </q-list>
</q-page>
</template>

<script>

import MixPage from '@/mixins/mix-page.vue'
import MixForm from '@/mixins/mix-form.vue'

export default {
  mixins: [MixPage, MixForm],
  data () {
    return {
      LANG: this.$q.lang.isoName,
      FORM:{    
        resource:{
          // api: '/api/v1/auth',
          // uri: '/admin/configuration/profile'
        },
      },
    }
  },
  created() {
    // Component Page Created!

  },
  mounted(){
    // Component Page Mounted!
    

  },
  watch: {
     LANG (lang) {
      // dynamic import, so loading on demand only
      import(`quasar/lang/${lang}`).then(lang => {
        this.$q.lang.set(lang.default)
      })
    }
  },
  computed:{
    NIGHMODE: {
      get () {
        return this.$store.state.admin.LAYOUT.isDark
      },
      set (val) {
        this.$store.commit('admin/setMode', val)
      }
    },
  },
  methods: {
    test(){
      console.log(this.FORM)
    },
  },
}
</script>
