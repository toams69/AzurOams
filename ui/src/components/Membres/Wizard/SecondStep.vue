<template>
  <div>
    <h5 class="text-center">Renseignez les informations du membre.</h5>
    <center v-if="!newFamille">
        <el-switch
            v-model="model.enfant"
            active-text="Enfant"
            inactive-text="Adulte">
        </el-switch>
    </center>
    <div>
      <div class="row">
        <div class="col-md-2 col-md-offset-1">
          <div class="form-group">
            <label class="control-label">
              Civilité
            </label>
    
            <select name="civilites"
                    v-validate="modelValidations.civilites"
                    v-model="model.civilites"
                    class="form-control">
                    <option v-for="option in _civilites" 
                          :value="option.value"
                          :label="option.label"
                          :key="option.label">{option.label}
                    </option>
            </select>
            <small class="text-danger" v-show="civilites.invalid">
              {{ getError('civilites') }}
            </small>
          </div>
        </div>
        <div class="col-md-4">
          <div class="form-group">
            <label class="control-label">Nom</label>
            <input class="form-control"
                  type="text"
                  name="nom"
                  v-validate="modelValidations.nom"
                  v-model="model.nom"
                  placeholder="ex: Pariaud"
            />
            <small class="text-danger" v-show="nom.invalid">
              {{ getError('nom') }}
            </small>
          </div>
        </div>
        <div class="col-md-4">
          <div class="form-group">
            <label class="control-label">Prénom</label>
            <input class="form-control"
                  type="text"
                  name="prenom"
                  v-validate="modelValidations.prenom"
                  v-model="model.prenom"
                  placeholder="ex: Thomas"
            />
            <small class="text-danger" v-show="prenom.invalid">
              {{ getError('prenom') }}
            </small>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-md-3 col-md-offset-1">
          <div class="form-group">
            <label class="control-label">
              Date de naissance
            </label>
            <el-date-picker type="date" placeholder="Date de naissance" v-model="model.naissance">
            </el-date-picker>
          </div>
        </div>
      </div>
      <div class="row" v-if="!model.enfant">
        <div class="col-md-5 col-md-offset-1">
          <div class="form-group">
            <label class="control-label">Adresse</label>
            <input class="form-control"
                  type="text"
                  name="addresse"
                  v-model="model.addresse"
                  placeholder="ex: 1 rue du general blecon"
            />
          </div>
        </div>
        <div class="col-md-2">
          <div class="form-group">
            <label class="control-label">Code Postal</label>
            <input class="form-control"
                  type="text"
                  name="cdp"
                  v-model="model.cdp"
                  placeholder="ex: 29200"
            />
          </div>
        </div>
        <div class="col-md-3">
          <div class="form-group">
            <label class="control-label">Ville</label>
            <select name="ville"
                    v-validate="modelValidations.ville"
                    v-model="model.ville"
                    class="form-control">
                    <option v-for="option in _villes" 
                          :value="option.value"
                          :label="option.label"
                          :key="option.label">{option.label}
                    </option>
            </select>
            <small class="text-danger" v-show="ville.invalid">
              {{ getError('ville') }}
            </small>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import {mapFields} from 'vee-validate'

  export default {
    computed: {
      _civilites () {
        return this.configuration.civilites.map(function (e) { return {value: e['ID_CIVILITE'], label: e['ABREVIATION_CIVILITE']} })
      },
      _villes () {
        if (this.model.cdp) {
          var villes = this.configuration.villes.filter((e) => { return e['CP_VILLE'] === this.model.cdp })
          return villes.map(function (e) { return {value: e['ID_VILLE'], label: e['NOM_VILLE']} })
        } else {
          return []
        }
      },
      ...mapFields(['nom', 'prenom', 'civilites', 'ville'])
    },
    props: {
      newFamille: {
        type: Boolean
      },
      configuration: {
        type: Object
      }
    },
    data () {
      return {
        model: {
          enfant: false,
          addresse: '',
          nom: '',
          prenom: '',
          civilites: '',
          naissance: '',
          ville: '',
          cdp: ''
        },
        modelValidations: {
          nom: {
            required: true
          },
          prenom: {
            required: true
          },
          civilites: {
            required: true
          },
          ville: {
            required: true
          }
        }
      }
    },
    methods: {
      reset () {
        this.model.addresse = ''
        this.model.nom = ''
        this.model.prenom = ''
        this.model.civilites = ''
        this.model.naissance = ''
        this.model.ville = ''
        this.model.cdp = ''
      },
      getError (fieldName) {
        return this.errors.first(fieldName)
      },
      validate () {
        return this.$validator.validateAll()
      }
    }
  }
</script>
<style>
</style>
