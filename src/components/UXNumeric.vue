<template>
  <q-field
    v-bind="$attrs"
    v-on="$listeners">

    <vue-autonumeric
      :disabled="$attrs.disable"
      :readonly="$attrs.readonly"
      v-model="value"
      v-on="$listeners"
      class="ux-numeric q-field__native"
      :options="{
        digitGroupSeparator: '.',
        decimalCharacter: ',',
        decimalCharacterAlternative: '.',
        currencySymbol: '', // Ex: \u00a0€
        currencySymbolPlacement: 's',
        roundingMethod: 'U',
        minimumValue: '0',
        ...options
      }" >
    </vue-autonumeric>

  </q-field>
</template>

<script>
import VueAutonumeric from 'vue-autoNumeric/src/components/VueAutonumeric.vue'

export default {
  name : 'ux-numeric',
    components: {
      VueAutonumeric,
    },
    props: {
      options :{
        type: Object,
        default: ()=> {},
      }
    },
    data() {
      return {
        value: this.$attrs.value,
        setDefault: {
          digitGroupSeparator: '.',
          decimalCharacter: ',',
          decimalCharacterAlternative: '.',
          currencySymbol: '', // Ex: \u00a0€
          currencySymbolPlacement: 's',
          roundingMethod: 'U',
          minimumValue: '0'
        }
      }
    },
    watch: {
      '$attrs.value': 'setValue',
    },
    methods: {
      setValue(v) {
        this.value = v
      },
    }
}
</script>

<style lang="stylus">
input.ux-numeric
  text-align right
</style>

