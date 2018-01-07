<template>
  <div>
    <activites-list v-if="!this.$route.query.a || isNaN(parseInt(this.$route.query.a))"></activites-list>
    <activite-details v-else :idActivite="parseInt(this.$route.query.a)"></activite-details>
  </div>
</template>
<script>
  import ActivitesList from '@/components/Activites/ActivitesList'
  import ActiviteDetails from '@/components/Activites/ActiviteDetails'

  export default {
    components: {
      ActivitesList,
      ActiviteDetails
    },
    mounted () {
      this.$store.dispatch('GET_ACTIVITES')
    }
  }
</script>
<style>
</style>