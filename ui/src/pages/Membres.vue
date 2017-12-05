<template>
  <multipane class="custom-resizer" layout="vertical">
    <div class="pane" :style="idEnfantSelected||idAdulteSelected ? { minWidth: '30%', width: '50%' } : { minWidth: '100%', width: '100%' } ">
        <button type="button" class="add-member btn btn-wd btn-info btn-fill btn-magnify" @click="dialogVisible = true">
           Ajouter un membre
        </button>
        <membre-tables @membreSelected="onMembreSelected" ref="table" :tableData='this.$store.state.membres.list'></membre-tables>
    </div>
    <el-dialog
      title=""
      :visible.sync="dialogVisible"
      width="60%"
      append-to-body >
      <span>  
        <new-membre :familles='this.$store.state.membres.groups'></new-membre>
      </span>
    </el-dialog>
    <multipane-resizer v-if="idEnfantSelected||idAdulteSelected"></multipane-resizer>
    <div class="pane" :style="{ flexGrow: 1 }" v-if="idEnfantSelected||idAdulteSelected">
      <div class="membres-details">
        <el-tabs v-model="activeName">
          <el-tab-pane label="Informations Générales" name="informations">
            <enfant-form v-if='idEnfantSelected' v-on:save='saveEnfant' v-on:resetEnfant="resetEnfant" :configuration='getFullConfiguration()' :enfant='getEnfantById(idEnfantSelected)' :famille='getFamilleById(idFamilleSelected)'></enfant-form>
            <adulte-form v-if='idAdulteSelected' v-on:save='saveAdulte' v-on:reset="resetAdulte" :configuration='getFullConfiguration()' :adulte='getAdulteById(idAdulteSelected)' :famille='getFamilleById(idFamilleSelected)'></adulte-form>            
          </el-tab-pane>
          <el-tab-pane label="Famille" name="famille">
            <famille-form v-if='idFamilleSelected' :configuration='getFullConfiguration()' :famille='getFamilleById(idFamilleSelected)' :membres='getMembresFamilleById(idFamilleSelected)' v-on:save='saveFamille' v-on:reset="resetFamille" v-on:membreSelected='onMembreToDisplay'></famille-form>
          </el-tab-pane>
          <!-- <el-tab-pane label="Activités" name="activites">
          </el-tab-pane> -->
          <el-tab-pane label="Factures" name="factures">
            <div v-if="idEnfantSelected||idAdulteSelected">
              <div class="facture-details">
                  <button :disabled="!idFactureSelected" class="btn btn-icon btn-simple" title="imprimer la facture" @click="imprimerFacture">
                    <i class='ti-printer'></i>
                  </button>
                  <button :disabled="!idFactureSelected" class="btn btn-icon btn-simple" title="supprimer la facture">
                    <i class='ti-trash'></i>
                  </button>
              </div>
              <MembreFacturesTable :factures='idEnfantSelected ? getFactureByEnfantId(idEnfantSelected) : idAdulteSelected ? getFactureByAdulteId(idAdulteSelected) : []' @factureSelected="onFactureSelected"></MembreFacturesTable>
              <div v-if="idFactureSelected" class="facture-details">
                <br/>
                <el-tabs v-model="active2Name">
                  <el-tab-pane label="Détails" name="details">
                    <facture :facture='getFactureById(idFactureSelected)' ></facture>
                  </el-tab-pane>
                  <el-tab-pane label="Réglements" name="reglements">
                    <reglements-table :tableData='getReglemensByFactureId(idFactureSelected)' :facture='getFactureById(idFactureSelected)'></reglements-table>
                  </el-tab-pane>
                </el-tabs>
                <div class='hidden'>
                  <facture-print :facture='getFactureById(idFactureSelected)' id='facturePrint' ></facture-print>
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </multipane>
</template>
<script>
  import { Multipane, MultipaneResizer } from 'vue-multipane'
  import EnfantForm from '@/components/Membres/EnfantForm'
  import AdulteForm from '@/components/Membres/AdulteForm'
  import FamilleForm from '@/components/Membres/FamilleForm'
  import MembreTables from '@/components/Membres/MembresTable'
  import NewMembre from '@/components/Membres/NewMembre'
  import Facture from '@/components/Factures/Facture'
  import MembreFacturesTable from '@/components/Membres/MembreFacturesTable'
  import ReglementsTable from '@/components/Factures/ReglementsTable'
  import FacturePrint from '@/components/Factures/FacturePrint'
  import { mapGetters } from 'vuex'
  export default {
    components: {
      Multipane,
      MultipaneResizer,
      MembreTables,
      MembreFacturesTable,
      ReglementsTable,
      Facture,
      FacturePrint,
      EnfantForm,
      AdulteForm,
      FamilleForm,
      NewMembre
    },
    computed: {
      // mix the getters into computed with object spread operator
      ...mapGetters([
        'getFamilleById',
        'getEnfantById',
        'getAdulteById',
        'getFactureByEnfantId',
        'getFactureByAdulteId',
        'getReglemensByFactureId',
        'getFactureById',
        'getFullConfiguration',
        'getMembresFamilleById'
      ])
    },
    data () {
      return {
        dialogVisible: false,
        activeName: 'informations',
        active2Name: 'details',
        idEnfantSelected: null,
        idFamilleSelected: null,
        idAdulteSelected: null,
        idFactureSelected: null
      }
    },
    methods: {
      onMembreToDisplay (membre) {
        if (this.$refs && this.$refs.table) {
          this.$refs.table.setCurrentRow(membre)
          this.activeName = 'informations'
          this.active2Name = 'details'
        }
      },
      onMembreSelected (membre) {
        if (!membre) {
          this.idEnfantSelected = null
          this.idFamilleSelected = null
          this.idAdulteSelected = null
          this.idFactureSelected = null
          return
        }
        if (membre) {
          this.$store.dispatch('GET_FAMILLE', membre['ID_FAMILLE'])
        }
        if (membre['ID_ENFANT']) {
          this.$store.dispatch('GET_ENFANT', membre['ID_ENFANT'])
          this.idEnfantSelected = membre['ID_ENFANT']
          this.idFactureSelected = null
          this.idAdulteSelected = null
        } else {
          this.$store.dispatch('GET_ADULTE', membre['ID_MEMBRE'])
          this.idEnfantSelected = null
          this.idFactureSelected = null
          this.idAdulteSelected = membre['ID_MEMBRE']
        }
        this.idFamilleSelected = membre['ID_FAMILLE']
      },
      onFactureSelected (facture) {
        this.$store.dispatch('GET_FACTURE', facture['ID_FACTURE'])
        this.idFactureSelected = facture['ID_FACTURE']
      },
      imprimerFacture () {
        var source = document.getElementById('facturePrint')
        var destination = document.getElementById('print')
        var copy = source.cloneNode(true)
        copy.setAttribute('id', 'print')
        destination.parentNode.replaceChild(copy, destination)
        window.print()
      },
      saveEnfant (enfant) {
        this.$store.dispatch('SAVE_ENFANT', enfant).then(() => {
          this.$notify({
            component: {
              template: `<span>Sauvegarde effectué avec succès</span>`
            },
            icon: 'ti-thumb-up',
            horizontalAlign: 'center',
            verticalAlign: 'bottom',
            type: 'success'
          })
        })
      },
      resetEnfant (enfant) {
        this.$store.dispatch('GET_ENFANT', enfant['ID_ENFANT'])
      },
      saveAdulte (adulte) {
        this.$store.dispatch('SAVE_ADULTE', adulte).then(() => {
          this.$notify({
            component: {
              template: `<span>Sauvegarde effectué avec succès</span>`
            },
            icon: 'ti-thumb-up',
            horizontalAlign: 'center',
            verticalAlign: 'bottom',
            type: 'success'
          })
        })
      },
      resetAdulte (adulte) {
        this.$store.dispatch('GET_ADULTE', adulte['ID_MEMBRE'])
      },
      saveFamille (famille) {
        this.$store.dispatch('SAVE_FAMILLE', famille).then(() => {
          this.$notify({
            component: {
              template: `<span>Sauvegarde effectué avec succès</span>`
            },
            icon: 'ti-thumb-up',
            horizontalAlign: 'center',
            verticalAlign: 'bottom',
            type: 'success'
          })
        })
      },
      resetFamille (famille) {
        this.$store.dispatch('GET_FAMILLE', famille['ID_FAMILLE'])
      }
    }
  }
</script>
<style lang="scss" scoped>
  .add-member {
    position: absolute;
    z-index: 10;
    top: 17px;
    right: 17px;
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
    border: 1px solid #cfcfca;
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
  .membres-details {
    background: white;
    padding: 10px 15px;
    position: relative;
    height: 100%;
    overflow-y: auto;
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
  .facture-details {
    background: white;
    padding: 10px 5px;
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
  .facture-id {
    font-size: 14px;
    font-weight: 400;
    color: #9A9A9A;
    margin-bottom: 0px;
  }
</style>