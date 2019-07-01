<template>
  <div class="fixed-center text-center">
    <p>
      <q-icon class="q-display-4" name="not_interested" color="grey"></q-icon>
    </p>
    <p class="text-faded">Sorry, Access forbidden ...<strong>(403)</strong></p>
    <q-btn
      color="secondary"
      style="width:200px;"
      @click="goBack()"
    >Go back</q-btn>
  </div>
</template>

<script>
export default {
  data () {
    return {
     //
    }
  },
  mounted() {
    console.log()

  },
  methods: {
    goBack() {
      if(this.$route.query.hasOwnProperty('redirect')) {
        this.$router.push(this.$route.query.redirect)
        return
      }
      
      this.$router.go(-1)
    }
  },
}
</script>
