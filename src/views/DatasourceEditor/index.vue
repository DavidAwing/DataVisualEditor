<template>
  <div class="container">
    <div>
      <div>
        <div>名称</div>
        <el-input v-model="canvasDataSource.name"> </el-input>
      </div>

      <div>
        <div>组件</div>
        <el-select v-model="canvasDataSource.componentName" placeholder="" :multiple="false">
          <el-option
            v-for="item in ComponentList"
            :key="item.data.name"
            :label="item.data.name"
            :value="item.data.name"
          >
          </el-option>
        </el-select>
      </div>

      <div>
        <div>数据源类型</div>
        <el-select v-model="canvasDataSource.dataSourceType" placeholder="">
          <el-option
            v-for="item in ['database', 'http', 'script', 'mock']"
            :key="item"
            :label="getDataSourceTypeLabel(item)"
            :value="item"
          >
          </el-option>
        </el-select>
      </div>

      <div v-if="canvasDataSource.dataSourceType === 'database'">
        <div>数据库</div>
        <el-select v-model="canvasDataSource.dataSourceType" placeholder="">
          <el-option
            v-for="item in ['database', 'http', 'script', 'mock']"
            :key="item"
            :label="getDataSourceTypeLabel(item)"
            :value="item"
          >
          </el-option>
        </el-select>
      </div>

      <div>
        <div>执行计划</div>
        <el-input></el-input>
      </div>

      <div class="canvas-data-source-list">
        <div>已添加的数据源</div>
        <div>
          <div>
            <div>名称</div>
            <div>组件</div>
            <div>数据来源</div>
          </div>

          <div
            v-for="(item, index) in canvasDataSourceList"
            @click="selectCanvasDataSource(item)"
            :class="item.id === canvasDataSource.id ? 'selected-canvas-data-source' : 'canvas-data-source'"
          >
            <div>{{ item.name }}</div>
            <div>{{ item.componentName }}</div>
            <div>11</div>
          </div>

          <!-- <el-table :data="tableData" style="width: 80%">
            <el-table-column prop="name" label="名称" width="180"> </el-table-column>
            <el-table-column prop="name" label="姓名" width="180"> </el-table-column>
            <el-table-column prop="address" label="地址"> </el-table-column>
          </el-table> -->
        </div>
      </div>

      <div>
        <div><el-button @click="addCanvasDataSource">添加</el-button></div>
        <div><el-button @click="deleteCanvasDataSource">删除</el-button></div>
      </div>

      <div class="subcomponent" v-if="Component.component === 'Group'"></div>
    </div>

    <div v-if="canvasDataSource.dataSourceType === 'database'">
      <div>
        <el-input type="textarea"></el-input>
      </div>

      <div>
        <el-button>测试</el-button>
      </div>
    </div>

    <div v-if="canvasDataSource.dataSourceType === 'get' || canvasDataSource.dataSourceType === 'post'">
      <div>url</div>
      <el-input> </el-input>
    </div>
  </div>
</template>

<script src="monaco-editor/min/vs/loader.js"></script>
<script>
import CodeEditor from '../../components/DataVisualEditor/components/CodeEditor';
import { listenGlobalKeyDown } from '../../components/DataVisualEditor/utils/shortcutKey';
import { deepCopy, selectFile, saveText, accMul, getOneMmsPx } from '../../components/DataVisualEditor/utils/utils';
import { get } from '../../components/DataVisualEditor/utils/request';
import * as DB from '../../components/DataVisualEditor/utils/indexDB';
import Vue from 'vue';
import axios from 'axios';

import generateID, { resetID } from '../../components/DataVisualEditor/utils/generateID';
const JSONfn = require('jsonfn').JSONfn;

export default {
  name: 'LabelViewer',
  data() {
    return {
      canvas: [],
      selectComponentName: [],
      dataSourceList: [],
      dataSourceName: '',
      canvasDataSourceList: [],
      canvasDataSource: {
        id: '',
        name: '',
        componentName: '',
        dataSourceType: '',
        cron: '',
        dataSource: {},
      },
    };
  },
  components: { CodeEditor },
  props: {},
  computed: {
    ComponentList() {
      if (this.canvas.length === 0) return [];
      const componentList = [];
      for (const item of JSONfn.parse(this.canvas.canvasComponentData)) {
        if (item.component === 'Group') {
          for (const subcomponent of item.propValue) componentList.push(subcomponent);
        } else {
          componentList.push(item);
        }
      }
      return componentList.filter(item => item.component !== 'v-rect-shape');
    },
    Component() {
      if (this.ComponentList.length === 0) return {};
      for (const item of this.ComponentList) {
        const name = this.canvasDataSource.componentName;
        if (name === undefined || name === null) continue;
        if (name.includes(item.data.name)) return item;
      }
      return {};
    },
    Datasource() {
      if (this.dataSourceList.length === 0) return {};

      for (const item of this.dataSourceList) {
        if (item.name === this.dataSourceName) return item;
      }
      return {};
    },
  },
  created() {
    document.title = '组件数据源编辑';

    const canvasName = this.$route.query.name;
    if (!canvasName) {
      // todo: 显示画布列表
      toast('请设置画布名称!!!');
      return;
    }

    DB.CallbackMap.onOpenSucceedEventList.push(() => {
      DB.getAllItemByType('Canvas-Data').then(canvasList => {
        if (canvasList === undefined || canvasList === null || canvasList.length === 0) {
          console.log('找不到画布数据');
          return;
        }

        for (const item of canvasList) {
          if (item.name === canvasName) this.canvas = item;
        }

        if (this.canvas === undefined || this.canvas === null) {
          console.log('找不到画布数据');
          return;
        }

        console.log('画布', this.canvas);
      });
    });

    axios
      .post(`/BI/DataSource/FindUserDataSource`, {
        userId: 'admin',
      })
      .then(({ data }) => {
        this.dataSourceList = data.data;

        console.log('数据源', data);
      });
  },
  mounted() {},
  methods: {
    selectCanvasDataSource(canvasDataSource) {
      if (this.canvasDataSource.id === canvasDataSource.id) {
        this.canvasDataSource = {};
      } else {
        this.canvasDataSource = canvasDataSource;
      }
    },
    deleteCanvasDataSource() {
      const index = this.canvasDataSourceList.indexOf(this.canvasDataSource);
      if (index !== -1) {
        Vue.delete(this.canvasDataSourceList, index);
        this.canvasDataSource = {};
      }
    },
    addCanvasDataSource() {
      let name = this.canvasDataSource.name;
      if (name === undefined || name === null || typeof name !== 'string' || name.trim().length === 0) {
        console.warn('没有设置名称');
        return;
      }
      name = name.trim();
      const canvasDataSource = this.canvasDataSourceList.find(item => item.name === name);
      if (canvasDataSource === undefined || canvasDataSource === null) {
        const item = JSON.parse(JSON.stringify(this.canvasDataSource));
        item.id = this.canvasDataSourceList.length;
        this.canvasDataSourceList.push(item);
      }
    },
    getComponentType(component) {
      if (component === 'v-text') {
        return '文本';
      } else if (component === 'Group') {
        return '组合';
      } else if (component === 'vc-chart') {
        return '图表';
      } else if (component === 'v-table') {
        return '表格';
      } else if (component === 'v-picture') {
        return '图片';
      } else if (component === 'v-rect-shape') {
        return '边框';
      }

      return component;
    },
    getDataSourceTypeLabel(type) {
      if (type === 'database') {
        return '数据库';
      } else if (type === 'get') {
        return 'GET';
      } else if (type === 'post') {
        return 'POST';
      } else if (type === 'http') {
        return 'HTTP';
      } else if (type === 'script') {
        return 'js或ts脚本';
      } else if (type === 'mock') {
        return '模拟数据';
      }

      return type;
    },
  },
};
</script>

<style lang="less" scoped>
@import 'index.less';
</style>
