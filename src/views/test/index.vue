<template>
  <div class="container" id="test222">
    <MobilePreview />

    <button @click="testpz()">测试拍照</button>

    <div id="test">
      <!-- <div></div>
                              <div></div> -->
    </div>

    <div
      id="imgtest"
      style="width: 100%; background-color: blue; height: 900px; color: white"
    ></div>
  </div>
</template>

<!--  src="http://192.168.0.107:99/map5/earth.min.js" -->

<script>
import MobilePreview from "@/components/DataVisualEditor/components/MobilePreview";
import CssEditor from "@/components/DataVisualEditor/components/CssEditor";
import { getRandStr } from "@/components/DataVisualEditor/utils/utils";
import {
  addStyleToHead,
  removeStyleById,
  deleteSelectorForStyle,
  addSelectorToStyle,
  getCssStr,
  getCssStr2,
  getStyleSelectorStr,
  cssTab,
  compressCssStrWhitespace,
  parseCssExpressions,
} from "@/components/DataVisualEditor/utils/style";

const fontFamilyOpts = [
  {
    value: "宋体",
    label: "宋体",
  },
  {
    value: "FangSong",
    label: "仿宋",
  },
  {
    value: "黑体",
    label: "黑体",
  },
  {
    value: "楷体",
    label: "楷体",
  },
  {
    value: "等线",
    label: "等线",
  },
  {
    value: "monospace",
    label: "等宽",
  },
  {
    value: "微软雅黑",
    label: "微软雅黑",
  },
  {
    value: "隶书",
    label: "隶书",
  },
];

export default {
  components: { CssEditor, MobilePreview },
  name: "test",
  data() {
    return {
      data: {
        text2: "aa",
        uniqueId: "",
        component: "v-text",
        label: "文字",
        icon: "wenben",
        CssA: 1,
        CssB: 2,
        CssC: 3,
        CssD: 4,
        data: {
          text: "文本",
          id: getRandStr().toLowerCase(),
        },
        attrExcludes: [],
        style: {
          width: 211,
          height: 22,
          fontSize: 14,
          fontStyle: 2500,
          fontWeight: 2500,
          borderRadius: 0,
          lineHeight: "",
          letterSpacing: 0,
          textAlign: "",
          color: "rgba(0, 0, 0, 1)",
          backgroundColor: "rgba(0,0,0,0)",
          fontFamily: "宋体",
        },
        styleUnit: {
          top: "px",
          left: "px",
          width: "px",
          height: "px",
          fontSize: "px",
        },
        attrList: [
          {
            key: "id",
            type: "text",
            label: "id",
            events: {
              onInput: function (self, value) {},
            },
            bind: "data",
          },
          {
            key: "left",
            type: "number",
            label: "x 坐标",
            bind: "style",
            events: {
              onInput: function (self, value) {},
            },
          },
          {
            key: "top",
            type: "number",
            label: "y 坐标",
            bind: "style",
            events: {
              onInput: function (self, value) {},
            },
          },
          {
            key: "width",
            type: "number",
            label: "宽",
            bind: "style",
            events: {
              onInput: function (self, value) {},
            },
          },
          {
            key: "rotate",
            type: "number",
            label: "旋转",
            bind: "style",
            events: {
              onInput: function (self, value) {},
            },
          },
          {
            key: "color",
            type: "color-picker",
            label: "颜色",
            bind: "style",
            options: {
              showAlpha: false,
            },
          },
          {
            key: "backgroundColor",
            type: "color-picker",
            label: "背景色",
            bind: "style",
            options: {
              showAlpha: true,
            },
          },
          {
            key: "borderRadius",
            type: "number",
            label: "边框半径",
            bind: "style",
          },
          {
            key: "fontSize",
            type: "number",
            label: "字体大小",
            bind: "style",
          },
          {
            key: "fontWeight",
            type: "number",
            label: "字体粗细",
            bind: "style",
          },
          {
            key: "lineHeight",
            type: "number",
            label: "行高",
            bind: "style",
          },
          {
            key: "letterSpacing",
            type: "number",
            label: "字间距",
            bind: "style",
          },
          {
            key: "textAlign",
            type: "select",
            label: "左右对齐",
            bind: "style",
            options: [
              {
                label: "左对齐",
                value: "left",
              },
              {
                label: "居中",
                value: "center",
              },
              {
                label: "右对齐",
                value: "right",
              },
            ],
          },
          {
            key: "opacity",
            type: "number",
            label: "透明度",
            bind: "style",
          },
          {
            key: "fontFamily",
            type: "select",
            label: "字体",
            options: fontFamilyOpts,
            bind: "style",
          },
          {
            key: "text",
            type: "textarea",
            label: "文本",
            bind: "data",
          },
        ],
        styleList: [],
        video: null,
        canvas: null,
        camera: null,
      },
    };
  },
  created() {},
  mounted() {
    function formatCssStr(cssStr) {}
  },
  watch: {
    $route: {
      handler: function (route) {},
      immediate: true,
    },
  },
  methods: {
    testpz() {},
  },
};
</script>

<style lang="less" scoped>
@import url(./index.less);

.container {
  width: 100vw;
  height: 100vh;
  overflow: auto;
}

#test {
  width: 70%;
  height: 500px;
  /* overflow: auto; */
  /* display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    */
  background-color: antiquewhite;
}

/* #test>div {
    position: absolute;
    background-color: aqua;
    width: 300px;
    height: 300px;
  } */
</style>
