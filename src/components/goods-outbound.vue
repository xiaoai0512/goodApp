<template>
  <!-- 办公用品领用 -->
  <div class="goods-out">
    <div class="list">
      <div class="left">
          <div class="number">001</div>
            <div class="item">产品名称：ppp</div>
            <div class="item">产品规格：ppp</div>
            <div class="item">产品数量：100</div>
          </div>
          <div class="right">
            <div class="round" @click="hadleDetail"></div>
          </div>
    </div>
    <goods-add></goods-add>
  </div>
</template>
<script>
import GoodsAdd from '@/base/goods-add.vue'
import goodsAdd from '../base/goods-add.vue'
export default {
    components: { goodsAdd },
  data() {
    return {}
  },
  compontents: {
    GoodsAdd
  }
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