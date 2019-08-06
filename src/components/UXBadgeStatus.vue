<template>
  <q-badge class="text-weight-medium" style="padding: 4px 6px"
    v-bind="$attrs"
    v-on="$listeners"
    text-color="white" :label="Label" :color="Color" />
</template>

<script>

export default {
  name : 'ux-badge-status',
    props: {
      labelOptions: Object,
      colorOptions: Object,
      row: {
        type: Object,
        required: true
      },
      name: {
        type: String,
        default: 'status'
      }
    },
    data() {
      return {
        colors:{
          OPEN: 'blue',
          VALIDATED: 'green',
          PROCESSED: 'indigo',
          CLOSED: 'red',
          VOID: 'red-10',
          DELETED: 'dark'
        }
      }
    },
    computed:{
      Value() {
        if(this.row['deleted_at'] && this.row['status'] !== 'VOID') {
          return 'DELETED'
        }
        return this.row[this.name]
      },
      Label() {
        if(this.labelOptions && this.labelOptions[this.Value]) {
          return this.labelOptions[this.Value]
        }
        return this.Value
      },
      Color() {
        if(this.colorOptions && this.colorOptions[this.Value]) {
          return this.colorOptions[this.Value]
        }
        if(this.colors && this.colors[this.Value]) {
          return this.colors[this.Value]
        }
        return 'lime'
      }
    },
    methods: {
    }
}
</script>
