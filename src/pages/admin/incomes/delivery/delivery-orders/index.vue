<template>
  <q-page padding class="page-index"  v-if="SHOW">
    <q-pull-to-refresh @refresh="TABLE.refresh" inline>
      <q-table ref="table" inline class="table-index" color="primary" :dark="LAYOUT.isDark"
        :title="TABLE.getTitle()"
        subtitle="cskc"
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

            <div class="row q-col-gutter-xs" >
              <select-filter class="col-12 col-md-6" style="min-width:150px"
                name="customer_id" 
                v-model="FILTERABLE.fill.customer_id.value" 
                stack-label label="Line" 
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

        <!-- <q-chips-input name="filterable" add-icon=" " :value="FILLABEL.value" placeholder="Searching..."  color="blue-grey-5"
          @add="FILTERABLE.setCreate" @remove="FILTERABLE.setRemove">
          <q-popover anchor="bottom right" self="top right" fit no-focus no-refocus >
            
          </q-popover>
        </q-chips-input> -->

        <!-- slot name syntax: body-cell-<column_name> -->
        <template slot="body-cell-prefix" slot-scope="rs" :props="rs" style="width:35px">
          <q-btn dense flat color="light" icon="description" :to="`${TABLE.resource.uri}/${rs.row.id}`" />
          <!-- <q-btn dense flat color="light" icon="delete" @click.native="TABLE.delete(rs.row)" :class="{'invisible': rs.row.is_relationship === true}" /> -->
        </template>
        
        <q-td slot="body-cell-customer_id" slot-scope="rs" :props="rs">
          <span v-if="rs.row.customer"> {{ rs.row.customer.name }}</span>
          <span v-else>- undifined -</span>
        </q-td>

        <q-td slot="body-cell-number" slot-scope="rs" :props="rs">
          <span v-if="rs.row.number" class="text-weight-medium" :class="{'text-strike text-faded': rs.row.revise_id}"> {{ rs.row.number }} {{ rs.row.numrev ? ' - REV.' + rs.row.numrev : '' }}</span>
          <span v-else>- undifined -</span>
        </q-td>

        <q-td slot="body-cell-operator_id" slot-scope="rs" :props="rs">
          <span v-if="rs.row.operator"> {{ rs.row.operator.name }}</span>
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
      TABLE: {
        mode: 'index',
        resource:{
          api: '/api/v1/incomes/delivery-orders',
          uri: '/admin/incomes/delivery/delivery-orders',
        },
        columns: [
          { name: 'prefix', label: ''},
          
          { name: 'number', label: 'Number', field: 'number', align: 'left', sortable: true },
          { name: 'customer_id', label: 'Customer', field: 'customer_id', align: 'left', sortable: true },
          // { name: 'vehicle_id', label: 'Vehicle', field: 'vehicle_id', align: 'left', sortable: true },
          { name: 'operator_id', label: 'Operator', field: 'operator_id', align: 'left', sortable: true },
          { name: 'date', label: 'Ship date', field: 'date', align: 'left', sortable: true},
          { name: 'time', label: 'Ship time', field: 'time', align: 'left', sortable: true},
          { name: 'due_date', label: 'Due date', field: 'due_date', align: 'left', sortable: true},
          { name: 'due_time', label: 'Due time', field: 'due_time', align: 'left', sortable: true},
          
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
  created () {

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
  },
  methods: {
    //  Code here..
  },
}
</script>
