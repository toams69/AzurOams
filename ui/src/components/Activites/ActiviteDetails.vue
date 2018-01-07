<template>
  <div>
    <ul>
      <li v-for="item in inscrits" :key="item['ID_ENFANT'] || item['ID_MEMBRE']">
        {{item['NOM_ENFANT'] || item['NOM_MEMBRE']}} {{item['PRENOM_ENFANT'] || item['PRENOM_MEMBRE']}}
      </li>
    </ul>
    <div class="row" v-if="activite">
        <stats-card>
          <div class="text-center" slot="header">
            <img class="activite-icon" :src="getIcon(activite['NOM_ACTIVITE'])" />
          </div>
          <div class="numbers" slot="content">
            <p>{{activite['NOM_ACTIVITE']}}</p>
          </div>
          <div class="stats" slot="footer">
            place(s) restante(s) : {{activite['MAX_INSCRIT'] - activite['INSCRITS']}}
          </div>
        </stats-card>
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
        'getActivite'
      ]),
      activite () {
        return this.getActivite(this.idActivite)
      },
      inscrits () {
        return this.getActiviteMembers(this.idActivite)
      }
    },
    data () {
      return {
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
</style>
