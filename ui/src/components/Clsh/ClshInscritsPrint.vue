<template>
<div class="az-page-clsh-inscription">
	<img src="static/img/top-inscrit-cl.png" />

	<div class="info-clsh-container">
{{sejour['NOM_SEJOUR']}}
{{dateSelected['DATE_JOURNEE'] | moment("dddd D MMMM YYYY")}}
	</div>

	<div class="inscrits-list">
		<el-table v-if="dateSelected" class="table table-striped table-no-bordered table-hover"
        :data="dateSelected.inscrits"
        highlight-current-row
        border
        :default-sort = "{prop: 'NOM_ENFANT', order: 'ascending'}"
        :summary-method="getSummaries"
        show-summary
        style="width: 100%">
      <el-table-column
        type="index"
        width="50">
      </el-table-column>
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
  import Vue from 'vue'
  import { mapGetters } from 'vuex'
  import {Table, TableColumn} from 'element-ui'
  import { find } from 'lodash'

  Vue.use(Table)
  Vue.use(TableColumn)

  export default {
    props: {
      dateSelected: {
        type: Object
      },
      sejour: {
        type: Object
      }
    },
    computed: {
      // mix the getters into computed with object spread operator
      ...mapGetters([
        'getPeriodesSejour'
      ]),
      tableMembreColumns () {
        var periodes = this.getPeriodesSejour(this.dateSelected['ID_SEJOUR'])
        if (!find(periodes, function (p) {
          return ['M', 'M+R', 'JC', 'JC+R', 'AM', 'AM+R'].indexOf(p['ABREVIATION_PERIODE']) === -1
        })) {
          // Matin Apres midi et repas only
          return [
            {
              prop: 'NOM_ENFANT',
              minWidth: 150,
              label: 'Nom'
            },
            {
              prop: 'PRENOM_ENFANT',
              minWidth: 150,
              label: 'Prénom'
            },
            {
              prop: 'AM',
              label: 'AM',
              minWidth: 40,
              formatter: this.periodeFormater
            },
            {
              prop: 'PM',
              label: 'PM',
              minWidth: 40,
              formatter: this.periodeFormater
            },
            {
              prop: 'REPAS',
              label: 'R',
              minWidth: 40,
              formatter: this.periodeFormater
            },
            {
              prop: 'Info',
              label: 'Infos',
              minWidth: 100
            },
            {
              prop: 'A',
              label: 'A',
              minWidth: 50
            },
            {
              prop: 'D',
              label: 'D',
              minWidth: 50
            },
            {
              prop: 'T',
              label: 'T',
              minWidth: 50
            }
          ]
        } else {
          return [
            {
              prop: 'NOM_ENFANT',
              label: 'Nom'
            },
            {
              prop: 'PRENOM_ENFANT',
              label: 'Prénom'
            },
            ...periodes.map((periode) => {
              return {
                prop: '' + periode['ID_PERIODE_QUOTIDIENNE'],
                label: periode['INTITULE_PERIODE'],
                minWidth: 30,
                formatter: this.periodeFormater
              }
            }),
            {
              prop: 'Info',
              label: 'Infos',
              minWidth: 100
            },
            {
              prop: 'A',
              label: 'A',
              minWidth: 50
            },
            {
              prop: 'D',
              label: 'D',
              minWidth: 50
            },
            {
              prop: 'T',
              label: 'T',
              minWidth: 50
            }
          ]
        }
      }
    },
    data () {
      return {
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
      getSummaries (param) {
        const { columns, data } = param
        const sums = []
        columns.forEach((column, index) => {
          if (index === 1) {
            sums[index] = 'Total'
            return
          }
          if (index < 3) {
            sums[index] = ''
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
    }
  }
</script>
<style scoped lang="scss">
  .table {
    font-size: 11px;
  }
</style>
