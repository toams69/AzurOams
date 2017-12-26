<template>
  <div>
    <div class="row">
      <div class="col-md-12">
        <div class="" id="wizardCard">
          <form-wizard
                    title="Création de membre"
                    subtitle=''
                    ref='newMembreWizard'
                    @on-complete="wizardComplete"
                    error-color="#EB5E28"
                    color="#66615B">
            <tab-content title="Choix de la famille"
                         :before-change="validateFirstStep"
                         icon="ti-user">
              <first-step ref="firstStep" :familles='familles' :idFamille='wizardModel.idFamille' :newFamille='wizardModel.newFamille'></first-step>
            </tab-content>

            <tab-content title="Informations"
                         :before-change="validateSecondStep"
                         icon="ti-settings">
              <second-step ref="secondStep" :newFamille='wizardModel.newFamille' :configuration='configuration'></second-step>
            </tab-content>

            <tab-content title="Valider"
                         icon="ti-check">
              <h2 class="text-center text-space">
                <br>
                <small>Cliquer sur "<b>Terminer</b>" pour finaliser l'inscription</small>
              </h2>
            </tab-content>

            <button slot="prev" class="btn btn-default btn-fill btn-wd btn-back">Précédent</button>
            <button slot="next" class="btn btn-info btn-fill btn-wd btn-next">Suivant</button>
            <button slot="finish" class="btn btn-info btn-fill btn-wd">Terminer</button>
          </form-wizard>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import {FormWizard, TabContent} from 'vue-form-wizard'
  import 'vue-form-wizard/dist/vue-form-wizard.min.css'
  import FirstStep from './Wizard/FirstStep.vue'
  import SecondStep from './Wizard/SecondStep.vue'
  import moment from 'moment'

  export default {
    data () {
      return {
        wizardModel: {
          newFamille: true,
          idFamille: null
        }
      }
    },
    props: {
      familles: {
        type: Array
      },
      configuration: {
        type: Object
      }
    },
    components: {
      FormWizard,
      TabContent,
      FirstStep,
      SecondStep
    },
    methods: {
      validateFirstStep () {
        return this.$refs.firstStep.validate()
      },
      validateSecondStep () {
        return this.$refs.secondStep.validate()
      },
      setFamilly (idFamille) {
        this.wizardModel.newFamille = false
        this.wizardModel.idFamille = idFamille
      },
      wizardComplete () {
        // we gather models from all steps into one model
        this.finalModel = {
          ...this.$refs.firstStep.model,
          ...this.$refs.secondStep.model
        }
        if (this.wizardModel.newFamille) {
          const famille = {
            nomFamille: this.finalModel.nomFamille,
            contact: {
              'ID_VILLE': this.finalModel.ville,
              'ID_CIVILITE': this.finalModel.civilites,
              'NOM_MEMBRE': this.finalModel.nom,
              'PRENOM_MEMBRE': this.finalModel.prenom,
              'NAISSANCE_MEMBRE': moment(this.finalModel.naissance).format('YYYY-MM-DD'),
              'ADR_MEMBRE': this.finalModel.addresse
            }
          }
          this.$emit('createFamille', famille)
        } else if (!this.finalModel.enfant) {
          const famille = {
            idFamille: this.wizardModel.idFamille,
            contact: {
              'ID_VILLE': this.finalModel.ville,
              'ID_CIVILITE': this.finalModel.civilites,
              'NOM_MEMBRE': this.finalModel.nom,
              'PRENOM_MEMBRE': this.finalModel.prenom,
              'NAISSANCE_MEMBRE': moment(this.finalModel.naissance).format('YYYY-MM-DD'),
              'ADR_MEMBRE': this.finalModel.addresse
            }
          }
          this.$emit('addAdulte', famille)
        } else {
          const famille = {
            idFamille: this.wizardModel.idFamille,
            contact: {
              'ID_CIVILITE': this.finalModel.civilites,
              'NOM_MEMBRE': this.finalModel.nom,
              'PRENOM_MEMBRE': this.finalModel.prenom,
              'NAISSANCE_MEMBRE': moment(this.finalModel.naissance).format('YYYY-MM-DD')
            }
          }
          this.$emit('addEnfant', famille)
        }
        this.reset()
      },
      reset () {
        this.$refs.newMembreWizard.changeTab(2, 0)
        this.$refs.firstStep.reset()
        this.$refs.secondStep.reset()
      }
    }
  }
</script>
<style>
  .vue-form-wizard .wizard-icon-circle.tab_shape {
    background-color: #9A9A9A !important;
    color: white;
  }
</style>
