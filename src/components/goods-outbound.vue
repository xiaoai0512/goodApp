<template>
  <!-- 办公用品领用 -->
  <div>
    <van-nav-bar
      title="领用信息"
      left-text="返回"
      right-text="首页"
      left-arrow
      @click-left="onClickLeft"
      @click-right="onClickRight"
    />
    <div class="goods-out">
      <div class="list" v-for="(item, index) in list " :key="index">
        <div class="left">
            <div class="number">{{item.goodsCode}}</div>
              <div class="item">产品名称：{{item.goodsName}}</div>
              <div class="item">产品规格：{{item.goodsUnit | filterType}}</div>
              <div class="item">产品数量：{{item.goodsNum}}</div>
            </div>
            <div class="right">
              <div class="round" @click="hadleDetail"></div>
            </div>
      </div>
      <goods-add></goods-add>
    </div>
  </div>
</template>
<script>
import GoodsAdd from '@/base/goods-add.vue'
export default {
  data() {
    return {
      list: []
    }
  },
  components: {
    GoodsAdd
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
    }
  },
  created(){
  },
  mounted() {
    if (this.$route.query.doneDetaillist.length > 0) {
      this.list = this.$route.query.doneDetaillist
    }
  },
  methods: {
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