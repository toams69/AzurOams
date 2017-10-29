<template>
  <multipane class="custom-resizer" layout="vertical">
    <div class="pane" :style="{ minWidth: '30%', width: '50%' }">
        <membre-tables></membre-tables>
    </div>
    <multipane-resizer></multipane-resizer>
    <div class="pane" :style="{ flexGrow: 1 }">
      <div>
        <h6 class="title is-6">Pane 3</h6>
      </div>
    </div>
  </multipane>
</template>
<script>
  import { Multipane, MultipaneResizer } from 'vue-multipane'
  import MembreTables from '@/components/Membres/MembresTable'
  export default {
    components: {
      Multipane,
      MultipaneResizer,
      MembreTables
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