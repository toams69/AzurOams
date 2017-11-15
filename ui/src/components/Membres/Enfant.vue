<template>
  <div class="detail-pane">
    <div class="form-group">
      <label class="col-md-2 control-label">Civilité</label>
      <div class="col-md-10">
        <el-select placeholder="Civilité" size="large">
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
        <input type="text" placeholder="Nom" class="form-control">
      </div>
    </div>
    <div class="form-group">
      <label class="col-md-2 control-label">Prénom</label>
      <div class="col-md-10">
        <input type="text" placeholder="Prénom" class="form-control">
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
        <input type="text" placeholder="Téléphone" class="form-control">
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      enfant: {
        type: Object
      }
    },
    data () {
      return {
        civilites: [{value: 'Mr', label: 'Mr'}]
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
      border: none;
      border-bottom: 1px dashed #F3F2EE;
    }
    .form-group {
      height: 30px;
    }
  }
  
</style>
