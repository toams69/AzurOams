<template>
<div class="az-page-facture">
  <img src="static/img/top-facture.png" />
  <div class="contact-container">
    {{ facture["ABREVIATION_CIVILITE"] }}  {{ facture["NOM_MEMBRE"].toUpperCase() }}  {{ facture["PRENOM_MEMBRE"] }}
    {{ facture["ADR_MEMBRE"] }}
    {{ facture["CP_VILLE"] }} {{facture["NOM_VILLE"]}}
  </div>
  <table class="top-table">
    <tr>
        <td style="color:#007FB9;">Irigny, le :</td>
        <td class="date-facture">{{ facture['DATE_FACTURE'] | moment("dddd D MMMM YYYY") }}</td>
    </tr>
    <tr>
        <td>Facture n° :</td>
        <td class="facture-number">{{facture['ID_FACTURE']}}</td>
    </tr>
  </table>
  <hr class="separator">
  <table class="objet-table">
    <tr>
      <td>Objet de la facture </td>
      <td class="objet">{{facture['NOM_TYPE_FACTURE']}}</td>
    </tr>
    <tr>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <td>Détails </td>
      <td></td>
    </tr>
    <tr>
      <td colspan="2" class="details">{{facture["MOTIF_FACTURE"] }}</td>
    </tr>
  </table>
  <div class="bottom">
    <table class="montant-table">
      <tr>
        <td>Total général :</td>
        <td class="montantT">{{facture["MONTANT_FACTURE"]}} €</td>
      </tr>
      <tr>
        <td>Réglé :</td>
        <td class="montantR">{{facture["MONTANT_FACTURE"] - facture["MONTANT_RESTANT"]}} €</td>
      </tr>
    </table>
    <table class="total-table">
      <tr>
        <td>Reste à payer</td>
        <td class="reste">{{facture["MONTANT_RESTANT"]}} €</td>
      </tr>
    </table>
    <span>
      En votre aimable réception, à l'ordre de la Maison de la Tour, à reception de la facture.
    </span>
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
  
</style>
