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
                v-model="FILTERABLE.fill.date_start.value" 
                type="date"
                dense hide-bottom-space 
                :dark="LAYOUT.isDark" />
              <q-input class="col-12 col-sm-6 col-md-3" style="min-width:120px"
                stack-label label="Until Date" 
                v-model="FILTERABLE.fill.date_end.value" 
                type="date" 
                dense hide-bottom-space
                :dark="LAYOUT.isDark" />
              <q-select class="col-12" 
                
                new-value-mode="add" use-chips use-input multiple hide-dropdown-icon
                input-debounce="0"
                name="filterable" 
                v-model="FILLABEL.value" 
                placeholder="Searching..." 
                emit-value
                :dark="LAYOUT.isDark" 
                >
                <template slot="append">
                  <q-btn flat dense icon="search" color="secondary" @click="FILTERABLE.submit()"/>
                </template>
              </q-select>
              
            </div>
          </table-header>
        </template>
       
        <!-- slot name syntax: body-cell-<column_name> -->
        <q-td slot="body-cell-prefix" slot-scope="rs" :props="rs" style="width:35px">
          <q-btn flat dense color="light" icon="description" :to="`${TABLE.resource.uri}/${rs.row.id}`" />
          <q-btn flat dense color="light" icon="edit" :to="`${TABLE.resource.uri}/${rs.row.id}/edit`" />
          <q-btn flat dense color="light" icon="delete" @click.native="TABLE.delete(rs.row)" />
        </q-td>
        
        <q-td slot="body-cell-line_id" slot-scope="rs" :props="rs">
          <span v-if="rs.row.line"> {{ rs.row.line.name }}</span>
          <span v-else>- undefined -</span>
        </q-td>

        <q-td slot="body-cell-shift_id" slot-scope="rs" :props="rs">
          <span v-if="rs.row.line"> {{ rs.row.shift.name }}</span>
          <span v-else>- undefined -</span>
        </q-td>

        <q-td slot="body-cell-date" slot-scope="rs" :props="rs">
          <span v-if="rs.row.date"> {{ $app.moment(rs.row.date).format('DD/MM/YYYY') }}</span>
          <span v-else>--</span>
        </q-td>
        
        <q-td slot="body-cell-worktime" slot-scope="rs" :props="rs">
          <span v-if="rs.row.worktime"> {{ rs.row.worktime }}</span>
          <span v-else>- undefined -</span>
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
      TABLE: {
        mode: 'index',
        resource:{
          api: '/api/v1/factories/workin-productions',
          uri: '/admin/factories/workin-productions',
        },
        columns: [
          { name: 'prefix', label: ''},
          
          { name: 'number', label: 'Number', field: 'number', align: 'left', sortable: true },
          { name: 'line_id', label: 'Line production', field: 'line_id', align: 'left', sortable: true },
          { name: 'date', label: 'Date', field: 'date', align: 'left', sortable: true},
          { name: 'shift_id', label: 'Shift', field: 'shift.name', align: 'left'},
          { name: 'worktime', label: 'Worktime', field: 'worktime', align: 'left', sortable: true},
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
    LineOptions() {
      return (this.SHEET.lines.data.map(item => ({label: item.name, value: item.id})) || [])
    },
  }
}
</script>
