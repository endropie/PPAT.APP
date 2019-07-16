<template>
  <q-page padding class="page-index"  v-if="SHOW">
    <q-pull-to-refresh @refresh="TABLE.refresh" inline>
      <q-table ref="table" inline class="table-index" color="primary" :dark="LAYOUT.isDark"
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
            :filter.sync="TABLE.filter"
              >

            <template v-slot:menu-item>
              <q-item clickable v-close-popup :to="`${TABLE.resource.uri}/create`" class="vertical-middle">
                <q-item-section>Add new</q-item-section>
                <q-item-section avatar><q-icon name="add_circle" color="light"/></q-item-section>
              </q-item>
              <q-separator :dark="LAYOUT.isDark"/>
            </template>

            <div class="row q-col-gutter-xs" >
              <select-filter class="col-12 col-sm-12 col-md-6" style="min-width:150px"
                name="line_id" 
                v-model="FILTERABLE.fill.line_id.value" 
                stack-label label="Line" 
                dense hide-bottom-space
                :dark="LAYOUT.isDark"
                :options="LineOptions" filter clearable />
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
                multiple use-chips use-input new-value-mode="add"
                dense hide-dropdown-icon
                name="filterable" 
                v-model="FILTERABLE.search" emit-value
                placeholder="Searching..." 
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
          <q-btn v-if="isCanUpdate" dense flat color="light" icon="edit" :to="`${TABLE.resource.uri}/${rs.row.id}/edit`" />
          <q-btn v-if="isCanDelete" dense flat color="light"  icon="delete" @click.native="TABLE.delete(rs.row)" />
        </q-td>
        
        <q-td slot="body-cell-customer_id" slot-scope="rs" :props="rs">
          <span v-if="rs.row.customer"> {{ rs.row.customer.name }}</span>
          <span v-else>- undifined -</span>
        </q-td>

        <q-td slot="body-cell-start_date" slot-scope="rs" :props="rs">
          <!-- {{ rs.row.work_order_items }} -->
          <span v-if="rs.row.work_order_items"> {{ rs.row.work_order_items.start_date }}</span>
          <span v-else>- undifined -</span>
        </q-td>

        <q-td slot="body-cell-end_date" slot-scope="rs" :props="rs">
          <!-- {{ rs.row.work_order_items }} -->
          <span v-if="rs.row.work_order_items"> {{ rs.row.work_order_items.end_date }}</span>
          <span v-else>- undifined -</span>
        </q-td>

        <q-td slot="body-cell-item_id" slot-scope="rs" :props="rs">
          <!-- {{ rs.row.work_order_items }} -->
          <span v-if="rs.row.work_order_items"> {{ rs.row.work_order_items.item.code || 'undifined' }}</span>
          <span v-else>- undifined -</span>
        </q-td>

        <q-td slot="body-cell-part_number" slot-scope="rs" :props="rs">
          <!-- {{ rs.row.work_order_items }} -->
          <span v-if="rs.row.work_order_items"> {{ rs.row.work_order_items.item.part_number || 'undifined' }}</span>
          <span v-else>- undifined -</span>
        </q-td>
        
        <q-td slot="body-cell-part_name" slot-scope="rs" :props="rs">
          <!-- {{ rs.row.work_order_items }} -->
          <span v-if="rs.row.work_order_items"> {{ rs.row.work_order_items.item.part_name || 'undifined' }}</span>
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
        lines: {data:[], api:'/api/v1/references/lines?mode=all'}
      },
      FILTERABLE: {
        fill: {
          line_id: {
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
          api: '/api/v1/factories/work-orders',
          uri: '/admin/factories/work-orders',
        },
        columns: [
          { name: 'prefix', label: ''},
          
          { name: 'number', label: 'Number', field: 'number', align: 'left', sortable: true },
          { name: 'line_id', label: 'Line', field: (rs)=> rs.line.name , align: 'left', sortable: true },
        ]
      },
    }
  },
  created () {
    this.INDEX.load()
  },
  computed: {
    isCanUpdate(){
      return this.$app.can('work-orders-update')
    },
    isCanDelete(){
      return this.$app.can('work-orders-delete')
    },
    LineOptions() {
      return (this.SHEET.lines.data.map(item => ({label: item.name, value: item.id})) || [])
    },
  },
  methods: {
    //  Code here..
  },
}
</script>
