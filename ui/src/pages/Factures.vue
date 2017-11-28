<template>
  <multipane class="custom-resizer" layout="vertical">
    <div class="pane" :style="{ minWidth: '30%', width: '50%' }">
        <FacturesTable @factureSelected="onFactureSelected" :factures='this.$store.state.factures.list'></FacturesTable>
    </div>
    <multipane-resizer></multipane-resizer>
    <div class="pane" :style="{ flexGrow: 1 }">
      <div class="facture-details">
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
        <el-tabs v-model="activeName" >
          <el-tab-pane label="Détails" name="first" class="detail-pane">
            <facture :facture='getFactureById(idFactureSelected)' ></facture>
          </el-tab-pane>
          <el-tab-pane label="Réglements" name="second">
            <reglements-table :tableData='getReglemensByFactureId(idFactureSelected)' :facture='getFactureById(idFactureSelected)'></reglements-table>
          </el-tab-pane>
        </el-tabs>
        <div class='hidden'>
          <facture-print :facture='getFactureById(idFactureSelected)' id='facturePrint' ></facture-print>
        </div>
      </div>
    </div>
  </multipane>
</template>
<script>
  import { Multipane, MultipaneResizer } from 'vue-multipane'
  import FacturesTable from '@/components/Factures/FacturesTable'
  import Facture from '@/components/Factures/Facture'
  import ReglementsTable from '@/components/Factures/ReglementsTable'
  import FacturePrint from '@/components/Factures/FacturePrint'
  import { mapGetters } from 'vuex'
  export default {
    components: {
      Multipane,
      MultipaneResizer,
      FacturesTable,
      ReglementsTable,
      FacturePrint,
      Facture
    },
    computed: {
      // mix the getters into computed with object spread operator
      ...mapGetters([
        'getFactureById',
        'getReglemensByFactureId'
      ])
    },
    methods: {
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
    },
    data () {
      return {
        factureSelected: -1,
        activeName: 'first'
      }
    },
    mounted () {
      this.$store.dispatch('GET_FACTURES')
    }
  }
</script>
<style lang="scss" scoped>
  .hidden {
    display: none;
    opacity: 0;
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
  .facture-details {
    background: white;
    padding: 25px 15px;
    position: relative;
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
  .facture-id {
    font-size: 14px;
    font-weight: 400;
    color: #9A9A9A;
    margin-bottom: 0px;
  }
</style>