<template>
  <q-page padding class="page-index"  v-if="SHOW">
    <q-pull-to-refresh :handler="TABLE.refresh" inline>
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

        <template slot="top-right" slot-scope="props" :props="props">
          <div>
            <div class="row q-pa-xs q-gutter-xs">
              <q-field class="col-auto">
                <q-select name="customer_id" v-model="FILTERABLE.fill.customer_id.value" stack-label label="Customer"
                  :dark="LAYOUT.isNighMode"
                  :options="CustomerOptions" filter clearable/>
              </q-field>
              <q-field class="col">
                <q-input stack-label label="Begin date" v-model="FILTERABLE.fill.begin_daterange.value" type="date" :dark="LAYOUT.isNighMode"/>
              </q-field>
              <q-field class="col">
                <q-input stack-label label="Until date" v-model="FILTERABLE.fill.until_daterange.value" type="date" :dark="LAYOUT.isNighMode" />
              </q-field>
            </div>
            <div class="row q-pa-xs q-gutter-xs items-end">
              <q-field class="col col-auto col-auto" ref="filterable" label-width="1" label-right>
                <q-chips-input name="filterable" :value="FILLABEL.value" placeholder="Searching..." 
                  :dark="LAYOUT.isNighMode"
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
