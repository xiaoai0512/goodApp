<template>
  <!-- 我的申请 -->
  <div>
    <van-nav-bar
      left-text="返回"
      right-text="首页"
      :title="title"
      left-arrow
      @click-left="onClickLeft"
      @click-right="onClickRight"
    />
    <div>
      <van-tabs v-model="active" @click="onClick">
        <van-tab title="审批中" name="todo">
          <div class="goods-out">
            <div v-if="inListNull" class="norecord">无记录</div>
            <div class="list" v-for="(item, index) in list" :key="index" >
              <div class="left" >
                <div class="number">申请编号：{{item.id}}</div>
                <div class="number">申请类型：{{item.flowType| filterType}}</div>
                <div class="number">审批结果：{{item.applyResult | filterType3 }}</div>
                <div class="number">审批完成时间：{{item.endTime}}</div>
                <div class="number">申请时间：{{item.applyUseDate}}</div>
                <div class="item">领取状态：{{item.receiveStatus | filterType2}}</div>
              </div>
                  <div class="right">
                    <div class="round">
                      <van-button type="primary" @click="hadleDetail(item)">详情</van-button>
                    </div>
                    <!--<div class="round" @click="handlerHistory(item)">
                      <van-button type="info">历史</van-button>
                    </div>-->
                  </div>
            </div>
            <!--<goods-add></goods-add>-->
          </div>
        </van-tab>
        <van-tab title="审批完成" name="done">
          <div class="goods-out">
            <div v-if="doneListNull" class="norecord">无记录</div>
            <div class="list" v-for="(item, index) in doneList" :key="index" >
              <div class="left" >
                <div class="number">申请编号：{{item.id}}</div>
                <div class="number">申请类型：{{item.flowType | filterType}}</div>
                <div class="number">审批结果：{{item.applyResult | filterType3 }}</div>
                <div class="number">审批完成时间：{{item.endTime}}</div>
                <div class="number">申请时间：{{item.applyUseDate}}</div>
                <div class="item">领取状态：{{item.receiveStatus | filterType2(item.applyResult)}}</div>
              </div>
                  <div class="right">
                    <div class="round" @click="hadleDetail(item)">
                      <van-button type="primary">详情</van-button>
                    </div>
                    <div class="round" v-if="item.cantake" @click="handlerTake(item)">
                      <van-button type="info">领取</van-button>
                    </div>
                  </div>
            </div>
            <!--<goods-add></goods-add>-->
          </div>
        </van-tab>
      </van-tabs>
    </div>

    <!-- 遮罩层 -->
    <van-overlay :show="showLay" @click="show = false">
      <div class="wrapper" @click.stop>
        <van-loading type="spinner" color="#1989fa" size="30" />
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
      active: 1,
      list: [],
      inListNull: false,
      doneList: [],
      doneListNull:false,
      userId: '',
      title: this.$route.query.title,
      message : '',
      loginInfo: {},
      showLay: false,
      cantake: true,
      wht : '',
    }
  },
  watch: {
    active(newVal) {
      switch (newVal) {
        case 0:
          this.onClick('todo')
          break;
        case 1:
          this.onClick('done')
          break;
      }
    }
  },
  mounted() {
    this.getList()
  },
  created () {
    // this.$Toast('34343')
    this.title = this.$route.query.text
    this.wht = this.$route.query.wht
    this.loginInfo = window.sessionStorage.getItem('USER-INFO')
    if(this.wht == 'done'){
      this.active = 1
    }
  },
  filters: {
    filterType(val) {
      let dictJson = JSON.parse(window.sessionStorage.getItem('DICT-FlowType'))
      let ds = '';
      dictJson.forEach(dto => {
        if(val == dto.dictValue) {
          ds = dto.dictName
          return
        }
      })
      return ds;
    },
    filterType2 (val,val2) {
      if (val == '0') {
        if(val2 == '2'){
          return  "不可领取"
        }
        return '未领取'
      } else if (val == '1') {
        return '已领取'
      } else if(val == '2'){
        return  "无"
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
  methods: {
    // 详情
    hadleDetail(row) {
      this.$router.push({path: '/apply-detail' , query:{ row : row} })
    },
    handlerHistory(row){
      let applyId = row.id
      this.$router.push({path: '/apply-history' , query:{ applyId : applyId} })
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
      this.inListNull = false;
      let params = {
        "page": 0,
        "size": 0,
        "userId": this.loginInfo.userId
      }
      this.$http('/api/myInAppr', params).then( res => {
        if (res.rscode == '000000' && res.rows.length > 0) {
          console.log('getList')

          this.list = res.rows
          this.inListNull = false;
        }else{
          this.inListNull = true;
        }
      })
    },

    getDoneList() {
      this.doneListNull = false;
      let params = {
        "page": 0,
        "size": 0,
        "userId": ""
      }
      this.$http('/api/myApprCompl', params).then( res => {
        if (res.rscode == '000000' && res.rows.length > 0) {
          console.log('getDoneList')

          res.rows.forEach( (item) =>{
            if(item.applyResult == '2' || item.receiveStatus == '1'){
              item.cantake = false
            }else if(item.receiveStatus == '2'){
              item.cantake = false
            }else{
              item.cantake= true
            }
          })
          this.doneList = res.rows
          this.doneListNull = false;
        }else{
          this.doneListNull = true;
        }
      })
    },
    //领取物资
    handlerTake(row){
      this.showLay =  true
      let params = {
        "page": 0,
        "size": 0,
        applyId: row.id,
        applyUser: 'me'
      }
      this.$http('/api/goodsTakeOut', params).then( res => {
        if (res.rscode == '000000') {
          this.$toast.success({
            message: "领取成功",
          });
          this.showLay =  false
          console.log('handlerTake')
          // 刷新
          this.getList()
          this.getDoneList()
        }else{
          this.doneListNull = true;
        }
      }, rej =>{
        this.showLay =  false
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