'use strict'
const webpack = require('webpack');
const axios = require('axios').default;
const path = require('path')
// const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')


function resolve(dir) {
  return path.join(__dirname, dir)
}

const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV)

const port = process.env.NODE_ENV === 'development' ? 9538 : 8019 // dev port

let devIPList = {
  "默认": "http://127.0.0.1:8019",
  "开发": "http://192.168.0.107:8019"
}

const dev_addr = process.env.NODE_ENV === 'development' ? devIPList['开发'] : "http://127.0.0.1:8019"   // http://必须要

const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: IS_PROD ? './' : process.env.VUE_APP_BASE_URL, //署应用包时的基本 URL。  vue-router history模式使用
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: false,
  configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    name: "数据可视化编辑器",
    resolve: {
      alias: {
        '@': resolve('src')
      },
      fallback: {
        crypto: false,
        fs: false
      }
    },
    plugins: [
      // new MonacoWebpackPlugin(),
      new webpack.ProvidePlugin({
        echarts: 'echarts',
        THREE: 'three',
        jQuery: "jquery",
        $: "jquery",
        schedule: 'node-schedule'
      })
    ],
    // devtool: "source-map",
    mode: "development",
    devtool: "cheap-source-map",
    externals: {
      './cptable': 'var cptable'
    }
  },
  devServer: {
    host: '0.0.0.0',
    compress: true,
    hot: 'only',
    port: port,
    client: {
      overlay: true,
      webSocketTransport: 'ws',
    },
    historyApiFallback: true,
    allowedHosts: 'all',
    proxy: {
      '/BI': {
        target: 'http://127.0.0.1:5053',
        secure: false,
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/BI': '/'
        }
      },
      '/H5': {
        target: 'http://www.emacrosys.cn:8019',
        // target: 'http://127.0.0.1:8019',
        secure: false,
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/H5': '/H5'
        }
      },
      '/vue-admin-template': {
        // target: 'http://www.wangjianzhou.cn:9528/vue-admin-template/',
        target: dev_addr + '/vue-admin-template/',
        secure: false,
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/vue-admin-template': ''
        }
      },
      '/dev-api/testapi': {   // 路径中有 /api 的请求都会走这个代理 , 可以自己定义一个,下面移除即可
        target: 'http://172.16.2.255:8019/',    // 目标代理接口地址,实际跨域要访问的接口,这个地址会替换掉 axios.defaults.baseURL
        // target:'http://192.168.182.128:90/:90/',
        secure: false,
        changeOrigin: true,  // 开启代理，在本地创建一个虚拟服务端
        ws: true,       // 是否启用  websockets;
        pathRewrite: {   // 去掉 路径中的  /api  的这一截
          '^/dev-api/testapi': ''
        }
      },
      '/dev-api': {
        target: dev_addr + '/dev-api/',// 本机无法用域名访问
        // target: 'https://192.168.182.128:90/dev-api/',
        secure: false,
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/dev-api': ''
        }
      },
      '/video': {
        target: dev_addr,// 本机无法用域名访问
        // target: 'https://192.168.182.128:90/dev-api/',
        secure: false,
        changeOrigin: true,
        ws: true
      },
      '/prod-api': {
        target: dev_addr + '/prod-api/',
        secure: false,
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/prod-api': '/vue-admin-template'
        }
      },
      '/CSWebservices': {   // 路径中有 /api 的请求都会走这个代理 , 可以自己定义一个,下面移除即可
        target: 'https://wangjianzhou:9528/',    // 目标代理接口地址,实际跨域要访问的接口,这个地址会替换掉 axios.defaults.baseURL
        // target:'http://192.168.182.128:90/:90/',
        secure: false,
        changeOrigin: true,  // 开启代理，在本地创建一个虚拟服务端
        ws: true,       // 是否启用  websockets;
        pathRewrite: {   // 去掉 路径中的  /api  的这一截
          '^/api': ''
        }
      },
      '/test': {
        target: 'http://v.juhe.cn/joke',   // 目标代理接口地址,实际跨域要访问的接口,这个地址会替换掉 axios.defaults.baseURL
        secure: false,
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/test': '',
        }
      }
    }
  }
})
