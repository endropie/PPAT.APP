<template>
  <q-input type="date"
    v-model="value"
    v-bind="$attrs"
    v-on="$listeners"
    input-class="no-option-date"
    >

      <template v-slot:append>
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
            <q-date :mask="valueFormat" 
              v-model="value" 
              v-on="$listeners"
              @input="() => $refs.qDateProxy.hide()" />
          </q-popup-proxy>
        </q-icon>
      </template>
  </q-input>
  
</template>

<script>

export default {
  name : 'input-date',
    props: {
      labelFormat :{
        type: String,
        default: 'DD/MM/YYYY',
      },
      valueFormat :{
        type: String,
        default: 'YYYY-MM-DD',
      }
    },
    data() {
      return {
        value: this.$attrs.value,
      }
    },
    watch: {
      '$attrs.value': 'setValue',
    },
    computed:{
    },
    methods: {
      setValue(v) {
          this.value = v
      }
    }
}
</script>

<style lang="stylus">
input.no-option-date[type="date"]::-webkit-clear-button
input.no-option-date[type="date"]::-webkit-inner-spin-button,
input.no-option-date[type="date"]::-webkit-calendar-picker-indicator {
    display: none;
    -webkit-appearance: none;
}
</style>

