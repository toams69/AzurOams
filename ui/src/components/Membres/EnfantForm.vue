<template>
  <div class="detail-pane">
    <div class="toolbar">
      <button class="btn btn-icon btn-simple" title="sauvegarder" @click="saveEnfant">
        <i class='ti-save'></i>
      </button>
      <button class="btn btn-icon btn-simple" title="restaurer" @click="resetEnfant">
        <i class='ti-reload'></i>
      </button>
      <button class="btn btn-icon btn-simple" title="imprimer la fiche">
        <i class='ti-printer'></i>
      </button>
    </div>  
    <div class="form-group">
      <label class="col-md-2 control-label">Civilité</label>
      <div class="col-md-10">
        <el-select placeholder="Civilité" size="large" v-model="enfant['ID_CIVILITE']">
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
        <input type="text" placeholder="Nom" class="form-control" v-model="enfant['NOM_ENFANT']">
      </div>
    </div>
    <div class="form-group">
      <label class="col-md-2 control-label">Prénom</label>
      <div class="col-md-10">
        <input type="text" placeholder="Prénom" class="form-control" v-model="enfant['PRENOM_ENFANT']">
      </div>
    </div>
    <div class="form-group">
      <label class="col-md-2 control-label">Né(e) le</label>
      <div class="col-md-10">
        <el-date-picker type="date" placeholder="Date de naissance" v-model="enfant['NAISSANCE_ENFANT']">
        </el-date-picker>
      </div>
    </div>
    <div class="form-group">
      <label class="col-md-2 control-label">Réside chez</label>
      <div class="col-md-10">
        <el-select placeholder="Réside chez" size="large" v-model="enfant['ID_MEMBRE']">
          <el-option v-for="option in parents"
                      :value="option.value"
                      :label="option.label"
                      :key="option.label">
          </el-option>
        </el-select>
      </div>
    </div>
    <div class="form-group">
      <label class="col-md-2 control-label">Téléphone</label>
      <div class="col-md-10">
        <input type="text" placeholder="Téléphone" class="form-control" v-model="enfant['TEL_ENFANT']">
      </div>
    </div>
    <br /><br />
    <el-checkbox v-model="enfant['CERTIFICAT']" >Certificat Médical</el-checkbox>
    <el-checkbox v-model="enfant['DROIT_IMAGE']">Droit à l'image</el-checkbox>
    <el-checkbox v-model="enfant['RENTRE_SEUL']">Rentre seul</el-checkbox>&nbsp;
    <el-time-select v-if="enfant['RENTRE_SEUL']"
      v-model="enfant['HORAIRE']"
      :picker-options="{
        start: '16:00',
        step: '00:15',
        end: '20:30'
      }"
      placeholder="Select time">
    </el-time-select>
    <br /><br />
    <div class="form-group">
      <label class="control-label">Recommendation</label>
      <div class="col-md-12">
        <textarea class="form-control" placeholder="-" rows="3" v-model="enfant['INFORMATIONS_MEDICALES']"></textarea>
      </div>
    </div>
    <br /><br /><br /><br />
    <div class="form-group">
      <label class="control-label">Informations Médicales</label>
      <div class="col-md-12">
        <textarea class="form-control" placeholder="-" rows="3" v-model="enfant['RECOMMENDATIONS']"></textarea>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      enfant: {
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
      parents () {
        return this.famille.membres ? this.famille.membres.filter(function (e) { return e['ID_ENFANT'] === 0 }).map(function (e) { return {value: e['ID_MEMBRE'], label: e['ABREVIATION_CIVILITE'] + ' ' + e['NOM_MEMBRE'] + ' ' + e['PRENOM_MEMBRE']} }) : []
      }
    },
    methods: {
      saveEnfant () {
        this.$emit('save', this.enfant)
      },
      resetEnfant () {
        this.$emit('resetEnfant', this.enfant)
      }
    },
    data () {
      return {
        droitImage: false,
        rentreSeul: false,
        certificat: false,
        naissance: '',
        timePicker: '18:00'
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
