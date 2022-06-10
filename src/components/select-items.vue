<template>
  <div class="table-content">
    <div>
      <van-nav-bar
      left-text="返回"
      right-text="首页"
      title="添加"
      left-arrow
      @click-left="onClickLeft"
      @click-right="onClickRight"
    />
    </div>
    <div class="table-list">
      <ul class="table-tr">
        <li class="table-td" style="max-width: 6%; ">序</li>
        <li class="table-td" style="min-width: 20%; text-align: left">名称</li>
        <li class="table-td" >类别</li>
        <li class="table-td" >规格</li>
        <li class="table-td" >单价</li>
        <li class="table-td" style="text-align: left" @click="checkAll">
            <span class="active-color extend-click">全选</span>
        </li>
      </ul>
      <checkbox-group v-model="checkList" ref="checkboxGroup">
        <ul class="table-tr" v-for="(item, i) in list" :key="'cc' + i">
          <li class="table-td" style="max-width: 6%;">{{i+1}}</li>
          <li class="table-td" style="min-width: 20%; text-align: left">{{item.goodsName}}</li>
          <li class="table-td">{{item.goodsType | filterType}}</li>
          <li class="table-td" >{{item.goodsUnit | filterType2}}</li>
          <li class="table-td" >{{item.goodsPrice}}</li>
          <li class="table-td">
            <checkbox :name="item"></checkbox>
          </li>
        </ul>
       </checkbox-group>
    </div>
    <div style="height: 60px">&nbsp;</div>
    <div class="footer">
      <span class="text">
        已选{{checkList.length}}件
      </span>
      <div class="btn">
        <div class="can-button" @click="filterBtn">
          筛选
        </div>
        <div class="can-button" @click="cancelBtn">
          重选
        </div>
        <div class="con-button" @click="sureGoodBtn">
          确定
        </div>
      </div>
    </div>

    <div :class="{'displayov':!show}">
      <van-popup v-model="show" position="bottom" :style="{ height: '30%', }">
        <div class="filter-name">
          <van-field
            v-model="filterMsg"
            rows="1"
            autosize
            label="商品名称"
            type="textarea"
            placeholder="请输入筛选名称"
          />
        </div>
        <div class="filter-btn">
          <div class="con-button" @click="yesBtn">
            确定
          </div>
          <div class="can-button" @click="canBtn">
            取消
          </div>
        </div>
      </van-popup>
    </div>

  </div>
</template>
<script>
import { Checkbox, CheckboxGroup } from 'vant';
export default {
  data() {
    return {
      show: false,
      filterMsg : '',
      list: [],
      baselist: [],
      checkList: [],
      flag: true,
      flowType: this.$route.query.flowType,
    }
  },
  components: {
    Checkbox,
    CheckboxGroup
  },
  filters: {
    filterType(val) {
      let dictJson = JSON.parse(window.sessionStorage.getItem('DICT-GoodsType'))
      let ds = '';
      dictJson.forEach(dto => {
        if(val == dto.dictValue) {
          ds = dto.dictName
          return
        }
      })
      return ds;
/*      if(val === '0') {
        return '文具用品'
      } else if (val === '1') {
        return '日杂用品'
      }*/
    },
    filterType2(val) {
      let dictJson = JSON.parse(window.sessionStorage.getItem('DICT-GoodsUnit'))
      let ds = '';
      dictJson.forEach(dto => {
        if(val == dto.dictValue) {
          ds = dto.dictName
          return
        }
      })
      return ds;
/*      if(val === '1') {
        return '本'
      } else if (val === '2') {
        return '个'
      } else if (val === '3') {
        return '件'
      } else if (val === '4') {
        return '盒'
      }*/
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
    cancelBtn() {
      this.checkList = []
    },
    filterBtn(){
      this.show = true
    },
    canBtn(){
      this.show=false
    },
    yesBtn() {
      if(this.filterMsg == ''){
        this.list = this.baselist
        this.show=false
        return;
      }
      this.list = [];
      this.baselist.forEach(item => {
        if(item.goodsName.indexOf(this.filterMsg) > -1){
          this.list.push(item);
        }
      });
      this.show=false
    },
    getDefList() {
      let params = {
        "deptCode": window.sessionStorage.getItem('USER-DEPT'),
        "listType": this.flowType,
        "page": 0,
        "size": 0
      }
      this.$http ('/api/gooDefListList', params).then( res => {
        this.list = res.rows
        this.baselist = res.rows
      })
    },
    sureGoodBtn() {
      if ( this.flowType == '0' ||this.flowType == '1' || this.flowType == '2'
        || this.flowType == '3' || this.flowType == '4' || this.flowType == '5' ) {
        // 总金额试算
        let items = JSON.stringify(this.checkList)
        this.$router.push({path: '/items-for', query: {checkList: items, flowType: this.flowType, buytime: this.$route.query.buytime}})
      } else {
        let items = JSON.stringify(this.checkList)
        this.$router.push({path: '/entry-goods', query: {checkList: items, flowType: this.flowType}})
      }

    },
    // 返回
    onClickLeft() {
      this.$router.back(-1)
      // if (this.flowType == '') {

      // } else if (this.flowType == ''){

      // }
    },
    // 首页
    onClickRight() {
      this.$router.push({path:'/index' })
    }
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
          padding: 0 4px
          text-align: center;
    .footer
      width: 100%
      height: 60px
      padding: 5px 0
      background: #fff
      position: fixed
      bottom: 0
      left: 0
      display: flex
      justify-content: space-between
      align-items: center
      .btn
        margin-right: 10px
        display: flex
        .can-button
          height: 38px
          width: 80px
          border: $border-1px
          border-radius: 5px
          text-align: center
          line-height: 38px
          margin-left: 5px
        .con-button
          height: 40px
          width: 80px
          border-radius: 5px
          text-align: center
          line-height: 40px
          background: #1989fa
          color: #fff
          margin-left: 5px
      .text
        margin-left: 10px
  .displayov
    .van-overlay
      display :none
  .filter-name
    width: 80%
    height: 15%
    justify-content: space-between
    align-items: center
    position: fixed
    display: flex
    margin-left: 10%;
  .filter-btn
    width: 80%
    height: 15%
    padding: 5px 0
    background: #fff
    position: fixed
    bottom: 0
    left: 0
    display: flex
    justify-content: space-between
    align-items: center
    margin-left: 10%;
    .can-button
      height: 38px
      width: 120px
      border: $border-1px
      border-radius: 5px
      text-align: center
      line-height: 38px
      margin-left: 45px
    .con-button
      height: 40px
      width: 120px
      border-radius: 5px
      text-align: center
      line-height: 40px
      background: #1989fa
      color: #fff
</style>