<template>
  <div class="detail-pane">
    <div class="form-group">
      <label class="col-sm-5">Facture Numéro</label>
      <div class="col-sm-7">
        {{facture['ID_FACTURE']}}
      </div>
    </div>
    <div class="form-group">
      <label class="col-sm-5">Adressé à</label>
      <div class="col-sm-7">
        {{facture['NOM_CIVILITE']}} {{facture['NOM_MEMBRE']}} {{facture['PRENOM_MEMBRE']}}
      </div>
    </div>
    <div class="form-group">
      <label class="col-sm-5">Montant Restant</label>
      <div class="col-sm-7">
        {{facture['MONTANT_RESTANT'] - (reglement['MONTANT_REGLEMENT'] || 0)}} €
      </div>
    </div>
    <hr/>

    <div class="form-group">
      <label class="col-sm-5 control-label">Code Analytique</label>
      <div class="col-sm-7">
        <input type="text" placeholder="Code Analytique" class="form-control" v-model="reglement['CODE_ANA']">
      </div>
    </div>
    <div class="form-group">
      <label class="col-sm-5 control-label">Type de reglement</label>
      <div class="col-sm-7">
        <el-select placeholder="Type de reglement" size="large" v-model="reglement['ID_TYPE_REGLEMENT']">
          <el-option v-for="option in typesReglement" 
                      :value="option.value"
                      :label="option.label"
                      :key="option.label">
          </el-option>
        </el-select>
      </div>
    </div>
    <div class="form-group">
      <label class="col-sm-5 control-label">Montant</label>
      <div class="col-sm-7">
        <input type="number" placeholder="Montant" class="form-control" v-model="reglement['MONTANT_REGLEMENT']">
      </div>
    </div>
    <div class="form-group">
      <label class="col-sm-5 control-label">Numéro du Chèque</label>
      <div class="col-sm-7">
        <input type="text" placeholder="Numéro du Chèque" class="form-control" v-model="reglement['CHEQUE_NUM']">
      </div>
    </div>
    <div class="form-group">
      <label class="col-sm-5 control-label">Banque</label>
      <div class="col-sm-7">
        <el-select placeholder="Banque" size="large" v-model="reglement['ID_BANQUE']">
          <el-option v-for="option in banques" 
                      :value="option.value"
                      :label="option.label"
                      :key="option.label">
          </el-option>
        </el-select>
      </div>
    </div>
    <div class="form-group">
      <label class="col-sm-5 control-label">Date du réglement</label>
      <div class="col-sm-7">
        <el-date-picker type="date" placeholder="Date de réglement" v-model="reglement['DATE_REGLEMENT']">
        </el-date-picker>
      </div>
    </div>
    <br />
    <div class="form-group">
      <label class="control-label">Commentaire</label>
      <div class="col-md-12">
        <textarea class="form-control" placeholder="-" rows="3" v-model="reglement['COMMENTAIRE_REGLEMENT']"></textarea>
      </div>
    </div>
    <br /><br />
  </div>
</template>
<script>
  import {mapFields} from 'vee-validate'
  import { mapGetters } from 'vuex'

  export default {
    props: {
      configuration: {
        type: Object
      },
      reglement: {
        type: Object,
        default: function () {
          return {}
        }
      },
      facture: {
        type: Object,
        required: true
      }
    },
    computed: {
      typesReglement () {
        return this.getFullConfiguration().typesReglement.map(function (e) { return {value: e['ID_TYPE_REGLEMENT'], label: e['NOM_TYPE_REGLEMENT']} })
      },
      banques () {
        return this.getFullConfiguration().banques.map(function (e) { return {value: e['ID_BANQUE'], label: e['NOM_BANQUE']} })
      },
      ...mapGetters([
        'getFullConfiguration'
      ]),
      ...mapFields(['avoir'])
    },
    methods: {
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
