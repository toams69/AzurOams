<template>
  <div>
    <p>Merci de selectionner un membre avant de passer à l'étape suivante</p>
    <el-autocomplete
      class="inline-input"
      v-model="membre"
      :fetch-suggestions="querySearch"
      placeholder="Selectionner un membre"
      :trigger-on-focus="false"
      @select="handleSelect"
    ></el-autocomplete>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'
  
  export default {
    computed: {
      // mix the getters into computed with object spread operator
      ...mapGetters([
        'getAllEnfant'
      ])
    },
    data () {
      return {
        membre: ''
      }
    },
    methods: {
      querySearch (queryString, cb) {
        var links = this.getAllEnfant().map((e) => {
          return {value: e['NOM_MEMBRE'] + ' ' + e['PRENOM_MEMBRE'], model: e}
        })
        var results = queryString ? links.filter(this.createFilter(queryString)) : links
        // call callback function to return suggestions
        cb(results)
      },
      createFilter (queryString) {
        return (link) => {
          return (link.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1)
        }
      },
      handleSelect (item) {
        console.log(item)
      }
    }
  }
</script>
<style scoped lang="scss">
  
</style>
