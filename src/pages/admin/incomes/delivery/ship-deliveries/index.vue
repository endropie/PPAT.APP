<template>
  <q-page padding class="page-index"  v-if="SHOW">
    <q-pull-to-refresh :handler="TABLE.refresh" inline>
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

        <template slot="top-left" slot-scope="props" :props="props">
          <div>
            <div class="row q-pa-xs q-gutter-xs">
              <q-field class="col-auto" style="width:200px">
                <q-select name="customer_id" v-model="FILTERABLE.fill.customer_id.value" stack-label label="Customer"
                  :options="CustomerOptions" filter />
              </q-field>
              <q-field class="col">
                <q-input stack-label label="Begin Date" v-model="FILTERABLE.fill.date_start.value" type="date" />
              </q-field>
              <q-field class="col">
                <q-input stack-label label="Until Date" v-model="FILTERABLE.fill.date_end.value" type="date" />
              </q-field>
            </div>
            <div class="row q-pa-xs q-gutter-xs items-end">
              <q-field class="col-12" ref="filterable" label-width="1">
                <q-chips-input name="filterable" add-icon=" " :value="FILLABEL.value" placeholder="Searching..."  color="blue-grey-5"
                  @add="FILTERABLE.setCreate" @remove="FILTERABLE.setRemove">
                  <q-popover anchor="bottom right" self="top right" fit no-focus no-refocus >
                    <!-- component Field -->
                  </q-popover>
                </q-chips-input>
              </q-field>
              <span class="col q-ml-xs q-pt-xs">
                <q-btn class="float-right" icon="search" label="Search" size="sm" color="secondary" right @click="FILTERABLE.submit()"/>
              </span>
            </div>
          </div>
        </template>

        <template slot="body" slot-scope="rs">
          <tr rs="rs">
            <!-- slot name syntax: body-cell-<column_name> -->
            <q-td slot="body-cell-prefix"  style="width:35px">
              <q-btn dense flat color="light" icon="description" :to="`${TABLE.resource.uri}/${rs.row.id}`" />
            </q-td>
            <q-td>
              {{ rs.row.number }}
              <q-checkbox color="primary" v-model="rs.expand" checked-icon="remove" unchecked-icon="add" class="q-mr-md" />
            </q-td>
            <q-td>
              <span v-if="rs.row.customer"> {{ rs.row.customer.name }}</span>
              <span v-else>- undifined -</span>
            </q-td> 
            <q-td>
              <span v-if="rs.row.operator"> {{ rs.row.operator.name }}</span>
              <span v-else>- undifined -</span>
            </q-td>
            <q-td>
              {{ rs.row.date }}
            </q-td>
            <q-td>
              {{ rs.row.time }}
            </q-td>
            <q-td>
              {{ rs.row.due_date }}
            </q-td>
            <q-td>
              {{ rs.row.due_time }}
            </q-td>
          </tr>
          
          <q-tr v-show="rs.expand" :rs="rs">
            <q-td>&nbsp;</q-td>
            <q-td colspan="100%" class="group">
              <template v-for="(link, index) in rs.row.delivery_orders">
                <q-btn dense color="secondary" icon="open_in_new" :to="TABLE.resource.delivery_orders +'/'+link.id" :key="index">
                  {{link.number}} {{ link.numrev ? ' - REV.' + link.numrev : '' }}
                </q-btn> 
              </template>

              
            </q-td>
          </q-tr>
        </template>
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
          date_start: {
            value: null,
            type: 'date',
            transform: (value) => { return null }
          },
          date_end: {
            value: null,
            type: 'date',
            transform: (value) => { return null }
          }
        }
      },
      TABLE:{
        mode: 'index',
        resource:{
          api: '/api/v1/incomes/ship-deliveries',
          uri: '/admin/incomes/delivery/ship-deliveries',
          delivery_orders: '/admin/incomes/delivery/delivery-orders',
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
  },
  methods: {
    toggleExpanded(rs) {
      this.TABLE.rowData[rs.row.__index].expanded = !rs.row.expanded
      console.log('click', rs, this.TABLE.rowData[rs.row.__index].expanded)
    }
    //  Code here..
  },
}
</script>
