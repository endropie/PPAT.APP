<template>
  <q-scroll-area :style="`height:calc(100vh - ${($q.screen.lt.md ? 80 : 130)}px)`" >
  <q-list separator :dark="dark">
    <q-item v-for="contact in $store.state.dbs.contacts.data" :key="contact.id" class="" clickable v-ripple>
      <q-item-section avatar>
        <q-avatar color="primary" text-color="white">
          {{ contact.name.toUpperCase().substring(0,1) }}
        </q-avatar>
      </q-item-section>

      <q-item-section>
        <q-item-label>{{ contact.name }}</q-item-label>
        <q-item-label caption lines="1">{{ contact.email }}</q-item-label>
      </q-item-section>

      <q-item-section side>
        <q-icon name="chat_bubble" color="green" />
      </q-item-section>
    </q-item>
  
    <q-separator />

    <!-- OFLINE MODE -->
    <!-- <q-item-label header>Offline</q-item-label> -->

    <!-- <q-item v-for="contact in offline" :key="contact.id" class="q-mb-sm" clickable v-ripple>
      <q-item-section avatar>
        <q-avatar>
          <img :src="`https://cdn.quasar.dev/img/${contact.avatar}`">
        </q-avatar>
      </q-item-section>

      <q-item-section>
        <q-item-label>{{ contact.name }}</q-item-label>
        <q-item-label caption lines="1">{{ contact.email }}</q-item-label>
      </q-item-section>

      <q-item-section side>
        <q-icon name="chat_bubble" color="grey" />
      </q-item-section>
    </q-item> -->
  </q-list>
  </q-scroll-area>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'AdminMessage',
  props:{
      dark: Boolean,
      title: String,
  },
  data() {
    return {
      contacts:[]
    }
  },
  computed: mapGetters('admin', [
    'USER'
  ]),
  created() {
    // console.warn('vue MSG', this)
    this.$store.dispatch('dbs/FETCH_CONTACTS')
  },
}
</script>
