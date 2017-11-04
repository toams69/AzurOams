<template>
  <div class="detail-pane">
    <table class='detail-table'>
      <tr>
        <td>Civilité</td>
        <td>{{enfant['ABREVIATION_CIVILITE']}}</td>
      </tr>
      <tr>
        <td>Nom</td>
        <td>{{enfant['NOM_ENFANT']}}</td>
      </tr>
      <tr>
        <td>Prénom</td>
        <td>{{enfant['PRENOM_ENFANT']}}</td>
      </tr>
      <tr>
        <td></td>
        <td></td>
      </tr>
    </table>
  
  </div>
</template>
<script>
  export default {
    props: {
      enfant: {
        type: Object
      }
    }
  }
</script>
<style scoped lang="scss">
  .detail-pane {
    padding: 15px;
    .detail-table {
      tr td:nth-child(1) {
        font-weight: bold;
        padding-right: 15px;
      }
    }
  }
  
</style>
