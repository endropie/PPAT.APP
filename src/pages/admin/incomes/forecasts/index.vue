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
          <q-search hide-underline v-model="TABLE.filter" slot="right" :dark="LAYOUT.isDark"/>
        </template>

        <!-- slot name syntax: body-cell-<column_name> -->
        <q-td slot="body-cell-prefix" slot-scope="rs" :props="rs" style="width:35px">
          <q-btn dense flat color="light" icon="edit"   :to="`${TABLE.resource.uri}/${rs.row.id}/edit`" />
          <q-btn dense flat color="light" icon="delete" @click.native="TABLE.delete(rs.row)" />

          <!-- Resource show -->
          <!-- <q-btn :to="`${TABLE.resource.uri}/${rs.row.id}`"  flat round color="light" size="sm" icon="menu" /> -->
        </q-td>
        
        <q-td slot="body-cell-customer_id" slot-scope="rs" :props="rs">
          <span v-if="rs.row.customer"> {{ rs.row.customer.name }}</span>
          <span v-else>- undifined -</span>
        </q-td>

        <q-td slot="body-cell-begin_date" slot-scope="rs" :props="rs">
          <span v-if="rs.row.begin_date"> {{ $app.moment(rs.row.begin_date).format('DD/MM/YY') }}</span>
          <span v-else>- undifined -</span>
        </q-td>

        <q-td slot="body-cell-until_date" slot-scope="rs" :props="rs">
          <span v-if="rs.row.until_date"> {{ $app.moment(rs.row.until_date).format('DD/MM/YY') }}</span>
          <span v-else>- undifined -</span>
        </q-td>

        <q-td slot="body-cell-interval_date" slot-scope="rs" :props="rs">
          <span> 
            {{ rs.row.begin_date ? $app.moment(rs.row.begin_date).format('DD/MM/YY') : 'undefined'}} - 
            {{ rs.row.until_date ? $app.moment(rs.row.until_date).format('DD/MM/YY') : 'undefined'}}
          </span>
        </q-td>

        <q-td slot="body-cell-created_date" slot-scope="rs" :props="rs">
          <span v-if="rs.row.created_at"> {{ $app.moment(rs.row.created_at).format('DD/MM/YYYY') }}</span>
          <span v-else>- undifined -</span>
        </q-td>

        <q-td slot="body-cell-created_time" slot-scope="rs" :props="rs">
          <span v-if="rs.row.created_at"> {{ $app.moment(rs.row.created_at).format('HH:mm') }}</span>
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
      TABLE: {
        mode: 'index',
        resource:{
          api: '/api/v1/incomes/forecasts',
          uri: '/admin/incomes/forecasts',
        },
        columns: [
          { name: 'prefix', label: ''},
          
          { name: 'number', label: 'Number', field: 'number', align: 'left', sortable: true },
          { name: 'customer_id', label: 'Customer', field: 'customer_id', align: 'left', sortable: true },
          { name: 'begin_date', label: 'Begin Date', field: 'begin_date', align: 'center'},
          { name: 'until_date', label: 'Until Date', field: 'until_date', align: 'center'},
          { name: 'created_date', label: 'Date', field: 'created_at', align: 'center', sortable: true},
          { name: 'created_time', label: 'Time', field: 'created_at', align: 'center'},
          
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
  }
}
</script>
