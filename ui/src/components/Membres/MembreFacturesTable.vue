<template>
  <div class="factures-table">
    <div class="grid-container">
      <el-table class="table table-striped table-no-bordered table-hover"
                :data="factures"
                highlight-current-row
                border
                @current-change="handleCurrentChange"
                :default-sort = "{prop: 'DATE_FACTURE', order: 'ascending'}"
                style="width: 100%;">
        <el-table-column v-for="column in tableColumns"
              :key="column.id"
              :min-width="column.minWidth"
              :prop="column.prop"
              :label="column.label"
              :sortable="column.sortable"
              :filters='column.filters'
              :formatter='column.formatter'
                          >
        </el-table-column>
        <el-table-column
          label=""
          min-width="30px"
        >
          <template slot-scope="scope">
            <i v-if="scope.row['MONTANT_FACTURE'] - scope.row['MONTANT_REGLE']  <= 0" class="ti-check"></i>
            <i v-else class="ti-close"></i>
          </template>
        </el-table-column>
      </el-table>
    </div>
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
      factures: {
        type: Array
      }
    },
    data () {
      return {
        selectedId: -1,
        tableColumns: [
          {
            prop: 'ID_FACTURE',
            minWidth: '40px',
            label: '#'
          },
          {
            prop: 'DATE_FACTURE',
            formatter: this.dateFormater,
            sortable: true,
            minWidth: '50px',
            label: 'Date'
          },
          {
            prop: 'MONTANT_FACTURE',
            minWidth: '50px',
            label: 'Montant'
          },
          {
            prop: 'NOM_TYPE_FACTURE',
            label: 'type'
          },
          {
            prop: 'MOTIF_FACTURE',
            label: 'Motif'
          }
        ]
      }
    },
    methods: {
      dateFormater (row, column) {
        return moment(row['DATE_FACTURE']).format('DD/MM/YYYY')
      },
      handleCurrentChange (elem) {
        this.$emit('factureSelected', elem)
      }
    }
  }
</script>
<style scoped lang="scss">
</style>
