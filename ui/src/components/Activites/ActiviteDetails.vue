<template>
  <div class="row" v-if="activite">
      <div class="activite-details">
        <img class="activite-icon" :src="getIcon(activite['NOM_ACTIVITE'])" />
        <h3>{{activite['NOM_ACTIVITE']}}</h3>
        <span><i style='height:40px; vertical-align: bottom;'>(pour l'année {{annee}})</i></span>
        <el-tabs v-model="activeName" class='tabs'>
          <el-tab-pane label="Informations" name="first">
            <br/>
            <label>Professeur</label> {{activite['PRENOM_PROFESSEUR']}} {{activite['NOM_PROFESSEUR']}} ({{activite['TEL_PROFESSEUR']}})
            <br/><br/>
            <label>Prix de l'activités</label> {{activite['PRIX']}} €
            <br/><br/>
            <label>Prix des fournitures</label> {{activite['PRIX_FOURNITURE'] || 0}} €
            <br/><br/>
            <label>Nombre de places totale</label> {{activite['MAX_INSCRIT']}}
            
          </el-tab-pane>
          <el-tab-pane label="Inscrits" name="second">
            <ul class='liste-inscrits'>
              <li v-for="item in inscrits" :key="item['ID_ENFANT'] || item['ID_MEMBRE']">
                {{item['NOM_ENFANT'] || item['NOM_MEMBRE']}} {{item['PRENOM_ENFANT'] || item['PRENOM_MEMBRE']}}
              </li>
            </ul>
          </el-tab-pane>
        </el-tabs>
        <button type="button" class="btn btn-wd btn-default btn-fill btn-move-left" @click="onBackPressed">
          <span class="btn-label">
              <i class="ti-angle-left"></i>
          </span>
          Back
        </button>
      </div>
  </div>
</template> 
<script>
  import { mapGetters } from 'vuex'
  import StatsCard from '@/components/Cards/StatsCard.vue'

  export default {
    components: {
      StatsCard
    },
    computed: {
      // mix the getters into computed with object spread operator
      ...mapGetters([
        'getFullConfiguration',
        'getActiviteMembers',
        'getActivite',
        'getAnnee'
      ]),
      activite () {
        return this.getActivite(this.idActivite)
      },
      inscrits () {
        return this.getActiviteMembers(this.idActivite)
      },
      annee () {
        return this.getAnnee(this.activite['ID_ANNEE'])
      }
    },
    data () {
      return {
        activeName: 'first'
      }
    },
    props: {
      idActivite: {}
    },
    methods: {
      getIcon (nomActivite) {
        nomActivite = nomActivite.toLowerCase()
        if (nomActivite.indexOf('danse') !== -1) {
          if (nomActivite.indexOf('classique') !== -1) {
            return '/static/img/activites/danse_classique.svg'
          }
          if (nomActivite.indexOf('orientale') !== -1) {
            return '/static/img/activites/danse_orientale.svg'
          }
        }
        if (nomActivite.indexOf('hip') !== -1 && nomActivite.indexOf('hop') !== -1) {
          return '/static/img/activites/hip_hop.svg'
        }
        if (nomActivite.indexOf('barre') !== -1 && nomActivite.indexOf('sol') !== -1) {
          return '/static/img/activites/barre_sol.svg'
        }
        if (nomActivite.indexOf('mj') !== -1) {
          return '/static/img/activites/danse_jazz.svg'
        }
        if (nomActivite.indexOf('cirque') !== -1) {
          return '/static/img/activites/cirque.svg'
        }
        if (nomActivite.indexOf('peinture') !== -1) {
          return '/static/img/activites/peinture.svg'
        }
        if (nomActivite.indexOf('poterie') !== -1) {
          return '/static/img/activites/poterie.svg'
        }
        if (nomActivite.indexOf('yoga') !== -1) {
          return '/static/img/activites/yoga.svg'
        }
        if (nomActivite.indexOf('couture') !== -1) {
          return '/static/img/activites/couture.svg'
        }
        if (nomActivite.indexOf('tapissier') !== -1) {
          return '/static/img/activites/tapissier.svg'
        }
        if (nomActivite.indexOf('meditation') !== -1 || nomActivite.indexOf('méditation') !== -1) {
          return '/static/img/activites/meditation.svg'
        }
        return '/static/img/activites/other.svg'
      },
      onBackPressed () {
        window.history.back()
      }
    },
    mounted () {
      this.$store.dispatch('GET_ACTIVITE', this.idActivite)
    },
    created () {
    }
  }
</script>
<style lang="scss" scoped>
  .activite-icon {
    width: 50px;
  }
  h3 {
    display: inline-block;
    padding: 5px;
    height: 40px;
    margin: 0 10px;
    vertical-align: bottom;
  }
  .tabs {
    padding: 10px;
    position: absolute;
    top: 100px;
    bottom: 60px;
    left: 20px;
    right: 20px;
    overflow: auto;
  }
  .activite-details {
    position: absolute;
    top: 10px;
    bottom: 10px;
    left: 10px;
    right: 10px;
    background: white;
    padding: 50px;
    border: 1px solid #cfcfca;
  }
  ul {
    list-style: none;
    li {
      margin: 10px 0px;
    }
  }
  .btn-move-left {
    position: absolute;
    bottom: 15px;
    left: 20px;
  }
</style>
<style lang="scss">
.activite-details {
  .tabs {
    padding: 10px;
    position: absolute;
    top: 100px;
    bottom: 60px;
    left: 20px;
    right: 20px;
    overflow: auto;
    .el-tabs__content {
       position: absolute;
      bottom: 0;
      top: 55px;
      overflow: auto;
      left: 0;
      right: 0; 
    }
  }
}
</style>
