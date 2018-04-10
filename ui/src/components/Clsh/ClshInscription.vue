<template>
  <div class="clsh-inscription">
    <form-wizard
      title="Nouvelle inscription"
      subtitle=''
      shape="square"
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
            border
            max-height=300
            style="width: 90%">
          <el-table-column v-for="column in tableSejourColumns"
              :key="column.id"
              :min-width="column.minWidth"
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
      
      </tab-content>

      <tab-content title="Valider"
                  icon="ti-check">
      
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
        'getSejourDate',
        'getPeriodesSejour'
      ]),
      tableData () {
        return this.getSejourDate(this.sejour['ID_SEJOUR'])
      },
      tableSejourColumns () {
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
      }
    },
    data () {
      return {
        membre: '',
        active: 0
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
      dateFormater (row, column) {
        return moment(row['DATE_JOURNEE']).format('dddd DD MMMM YYYY')
      },
      periodeFormater (row, column) {
        return ''
      },
      handleSelect (item) {
        console.log(item)
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
        height: 400px;
      }
      .wizard-card-footer {
        text-align: center;
        .wizard-footer-right, .wizard-footer-left {
          float: none;
          display: inline-block;
        }
      }
    }
  }
</style>
