<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import {
  stringToFunction,
  CompileSourcecode,
  CompileToModule,
  CompileTypescriptToIIFE,
} from './components/DataVisualEditor/utils/compiler.ts';
import Vue from 'vue';
import axios from 'axios';
import moment from 'moment';
import BigNumber from 'bignumber.js';
const JSONfn = require('jsonfn').JSONfn;

// import * as ts from './compiler/typescript@5.0.4.js';

export default {
  name: 'App',
  data() {
    return {};
  },
  components: {},
  props: {},
  computed: {},
  created() {
    window.bi = new Object();
    window.bi.Vue = Vue;
    window.bi.axios = axios;
    window.bi.moment = moment;
    window.bi.BigNumber = BigNumber;
    window.bi.JSONfn = JSONfn;
    window.bi.App = this;

    axios
      .get('/BI/Component/GetGlobalModuleScript', { timeout: 6000 })
      .then(({ data }) => {
        if (data.state !== 200) {
          console.error('获取全局挂载脚本异常', error);
          return;
        }

        data.data.forEach(item => {
          if (item.type === 'ts') {
            const iife = CompileTypescriptToIIFE(item.code);
            const instance = new iife();
            let name = iife.name;
            if (instance.Name) name = instance.Name;
            if (instance.MountTarget === undefined || instance.MountTarget === null) {
              console.warn('GetGlobalModuleScript|MountTarget未赋值,挂载默认目标window', item);
              instance.MountTarget = window;
            }
            if (name === undefined || name === null)
              console.warn('GetGlobalModuleScript|Name未赋值,设置为文件名', item);

            if (instance.MountTarget[name] === undefined) instance.MountTarget[name] = new Object();
            for (const key in instance) {
              // if (instance.hasOwnProperty(key) && Object.prototype.toString.call(instance[key]) == '[object Function]')
              instance.MountTarget[name][key] = instance[key];
            }
            return;
          }

          CompileToModule.bind(this)(item.code).then(module => {
            if (Object.prototype.toString.call(module) === '[object Module]' && module.default === undefined) {
            } else if (Object.prototype.toString.call(module.default) === '[object Function]') {
              const instance = new module.default();

              let name = instance.Name;
              if (instance.MountTarget === undefined || instance.MountTarget === null) {
                console.warn('GetGlobalModuleScript|MountTarget未赋值,挂载默认目标window', item);
                instance.MountTarget = window;
              }
              if (name === undefined || name === null) {
                console.warn('GetGlobalModuleScript|Name未赋值,设置为文件名', item);
                name = item.name;
              }
              instance.MountTarget[name] = { ...instance.MountTarget[name], ...instance };
            } else if (Object.prototype.toString.call(module.default) === '[object Object]') {
              let name = module.Name;
              if (module.MountTarget === undefined || module.MountTarget === null) {
                console.warn('GetGlobalModuleScript|MountTarget未赋值,挂载默认目标window', item);
                module.MountTarget = window;
              }
              if (name === undefined || name === null) {
                console.warn('GetGlobalModuleScript|Name未赋值,设置为文件名', item);
                name = item.name;
              }
              module.MountTarget[name] = { ...module.MountTarget[name], ...module.default };
            }
          });
        });
      })
      .catch(error => {
        console.error(`挂载全局脚本异常: `, error);
      });
  },
  mounted() {},
  methods: {},
};
</script>

<style lang="less">
#app {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
