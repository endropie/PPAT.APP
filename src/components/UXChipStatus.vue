<template>
  <q-chip class="text-weight-medium" style="padding: 4px 6px"
    v-bind="$attrs"
    v-on="$listeners"
    text-color="white" :label="Label" :color="Color" />
</template>

<script>
import { mapGetters } from 'vuex'
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
        // data values!
      }
    },
    computed:{
      ...mapGetters('admin', ['CONFIG']),
      Colors() {
        return this.CONFIG.options['state_colors']
      },
      Value() {
        if(this.row['deleted_at'] && !['VOID','REVISED'].find(x => x === this.row['status'])) {
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
        if(this.Colors && this.Colors[this.Value]) {
          return this.Colors[this.Value]
        }
        return 'light'
      }
    },
    methods: {
    }
}
</script>
