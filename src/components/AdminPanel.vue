<template>
  <q-card class="bg-transparent no-shadow full-height">
    <q-card-section class="row no-wrap no-padding bg-blue-grey-1 text-blue-grey-10">
      <q-tabs style="width: calc(100% - 32px)"
        align="justify" active-color="primary"
        narrow-indicator indicator-color="primary"
        v-model="PANELTAB" >
        <q-tab name="messages" icon="mail" />
        <q-tab name="contacts" icon="person"  />
        <q-tab name="notifications" icon="notifications"  />
      </q-tabs>
      
      <q-btn icon="more_vert" dense flat></q-btn>
    </q-card-section>
    <q-separator />
    <q-card-section class="no-padding">
      <q-tab-panels v-model="PANELTAB" animated class="bg-transparent">
        <q-tab-panel name="messages" class="no-padding">
          <admin-message :dark="dark" title="Messages" />
        </q-tab-panel>
        
        <q-tab-panel name="contacts" class="no-padding">
          <div class="text-subtitle2"></div>
          <admin-contact :dark="dark" title="Contact" />
        </q-tab-panel>

        <q-tab-panel name="notifications" class="no-padding">
          <div class="text-h6">Settings</div>
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </q-tab-panel>
      </q-tab-panels>
    </q-card-section>
  </q-card>
</template>

<script>
import { mapState } from 'vuex'
import MixPage from '@/mixins/mix-page.vue'

export default {
  name: 'AdminTabs',
  props:{
      dark: Boolean
  },
  data() {
    return {
      PANELTAB: this.$store.state.admin.PAGE.sideTab || 'messages'
    }
  },
  watch: {
    'PANELTAB': function(val) {
      this.$store.commit('admin/SetSideTab', val)
    }
  },
  created() {
    // console.log('PAGEMETA', this.PAGEMETA)
  },
}
</script>
