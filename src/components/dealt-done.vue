<template>
  <!-- 待办已办 -->
  <div>
    <van-nav-bar
      :title="title"
      left-text="返回"
      right-text="首页"
      left-arrow
      @click-left="onClickLeft"
      @click-right="onClickRight"
    />

    <div class="mod-config">
      <van-tabs v-model="active" @click="onClick">
        <van-tab title="待办" name="todo">
          <div class="goods-out">
            <div v-if="todoListNull" class="norecord">无记录</div>
            <div class="list" v-for="(item, index) in list" :key="index">
              <div class="left" >
                <div class="number">申请编号：{{item.applyId}}</div>
                <div class="number">申请部门：{{item.odName}} - {{item.flowType|filterType}}</div>
                <div class="number">审批结果：{{item.approvalResult  | filterType3 }}</div>
                <div class="item">申请说明：{{item.remarks}}</div>
                <div class="item">申请时间：{{item.createTime}}</div>
                <div class="item">申请人：{{item.applyUserName}}[{{item.createUser}}] - {{item.createUserDeptName}}</div>
                <div class="item">{{item.content}}</div>
              </div>
              <div class="right">
                <div class="round" >
                  <van-button type="primary" @click="hadleDetail(item, '1')">详情</van-button>
                </div>
                <div class="round" >
                  <van-button type="info" @click="hadleDone(item)">审批</van-button>
                  </div>
              </div>
            </div>
           <!-- <goods-add></goods-add>-->
          </div>
        </van-tab>
        <van-tab title="已办" name="done">
          <div class="goods-out">
            <div v-if="doneListNull" class="norecord">无记录</div>
            <div class="list" v-for="(item, index) in doneList" :key="index" >
              <div class="left" >
                <div class="number">申请编号：{{item.applyId}}</div>
                <div class="number">申请部门：{{item.odName}}-{{item.flowType|filterType}}</div>
                <div class="number">审批结果：{{item.approvalResult | filterType3 }}</div>
                <div class="item">申请说明：{{item.remarks}}</div>
                <div class="item">申请时间：{{item.createTime}}</div>
                <div class="item">申请人：{{item.applyUserName}}[{{item.createUser}}] - {{item.createUserDeptName}}</div>
                <div class="item">{{item.content}}</div>
              </div>
                  <div class="right">
                    <div class="round" >
                      <van-button type="primary" @click="hadleDetail(item, '0')">详情</van-button>

                    </div>
                  </div>
            </div>
            <!--<goods-add></goods-add>-->
          </div>
        </van-tab>
      </van-tabs>


      <van-popup v-model="show" position="bottom" :style="{ height: '30%' }">
        <div class="appDiv">
          <div class="appItem" @click="noBtn">
            领用审批不通过
          </div>
          <div class="appItem itempass" @click="yesBtn">
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


    <!-- 遮罩层 -->
    <van-overlay :show="showLay" @click="show=false" z-index="10000">
      <div class="wrapper" @click.stop>
        <van-loading type="spinner" color="#1989fa" />
      </div>
    </van-overlay>
  </div>
</template>
<script>
// import GoodsAdd from '@/base/goods-add.vue'
export default {
  components: {
    // GoodsAdd
  },
  data() {
    return {
      test_user:'',
      userId: '',
      active: 1,
      show: false,
      show2: false,
      list: [],
      todoListNull:false,
      doneList: [],
      doneListNull: false,
      doneDetaillist: [],
      title: this.$route.query.title,

      item: {},
      message: "",
      userInfo : {},
      showLay: false,

      row: this.$route.query.flowType, // 详情返回，带回的item，

    }
  },
  mounted() {
    this.getUserInfo()
  },
  created() {
    this.title = this.$route.query.text
    // 修改申请数量
    this.list.forEach(item => {
      if (this.row.id == item.id) {
        item.goodsNum = this.row.goodsNum
      }
    })
  },
  filters: {
    filterType(val) {
      let dictJson = JSON.parse(window.sessionStorage.getItem('DICT-FlowType'))
      let ds = val
      if(dictJson != null ){
        dictJson.forEach(dto => {
          if(val == dto.dictValue) {
            ds = dto.dictName
            return
          }
        })
      }
      return ds;
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
  methods: {
    // 获取登录人信息
    getUserInfo() {
      this.$http('/api/userInfo', {}).then(res => {
        if (res.rscode == '000000') {
          this.userId = res.userId
          this.getList()
        }

      })
    },
    // 待办
    hadleDone(row) {
      // this.$router.push({path: '/todo-detail' , query: { row: row } })
      this.item = row
      this.show = true
    },
    // 已办 详情
    hadleDetail(row, cane) {
      // 申请明细查询
      this.$router.push({path: '/product-inventory' , query: { item : row , pathFlag: '2', 'cane': cane} })
    },
    handlerHistory(row){
      let applyId = row.applyId
      this.$router.push({path: '/apply-history' , query:{ applyId : applyId } })
    },
    // 点击 待办已办
    onClick(name) {
      if (name == 'todo') {
        this.getList()
      } else if (name == 'done') {
        this.getDoneList()
      }
    },
    getList() {
      this.todoListNull = false
      let params = {
        "page": 0,
        "size": 0,
        "userId": this.userId
      }
      this.list = []
      this.$http('/api/applyTodo', params).then( res => {
        if (res.rscode == '000000' && res.rows.length > 0) {
          this.list = res.rows
          this.todoListNull = false
        }else{
          this.todoListNull = true
        }
      })
    },

    getDoneList() {
      this.todoListNull = false
      let params = {
        "page": 0,
        "size": 0,
        "userId": this.userId
      }
      this.doneList = []
      this.$http('/api/applyDone', params).then( res => {
        if (res.rscode == '000000' && res.rows.length > 0) {
          this.doneList = res.rows
          this.doneListNull = false
        }else{
          this.doneListNull = true
        }
      })

    },
    // 返回
    onClickLeft() {
      //this.$router.back(-1)
       this.$router.push({path:'/index' })
    },
    // 首页
    onClickRight() {
      this.$router.push({path:'/index' })
    },
    noBtn() {
      this.show2 = true;
    },
    yesBtn() {
      let obj = {
        applyId: this.item.applyId,
        approvalResult: "1",
      }
      this.done(obj);
    },
    canBtn() {
      this.item = {}
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
          approvalResult: "2",
          comments: this.message,
        }
        //obj = Object.assign(obj,this.item)
        // done()
        this.done(obj);
      }
      this.message = "";
    },
    done(params) {
      this.showLay = true
      this.$http("/api/applyAppr", params).then(res => {
        if (res.rscode == "000000") {
          this.$toast.success({
            message: "审批完成",
          });
          this.list = []
          this.doneList = []
          this.getList()
          this.getDoneList() // 刷新
          // this.$router.push({ path: "/dealt-done"});
        }
        this.showLay=false
        this.show=false;
        this.show2=false;
      }, rej => {
        this.showLay=false
        this.show=false;
        this.show2=false;
      }
      )
    },
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
          line-height: 82px;
          text-align: right;
          padding-right: 14px;
          position: relative
          // &:after
          //   content: '•••';
          //   display: block
          //   position: absolute;
          //   top: 50%;
          //   right: 0
          //   transform: translate(0, -50%) rotate(90deg)
          //   font-size: 12px;
          //   letter-spacing: 1px
          //   margin-top: 1px
          //   color: #999
  .mod-config
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
        height: 33.3%;
        width: 100%;
        line-height: 4.5em;
        align-items: center;
        font-size: 16px;
        text-align: center;
      .itempass
        background-color #f9f9f9
  .norecord
    line-height: 42px
    text-align: center
    color: dimgray
  .van-button--normal
    padding: 0 0px
    height: 22px;
  .wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }


</style>