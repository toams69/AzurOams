<template>
  <div class="clsh-inscription">
    <form-wizard
      title="Nouvelle inscription"
      subtitle=''
      shape="square"
      @on-complete="wizardComplete"
      error-color="#EB5E28"
      step-size="xs"
      color="#3498db">
      <p slot="title"></p>
      <tab-content title="Choix de l'enfant"
                  icon="ti-user">
        <p>Merci de selectionner un enfant avant de passer à l'étape suivante</p>
        <el-autocomplete
          class="inline-input"
          v-model="membre"
          :fetch-suggestions="querySearch"
          placeholder="Selectionner un enfant"
          :trigger-on-focus="false"
          @select="handleSelect"
        ></el-autocomplete>
      </tab-content>

      <tab-content title="Choix des dates"
                  icon="ti-calendar">

        <el-table class="table table-striped table-no-bordered table-hover"
            :data="tableData"
            @cell-click='handleCellClicked'
            border
            style="width: 90%">
          <el-table-column v-for="column in tableSejourColumns"
              :key="column.id"
              :min-width="column.minWidth"
              :width="column.width"
              :prop="column.prop"
              :label="column.label"
              :filters='column.filters'
              :formatter='column.formatter'
              >
          </el-table-column>
        </el-table>
      </tab-content>

      <tab-content title="Facturation"
                  icon="ti-book">
        
        <div class="form-group">
          <label class="">Membre</label>
          <div style="display:inline-block; margin-left:10px;">
            {{membreSelected['NOM_MEMBRE']}} {{membreSelected['PRENOM_MEMBRE']}}
          </div>
        </div>
        <div class="form-group">
          <label class="">Table Tarifaire</label>
          <div style="display:inline-block; margin-left:10px;">
            {{sejour.tableTarif['NOM_TABLE']}}
          </div>
        </div>
        <div class="form-group">
          <label class="">Coeficient Caf à appliquer</label>
          <div style="display:inline-block; margin-left:10px;">
            <input type='number' v-model="coefCaf"/>
          </div>
        </div>
        <div v-if='idFacture' class="form-group">
          <label class=""># Facture</label>
          <div style="display:inline-block; margin-left:10px;">
            {{idFacture}}
          </div>
        </div>
        <div class="form-group">
          <label class="">Montant par journée</label>
          <el-table class="table table-striped table-no-bordered table-hover"
            :data="tableData2"
            border
            style="width: 90%">
            <el-table-column v-for="column in tableSejourColumns2"
                :key="column.id"
                :min-width="column.minWidth"
                :width="column.width"
                :prop="column.prop"
                :label="column.label"
                :filters='column.filters'
                :formatter='column.formatter'
                >
            </el-table-column>
            <el-table-column
            v-if='this.ristournes.length'
            label="Ristourne"
            width="110">
            <template slot-scope="scope">
              <el-select placeholder="%" v-model="scope.row.ristourne" @change="setMontant">
                <el-option  :key="0"
                            :label="none"
                            :value="null">
                </el-option>
                <el-option v-for="item in scope.row.ristournes" 
                            :key="item['ID_RISTOURNE']"
                            :label="item['PRCT_RISTOURNE'] + '%'"
                            :value="item['ID_RISTOURNE']">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          </el-table>
        </div>
        <div class="form-group">
          <label class="">Total</label>
          <div style="display:inline-block; margin-left:10px;">
            <input v-model="prix" />
          </div>
        </div>

      </tab-content>

      <tab-content title="Valider"
                  icon="ti-check">
        <div v-if='idFacture'>
          La facture <b>#{{idFacture}}</b> pour l'enfant <b>{{membreSelected['NOM_MEMBRE']}} {{membreSelected['PRENOM_MEMBRE']}}</b> va être mise à jour avec les informations suivantes
          <br/><br/>
          Jour(s) d'activités - <b>{{ this.tableData.filter((e) => e._periodes.length).length}}</b> <br/><br/>
          Prix - <b>{{this.prix}} €</b>
        </div>
      </tab-content>

        <button slot="prev" class="btn btn-default btn-fill btn-wd btn-back">Précédent</button>
        <button slot="next" class="btn btn-info btn-fill btn-wd btn-next">Suivant</button>
        <button slot="finish" class="btn btn-info btn-fill btn-wd">Terminer</button>
      </form-wizard>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'
  import moment from 'moment'
  import {FormWizard, TabContent} from 'vue-form-wizard'
  import 'vue-form-wizard/dist/vue-form-wizard.min.css'

  export default {
    props: {
      sejour: {
        type: Object
      },
      idSejour: {
        type: Number
      }
    },
    components: {
      FormWizard,
      TabContent
    },
    computed: {
      // mix the getters into computed with object spread operator
      ...mapGetters([
        'getAllEnfant',
        'getSejourDateForMembre',
        'getPeriodesSejour',
        'getTarifForPeriodes',
        'getFamilleById'
      ]),
      ristournes () {
        if (this.sejour && this.sejour.tableTarif && this.sejour.tableTarif.ristournes) {
          return this.sejour.tableTarif.ristournes
        } else {
          return []
        }
      },
      prix () {
        return this.tableData2.reduce((accumulator, item) => accumulator + item.PRIX, 0)
      },
      tableData2 () {
        return this.tableData.filter((e) => {
          return e._periodes.length
        }).map((item) => {
          let price = this.getTarifForPeriodes(this.idSejour, this.coefCaf, item._periodes.map((p) => parseInt(p)))
          if (item.ristourne) {
            const r = this.ristournes.find((r) => r['ID_RISTOURNE'] === item.ristourne)
            price = price - (price * r['PRCT_RISTOURNE'] / 100)
          }
          return {
            ...item,
            PRIX: price
          }
        })
      },
      tableSejourColumns () {
        var periodes = this.getPeriodesSejour(this.idSejour)
        console.log(periodes)
        if (periodes.length === 6 && !find(periodes, function (p) {
          return ['M', 'M+R', 'JC', 'JC+R', 'AM', 'AM+R'].indexOf(p['ABREVIATION_PERIODE']) === -1
        })) {
          return [
            {
              prop: 'DATE_JOURNEE',
              width: 200,
              label: 'Date',
              formatter: this.dateFormater
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
              width: 200,
              formatter: this.dateFormater
            },
            ...periodes.map((periode) => {
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
      tableSejourColumns2 () {
        var ret = this.tableSejourColumns.slice(0)
        ret.push({
          width: 100,
          prop: 'PRIX',
          label: 'Prix'
        })
        return ret
      },
      dateSelected () {
        return {}
      }
    },
    data () {
      return {
        membre: '',
        idFacture: null,
        coefCaf: 0,
        membreSelected: {},
        tableData: [],
        active: 0
      }
    },
    methods: {
      setMontant () {
        this.tableData = this.tableData2.slice(0)
      },
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
      dateFormater (row, column) {
        return moment(row['DATE_JOURNEE']).format('dddd DD MMMM YYYY')
      },
      periodeFormater (row, column) {
        return row._periodes.indexOf(column.property) !== -1 ? 'X' : ''
      },
      handleCellClicked (row, column) {
        var i = row._periodes.indexOf(column.property)
        if (i !== -1) {
          row._periodes.splice(i, 1)
        } else {
          row._periodes.push(column.property)
        }
        this.tableData = this.tableData.slice(0)
      },
      handleSelect (item) {
        this.membreSelected = item.model
        this.tableData = this.getSejourDateForMembre(this.idSejour, this.membreSelected['ID_ENFANT'])
        this.tableData.forEach((d) => { d.ristournes = this.ristournes })
        const fam = this.getFamilleById(this.membreSelected['ID_FAMILLE'])
        this.coefCaf = fam ? fam['QUOTIENT_CAF_FAMILLE'] : 0
        this.idFacture = null
        this.sejour.journees.forEach((j) => {
          const i = j.inscrits.find((i) => {
            return i['ID_ENFANT'] === this.membreSelected['ID_ENFANT']
          })
          if (i) {
            this.idFacture = i['ID_FACTURE']
            return false
          }
        })
      },
      wizardComplete () {
      }
    }
  }
</script>
<style scoped lang="scss">
  
</style>
<style lang='scss'>
  .sejour-details {
    .vue-form-wizard {
      .wizard-tab-content {
        min-height: 400px;
      }
      .wizard-card-footer {
        text-align: center;
        .wizard-footer-right, .wizard-footer-left {
          float: none;
          display: inline-block;
        }
      }
    }
    .clsh-inscription {
      .wizard-header {
        padding: 5px;
      }
      .vue-form-wizard .wizard-tab-content {
        padding: 15px 20px 10px;
      }
      .el-table td .cell {
        height: 40px;
        line-height: 40px;
      }
      .el-input__inner {
        padding: 0 9px;
      }
    }
  }
  
</style>
