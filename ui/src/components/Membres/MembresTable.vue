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
    computed: {
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
            for (let key of this.propsToSearch) {
              let rowValue = row[key].toString().toLowerCase()
              if (rowValue.includes && rowValue.includes(this.searchQuery.toLowerCase())) {
                isIncluded = true
              }
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

      tableData () {
        return this.$store.state.membres.list
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
          currentPage: 1,
          total: 0
        },
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
      handleCurrentChange (elem) {
        this.currentMembre = elem
        this.$emit('membreSelected', elem)
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
