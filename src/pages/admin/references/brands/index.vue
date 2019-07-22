<template>
  <q-page padding class="page-index" v-if="SHOW">
    <q-pull-to-refresh @refresh="TABLE.refresh" inline>
      <q-table ref="table" class="table-index" :dark="LAYOUT.isDark"
        color="primary"
        :title="TABLE.getTitle()"
        :data="TABLE.rowData"
        :columns="TABLE.columns"
        :filter="TABLE.filter"
        selection="none" 
        :selected.sync="TABLE.selected"
        row-key="id"
        :pagination.sync="TABLE.pagination"
        @request="TABLE.compute"
        :loading="TABLE.loading">

        <template v-slot:top>
          <table-header
            :title="TABLE.getTitle()"
            :TABLE.sync="TABLE"
            :filter.sync="TABLE.filter"
          >
            <template v-slot:menu-item>
              <q-item clickable v-close-popup :to="`${TABLE.resource.uri}/create`" class="vertical-middle">
                <q-item-section>Add new</q-item-section>
                <q-item-section avatar><q-icon name="add_circle" color="light"/></q-item-section>
              </q-item>
              <q-separator :dark="LAYOUT.isDark"/>
            </template>
          </table-header>
        </template>
        <!-- slot name syntax: body-cell-<column_name> -->
        <q-td slot="body-cell-prefix" slot-scope="rs" :props="rs" style="width:35px">
          <q-btn v-if="isCanUpdate"
            dense flat color="light" icon="edit" 
            :to="`${TABLE.resource.uri}/${rs.row.id}/edit`" />
          <q-btn v-if="isCanDelete" 
            dense flat color="light" icon="delete"
            @click.native="TABLE.delete(rs.row)" />
        </q-td>
      </q-table>
    </q-pull-to-refresh>
    <q-input v-model="partnerID" label="partner" />
    <q-input v-model="userID" label="partner" />
    <apollo-query
      :query="QUE" 
      :variables="{
        user: userID,
        partner: partnerID
      }"
    >
      <template v-slot="{ result: { error, data }, isLoading }">
        <!-- Loading -->
        <div v-if="isLoading" class="loading apollo">Loading...</div>

        <!-- Error -->
        <div v-else-if="error" class="error apollo">An error occurred</div>

        <!-- Result -->
        <div v-else-if="data" class="result apollo">{{ data }}</div>

        <!-- No result -->
        <div v-else class="no-result apollo">No result :(</div>
      </template>
    </apollo-query>
  </q-page>
</template>

<script>
import MixIndex from '@/mixins/mix-index.vue'
import gql from 'graphql-tag'

const QUE = gql`
        query nodeMessages($user: ID, $partner:ID){
          messages
          (
            user: $user
            partner: $partner
          )
          {
            id to from
            text
          }
        }
      `
export default {
  mixins: [MixIndex],
  data () {
    return {
      QUE: QUE,
      userID: 1,
      partnerID: 2,
      name: '',
      TABLE: {
        show:false,
        resource:{
          api: '/api/v1/references/brands',
          uri: '/admin/references/brands',
        },
        columns: [
          { name: 'prefix', label: ''},
          { name: 'code', field: 'code', label: 'Intern code', align: 'left', sortable: true},
          { name: 'name', field: 'name', label: 'Brand', align: 'left', sortable: true},
          { name: 'description', field: 'description', label: 'Description', align: 'left'},
        ],
        rowData:[],
        resData:[],
        pagination : {
          page: 1,
          rowsPerPage: 10,
          rowsNumber: 10 // specifying this determines pagination is server-side,
        },
        filter: '',
        selected: [
          // initial selection => { id: 5 }
        ],
        loading: false,
      },
    }
  },
  computed:{
    
    comBetween(){
      return {
        sender: this.UserID, 
        receiver: this.partnerID
      }
    },
    isCanUpdate(){
      return this.$app.can('brands-update')
    },
    isCanDelete(){
      return this.$app.can('brands-delete')
    },
  },
  mounted () {
    // Page Component mounted!  
    this.INDEX.load()
    console.info(this)
  },
  methods:{
  }
}
</script>
