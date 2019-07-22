<template>
<div>
    <q-scroll-area v-if="!partnerID" 
      :style="`height:calc(100vh - ${($q.screen.lt.md ? 80 : 130)}px)`" 
      :content-style="{height: `calc(100vh - ${($q.screen.lt.md ? 80 : 130)}px)`}" >
      <q-list separator :dark="dark">
        <!-- Message header -->

          <!-- .......... -->
        
        <!-- Message Lastest -->
        <q-item v-for="(latest, index) in MessageLatest" :key="index"  
          clickable v-ripple @click="partnerID = latest.isme ? latest.to : latest.from">
          <q-item-section avatar>
            <q-avatar color="primary" text-color="white">
              <!-- {{ latest.name.toUpperCase().substring(0,1) }} -->
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label> 
              {{ latest.isme ? latest.user_to.name : latest.user_from.name }}
              </q-item-label>
            <q-item-label caption lines="1">{{ latest.text }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-badge color="lime">4</q-badge>
            <span>{{Math.floor(Math.random() * (24 - 1) + 1)}}:{{Math.floor(Math.random() * (60 - 10) + 10)}}</span>
          </q-item-section>
        </q-item>
      </q-list>
    </q-scroll-area>
    <q-list v-if="partnerID">
      <q-item  class="no-padding" >
        <q-btn dense flat align="left" icon="chevron_left" @click="partnerID = 0" class="float-right"/>
        <q-item-section avatar>
          <q-avatar color="primary" text-color="white">
            {{partnerID}}
            <!-- {{ message.from.toUpperCase().substring(0,1) }} -->
          </q-avatar>
        </q-item-section>
        <q-item-section>
          <q-item-label>{{UserPanel.name}}</q-item-label>
          <q-item-label caption lines="1">{{UserPanel.email}}</q-item-label>
        </q-item-section>
      </q-item>
        <!-- <q-item-section class="column reverse">   -->
        <q-scroll-area
          :style="`height:calc(100vh - ${($q.screen.lt.md ? 150 : 200)}px)`"  >  
          <div class="column reverse q-px-md">
            
            <q-chat-message v-for="(rs, index) in MESSAGES[partnerID].data" :key="index"
              :name="rs.name"
              :text="[rs.text]"
              :stamp="rs.stamp"
              :sent="rs.isme"
              :bg-color="rs.isme ? `blue-grey-2` : `amber-7`">

              <!-- <q-avatar slot="avatar" color="primary" text-color="white" 
                :class="rs.isme ? 'on-right' : 'on-left'">
                {{ rs.name.toUpperCase().substring(0,1) }}
              </q-avatar> -->
            <!-- {{rs}}   -->
            </q-chat-message>

          </div>
        </q-scroll-area>
          
        <!-- </q-item-section> -->
      <q-item  class="no-padding" >
        <q-input type="textarea" autogrow v-if="partnerID && isSended"

          class="fixed-bottom q-pa-xs"
          v-model="text"
          :dark="dark" color="lime-3" bg-color="lime-1"
          outlined dense>
          <q-btn slot="after" flat round icon="send" @click="sendMessage"></q-btn>
        </q-input>
      </q-item>
    </q-list>
      
        
</div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import gql from 'graphql-tag'
import { stat } from 'fs';

export default {
  name: 'AdminMessage',
  props:{
      dark: Boolean,
      title: String
  },
  apollo: {
    // messages: {
    //   deep: true,
    //   query: gql`
    //     query getMessages($where: WhereConstraints){ 
    //       messages(
    //         where: $where
    //       ) 
    //       { id, to, from, text, created_at, user_to{name}, user_from{name}}
    //   }`,
    //   variables() {
    //     return{
    //       where: {
    //         // ## RUNING 
    //         // OR:[
    //         //   {column: "to", value: this.USER.id},
    //         //   {column: "from", value: this.USER.id}
    //         // ]

    //         // ## FIX
    //         // OR:[
    //         //   {column: "to", value: this.USER.id, AND: {column:"to", value: (this.partnerID || 0)}},
    //         //   {column: "from", value: this.USER.id, AND: {column:"from", value: (this.partnerID || 0)}}
    //         // ]
            
    //         // ## FIX
    //         OR:[
    //           {column: "to", value: this.USER.id, AND: [{column:"to", value: (this.partnerID || 0)}]},
    //           {column: "from", value: this.USER.id, AND: [{column:"from", value: (this.partnerID || 0)}]}
    //         ]
    //       }
    //     }
    //   },
    // },
    
    
  },
  data() {
    return {
      partnerID: null,
      isSended: true, 
      text: ''
    }
  },
  watch: {
    'partnerID': 'setPanel'
  },
  computed: {
    ...mapGetters('admin', [
      'USER'
    ]),
    ...mapGetters('dbs', [
      'CONTACT',
      'MESSAGES',
    ]),
    UserPanel() {
      if (!this.CONTACT) return {}
      return this.CONTACT[this.partnerID]
    },
    MessageLatest() {
      if(!this.$store.state.dbs.messages) return []
      let data = Object.values(this.$store.state.dbs.messages)
      data = data.filter(msg=>{
        return msg.data.length > 0
      })
      .map(msg => {
        return {
          ...msg.data[0]
        }
      })
      console.warn('computed', data)
      
      return data 
    }
  },
  created() {
    this.$store.dispatch('dbs/FETCH_CONTACTS')
    // console.log('dbs.messages', this.$store.state.dbs.messages)
    // console.warn(this)
  },
  methods: {
    sendMessage() {

      console.warn('SEND', this.text, this.partnerID, this.USER.id)

      this.$apollo.mutate({
        // Query
        mutation: gql`mutation ($text: String!, $to: ID!, $from: ID!) {
          createMessage(text: $text, to: $to, from: $from) {
            id
            to
            from
            text
          }
        }`,
        // Parameters
        variables:{
          text: this.text,
          to: this.partnerID,
          from: this.USER.id
        },
        // Update the cache with the result
        // The query will be updated with the optimistic response
        // and then with the real result of the mutation
        update: (store, { data: { createMessage } }) => {
          // Read the data from our cache for this query.
          // const data = store.readQuery({ query: TAGS_QUERY })
          // console.log('update()->', createMessage, store)
          // Add our tag from the mutation to the end
          // data.tags.push(createMessage)
          // Write our data back to the cache.
          // store.writeQuery({ query: TAGS_QUERY, data })
        },
        optimisticResponse: {
          // // Optimistic UI
          // // Will be treated as a 'fake' result as soon as the request is made
          // // so that the UI can react quickly and the user be happy
          // __typename: 'Mutation',
          // addTag: {
          //   __typename: 'Message',
          //   id: -1,
          //   text: this.text,
          //   to: this.partnerID,
          //   from: this.USER.id,
          // },
        },
      }).then((data) => {
        // Result
        this.$store.commit('dbs/ADD_MESSAGE', {
          isme: true, 
          ...data.data.createMessage
        })
        this.text = ''
        // console.log(data)
      }).catch((error) => {
        // Error
        console.error(error)
      })
    },
    setPanel (partner = null) {
      // this.partnerID = partner
      // this.$apollo.queries.messages.refresh()
      // if (partner) this.$store.dispatch('dbs/FETCH_MESSAGE', {partner})
    }
  }
}
</script>
