<template>
  <div v-if="!node.hide">
  <q-expansion-item v-if="node.children && node.children.length"
    :icon="node.icon"  
    :content-inset-level="0.2"
    expand-separator
    dense-toggle
    :dark="LAYOUT.isDark"
    :label="node.name || ''" 
    :opened="$route.fullPath.startsWith(prefix)" >
      <template slot="header">
        <q-item-section side>
          <q-icon :name="node.icon"  :color="LAYOUT.isDark ? 'white': 'primary'"/>
        </q-item-section>
        <q-item-section label>
          {{node.name || ''}}
        </q-item-section>

      </template>
      
      <admin-menu-item v-for="(nodeitem, index) in node.children" :node="nodeitem" :prefix="getPrefix(nodeitem)" isChildren :key="index"  />
    

  </q-expansion-item>
  <q-item v-else :to="prefix" v-bind:class="{ 'active': $route.fullPath.startsWith(prefix)}" replace :dark="LAYOUT.isDark"
    :label="node.name || '- Undefine name -'">
      <q-item-section avatar>
        <q-icon :name="isChildren ? `keyboard_arrow_right` : node.icon" :color="LAYOUT.isDark ? 'white': 'primary'"/>
      </q-item-section>
      <q-item-section >
        <q-item-label :class="LAYOUT.isDark ? 'text-white': 'text-dark-primary'">
          {{node.name || '- Undefine name -'}}
        </q-item-label>
      </q-item-section>
    </q-item>
  </div>
</template>

<script>
import MixPage from '@/mixins/mix-page.vue'
import AdminMenuItem from "@/components/AdminMenuItem.vue";
export default {
  mixins: [MixPage],
  name: 'admin-menu-item',
  props: {
    node: Object,
    prefix: {type: String, default: ''},
    isIndent : {type: Boolean, default: false},
    isChildren: {type: Boolean, default: false}
  },
  components:{
    'admin-menu-item': AdminMenuItem
  },
  created() {
    // console.log('menu', this.node)  
  },
  computed: {
  },
  methods: {
    getPrefix(item) {  
      let ini = this.prefix + (item.path ? ('/' + item.path) : '' )
    //   console.log('CHECK',ini, this.$route.fullPath.startsWith(ini))
      return this.prefix + (item.path ? ('/' + item.path) : '' )
    },
    isActive(prefix) {
    // console.log(prefix, this.$route.fullPath)
    // console.log(prefix, this.$route.fullPath.startsWith(prefix))
      return prefix === this.$route.fullPath.startsWith(prefix)
    }
      
  },
}
</script>
