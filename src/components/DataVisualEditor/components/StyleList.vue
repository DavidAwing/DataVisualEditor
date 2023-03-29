<!-- TODO: 这个页面后续将用 JSX 重构 -->
<template>
  <div class="root">
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
                :key="selector.label || selector"
                :label="selector.label || selector"
                :value="selector.value || selector"
              >
              </el-option>
            </el-select>
            <button class="add-selector">+</button>
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
          :disabled="showStyleImg"
        >
          <el-image :src="curStyle.img" lazy>
            <div slot="placeholder" class="image-slot">
              css效果加载中<span class="dot">...</span>
            </div>
          </el-image>
          <el-form-item label="样式" slot="reference">
            <el-cascader
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
                  :key="selector.label || selector"
                  :label="selector.label || selector"
                  :value="selector.value || selector"
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

          <hr class="hr-edge-weak" style="margin-top: 6px" v-if="false" />

          <el-popover
            placement="left"
            title=""
            width="300"
            trigger="hover"
            :disabled="showStyleImg"
            v-if="false"
          >
            <el-image :src="curStyle.img" lazy>
              <div slot="placeholder" class="image-slot">
                css效果加载中<span class="dot">...</span>
              </div>
            </el-image>
            <el-form-item label="样式" slot="reference">
              <el-cascader
                :options="styleList"
                @change="handleStyleChange"
                clearable
              ></el-cascader>
            </el-form-item>
          </el-popover>

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

            <el-collapse-item title="css & less" name="2">
              <hr
                class="hr-edge-weak"
                style="margin-top: 6px; margin-bottom: 6px"
              />

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

                <el-form-item
                  v-for="({ label, type, options }, index) in curStyle.attrList"
                  :key="index"
                  :label="label"
                >
                  <div v-if="type == 'color-picker'">
                    <el-color-picker
                      v-model="curStyle.attrList[index].value"
                      :showAlpha="options.showAlpha"
                    >
                    </el-color-picker>
                  </div>
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
} from "../utils/style";
import * as DB from "../utils/indexDB";
const toStyleString = require("to-style").string;
const toStyleObject = require("to-style").object;
import { toCSS, toJSON } from "cssjson";
import { strToBase64, isArrayInclude } from "../utils/utils";
import deepClone from "deep-clone";

export default {
  components: {},
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
    };
  },
  computed: {
    ...mapState(["canvasName"]),
    styleList() {
      const key = this.curComponent.component + ":" + "styleList";
      let styleList = this.styleMap[key];

      console.log("请求样式数据");

      if (styleList != null) return styleList;

      styleList = [
        {
          value: "table",
          label: "表格",
          children: [
            {
              type: "css",
              value: "row-color",
              label: "行颜色",
              css: `
              color: yellow;
    height: 100%;
    background-color: rgba(25, 245, 77, 0.35);
`,
              img: "",
              attrList: [],
            },
          ],
        },
      ];

      // todo 异步请求服务端的配置
      setTimeout(() => {
        // 异步请求的数据
        const getData = [
          {
            value: "text",
            label: "文本",
            children: [
              {
                type: "css",
                value: "text2f",
                label: "表达式",
                css: `
if 1 == 1 color: @color-1;
if 1 != 1 color: #ff0;`,
                img: "",
                attrList: [
                  {
                    value: "red",
                    label: "@color-1",
                    type: "color-picker",
                    options: {
                      showAlpha: false,
                    },
                  },
                ],
              },
              {
                type: "css",
                value: "text21",
                label: "红色",
                css: "color: red;",
                img: "",
                attrList: [
                  {
                    type: "color-picker",
                    value: "red",
                    label: "color",
                    options: {
                      showAlpha: false,
                    },
                  },
                ],
              },
              {
                type: "css",
                value: "text1",
                label: "红色变量1",
                css: "color: @color;background-color: @bk;",
                img: "",
                attrList: [
                  {
                    type: "color-picker",
                    value: "red",
                    label: "@color",
                    options: {
                      showAlpha: false,
                    },
                  },
                  {
                    type: "color-picker",
                    value: "red",
                    label: "@bk",
                    options: {
                      showAlpha: false,
                    },
                  },
                ],
              },
              {
                type: "css",
                value: "text3432",
                label: "红色变量1",
                css: "{color: @color; background-color: @bk;}",
                img: "",
                attrList: [
                  {
                    type: "color-picker",
                    value: "red",
                    label: "@color",
                    options: {
                      showAlpha: false,
                    },
                  },
                  {
                    type: "color-picker",
                    value: "red",
                    label: "@bk",
                    options: {
                      showAlpha: false,
                    },
                  },
                ],
              },
              {
                type: "css",
                value: "背景图片",
                label: "背景图片",
                css: "{background: url('https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fsafe-img.xhscdn.com%2Fbw1%2F3d901398-5fff-4b1b-9b39-e8d37d9ac62c%3FimageView2%2F2%2Fw%2F1080%2Fformat%2Fjpg&refer=http%3A%2F%2Fsafe-img.xhscdn.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1680678141&t=dd9e5587ee3fea5242892386575786c5');}",
                img: "",
                attrList: [],
              },
              {
                type: "css",
                value: "text2",
                label: "AA测试异常",
                css: `
color: #00ffff;

background-image: -webkit-linear-gradient(bottom, @color-1, #b6f4fc, white);

-webkit-background-clip: text;

background-clip: text

-webkit-text-fill-color: transparent
`,
                img: "",
                attrList: [
                  {
                    key: "color-1",
                    value: "red",
                    type: "color-picker",
                    options: {
                      showAlpha: false,
                    },
                  },
                ],
              },
              {
                type: "css",
                value: "text3",
                label: "测试异常的",
                css: `
          text-shadow: 1px 0px 3px orange, 2px 1px 3px red, -2px 0px 7px yellow



font-size: 1.5em;
`,
                img: "",
                attrList: [],
              },
            ],
          },
        ];

        Vue.set(this.styleMap, key, styleList.concat(getData));
      }, 500);

      return styleList;
    },
    selectorList() {
      const key = this.curComponent.component + ":" + "selectorList";
      let selectorList = this.styleMap[key];

      if (selectorList != null) return selectorList;

      selectorList = this.curComponent.selectorList;

      // todo 异步请求服务端的配置
      setTimeout(() => {
        // 异步请求的数据
        const getData = [
          {
            label: "奇数行颜色2",
            value: ".el-table tbody tr:nth-child(odd) .el-table__cell",
          },
        ];

        Vue.set(this.styleMap, key, selectorList.concat(getData));
      }, 500);

      return selectorList;
    },
    curComponent() {
      // const defaultSelector = this.$store.state.curComponent.selectorList[0]
      // this.curSelector = defaultSelector.value || defaultSelector
      return this.$store.state.curComponent;
    },
    showStyleImg() {
      return JSON.stringify(this.curStyle) === "{}";
    },
    addedStyleTags() {
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
      handler: function (val, old) {
        console.log("当前样式变化", val);
      },
      deep: true,
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

      if (this.curStyle.type === "css") {
        if (
          this.curStyle.css == null ||
          this.curStyle.css.trim().length === 0
        ) {
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
          const label = attr.label.trim();
          !label.startsWith("@")
            ? (attrKey = label)
            : (attrKey = label.substring(1));
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
          });
        }

        addStyleListToHead(this.curComponent, this.canvasName);
      } else {
        console.warn(`样式类型错误`, this.curStyle);
      }
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
      console.log("todo:点击样式切换至", style);
    },
  },
};
</script>

<style lang="less" scoped>
@import url(../styles/hr-style.css);
@import url(StyleList.less);

.root {
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

  padding: 10px 20px 10px 20px;
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
