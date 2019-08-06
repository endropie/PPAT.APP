<template>
  <q-page padding class="page-index">
    <q-pull-to-refresh @refresh="TABLE.refresh">
      <q-table
        ref="table"
        inline dense
        class="table-index table-sticky-column th-uppercase"
        separator="horizontal"
        color="primary"
        :dark="LAYOUT.isDark"
        :title="TABLE.getTitle()"
        :data="TABLE.rowData"
        :columns="TABLE.columns"
        :visible-columns="COLUMNS"
        :filter="TABLE.filter"
        selection="none"
        :selected.sync="TABLE.selected"
        row-key="code"
        :rows-per-page-options="[10,25,50,100,200,500,0]"
        :pagination.sync="TABLE.pagination"
        @request="TABLE.compute"
        :loading="TABLE.loading"
      >
         <template v-slot:top>
          <table-header
            :title="TABLE.getTitle()"
            :TABLE.sync="TABLE"
            :filter.sync="TABLE.filter"
            :menus="[
              { label: $tc('form.add'),
                detail: $tc('messages.form_new'),
                icon: 'add',
                shortcut: true,
                hidden:!$app.can('incoming-goods-create'),
                to: `${TABLE.resource.uri}/create`
              }
            ]">
          </table-header>
        </template>

        <q-td slot="body-cell-prefix" slot-scope="rs" :props="rs" style="width:35px">
          <q-btn v-if="isCanUpdate" dense flat color="grey" icon="edit" :to="`${TABLE.resource.uri}/${rs.row.id}/edit`"/>
          <q-btn v-if="isCanDelete" dense flat color="grey" icon="delete" @click.native="TABLE.delete(rs.row)" />
        </q-td>

        <q-td slot="body-cell-enable" slot-scope="rs" :props="rs" style="width:35px">
          <!-- <q-icon
            :name="rs.row.enable ? 'mdi-check-outline' : 'mdi-close-circle'"
            :color="rs.row.enable ? 'primary' : 'red'"/> -->
          <q-avatar size="24px" class="shadow-1"
            :color="rs.row.enable ? 'green' : 'red'" text-color="white"
            :icon="rs.row.enable ? 'mdi-check-outline' : 'block'" />
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
          { name: 'prefix', label: '', align: 'left', required: true,},

          { name: 'code', field: 'code', label: 'Intern code', align: 'left', sortable: true, required: true, },
          { name: 'part_number', label: this.$tc('label.number', 1, {v:this.$tc('label.part')}), field: 'part_number', align: 'left', sortable: true },
          { name: 'part_name', label: this.$tc('label.name', 1, {v:this.$tc('label.part')}), field: 'part_name', align: 'left', sortable: true },
          { name: 'enable', label:this.$tc('label.active'), field: 'enable', align: 'center', sortable: true },

          // Item stocks
          { name: 'ALL', label: 'ALL', sortable: true, style:'text-weight-medium',
            field: (item)=> (
              Number(item.totals['FM'])
              + Number(item.totals['WO'])
              + Number(item.totals['WIP'])
              + Number(item.totals['FG'])
              + Number(item.totals['NG'])
              + Number(item.totals['NGR'])
            )
          },
          { name: 'FM', field: (item)=> item.totals['FM'] || '-', label: 'FM', sortable: true },
          { name: 'WO', field: (item)=> item.totals['WO'] || '-', label: 'WO', sortable: true },
          { name: 'WIP', field: (item)=> item.totals['WIP'] || '-', label: 'WIP', sortable: true },
          { name: 'FG', field: (item)=> item.totals['FG'] || '-', label: 'FG', sortable: true },
          { name: 'NC', field: (item)=> item.totals['NG'] || '-', label: 'NC', sortable: true },
          { name: 'NCR', field: (item)=> item.totals['NGR'] || '-', label: 'RET', sortable: true },

          { name: 'RO', field: (item)=> item.totals['RO'] || '-', label: 'RO', sortable: true, hidden: !process.env.DEV },
          { name: 'PDO', field: (item)=> item.totals['PDO'] || '-', label: 'PDO', sortable: true, hidden: !process.env.DEV },

          { name: 'price', label: 'Price', field: 'price', sortable: true },
          { name: 'price_dm', label: 'Price in DM', field: 'price', sortable: true },
          { name: 'price_brl', label: 'Price in BRL', field: 'price', sortable: true },
          { name: 'brand_id', label: 'Brand', field: (item)=> (item.brand.name || 'Undefined'), align: 'left', sortable: true},
          { name: 'customer_id', label: this.$tc('general.customer'), field: (item)=> (item.customer.name || 'Undefined'), align: 'left', sortable: true},
          { name: 'specification_id', label: 'Specification', field: (item)=> (item.specification.code || 'Undefined'), align: 'left', sortable: true},
          { name: 'part_alias', label: 'Part alias', field: 'part_alias', sortable: true },
        ],
        hideColumns: ['code']
      }
    }
  },
  created () {
    if (!this.$app.can('items-price')) {
      this.TABLE.visibleColumns = this.TABLE.columns.filter(x => {
        return ['price', 'price_dm', 'price_brl'].indexOf(x.name) < 0
      }).map(x=>{
        return x.name
      })
    }

    this.INDEX.load()
  },
  computed: {
    isCanUpdate(){
      return this.$app.can('items-update')
    },
    isCanDelete(){
      return this.$app.can('items-delete')
    },
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
