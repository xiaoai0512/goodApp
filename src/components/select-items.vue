<template>
  <div class="table-content">
    <div class="table-list">
      <ul class="table-tr">
        <li class="table-td">序号</li>
        <li class="table-td">产品名称</li>
        <li class="table-td">产品类别</li>
        <li class="table-td">产品型号</li>
        <li class="table-td" @click="checkAll">
            全选
        </li>
      </ul>
      <checkbox-group v-model="checkList" ref="checkboxGroup">
        <ul class="table-tr" v-for="(item, i) in list" :key="'cc' + i">
          <li class="table-td">{{i}}</li>
          <li class="table-td">{{item.goodsName}}</li>
          <li class="table-td">{{item.goodsType | filterType}}</li>
          <li class="table-td">{{item.goodsCode}}</li>
          <li class="table-td">
            <checkbox :name="item"></checkbox>
          </li>
        </ul>
       </checkbox-group>
    </div>
  </div>
</template>
<script>
import { Checkbox, CheckboxGroup } from 'vant';
import httpServe from 'common/js/axios-http.js'

export default {
  data() {
    return {
      list: [
        {
          goodsName: 'sd',
          goodsType: 9,
          goodsCode: 0
        }
      ],
      checkList: [],
      flag: true
    }
  },
  components: {
    Checkbox,
    CheckboxGroup
  },
  filters: {
    filterType(val) {
      if(val === '0') {
        return '文具用品'
      } else if (val === '1') {
        return '日杂用品'
      }
    }
  },
  mounted() {
    this.getDefList()
  },
  methods: {
    checkAll() {
      if(this.flag) {
        this.$refs.checkboxGroup.toggleAll(true)
        this.flag = false
        return
      }
      if(this.flag === false) {
        this.$refs.checkboxGroup.toggleAll()
        this.flag = true
      }
    },


    getDefList() {
      let params = {
        "deptCode": "",
        "listType": "",
        "page": 0,
        "size": 0
      }
      this.$http ('/api/gooInfoList', params).then( res => {
        console.log(res)
        this.list = res.rows
      })
    },
  }
}
</script>
<style lang="stylus" scoped>
@import "~common/styl/variable.styl"
  .table-content
    background: $color-background-fff
    .table-list
      .table-tr
        padding: 15px 0
        display: flex
        .table-td
          flex: 1
          padding: 0 10px
          // text-align: center
</style>