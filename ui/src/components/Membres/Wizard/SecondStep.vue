<template>
  <div>
    <h5 class="text-center">Please give us more details about your platform.</h5>
    <center>
        <el-switch
            v-model="enfant"
            active-text="Enfant"
            inactive-text="Adulte">
        </el-switch>
    </center>
    <div v-if="enfant">
    </div>
    <div v-else>
      <div class="row">
        <div class="col-md-2 col-md-offset-1">
          <div class="form-group">
            <label class="control-label">
              Civilité
            </label>
            <select name="language"
                    v-validate="modelValidations.language"
                    v-model="model.language"
                    class="form-control">
            </select>
            <!-- <small class="text-danger" v-show="language.invalid">
              {{ getError('language') }}
            </small> -->
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
            <select name="cities"
                    v-validate="modelValidations.bootstrapVersion"
                    v-model="model.bootstrapVersion"
                    class="form-control">
              <option selected="" disabled="">- version -</option>
              <option value="1.1">Bootstrap 1.1</option>
              <option value="2.0">Bootstrap 2.0</option>
              <option value="3.0">Bootstrap 3.0</option>
              <option value="4.0">Bootstrap 4.0(alpha)</option>
            </select>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-5 col-md-offset-1">
          <div class="form-group">
            <label class="control-label">Adresse</label>
            <input class="form-control"
                  type="text"
                  name="price"
                  v-model="model.price"
                  placeholder="ex: 19.00"
            />
          </div>
        </div>
        <div class="col-md-2">
          <div class="form-group">
            <label class="control-label">Code Postal</label>
            <input class="form-control"
                  type="text"
                  name="price"
                  v-model="model.price"
                  placeholder="ex: 19.00"
            />
          </div>
        </div>
        <div class="col-md-3">
          <div class="form-group">
            <label class="control-label">Ville</label>
            <input class="form-control"
                  type="text"
                  name="price"
                  v-model="model.price"
                  placeholder="ex: 19.00"
            />
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
      ...mapFields(['nom', 'prenom'])
    },
    data () {
      return {
        enfant: false,
        model: {
          website: '',
          nom: '',
          prenom: '',
          language: '',
          bootstrapVersion: '',
          price: ''
        },
        modelValidations: {
          nom: {
            required: true
          },
          prenom: {
            required: true
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
      }
    }
  }
</script>
<style>
</style>
