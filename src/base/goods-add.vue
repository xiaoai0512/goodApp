<template>
  <!-- 物品申请-添加--icon -->
  <div class="goods--add">
    +
  </div>
</template>
<script>
export default {
  data() {
    return {}
  }
}
</script>
<style lang="stylus" scoped>
@import "~common/styl/variable.styl"
  .goods--add
    width: 50px
    height: 50px
    border-radius: 50%
    font-size: 16px
    color: #fff
    background: $color
    display: flex
    align-items: center
    justify-content: center
    position: fixed
    right: 15px
    bottom: 30px
</style>