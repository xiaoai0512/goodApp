<template>
  <!-- 办公用品领用 -->
  <div>
    <van-nav-bar
    title="申请详情"
      left-text="返回"
      right-text="首页"
      left-arrow
      @click-left="onClickLeft"
      @click-right="onClickRight"
    />
    <div class="goods-out">
      <div class="titile">产品明细：</div>
      <div class="list" v-for="(item, index) in list " :key="index">
        <div class="left">
              <div class="item">名称：{{item.goodsName}}</div>
              <div class="item">规格：{{item.goodsNum}} {{item.goodsUnitDesc}}</div>
            </div>
            <div class="right">
              <!--<div class="round" @click="hadleDetail"></div>-->
            </div>
      </div>
      <!--<goods-add></goods-add>-->
    </div>
      <div class="goods-out">
      <div class="titile">审批意见：</div>
      <div class="list" v-for="(item, index) in listHis " :key="index">
          <div class="left">
              <div class="number">审批人：{{item.approvalUserName}} [{{item.approvalUser}}]</div>
              <div class="number">审批岗位：{{item.postName}} [{{item.postCode}}]</div>
              <div class="number">审批结果：{{item.approvalResult | filterType3 }}</div>
              <div class="item">审批意见：{{item.comments}}</div>
              <div class="item">审批时间：{{item.approvalTime}}</div>
          </div>
          <div class="right">
              <!--<div class="round" @click="hadleDetail"></div>-->
          </div>
      </div>
      </div>
  </div>
</template>
<script>
import GoodsAdd from '@/base/goods-add.vue'
export default {
  data() {
    return {
      list: [],
      listHis: [],
      applyId: this.$route.query.row.id
    }
  },
  components: {
    GoodsAdd
  },
  filters: {
      filterType3(val) {
          if (val == '0') {
              return '进行中'
          } else if (val == '1') {
              return '通过'
          } else if (val == '2') {
              return '拒绝'
          } else if (val == '9') {
              return '结束'
          }
      },
  },
  mounted() {
    this.getList()
    this.getHisList()
  },
  methods: {
    getList() {
      let params = {
        applyId: this.$route.query.row.id
      }
      this.$http('/api/appDetailList', params).then( res => {
        if (res.rows.length > 0) {
          let rsrows = res.rows;
          let dictJson = JSON.parse(window.sessionStorage.getItem('DICT-'+ 'GoodsUnit'))
          rsrows.forEach((ritem) =>{
            dictJson.forEach( (dItem) => {
              if(dItem['dictValue'] == ritem.goodsUnit){
                ritem['goodsUnitDesc'] = dItem['dictName'];
              }
            })
          })
          this.list = rsrows
        }

      })
    },
      getHisList() {
          let params = {
              applyId: this.$route.query.row.id
          }
          this.$http('/api/appHistoryList', params).then( res => {
              if (res.rows.length > 0) {
                  this.listHis = res.rows
              }else{
                  this.listHis = []
              }

          })
      },
    // 返回
    onClickLeft() {
      this.$router.back(-1)
    },
    // 首页
    onClickRight() {
      this.$router.push({path:'/index' })
    },
  },
}
</script>
<style lang="stylus" scoped>
@import "~common/styl/variable.styl"
  .goods-out
    margin 0em 0.5em
    .titile
        line-height 42px;
        padding 0 0 0 1em
    .list
      padding: 15px
      margin-top: 5px
      background: $color-background-fff
      display: flex
      justify-content: space-between
      align-items: center
      &:nth-child(1)
        margin-top: 0
      .left
        flex: 1
        .number, .item
          padding: 5px 0
        .item
          color: #999
      .right
        .round
          height: 80px
          width: 80px
          position: relative
          &:after
            content: '•••';
            display: block
            position: absolute;
            top: 50%;
            right: 0
            transform: translate(0, -50%) rotate(90deg)
            font-size: 12px;
            letter-spacing: 1px
            margin-top: 1px
            color: #999
</style>