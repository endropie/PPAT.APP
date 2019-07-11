<template>
<!-- slot:
* list => template for list
* - list-item
* - list-append (not yet)
* - list-prepend (not yet)
* - list-item-[name]
* tabel => template for table
* - body-cell
* - body-cell-[name]

* field-[name] => for body-cell-[name] or list-item-[name] 
-->
  <div class="form-detail">
    <slot>
      <slot name="list" v-if="list">
        <q-list bordered dense :dark="dark" :separator="!!('cell' && 'horizontal')">
          <q-item-label v-if="title" header>{{title}}</q-item-label>
          <q-item-label v-if="subtitle" caption :lines="subtitleLines">{{subtitle}}</q-item-label>
          <q-separator inset :dark="dark"/>
          <q-item v-for="(item, index) in data" :key="index" >
            <!-- prepend -->
            <slot name="list-append"  />
            <q-item-section>
              <slot name="list-item" v-bind="item">
                <!-- col-start -->
                <div :class="rowClass" class="q-pt-sm">
                  <template v-for="(column, key) in columns">
                    <slot :name="`list-item-${column.name}`" :row="item" >
                      <slot :name="`field-${column.name}`" :row="item">
                        <div :key="key"></div>
                      </slot>
                    </slot>
                    <!-- col-body -->
                  </template>
                </div>
                <!-- col-end -->
              </slot>
            </q-item-section>
            <!-- append -->
            <slot name="append"  />

            <div class="absolute-top-right q-pr-sm">
              <q-btn size="xs" round dense icon="clear" color="red-5" @click="removeRow(index)"/>
            </div>
          </q-item>
          <q-item class="text-caption text-light" v-if="data.length === 0">
            <div class="full-width q-pa-xs bordered text-center">{{noDataLabel}}</div>
          </q-item>
          <!-- <q-separator inset spaced :dark="dark"/> -->
          <q-item>
            <q-item-section>
              <slot name="action-new">
                <q-btn flat outline dense color="green-5" :label="labelNew" @click="addRow()" />
              </slot>
            </q-item-section>
          </q-item>
        </q-list>
      </slot>
      <slot name="table" v-else>
        <q-markup-table>
          <thead>
            <tr>
              <th v-for="(column, key) in columns" :key="key">
                {{ column.label || column.name }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(column, index) in data" :key="index">
              <td v-for="(cell, key) in columns" :key="key">
                <slot :name="`body-cell-${cell.name}`" :row="cell">
                  <slot :name="`field-${cell.name}`" :row="cell"/>
                </slot>
              </td>
            </tr>
          </tbody>
        </q-markup-table>
      </slot>
    </slot>
  </div>
</template>

<script>

export default {
  name: 'form-detail',
  inheritAttrs: false,
  props:{
      list: Boolean,
      data: {
        type: Array,
        required: true
      },
      columns: {
        type: Array,
        required: true
      },
      newData: {
        type: Object,
        default: {}
      },
      minLength:{
        type: Number | String,
        default: 0
      },
      dark: Boolean,
      rowClass: {
        type: String,
        default: 'row q-col-gutter-xs'
      },
      rowSpace: String,
      separator: {
        type: String,
        default: 'horizontal'
      },
      title: {
          type: String,
          default: null
      },
      subtitle: {
          type: String,
          default: null
      },
      subtitleLines: {
          type: Number,
          default: 1
      },
      labelNew: {
        type: String,
        default:'Submit'
      },
      noDataLabel: {
        type: String,
        default: 'No data details',
      }
  },
  computed: {
    StrRowClass() {
      let result = []
      const size = this.rowSpace == !!('xs' && 'sm' && 'md' && 'lg' && 'xl') ? this.rowSpace : 'xs'
      result.push(this.rowClass)
      result.push(`q-gutter-${size} q-col-gutter-${size}`)
      
      return result.join(' ')
    }
  },
  methods: {
    addRow() {
      const newEntri = this.newData;
      this.data.push(newEntri)
      this.$emit('added')
    },
    removeRow(index) {
      const minimal = Number(this.minLength) > 0 ? Number(this.minLength) : 0
      this.data.splice(index, 1)
      if(this.data < minimal) this.addRow()
      this.$emit('removed')
    }
  }
}
</script>

<style lang="stylus">
.form-detail
  // min-height 40px
</style>


