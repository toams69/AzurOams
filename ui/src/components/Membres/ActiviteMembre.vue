<template>
  <div>
    <el-dialog
      title="Création Adhésion"
      :visible.sync="dialogAdhesionVisible"
      width="40%"
      append-to-body >
      <span>  
       <adhesion-form :membre='membre' :currentAnnee='annee' ref="adhesion"></adhesion-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelCreateAdhesion">Annuler</el-button>
        <el-button type="primary" @click="createAdhesion">Ajouter</el-button>
      </span>
    </el-dialog>
    <el-select v-model="annee" placeholder="Année">
      <el-option
        v-for="item in annees"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
    <br/><br/>
    <div v-if="!numeroAdherent || !numeroAdherent['NUMERO_ADHERENT']">
      Le membre n'est pas adhérent pour l'année choisie
      <br/><br/>
      <button type="button" class="add-member btn btn-wd btn-info btn-fill btn-magnify" @click="dialogAdhesionVisible = true" title="Créer une adhésion pour ce membre">
          Créer une adhésion
      </button>
    </div>
    <div v-else>
      Le membre est adhérent. Son numéro d'adhérent est le <b>{{numeroAdherent['NUMERO_ADHERENT']}}</b>
      <br/><br/>
      Activités auxquelles ce membre est inscrit
      <br/><br/>
      <ul>
        <li v-for="activite in activites">
          <b>{{activite['NOM_ACTIVITE']}}</b>
        </li>
      </ul>
      <br/><br/>
      <!-- <button type="button" class="add-member btn btn-wd btn-info btn-fill btn-magnify" @click="dialogActiviteVisible = true" title="Créer une adhésion pour ce membre">
          Insription à une activité
      </button> -->
    </div>
  </div>
</template>
<script>
  import moment from 'moment'
  import AdhesionForm from '@/components/Activites/AdhesionForm.vue'

  export default {
    components: {
      AdhesionForm
    },
    data () {
      return {
        dialogAdhesionVisible: false,
        dialogActiviteVisible: false,
        annee: ''
      }
    },
    props: {
      configuration: {
        type: Object
      },
      membre: {
        type: Object
      }
    },
    computed: {
      currentAnnee () {
        return this.configuration.annees.find((a) => {
          return moment().isBetween(moment(a['DATE_DEBUT']), moment(a['DATE_FIN']))
        })
      },
      annees () {
        return this.configuration.annees.map(function (e) { return {value: e['ID_ANNEE'], label: moment(e['DATE_DEBUT']).format('YYYY') + ' - ' + moment(e['DATE_FIN']).format('YYYY')} })
      },
      numeroAdherent () {
        if (!this.membre || !this.membre.adhesions) {
          return null
        }
        return this.membre.adhesions.find((e) => { return e['ID_ANNEE'] === this.annee })
      },
      activites () {
        if (!this.membre || !this.membre.activites) {
          return []
        }
        return this.membre.activites.filter((e) => { return e['ID_ANNEE'] === this.annee }) || []
      }
    },
    methods: {
      cancelCreateAdhesion () {
        if (this.$refs && this.$refs.adhesion) {
          this.$refs.adhesion.reset()
        }
        this.dialogAdhesionVisible = false
      },
      createAdhesion () {
        if (this.$refs && this.$refs.adhesion) {
          const form = {
            annee: this.configuration.annees.find((e) => { return e['ID_ANNEE'] === this.annee }),
            membre: this.membre,
            montant: this.$refs.adhesion.model.montant || 0,
            numeroAdherent: this.$refs.adhesion.model.numeroAdherent
          }
          this.$refs.adhesion.validate().then((result) => {
            if (!result) {
              return
            }
            this.$store.dispatch('CREATE_ADHESION', form).then(() => {
              this.$notify({
                component: {
                  template: `<span>Effectué avec succès</span>`
                },
                icon: 'ti-thumb-up',
                horizontalAlign: 'center',
                verticalAlign: 'bottom',
                type: 'success'
              })
            })
            this.$refs.adhesion.reset()
            this.dialogAdhesionVisible = false
          })
        }
      }
    },
    mounted () {
      if (this.currentAnnee) {
        this.annee = this.currentAnnee['ID_ANNEE']
      }
    }
  }
</script>
<style>

</style>
