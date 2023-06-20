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
            v-for="item in ['database', 'post', 'get', 'script', 'mock']"
            :key="item"
            :label="getDataSourceTypeLabel(item)"
            :value="item"
          >
          </el-option>
        </el-select>
      </div>

      <div v-if="canvasDataSource.dataSourceType === 'database'">
        <div>数据库</div>
        <el-select
          id="database-select"
          v-model="canvasDataSource.dataSource"
          placeholder=""
          value-key="id"
          @keyup.enter.native="addDatabase('show', $event)"
          @clear="addDatabase('showRemove')"
          clearable
          filterable
        >
          <el-option v-for="item in databaseList" :key="item.id" :label="item.name" :value="item"> </el-option>
        </el-select>
      </div>

      <div>
        <div>执行计划</div>
        <el-input v-model="canvasDataSource.cron"></el-input>
      </div>

      <div class="canvas-data-source-list">
        <div>
          <span>已添加的数据源</span>
          <el-button
            style="margin-left: 6px; transform: scale(0.6)"
            @click="addCanvasDataSource"
            icon="el-icon-plus"
            type="primary"
            size="mini"
            circle
          ></el-button>
          <el-button
            style="transform: scale(0.6) translateX(-13px)"
            @click="deleteCanvasDataSource"
            icon="el-icon-minus"
            type="primary"
            size="mini"
            circle
          ></el-button>
        </div>

        <div>
          <div>
            <div>名称</div>
            <div>组件</div>
            <div>数据来源</div>
          </div>
          <div
            v-for="(item, index) in canvasDataSourceList"
            @click="selectCanvasDataSource(item)"
            :class="getDataSourceClassName(item)"
            :key="index"
          >
            <div>{{ item.name }}</div>
            <div>{{ item.componentName }}</div>
            <div>{{ item.dataSource ? item.dataSource.name : '' }}</div>
          </div>
        </div>
      </div>

      <div>
        <div><el-button @click="testDataSource">测试</el-button></div>
        <div><el-button @click="saveCanvasDataSourceList">保存</el-button></div>
      </div>

      <div class="subcomponent" v-if="Component.component === 'Group'"></div>
    </div>

    <div v-if="canvasDataSource.dataSourceType === 'database'">
      <div>
        <el-input v-model="canvasDataSource.sql" type="textarea"></el-input>
      </div>
    </div>

    <div v-if="canvasDataSource.dataSourceType === 'script'">
      <div>
        <el-input v-model="canvasDataSource.script" type="textarea"></el-input>
      </div>
    </div>

    <div v-if="canvasDataSource.dataSourceType === 'get' || canvasDataSource.dataSourceType === 'post'">
      <div>url</div>
      <el-input> </el-input>
    </div>

    <el-dialog title="组件预览" :visible.sync="componentPreviewDialogVisible" class="component-preview">
      <div>
        <!--页面组件列表展示-->

        <!-- <Shape
        :key="Component.id"
        :default-style="Component.style"
        :style="getShapeStyle(Component.style, Component.styleUnit)"
        :element="Component"
      > -->
        <component
          :is="Component.component"
          :id="'component' + Component.id"
          class="component"
          :style="getComponentStyle(Component)"
          :prop-value="Component.propValue"
          :element="Component"
        />
        <!-- </Shape> -->
      </div>
    </el-dialog>

    <el-dialog :visible.sync="addDatabaseDialogVisible" class="add-database-dialog">
      <div slot="title">
        <div style="font-size: 16px; width: 10vw">
          {{ addDatabaseDialogTitle }}
        </div>
      </div>

      <div>
        <el-form ref="form" :model="temp" label-width="auto" style="width: 30vw">
          <el-form-item label="名称" style="text-align: left; width: 90%">
            <el-input v-model="temp.name"></el-input>
          </el-form-item>
          <el-form-item label="数据库类型" style="text-align: left; width: 90%">
            <el-select v-model="temp.dbType" placeholder="" value-key="id" style="text-align: left; width: 100%">
              <el-option key="SQLServer" label="SQLServer" value="SQLServer"> </el-option>
              <el-option key="Oracle" label="Oracle" value="Oracle"> </el-option>
              <el-option key="MySQL" label="MySQL" value="MySQL"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="数据库名" style="text-align: left; width: 90%">
            <el-input v-model="temp.dbName"></el-input>
          </el-form-item>
          <el-form-item label="数据库IP" style="text-align: left; width: 90%">
            <el-input v-model="temp.dbIp"></el-input>
          </el-form-item>
          <el-form-item label="数据库端口" style="text-align: left; width: 90%">
            <el-input v-model="temp.dbPort"></el-input>
          </el-form-item>
          <el-form-item label="数据库用户名" style="text-align: left; width: 90%">
            <el-input v-model="temp.dbUserId"></el-input>
          </el-form-item>
          <el-form-item label="数据库密码" style="text-align: left; width: 90%">
            <el-input v-model="temp.dbPassword"></el-input>
          </el-form-item>
          <el-form-item label="字符集" style="text-align: left; width: 90%">
            <el-input v-model="temp.dbCharset"></el-input>
          </el-form-item>
          <el-form-item label="备注" style="text-align: left; width: 90%">
            <el-input v-model="temp.remark" type="textarea" rows="3"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button @click="addDatabaseDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="addDatabaseDialogTitle === '添加数据库' ? addDatabase('add') : addDatabase('remove')"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script src="monaco-editor/min/vs/loader.js"></script>
<script>
import CodeEditor from '../../components/DataVisualEditor/components/CodeEditor';
import { listenGlobalKeyDown } from '../../components/DataVisualEditor/utils/shortcutKey';
import { deepCopy, selectFile, saveText, accMul, getOneMmsPx } from '../../components/DataVisualEditor/utils/utils';
import { commitData } from '../../components/DataVisualEditor/utils/dataBinder';
import { get } from '../../components/DataVisualEditor/utils/request';
import * as DB from '../../components/DataVisualEditor/utils/indexDB';
import Vue from 'vue';
import { mapState } from 'vuex';
import axios from 'axios';
import {
  getStyle,
  getComponentRotatedStyle,
  getCanvasStyle,
  addStyleListToHead,
} from '../../components/DataVisualEditor/utils/style';

import {
  CompileToModule,
  CompileTypescriptToIIFE,
  codeToInstance,
} from '../../components/DataVisualEditor/utils/compiler';

import Shape from '../../components/DataVisualEditor/components/Editor/Shape';

import generateID, { resetID } from '../../components/DataVisualEditor/utils/generateID';
const JSONfn = require('jsonfn').JSONfn;

export default {
  name: 'LabelViewer',
  data() {
    return {
      canvas: [],
      databaseList: [],
      canvasDataSourceList: [],
      canvasDataSource: {},
      canvasName: '',
      componentPreviewDialogVisible: false,
      addDatabaseDialogVisible: false,
      temp: {},
      addDatabaseDialogTitle: '添加数据库',
    };
  },
  components: { CodeEditor, Shape },
  props: {},
  computed: {
    ...mapState(['canvasData', 'canvasComponentData']),
    ComponentList() {
      if (this.canvasComponentData.length === 0) return [];
      const componentList = [];
      for (const item of this.canvasComponentData) {
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
  },
  created() {
    document.title = '组件数据源编辑';

    this.canvasName = this.$route.query.name;

    if (this.canvasName === undefined || this.canvasName === null || this.canvasName.trim() === '') {
      // todo: 显示画布列表
      toast('请设置画布名称!!!');
      return;
    }

    this.$store.commit('setCanvasName', this.canvasName);

    DB.CallbackMap.onOpenSucceedEventList.push(() => {
      DB.getAllItemByType('Canvas-Data').then(canvasList => {
        if (canvasList === undefined || canvasList === null || canvasList.length === 0) {
          toast('未找到存储的画布数据');
          return;
        }
        for (const item of canvasList) {
          if (item.name === this.canvasName) {
            this.canvas = item;
            this.$store.commit('setCanvasComponentData', JSONfn.parse(this.canvas.canvasComponentData));
          }
        }
        if (this.canvas === undefined || this.canvas === null) {
          toast('未找到画布数据');
          return;
        }
      });
    });

    axios.post(`/BI-API/DataSource/FindDatabaseByUserId`, null, { params: { userId: 'admin' } }).then(({ data }) => {
      this.databaseList = data.data;
    });

    axios
      .get(`/BI-API/DataSource/GetCanvasDataSourceList`, { params: { userId: 'admin', canvasName: this.canvasName } })
      .then(({ data }) => {
        this.canvasDataSourceList = JSON.parse(data.data);
        if (this.canvasDataSourceList.length > 0) this.canvasDataSource = this.canvasDataSourceList[0];
      });
  },
  mounted() {},
  methods: {
    addDatabase(type, event) {
      if (type === 'show') {
        this.addDatabaseDialogTitle = '添加数据库';
        if (event.target.value === undefined || event.target.value === null || event.target.value.trim() === '') return;
        const name = event.target.value.trim();

        this.temp = { name: name, userId: 'admin' };
        this.addDatabaseDialogVisible = true;
      } else if (type === 'add') {
        this.addDatabaseDialogTitle = '添加数据库';
        axios.post('/BI-API/DataSource/AddDatabase', this.temp).then(({ data }) => {
          this.temp.id = data.data;
          this.databaseList.push(this.temp);
        });
        this.addDatabaseDialogVisible = false;
      } else if (type === 'showRemove') {
        const name = document.getElementById('database-select').value;
        this.temp = this.databaseList.find(item => item.name === name);
        this.addDatabaseDialogTitle = '确定删除此数据库吗?';
        this.addDatabaseDialogVisible = true;
      } else if (type === 'remove') {
        this.addDatabaseDialogVisible = false;
        const id = this.temp.id;
        axios.post('/BI-API/DataSource/DeleteDatabase', { id: id }).then(({ data }) => {
          for (let i = 0; i < this.databaseList.length; i++) {
            const database = this.databaseList[i];
            if (database.id === id) {
              this.databaseList.splice(i, 1);
              break;
            }
          }
        });
      }
    },
    getDataSourceClassName(item) {
      let className = '';
      if (item.id === this.canvasDataSource.id) {
        className = 'selected-canvas-data-source';
      } else {
        className = 'canvas-data-source';
      }
      const c = this.ComponentList.find(c => c.data.name === item.componentName);
      if (c === undefined) {
        className += ' component-missing';
      }
      return className;
    },
    testDataSource() {
      this.componentPreviewDialogVisible = true;

      const task = this.canvasDataSource;
      console.log('测试数据', task);

      for (let i = 0; i < this.canvasComponentData.length; i++) {
        let component = this.canvasComponentData[i];
        if (component.component === 'Group')
          component = component.propValue.find(item => item.data.name === task.componentName);
        if (component === undefined || component === null) continue;
        if (task.componentName === component.data.name) {
          task.componentType = component.component;
          break;
        }
      }

      if (task.dataSourceType === 'script') {
        codeToInstance(task.scriptLanguage || 'js', task.script).then(instance => {
          let method = null;
          if (Object.prototype.toString.call(instance) === '[object Module]') {
            method = instance.default.bind(this);
          } else if (Object.prototype.toString.call(instance) === '[object Function]') {
          } else if (Object.prototype.toString.call(module.default) === '[object Object]') {
          }
          const response = method(task);
          if (Object.prototype.toString.call(response) === '[object Promise]') {
            response
              .then(data => {
                commitData(this.$store, task, data);
              })
              .catch(error => {
                console.error(`执行script任务异常`, task, error);
              });
          } else {
            commitData(this.$store, task, response);
          }
        });
      } else if (task.dataSourceType === 'database') {
        let attributeName = '';
        if (task.componentType === 'v-table') {
          attributeName = 'data.tableData';
        } else if (task.componentType === 'vc-chart') {
        } else {
          throw new Error('不支持的数据类型');
        }

        axios.post('/BI-API/DataSource/GetData', task, { timeout: 100000 }).then(({ data }) => {
          console.log('请求数据库', data);
          if (data.state !== 200) {
            console.error('请求数据异常');
            return;
          }
          commitData(this.$store, task, {
            name: task.componentName,
            attributeName: attributeName,
            data: data.data,
          });
        });
      }
    },
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
        Message('请设置数据项名称');
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
    saveCanvasDataSourceList() {
      // todo 保存之前先检测sql或脚本语法
      this.canvasDataSourceList.forEach(item => {
        if (item.dataSourceType === 'script') {
          // 检查类型注解
          if (/@[a-zA-Z]+/.test(item.script)) return 'ts';
        }

        console.log('脚本语法', item);
      });

      const dataSourceParameters = JSONfn.stringify(this.canvasDataSourceList);
      DB.setItem(`bi-user-canvas-data-source-${this.canvasName}`, dataSourceParameters);

      axios
        .post(`/BI-API/DataSource/SaveCanvasDataSourceList`, this.canvasDataSourceList, {
          params: { userId: 'admin', canvasName: this.canvasName },
        })
        .then(({ data }) => {
          if (data.state === 200) toast('保存成功', 'success');
        });
    },
    getComponentStyle(component) {
      if (JSON.stringify(component) === '{}') return '';
      return getStyle(component.style, component.styleUnit, 1, ['top', 'left']);
    },
    getShapeStyle(style, styleUnit) {
      if (style === undefined || styleUnit === undefined) {
        return '';
      }

      const result = {};
      ['width', 'height', 'top', 'left', 'rotate'].forEach(attr => {
        if (attr != 'rotate') {
          result[attr] = style[attr] + (styleUnit ? styleUnit[attr] : 'px');
        } else {
          result.transform = 'rotate(' + style[attr] + 'deg)';
        }
      });

      return result;
    },
  },
};
</script>

<style lang="less" scoped>
@import 'index.less';
</style>
