// 配置文件
const path = require('path');

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  //打包后的位置(如果不设置这个静态资源会报404)
  publicPath: './',
  //打包后的目录名称
  outputDir: 'distapp',

  //静态资源目录名称
  assetsDir: 'static',

  //去掉打包的时候生成的map文件
  productionSourceMap: false,

  lintOnSave: true,
  filenameHashing: false,
  // webpack 配置
  chainWebpack: (config) => {
    config.resolve.alias
      .set('@', resolve('src'))
      .set('common', resolve('src/common'))
  },
  devServer: {
    // 后端请求转发，此配置仅开发环境有效，生产环境请参考生产环境部署文档配置nginx转发
    // proxy: {
    //   '/goodsmanager': {
    //     target: 'http://127.0.0.1:28080/goodsmanager',
    //     changeOrigin: true,
    //     pathRewrite: {
    //       '^/goodsmanager': ''
    //     }
    //     // target: 'http://8.131.70.94:8088/'
    //   }
    // },
    port: 8055,
    inline: false, //实时编译
    disableHostCheck: true,

  }
}
