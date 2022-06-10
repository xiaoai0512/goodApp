<template>
  <!-- 新员工入职物资 -->
  <div>
    <van-nav-bar
      left-text="返回"
      right-text="首页"
      :title="title"
      left-arrow
      @click-left="onClickLeft"
      @click-right="onClickRight"
    />
    <div class="goods-items-add">
      <div class="item">
        <div class="item-order">
          申请单号
        </div>
        <div class="order-text">
          自动生成
        </div>
      </div>
      <div class="item" style="margin-top: 5px" @click="dateTime">
        <div class="item-order">
          领用日期
        </div>
        <div class="order-text">
          <span>{{buytime}}</span>
          <span class="icon-arrow"></span>
        </div>
      </div>
      <!-- 领用人 -->
      <div class="goods-content">
        <div class="title">领用人</div>
        <div class="ava" @click="personInforBtn">
          <div class="ava-items">
            <img :src="avatarUrl">
          </div>
          <div class="ava-name">
            {{userName}}
          </div>
        </div>
      </div>
      <div class="item" style="margin-top: 5px">
        <van-field class="title" v-model="remarks" label="申请说明" :required="true" />
      </div>
      <!-- 采购明细添加 -->
      <div class="item" style="margin-top: 5px">
        <div class="item-order">
          领用明细
        </div>
        <!-- <div class="order-text">
          <span class="add" @click="addBtn">+添加</span>
        </div> -->
      </div>
      <!-- 入职默认物资明细列表 -->
      <div class="table" :data="list">
        <div class="header">
          <div class="name">序号</div>
          <div class="name">产品</div>
          <div class="name">规格</div>
          <div class="name">数量</div>
        </div>
        <div class="list" v-for="(item, index) in list" :key="index">
          <div class="mumber">{{index + 1}}</div>
          <div class="name">{{item.goodsName}}</div>
          <div class="specifications">{{item.goodsUnit  | filterType }}</div>
          <div class="specifications">{{item.goodsNum}}</div>
        </div>
      </div>

      <!-- footer-提交 -->
      <div class="footer" @click="submit">
        提交
      </div>
      <!-- 选择时间 -->
      <van-popup v-model="show" position="bottom" :style="{ height: '50%' }">
        <div>
          <van-datetime-picker
            v-model="currentDate"
            type="date"
            title="选择年月日"
            :min-date="minDate"
            :max-date="maxDate"
            :formatter="formatter"
            @confirm="confirmTime"
            @cancel="cancelTime"
          />
        </div>
      </van-popup>

    </div>
    <!-- 遮罩层 -->
    <van-overlay :show="showLay" @click="show=false" z-index="10000">
      <div class="wrapper" @click.stop>
        <van-loading type="spinner" color="#1989fa" />
      </div>
    </van-overlay>
  </div>

</template>
<script>
import {Toast} from "vant";

export default {
  data() {
    return {
      list: [],
      minDate: new Date(2020, 0, 1),
      maxDate: new Date(2025, 10, 1),
      currentDate: new Date(),
      show: false,
      buytime: '',
      tmonth: 0,
      tmonth_str:'',
      tday : 0,
      tday_str: '',
      flowType: this.$route.query.flowType,
      avatarUrl: '',
      userName: '',
      title: this.$route.query.title,
      showLay: false,
      remarks: '',
    }
  },
  created () {
    this.getCurDate()
  },
  mounted(){
    this.getList()
    this.getApprovedBy()
  },
  filters: {
    filterType(val) {
      let dictJson = JSON.parse(window.sessionStorage.getItem('DICT-GoodsUnit'))
      let ds = '';
      dictJson.forEach(dto => {
        if(val == dto.dictValue) {
          ds = dto.dictName
          return
        }
      })
      return ds;
    }
  },
  methods: {
    // 获取当前日期
    getCurDate() {
      this.tmonth = this.currentDate.getMonth() + 1;
      if(this.tmonth < 10){
        this.tmonth_str = '0'+this.tmonth;
      }else{
        this.tmonth_str = this.tmonth;
      }
      this.tday = this.currentDate.getDate();
      if(this.tday < 10){
        this.tday_str = '0'+ this.tday;
      }else {
        this.tday_str = this.tday;
      }
      this.buytime = this.currentDate.getFullYear()+ '-' + this.tmonth_str+'-' +this.tday_str
    },
    // 入职默认物资查询
    getList () {
      let params = {
          "deptCode": window.sessionStorage.getItem('USER-DEPT'),
          "listType": this.flowType,
          "page": 0,
          "size": 0
      }
      this.$http('/api/gooDefListList', params).then( res => {
        if (res.rows.length > 0) {
          res.rows.forEach( (rowItem) => {
            rowItem.goodsNum = 1
          })
          this.list = res.rows
        }
      })
    },
    // 添加
    // addBtn() {
    //   this.$router.push({path:'/select-Items' });
    // },
    // 获取默认审批人
    getApprovedBy() {
      let userJson = JSON.parse(window.sessionStorage.getItem('USER-INFO'))
      if(userJson == null ) {
        let params = {
          // deptCode: window.sessionStorage.getItem('USER-DEPT'),
          // flowType: this.flowType
        }
        this.$http('/api/userInfo', params).then(res => {
          this.avatarUrl = res.avatarUrl
          this.userName = res.userName
        })
      }else{
        this.avatarUrl = userJson.avatarUrl
        this.userName = userJson.userName
      }
    },
    // 提交
    submit() {
      if( typeof (this.buytime) == 'undefined' || this.buytime == ''){
        Toast.fail({
          message: "日期不能为空"
        })
        return ;
      }
      if( typeof (this.list) == 'undefined' || this.list == ''){
        Toast.fail({
          message: "申请产品不能为空"
        })
        return ;
      }
      if( typeof (this.remarks) == 'undefined' || this.remarks == ''){
        Toast.fail({
          message: "申请说明不能为空"
        })
        return ;
      }
      let params = {
          "applyUseDate": this.buytime,
          "flowType": this.flowType,
          "goods": this.list,
          "remarks": this.remarks
      }
      let str = '';
      let dcd = '';
      let flowJson = JSON.parse(window.sessionStorage.getItem('USER-Limit'))
      flowJson.forEach(flowto => {
        let flown = flowto.flowType
        if(flown == this.flowType) {
          str = flowto.flowCode
          dcd = flowto.deptCode
        }
      })
      params.flowCode = str;
      params.deptCode = dcd;
      this.showLay = true
      this.$http('/api/appInfoAdd', params).then( res => {
        if (res.rscode == '000000') {
          this.$toast.success({
            message: '申请成功'
          })
          this.$router.push({path:'/index' })
        }
        this.showLay = false
      }, rej =>{
        this.showLay = false
      })

    },
    // 个人信息
    personInforBtn() {
      let params = {
        // "deptCode": window.sessionStorage.getItem('USER-DEPT'),
        // "flowType": this.flowType
      }
      this.$http('/api/userInfo', params).then( res => {

      })

    },
    dateTime() {
      this.show = true
    },
    confirmTime() {
      this.tmonth = this.currentDate.getMonth() + 1;
      if(this.tmonth < 10){
        this.tmonth_str = '0'+this.tmonth;
      }else{
        this.tmonth_str = this.tmonth;
      }
      this.tday = this.currentDate.getDate();
      if(this.tday < 10){
        this.tday_str = '0'+ this.tday;
      }else {
        this.tday_str = this.tday;
      }
      this.buytime = this.currentDate.getFullYear()+ '-' + this.tmonth_str+'-' +this.tday_str
      this.show = false

    },
    cancelTime() {
      this.show = false
    },
    formatter(type, val) {
      if (type === 'year') {
        return `${val}年`;
      } else if (type === 'month') {
        return `${val}月`;
      } else if (type === 'day') {
        return `${val}日`;
      }
      console.log(val)
      return val;
    },
    // 返回
    onClickLeft() {
      this.$router.back(-1)
    },
    // 首页
    onClickRight() {
      this.$router.push({path:'/index' })
    },

  }
}
</script>
<style lang="stylus" scoped>
@import "~common/styl/variable.styl"
  .van-cell--required::before
    left 0;
  .van-field
    font-size 13px
    padding: 0 0 0 8px;
  .goods-items-add
    .item
      display: flex
      justify-content: space-between
      padding: 15px
      background: #fff
      .order-text
        display: flex
        align-items: center
        .add
          color: $color
    .goods-content
      margin-top: 5px
      padding: 15px
      background: #fff
      .ava
        margin-top: 15px
        .ava-items
          width: 36px
          height 36px
          border-radius: 50%
          background: #eee
          overflow: hidden
          img
            height: 36px
            width: 36px
        .ava-name
          margin-top: 10px
          padding: 0px
    .table
      margin-top: 5px
      padding: 0 15px
      background: #fff
      .header
        padding: 15px 0
        display: flex
        align-items: center
        justify-content: center
        div
          flex: 1
      .list
        padding: 15px 0
        display: flex
        align-items: center
        justify-content: center
        div
          flex: 1
    .footer
      height: 50px
      width: 100%
      line-height: 50px
      background-color: royalblue;
      color: whitesmoke;
      border-radius: 6px;
      bottom: 6px;
      position: fixed
      left: 0
      font-size medium
      text-align center
  .wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
</style>