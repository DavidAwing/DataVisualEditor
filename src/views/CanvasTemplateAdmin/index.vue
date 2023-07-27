<template>
  <div>

    <div class="canvas-template-list">
      <div v-for="item in canvasTemplateList" class="canvas-template">
        <img
          ref="canvasImage"
          :src="`/BI-API/Component/GetCanvasTemplateImage?name=${item.name}`"
          alt="预览图丢失"
          srcset=""
          @contextmenu="showCanvasTemplateImageContextMenu($event, item.name)"
        />
        <label>{{ item.name }}</label>
      </div>
      <div style="width: 100vw;height: 100vh;"></div>
    </div>

    <el-dropdown ref="canvasTemplateImageContextMenu" :style="dropdownStyle" @command="openCanvasTemplate">
      <el-dropdown-menu>
        <el-dropdown-item command="edit">前往编辑页</el-dropdown-item>
        <el-dropdown-item command="publish">前往发布页</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>

  <!-- <el-row :gutter="20">
    <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
    <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
    <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
    <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
  </el-row> -->
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
  data() {
    return {
      canvasTemplateList: [],
      dropdownStyle: {
        position: 'absolute',
        top: 0,
        left: 0,
      },
      canvasTemplateName: '',
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
  mounted() {},
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
  },
};
</script>

<style lang="less" scoped>
@import 'index.less';
</style>
