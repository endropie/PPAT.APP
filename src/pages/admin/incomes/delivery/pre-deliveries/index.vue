<template>
  <q-page padding class="page-index"  v-if="SHOW">
    <q-pull-to-refresh @refresh="TABLE.refresh" inline>
      <q-table ref="table" inline class="table-index" color="primary" :dark="LAYOUT.isDark"
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

        <!-- Table Header -->
        <template v-slot:top>
          <table-header hide-search
            :title="TABLE.getTitle()"
            :TABLE.sync="TABLE"
            :filter.sync="TABLE.filter" >

            <template v-slot:menu-item>
              <q-item clickable v-close-popup :to="`${TABLE.resource.uri}/create`" class="vertical-middle">
                <q-item-section>Add new</q-item-section>
                <q-item-section avatar><q-icon name="add_circle" color="light"/></q-item-section>
              </q-item>
              <q-separator :dark="LAYOUT.isDark"/>
            </template>

            <div class="row q-col-gutter-xs" >
              <select-filter class="col-12 col-md-6" style="min-width:150px"
                name="customer_id" 
                v-model="FILTERABLE.fill.customer_id.value" 
                stack-label :label="$tc('general.customer')" 
                dense hide-bottom-space
                :dark="LAYOUT.isDark"
                :options="CustomerOptions" clearable />
              <q-input class="col-12 col-sm-6 col-md-3" style="min-width:120px"
                stack-label label="Begin Date" 
                v-model="FILTERABLE.fill.begin_date.value" 
                type="date"
                dense hide-bottom-space 
                :dark="LAYOUT.isDark" />
              <q-input class="col-12 col-sm-6 col-md-3" style="min-width:120px"
                stack-label label="Until Date" 
                v-model="FILTERABLE.fill.until_date.value" 
                type="date" 
                dense hide-bottom-space
                :dark="LAYOUT.isDark" />
               

              <q-select class="col-12" 
                new-value-mode="add" use-chips use-input multiple hide-dropdown-icon
                dense input-debounce="0"
                name="filterable" 
                v-model="FILTERABLE.search" 
                placeholder="Searching..." 
                emit-value
                :dark="LAYOUT.isDark">

                <template slot="append">
                  <q-btn flat dense icon="search" color="secondary" @click="FILTERABLE.submit"/>
                </template>
              </q-select> 
              
            </div>
          </table-header>
        </template>

        <!-- slot name syntax: body-cell-<column_name> -->
        <q-td slot="body-cell-prefix" slot-scope="rs" :props="rs" style="width:35px">
          <q-btn dense flat color="light" icon="description" :to="`${TABLE.resource.uri}/${rs.row.id}`" />
          <q-btn dense flat color="light" icon="edit"   :to="`${TABLE.resource.uri}/${rs.row.id}/edit`" :class="{'hidden': rs.row.is_relationship === true}" />
          <q-btn dense flat color="light" icon="delete" @click.native="TABLE.delete(rs.row)" :class="{'hidden': rs.row.is_relationship === true}" />
        </q-td>
        
        <q-td slot="body-cell-number" slot-scope="rs" :props="rs" style="width:35px">
          <span> {{ rs.row.number }} </span>
          <q-chip dense tag class="bg-red-10 text-white"  :label="rs.row.status" v-if="rs.row.status !== 'OPEN' "/>
        </q-td>

        <q-td slot="body-cell-customer_id" slot-scope="rs" :props="rs">
          <span v-if="rs.row.customer"> {{ rs.row.customer.name }}</span>
          <span v-else>- undifined -</span>
        </q-td>

      </q-table>
    </q-pull-to-refresh>

    
  </q-page>
</template>

<script>
import MixIndex from '@/mixins/mix-index.vue'

export default {
  mixins: [MixIndex],
  data () {
    return {
      SHEET: {
        customers: {data:[], api:'/api/v1/incomes/customers?mode=all'}
      },
      FILTERABLE: {
        fill: {
          customer_id: {
            value: null,
            type: 'integer',
            transform: (value) => { return null }
          },
          begin_date: {
            value: null,
            type: 'date',
            transform: (value) => { return null }
          },
          until_date: {
            value: null,
            type: 'date',
            transform: (value) => { return null }
          }
        }
      },
      TABLE:{
        mode: 'index',
        resource:{
          api: '/api/v1/incomes/pre-deliveries',
          uri: '/admin/incomes/delivery/pre-deliveries',
        },
        columns: [
          { name: 'prefix', label: '', align: 'left'},
          { name: 'number', label: 'Number', field: 'number', align: 'left', sortable: true },
          { name: 'customer_id', label: 'Customer', field: 'customer_id', align: 'left', sortable: true },
          { name: 'trans_qty', label: 'Tran Qty', field: 'trans_qty', align: 'center', sortable: true },
          { name: 'date', label: 'Date', field: 'date', align: 'left', sortable: true},
          { name: 'time', label: 'Time', field: 'time', align: 'left'},
          { name: 'plan_date', label: 'Plan Date', field: 'plan_date', align: 'left', sortable: true},
          { name: 'plan_time', label: 'Plan Time', field: 'plan_time', align: 'left', sortable: true},
          
        ]
      },
    }
  },
  created () {
    this.INDEX.load()
  },
  computed: {
    CustomerOptions() {
      return (this.SHEET.customers.data.map(item => ({label: item.name, value: item.id})) || [])
    },
  },
}
</script>
