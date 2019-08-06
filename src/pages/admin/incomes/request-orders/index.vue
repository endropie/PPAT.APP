<template>
  <q-page padding class="page-index" >
    <q-pull-to-refresh @refresh="TABLE.refresh" inline>
      <q-table ref="table" inline class="table-index th-uppercase" color="primary" :dark="LAYOUT.isDark"
        :title="TABLE.getTitle()"
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
              { label: $tc('form.add'),
                detail: $tc('messages.form_new'),
                icon: 'add',
                shortcut: true,
                hidden:!$app.can('incoming-goods-create'),
                to: `${TABLE.resource.uri}/create`
              },
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
              <ux-select-filter class="col-12 col-sm-6"
                v-model="FILTERABLE.fill.customer_id.value" clearable
                :label="$tc('general.customer')"
                dense hide-bottom-space hide-dropdown-icon
                standout="bg-blue-grey-5 text-white"
                :bg-color="LAYOUT.isDark ? 'blue-grey-9' : 'blue-grey-1'"
                :dark="LAYOUT.isDark" :options-dark="LAYOUT.isDark"
                :options="CustomerOptions"
                @input="FILTERABLE.submit" />

              <ux-date class="col-12 col-sm-3"
                stack-label :label="$tc('label.begin')"
                v-model="FILTERABLE.fill.begin_date.value" type="date"  clearable
                dense hide-bottom-space
                standout="bg-blue-grey-5 text-white"
                :bg-color="LAYOUT.isDark ? 'blue-grey-9' : 'blue-grey-1'"
                :dark="LAYOUT.isDark"
                @input="FILTERABLE.submit"/>

              <ux-date class="col-12 col-sm-3"
                stack-label :label="$tc('label.until')"
                v-model="FILTERABLE.fill.until_date.value" type="date"  clearable
                dense hide-bottom-space
                standout="bg-blue-grey-5 text-white"
                :bg-color="LAYOUT.isDark ? 'blue-grey-9' : 'blue-grey-1'"
                :dark="LAYOUT.isDark"
                @input="FILTERABLE.submit"/>


              <q-select class="col-12" autocomplete="off"
                multiple use-chips use-input new-value-mode="add"
                dense hide-dropdown-icon
                v-model="FILTERABLE.search" emit-value
                :placeholder="`${$tc('form.search',2)}...`"
                standout="bg-blue-grey-5 text-white"
                :bg-color="LAYOUT.isDark ? 'blue-grey-9' : 'blue-grey-1'"
                :dark="LAYOUT.isDark">

                <template slot="append">
                  <q-btn flat dense icon="search" dark-percentage color="fadded" @click="FILTERABLE.submit"/>
                </template>
              </q-select>
            </div>
          </table-header>
        </template>

        <!-- slot name syntax: body-cell-<column_name> -->
        <q-td slot="body-cell-number" slot-scope="rs" :props="rs" style="width:35px">
          <span v-if="rs.row.number"> {{ rs.row.number + (rs.row.transaction == 'RETURN' ? '.RET' : '') }}
            <ux-badge-status :row="rs.row" class=" on-right shadow-0" />
          </span>
          <span v-else>- undifined -</span>
        </q-td>

        <q-td slot="body-cell-prefix" slot-scope="rs" :props="rs" style="width:35px">
          <q-btn dense flat color="light" icon="description" :to="`${TABLE.resource.uri}/${rs.row.id}`"/>
          <q-btn v-if="isCanUpdate && isEditable(rs.row)" dense flat color="light" icon="edit" :to="`${TABLE.resource.uri}/${rs.row.id}/edit`" />
          <q-btn v-if="isCanDelete && isEditable(rs.row)" dense flat color="light" icon="delete" @click.native="TABLE.delete(rs.row)" />
        </q-td>

        <q-td slot="body-cell-date" slot-scope="rs" :props="rs">
          <span v-if="rs.row.date"> {{ $app.moment(rs.row.date).format('DD/MM/YYYY') }}</span>
          <span v-else>-</span>
        </q-td>

        <!-- <q-td slot="body-cell-begin_date" slot-scope="rs" :props="rs">
          <span v-if="rs.row.begin_date"> {{ $app.moment(rs.row.begin_date).format('DD/MM/YY') }}</span>
          <span v-else>-</span>
        </q-td> -->

        <!-- <q-td slot="body-cell-until_date" slot-scope="rs" :props="rs">
          <span v-if="rs.row.until_date"> {{ $app.moment(rs.row.until_date).format('DD/MM/YY') }}</span>
          <span v-else>-</span>
        </q-td> -->

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
          api: '/api/v1/incomes/request-orders',
          uri: '/admin/incomes/request-orders',
        },
        columns: [
          { name: 'prefix', label: '', align: 'left'},
          { name: 'number', label: this.$tc('label.number'), field: 'number', align: 'left', sortable: true },
          { name: 'date', label: this.$tc('label.date'), align: 'center', field: 'date'},
          { name: 'customer_id', label: this.$tc('general.customer'), align: 'left', field: (row) => row.customer.name , sortable: true },
          { name: 'reference_number', label: 'No. Reference', field: 'reference_number', align: 'left', sortable: true },
          // { name: 'begin_date', label: 'Begin Date', align: 'center', field: 'begin_date'},
          // { name: 'until_date', label: 'Until Date', align: 'center', field: 'until_date'},
          // { name: 'interval_date', label: 'Interval Date', align: 'center'},
          { name: 'created_at', label: 'Create', align: 'center', sortable: true, field: 'created_at'},
        ]
      },
    }
  },
  created () {
    this.INDEX.load()
  },
  computed: {
    isCanUpdate(){
      return this.$app.can('request-orders-update')
    },
    isCanDelete(){
      return this.$app.can('request-orders-delete')
    },
    CustomerOptions() {
      return (this.SHEET.customers.data.map(item => ({label: item.name, value: item.id})) || [])
    },
  },
  methods: {
    isEditable(row) {
      if (row.order_mode === 'NONE') return false
      if (row.status !== 'OPEN') return false
      if (row.hasOwnProperty('is_relationship') && row.is_relationship) return false
      return true
    }
  }
}
</script>
