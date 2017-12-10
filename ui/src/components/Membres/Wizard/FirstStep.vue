<template>
  <div>
    <h5 class="text-center">Choix de la famille.</h5>
    <center>
        <el-switch
            v-model="newFamille"
            active-text="Nouvelle famille"
            inactive-text="Famille existante">
        </el-switch>
    </center>
    <br/>
    <div v-if="newFamille">
      <div class="row">
        <div class="col-md-5 col-md-offset-1">
            <div class="form-group">
            <label class="control-label">
                Nom de la nouvelle famille
            </label>
            <input class="form-control"
                    type="text"
                    name="nomFamille"
                    v-validate="modelValidations.nomFamille"
                    v-model="model.nomFamille"
                    placeholder="ex: Pariaud"
            />
            <small class="text-danger" v-show="nomFamille.invalid">
                {{ getError('nomFamille') }}
            </small>
            </div>
        </div>
      </div>
    </div>
    <div class="row" v-else>
        <center>
            <el-select v-model="idFamille" filterable placeholder="Selectionner une famille dans la liste">
                <el-option
                    v-for="item in _familles"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
        </center>
    </div>
  </div>
</template>
<script>
  import {mapFields} from 'vee-validate'

  export default {
    computed: {
      _familles () {
        return this.familles.map(function (e) { return {value: e['ID_FAMILLE'], label: e['NOM_FAMILLE']} })
      },
      ...mapFields(['nomFamille'])
    },
    props: {
      familles: {
        type: Array
      },
      idFamille: {
        type: Number
      },
      newFamille: {
        type: Boolean
      }
    },
    data () {
      return {
        model: {
          nomFamille: ''
        },
        modelValidations: {
          nomFamille: {
            required: true,
            min: 5
          }
        }
      }
    },
    methods: {
      getError (fieldName) {
        return this.errors.first(fieldName)
      },
      validate () {
        return this.$validator.validateAll()
      },
      reset () {
        this.model.nomFamille = ''
        this.idFamille = null
        this.newFamille = true
      }
    }
  }
</script>
<style>
</style>
