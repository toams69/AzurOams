<template>
  <div class="reglements-table">
    <div class="reglement-actions">
      <button class="btn btn-icon btn-simple" title="ajouter un réglement" @click="dialogVisible = true">
        <i class='ti-plus'></i>
      </button>
      <button class="btn btn-icon btn-simple" title="supprimer le réglement">
        <i class='ti-trash'></i>
      </button>
    </div>  
    <el-dialog
      title="Ajout d'un réglement"
      :visible.sync="dialogVisible"
      width="30%"
      append-to-body >
      <span>  
        <reglement-form :facture='this.facture' :reglement='this.newReglement'></reglement-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">Annuler</el-button>
        <el-button type="primary" @click="addReglement">Ajouter</el-button>
      </span>
    </el-dialog>
    <el-table class="table table-striped table-no-bordered table-hover"
        :data="tableData"
        highlight-current-row
        border
        style="width: 100%">
      <el-table-column v-for="column in tableColumns"
          :key="column.id"
          :min-width="column.minWidth"
          :prop="column.prop"
          :label="column.label"
          :filters='column.filters'
          :formatter='column.formatter'
          >
      </el-table-column>
      <el-table-column
          label=""
          min-width="50px"
        >
          <template slot-scope="scope">
            <div @click="showSwal(scope.row)" style="cursor: pointer">
              <el-tooltip placement="top">
                <div slot="content">
                  {{scope.row['NOM_TYPE_REGLEMENT']}}<br/>
                  Code Analytique {{scope.row['CODE_ANA']}}
                  <span v-if="scope.row['NOM_BANQUE']"><br/>Banque {{scope.row['NOM_BANQUE']}}</span>
                  <span v-if="scope.row['CHEQUE_NUM']"><br/>Numéro du chèque {{scope.row['CHEQUE_NUM']}}</span>
                </div>
                <i class="ti-info-alt"></i>
              </el-tooltip>

              <el-tooltip placement="top" v-if="scope.row['ENCAISSE_DATE']">
                <div slot="content">
                  Encaissé le {{scope.row['ENCAISSE_DATE'] | moment("dddd D MMMM YYYY") }}
                  <span v-if="scope.row['BORDERAU_NUM']"><br/>Numéro du borderau {{scope.row['BORDERAU_NUM']}}</span>
                </div>
                &nbsp;&nbsp;<i class="ti-check"></i>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
    </el-table>
  </div>
</template>
<script>
  import Vue from 'vue'
  import {Table, TableColumn} from 'element-ui'
  import moment from 'moment'
  import swal from 'sweetalert2'
  import ReglementForm from '@/components/Factures/ReglementForm'

  Vue.use(Table)
  Vue.use(TableColumn)
  export default{
    components: {
      ReglementForm
    },
    props: {
      tableData: {
        type: Array
      },
      facture: {
        type: Object,
        default: function () {
          return {}
        }
      }
    },
    data () {
      return {
        dialogVisible: false,
        newReglement: {},
        tableColumns: [
          {
            prop: 'ID_REGLEMENT',
            minWidth: '30px',
            label: '#'
          },
          {
            prop: 'DATE_REGLEMENT',
            label: 'Date du réglement',
            formatter: this.dateFormater
          },
          {
            prop: 'MONTANT_REGLEMENT',
            label: 'Montant'
          },
          {
            prop: 'NOM_TYPE_REGLEMENT',
            label: 'Type'
          }
        ]
      }
    },
    methods: {
      dateFormater (row, column) {
        return moment(row['DATE_REGLEMENT']).format('DD/MM/YYYY')
      },
      showSwal (reglement) {
        let html = '<div style=\'text-align: left;\'><br/><b>Code Analytique</b> ' + reglement['CODE_ANA']
        if (reglement['NOM_BANQUE']) {
          html += ' <br/><b>Banque</b> ' + reglement['NOM_BANQUE']
        }
        if (reglement['CHEQUE_NUM']) {
          html += ' <br/><b>Numéro du chèque</b> ' + reglement['CHEQUE_NUM']
        }
        if (reglement['ENCAISSE_DATE']) {
          html += ' <br/><b>Encaissé le </b> ' + moment(reglement['DATE_REGLEMENT']).format('DD/MM/YYYY')
        }
        if (reglement['BORDERAU_NUM']) {
          html += ' <br/><b>Numéro du borderau</b> ' + reglement['BORDERAU_NUM']
        }
        html += '<br/></div>'
        swal({
          title: 'Réglement #' + reglement['ID_REGLEMENT'],
          animation: false,
          type: reglement['ENCAISSE_DATE'] ? 'success' : 'error',
          buttonsStyling: false,
          confirmButtonClass: 'btn btn-success btn-fill',
          html: html
        })
      },
      addReglement () {
        this.$store.dispatch('ADD_REGLEMENT', {factureId: this.facture['ID_FACTURE'], reglement: this.newReglement}).then(() => {
          this.dialogVisible = false
          this.$notify({
            component: {
              template: `<span>Ajout effectué avec succès</span>`
            },
            icon: 'ti-thumb-up',
            horizontalAlign: 'center',
            verticalAlign: 'bottom',
            type: 'success'
          })
        })
      }
    }
  }
</script>
<style scoped lang="scss">
.reglement-actions {
    background: white;
    position: relative;
    margin-bottom: 5px;
    height: 100%;
    .btn {
      margin-left: 5px;
      padding: 0px 0px;
      vertical-align: text-bottom;
      i {
        color: #9A9A9A;
        &:hover {
          color: #409EFF;
        }
      }
    }
  }
</style>
