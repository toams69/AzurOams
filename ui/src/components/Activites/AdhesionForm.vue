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
        <input type="text" placeholder="Numéro adhérent" class="form-control" v-model="model.numeroAdherent" name="numeroAdherent" v-validate="modelValidations.numeroAdherent">
        <small class="text-danger" v-show="numeroAdherent.invalid">
            {{ getError('numeroAdherent') }}
        </small>
      </div>
    </div>
    <div class="form-group">
      <label class="">Tarif appliqué</label><br>
      <el-select placeholder="Tarif" v-model="model.tarif" @change="setMontant">
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
        <input type="text" placeholder="Montant" class="form-control" v-model="model.montant" name="montant" v-validate="modelValidations.montant">
        <small class="text-danger" v-show="montant.invalid">
            {{ getError('montant') }}
        </small>
      </div>
    </div>
  </div>
  <div v-else>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'
  import {mapFields} from 'vee-validate'
  import french from 'vee-validate/dist/locale/fr'

  export default {
    computed: {
      // mix the getters into computed with object spread operator
      ...mapGetters([
        'getFullConfiguration'
      ]),
      ...mapFields(['numeroAdherent', 'montant']),
      annee () {
        if (!this.getFullConfiguration() || !this.getFullConfiguration().annees) {
          return null
        }
        return this.getFullConfiguration().annees.find((e) => { return e['ID_ANNEE'] === this.currentAnnee })
      }
    },
    data () {
      return {
        model: {
          numeroAdherent: '',
          montant: '',
          tarif: ''
        },
        modelValidations: {
          numeroAdherent: {
            required: true,
            numeric: true
          },
          montant: {
            required: true,
            decimal: true
          }
        }
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
        this.model.montant = value
      },
      getError (fieldName) {
        return this.errors.first(fieldName)
      },
      validate () {
        return this.$validator.validateAll()
      },
      reset () {
        this.model.numeroAdherent = ''
        this.model.montant = ''
        this.model.tarif = ''
        this.$validator.reset()
      }
    },
    created () {
      this.$validator.localize('fr', {
        messages: french.messages,
        attributes: {
          montant: 'Le montant',
          numeroAdherent: 'Le numéro d\'adhérent'
        }
      })
      this.$validator.localize('fr')
    }
  }
</script>
