<template>
  <div id="app">
    <vue-grid v-bind="options"
              @saveeditcell="saveEditCell"
              @refresh="refresh"/>
  </div>
</template>

<script>
  import VueGrid from './components/VueGrid'
  import getData from './data'

  console.log(getData)
  export default {
    name: 'app',
    components: {VueGrid},
    data () {
      return {
        options: {
          cols: [
            {key: 'name', name: '姓名'},
            {key: 'age', name: '年龄', edit: true},
            {key: 'gender', name: '性别', align: 'center'},
          ],
          rows: [],
          pageNo: 1,
          pageSize: 20,
          totalPage: 1
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
      refresh ({pageNo, pageSize, sortBy, sortForward}) {
        const data = getData(pageNo, pageSize, sortBy, sortForward)
        this.options.rows = data.rows
        this.options.pageNo = data.pageNo
        this.options.pageSize = data.pageSize
        this.options.totalPage = data.totalPage
      }
    }
  }
</script>

<style>
</style>
