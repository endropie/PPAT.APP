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
      :loading="TABLE.loading"
    >
      <template v-slot:top>
        <table-header hide-search
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

          <template slot="default">
            <div class="row q-pa-xs q-gutter-xs items-end">
              <q-select class="col-12" ref="filterable" 
                name="filterable" 
                add-icon=" " 
                dense
                v-model="FILLABEL.value" 
                fill-input
                use-chips
                use-input
                multiple

                placeholder="Searching..." 
                @add="FILTERABLE.setCreate" 
                @remove="FILTERABLE.setRemove">
                
              </q-select>
              <span class="col q-ml-xs q-pt-xs">
                <q-btn class="float-right" icon="search" label="Search" size="sm" color="secondary" right @click="FILTERABLE.submit()"/>
              </span>
            </div>

          </template>
        </table-header>
      </template>
      <template slot="top-right" slot-scope="props" :props="props">
        <div>
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

      <!-- slot name syntax: body-cell-<column_name> -->
      <q-td slot="body-cell-prefix" slot-scope="rs" :props="rs" style="width:35px">
        <q-btn dense flat color="light" icon="description" :to="`${TABLE.resource.uri}/${rs.row.id}`" />
        <q-btn dense flat color="light" icon="edit" :to="`${TABLE.resource.uri}/${rs.row.id}/edit`" />
        <q-btn dense flat color="light"  icon="delete" @click.native="TABLE.delete(rs.row)"/>
      </q-td>
      
      <q-td slot="body-cell-customer_id" slot-scope="rs" :props="rs">
        <span v-if="rs.row.customer"> {{ rs.row.customer.name }}</span>
        <span v-else>- undefined -</span>
      </q-td>
      <q-td slot="body-cell-item_id" slot-scope="rs" :props="rs">
        <span v-if="rs.row.item"> {{ rs.row.item.code }}</span>
        <span v-else>- undefined -</span>
      </q-td>
      <q-td slot="body-cell-work_order_id" slot-scope="rs" :props="rs">
        <span v-if="rs.row.work_order"> {{ rs.row.work_order.number }}</span>
        <span v-else>- undefined -</span>
      </q-td>
      <q-td slot="body-cell-shift_id" slot-scope="rs" :props="rs">
        <span v-if="rs.row.shift"> {{ rs.row.shift.name }}</span>
        <span v-else>- undefined -</span>
      </q-td>
      <q-td slot="body-cell-type_fault_id" slot-scope="rs" :props="rs">
        <span v-if="rs.row.type_fault"> {{ rs.row.type_fault.name }}</span>
        <span v-else>- undefined -</span>
      </q-td>
      <q-td slot="body-cell-worktime" slot-scope="rs" :props="rs">
        <span v-if="rs.row.worktime"> {{ rs.row.worktime }}</span>
        <span v-else>- undefined -</span>
      </q-td>
      <q-td slot="body-cell-date" slot-scope="rs" :props="rs">
        <span v-if="rs.row.date"> {{ $app.moment(rs.row.date).format('DD/MM/YYYY') }}</span>
        <span v-else>--</span>
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
          api: '/api/v1/factories/packings',
          uri: '/admin/factories/packings',
        },
        columns: [
          { name: 'prefix', label: ''},
          
          { name: 'number', label: 'Number', field: 'number', align: 'left', sortable: true },
          { name: 'customer_id', label: 'Customer', field: 'customer_id', align: 'left', sortable: true },
          { name: 'item_id', label: 'Item code', field: 'item_id', align: 'left', sortable: true },
          { name: 'work_order_id', label: 'Work-Order', align: 'left', sortable: true, 
            field: rs => rs.packing_items.work_order_item_id },
          { name: 'date', label: 'Date', field: 'date', align: 'left', sortable: true},
          { name: 'time', label: 'Time', field: 'time', align: 'left', sortable: true},
          { name: 'shift_id', label: 'Shift', field: 'shift_id', align: 'left'},
          { name: 'worktime', label: 'Worktime', field: 'worktime', align: 'left', sortable: true },
          { name: 'type_fault_id', label: 'Fault type', field: 'type_fault_id', align: 'left', sortable: true },
        ]
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
