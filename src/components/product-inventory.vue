<template>
  <!-- 产品库存 -->
  <div>
     <van-nav-bar
      title="物资详情"
      left-text="返回"
      right-text="首页"
      left-arrow
      @click-left="onClickLeft"
      @click-right="onClickRight"
    />
    <div class="prod-content">
      <div class="titile">产品明细：</div>
      <div class="list" v-for="(item, index) in list " :key="index">
        <div class="left">
          <div class="item">名称：{{item.goodsName}}</div>
          <div class="item center" >
            规格：
            <div class="specifications" v-if="(edit == '0' || cane != '1')"> {{item.goodsNum}}  </div>
            <div class="specifications" v-if="edit == '1' && cane == '1'">
              <van-stepper
              v-model.number="item.goodsNum" min="0" button-size="19px"
                async-change
                @change="countChange($event)"
                :disabled="num_isDisabled"
              />
            </div>
            {{item.goodsUnitDesc}}
          </div>
        </div>
        <div class="right">
          <!--<div class="round" @click="hadleDetail"></div>-->
        </div>
      </div>
    </div>
    <div class="prod-content" v-if="edit == '1' && cane == '1'">
      <van-button round block type="info" @click="updateGns()">修改产品数量</van-button>
    </div>
    <div class="prod-content">
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
import {Toast} from "vant";

export default {
  data() {
    return {
      cane: this.$route.query.cane,
      edit : window.sessionStorage.getItem('USER-EDIT'),
      item: this.$route.query.item,
      applyId: this.$route.query.item.applyId,
      list: [],
      listHis: [],
      pathFlag: this.$route.query.pathFlag,
      num_isDisabled: false,
    }
  },
  mounted() {
    this.getList()
    this.getHisList()
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
  methods: {
    getList() {
      let params = {
        "applyId": this.applyId,
        "page": 0,
        "size": 0
      }
      this.$http ('/api/appDetailList', params).then( res => {
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
      })
    },
    getHisList() {
      let params = {
        applyId: this.applyId
      }
      this.$http('/api/appHistoryList', params).then( res => {
        if (res.rows.length > 0) {
          this.listHis = res.rows
        }else{
          this.listHis = []
        }
      })
    },
    updateGns(){
      let params = {
        "applyId": this.applyId,
        "goods" : this.list
      }
      this.$http('/api/apprModGoodNum', params).then( res => {
        if (res.rscode == '000000') {
          this.cane = '0'
          this.message = "修改成功"
        }else{
          Toast.fail({
            message: res.rsmsg
          })
        }
      }).catch((e) => {})
    },
    // 加减
    countChange(event) {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        // 注意此时修改value后会再次触发change事件
        this.list.map((req, index) => {
          let num = req.goodsNum
          if(req.goodsNum < 0) {
            Toast.fail({
              message: "数量不能小于0"
            })
            req.goodsNum = num + 1
            return
          }
        })
      },0);
    },
    // 返回
    onClickLeft() {
      // this.$router.back(-1)
      if (this.pathFlag == '1') { // 返回 待办item，
        this.$router.push({path:'/todo-detail', query: { row: this.item} })
      } else if (this.pathFlag == '2') { // 返回已办 待办
        this.$router.push({path:'/dealt-done' , query: { row: this.item} })
      }

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
  .prod-content
    margin 0em 0.5em
    .titile
      line-height 42px;
      padding 0 0 0 1em
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
      .center
        display flex
        align-items  center
  .monibtn2{
  }

</style>