<!-- TODO: 这个页面后续将用 JSX 重构 -->
<template>
  <div class="container">
    <!-- <el-button @click="addStyle">添加样式</el-button>
    <hr class="hr-edge-weak" style="margin-top: 6px" /> -->

    <div class="style-list">
      <el-form label-position="left">
        <el-form-item label="选择器" v-if="false">
          <div style="width: 100%; min-width: 100%; display: flex">
            <el-select v-model="curSelector" clearable>
              <!-- <el-option key="main-style" label="主要样式" value="main-style"></el-option>
                                                                                                          <hr class="hr-edge-weak" style="margin-top: 6px;"> -->
              <el-option
                v-for="(selector, index) in selectorList"
                :key="selector.label"
                :label="selector.label"
                :value="selector.value"
              >
              </el-option>
            </el-select>
            <button class="set-selector">
              <img
                src="@/assets/setting.png"
                alt=""
                srcset=""
                width="18px"
                style="vertical-align: middle"
              />
            </button>
          </div>

          <!-- <el-checkbox-group v-model="activeClassList" @change="()=>{
              if (this.activeClassList.length > 1)
                this.activeClassList.shift()
            }">
              <el-checkbox v-for="(name, index) in selectorList" :label="name" :key="index"></el-checkbox>
                                                                                                      </el-checkbox-group> -->
        </el-form-item>
        <el-popover
          placement="left"
          title=""
          width="300"
          trigger="hover"
          :open-delay="1500"
          :disabled="showStyleDetails"
        >
          <!-- todo: 根据字符串的不同,或者显示图片或者显示网页,或者显示html -->
          <!-- 图片 -->
          <!-- <el-image :src="curStyle.details" lazy>
            <div slot="placeholder" class="image-slot">
              样式详情加载中<span class="dot">...</span>
            </div>
          </el-image> -->
          <!-- html -->
          <div v-html="curStyle.details">页面加载中...</div>

          <el-form-item label="样式" slot="reference">
            <div style="width: 100%; min-width: 100%; display: flex">
              <el-cascader
                v-model="selectedStyle"
                :options="styleList"
                @change="handleStyleChange"
                clearable
              >
              </el-cascader>
              <button class="set-style">
                <img
                  src="@/assets/setting.png"
                  alt=""
                  srcset=""
                  width="18px"
                  style="vertical-align: middle"
                />
              </button>
            </div>
          </el-form-item>
        </el-popover>
      </el-form>
    </div>

    <div class="style-css">
      <div class="style-item">
        <el-form label-position="left">
          <el-tag
            :key="generateStyleId(style.styleId)"
            v-for="style in addedStyleTags"
            closable
            :disable-transitions="false"
            @close="handleStyleTagsClose(style)"
            style="font-size: 12px"
            v-if="false"
          >
            {{ style.styleName }}
          </el-tag>

          <!-- <el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="small"
            @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm" >
          </el-input>
                                                                                                    <el-button v-else class="button-new-tag" size="small" @click="showInput">+ Add</el-button> -->

          <el-collapse v-model="cssActiveCollapses">
            <el-collapse-item title="已应用样式" name="1">
              <el-tag
                v-for="(style, styleIndex) in addedStyleTags"
                :key="generateStyleId(style.styleId) + styleIndex"
                closable
                :disable-transitions="false"
                @close="handleStyleTagsClose(style)"
                @click="switchToStyle(style)"
                class="applied-style"
              >
                {{ style.styleName }}
              </el-tag>
            </el-collapse-item>

            <el-collapse-item title="变量" name="2">
              <div style="display: flex; flex-flow: column nowrap">
                <el-form-item
                  v-for="(
                    { label, variable, type, options }, index
                  ) in curStyle.attrList"
                  :key="index"
                  :label="label || variable"
                >
                  <div v-if="type == 'color-picker'">
                    <el-color-picker
                      v-model="curStyle.attrList[index].value"
                      :showAlpha="options.showAlpha"
                    >
                    </el-color-picker>
                  </div>

                  <div
                    v-else-if="type == 'text'"
                    style="display: flex; width: 100%; position: relative"
                    class="form-item-input"
                  >
                    <el-input v-model="curStyle.attrList[index].value" />
                  </div>

                  <div
                    v-else-if="type === 'number'"
                    style="display: flex; width: 100%; position: relative"
                  >
                    <el-input
                      v-model.number="curStyle.attrList[index].value"
                      type="number"
                    />
                    <el-select
                      v-if="curStyle.attrList[index].options.unit"
                      v-model="curStyle.attrList[index].options.unit"
                      style="width: 100px; margin-left: 6px"
                    >
                      <el-option key="px" label="px" value="px"></el-option>
                      <el-option key="%" label="%" value="%"></el-option>
                    </el-select>
                  </div>

                  <div
                  v-else-if="type === 'integer'"
                  style="display: flex; width: 100%; position: relative"
                >
                <!--  oninput="value=value.replace(/[^0-9]/g,'')" -->
                  <el-input-number
                    v-model.number="curStyle.attrList[index].value"
                    :min="options.min || -99999"
                    :max="options.max || 99999"
                    :step="options.step || 1"
                    type="number"
                  />
                  <el-select
                    v-if="curStyle.attrList[index].options.unit"
                    v-model="curStyle.attrList[index].options.unit"
                    style="width: 100px; margin-left: 6px"
                  >
                    <el-option key="px" label="px" value="px"></el-option>
                    <el-option key="%" label="%" value="%"></el-option>
                  </el-select>
                </div>

                  <div v-else-if="type == 'select'">
                    <el-select
                      v-model="curStyle.attrList[index].value"
                      placeholder=""
                    >
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                  </div>

                  <div v-else-if="type === 'checkbox'">
                    <el-checkbox
                      v-model="curStyle.attrList[index].value"
                    ></el-checkbox>
                  </div>
                </el-form-item>
              </div>
            </el-collapse-item>

            <el-collapse-item title="css & less" name="3" v-if="false">
              <div v-if="curStyle.type === 'css'">
                <el-form-item label="">
                  <el-input
                    placeholder="请输入样式,例如:
                                                                                                {
                                                                                                  color: red;
                                                                                                  background-color: aqua;
                                                                                                }"
                    v-model="curStyle.css"
                    type="textarea"
                    rows="10"
                  />
                </el-form-item>
              </div>
            </el-collapse-item>
          </el-collapse>
        </el-form>
      </div>
    </div>

    <div class="footer">
      <!-- 自动替换变量, 自动循环 -->
      <el-button @click="addStyle">应用</el-button>
    </div>
  </div>
</template>

<script>
/*
  todo: css支持 for if 变量
  */

import { mapState } from "vuex";
import Vue from "vue";
import {
  styleData,
  addSelectorToStyle,
  isStyleExist,
  addStyleToHead,
  setStyleValues,
  getCssKeys,
  getStyleSelectorStrById,
  updateStyle,
  convertToCss,
  parseCssExpressions,
  addStyleListToHead,
  generateStyleId,
  removeAllStyleNotOfCanvasName,
} from "@/components/DataVisualEditor/utils/style";
import * as DB from "@/components/DataVisualEditor/utils/indexDB";
const toStyleString = require("to-style").string;
const toStyleObject = require("to-style").object;
import { toCSS, toJSON } from "cssjson";
import {
  strToBase64,
  isArrayInclude,
} from "@/components/DataVisualEditor/utils/utils";
import deepClone from "deep-clone";
import StyleBase from "../StyleBase";

import axios from "axios";

export default {
  components: {},
  extends: StyleBase,
  data() {
    return {
      excludes: ["Group"], // 这些组件不显示内容
      content: "",
      selectKey: ["textAlign", "borderStyle", "verticalAlign"],
      styleData,
      inputVisible: false,
      inputValue: "",
      cssActiveCollapses: ["1", "2"],
    };
  },
  computed: {
    ...mapState(["canvasName"]),
    addedStyleTags() {
      if (
        this.curComponent.styleList == null ||
        this.curComponent.styleList.length === 0
      )
        return [];
      return this.curComponent.styleList;
    },
  },
  methods: {
    generateStyleId,

    addStyle() {
      const style = this.curStyle;
      const component = this.curComponent;
      if (style.css == null || style.css.trim().length === 0) {
        console.warn("请选择样式");
        return;
      }
      
      const styleArr = this.getHierarchy(style.hierarchy);
 
      const key = "styleList:" + this.curComponent.component;
      let menuName = "";
      for (let i = 0; i < styleArr.length; i++) {
        for (let j = 0; j < this.styleMap[key].length; j++) {
          if (this.styleMap[key][j].value === styleArr[i]) {
            menuName += `${this.styleMap[key][j].label}`;
            break;
          }
        }
        if (menuName.trim() !== "") break;
      }

      const cssData = {};
      this.curStyle.attrList.forEach((attr) => {
        let attrKey = "";
        const variable = attr.variable.trim();
        !variable.startsWith("@")
          ? (attrKey = variable)
          : (attrKey = variable.substring(1));
        cssData[attrKey] = attr.value;
      });

      const styleId =
        this.canvasName +
        "-" +
        component.id +
        "-" +
        styleArr[0] +
        "-" +
        this.curStyle.value;
      for (let i = 0; i < component.styleList.length; i++) {
        const style = component.styleList[i];
        if (style.styleId === styleId) {
          this.curComponent.styleList.splice(i, 1);
          break;
        }
      }

      this.curComponent.styleList.push({
        styleId: styleId,
        styleName: `[${menuName}][${this.curStyle.label}]`,
        cssData: cssData,
        css: style.css,
        hierarchy: this.curStyle.hierarchy,
        attributePath: this.curStyle.value,
        type: this.curStyle.type,
      });
    },

    contentChange(text) {
      console.log("text", text);
    },

    showAttr(curComponent, key) {
      if (curComponent == null) return false;
      if (curComponent.attrExcludes == null) return true;
      return !curComponent.attrExcludes.includes(key);
    },

    showInput() {
      this.inputVisible = true;
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    handleInputConfirm() {
      let inputValue = this.inputValue;

      if (inputValue) {
        // todo 查找样式

        this.addedStyleTags.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = "";
    },
  },
};
</script>

<style lang="less" scoped>
@import url(../../../styles/hr-style.css);
@import url(index.less);

</style>
