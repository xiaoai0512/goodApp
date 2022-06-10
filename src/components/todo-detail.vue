<template>
  <!-- 待办详情 -->
  <div>
    <van-nav-bar
      title="待办审批"
      left-text="返回"
      right-text="首页"
      left-arrow
      @click-left="onClickLeft"
      @click-right="onClickRight"
    />

    <div class="goods-out">
      <div class="list">
        <div class="left">
          <div class="number">申请编号：{{item.applyId}}</div>
          <div class="number">申请编号：{{item.odName}}</div>
          <div class="number">申请类型：{{item.flowType}}[{{item.flowCode}}]</div>
          <div class="number">审批结果：{{item.applyResult}}</div>
          <div class="number">申请时间：{{item.createTime}}</div>
          <div class="item">申请人：{{item.createUser}}</div>
          <div class="item">申请产品：{{item.content}}</div>
        </div>
        <div class="right">
          <div class="round" @click="hadleDetail(item)"></div>
        </div>
      </div>
      <!--<goods-add></goods-add>-->
      <!-- 选择审批流程 -->
      <van-popup v-model="show" position="bottom" :style="{ height: '30%' }">
        <div class="appDiv">
          <div class="appItem" @click="noBtn">
            领用审批不通过
          </div>
          <div class="appItem" @click="yesBtn">
            领用审批通过
          </div>
          <div class="appItem" @click="canBtn">
            取消
          </div>
        </div>
      </van-popup>

      <!--弹出框，赋予chargeBtn事件-->
      <van-dialog
        v-model="show2"
        title=""
        show-cancel-button
        :beforeClose="chargeBtn"
      >
        <!--输入框-->
        <van-field
          v-model="message"
          rows="1"
          autosize
          label="理由"
          type="textarea"
          placeholder="请输入理由"
        />
      </van-dialog>
    </div>
  </div>
</template>
<script>
// import GoodsAdd from "@/base/goods-add.vue";
export default {
  data() {
    return {
      item: this.$route.query.row,

      show: true,
      show2: false,
      message: "",
      doneDetaillist: [],

      userId: this.$route.query.userId,
      applyId: this.$route.query.applyId,

    };
  },
  components: {
    // GoodsAdd,
  },
  filters: {
    filterType(val) {
      if (val === "0001") {
        return "本";
      } else if (val === "0002") {
        return "个";
      } else if (val === "0003") {
        return "件";
      } else if (val === "0004") {
        return "盒";
      }
    },
  },
 
  mounted() {
  },
  methods: {
    
    noBtn() {
      this.show2 = true;
    },
    yesBtn() {
      let obj = {
        applyId: this.item.applyId,
        applyResult: "1",
      }
      this.done(obj);
    },
    canBtn() {
      this.show = false;
    },
    chargeBtn(action, done) {
      //确认or取消
      if (action === "cancel") {
        //取消按钮
        done();
        this.show2 = false;
      } else if (action === "confirm") {
        //确定按钮
        //向后端传值并关闭dialog弹出框
        this.show2 = false;
        let obj = {
          applyId: this.item.applyId,
          applyResult: "2",
          comments: this.message,
        }
        //obj = Object.assign(obj,this.item)
        // done()
        this.done(obj);
      }
      this.message = "";
    },
    done(params) {
      this.$http("/api/applyAppr", params).then((res) => {
        if (res.rscode == "000000") {
          this.$toast.success({
            message: "审批完成",
          });
          this.show = false;
          this.show2 = false;
          // this.$router.push({ path: "/dealt-done"});
        }
      });
    },
    // 待办 详情
    hadleDetail() {
      // this.getInfo(this.item)
      this.$router.push({path: "/product-inventory", query: { item: this.item , pathFlag: '1'}});
    },
    // 返回
    onClickLeft() {
      // this.$router.back(-1);
      this.$router.push({ path: "/dealt-done" });

    },
    // 首页
    onClickRight() {
      this.$router.push({ path: "/index" });
    },
  },
};
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
    .appDiv
      width: 100%
      height : 100%
      display: flex
      flex-direction: column
      justify-content: center
      flex-grow: 3
      align-items: center
      align-content: space-around
      .appItem
        height: 33.3%
        display: flex
        align-items: center
        font-size 16px
</style>
