<!-- TODO: 这个页面后续将用 JSX 重构 -->
<template>
  <div class="container">
    <ChartOptionEditor :option="optA" />
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
import ChartOptionEditor from './ChartOptionEditor';

export default {
  components: { ChartOptionEditor },
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
      optA: {
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            data: [150, 230, 224, 218, 135, 147, 260],
            type: 'line',
          },
          {
            data: [153, 230, 224, 218, 135, 147, 260],
            type: 'bar',
          },
        ],
      },
      optB: {
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            data: [
              120,
              {
                value: 200,
                itemStyle: {
                  color: '#a90000',
                },
              },
              150,
              80,
              70,
              110,
              130,
            ],
            type: 'bar',
          },
        ],
      },
    };
  },
  computed: {
    ...mapState(['canvasName']),
    addedStyleTags() {
      if (this.curComponent.styleList == null || this.curComponent.styleList.length === 0) return [];
      return this.curComponent.styleList;
    },
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

        if (match === null) {
          console.log('样式路径444', styleValue);
        } else {
          match.forEach(placeholder => {
            const key = placeholder.substring(1);
            styleValue = styleValue.replaceAll(placeholder, cssData[key]);
          });
        }
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

    contentChange(text) {
      console.log('text', text);
    },

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
  },
};
</script>

<style lang="less" scoped>
@import url(../../../styles/hr-style.css);
@import url(index.less);
</style>
