<template>
  <div class="reglements-table">
    <el-table class="table table-striped table-no-bordered table-hover"
        :data="tableData"
        highlight-current-row
        border
        style="width: 100%">
      <el-table-column v-for="column in tableColumns"
          :key="column.id"
          :min-width="column.minWidth"
          :prop="column.prop"
          :label="column.label"
          :filters='column.filters'
          :formatter='column.formatter'
          >
      </el-table-column>
      <el-table-column
          label=""
          min-width="50px"
        >
          <template slot-scope="scope">
            <el-tooltip placement="top">
              <div slot="content">
                {{scope.row['NOM_TYPE_REGLEMENT']}}<br/>
                Code Analytique {{scope.row['CODE_ANA']}}
                <span v-if="scope.row['NOM_BANQUE']"><br/>Banque {{scope.row['NOM_BANQUE']}}</span>
                <span v-if="scope.row['CHEQUE_NUM']"><br/>Numéro du chèque {{scope.row['CHEQUE_NUM']}}</span>
              </div>
              <i class="ti-info-alt"></i>
            </el-tooltip>

            <el-tooltip placement="top" v-if="scope.row['ENCAISSE_DATE']">
              <div slot="content">
                Encaissé le {{scope.row['ENCAISSE_DATE'] | moment("dddd D MMMM YYYY") }}
                <span v-if="scope.row['BORDERAU_NUM']"><br/>Numéro du borderau {{scope.row['BORDERAU_NUM']}}</span>
              </div>
              &nbsp;&nbsp;<i class="ti-check"></i>
            </el-tooltip>
           
          </template>
        </el-table-column>
    </el-table>
  </div>
</template>
<script>
  import Vue from 'vue'
  import {Table, TableColumn} from 'element-ui'
  import moment from 'moment'
  Vue.use(Table)
  Vue.use(TableColumn)
  export default{
    props: {
      tableData: {
        type: Array
      }
    },
    data () {
      return {
        tableColumns: [
          {
            prop: 'ID_REGLEMENT',
            minWidth: '30px',
            label: '#'
          },
          {
            prop: 'DATE_REGLEMENT',
            label: 'Date du réglement',
            formatter: this.dateFormater
          },
          {
            prop: 'MONTANT_REGLEMENT',
            label: 'Montant'
          },
          {
            prop: 'NOM_TYPE_REGLEMENT',
            label: 'Type'
          }
        ]
      }
    },
    methods: {
      dateFormater (row, column) {
        return moment(row['DATE_REGLEMENT']).format('DD/MM/YYYY')
      }
    }
  }
</script>
<style scoped lang="scss">
</style>
