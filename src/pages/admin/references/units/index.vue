<template>
  <q-page padding class="page-index"  v-if="SHOW">
    <q-pull-to-refresh :handler="TABLE.refresh" inline>
      <q-table  ref="table" class="table-index" :dark="LAYOUT.isDark"
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
            :filter.sync="TABLE.filter">
            <template v-slot:menu-item>
              <q-item clickable v-close-popup :to="`${TABLE.resource.uri}/create`" class="vertical-middle">
                <q-item-section>Add new</q-item-section>
                <q-item-section avatar><q-icon name="add_circle"/></q-item-section>
              </q-item>
              <q-separator :dark="LAYOUT.isDark" />
            </template>
          </table-header>
        </template>
        
        <!-- slot name syntax: body-cell-<column_name> -->
        <q-td slot="body-cell-prefix" slot-scope="rs" :props="rs" style="width:35px">
          <q-btn dense flat color="light" icon="edit"   :to="`${TABLE.resource.uri}/${rs.row.id}/edit`"  />
          <q-btn dense flat color="light" icon="delete" @click.native="TABLE.delete(rs.row)"  />
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
        resource: {
          api: '/api/v1/references/units',
          uri: '/admin/references/units',
        },
        columns: [
          { name: 'prefix', label: ''},
          { name: 'code', field: 'code', label: 'Intern code', align: 'left', sortable: true},
          { name: 'name', field: 'name', label: 'Unit', align: 'left', sortable: true},
        ]
      },
    }
  },
  created () {
    // Page Component mounted!  
    this.SHOW = false
    this.INDEX.load(
      () => {
        setTimeout(() => this.SHOW = true, 500);
      }
    )
  }
}
</script>
