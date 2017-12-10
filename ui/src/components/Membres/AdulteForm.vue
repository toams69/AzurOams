<template>
  <div class="detail-pane">
    <div class="toolbar">
      <button class="btn btn-icon btn-simple" title="sauvegarder" @click="saveAdulte">
        <i class='ti-save'></i>
      </button>
      <button class="btn btn-icon btn-simple" title="restaurer" @click="reset">
        <i class='ti-reload'></i>
      </button>
      <button class="btn btn-icon btn-simple" title="imprimer la fiche">
        <i class='ti-printer'></i>
      </button>
    </div>  
    <div class="form-group">
      <label class="col-md-2 control-label">Civilité</label>
      <div class="col-md-10">
        <el-select placeholder="Civilité" size="large" v-model="adulte['ID_CIVILITE']">
          <el-option v-for="option in civilites" 
                      :value="option.value"
                      :label="option.label"
                      :key="option.label">
          </el-option>
        </el-select>
      </div>
    </div>
    <div class="form-group">
      <label class="col-md-2 control-label">Nom</label>
      <div class="col-md-10">
        <input type="text" placeholder="Nom" class="form-control" v-model="adulte['NOM_MEMBRE']">
      </div>
    </div>
    <div class="form-group">
      <label class="col-md-2 control-label">Prénom</label>
      <div class="col-md-10">
        <input type="text" placeholder="Prénom" class="form-control" v-model="adulte['PRENOM_MEMBRE']">
      </div>
    </div>
    <div class="form-group">
      <label class="col-md-2 control-label">Né(e) le</label>
      <div class="col-md-10">
        <el-date-picker type="date" placeholder="Date de naissance" v-model="adulte['NAISSANCE_MEMBRE']">
        </el-date-picker>
      </div>
    </div>
    <div class="form-group">
      <label class="col-md-2 control-label">Téléphone(s)</label>
      <div class="col-md-5">
        <input type="text" placeholder="Téléphone" class="form-control" v-model="adulte['TEL1_MEMBRE']">
      </div>
      <div class="col-md-5">
        <input type="text" placeholder="Téléphone" class="form-control" v-model="adulte['TEL2_MEMBRE']">
      </div>
    </div>
    <div class="form-group">
      <label class="col-md-2 control-label">Email</label>
      <div class="col-md-10">
        <input type="text" placeholder="Téléphone" class="form-control" v-model="adulte['MAIL_MEMBRE']">
      </div>
    </div>
    <div class="form-group">
      <label class="col-md-2 control-label">Adresse</label>
      <div class="col-md-10">
        <input type="text" placeholder="Téléphone" class="form-control" v-model="adulte['ADR_MEMBRE']">
      </div>
    </div>
    <div class="form-group">
      <label class="col-md-2 control-label">Code Postal</label>
      <div class="col-md-10">
        <input type="text" placeholder="Téléphone" class="form-control" v-model="cpVille">
      </div>
    </div>
    <div class="form-group">
      <label class="col-md-2 control-label">Ville</label>
      <div class="col-md-10">
        <el-select placeholder="Ville" size="large" v-model="adulte['ID_VILLE']">
          <el-option v-for="option in villes" 
                      :value="option.value"
                      :label="option.label"
                      :key="option.label">
          </el-option>
        </el-select>
      </div>
    </div>
    <br/>
    <el-checkbox v-model="adulte['PARENT']" >Parent</el-checkbox>
    <el-checkbox v-model="adulte['ALLOCATAIRE_CAF']">Allocataire CAF</el-checkbox>
    <el-checkbox v-model="adulte['ALLOCATAIRE_MSA']">Allocataire MSA</el-checkbox>
    <br/><br/>
    <div class="form-group">
      <label class="col-md-2 control-label">Sécu</label>
      <div class="col-md-10">
        <input type="text" placeholder="Sécu" class="form-control" v-model="adulte['NUM_SECU_MEMBRE']">
      </div>
    </div>
    <div class="form-group">
      <label class="col-md-2 control-label">Employeur</label>
      <div class="col-md-10">
        <input type="text" placeholder="Employeur" class="form-control" v-model="adulte['NOM_EMPLOYEUR']">
      </div>
    </div>
    <div class="form-group">
      <label class="col-md-2 control-label">Travail à</label>
      <div class="col-md-10">
        <input type="text" placeholder="Travail à" class="form-control" v-model="adulte['LIEU_TRAVAIL']">
      </div>
    </div>
    <div class="form-group">
      <label class="col-md-2 control-label">Tèl Travail</label>
      <div class="col-md-10">
        <input type="text" placeholder="Tèl Travail" class="form-control" v-model="adulte['TELT_MEMBRE']">
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      adulte: {
        type: Object
      },
      configuration: {
        type: Object
      },
      famille: {
        type: Object
      }
    },
    computed: {
      civilites () {
        return this.configuration.civilites.map(function (e) { return {value: e['ID_CIVILITE'], label: e['ABREVIATION_CIVILITE']} })
      },
      villes () {
        if (this.cpVille) {
          var villes = this.configuration.villes.filter((e) => { return e['CP_VILLE'] === this.cpVille })
          return villes.map(function (e) { return {value: e['ID_VILLE'], label: e['NOM_VILLE']} })
        } else {
          return []
        }
      }
    },
    methods: {
      saveAdulte () {
        this.$emit('save', this.adulte)
      },
      reset () {
        this.$emit('reset', this.adulte)
      }
    },
    data () {
      return {
        naissance: '',
        cpVille: this.configuration.villes.find((e) => { return e['ID_VILLE'] === this.adulte['ID_VILLE'] })['CP_VILLE']
      }
    }
  }
</script>
<style scoped lang="scss">
  .detail-pane {
    padding: 5px 15px 15px 15px;
    .control-label {
      padding-top: 10px!important;
    }
    .form-control {
      background: none;
      // border: none;
      // border-bottom: 1px dashed #F3F2EE;
    }
    .form-group {
      height: 30px;
    }
    .toolbar {
      background: white;
      position: relative;
      height: 100%;
      padding-left: -15px;
      padding-bottom: 15px;
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
    }
  }
  
</style>
