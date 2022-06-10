<template>
  <div style="text-align: center">
    登录中...请稍等
  </div>
</template>
<script>
  // import axios from "axios";
  // import {Toast} from "vant";

  export default {
    data() {
      return {
        code: '',
      }
    },
    created() {
      window.sessionStorage.clear();
      this.getDict('GoodsUnit');
      this.getDict('GoodsType');
      this.getDict('FlowType');
      this.getLogin()
    },
    methods: {
      getLogin () {
        let codestr = this.getQueryVariable('code')
        let state = this.getQueryVariable('state')
        this.code = codestr
        this.$http('/service/welogin2?code='+codestr, {},'GET').then(res => {
          if(res) {
            window.sessionStorage.setItem('TOKEN_KEY', res.token)
            window.sessionStorage.setItem('USER-DEPT', res.deptCode)
            window.sessionStorage.setItem('USER-EDIT', res.editLimit)
            if(state.charAt(0)=='A'){
              let id = state.substr(1);
              this.$router.push({path: '/dealt-done', query: {'id':id}})
            }else if(state.charAt(0) == 'T'){
              this.$router.push({path: '/my-apply', query: {'wht':'done'}})
            }else{
              this.$router.push({path: '/index', query: {}})
            }
          }
        })
      },
      getQueryVariable(pname){
        var query = window.location.search.substring(1)
        var query2 = window.location.hash.substring(8)
        if(query == ''){
          query = query2
        }
        var vars = query.split("&");
        for (var i=0;i<vars.length;i++) {
          var pair = vars[i].split("=");
          if(pair[0] == pname){
            return pair[1];
          }
        }
        return "";
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