<template>
  <q-page padding class="page-index" v-if="PAGE.enable">
    <q-pull-to-refresh @refresh="TABLE.refresh">
      <q-table 
        ref="table" 
        inline dense
        class="table-index" 
        separator="horizontal"
        color="primary" 
        :dark="LAYOUT.isDark"
        :title="TABLE.getTitle()"
        :data="TABLE.rowData"
        :columns="TABLE.columns"
        :filter="TABLE.filter"
        selection="none" 
        :selected.sync="TABLE.selected"
        row-key="id"
        :rows-per-page-options="[10,25,50,100,200,500,0]"
        :pagination.sync="TABLE.pagination"
        @request="TABLE.compute"
        :loading="TABLE.loading"
        >
        
        <template v-slot:top-right>
          <q-input borderless dense debounce="300" v-model="TABLE.filter" placeholder="Search">
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
            <template v-slot:append>
              <q-btn  dense flat round color="positive" icon="add"  @click="$router.push(`${TABLE.resource.uri}/create`)"/>
              <q-btn  dense flat round color="grey" icon="more_vert" />
            </template>
          </q-input>
        </template>
        
        <q-td slot="body-cell-prefix" slot-scope="rs" :props="rs" style="width:35px">
          <q-btn dense flat color="grey" icon="edit" :to="`${TABLE.resource.uri}/${rs.row.id}/edit`"/>
          <q-btn dense flat color="grey" icon="delete" @click.native="TABLE.delete(rs.row)" />
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
        // itemstocks: {data:[], api:'/api/v1/common/items?mode=itemstock'}
      },
      TABLE: {
        mode: 'datagrid',
        resource:{
          api: '/api/v1/common/items',
          uri: '/admin/common/items',
        },
        columns: [
          { name: 'prefix', label: '', align: 'left'},
          
          { name: 'code', field: 'code', label: 'Intern code', align: 'left', sortable: true },
          { name: 'part_number', label: 'Part number', field: 'part_number', align: 'left', sortable: true },
          { name: 'part_name', label: 'Part name', field: 'part_name', align: 'left', sortable: true },

          // Item stocks
          { name: 'incoming_good', field: (item)=> item.totals['FM'], label: 'FM', sortable: true },
          { name: 'work_order', field: (item)=> item.totals['WO'], label: 'WO', sortable: true },
          { name: 'packing_item', field: (item)=> item.totals['FG'], label: 'FG', sortable: true },
          { name: 'not_good', field: (item)=> item.totals['NG'], label: 'NG', sortable: true },
          { name: 'not_good_repair', field: (item)=> item.totals['NGR'], label: 'NGR', sortable: true },

          { name: 'price', label: 'Price', field: 'price', sortable: true },
          { name: 'price_dm', label: 'Price in DM', field: 'price', sortable: true },
          { name: 'price_brl', label: 'Price in BRL', field: 'price', sortable: true },
          { name: 'brand_id', label: 'Brand', field: (item)=> (item.brand.name || 'Undefined'), align: 'left', sortable: true},
          { name: 'customer_id', label: 'Customer', field: (item)=> (item.customer.name || 'Undefined'), align: 'left', sortable: true},
          { name: 'specification_id', label: 'Specification', field: (item)=> (item.specification.code || 'Undefined'), align: 'left', sortable: true},
          { name: 'part_alias', label: 'Part alias', field: 'part_alias', sortable: true },
        ]
      }
    }
  },
  created () {
    // this.PAGE.hide()
    // this.PAGE.enable = false
    this.INDEX.load(
      () => {
        setTimeout(() => {
          this.PAGE.enable = true
          // console.log('this.PAGE.enable', this.PAGE.enable)
        }, 500);
      }
    )
  },
  computed: {
    MAPINGKEY() {
      let variables = {
        'itemstocks': {},
      }
      // this.SHEET['itemstocks'].data.map(value => { variables['itemstocks'][value.id] = value.totals })

      return variables;
    }
  },
  methods: {
    totalStock(id, label) {
      if(!this.MAPINGKEY['itemstocks'][id]) return 0
      return Number(this.MAPINGKEY['itemstocks'][id][label])
    }
  },
}
</script>
