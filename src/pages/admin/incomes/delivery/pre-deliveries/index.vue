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

        <template slot="top-right" slot-scope="props" :props="props">
          <q-search hide-underline v-model="TABLE.filter" slot="right"/>
        </template>

        <!-- slot name syntax: body-cell-<column_name> -->
        <q-td slot="body-cell-prefix" slot-scope="rs" :props="rs" style="width:35px">
          <q-btn dense flat color="light" icon="description" :to="`${TABLE.resource.uri}/${rs.row.id}`" />
          <q-btn dense flat color="light" icon="edit"   :to="`${TABLE.resource.uri}/${rs.row.id}/edit`" :class="{'invisible': rs.row.is_relationship === true}" />
          <q-btn dense flat color="light" icon="delete" @click.native="TABLE.delete(rs.row)" :class="{'invisible': rs.row.is_relationship === true}" />
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
      TABLE:{
        mode: 'index',
        resource:{
          api: '/api/v1/incomes/pre-deliveries',
          uri: '/admin/incomes/delivery/pre-deliveries',
        },
        columns: [
          { name: 'prefix', label: ''},
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
    // console.log('[PLAY] Pre Delivery created!')
    this.SHOW = false
    this.INDEX.load(
      () => {
        setTimeout(() => this.SHOW = true, 500);
      }
    )
  }
}
</script>
