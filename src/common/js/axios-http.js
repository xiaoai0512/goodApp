import axios from 'axios';
import Vue from 'vue';
import { Toast } from 'vant'
import 'vant/lib/toast/style'
import { config } from 'vue/types/umd';
Vue.use(Toast)
this
const ERR_OK = '000000';
const ERR_NOLOGIN = '999999';
export default function httpServe (url, params, type) {
const baseUrl = '/goodsmanager'
  return new Promise((resolve, reject) => {
    // 发送请求
    axios({
      method: type || 'post',
      url: baseUrl+url,
      data: params
    }).then(res => {
      alert(axios.getUri(config))
      if(res.data.rscode === ERR_OK) {
        resolve(res.data)
      }else if(res.data.rscode === ERR_NOLOGIN){
        this.$router.push('/auth')
      }else {
        Toast.fail({
          message: res.data.rsmsg
        })
        reject(res.data)
      }
    }).catch(err => {
      // Toast('服务器异常')
      Toast.fail('服务器异常')
      reject(err.data)
    })
  })
}



