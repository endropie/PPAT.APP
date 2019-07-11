<template>
  <q-page padding class="page-index"  v-if="SHOW">
    <q-pull-to-refresh @refresh="TABLE.refresh" inline>
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

        <!-- Table Header -->
        <template v-slot:top>
          <table-header hide-search
            :title="TABLE.getTitle()"
            :TABLE.sync="TABLE"
            :filter.sync="TABLE.filter" >

            <template v-slot:menu-item>
              <q-item clickable v-close-popup :to="`${TABLE.resource.uri}/create`" class="vertical-middle">
                <q-item-section>Add new</q-item-section>
                <q-item-section avatar><q-icon name="add_circle" color="light"/></q-item-section>
              </q-item>
              <q-separator :dark="LAYOUT.isDark"/>
            </template>

          </table-header>
        </template>

        <q-td slot="body-cell-prefix" slot-scope="rs" :props="rs" style="width:35px">
          <q-btn dense flat color="light" icon="edit"  :class="{'hidden': rs.row.is_relationship === true}">
            <q-popup-edit v-if="!rs.row.ship_delivery_id" v-model="rs.row" title="Update Quantity" buttons 
              @save="(val, initialValue) => saveRow(val, initialValue)"
              @cancel="(val, initialValue) => cancelRow(val, initialValue)">
              <q-field class="col-12 col-sm-6">
                <!-- {{rs.row}} -->
                <q-input label="Quantity" type="number" v-model="rs.row.quantity" />
              </q-field>
              <q-field class="col-12 col-sm-6">
                <!-- <q-input label="Unit" type="number" v-model="rs.row.quantity" /> -->
              </q-field>
            </q-popup-edit>
          </q-btn>
          <q-btn dense flat color="light" icon="delete" @click.native="TABLE.delete(rs.row)" :class="{'hidden': rs.row.ship_delivery_id}"/>
        </q-td>

        <q-td slot="body-cell-status" slot-scope="rs" :props="rs" style="width:35px">
          <q-chip dense class="q-px-sm q-py-xs" color="primary" v-if="rs.row.ship_delivery_id">Delivered</q-chip>
          <q-chip dense class="q-px-sm q-py-xs" color="light" v-else>Wait</q-chip>
        </q-td>

        <q-td slot="body-cell-quantity" slot-scope="rs" :props="rs" style="width:35px">
          <span :class="{'text-weight-light highlight-and-fade':!rs.row.ship_delivery_id}">{{ rs.row.quantity }}</span>
          
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
          api: '/api/v1/incomes/ship-delivery-items',
          uri: '/admin/incomes/delivery/ship-delivery-items',
        },
        columns: [
          { name: 'prefix', label:''},
          { name: 'id',  label: '#', field:'id', format:(v)=> `${v}`},
          { name: 'status', label: 'Status', field: 'status', align: 'center', sortable: true},
          { name: 'part_code', label: 'Part code', field:(v)=> v.item.code, align: 'left', sortable: true },
          { name: 'part_name', label: 'Part name', field: (v)=> v.item.part_name, align: 'left', sortable: true },
          { name: 'quantity', label: 'Quantity', field: 'quantity', align: 'center', sortable: true },
          { name: 'unit_id', label: 'Unit', field: (v) => v.unit.code, align: 'left', sortable: true},
          { name: 'pre_delivery_number', label: 'No. PDO', field: 'pre_delivery_number', align: 'left', sortable: true },
          
        ]
      },
      rsForm: {
        quantity: null,
        unit_id: null
      }
    }
  },
  created () {
    this.INDEX.load()
  },
  computed: {
    CustomerOptions() {
      return (this.SHEET.customers.data.map(item => ({label: item.name, value: item.id})) || [])
    },
  },
  methods: {
    cancelRow(val, initial) {
      val.quantity = initial.quantity
    },
    saveRow(val, initial) {
      this.TABLE.loading = true
      let method = 'PATCH',
          mode = 'edit',
          apiUrl = this.TABLE.resource.api + '/' + val.id

      const data = {
        quantity: val.quantity,
        unit_id: val.unit_id
      }

      this.$axios.set(method, apiUrl, data)
      .then((response) => { 
        this.$app.notify.success('Update Verify #' + response.data.id + ' success!')
      })
      .catch((error) => { 
        this.cancelRow(val, initial)
        console.error(error.response)
        this.$app.response.error(error.response, 'Update Verify #' + val.id || val.item.part_name+' failed!')

      })
      .finally(()=>{
        this.TABLE.loading = false
      });
    },
  },
}
</script>
