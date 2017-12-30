<template>
  <div v-if="annee">
    <div class="form-group">
      <label class="">Membre</label>
      <div class="">
        {{membre['NOM_MEMBRE']}} {{membre['PRENOM_MEMBRE']}}
      </div>
    </div>
    <div class="form-group">
      <label class="">Année d'adhésion</label>
      <div class="">
        {{annee['DATE_DEBUT'] | moment('YYYY')}} - {{annee['DATE_FIN'] | moment('YYYY')}}
      </div>
    </div>
    <div class="form-group">
      <label class="">Numéro adhérent</label>
      <div class="">
        <input type="text" placeholder="Numéro adhérent" class="form-control" v-model="numeroAdherent">
      </div>
    </div>
    <div class="form-group">
      <label class="">Tarif appliqué</label><br>
      <el-select placeholder="Tarif" v-model="tarif" @change="setMontant">
        <el-option v-for="tarif in annee.tarifs" 
                    :value="tarif.MONTANT"
                    :label="tarif.DESCRIPTION"
                    :key="tarif.DESCRIPTION">
        </el-option>
      </el-select>
    </div>
    <div class="form-group">
      <label class="">Montant</label>
      <div class="">
        <input type="text" placeholder="Montant" class="form-control" v-model="montant">
      </div>
    </div>
  </div>
  <div v-else>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'

  export default {
    computed: {
      // mix the getters into computed with object spread operator
      ...mapGetters([
        'getFullConfiguration'
      ]),
      annee () {
        if (!this.getFullConfiguration() || !this.getFullConfiguration().annees) {
          return null
        }
        return this.getFullConfiguration().annees.find((e) => { return e['ID_ANNEE'] === this.currentAnnee })
      }
    },
    data () {
      return {
        numeroAdherent: '',
        montant: '',
        tarif: ''
      }
    },
    props: {
      membre: {
        type: Object
      },
      currentAnnee: {
      }
    },
    methods: {
      setMontant (value) {
        this.montant = value
      },
      reset () {
        this.numeroAdherent = ''
        this.montant = ''
        this.tarif = ''
      }
    }
  }
</script>
