<template>
  <div v-if="annee">
    <div class="form-group">
      <label class="">Membre</label>
      <div class="">
        {{membre['NOM_MEMBRE']}} {{membre['PRENOM_MEMBRE']}}
      </div>
    </div>
    <div class="form-group">
      <label class="">Pour l'année</label>
      <div class="">
        {{annee['DATE_DEBUT'] | moment('YYYY')}} - {{annee['DATE_FIN'] | moment('YYYY')}}
      </div>
    </div>
    <div class="form-group">
      <label class="">Pour l'activité</label>
      <div class="">
        <el-select v-model="activite" filterable placeholder="Activité" @change="setActivite">
          <el-option
            v-for="item in activites"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
    </div>
    <div class="form-group">
      <label class="">Ristourne appliqué</label><br>
      <el-select placeholder="Ristournes" v-model="ristourne" @change="setMontant">
        <el-option v-for="item in ristournes" 
                    :key="item.key"
                    :label="item.label"
                    :value="item.value">
        </el-option>
      </el-select>
    </div>
    <div class="form-group">
      <label class="">Montant Activité</label>
      <div class="">
        <input type="text" placeholder="Montant Activité" class="form-control" v-model="montantA" name="_montantA" v-validate="modelValidations.montantA">
        <small class="text-danger" v-show="_montantA.invalid">
            {{ getError('_montantA') }}
        </small>
      </div>
    </div>
    <div class="form-group">
      <label class="">Montant Fourniture</label>
      <div class="">
        <input type="text" placeholder="Montant Fourniture" class="form-control" v-model="montantF" name="_montantF" v-validate="modelValidations.montantF">
        <small class="text-danger" v-show="_montantF.invalid">
            {{ getError('_montantF') }}
        </small>
      </div>
    </div>
    <div class="form-group">
      <label class="">Montant Total</label>
      <div class="">
        <input type="text" placeholder="Montant Total" class="form-control" v-model="montant" name="montant">
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
        'getFullConfiguration',
        'getActivitesForYear',
        'getActivite'
      ]),
      ...mapFields(['_montantA', '_montantF']),
      annee () {
        if (!this.getFullConfiguration() || !this.getFullConfiguration().annees) {
          return null
        }
        return this.getFullConfiguration().annees.find((e) => { return e['ID_ANNEE'] === this.currentAnnee })
      },
      activites () {
        return this.getActivitesForYear(this.currentAnnee).map(function (e) { return {value: e['ID_ACTIVITE'], label: e['NOM_ACTIVITE']} })
      },
      ristournes () {
        if (!this.getFullConfiguration() || !this.getFullConfiguration().ristournes) {
          return []
        }
        return this.getFullConfiguration().ristournes.map(function (e) { return {value: e['PRCT_RISTOURNE'], label: e['MOTIF_RISTOURNE'], key: e['ID_RISTOURNE']} })
      },
      montant () {
        let total = parseFloat(this.montantA) + parseFloat(this.montantF)
        total = total - (this.ristourne * total / 100)
        return isNaN(total) ? 0 : total
      }
    },
    data () {
      return {
        _activite: {},
        montantA: 0,
        montantF: 0,
        ristourne: 0,
        activite: '',
        modelValidations: {
          montantA: {
            required: true,
            decimal: true
          },
          montantF: {
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
        this.montant = value
      },
      setActivite (idActivite) {
        let a = this.getActivite(idActivite)
        this._activite = a
        if (a) {
          this.montantA = a['PRIX']
          this.montantF = a['PRIX_FOURNITURE'] || 0
        }
      },
      getError (fieldName) {
        return this.errors.first(fieldName)
      },
      validate () {
        return this.$validator.validateAll()
      },
      reset () {
        this.montantA = ''
        this.montantF = ''
        this.tarif = ''
        this._activite = {}
        this.activite = ''
        this.$validator.reset()
      }
    },
    created () {
      this.$store.dispatch('GET_ACTIVITES')
      this.$validator.localize('fr', {
        messages: french.messages,
        attributes: {
          _montantA: 'Le montant',
          _montantF: 'Le montant'
        }
      })
      this.$validator.localize('fr')
    }
  }
</script>
