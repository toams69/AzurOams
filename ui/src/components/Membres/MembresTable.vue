<template>
  <div class="membre-table">
    <div class="card">
      <div class="card-header">
        <div class="category">Listes des membres</div>
      </div>
      <div class="card-content row">
        <div class="col-lg-12">
          <div>
            <label>
              <input type="search" class="form-control input-sm" placeholder="Rechercher" v-model="searchQuery" aria-controls="datatables">
            </label>
          </div>
        </div>
      </div>
    </div>
    <div class="grid-container">
      <el-table class="table table-striped table-no-bordered table-hover"
                :data="queriedData"
                highlight-current-row
                @current-change="handleCurrentChange"
                border
                ref="table"
                style="width: 100%">
        <el-table-column v-for="column in tableColumns"
              :key="column.id"
              :min-width="column.minWidth"
              :prop="column.prop"
              :label="column.label"
        >
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <div class="col-sm-6 pagination-info">
        <p class="category">{{total}} membres</p>
      </div>
      <div class="col-sm-6">
        <p-pagination class="pull-right"
                      v-model="pagination.currentPage"
                      :per-page="pagination.perPage"
                      :total="pagination.total">
        </p-pagination>
      </div>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue'
  import {Table, TableColumn, Select, Option} from 'element-ui'
  import PPagination from '@/components/Pagination.vue'
  Vue.use(Table)
  Vue.use(TableColumn)
  Vue.use(Select)
  Vue.use(Option)
  export default{
    components: {
      PPagination
    },
    props: {
      tableData: {
        type: Array
      }
    },
    computed: {
      getMemberToDisplay () {
        if (this.membreToDisplay) {
          let result = this.tableData.find((row) => { return row['ID_ENFANT'] === this.membreToDisplay['ID_ENFANT'] && row['ID_MEMBRE'] === this.membreToDisplay['ID_MEMBRE'] })
          return result
        } else {
          return null
        }
      },
      pagedData () {
        return this.tableData.slice(this.from, this.to)
      },
      /***
       * Searches through table data and returns a paginated array.
       * Note that this should not be used for table with a lot of data as it might be slow!
       * Do the search and the pagination on the server and display the data retrieved from server instead.
       * @returns {computed.pagedData}
       */
      queriedData () {
        if (!this.searchQuery) {
          this.pagination.total = this.tableData.length
          return this.pagedData
        }
        let result = this.tableData
          .filter((row) => {
            let isIncluded = false
            let i = 0
            for (let index of this.searchQuery.split(' ')) {
              if (i === 0) {
                for (let key of this.propsToSearch) {
                  let rowValue = row[key].toString().toLowerCase()
                  if (rowValue.includes && rowValue.includes(index.toLowerCase())) {
                    isIncluded = true
                  }
                }
              } else if (isIncluded) {
                isIncluded = false
                for (let key of this.propsToSearch) {
                  let rowValue = row[key].toString().toLowerCase()
                  if (rowValue.includes && rowValue.includes(index.toLowerCase())) {
                    isIncluded = true
                  }
                }
              }
              i++
            }
            return isIncluded
          })
        this.pagination.total = result.length
        return result.slice(this.from, this.to)
      },
      to () {
        let highBound = this.from + this.pagination.perPage
        if (this.total < highBound) {
          highBound = this.total
        }
        return highBound
      },
      from () {
        return this.pagination.perPage * (this.pagination.currentPage - 1)
      },
      total () {
        this.pagination.total = this.tableData.length
        return this.tableData.length
      }
    },
    data () {
      return {
        pagination: {
          perPage: 10,
          total: 0,
          currentPage: 1
        },
        membreToDisplay: null,
        searchQuery: '',
        propsToSearch: ['ABREVIATION_CIVILITE', 'PRENOM_MEMBRE', 'NOM_MEMBRE', 'AGE_MEMBRE'],
        tableColumns: [
          {
            prop: 'ABREVIATION_CIVILITE',
            label: 'Civilité',
            minWidth: '30px'
          },
          {
            prop: 'NOM_MEMBRE',
            label: 'Nom'
          },
          {
            prop: 'PRENOM_MEMBRE',
            label: 'Prénom'
          },
          {
            prop: 'AGE_MEMBRE',
            label: 'Age',
            minWidth: '30px'
          }
        ]
      }
    },
    methods: {
      setCurrentRow (membreToDisplay) {
        this.searchQuery = ''
        this.membreToDisplay = membreToDisplay
        setTimeout(() => {
          if (this.$refs && this.$refs.table) {
            this.$refs.table.setCurrentRow(this.getMemberToDisplay)
          }
        }, 500)
      },
      handleCurrentChange (elem) {
        if (elem) {
          if (this.membreToDisplay && (elem['ID_ENFANT'] !== this.membreToDisplay['ID_ENFANT'] || elem['ID_MEMBRE'] !== this.membreToDisplay['ID_MEMBRE'])) {
            this.membreToDisplay = null
          }
          this.currentMembre = elem
          this.$emit('membreSelected', elem)
          if (elem && this.membreToDisplay) {
            let result = this.tableData.find((row) => { return row['ID_ENFANT'] === elem['ID_ENFANT'] && row['ID_MEMBRE'] === elem['ID_MEMBRE'] })
            let index = this.tableData.indexOf(result)
            if (index > 0) {
              this.pagination.currentPage = parseInt(index / this.pagination.perPage) + 1
            }
          }
        }
      }
    }
  }
</script>
<style scoped lang="scss">

  .membre-table {
    background: white;
    position: relative;
    height: 100%;
    > .card {
      border-radius: 0;
      box-shadow: none;
    }
    > .grid-container {
      position: absolute;
      top: 115px;
      left: 15px;
      right: 15px;
      bottom: 70px;
      overflow: auto;
    }
    > .pagination-container {
      position: absolute;
      left: 15px;
      right: 15px;
      bottom: 0px;
      .pagination-info {
        margin-top: 25px;
        color: #777777;
      }
    }
  }
  label {
    width: 100%;
    input {
      width: 100%;
    }
  }
</style>
