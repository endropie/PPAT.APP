<template>
  <q-input 
    v-bind="$attrs"
    v-on="$listeners"
    v-model="date" 
    filled  mask="date">
      <template v-slot:append>
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
            <q-date v-model="value" @input="() => $refs.qDateProxy.hide()" />
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
</template>

<script>
 
export default {
  name : 'input-date',
    props: {
      options :{
        type: Object,
        default: ()=> {},
      }
    },
    data() {
      return {
        value: this.$attrs.value
      }
    },
    watch: {
      '$attrs.value': 'setValue',
    },
    computed:{
      date: {
        get() {
          return this.value
        },
        set(v){
          this.value = v
        }
      }
    },
    methods: {
      setValue(v) {
        this.value = v
      },
    }
}
</script>

<style lang="stylus">
input.input-numeric
  text-align right
</style>

