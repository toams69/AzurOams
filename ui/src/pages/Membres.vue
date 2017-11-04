<template>
  <multipane class="custom-resizer" layout="vertical">
    <div class="pane" :style="{ minWidth: '30%', width: '50%' }">
        <membre-tables @membreSelected="onMembreSelected"></membre-tables>
    </div>
    <multipane-resizer></multipane-resizer>
    <div class="pane" :style="{ flexGrow: 1 }">
      <div class="membres-details">
        <el-tabs v-model="activeName">
          <el-tab-pane label="Informations" name="informations" class="informations-pane">
            <enfant v-if="idEnfantSelected" :enfant='getEnfantById(idEnfantSelected)'></enfant>
            <enfant v-if="idAdulteSelected" :enfant='getAdulteById(idAdulteSelected)'></enfant>
          </el-tab-pane>
          <el-tab-pane label="Activités" name="activites">
            
          </el-tab-pane>
          <el-tab-pane label="Factures" name="factures">
            <MembreFacturesTable :factures='idEnfantSelected ? getFactureByEnfantId(idEnfantSelected) : idAdulteSelected ? getFactureByAdulteId(idAdulteSelected) : []' @factureSelected="onFactureSelected"></MembreFacturesTable>
            <div v-if="idFactureSelected" class="facture-details">
              <div class="facture-id">
                Facture #{{idFactureSelected}} -
                <button class="btn btn-icon btn-simple" title="imprimer la facture" @click="imprimerFacture">
                  <i class='ti-printer'></i>
                </button>
                <button class="btn btn-icon btn-simple" title="supprimer la facture">
                  <i class='ti-trash'></i>
                </button>
              </div>  
              <br/>
              <el-tabs v-model="active2Name">
                <el-tab-pane label="Détails" name="details">
                  <facture :facture='getFactureById(idFactureSelected)' ></facture>
                </el-tab-pane>
                <el-tab-pane label="Réglements" name="reglements">
                  <reglements-table :tableData='getReglemensByFactureId(idFactureSelected)'></reglements-table>
                </el-tab-pane>
              </el-tabs>
              <div class='hidden'>
                <facture-print :facture='getFactureById(idFactureSelected)' id='facturePrint' ></facture-print>
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
  import Enfant from '@/components/Membres/Enfant'
  import MembreTables from '@/components/Membres/MembresTable'
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
      Enfant
    },
    computed: {
      // mix the getters into computed with object spread operator
      ...mapGetters([
        'getEnfantById',
        'getAdulteById',
        'getFactureByEnfantId',
        'getFactureByAdulteId',
        'getReglemensByFactureId',
        'getFactureById'
      ])
    },
    data () {
      return {
        activeName: 'informations',
        active2Name: 'details',
        idEnfantSelected: null,
        idAdulteSelected: null,
        idFactureSelected: null
      }
    },
    methods: {
      onMembreSelected (membre) {
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
      }
    }
  }
</script>
<style lang="scss">
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
    padding: 25px 15px;
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