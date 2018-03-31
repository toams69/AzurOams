<template>
  <div>
    <clsh-list v-if="!this.$route.query.s || isNaN(parseInt(this.$route.query.s))"></clsh-list>
    <clsh-details v-else :idSejour="parseInt(this.$route.query.s)"></clsh-details>    
  </div>
</template>
<script>
  import ClshList from '@/components/Clsh/ClshList'
  import ClshDetails from '@/components/Clsh/ClshDetails'

  export default {
    components: {
      ClshList,
      ClshDetails
    },
    mounted () {
      this.$store.dispatch('GET_CLSH')
    }
  }
</script>
<style>
</style>