<template>
  <q-page padding class="page-index" >
    <q-pull-to-refresh @refresh="TABLE.refresh" inline>
      <q-table ref="table" inline class="table-index th-uppercase" color="primary" :dark="LAYOUT.isDark"
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

            <template v-slot:menu-prepend>
              <q-btn dense rounded icon="add" color="primary" class="q-mx-sm"
                :to="`${TABLE.resource.uri}/create`"
                v-if="$app.can('productions-create') && $q.screen.gt.sm" />
            </template>
            <template v-slot:menu-item>
              <q-item clickable v-close-popup :to="`${TABLE.resource.uri}/create`"
                class="vertical-middle"
                v-if="$app.can('productions-create')">
                <q-item-section>Add new</q-item-section>
                <q-item-section avatar><q-icon name="add_circle" color="light"/></q-item-section>
              </q-item>
              <q-separator :dark="LAYOUT.isDark"/>
            </template>

            <div class="row q-col-gutter-xs" >
              <ux-select-filter class="col-12 col-sm-12 col-md-6" style="min-width:150px"
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
                :placeholder="`${$tc('form.search',2)}...`"
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
          <q-btn flat dense color="light" icon="description" :to="`${TABLE.resource.uri}/${rs.row.id}`" />
          <q-btn v-if="isCanUpdate" flat dense color="light" icon="edit" :to="`${TABLE.resource.uri}/${rs.row.id}/edit`" />
          <q-btn v-if="isCanDelete" flat dense color="light" icon="delete" @click.native="TABLE.delete(rs.row)" />
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
      TABLE: {
        mode: 'index',
        resource:{
          api: '/api/v1/factories/productions',
          uri: '/admin/factories/productions',
        },
        columns: [
          { name: 'prefix', label: '', align: 'left'},

          { name: 'number', label: this.$tc('label.number'), field: 'number', align: 'left', sortable: true },
          { name: 'line_id', label: 'Line production', field: 'line_id', align: 'left', sortable: true },
          { name: 'date', label: this.$tc('label.date'), field: 'date', align: 'left', sortable: true},
          { name: 'shift_id', label: 'Shift', field: 'shift.name', align: 'left'},
          { name: 'worktime', label: 'Worktime', field: 'worktime', align: 'left', sortable: true},
        ]
      },
    }
  },
  created () {
    this.INDEX.load()
  },
  computed: {
    isCanUpdate(){
      return this.$app.can('productions-update')
    },
    isCanDelete(){
      return this.$app.can('productions-delete')
    },
    LineOptions() {
      return (this.SHEET.lines.data.map(item => ({label: item.name, value: item.id})) || [])
    },
  }
}
</script>
