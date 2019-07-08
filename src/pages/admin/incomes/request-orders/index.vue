<template>
  <q-page padding class="page-index"  v-if="SHOW">
    <q-pull-to-refresh @refresh="TABLE.refresh" inline>
      <q-table ref="table" inline class="table-index" color="primary" :dark="LAYOUT.isDark"
        :title="TABLE.getTitle()"
        :data="TABLE.rowData"
        :columns="TABLE.columns"
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
                :options="CustomerOptions" filter clearable />
              <q-input class="col-12 col-sm-6 col-md-3" style="min-width:120px"
                stack-label label="Begin Date" 
                v-model="FILTERABLE.fill.begin_daterange.value" 
                type="date"
                dense hide-bottom-space 
                :dark="LAYOUT.isDark" />
              <q-input class="col-12 col-sm-6 col-md-3" style="min-width:120px"
                stack-label label="Until Date" 
                v-model="FILTERABLE.fill.until_daterange.value" 
                type="date" 
                dense hide-bottom-space
                :dark="LAYOUT.isDark" />
               

              <q-select class="col-12 col-md-6" 
                new-value-mode="add" use-chips use-input multiple hide-dropdown-icon
                dense input-debounce="0"
                name="filterable" 
                v-model="FILTERABLE.value" 
                placeholder="Searching..." 
                emit-value
                :dark="LAYOUT.isDark">

                <template slot="append">
                  <q-btn flat dense icon="search" color="secondary" @click="FILTERABLE.submit()"/>
                </template>
              </q-select> 
              
            </div>
          </table-header>
        </template>

        <!-- slot name syntax: body-cell-<column_name> -->
        <q-td slot="body-cell-prefix" slot-scope="rs" :props="rs" style="width:35px">
          <q-btn dense flat color="light" icon="description" :to="`${TABLE.resource.uri}/${rs.row.id}`"/>
          <q-btn dense flat color="light" icon="edit" :to="`${TABLE.resource.uri}/${rs.row.id}/edit`" :class="{'invisible': rs.row.is_relationship === true}" />
          <q-btn dense flat color="light" icon="delete" @click.native="TABLE.delete(rs.row)" :class="{'invisible': rs.row.is_relationship === true}" />
        </q-td>

        <q-td slot="body-cell-date" slot-scope="rs" :props="rs">
          <span v-if="rs.row.date"> {{ $app.moment(rs.row.date).format('DD/MM/YYYY') }}</span>
          <span v-else>-</span>
        </q-td>
        
        <q-td slot="body-cell-begin_date" slot-scope="rs" :props="rs">
          <span v-if="rs.row.begin_date"> {{ $app.moment(rs.row.begin_date).format('DD/MM/YY') }}</span>
          <span v-else>-</span>
        </q-td>

        <q-td slot="body-cell-until_date" slot-scope="rs" :props="rs">
          <span v-if="rs.row.until_date"> {{ $app.moment(rs.row.until_date).format('DD/MM/YY') }}</span>
          <span v-else>-</span>
        </q-td>

        <q-td slot="body-cell-created_at" slot-scope="rs" :props="rs">
          <span v-if="rs.row.created_at"> {{ $app.moment(rs.row.created_at).format('DD/MM/YY HH:mm') }}</span>
          <span v-else>-</span>
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
          begin_daterange: {
            value: null,
            type: 'date',
            transform: (value) => { return null }
          },
          until_daterange: {
            value: null,
            type: 'date',
            transform: (value) => { return null }
          }
        }
      },
      TABLE:{
        mode: 'index',
        resource:{
          api: '/api/v1/incomes/request-orders',
          uri: '/admin/incomes/request-orders',
        },
        columns: [
          { name: 'prefix', label: ''},
          { name: 'number', label: 'Number', field: 'number', align: 'left', sortable: true },
          { name: 'date', label: 'Date', align: 'center', field: 'date'},
          { name: 'customer_id', label: 'Customer', align: 'left', field: (row) => row.customer.name , sortable: true },
          { name: 'reference_number', label: 'No. Reference', field: 'reference_number', align: 'left', sortable: true },
          { name: 'begin_date', label: 'Begin Date', align: 'center', field: 'begin_date'},
          { name: 'until_date', label: 'Until Date', align: 'center', field: 'until_date'},
          // { name: 'interval_date', label: 'Interval Date', align: 'center'},
          { name: 'created_at', label: 'Create', align: 'center', sortable: true, field: 'created_at'},
        ]
      },
    }
  },
  created () {
    console.log('[PLAY] Request Orders created!')
    this.SHOW = false
    this.INDEX.load(
      () => {
        setTimeout(() => this.SHOW = true, 500);
      }
    )
  },
  computed: {
    CustomerOptions() {
      return (this.SHEET.customers.data.map(item => ({label: item.name, value: item.id})) || [])
    },
  }
}
</script>
