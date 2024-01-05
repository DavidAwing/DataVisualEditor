'use strict'
const webpack = require('webpack');
const axios = require('axios').default;
const path = require('path')
// const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin');
var HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');


const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// //压缩js文件
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
//css压缩
const OptimizeCss = require('optimize-css-assets-webpack-plugin');


function resolve(dir) {
  return path.join(__dirname, dir)
}

const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV)

const port = process.env.NODE_ENV === 'development' ? 8060 : 8019 // dev port

let devIPList = {
  "默认": "http://127.0.0.1:8019",
  "开发": "http://192.168.0.107:8019"
}

const dev_addr = process.env.NODE_ENV === 'development' ? devIPList['开发'] : "http://127.0.0.1:8019"   // http://必须要

const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  runtimeCompiler: true,
  transpileDependencies: true,
  publicPath: IS_PROD ? './' : process.env.VUE_APP_BASE_URL, //署应用包时的基本 URL。  vue-router history模式使用
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: !IS_PROD,
  configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    name: "低代码编辑器",
    resolve: {
      alias: {
        vue: 'vue/dist/vue.esm.js',
        compiler: path.resolve(__dirname, 'src/compiler'),
        '@': resolve('src')
      },
      fallback: {
        crypto: false,
        fs: false
      }
    },
    ignoreWarnings: [
      {
        module: /@\/vue3\/repl/
      },
      // /warning from compiler/,
      (warning) => true,
    ],
    plugins: [
      // new HtmlWebpackPlugin(
      //   {
      //     title: "BI系统",
      //     inject: true,
      //     inlineSource: /runtime~.+\.js$/, // embed all javascript and css inline
      //     template: "public/index.html",
      //     js: ["/atewrwere.js"]
      //   }
      // ),
      // new webpack.HotModuleReplacementPlugin(),
      // new HtmlWebpackInlineSourcePlugin(HtmlWebpackPlugin),
      // new MonacoWebpackPlugin(),
      new webpack.ProvidePlugin({
        Vue: 'vue',
        echarts: 'echarts',
        THREE: 'three',
        jQuery: "jquery",
        $: "jquery",
        schedule: 'node-schedule'
      })
    ],
    mode: "development",
    // devtool: "source-map",
    devtool: IS_PROD ? 'nosources-source-map' : 'eval-cheap-module-source-map',//'cheap-source-map'
    externals: {
      './cptable': 'var cptable'
    },
    output: {
      // 设置输出文件格式为UMD或IIFE
      libraryTarget: 'umd',
      // 设置输出文件名
      filename: (pathData) => {
        if (pathData.chunk.name === 'runtime~app') {
          return 'bi-[name].js';
        } else if (pathData.chunk.name.includes('shared-worker.worker')) {
          return 'js/[name].js';
        } else {
          return 'bi-[name].[contenthash].js'
        }
      },
    },
    optimization: {
      minimize: IS_PROD,
      moduleIds: "named",
      runtimeChunk: IS_PROD,
      splitChunks: {
        chunks: 'all',
        minSize: 1024 * 12, // Minimum chunk size (in bytes)
        maxSize: 1024 * 1024 * 1, // Maximum chunk size (in bytes)
      },
      minimizer: [
        //压缩CSS代码
        new OptimizeCss(),
        new UglifyJSPlugin({
          cache: true,
          parallel: true,
          sourceMap: false
        }),
        new TerserPlugin({
          parallel: true,
          terserOptions: {
            // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
          },
        }),

        // //压缩js代码
        // new UglifyJsPlugin({
        //   //启用文件缓存
        //   cache: true,
        //   //使用多线程并行运行提高构建速度
        //   parallel: true,
        //   //使用 SourceMaps 将错误信息的位置映射到模块
        //   sourceMap: true
        // })
      ]
    },
    module: {
      rules: [
        {
          test: /\.(txt)$/,
          loader: 'text-loader'
        }
      ]
    }
  },
  chainWebpack: config => {
    config.resolve.alias.set("@", path.join(__dirname, "src"))

    // 配置 HtmlWebpackPlugin
    config.plugin('html').tap(args => {
      args[0].template = './public/index.html'; // 可选：指定 HTML 模板文件路径
      args[0].scriptLoading = 'defer'; // 可选：推迟加载脚本，提升性能
      args[0].chunksSortMode = 'none'; // 可选：禁用脚本排序，保持原始顺序
      args[0].filename = 'index.html'; // 可选：指定生成的 HTML 文件名
      args[0].cdn = {
        js: [
          "./compiler/typescript@5.0.4.js",
          "./compiler/babel@7.15.0.js",
          "./compiler/systemjs@6.11.0.js",
          "./compiler/less@4.js",
        ],
        css: []
      }
      return args;
    });

    config.module
      .rule('worker')
      .test(/\.worker\.js$/)
      .use('worker-loader')
      .loader('worker-loader')
      .tap(options => ({ worker: 'SharedWorker' }))
      .end()
    // .rule('worker')
    // .test(/\.worker\.js$/)
    // .use('worker-loader')
    // .loader('worker-loader')
    // .tap(options => {
    //   return ({
    //     worker: 'Worker'
    //   })
    // })
    // .end();


    config.module.rule('js').exclude.add(/\.worker\.js$/)

    //   // 解决：“window is undefined”报错，这个是因为worker线程中不存在window对象，因此不能直接使用，要用this代替
    //   config.output.globalObject('this')

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
      '/BI-API': {
        target: 'http://127.0.0.1:5053',
        secure: false,
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/BI-API': ''
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
      },
      '/FormDesigner': {
        target: 'http://192.168.0.100:8061',
        secure: true,
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/FormDesigner': '/FormDesigner',
        }
      }
    }
  }
})
