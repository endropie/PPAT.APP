<template>
  <q-page padding class="page-index"  v-if="SHOW">
    <q-pull-to-refresh :handler="TABLE.refresh" inline>
      <q-table  ref="table" class="table-index" color="primary" :dark="LAYOUT.isDark"
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
          <q-btn dense flat color="light" icon="edit"   :to="`${TABLE.resource.uri}/${rs.row.id}/edit`" />
          <q-btn dense flat color="light" icon="delete" @click.native="TABLE.delete(rs.row)" />

          <!-- Resource show -->
          <!-- <q-btn :to="`${TABLE.resource.uri}/${rs.row.id}`"  flat round color="light" size="sm" icon="menu" /> -->
        </q-td>
        
        <q-td slot="body-cell-enable" slot-scope="rs" :props="rs">
          <q-icon :name=" rs.row.enable ? `check`: `times`"></q-icon>
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
        mode: 'datagrid',
        show:false,
        resource:{
          api: '/api/v1/incomes/customers',
          uri: '/admin/incomes/customers',
        },
        columns: [
          { name: 'prefix', label: ''},
          
          { name: 'code', field: 'code', label: 'Intern code', align: 'left', sortable: true },
          { name: 'name', field: 'name', label: 'Name', align: 'left', sortable: true},
          { name: 'phone', label: 'Phone', field: 'phone', align: 'left'},
          { name: 'fax', label: 'Fax', field: 'fax', align: 'left', sortable: true },
          { name: 'email', label: 'Email', field: 'email', align: 'left', sortable: true },
          { name: 'enable', label: 'Enable', field: 'enable', align: 'left', sortable: true },
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
  created() {
    this.INDEX.load(
      // this calllback function!
    )
  }
}
</script>
