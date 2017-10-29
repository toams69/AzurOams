<template>
  <div class="facture-details">
    <div class="facture-id">
      Facture #12345 -
      <button class="btn btn-icon btn-simple" title="imprimer la facture">
        <i class='ti-printer'></i>
      </button>
      <button class="btn btn-icon btn-simple" title="supprimer la facture">
        <i class='ti-trash'></i>
      </button>
    </div>  
    <br/>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="Détails" name="first" class="detail-pane">
        <table class='detail-table'>
          <tr>
            <td>Adressé à</td>
            <td>ABBATECOLA Guiseppina</td>
          </tr>
          <tr>
            <td>Date de la facture</td>
            <td>10/07/2014</td>
          </tr>
          <tr>
            <td>Objet de la facture</td>
            <td>Activité Adulte</td>
          </tr>
          <tr>
            <td>Montant (Restant)</td>
            <td>21 € (0 €)</td>
          </tr>
        </table>
        <div class="nature-facture">
          Inscription à l'activité : Peinture sur Porcelaine
          Activité = 21,00 euros
          Fourniture = 0,00 euros
        </div>
      </el-tab-pane>
      <el-tab-pane label="Réglements" name="second">Réglements</el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        activeName: 'first'
      }
    },
    methods: {
      handleClick (tab, event) {
        console.log(tab, event)
      }
    }
  }
</script>
<style scoped lang="scss">
  .facture-details {
    background: white;
    padding: 25px 15px;
    position: relative;
    height: 100%;
  }
  .facture-id {
    font-size: 14px;
    font-weight: 400;
    color: #9A9A9A;
    margin-bottom: 0px;
  }
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
