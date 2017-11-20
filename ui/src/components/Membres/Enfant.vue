<template>
  <div class="detail-pane">
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
        <el-date-picker type="date" placeholder="Date de naissance">
        </el-date-picker>
      </div>
    </div>
    <div class="form-group">
      <label class="col-md-2 control-label">Réside chez</label>
      <div class="col-md-10">
        <el-select placeholder="Réside chez" size="large">
          <el-option v-for="option in civilites"
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
    <el-checkbox v-model="checked">Certificat Médical</el-checkbox>
    <el-checkbox v-model="checked">Droit à l'image</el-checkbox>
    <el-checkbox v-model="checked">Rentre seul</el-checkbox>&nbsp;
    <el-time-select v-if="checked"
      v-model="timePicker"
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
      <div>
        <textarea class="form-control" placeholder="-" rows="3"></textarea>
      </div>
    </div>
    <br /><br /><br /><br />
    <div class="form-group">
      <label class="control-label">Informations Médicales</label>
      <div>
        <textarea class="form-control" placeholder="-" rows="3"></textarea>
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
      }
    },
    computed: {
      civilites () {
        return this.configuration.civilites.map(function (e) { return {value: e['ID_CIVILITE'], label: e['ABREVIATION_CIVILITE']} })
      }
    },
    data () {
      return {
        checked: false,
        timePicker: '18:00'
      }
    }
  }
</script>
<style scoped lang="scss">
  .detail-pane {
    padding: 15px;
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
  }
  
</style>
