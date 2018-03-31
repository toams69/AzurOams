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
      <div class="col-lg-3 col-sm-6" v-for="sejour in sejours">
        <stats-card>
          <div class="text-center" slot="header">
            <img class="clsh-icon" :src="getIcon(sejour['ID_SECTEUR'])" />
          </div>
          <div class="numbers" slot="content">
            <p><b>{{sejour['NOM_SEJOUR']}}</b></p>
            <p style="font-size:12px"><i>{{sejour['NUMERO_AGREMENTATION']}}</i></p>
          </div>
          <div class="stats" slot="footer">
            secteur : 
            <router-link style="float:right" :to="{ path: 'clsh', query: { s: sejour['ID_SEJOUR'] }}">+ d'infos</router-link>
          </div>
        </stats-card>
      </div>
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
        'getRangeSejour',
        'getSejours'
      ]),
      sejours () {
        return this.getSejours().filter((s) => {
          return s.ANNEE === this.annee
        })
      },
      annees () {
        var range = this.getRangeSejour()
        var ret = []
        for (var i = range.min; i <= range.max; i++) {
          ret.push({value: i, label: i})
        }
        return ret
      }
    },
    data () {
      return {
        annee: (new Date()).getFullYear()
      }
    },
    methods: {
      getIcon (secteur) {
        if (secteur === 2) {
          return '/static/img/clsh/6-11ans.png'
        }
        if (secteur === 3) {
          return '/static/img/clsh/12-17ans.png'
        }
        return '/static/img/activites/other.svg'
      }
    },
    mounted () {
    },
    created () {
    }
  }
</script>
<style lang="scss" scoped>
  .clsh-icon {
    width: 50px;
  }
</style>
