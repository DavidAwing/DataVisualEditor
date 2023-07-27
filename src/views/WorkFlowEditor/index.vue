<template>

  <div class="logic-flow-view">
    <!-- 辅助工具栏 -->
    <Control 
      class="control"
      v-if="lf"
      :lf="lf"
      catTurboData=true
      @catData="$_catData"
      @catTurboData="$_catTurboData"
    ></Control>
    <!-- 节点面板 -->
    <NodePanel :lf="lf" :nodeList="nodeList"></NodePanel>
    <!-- 画布 -->
    <div id="LF-Turbo" ref="container"></div>
    <!-- 数据查看面板 -->
    <el-dialog
      title="数据"
      :visible.sync="dataVisible"
      width="50%">
      <DataDialog :graphData="graphData"></DataDialog>
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
import { requestCanvasData } from '../../components/DataVisualEditor/utils/dataBinder';


import LogicFlow from '@logicflow/core'
import { Snapshot, BpmnElement, Menu,  MiniMap } from '@logicflow/extension'
import '@logicflow/core/dist/style/index.css'
import '@logicflow/extension/lib/style/index.css'
import NodePanel from './LFComponents/NodePanel'
import Control from './LFComponents/Control'
import DataDialog from './LFComponents/DataDialog'
import { toTurboData, toLogicflowData } from './Util/AdpterForTurbo';
import { BpmnNode } from './config'
const demoData = require('./dataTurbo.json')



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
import eventBus from '../../components/DataVisualEditor/utils/eventBus';
const JSONfn = require('jsonfn').JSONfn;


export default {
  components: { NodePanel, Control, DataDialog, MiniMap },
  data() {
    return {
      canvasTemplateList: [],
      dropdownStyle: {
        position: 'absolute',
        top: 0,
        left: 0,
      },
      canvasTemplateName: '',
      lf: null,
      dialogVisible: false,
      graphData: null,
      dataVisible: false,
      config: {
        grid: true,
        background: {
          color: '#f7f9ff'
        },
        keyboard: {
          enabled: true
        },
      },
      nodeList: BpmnNode,
    };
  },
  props: {},
  computed: {
    ...mapState(['canvasData', 'canvasComponentData']),
  },
  created() {
    axios.get(`/BI-API/Component/GetCanvasTemplateList`).then(({ data }) => {
      this.canvasTemplateList = data.data;
      console.log('画布列表', this.canvasTemplateList);
    });
  },
  mounted() {
    this.$_initLf()
  },
  methods: {
    openCanvasTemplate(type) {
      if (type === 'edit') {
        DB.setItem('CanvasTemplateName', this.canvasTemplateName);
        window.open('/bi/#/editor');
      } else if (type === 'publish') {
        window.open(`/bi/#/viewer?name=${this.canvasTemplateName}`);
      }
    },
    showCanvasTemplateImageContextMenu(event, name) {
      event.preventDefault();

      const contextMenu = this.$refs.canvasTemplateImageContextMenu;
      this.dropdownStyle.top = event.clientY + 'px';
      this.dropdownStyle.left = event.clientX + 'px';
      const visible = contextMenu.visible;
      if (visible) contextMenu.hide();
      this.canvasTemplateName = name;
      setTimeout(() => {
        if (visible) {
          setTimeout(() => {
            contextMenu.show();
          }, 160);
        } else {
          contextMenu.show();
        }
      }, 10);
    },
    $_initLf () {
      // 画布配置
      LogicFlow.use(Snapshot)
      LogicFlow.use(MiniMap)
      // 使用bpmn插件，引入bpmn元素，这些元素可以在turbo中转换后使用
      LogicFlow.use(BpmnElement)
      const lf = new LogicFlow({
        ...this.config,
        container: this.$refs.container
      })
      this.lf = lf
      // 设置边类型bpmn:sequenceFlow为默认类型
      lf.setDefaultEdgeType('bpmn:sequenceFlow')
      this.$_render()
    },
    $_render () {
      // Turbo数据转换为LogicFlow内部识别的数据结构
      const lFData = toLogicflowData(demoData)
      this.lf.render(lFData)
    },
    closeDialog () {
      this.$data.dialogVisible = false
    },
    $_catData(){
      this.$data.graphData = this.$data.lf.getGraphData();
      this.$data.dataVisible = true;
    },
    $_catTurboData(){
      const graphData = this.$data.lf.getGraphData();
      // 数据转化为Turbo识别的数据结构
      this.$data.graphData = toTurboData(graphData)
      this.$data.dataVisible = true;
    }
  },
};
</script>

<style lang="less" scoped>
@import 'index.less';
</style>
