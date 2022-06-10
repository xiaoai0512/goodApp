<template>
  <!-- 首页 -->
  <div class="index-body">
    <div style="text-align: center; margin: -0.6em 0 0.6em 0 ">{{userName}}<span
      style="color: dimgray"> [{{userId}}]</span></div>
    <div style="text-align: center; line-height: 1em; margin-bottom: 1.4em;">
      <span @click="showDepts">{{deptName}}</span>
    </div>

    <van-grid :gutter="10" :column-num="2">
      <van-grid-item
        v-for="(item, index) in linkList"
        :key="index" :icon="item.icon"
        :text="item.text"
        :to="item.route"/>
    </van-grid>

    <van-popup v-model="show"  round :style="{ height: '28%', width: '90%' }">
      <van-grid class="appDiv">
        <van-grid-item class="appItem"
          v-for="(item, index) in depts"
          :key="index" @click="resetDept(item.deptCode)"
          :text="item.deptName" />
      </van-grid>
    </van-popup>

  </div>
</template>
<script>
  export default {
    data() {
      return {
        show: false,
        userJson: {},
        depts:[],
        userId: '',
        userName: '',
        deptCode: '',
        deptName:'',
        linkSetting: [
          {
            text: '月度申请',
            icon: require('@/static/images/monthApply.png'),
            route: {
              path: '/items-for',
              query: {flowType: '0', title: '月度申请'}
            },
          }, {
            text: '零星申请',
            icon: require('@/static/images/lingxing.png'),
            route: {
              path: '/items-for',
              query: {flowType: '1', title: '零星申请'}
            },
          },
          {
            text: '新员工申请',
            icon: require('@/static/images/xinyuangongwuzi.png'),
            route: {
              //path: '/entry-goods',
              path: '/items-for',
              query: {flowType: '2', title: '新员工申请'}
            },
          },
          {
            text: '礼品采购',
            icon: require('@/static/images/giftBuy.png'),
            route: {
              path: '/items-for',
              query: {flowType: '3', title: '礼品采购'}
            },
          },
          {
            text: '礼品领用',
            icon: require('@/static/images/gift.png'),
            route: {
              //path: '/entry-goods',
              path: '/items-for',
              query: {flowType: '4', title: '礼品领用'}
            },
          }, {
            text: '产品采购',
            icon: require('@/static/images/giftBuy.png'),
            route: {
              path: '/items-for',
              query: {flowType: '5', title: '产品采购'}
            },
          },
        ],
        linkList: [
          {
            text: '我的申请',
            icon: require('@/static/images/myApply.png'),
            route: {
              path: '/my-apply',
              query: {text: '我的申请', title: '我的申请'}

            },
          },
          {
            text: '待办/已办',
            icon: require('@/static/images/daiban.png'),
            route: {
              path: '/dealt-done',
              query: {text: '待办/已办', title: '待办/已办'}
            },
          }, {
            text: '退出登录',
            icon: require('@/static/images/exit.png'),
            route: {
              path: '/logout',
              query: {}
            },
          }],
        linkDefaultList: [
          {
            text: '我的申请',
            icon: require('@/static/images/myApply.png'),
            route: {
              path: '/my-apply',
              query: {text: '我的申请', title: '我的申请'}

            },
          },
          {
            text: '待办/已办',
            icon: require('@/static/images/daiban.png'),
            route: {
              path: '/dealt-done',
              query: {text: '待办/已办', title: '待办/已办'}
            },
          }, {
            text: '退出登录',
            icon: require('@/static/images/exit.png'),
            route: {
              path: '/logout',
              query: {}
            },
          }]
      }
    },
    components: {},
    activated() {
    },
    mounted() {
      this.getUserLimit();
      this.getUserInfo();
    },
    methods: {
      resetDept(dept){
        let userJson = JSON.parse(window.sessionStorage.getItem('USER-INFO'))
        if(userJson.depId == dept){
          this.show = false
          return;
        }
        userJson.depId = dept;
        window.sessionStorage.setItem('USER-INFO', JSON.stringify(userJson))
        window.sessionStorage.setItem('USER-DEPT', dept)
        this.getUserInfo();
        // 调用服务
        this.$http('/api/resetDetp', {'deptCode': dept}).then(res => {
          if (res.rscode == '000000') {
            window.sessionStorage.setItem('USER-Limit', null);
            let newForm = Object.assign([], this.linkDefaultList)
            this.linkList = newForm;
            this.getUserLimit();
            this.show = false;
          }
        });
      },
      showDepts(){
        this.show = true
      },
      // 获取登录人信息
      getUserInfo() {
        let userJson = JSON.parse(window.sessionStorage.getItem('USER-INFO'))
        if (userJson == null) {
          this.$http('/api/userInfo', {}).then(res => {
            if (res.rscode == '000000') {
              this.userId = res.userId
              this.userName = res.userName
              this.deptCode = res.depId;
              this.depts = res.rows;
              this.depts.forEach(dp =>{
                if(this.deptCode == dp.deptCode){
                  this.deptName = dp.deptLinkName
                }
              })
              window.sessionStorage.setItem('USER-INFO', JSON.stringify(res))
              window.sessionStorage.setItem('USER-DEPT', res.depId)
              window.sessionStorage.setItem('USER-EDIT', res.editLimit)
              //this.getFlowInfo();
            }
          })
        } else {
          this.userId = userJson.userId
          this.userName = userJson.userName
          this.deptCode = userJson.depId;
          this.depts = userJson.rows;
          this.depts.forEach(dp =>{
            if(this.deptCode == dp.deptCode){
              this.deptName = dp.deptLinkName
            }
          })
        }
      },
      // 获取用户权限
      getUserLimit() {
        let limitJson = JSON.parse(window.sessionStorage.getItem('USER-Limit'))
        if (limitJson == null) {
          this.$http('/api/flowUserLimit', {}).then(res => {
            if (res.rscode == '000000') {
              window.sessionStorage.setItem('USER-Limit', JSON.stringify(res.rows));
              res.rows.forEach(item => {
                let lindon = this.linkSetting[item.flowType];
                this.linkList.unshift(lindon)
              })
            }
          })
        } else {
          limitJson.forEach(item => {
            let lindon = this.linkSetting[item.flowType];
            this.linkList.unshift(lindon)
          })
        }
      },
      /*getFlowInfo() {
        let flowJson = JSON.parse(window.sessionStorage.getItem('FLOW-INFO'))
        if (flowJson == null) {
          let deptid = window.sessionStorage.getItem('USER-DEPT')
          this.$http('/api/floInfoList', {'deptCode': deptid}).then(res => {
            if (res.rscode == '000000') {
              window.sessionStorage.setItem('FLOW-INFO', JSON.stringify(res.rows))
            }
          })
        }
      },*/

    }
  }
</script>
<style lang="stylus" scoped>
  .index-body
    margin-top: 30px

  .van-icon img {
    width 1.2em
    height 1.2em;
  }
  .appDiv
    display: flex
    flex-direction: column
    align-items: center
    background-color: #bebebe;
    .appItem
      width: 100%;
      align-items: center;
      font-size: 16px;
      text-align: center;
      margin-bottom: 1px;
</style>