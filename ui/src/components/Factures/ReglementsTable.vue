<template>
  <div class="reglements-table">
    <el-table class="table table-striped table-no-bordered table-hover"
        :data="tableData"
        highlight-current-row
        @current-change="handleCurrentChange"
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
