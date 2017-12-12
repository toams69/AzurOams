<template>
  <div>
    <el-select v-model="currentAnnee" placeholder="Année">
      <el-option
        v-for="item in annees"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
    <br/><br/>
    <div v-if="!numeroAdherent || !numeroAdherent['NUMERO_ADHERENT']">
      Le membre n'est pas adhérent pour l'année choisie
      <br/><br/>
      <button type="button" class="add-member btn btn-wd btn-info btn-fill btn-magnify" @click="dialogVisible = true" title="Créer une adhésion pour ce membre">
          Créer une adhésion
      </button>
    </div>
    <div v-else>
      Le membre est adhérent. Son numéro d'adhérent est le <b>{{numeroAdherent['NUMERO_ADHERENT']}}</b>
      <br/><br/>
      Activités auxquelles ce membre est inscrit
      <br/><br/>
      <ul>
        <li v-for="activite in activites">
          <b>{{activite['NOM_ACTIVITE']}}</b>
        </li>
      </ul>
      <br/><br/>
      <button type="button" class="add-member btn btn-wd btn-info btn-fill btn-magnify" @click="dialogVisible = true" title="Créer une adhésion pour ce membre">
          Insription à une activité
      </button>
    </div>
  </div>
</template>
<script>
  import moment from 'moment'

  export default {
    data () {
      return {
        test: ''
      }
    },
    props: {
      configuration: {
        type: Object
      },
      membre: {
        type: Object
      },
      currentAnnee: {
      }
    },
    computed: {
      annees () {
        return this.configuration.annees.map(function (e) { return {value: e['ID_ANNEE'], label: moment(e['DATE_DEBUT']).format('YYYY') + ' - ' + moment(e['DATE_FIN']).format('YYYY')} })
      },
      numeroAdherent () {
        if (!this.membre || !this.membre.adhesions) {
          return null
        }
        return this.membre.adhesions.find((e) => { return e['ID_ANNEE'] === this.currentAnnee })
      },
      activites () {
        if (!this.membre || !this.membre.activites) {
          return []
        }
        return this.membre.activites.filter((e) => { return e['ID_ANNEE'] === this.currentAnnee }) || []
      }
    },
    components: {
    },
    methods: {
    }
  }
</script>
<style>

</style>