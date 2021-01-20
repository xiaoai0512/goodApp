<template>
  <!-- 物品申请-添加 -->
  <div class="goods-items-add">
    <div class="item">
      <div class="item-order">
        采购单号
      </div>
      <div class="order-text">
        自动生成
      </div>
    </div>
    <div class="item" style="margin-top: 5px">
      <div class="item-order">
        采购时间
      </div>
      <div class="order-text">
        2020-11-02
        <span class="icon-arrow"></span>
      </div>
    </div>
    <!-- 负责人 -->
    <div class="goods-content">
      <div class="title">负责人</div>
      <div class="ava">
        <div class="ava-items">
          <img src="" alt="">
        </div>
        <div class="ava-name">
          12342141
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
    <div class="table" :data="list">
      <div class="header">
        <div class="name">序号</div>
        <div class="name">产品名称</div>
        <div class="name">产品规格</div>
      </div>
      <div class="list" v-for="(item, index) in list" :key="index">
        <div class="mumber">{{index + 1}}</div>
        <div class="name">{{item.goodsName}}</div>
        <div class="specifications">{{item.goodsType}}</div>
      </div>
    </div>
    <!-- 采购金额 -->
    <div class="item" style="margin-top: 5px">
      <div class="item-order">
        采购金额
      </div>
      <div class="order-text">
        ￥100
      </div>
    </div>
    <!-- footer-提交 -->
    <div class="footer" @click="submit">
      提交
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      list: [],
    }
  },
  created () {
    this.$Toast('34343')
  },
  methods: {
    // 
    getList () {
      this.$http('/api/appInfoAdd', params, type).then( res => {
        console.log(res)
      })
    },
    // 添加
    addBtn() {
      this.$router.push({path:'/select-Items'});
    },
    // 提交
    submit() {
      // this.$httpServe(url, params, type)
      let params = {
          "applyUseDate": "",
          "deptCode": "",
          "flowCode": "",
          "flowType": "",
          "goods": [
            {
              "goodsCode": "",
              "goodsNum": 0
            }
          ],
          "remarks": ""
      }
      this.$http('/api/gooInfoList', params ,(res) => {
      
        console.log(res)
      })

    }
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
          width: 50px
          height 50px
          border-radius: 50%
          background: red
        .ava-name
          margin-top: 5px
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
      color: $color
      background: #ffffff
      position: fixed
      bottom: 0
      left: 0
      text-align center
</style>