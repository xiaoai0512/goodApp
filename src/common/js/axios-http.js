import axios from 'axios';
const ERR_OK = '200';
export default function httpServe (url, params, type) {
const baseUrl = '/goodsmanager'
  return new Promise((resolve, reject) => {
    // 发送请求
    axios({
      method: type || 'post',
      url: baseUrl+url,
      data: params
    }).then(res => {
      if(ERR_OK) {
        resolve(res.data)
      }else {
        reject(res.data)
      }
    }).catch(err => {
      reject(err.data)
    })
  })
}



