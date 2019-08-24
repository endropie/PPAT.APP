<template>
  <q-btn-dropdown v-show="!EMPTY"
    split
    :label="FIRST.label || $attrs.label"
    @click="firstCall()"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <template v-slot:label>
      <slot name="label"></slot>
    </template>

    <q-list style="min-width:200px">
      <template v-for="(item, index) in options">
      <q-item :key="index"
        v-if="!item.hidden && index !== 0"
        clickable
        v-close-popup
        @click="actionsCall(item)" >
        <q-item-section avatar v-if="item.icon">
          <q-avatar :icon="item.icon" :color="item.color || 'primary'" text-color="white" size="38px"/>
        </q-item-section>
        <q-item-section>
          <q-item-label>{{item.label}}</q-item-label>
          <q-item-label caption v-if="item.detail">{{item.detail}}</q-item-label>
        </q-item-section>
        <q-item-section side v-if="item.stamp">
          <q-badge :label="item.stamp"/>
        </q-item-section>
      </q-item>
      </template>
    </q-list>
  </q-btn-dropdown>
</template>


<script>
export default {
  props: {
    required: Boolean,
    options: {
      type: Array,
      default: () => []
    }
  },
  computed:{
    FIRST() {
      let find = {}
      if(this.options) find = this.options.find(x => !x.hidden)

      return find
    },
    EMPTY() {
      if(this.required) return true
      return this.options.filter(x=> x.hidden !== true).length === 0
    },
  },
  methods: {
    firstCall() {
      if (this.FIRST.hasOwnProperty('actions')) this.FIRST.actions()
    },
    actionsCall(item) {
      if (item.hasOwnProperty('actions')) item.actions()
    }
  }
}
</script>
