<template>
  <div class="container">
    <div>
      <el-form>
        <el-form-item label="组件">
          <el-select v-model="currentComponent" placeholder="" multiple>
            <el-option
              v-for="item in components"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="样式">
          <el-select v-model="currentComponent" placeholder="">
            <el-option
              v-for="item in components"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>

    <div>
      <!-- 代码编辑区 -->
      <CodeEditor class="code-editor"></CodeEditor>

      <!-- 组件效果预览 -->
      <div class="preview">
        <el-form
          label-width="70px"
          :model="previewComponent"
          label-position="left"
          size="mini"
          style="margin-left: 10px; margin-top: 6px"
        >
          <el-form-item label="预览组件">
            <div style="width: 100%; min-width: 100%; display: flex">
              <el-select v-model="currentComponent" placeholder="" clearable>
                <el-option
                  v-for="item in components"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div>
          </el-form-item>
          <el-form-item label="选择器">
            <el-select v-model="currentComponent" placeholder="">
              <el-option
                v-for="item in components"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div></div>
      </div>
    </div>
  </div>
</template>

<script src="monaco-editor/min/vs/loader.js"></script>
<script>
import CodeEditor from "../../components/DataVisualEditor/components/CodeEditor";
import { listenGlobalKeyDown } from "../../components/DataVisualEditor/utils/shortcutKey";
import {
  deepCopy,
  selectFile,
  saveText,
  accMul,
  getOneMmsPx,
} from "../../components/DataVisualEditor/utils/utils";
import { get } from "../../components/DataVisualEditor/utils/request";

import generateID, {
  resetID,
} from "../../components/DataVisualEditor/utils/generateID";
const JSONfn = require("jsonfn").JSONfn;

export default {
  name: "LabelViewer",
  data() {
    return {
      isShowPreview: true,
      labelData: {},
      scale: 100,
      background: "#FFFFF0",
      components: [
        {
          label: "表格",
          value: "v-table",
        },
        {
          label: "文本",
          value: "v-text",
        },
      ],
      currentComponent: "",
      previewComponent: "",
    };
  },
  components: { CodeEditor },
  props: {},
  computed: {},
  created() {
    document.title = "编辑器数据管理";
  },
  mounted() {},
  methods: {},
};
</script>

<style lang="less" scoped>
@import "index.less";
</style>
