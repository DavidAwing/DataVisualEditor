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
 

    console.log("全局", Babel);
    console.log("全局", Object.prototype.toString.call(Babel) );

    axios
      .get('/BI/Component/GetGlobalModuleScript', { timeout: 1000 * 6 })
      .then(({ data }) => {
        if (data.state !== 200) {
          console.error('获取全局挂载脚本异常', error);
          return;
        }

        data.data.forEach(item => {
          if (item.type === 'ts') {
            const iife = CompileTypescriptToIIFE(item.code);
            const instance = new iife();
            let name = iife.Name;
            if (instance.Name) name = instance.Name;
            if (instance.MountTarget === undefined || instance.MountTarget === null) {
              console.warn('GetGlobalModuleScript|MountTarget未赋值,挂载默认目标window', item);
              instance.MountTarget = window;
            }
            if (name === undefined || name === null) {
              console.warn('GetGlobalModuleScript|Name未赋值,设置为文件名', item);
              name = item.name;
            }
            instance.MountTarget[name] = instance;
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
              instance.MountTarget[name] = instance;
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
              module.MountTarget[name] = module.default;
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
