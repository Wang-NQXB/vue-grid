<template>
  <div id="app">
    <vue-grid v-bind="gridOpt"
              @refresh="refresh"
              @saveeditcell="saveEditCell"
              @rowSelectedChange="rowSelectedChange"/>
  </div>
</template>

<script>
  import VueGrid from './components/VueGrid'
  import getData from './data'

  export default {
    name: 'app',
    components: {VueGrid},
    data () {
      return {
        gridOpt: {
          cols: [
            {key: 'name', name: '姓名'},
            {key: 'age', name: '年龄', edit: true},
            {key: 'gender', name: '性别', align: 'center'},
          ],
          pageNo: 1,
          pageSize: 20,
          totalPage: 1,
          loading: false,
          allSelected: false
        }
      }
    },
    mounted () {
      this.refresh({pageNo: 1, pageSize: 20})
    },
    methods: {
      saveEditCell ({val, oldVal, key, row}) {
        switch (key) {
          case 'age':
            return this.updateAge(val, oldVal, row)
        }
      },
      updateAge (val, oldVal, row) {
        row.age = /^\d+$/.test(val) ? val : oldVal
      },
      rowSelectedChange (val, id, row) {
        console.log(val ? 'rowSelected!' : 'rowUnSelected')
      },
      refresh ({pageNo, pageSize, sortBy, sortForward}) {
        this.gridOpt.loading = true
        this.gridOpt.pageNo = pageNo
        this.gridOpt.pageSize = pageSize
        this.gridOpt.sortBy = sortBy
        this.gridOpt.sortForward = sortForward

        setTimeout(() => {
          const data = getData(pageNo, pageSize, sortBy, sortForward)
          this.gridOpt.rows = data.rows
          this.gridOpt.totalPage = data.totalPage
          this.gridOpt.loading = false
        }, 2000)
      }
    }
  }
</script>

<style>
</style>
