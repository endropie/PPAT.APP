<template>
<q-page padding >
  <q-card class="main-box" style="height: calc(100vh - 100px)">
      <q-splitter style="height: 100%" v-model="splitterModel">

        <template v-slot:before>
          <q-tabs class="text-primary" v-model="tab" vertical >
            <q-tab name="general"
              icon="dashboard"
              :label="$tc('label.general')"
              v-if="$app.can()"/>
            <q-tab name="incoming_good"
              icon="move_to_inbox"
              :label="$tc('general.incoming_good')"
              v-if="$app.can()"/>
            <q-tab name="outgoing_good"
              icon="unarchive"
              :label="$tc('general.outgoing_good')"
              v-if="$app.can()"/>
          </q-tabs>
        </template>

        <template v-slot:after>
          <q-tab-panels class="main-box fit" v-model="tab"
            animated transition-prev="jump-up" transition-next="jump-up">
            <q-tab-panel name="general">
              <commponet :is="components[tab]" />
            </q-tab-panel>

            <q-tab-panel name="incoming_good">
              <commponet :is="components[tab]" />
            </q-tab-panel>

          </q-tab-panels>
        </template>

      </q-splitter>
  </q-card>
</q-page>
</template>

<script>
import FormGeneral from './general'
import FormIncomingGood from './incoming_good'

export default {
  data () {
    return {
      components : {
        general: FormGeneral,
        incoming_good: FormIncomingGood,
      },
      tab: 'general',
      splitterModel: 20
    }
  }
}
</script>
