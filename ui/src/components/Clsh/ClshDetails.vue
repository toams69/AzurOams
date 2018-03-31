<template>
  <div class="row" v-if="sejour">
      <div class="sejour-details">
        <img class="sejour-icon" :src="getIcon(sejour['ID_SECTEUR'])" />
        <h3>{{sejour['NOM_SEJOUR']}}</h3>
        <span><i style='height:40px; vertical-align: bottom;'>({{sejour['NUMERO_AGREMENTATION']}})</i></span>
        <el-tabs v-model="activeName" class='tabs'>
          <el-tab-pane label="Informations" name="first">
            
          </el-tab-pane>
          <el-tab-pane label="Calendrier" name="second">
            <multipane class="custom-resizer" layout="vertical">
              <div class="pane" :style="dateSelected ? { minWidth: '250px', width: '300px' } : { minWidth: '100%', width: '100%' } ">
                <h5>Dates du séjour</h5>
                <el-table class="table table-striped table-no-bordered table-hover"
                    :data="tableData"
                    highlight-current-row
                    @row-click="handleCalendarCurrentChange"
                    border
                    ref="table"
                    max-height='300px'
                    style="width: 100%">
                  <el-table-column v-for="column in tableCalendarColumns"
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
              <multipane-resizer v-if="dateSelected"></multipane-resizer>
              <div class="pane" :style="{ flexGrow: 1,  minWidth: '711px' }" v-if="dateSelected">
                <h5>Inscrits ({{dateSelected.inscrits.length }})</h5>
                <el-table v-if="dateSelected" class="table table-striped table-no-bordered table-hover"
                    :data="dateSelected.inscrits"
                    highlight-current-row
                    border
                    max-height=500
                    :default-sort = "{prop: 'NOM_ENFANT', order: 'ascending'}"
                    style="width: 100%">
                  <el-table-column v-for="column in tableMembreColumns"
                      :key="column.id"
                      :min-width="column.minWidth"
                      :prop="column.prop"
                      :label="column.label"
                      :filters='column.filters'
                      :formatter='column.formatter'
                      sortable
                      >
                  </el-table-column>
                </el-table>
              </div>
           </multipane>
          </el-tab-pane>
          <el-tab-pane label="Présences" name="third">
            
          </el-tab-pane>
        </el-tabs>
        <button type="button" class="btn btn-wd btn-default btn-fill btn-move-left" @click="onBackPressed">
          <span class="btn-label">
              <i class="ti-angle-left"></i>
          </span>
          Retour
        </button>
      </div>
  </div>
</template> 
<script>
  import Vue from 'vue'
  import { mapGetters } from 'vuex'
  import StatsCard from '@/components/Cards/StatsCard.vue'
  import {Table, TableColumn} from 'element-ui'
  import moment from 'moment'
  import { find } from 'lodash'
  import { Multipane, MultipaneResizer } from 'vue-multipane'
  
  Vue.use(Table)
  Vue.use(TableColumn)

  export default {
    components: {
      Multipane,
      MultipaneResizer,
      StatsCard
    },
    computed: {
      // mix the getters into computed with object spread operator
      ...mapGetters([
        'getSejour',
        'getSejourDate',
        'getPeriodesSejour'
      ]),
      sejour () {
        return this.getSejour(this.idSejour)
      },
      tableData () {
        return this.getSejourDate(this.idSejour)
      },
      tableCalendarColumns () {
        if (this.dateSelected) {
          return [
            {
              prop: 'DATE_JOURNEE',
              label: 'Date',
              formatter: this.dateFormater
            },
            {
              prop: 'count',
              label: '',
              minWidth: 20,
              formatter: this.nbInscrit
            }
          ]
        }
        var periodes = this.getPeriodesSejour(this.idSejour)
        if (!find(periodes, function (p) {
          return ['M', 'M+R', 'JC', 'JC+R', 'AM', 'AM+R'].indexOf(p['ABREVIATION_PERIODE']) === -1
        })) {
          return [
            {
              prop: 'DATE_JOURNEE',
              label: 'Date',
              formatter: this.dateFormater
            },
            {
              prop: 'count',
              label: 'Inscrits',
              formatter: this.nbInscrit
            },
            {
              prop: 'AM',
              label: 'Matin',
              formatter: this.periodeFormater
            },
            {
              prop: 'PM',
              label: 'Après Midi',
              formatter: this.periodeFormater
            },
            {
              prop: 'REPAS',
              label: 'Repas',
              formatter: this.periodeFormater
            }
          ]
        } else {
          return [
            {
              prop: 'DATE_JOURNEE',
              label: 'Date',
              formatter: this.dateFormater
            },
            ...this.getPeriodesSejour(this.idSejour).map((periode) => {
              return {
                prop: '' + periode['ID_PERIODE_QUOTIDIENNE'],
                label: periode['INTITULE_PERIODE'],
                minWidth: 15,
                formatter: this.periodeFormater
              }
            })
          ]
        }
      },
      tableMembreColumns () {
        var periodes = this.getPeriodesSejour(this.idSejour)
        if (!find(periodes, function (p) {
          return ['M', 'M+R', 'JC', 'JC+R', 'AM', 'AM+R'].indexOf(p['ABREVIATION_PERIODE']) === -1
        })) {
          // Matin Apres midi et repas only
          return [
            {
              prop: 'NOM_ENFANT',
              label: 'Nom'
            },
            {
              prop: 'PRENOM_ENFANT',
              label: 'Prénom'
            },
            {
              prop: 'AGE_MEMBRE',
              label: 'Age'
            },
            {
              prop: 'AM',
              label: 'Matin',
              formatter: this.periodeFormater
            },
            {
              prop: 'PM',
              label: 'Après Midi',
              formatter: this.periodeFormater
            },
            {
              prop: 'REPAS',
              label: 'Repas',
              formatter: this.periodeFormater
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
            {
              prop: 'AGE_MEMBRE',
              label: 'Age'
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
      }
    },
    data () {
      return {
        activeName: 'first',
        dateSelected: null
      }
    },
    props: {
      idSejour: null
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
      },
      onBackPressed () {
        window.history.back()
      },
      handleCalendarCurrentChange (elem) {
        if (this.dateSelected && this.dateSelected['ID_JOURNEE'] === elem['ID_JOURNEE']) {
          this.dateSelected = null
          if (this.$refs && this.$refs.table) {
            this.$refs.table.clearSelection()
          }
        } else {
          this.dateSelected = elem
        }
      },
      dateFormater (row, column) {
        return moment(row['DATE_JOURNEE']).format('dddd DD MMMM YYYY')
      },
      nbInscrit (row, column) {
        return row.inscrits.length
      },
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
      }
    },
    mounted () {
      this.$store.dispatch('GET_SEJOUR', this.idSejour)
    },
    created () {
    }
  }
</script>
<style lang="scss" scoped>
  .sejour-icon {
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
  .sejour-details {
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

  .custom-resizer {
    position: absolute;
    top: 15px;
    bottom: 15px;
    left: 15px;
    right: 15px;
  }
  .custom-resizer > .pane {
    text-align: left;
    padding: 0px;
    overflow: hidden; 
    // .table {
    //   overflow-y: auto;
    //   position: absolute;
    //   top: 50px;
    //   bottom: 0px;
    // }
  }
  .custom-resizer > .multipane-resizer {
    margin: 0; left: 0;
    position: relative;
    &:before {
      display: block;
      content: "";
      width: 2px;
      position: absolute;
      top: 20%;
      left: 50%;
      bottom: 20%;  
      margin-left: -1px;
    }
    &:hover {
      &:before {
        background: #25afff;
      }
    }
  }
</style>
<style lang="scss">
.sejour-details {
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
