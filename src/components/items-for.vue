<template>
  <!-- 物品申请-添加 -->
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
          采购时间
        </div>
        <div class="order-text">
          <span>{{buytime}}</span>
          <span class="icon-arrow"></span>
        </div>
      </div>
      <!-- 负责人 -->
      <div class="goods-content">
        <div class="title">负责人</div>
        <div class="ava">
          <div class="ava-items">
            <img :src="avatarUrl">
          </div>
          <div class="ava-name">
            {{userName}}
          </div>
        </div>
      </div>
      <!-- 采购明细添加 -->
      <div class="item" style="margin-top: 5px">
        <div class="item-order">
          采购明细
        </div>
        <div class="order-text">
          <span class="add" @click="addBtn">+添加</span>
        </div>
      </div>
      <!-- 采购明细列表 -->
      <div class="table" v-if="list&&list.length !==0">
        <div class="header">
          <div class="name" style="flex: 2">序号</div>
          <div class="name">产品名称</div>
          <!-- <div class="name">产品规格</div> -->
          <div class="name">单价</div>
          <div class="name" style="flex: 7">数量</div>
        </div>
        <div class="list" v-for="(item, index) in list" :key="index">
          <div class="mumber" style="flex: 2">{{index + 1}}</div>
          <div class="name">{{item.goodsName}}</div>
          <div class="name">{{item.goodsPrice}}</div>
          <div class="specifications" style="flex: 7">
            <van-stepper v-model.number="item.goodsNum" min="0" button-size="19px"
              async-change
              @change="countChange"
            />
          </div>
        </div>
      </div>

      <!-- 采购金额 -->
      <div class="item" style="margin-top: 5px">
        <div class="item-order">
          采购金额
        </div>
        <div class="order-text">
          {{countAmount}}
        </div>
      </div>
      <div style="height: 60px">&nbsp;</div>
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
      countAmount: 0,
      avatarUrl: '',
      userName: '',
      title: this.$route.query.title,
      showLay: false,
      timer: null,

    }
  },
  created () {
    let dictJson = JSON.parse(window.sessionStorage.getItem('DICT-FlowType'))
    let ds = '';
    dictJson.forEach(dto => {
      if(this.flowType == dto.dictValue) {
        ds = dto.dictName
        return
      }
    })
    this.title = ds
    this.buytime = this.$route.query.buytime
    this.getList()
    this.getCurDate()
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
    },
    filtersNumber(val) {
      //console.log(val)
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
    getList () {
      // 遍历数据添加一个属性用于添加数量
      let itemJson = JSON.parse(window.sessionStorage.getItem('SELECT-ITEM'))
      this.list = []
      let listItems = this.$route.query.checkList
      if(typeof listItems === 'string') {
        let allItems = [];
        let listNew = listItems = JSON.parse(listItems)
        if(listNew && listNew.length >0) {
          // 判断一下，已添加的
          if(itemJson && itemJson.length > 0){
            let itemOld = [];
            itemJson.map(item=>{
              let has = false;
              listNew.map(req=> {
                if(item.id == req.id){
                  has = true;
                }
              });
              if(!has){
                itemOld.push(item);
              }
            });
            if(itemOld && itemOld.length >0){
              itemOld.map(req=> {
                allItems.push(req);
              });
            }
          }
          listNew.map(req=> {
            allItems.push(req);
          })
          allItems.map(req=> {
            if(!req.goodsNum)
              req.goodsNum = 1
            this.countAmount =  this.countAmount + req.goodsPrice * req.goodsNum
          })
        }
        this.list = allItems || []
        window.sessionStorage.setItem('SELECT-ITEM', JSON.stringify(this.list));
      }
      this.getApprovedBy()
    },
    // 获取默认审批人
    getApprovedBy() {
      let params = {
        deptCode: window.sessionStorage.getItem('USER-DEPT'),
        flowType: this.flowType
      }
      // console.log(params)
      this.$http('/api/nextExaminer', params).then(res => {
        this.avatarUrl = res.avatarUrl
        this.userName = res.userName
      })
    },
    // 添加
    addBtn() {
      this.$router.push({path:'/select-Items', query: { flowType: this.flowType , buytime: this.buytime} })
    },
    // 加减
    countChange() {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        // 注意此时修改value后会再次触发change事件
        let totalAmount = 0
        this.list.map((req, index) => {
          totalAmount = (parseInt(totalAmount * 100) + parseInt(req.goodsPrice * 100 * req.goodsNum )) / 100
          if(req.goodsNum === 0) {
            this.list.splice(index, 1)
          }
        })
        window.sessionStorage.setItem('SELECT-ITEM', JSON.stringify(this.list));
        this.countAmount = totalAmount
      },0);
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
      let params = {
          "applyUseDate": this.buytime,
          "flowType": this.flowType,
          "goods": this.list
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
        this.showLay=false
      }, rej => {
        this.showLay=false
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
    }
  },
  destroyed() {
    this.timer && clearTimeout(this.timer)
  }
}
</script>
<style lang="stylus" scoped>
@import "~common/styl/variable.styl"
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
      padding: 0 5px
      background: #fff
      .header
        padding: 15px 0
        display: flex
        align-items: center
        justify-content: center
        div
          flex: 5
          text-align: center
      .list
        padding: 15px 0
        display: flex
        align-items: center
        justify-content: center
        div
          flex: 5
          text-align: center
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