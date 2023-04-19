<!-- TODO: 这个页面后续将用 JSX 重构 -->
<template>
  <div class="container">
    <!-- <el-button @click="addStyle">添加样式</el-button>
    <hr class="hr-edge-weak" style="margin-top: 6px" /> -->

    <div class="style-list">
      <el-form label-position="left">
        <el-form-item label="选择器">
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
            <button class="add-selector">
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
            <el-cascader
              v-model="selectedStyle"
              :options="styleList"
              @change="handleStyleChange"
              clearable
            ></el-cascader>
          </el-form-item>
        </el-popover>
      </el-form>
    </div>

    <div class="style-css">
      <div class="style-item">
        <el-form label-position="left">
          <el-form-item label="选择器" v-if="false">
            <div style="width: 100%; min-width: 100%; display: flex">
              <el-select v-model="curSelector">
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
              <button
                style="
                  display: inline-block;
                  width: 30px;
                  background-color: #faab3d;
                  margin-left: 10px;
                  border-radius: 6px;
                  border-width: 0;
                "
              >
                +
              </button>
            </div>

            <!-- <el-checkbox-group v-model="activeClassList" @change="()=>{
              if (this.activeClassList.length > 1)
                this.activeClassList.shift()
            }">
              <el-checkbox v-for="(name, index) in selectorList" :label="name" :key="index"></el-checkbox>
                                                                                                      </el-checkbox-group> -->
          </el-form-item>

          <el-tag
            :key="generateStyleId(style.styleId, curComponent.id)"
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
                :key="
                  generateStyleId(style.styleId, curComponent.id) + styleIndex
                "
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
              <div>
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
                    v-else-if="type == 'string'"
                    style="display: flex; width: 100%; position: relative"
                  >
                    <el-input
                      v-model="curStyle.attrList[index].value"
                      type="string"
                    />
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
  removeStyleById,
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
import axios from "axios";
import  StyleBase from "../StyleBase";

export default {
  components: {},
  extends: StyleBase,
  data() {
    return {
      excludes: ["Group"], // 这些组件不显示内容
      content: "",
      selectKey: ["textAlign", "borderStyle", "verticalAlign"],
      curStyle: {}, // 当前的样式
      curSelector: "", // 当前的选择器
      styleData,
      inputVisible: false,
      inputValue: "",
      styleMap: {},
      cssActiveCollapses: ["1", "2"],
      selectedStyle: null
    };
  },
  computed: {
    ...mapState(["canvasName"]),
    styleList() {
      // todo: Invalid prop: type check failed for prop "options". Expected Array, got String with value "[]".

      const key = "styleList:" + this.curComponent.component;
      if (this.styleMap.hasOwnProperty(key)) return this.styleMap[key];

      if (this.isStyleListInterrupt) return [];

      this.isStyleListInterrupt = true;
      axios
        .get("/BI/Component/GetStyleList", {
          params: {
            name: this.curComponent.component,
          },
          timeout: 10000,
        })
        .then(({ data }) => {
          this.isStyleListInterrupt = false;
          if (data.data == null || data.data.length == 0) {
            console.warn("组件未配置样式");
            return;
          }
          Vue.set(this.styleMap, key, data.data);
        })
        .catch((error) => {
          this.isStyleListInterrupt = false;
        });
      return [];
    },
    selectorList() {
      const key = "selectorList:" + this.curComponent.component;
      if (this.styleMap.hasOwnProperty(key)) return this.styleMap[key];
      if (this.isStyleListInterrupt) return [];
      this.isStyleListInterrupt = true;
      axios
        .get("/BI/Component/GetSelectorList", {
          params: {
            name: this.curComponent.component,
          },
          timeout: 10000,
        })
        .then(({ data }) => {
          this.isStyleListInterrupt = false;
          if (data.data == null || data.data.length == 0) {
            console.warn("组件未配置选择器");
            return;
          }
          Vue.set(this.styleMap, key, data.data);
        })
        .catch((error) => {
          this.isStyleListInterrupt = false;
        });
      return [];
    },
    curComponent() {
      // const defaultSelector = this.$store.state.curComponent.selectorList[0]
      // this.curSelector = defaultSelector.value || defaultSelector

      this.isSwitchToStyle = true;
      return this.$store.state.curComponent;
    },
    showStyleDetails() {
      return JSON.stringify(this.curStyle) === "{}";
    },
    addedStyleTags() {
      if (this.curComponent.styleList == null) return [];
      return this.curComponent.styleList;
    },
  },
  watch: {
    curSelector: {
      handler: function (val, old) {
        console.log("当前选择器变化", val);

        // this.selectStyle.activeClassList = val
        // if (val.length == 0)
        //   return

        // // 保存原始的样式

        // // 恢复原始的样式

        // const component = this.curComponent
        // function changeStyle(style) {
        //   const keys = Object.keys(style)
        //   keys.forEach(key => {
        //     component.style[key] = style[key]
        //   })
        // }

        // changeStyle(toJSON(this.curStyle.style).attributes)
      },
      deep: true,
    },
    curStyle: {
      handler: function (val, old) {},
      deep: true,
    },
    selectedStyle: {
      handler: function (val, old) {
        this.handleStyleChange(val);
      },
      deep: true,
    },
    styleList: {
      handler: function (val, old) {
        if (!this.isSwitchToStyle) return;

        if (
          this.addedStyleTags === undefined ||
          this.addedStyleTags.length === 0
        ) {
          console.warn("组件未应用任何样式...");
          return;
        }

        if (val === undefined || val.length === 0) {
          console.warn("组件未配置任何样式...");
          return;
        }

        // todo, 需要切换到组件最后一次编辑的项
        const style = this.addedStyleTags[0];
        const regex = /\[([^\]\s]*)\]/g;
        const styleArr = [];
        let match;
        while ((match = regex.exec(style.hierarchy)) !== null)
          styleArr.push(match[1]);

        if (styleArr.length !== 2) {
          console.warn(`样式的hierarchy不正确`, style);
          return;
        }
        this.handleStyleChange(styleArr);
        this.switchToStyle(style);
        this.isSwitchToStyle = false;
      },
      deep: true,
      immediate: true,
    },
  },

  beforeCreate() {
    // this.styleMap[this.curComponent.component + ":" + "styleList"] = {}
  },
  created() {
    console.log("this.curComponent.component", this.curComponent.component);

    // this.styleMap[this.curComponent.component + ":" + "styleList"] = null
  },
  methods: {
    generateStyleId,

    handleStyleChange(nodes) {
      for (let i = 0; i < this.styleList.length; i++) {
        const category = this.styleList[i];
        if (category.children && category.value === nodes[0])
          for (let j = 0; j < category.children.length; j++) {
            const style = category.children[j];
            if (style.value === nodes[1]) {
              this.curStyle = style;
              this.curStyle.hierarchy = `[${nodes[0]}][${nodes[1]}]`;
              return;
            }
          }
      }
    },

    addStyle() {
      // 检验并规范css
      // let css = this.curStyle.css.trim()
      // if (!css.startsWith("{") && !css.endsWith("}")) {
      //   let lines = css.split("\n");
      //   css = ""
      //   lines.forEach(line => {
      //     if (line == null || line.trim().length === 0) {
      //       return
      //     }
      //     if (!line.endsWith(";")) {
      //       css += "    " + line + ";\n"
      //     } else {
      //       css += "    " + line + "\n"
      //     }
      //   });
      //   css = "{\n" + css + "}";
      // }

      if (this.curStyle.css == null || this.curStyle.css.trim().length === 0) {
        console.warn("请选择样式");
        return;
      }

      if (this.curSelector == null || this.curSelector.trim().length === 0) {
        console.warn("请选择选择器");
        return;
      }

      let originalStyle = convertToCss(this.curStyle.css);

      const cssData = {};
      this.curStyle.attrList.forEach((attr) => {
        let attrKey = "";
        const variable = attr.variable.trim();
        !variable.startsWith("@")
          ? (attrKey = variable)
          : (attrKey = variable.substring(1));
        cssData[attrKey] = attr.value;
      });

      // if (this.curSelector === "main-style") {
      //   // 直接修改组件的样式
      //   const keys = Object.keys(cssData)
      //   keys.forEach(key => {
      //     this.curComponent.style[key] = cssData[key]
      //   })
      //   selector = this.curSelector
      // }

      // 样式会添加到页面的head标签内
      const id = this.generateStyleId(
        this.canvasName +
          "-" +
          this.curStyle.value +
          "-" +
          this.curComponent.id +
          "-" +
          this.curSelector
      );
      const selector = this.curSelector;

      // if (isStyleExist(id)) {
      //   // 获取样式的选择器
      //   let selectorStr = getStyleSelectorStrById(id);
      //   if (!selectorStr.includes(selector))
      //     !selectorStr.trim().endsWith(",")
      //       ? (selectorStr = selectorStr + "," + selector)
      //       : (selectorStr = selectorStr + selector);
      //   css = selectorStr + css;
      //   updateStyle(id, css); // 更新样式和选择器
      // } else {
      //   css = selector + css;
      //   addStyleToHead(id, css);
      // }

      // 添加到组件的样式列表

      // 样式已存在则删除
      let isExists = false;
      for (let i = 0; i < this.curComponent.styleList.length; i++) {
        // todo 速度可以优化
        const style = this.curComponent.styleList[i];
        if (
          this.generateStyleId(style.styleId, this.curComponent.id) === id &&
          style.selector === selector
        ) {
          this.curComponent.styleList[i].css = originalStyle;
          this.curComponent.styleList[i].cssData = cssData;
          isExists = true;
          break;
        }
      }

      if (!isExists) {
        let selectorName = "";
        for (let i = 0; i < this.selectorList.length; i++) {
          const selector = this.selectorList[i];
          if (
            typeof selector === "object" &&
            selector.label &&
            selector.value &&
            selector.value === this.curSelector
          ) {
            selectorName = selector.label;
            break;
          } else if (
            typeof selector === "string" &&
            selector === this.curSelector
          ) {
            selectorName = selector;
            break;
          }
        }

        this.curComponent.styleList.push({
          styleId:
            this.canvasName +
            "-" +
            this.curStyle.value +
            "-{id}-" +
            this.curSelector,
          styleName: "[" + selectorName + "][" + this.curStyle.label + "]",
          selector: this.curSelector,
          cssData: cssData,
          css: originalStyle,
          hierarchy: this.curStyle.hierarchy,
          type: this.curStyle.type,
        });
      }

      addStyleListToHead(this.curComponent, this.canvasName);
    },

    contentChange(text) {
      console.log("text", text);
    },

    showAttr(curComponent, key) {
      if (curComponent == null) return false;
      if (curComponent.attrExcludes == null) return true;
      return !curComponent.attrExcludes.includes(key);
    },

    handleStyleTagsClose(closeStyle) {
      const index = this.curComponent.styleList.indexOf(closeStyle);
      const style = this.curComponent.styleList[index];
      this.curComponent.styleList.splice(index, 1);

      removeStyleById(
        this.generateStyleId(style.styleId, this.curComponent.id)
      );

      // this.addedStyleTags.splice(this.addedStyleTags.indexOf(tag), 1);
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

    switchToStyle(style) {
      this.curSelector = style.selector;
      const regex = /\[([^\]\s]*)\]/g;
      const styleArr = [];
      let match;
      while ((match = regex.exec(style.hierarchy)) !== null)
        styleArr.push(match[1]);
      if (styleArr.length !== 2) return;
      this.selectedStyle = styleArr;
      if (this.curStyle === undefined || this.curStyle.attrList === undefined)
        return;

      this.$nextTick(() => {
        for (let i = 0; i < this.curStyle.attrList.length; i++) {
          const attr = this.curStyle.attrList[i];
          const key = attr.variable.startsWith("@")
            ? attr.variable.substring(1)
            : attr.variable;
          if (style.cssData !== undefined && style.cssData.hasOwnProperty(key))
            attr.value = style.cssData[key];
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
@import url(../../../styles/hr-style.css);
@import url(index.less);

.container {
  position: absolute;
  left: 0;
  right: 00;
  bottom: 0;
  top: 0;
  overflow: auto;
  display: flex;
  flex-flow: column nowrap;
}

.style-list {
  position: relative;
  overflow: auto;
  padding: 0 20px 0 20px;
}

.style-css {
  position: relative;
  overflow: auto;
  padding: 20px;
  padding-top: 0;
  height: 100%;
  display: flex;
  flex: 1;
  flex-flow: column nowrap;
}

.style-css::-webkit-scrollbar {
  width: 5px;
  background-color: rgba(122, 122, 122, 0.3);
}

.style-css::-webkit-scrollbar-track {
  background-color: transparent;
}

.style-css::-webkit-scrollbar-thumb {
  background: rgba(122, 122, 122, 1);
  border-radius: 15px;
}

.style-item {
  margin-top: 8px;
  height: 100%;
  max-height: 100%;
  flex: 1;
}

.footer {
  /*
    position: absolute;
    bottom: 0.5rem;
    left: 0;
    right: 0;
    margin: 0 auto; */

  position: relative;
  padding: 10px 20px 20px 20px;
  display: flex;
  justify-content: center;

  & button {
  }
}

/deep/ .el-form-item__label {
}

.el-tag + .el-tag {
  margin-left: 10px;
}

.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}

.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}

/* 有弹框时的弹框样式 */
.show-popper.el-popover {
  padding: 0 !important;
  background: transparent !important;
  border: none;
  box-shadow: 0 0 15px #faab3d;
}

/* 无弹框时直接隐藏 */
.hide-popper {
  display: none;
}

.add-selector {
  display: inline-block;
  width: 30px;
  background-color: #faab3d;
  margin-left: 10px;
  border-radius: 6px;
  border-width: 0;

  &:hover {
    cursor: pointer;
  }
}
</style>
