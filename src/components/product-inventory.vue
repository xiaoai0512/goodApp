<template>
  <!-- 产品库存 -->
  <div class="prod-content">
    <div class="list" v-for="(item, index) in list" :key="index">
      <div class="number">001</div>
      <div class="item">产品名称：ppp</div>
      <div class="item">产品规格：ppp</div>
      <div class="item">产品数量：100</div>
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
  mounted() {

  },
  methods: {
    getList() {
      let params = {
        "applyId": "",
        "page": 0,
        "size": 0
      }
      this.$http ('/api/appDetailList', params).then( res => {
        this.list = res.rows
      })
    }
  },
}
</script>
<style lang="stylus" scoped>
@import "~common/styl/variable.styl"
  .prod-content
    .list
      padding: 15px
      margin-top: 5px
      background: $color-background-fff
      &:nth-child(1)
        margin-top: 0
      .number, .item
        padding: 5px 0
      .item
        color: #999
</style>