<template>
  <div class="detail-pane">
    <div class="toolbar">
      <button class="btn btn-icon btn-simple" title="sauvegarder" @click="save" @click.prevent="validate">
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
      <label class="col-md-4 control-label">Nom</label>
      <div class="col-md-8">
        <input type="text" placeholder="Nom" class="form-control" v-model="famille['NOM_FAMILLE']">
      </div>
    </div>
    <div class="form-group">
      <label class="col-md-4 control-label">Quartier de résidence</label>
      <div class="col-md-8">
        <el-select placeholder="quartiers" size="large" v-model="famille['ID_QUARTIER']">
          <el-option v-for="option in quartiers" 
                      :value="option.value"
                      :label="option.label"
                      :key="option.label">
          </el-option>
        </el-select>
      </div>
    </div>
    <div class="form-group">
      <label class="col-md-4 control-label">Numéro CAF</label>
      <div class="col-md-8">
        <input type="text" placeholder="Numéro CAF" class="form-control" v-model="famille['NUMERO_CAF']">
      </div>
    </div>
    <div class="form-group">
      <label class="col-md-4 control-label">Quotient CAF</label>
      <div class="col-md-8">
        <input type="text" placeholder="Quotient CAF" class="form-control" v-model="famille['QUOTIENT_CAF_FAMILLE']">
      </div>
    </div>
    <div class="form-group">
      <label class="col-md-4 control-label">Numéro MSA</label>
      <div class="col-md-8">
        <input type="text" placeholder="Numéro MSA" class="form-control" v-model="famille['NUMERO_MSA']">
      </div>
    </div>
    <div class="form-group">
      <label class="col-md-4 control-label">Quotient MSA</label>
      <div class="col-md-8">
        <input type="text" placeholder="Quotient MSA" class="form-control" v-model="famille['QUOTIENT_MSA_FAMILLE']">
      </div>
    </div>
    <div class="form-group">
      <label class="col-md-4 control-label">Avoir</label>
      <div class="col-md-8">
        <input placeholder="Avoir" 
              class="form-control" 
              type="number" 
              name="avoir" 
              v-model="famille['AVOIR_FAMILLE']" 
              v-validate="modelValidations.number"
            >
        <small class="text-danger" v-show="avoir.invalid">
          {{ getError('avoir') }}
        </small>
      </div>
    </div>
    <br/><br/>
    <hr/>
    <div class="form-group">
      <label class="col-md-4 control-label">Membres</label>
      <ul class="col-md-8 liste-membre">
        <li v-for="contact in membres">
          <a @click='membreSelected(contact)'>{{ contact['NOM_ENFANT'] || contact['NOM_MEMBRE'] }} {{ contact['PRENOM_ENFANT'] || contact['PRENOM_MEMBRE'] }}</a>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
  import {mapFields} from 'vee-validate'
  export default {
    props: {
      configuration: {
        type: Object
      },
      famille: {
        type: Object
      },
      membres: {
        type: Array
      }
    },
    computed: {
      quartiers () {
        return this.configuration.quartiers.map(function (e) { return {value: e['ID_QUARTIER'], label: e['NOM_QUARTIER']} })
      },
      ...mapFields(['avoir'])
    },
    methods: {
      membreSelected (membre) {
        this.$emit('membreSelected', membre)
      },
      getError (fieldName) {
        return this.errors.first(fieldName)
      },
      validate () {
        this.$validator.validateAll().then(isValid => {
          this.$emit('on-submit', isValid)
        })
      },
      save () {
        this.$emit('save', this.famille)
      },
      reset () {
        this.$emit('reset', this.famille)
      }
    },
    data () {
      return {
        modelValidations: {
          number: {
            decimal: true
          }
        }
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
    .liste-membre {
      list-style-type: none;
      margin-top: 12px;
      li {
        height: 40px;
        a {
          cursor: pointer;
        }
      }
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
