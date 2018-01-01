<template>
  <div>
    <h5>Pour l'année</h5>
    <el-select v-model="annee" placeholder="Année">
      <el-option
        v-for="item in annees"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
    <br/><br/>
    <div class="row">
      <div class="col-lg-3 col-sm-6" v-for="activite in activites">
        <stats-card>
          <div class="text-center" slot="header">
            <img class="activite-icon" :src="getIcon(activite['NOM_ACTIVITE'])" />
          </div>
          <div class="numbers" slot="content">
            <p><b>{{activite['NOM_ACTIVITE']}}</b></p>
            <p style="font-size:12px"><i>{{activite['NOM_PROFESSEUR']}} {{activite['PRENOM_PROFESSEUR']}}</i></p>
          </div>
          <div class="stats" slot="footer">
            place(s) restante(s) : {{activite['MAX_INSCRIT'] - activite['INSCRITS']}}
            <router-link style="float:right" :to="{ path: 'activites', query: { a: activite['ID_ACTIVITE'] }}">+ d'infos</router-link>
          </div>
        </stats-card>
      </div>
    </div>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'
  import moment from 'moment'
  import StatsCard from '@/components/Cards/StatsCard.vue'

  export default {
    components: {
      StatsCard
    },
    computed: {
      // mix the getters into computed with object spread operator
      ...mapGetters([
        'getFullConfiguration',
        'getActivitesForYear'
      ]),
      currentAnnee () {
        return this.getFullConfiguration().annees.find((a) => {
          return moment().isBetween(moment(a['DATE_DEBUT']), moment(a['DATE_FIN']))
        })
      },
      activites () {
        return this.getActivitesForYear(this.annee)
      },
      annees () {
        return this.getFullConfiguration().annees.map(function (e) { return {value: e['ID_ANNEE'], label: moment(e['DATE_DEBUT']).format('YYYY') + ' - ' + moment(e['DATE_FIN']).format('YYYY')} })
      }
    },
    data () {
      return {
        annee: ''
      }
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
      }
    },
    mounted () {
      if (this.currentAnnee) {
        this.annee = this.currentAnnee['ID_ANNEE']
      }
    },
    created () {
    }
  }
</script>
<style lang="scss" scoped>
  .activite-icon {
    width: 50px;
  }
</style>
