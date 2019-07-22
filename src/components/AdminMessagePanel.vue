<template>
  <!-- <q-scroll-area :style="`height:calc(100vh - ${($q.screen.lt.md ? 80 : 130)}px)`" > -->
  <div 
    v-bind="$attrs"
    v-on="$listeners"
  >value{{$attrs.value}}
    <q-list :class="{hidden:!$attrs.value}">
      tampil
      <q-item  class="no-padding" >
        <q-btn dense flat icon="chevron_left" @click="setclose" class="on-right"/>
        <q-item-section avatar>
          <q-avatar color="primary" text-color="white">
            <!-- {{ message.from.toUpperCase().substring(0,1) }} -->
          </q-avatar>
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ 'message.user_from.name' }}</q-item-label>
        </q-item-section>
      </q-item>
      <q-item class="fit" clickable >
        <q-item-section>  
          <q-chat-message v-for="(rs, index) in MessageList[value]" :key="index"
            :name="rs.name"
            :avatar="rs.avatar"
            :text="rs.text"
            :stamp="rs.stamp"
            :sent="rs.isme"
            :bg-color="rs.isme ? `blue-grey-2` : `amber-7`">
          
            <q-avatar slot="avatar" color="primary" text-color="white" 
              :class="rs.isme ? 'on-right' : 'on-left'">
              {{ rs.name.toUpperCase().substring(0,1) }}
            </q-avatar>
            
          </q-chat-message>
        </q-item-section>
      </q-item>
    </q-list>
  </div>
  <!-- </q-scroll-area> -->
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import gql from 'graphql-tag'

export default {
  name: 'AdminMessage',
  props:{
      dark: Boolean,
      invited: Number,
  },
  apollo: {
    messages: {
      deep: true,
      query: gql`
        query getMessages($where: WhereConstraints){ 
          messages(
            where: $where
          ) 
          { id, to, from, text, created_at, user_to{name}, user_from{name}}
      }`,
      variables() {
        return{
          where: {
            // ## RUNING 
            OR:[
              {column: "to", value: this.USER.id},
              {column: "from", value: this.USER.id}
            ]

            // ## FIX
            // OR:[
            //   {column: "to", value: this.USER.id, AND: {column:"to", value: (this.value || 0)}},
            //   {column: "from", value: this.USER.id, AND: {column:"to", value: (this.value || 0)}}
            // ]
            
            // ## FIX
            // OR:[
            //   {column: "to", value: this.USER.id, AND: [{column:"to", value: (this.value || 0)}]},
            //   {column: "from", value: this.USER.id, AND: [{column:"to", value: (this.value || 0)}]}
            // ]
          }
        }
      },
    },
    
    
  },
  data() {
    return {
      allContacts: [],
      messages: [],
      value: this.$attrs.value,
      onUser: {}, 
    }
  },
  computed: {
    ...mapGetters('admin', [
      'USER'
    ]),
    MessageList() {
      console.log('computed->MesageList', this.messages)
      if (this.messages.length == 0 ) return []

      let data = this.messages.map(msg => {
        console.log('computed->fectmessage', msg)
        // (msg.from === this.USER.id)
        return {
          from: msg.from,
          name: 'name'+msg.from,
          avatar: msg.from,
          text: [msg.text],
          stamp: '22:22',
          isme: msg.from == this.USER.id
        }
      })
      
      return this.$_.groupBy(data, "from")
    }
  },
  created() {
    // console.log('C', this.$_)
  },
  methods: {
    setClose () {
      this.value = null
      this.$attrs.value = null
      // this.$apollo.queries.messages.refresh()
    }
  }
}
</script>
