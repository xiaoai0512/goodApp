<template>
  <div>
    <!-- <span>用户名</span>
    <van-field style="width:55%; " v-model="userId" placeholder="登录用户" clearable></van-field>
    <span>登录密码</span>
    <van-field style="width:55%; " v-model="passwd" type="password" placeholder="登录密码" clearable></van-field>
    <van-button style="width:40%;" @click="getLogin()">登录</van-button> -->


    <van-form @submit="getLogin" style="margin-top: 30px">
      <van-field
              v-model="userId"
              name="用户名"
              label="用户名"
              placeholder="用户名"
              :rules="[{ required: true, message: '请填写用户名' }]"
      />
      <van-field
              v-model="passwd"
              type="password"
              name="密码"
              label="密码"
              placeholder="密码"
              :rules="[{ required: true, message: '请填写密码' }]"
      />
      <div style="margin: 16px;">
        <van-button round block type="info" native-type="submit">模拟用户名登录</van-button>
        <div></div>
      </div>
    </van-form>

  </div>
</template>
<script>
  import axios from "axios";
  import {Toast} from "vant";

  export default {
    data() {
      return {
        code: '',
        passwd: '123456',
        userId:''
      }
    },
    created() {
      window.sessionStorage.clear();
      this.getDict('GoodsUnit');
      this.getDict('GoodsType');
      this.getDict('FlowType');
    },
    methods: {
      getLogin () {
        this.$http('/service/welogin', {
          code: "---",
          'userId': this.userId,
          'passwd': this.passwd
        }).then(res => {
          if(res) {
            window.sessionStorage.setItem('TOKEN_KEY', res.token)
            this.$router.push({path: '/index', query: {}})
          }
        })
      },
      getDict(wh) {
        let dictJson = JSON.parse(window.sessionStorage.getItem('DICT-' + wh))
        if (dictJson == null) {
          this.$http('/api/sysDictionaryList', {'groupCode': wh}).then(res => {
            if (res.rscode == '000000') {
              window.sessionStorage.setItem('DICT-' + wh, JSON.stringify(res.rows))
            }
          })
        }
      }
    }
  }
</script>


<style>
  .monibtn{
    text-align: center;
    margin: 24px 0 0 0 ;
    background-color: royalblue;
    height: 44px;
    line-height: 44px;
    color: whitesmoke;
    border-radius: 22px;
  }

</style>