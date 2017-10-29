<template>
  <multipane class="custom-resizer" layout="vertical">
    <div class="pane" :style="{ minWidth: '30%', width: '50%' }">
        <FacturesTable></FacturesTable>
    </div>
    <multipane-resizer></multipane-resizer>
    <div class="pane" :style="{ flexGrow: 1 }">
       <facture></facture>
    </div>
  </multipane>
</template>
<script>
  import { Multipane, MultipaneResizer } from 'vue-multipane'
  import FacturesTable from '@/components/Factures/FacturesTable'
  import Facture from '@/components/Factures/Facture'
  export default {
    components: {
      Multipane,
      MultipaneResizer,
      FacturesTable,
      Facture
    },
    mounted () {
      this.$store.dispatch('GET_FACTURES')
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
</style>