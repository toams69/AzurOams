<template>
  <div class="facture-details">
    <table class='detail-table'>
      <tr>
        <td>Adressé à</td>
        <td>{{facture['NOM_MEMBRE']}} {{facture['PRENOM_MEMBRE']}}</td>
      </tr>
      <tr>
        <td>Date de la facture</td>
        <td>{{facture['DATE_FACTURE'] | moment("dddd D MMMM YYYY") }}</td>
      </tr>
      <tr>
        <td>Objet de la facture</td>
        <td>{{facture['NOM_TYPE_FACTURE']}}</td>
      </tr>
      <tr>
        <td>Montant (Restant)</td>
        <td>{{facture["MONTANT_FACTURE"]}} € ({{facture["MONTANT_RESTANT"]}} €)</td>
      </tr>
    </table>
    <div class="nature-facture">
{{facture["MOTIF_FACTURE"] }}
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      facture: {
        type: Object
      }
    }
  }
</script>
<style scoped lang="scss">
  .nature-facture {
    white-space: pre;
  }
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
