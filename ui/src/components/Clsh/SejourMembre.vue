<template>
  <div>
    <h5>Pour l'enfant</h5>{{membre['NOM_ENFANT']}} {{membre['PRENOM_ENFANT']}}

    <h5>Inscrit(e) pour les dates</h5>
    <div class="inscrits-list">
		<el-table class="table table-striped table-no-bordered table-hover"
        :data="getDates"
        highlight-current-row
        border
        :summary-method="getSummaries"
        show-summary
        max-height=300
        style="width: 100%">
      <el-table-column v-for="column in tableMembreColumns"
          :key="column.id"
          :min-width="column.minWidth"
          :prop="column.prop"
          :label="column.label"
          :filters='column.filters'
          :formatter='column.formatter'
          >
      </el-table-column>
    </el-table>
	</div>
  </div>
</template> 
<script>
  import { mapGetters } from 'vuex'
  import moment from 'moment'
  import { find } from 'lodash'

  export default {
    components: {
    },
    computed: {
      // mix the getters into computed with object spread operator
      ...mapGetters([
        'getPeriodesSejour'
      ]),
      tableMembreColumns () {
        var periodes = this.getPeriodesSejour(this.sejour['ID_SEJOUR'])
        if (!find(periodes, function (p) {
          return ['M', 'M+R', 'JC', 'JC+R', 'AM', 'AM+R'].indexOf(p['ABREVIATION_PERIODE']) === -1
        })) {
          // Matin Apres midi et repas only
          return [
            {
              prop: 'DATE_JOURNEE',
              minWidth: 150,
              label: 'Date',
              formatter: this.dateFormater
            },
            {
              prop: 'AM',
              label: 'Matin',
              minWidth: 40,
              formatter: this.periodeFormater
            },
            {
              prop: 'PM',
              label: 'Après-midi',
              minWidth: 40,
              formatter: this.periodeFormater
            },
            {
              prop: 'REPAS',
              label: 'Repas',
              minWidth: 40,
              formatter: this.periodeFormater
            }
          ]
        } else {
          return [
            {
              prop: 'DATE',
              minWidth: 150,
              label: 'Date'
            },
            ...periodes.map((periode) => {
              return {
                prop: '' + periode['ID_PERIODE_QUOTIDIENNE'],
                label: periode['INTITULE_PERIODE'],
                minWidth: 30,
                formatter: this.periodeFormater
              }
            })
          ]
        }
      },
      getDates () {
        const journees = this.sejour.journees.filter((j) => {
          return j.inscrits.find((i) => {
            return i['ID_ENFANT'] === this.membre['ID_ENFANT']
          })
        })
        return journees.map((j) => {
          const periodes = j.inscrits.find((i) => {
            return i['ID_ENFANT'] === this.membre['ID_ENFANT']
          }).periodes
          return {
            periodes: periodes,
            'DATE_JOURNEE': j['DATE_JOURNEE']
          }
        })
      }
    },
    data () {
      return {
      }
    },
    props: {
      membre: {
        type: Object
      },
      sejour: {
        type: Object
      }
    },
    methods: {
      periodeFormater (row, column) {
        if (['AM', 'PM', 'REPAS'].indexOf(column.property) >= 0) {
          switch (column.property) {
            case 'AM':
              return find(row.periodes, (p) => { return ['M', 'M+R', 'JC', 'JC+R'].indexOf(p['ABREVIATION_PERIODE']) > -1 }) ? 'X' : ''
            case 'PM':
              return find(row.periodes, (p) => { return ['AM', 'AM+R', 'JC', 'JC+R'].indexOf(p['ABREVIATION_PERIODE']) > -1 }) ? 'X' : ''
            case 'REPAS':
              return find(row.periodes, (p) => { return ['M+R', 'AM+R', 'JC+R'].indexOf(p['ABREVIATION_PERIODE']) > -1 }) ? 'X' : ''
          }
        } else {
          return find(row.periodes, (p) => { return '' + p['ID_PERIODE_QUOTIDIENNE'] === column.property }) ? 'X' : ''
        }
      },
      dateFormater (row, column) {
        return moment(row['DATE_JOURNEE']).format('dddd DD MMMM YYYY')
      },
      getSummaries (param) {
        const { columns, data } = param
        const sums = []
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = 'Total'
            return
          }
          sums[index] = data.reduce((prev, curr) => {
            if (this.periodeFormater(curr, column) === 'X') {
              return prev + 1
            }
            return prev
          }, 0)
          sums[index] = sums[index] || ''
        })
        return sums
      }
    },
    mounted () {
    },
    created () {
    }
  }
</script>
<style lang="scss" scoped>

</style>

