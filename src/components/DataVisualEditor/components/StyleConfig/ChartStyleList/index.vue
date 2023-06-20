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
              <img src="@/assets/setting.png" alt="" srcset="" width="18px" style="vertical-align: middle" />
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

          <el-form-item label="选项" slot="reference">
            <div style="width: 100%; min-width: 100%; display: flex">
              <el-cascader v-model="selectedStyle" :options="styleList" @change="handleStyleChange" clearable>
              </el-cascader>
              <button class="set-style" v-if="false">
                <img src="@/assets/setting.png" alt="" srcset="" width="18px" style="vertical-align: middle" />
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
            <el-collapse-item title="已应用样式" name="1" v-if="false">
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

            <el-collapse-item title="设置" name="2">
              <div style="display: flex; flex-flow: column nowrap">
                <el-form-item
                  v-for="({ label, variable, type, options }, index) in curStyle.attrList"
                  :key="index + '-' + type"
                  :label="label || variable"
                >
                  <span slot="label">
                    <span>
                      <span>{{ label }}</span>

                      <template v-for="(icon, iconIndex) in options.iconList">
                        <el-button
                          class="array-icon"
                          :key="iconIndex"
                          type="primary"
                          :icon="icon.icon"
                          size="mini"
                          style="transform: scale(0.65)"
                          v-if="icon.show !== false"
                          circle
                          @click="
                            () => {
                              onStyleAttrEvent([...icon['onClick']], {
                                variable: variable,
                                type: type,
                                attrIndex: index,
                                attr: curStyle.attrList[index],
                                style: curStyle,
                              });
                            }
                          "
                        ></el-button>
                      </template>

                      <!-- <el-button class="array-icon" type="primary" icon="el-icon-plus" size="mini"
                      style="transform: scale(0.6) translateX(-20px);" circle @click="test2"
                       v-if="true"></el-button> -->
                    </span>
                  </span>

                  <div v-if="type === 'color-picker'">
                    <div
                      v-if="options.gradientType === 'linear'"
                      style="display: flex; width: 100%; position: relative; flex-flow: column nowrap"
                    >
                      <div style="display: flex; justify-content: center">起止位置</div>

                      <div style="flex: 1; width: 100%; display: flex; flex-flow: row nowrap; justify-content: center">
                        <span style="margin-left: 8px">右</span>
                        <span style="margin-left: 10px">
                          <el-input-number
                            v-model.number="curStyle.attrList[index].options.value.x"
                            type="number"
                            :min="0"
                            :max="1"
                            :step="0.1"
                        /></span>
                      </div>

                      <div
                        style="
                          flex: 1;
                          width: 100%;
                          display: flex;
                          flex-flow: row nowrap;
                          justify-content: center;
                          margin-top: 6px;
                        "
                      >
                        <span style="margin-left: 8px">下</span>
                        <span style="margin-left: 10px">
                          <el-input-number
                            v-model.number="curStyle.attrList[index].options.value.y"
                            type="number"
                            :min="0"
                            :max="1"
                            :step="0.1"
                        /></span>
                      </div>

                      <div
                        style="
                          flex: 1;
                          width: 100%;
                          display: flex;
                          flex-flow: row nowrap;
                          justify-content: center;
                          margin-top: 6px;
                        "
                      >
                        <span style="margin-left: 8px">左</span>
                        <span style="margin-left: 10px">
                          <el-input-number
                            v-model.number="curStyle.attrList[index].options.value.x2"
                            type="number"
                            :min="0"
                            :max="1"
                            :step="0.1"
                        /></span>
                      </div>

                      <div
                        style="
                          flex: 1;
                          width: 100%;
                          display: flex;
                          flex-flow: row nowrap;
                          justify-content: center;
                          margin-top: 6px;
                        "
                      >
                        <span style="margin-left: 8px">上</span>
                        <span style="margin-left: 10px">
                          <el-input-number
                            v-model.number="curStyle.attrList[index].options.value.y2"
                            type="number"
                            :min="0"
                            :max="1"
                            :step="0.1"
                        /></span>
                      </div>

                      <div>渐变过程</div>

                      <div
                        style="
                          flex: 1;
                          width: 100%;
                          display: flex;
                          flex-flow: row nowrap;
                          justify-content: center;
                          align-items: center;
                          margin-top: 6px;
                        "
                        v-for="item in curStyle.attrList[index].options.value.colorStops"
                      >
                        <div style="display: flex; justify-content: center">
                          <span style="margin-left: 10px">
                            <el-input-number v-model.number="item.offset" type="number" :min="0" :max="1" :step="0.1"
                          /></span>

                          <span style="margin-left: 10px">
                            <el-color-picker v-model="item.color" :showAlpha="true"> </el-color-picker>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div
                      v-else-if="options.gradientType === 'radial'"
                      style="display: flex; width: 100%; position: relative; flex-flow: column nowrap"
                    >
                      辐射状的渐变
                    </div>

                    <el-color-picker v-else v-model="curStyle.attrList[index].value" :showAlpha="options.showAlpha">
                    </el-color-picker>
                  </div>

                  <div
                    v-else-if="type === 'text'"
                    style="display: flex; width: 100%; position: relative"
                    class="form-item-input"
                  >
                    <el-input
                      v-model="curStyle.attrList[index].value"
                      @change="
                        (val, old) => {
                          onStyleAttrEvent([...options['onChange']], {
                            attrIndex: index,
                            attr: curStyle.attrList[index],
                            style: curStyle,
                            eventData: { val, old },
                          });
                        }
                      "
                      @input="
                        (val, old) => {
                          onStyleAttrEvent([...options['onInput']], {
                            attrIndex: index,
                            attr: curStyle.attrList[index],
                            style: curStyle,
                            eventData: { val, old },
                          });
                        }
                      "
                    />
                  </div>

                  <div v-else-if="type === 'number'" style="display: flex; width: 100%; position: relative">
                    <el-input v-model.number="curStyle.attrList[index].value" type="number" />
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
                    v-show="options.show === false ? false : true"
                    style="display: flex; width: 100%; position: relative"
                  >
                    <!--  oninput="value=value.replace(/[^0-9]/g,'')"     :max="options.max !== undefined ? options.max : 99999"-->
                    <el-input-number
                      v-model.number="curStyle.attrList[index].value"
                      :min="options.min !== undefined ? options.min : -999999999"
                      :max="options.max !== undefined ? options.max : 999999999"
                      :step="options.step !== undefined ? options.step : 1"
                      type="number"
                      @change="
                        (val, old) => {
                          onStyleAttrEvent([...options['onChange']], {
                            attrIndex: index,
                            attr: curStyle.attrList[index],
                            style: curStyle,
                            eventData: { val, old },
                          });
                        }
                      "
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
                    <el-select v-model="curStyle.attrList[index].value" placeholder="">
                      <el-option
                        v-for="item in options.options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                  </div>

                  <div v-else-if="type === 'string[]'">
                    <div v-for="(item, itemIndex) in curStyle.attrList[index].value">
                      <el-input
                        v-model="curStyle.attrList[index].value[itemIndex]"
                        :type="type === 'string[]' ? 'text' : 'number'"
                        @focus="
                          () => {
                            onStyleAttrEvent([...options['onFocus']], {
                              attrIndex: index,
                              attr: curStyle.attrList[index],
                              style: curStyle,
                              itemIndex: itemIndex,
                            });
                          }
                        "
                      />
                    </div>
                  </div>

                  <div v-else-if="type === 'number[]' || type === 'integer[]'">
                    <div
                      v-for="(item, itemIndex) in curStyle.attrList[index].value"
                      style="display: flex; width: 100%; position: relative"
                    >
                      <el-input-number
                        v-model.number="curStyle.attrList[index].value[itemIndex]"
                        :step="1"
                        type="number"
                      />
                    </div>
                  </div>

                  <div v-else-if="type === 'checkbox'">
                    <el-checkbox v-model="curStyle.attrList[index].value"></el-checkbox>
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

    <div class="footer" v-if="false">
      <!-- 自动替换变量, 自动循环 -->
      <el-button @click="addStyle">应用</el-button>
    </div>
  </div>
</template>

<script>
/*
  todo: css支持 for if 变量
  */

import { mapState } from 'vuex';
import Vue from 'vue';
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
} from '@/components/DataVisualEditor/utils/style';
import * as DB from '@/components/DataVisualEditor/utils/indexDB';
const toStyleString = require('to-style').string;
const toStyleObject = require('to-style').object;
import { toCSS, toJSON } from 'cssjson';
import { strToBase64, isArrayInclude, removeWhitespace } from '@/components/DataVisualEditor/utils/utils';
import deepClone from 'deep-clone';
import StyleBase from '../StyleBase';
import axios from 'axios';
import eventBus from '../../../utils/eventBus';
import { CRUD } from '../../../utils/chartUtils';

export default {
  components: {},
  extends: StyleBase,
  data() {
    return {
      excludes: ['Group'], // 这些组件不显示内容
      content: '',
      selectKey: ['textAlign', 'borderStyle', 'verticalAlign'],
      styleData,
      inputVisible: false,
      inputValue: '',
      cssActiveCollapses: ['1', '2'],
    };
  },
  computed: {
    ...mapState(['canvasName']),
    addedStyleTags() {
      if (this.curComponent.styleList == null || this.curComponent.styleList.length === 0) return [];
      return this.curComponent.styleList;
    },
  },
  beforeCreate(){

  },
  mounted() {


  },
  methods: {
    generateStyleId,

    addStyle() {
      // todo 对比新旧数据,未修改时不要修改

      const style = this.curStyle;
      const component = this.curComponent;
      if (style.css == null || style.css.trim().length === 0) {
        console.warn('请选择样式');
        return;
      }

      const styleArr = this.getHierarchy(style.hierarchy);

      const key = 'styleList:' + this.curComponent.component;
      let menuName = '';
      for (let i = 0; i < styleArr.length; i++) {
        for (let j = 0; j < this.styleMap[key].length; j++) {
          if (this.styleMap[key][j].value === styleArr[i]) {
            menuName += `${this.styleMap[key][j].label}`;
            break;
          }
        }
        if (menuName.trim() !== '') break;
      }

      const cssData = {};
      this.curStyle.attrList.forEach(attr => {
        let attrKey = '';
        const variable = attr.variable.trim();
        !variable.startsWith('@') ? (attrKey = variable) : (attrKey = variable.substring(1));
        cssData[attrKey] = attr.value;
      });

      let styleValue = this.curStyle.value;
      if (styleValue.includes('@')) {
        const regex = /@\w+(?=[\x20\].])/g;
        const match = styleValue.match(regex); // ['@index', '@aaindex']
        match.forEach(placeholder => {
          const key = placeholder.substring(1);
          styleValue = styleValue.replaceAll(placeholder, cssData[key]);
        });
      }

      const styleId = removeWhitespace(
        this.canvasName +
          '-' +
          component.id +
          '-' +
          styleArr[0] + // 父样式
          '-' +
          styleValue
      );

      // 删除已存在的样式
      const newData = {
        styleId: styleId,
        styleName: `[${menuName}][${this.curStyle.label}]`,
        cssData: cssData,
        css: style.css,
        hierarchy: this.curStyle.hierarchy,
        attributePath: removeWhitespace(styleValue),
        type: this.curStyle.type,
      };
      for (let i = 0; i < component.styleList.length; i++) {
        const style = component.styleList[i];
        if (style.styleId === styleId) {
          // this.curComponent.styleList.splice(i, 1);

          // todo 给修改的样式标签一个动画,并高亮显示当前标签
          const oldData = deepClone(this.curComponent.styleList[i]);
          this.$set(this.curComponent.styleList, i, newData);
          eventBus.$emit('onOptionChange', this.curComponent.data.name, CRUD.update, newData, oldData);
          return;
        }
      }

      this.curComponent.styleList.push(newData);
      eventBus.$emit('onOptionChange', this.curComponent.data.name, CRUD.create, newData, undefined);
    },

    contentChange(text) {},

    showAttr(curComponent, key) {
      if (curComponent == null) return false;
      if (curComponent.attrExcludes == null) return true;
      return !curComponent.attrExcludes.includes(key);
    },

    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
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
      this.inputValue = '';
    },

    testAAA2() {
      alert('aaa222');
    },
  },
};
</script>

<style lang="less" scoped>
@import url(../../../styles/hr-style.css);
@import url(index.less);
</style>
