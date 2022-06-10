<template>
  <!-- 审批历史 -->
  <div>
    <van-nav-bar
    title="审批历史"
      left-text="返回"
      right-text="首页"
      left-arrow
      @click-left="onClickLeft"
      @click-right="onClickRight"
    />
    <div class="goods-out">
      <div class="list" v-for="(item, index) in list " :key="index">
        <div class="left">
            <div class="number">审批人：{{item.approvalUser}}</div>
            <div class="item">审批岗位：{{item.postCode}}</div>
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
export default {
  data() {
    return {
      list: [],
      applyId: this.$route.query.applyId
    }
  },
  components: {
  },
  filters: {
    filterType(val) {
      if(val === '1') {
        return '本'
      } else if (val === '2') {
        return '个'
      } else if (val === '3') {
        return '件'
      } else if (val === '4') {
        return '盒'
      } else if (val === '5') {
        return '张'
      }
    },
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
  },
  methods: {
    getList() {
      let params = {
        applyId: this.$route.query.applyId
      }
      this.$http('/api/appHistoryList', params).then( res => {
        console.log(res)
        if (res.rows.length > 0) {
          this.list = res.rows
        }else{
            this.list = []
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