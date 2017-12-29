<template>
  <div class="vue-grid-container">
    <table ref="grid" :class="{w100: fullWidth}" cellspacing="0" cellpadding="0" border="0">
      <thead>
      <tr>
        <th v-if="showIndex" :style="{width: indexWidth+'px'}">
        </th>
        <th v-if="showSelect" :style="{width: selectWidth+'px'}">
          <input type="checkbox">
        </th>

        <th v-for="(col, index) of cols" :key="index" @click="changeSort(col.key)">
          {{col.name}}
        </th>
      </tr>
      </thead>

      <tbody v-show="!loading && rows.length">
      <tr v-for="(row, index) of rows" :key="row.id||(row.id=getIndex(index))"
          :style="{backgroundColor: getBackground(index)}" @click="rowClick(row.id, row)">
        <td v-if="showIndex" :style="{textAlign: 'center'}">
          {{getIndex(index)}}
        </td>
        <td v-if="showSelect" :style="{textAlign: 'center'}">
          <input type="checkbox" v-model="row.$selected" @change="rowSelect(row.$selected, row.id, row)">
        </td>
        <template v-for="(col, index) of cols">
          <td v-if="col.edit" :key="index">
            <input class="edit-cell" :style="{textAlign: col.align || 'left'}" v-model="row[col.key]"
                   @focus="cacheEdit(row[col.key])" @change="saveEdit(row[col.key], col.key, row)">
          </td>

          <td v-else :key="index" :style="{textAlign: col.align || 'left'}">
            {{col.format ? col.format(row[col.key], row) : row[col.key]}}
          </td>
        </template>
      </tr>
      </tbody>

      <tbody v-show="loading || !rows.length" class="loader">
      <tr v-show="loading">
        <td colspan="100%">
          <div ref="loader" class="loader" :style="{height: loadingHeight+'px',lineHeight: loadingHeight+'px'}">
            加载中...
          </div>
        </td>
      </tr>
      <tr v-show="!loading && !rows.length">
        <td colspan="100%">
          <div ref="tip" class="tip" :style="{height: loadingHeight+'px',lineHeight: loadingHeight+'px'}">
            无数据！
          </div>
        </td>
      </tr>
      </tbody>
    </table>

    <div ref="pager" class="pager">
      <div v-if="showSelect" class="selected">
        已勾选{{0}}条，
        <button data-type="text">重置</button>
      </div>

      <div class="pageInfo">
        <select v-model="pageSize" class="pageSize">
          <option v-for="size of pageSizeList" :value="size">{{size}}</option>
        </select>
        <button data-type="text" @click="pageNo=1">首页</button>
        <button data-type="text" @click="pageNo>1 && pageNo--">上一页</button>
        {{pageNo}} / {{totalPage}}页
        <button data-type="text" @click="pageNo<totalPage && pageNo++">下一页</button>
        <button data-type="text" @click="pageNo=totalPage">尾页</button>
      </div>
    </div>

  </div>
</template>

<script>
  export default {
    name: 'vue-grid',
    data () {
      return {
        editingVal: '',
      }
    },
    props: {
      stripe: {
        type: Boolean,
        default: true
      },
      fullWidth: {
        type: Boolean,
        default: true
      },
      showIndex: {
        type: Boolean,
        default: true
      },
      indexWidth: {
        type: Number,
        default: 30
      },
      showSelect: {
        type: Boolean,
        default: true
      },
      selectWidth: {
        type: Number,
        default: 30
      },
      cols: {
        type: Array,
        required: true
      },
      rows: {
        type: Array,
        default: () => []
      },
      pageNo: {
        type: Number,
        default: 1
      },
      totalPage: {
        type: Number,
        default: 1
      },
      pageSize: {
        type: Number,
        default: 50
      },
      pageSizeList: {
        type: Array,
        default: () => [10, 20, 50, 100, 1000, 10000]
      },
      rowBGC: {
        type: String,
        default: '#fff'
      },
      oddBGC: {
        type: String,
        default: '#fff'
      },
      evenBGC: {
        type: String,
        default: '#fafafa'
      },
      loading: {
        type: Boolean,
        default: false
      },
      loadingHeight: {
        type: Number,
        default: 350
      },
    },
    methods: {
      rowClick (id, row) {
        this.$emit('onRowClick', id, row)
      },
      rowSelect (val, id, row) {
        this.$emit(val ? 'rowSelected' : 'rowUnSelected', id, row)
        this.$emit('rowSelectedChange', val, id, row)
      },
      changeSort (key) {
        this.sortForward = this.sortBy === key ? !this.sortForward : true
        this.sortBy = key
      },
      getBackground (index) {
        return this.stripe
          ? index % 2
            ? this.oddBGC
            : this.evenBGC
          : this.rowBGC
      },
      getIndex (index) {
        return this.pageSize * (this.pageNo - 1) + index + 1
      },
      cacheEdit (val) {
        this.editingVal = val
      },
      saveEdit (val, key, row) {
        this.$emit('saveeditcell', {val, key, row, oldVal: this.editingVal})
      },
      refresh () {
        this.$emit('refresh', {
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          sortBy: this.sortBy,
          sortForward: this.sortForward
        })
      },
    },
    watch: {
      pageNo () {
        this.refresh()
      },
      pageSize () {
        this.refresh()
      },
      sortBy () {
        this.refresh()
      },
      sortForward () {
        this.refresh()
      },
    }
  }
</script>

<style lang="scss" scoped>
  .vue-grid-container {
    font-size: 12px;
    button[data-type=text] {
      outline: none;
      color: #409eff;
      cursor: pointer;
      border: transparent;
      background: transparent;
    }
    > table.w100 {
      width: 100%;
      th {
        font-size: 14px;
        text-align: center;
      }
      td {
        height: 36px;
        padding: 5px;
        border-bottom: 1px solid #ebeef5;
      }
    }
    .loader {
      text-align: center;
    }
    .pager {
      overflow: hidden;
      padding: 10px 20px;
      border-bottom: 1px solid #ebeef5;
    }
    .selected {
      float: left;
    }
    .pageInfo {
      float: right;
    }
    .pageSize {
      -webkit-appearance: none;
      outline: none;
      padding: 1px 10px;
      border-radius: 2px;
      background-color: transparent;
    }
    .edit-cell {
      padding: 0;
      width: 100%;
      height: 100%;
      border-radius: 5px;
      border: 1px solid transparent;
      outline: none;
      display: inline-block;
      background: transparent;
      text-indent: 15px;
      &:focus {
        transition: all 1s;
        border-color: #409eff;
      }
    }
  }
</style>
