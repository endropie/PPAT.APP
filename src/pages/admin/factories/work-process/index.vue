<template>
  <q-page padding class="page-index" >
    <q-pull-to-refresh @refresh="TABLE.refresh" inline>
      <q-table ref="table" inline class="table-index th-uppercase" color="primary" :dark="LAYOUT.isDark"
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
            :menus="[
              { label: $tc('label.trash'),
                detail:  $tc('messages.show_deleted'),
                shortcut: true,
                icon: Boolean(FILTERABLE.fill.withTrashed.value)? 'mdi-cup' : 'mdi-cup-off',
                closePopup: false,
                outline: true,
                actions:() => {
                  FILTERABLE.toggleTrash()
                  FILTERABLE.submit()
                }
              }
            ]">


            <div class="row q-col-gutter-xs" >
              <ux-select-filter class="col-8 col-sm-4"
                name="line_id"
                v-model="FILTERABLE.fill.line_id.value" clearable
                :label="$tc('items.preline')" stack-label
                :placeholder="$tc('form.select_a', null, {v:$tc('items.preline')})"
                dense hide-bottom-space hide-dropdown-icon
                standout="bg-blue-grey-5 text-white"
                :bg-color="LAYOUT.isDark ? 'blue-grey-9' : 'blue-grey-1'"
                :dark="LAYOUT.isDark"
                :options="LineOptions"
                @input="FILTERABLE.submit" />

              <q-select class="col-4 col-sm-2 "
                v-model="FILTERABLE.fill.status.value" clearable
                :options="['OPEN', 'PROCESSED','CLOSED']"
                :label=" $tc('label.state')"
                dense hide-bottom-space hide-dropdown-icon
                standout="bg-blue-grey-5 text-white"
                :bg-color="LAYOUT.isDark ? 'blue-grey-9' : 'blue-grey-1'"
                :dark="LAYOUT.isDark"
                @input="FILTERABLE.submit" />

              <ux-date class="col-8 col-sm-4"
                stack-label :label="$tc('label.date')"
                v-model="FILTERABLE.fill.date.value" type="date"  clearable
                dense hide-bottom-space
                standout="bg-blue-grey-5 text-white"
                :bg-color="LAYOUT.isDark ? 'blue-grey-9' : 'blue-grey-1'"
                :dark="LAYOUT.isDark"
                @input="FILTERABLE.submit"/>

              <q-select class="col-4 col-sm-2"
                map-options emit-value
                v-model="FILTERABLE.fill.shift_id.value" clearable
                :options="ShiftOptions"
                :label="$tc('label.shift')"
                dense hide-bottom-space hide-dropdown-icon
                standout="bg-blue-grey-5 text-white"
                :bg-color="LAYOUT.isDark ? 'blue-grey-9' : 'blue-grey-1'"
                :dark="LAYOUT.isDark"
                @input="FILTERABLE.submit"/>

              <q-select class="col-12"
                multiple use-chips use-input new-value-mode="add"
                dense hide-dropdown-icon
                v-model="FILTERABLE.search" emit-value
                :placeholder="`${$tc('form.search',2)}...`"
                standout="bg-blue-grey-5 text-white"
                :bg-color="LAYOUT.isDark ? 'blue-grey-9' : 'blue-grey-1'"
                :dark="LAYOUT.isDark">

                <template slot="append">
                  <q-btn flat dense icon="search" color="blue-grey-10" @click="FILTERABLE.submit"/>
                </template>
              </q-select>
            </div>
          </table-header>
        </template>

        <!-- slot name syntax: body-cell-<column_name> -->
        <q-td slot="body-cell-prefix" slot-scope="rs" :props="rs" style="width:35px">
          <q-btn v-if="rs.row.status != 'OPEN'" dense flat color="light" icon="description" :to="`${TABLE.resource.uri}/${rs.row.id}`" />
          <q-btn v-if="rs.row.status == 'OPEN' && isCanConfirm" dense flat color="light" icon="beenhere" :to="`${TABLE.resource.uri}/${rs.row.id}/edit`" />
        </q-td>

        <q-td slot="body-cell-number" slot-scope="rs" :props="rs">
          <div>{{rs.row.number}}
            <ux-badge-status :row="rs.row" class="on-right shadow-1"/>
          </div>
        </q-td>

        <q-td slot="body-cell-shift_id" slot-scope="rs" :props="rs">
          <q-badge dense color="light" text-color="white" :label="rs.row.shift.name" v-if="rs.row.shift_id" />
        </q-td>

        <q-td slot="body-cell-date" slot-scope="rs" :props="rs">
          <!-- {{ rs.row.work_order_items }} -->
          <span v-if="rs.row.work_order_items"> {{ $app.moment(rs.row.work_order_items.date).format('DD/MM/YY') }}</span>
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
        lines: {data:[], api:'/api/v1/references/lines?mode=all'},
        shifts: {data:[], api:'/api/v1/references/shifts?mode=all'}
      },
      FILTERABLE: {
        fill: {
          line_id: {
            value: null,
            type: 'integer',
            transform: (value) => { return null }
          },
          status: {
            value: null,
            type: 'string',
            transform: (value) => { return null }
          },
          date: {
            value: null,
            type: 'date',
            transform: (value) => { return null }
          },
          shift_id: {
            value: null,
            type: 'integer',
            transform: (value) => { return null }
          }
        }
      },
      TABLE:{
        mode: 'index',
        resource:{
          api: '/api/v1/factories/work-orders',
          uri: '/admin/factories/work-process',
        },
        columns: [
          { name: 'prefix', label: '', align: 'left'},
          { name: 'number', label: this.$tc('label.number'), field: 'number', align: 'left', sortable: true },
          { name: 'line_id', label: 'Line', field: (rs)=> rs.line.name , align: 'left', sortable: true },
          { name: 'date', label: this.$tc('label.date'), field: 'date', align: 'center', sortable: true },
          { name: 'shift_id', label: 'Shift', field: (rs)=> rs.shift.name , align: 'center', sortable: true },
        ]
      },
    }
  },
  created () {
    this.INDEX.load()
  },
  computed: {
    isCanConfirm(){
      return this.$app.can('work-process-confirm')
    },
    ShiftOptions() {
      return (this.SHEET.shifts.data.map(line => ({label: line.name, value: line.id})) || [])
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
