import { getRandStr } from '../utils/utils'
import Vue from 'vue'

// 公共样式
export const commonStyle = {
  rotate: 0,
  opacity: 1,
}

export const commonAttr = {
  animations: [],
  events: {},
  groupStyle: {}, // 当一个组件成为 Group 的子组件时使用
  isLock: false, // 是否锁定组件
}

const fontFamilyOpts = [
  {
    value: '宋体',
    label: '宋体'
  },
  {
    value: 'FangSong',
    label: '仿宋'
  },
  {
    value: '黑体',
    label: '黑体'
  },
  {
    value: '楷体',
    label: '楷体'
  },
  {
    value: '等线',
    label: '等线'
  },
  {
    value: 'monospace',
    label: '等宽'
  },
  {
    value: '微软雅黑',
    label: '微软雅黑'
  },
  {
    value: '隶书',
    label: '隶书'
  },
]

const textStyleList = [
  {
    value: 'text',
    label: '文字',
    children: [
      {
        type: 'css',
        value: 'text1',
        label: '红色1',
        style: "{color: @color;}",
        img: "",
        attrList: [
          {
            type: "color-picker",
            key: 'color',
            value: 'red',
            options: {
              showAlpha: false
            }
          }
        ]
      },
      {
        type: 'css',
        value: 'text2',
        label: '渐变',
        style: `{
color: #00ffff;
background-image: -webkit-linear-gradient(bottom, @color-1, #b6f4fc, white);
-webkit-background-clip: text;
background-clip: text;
-webkit-text-fill-color: transparent;
}`,
        img: "",
        attrList: [
          {
            key: "color-1",
            value: 'red',
            type: "color-picker"
          }]
      },
      {
        type: 'css',
        value: 'text3',
        label: '发光',
        activeClassList: [],
        style: `{
                  text-shadow: 1px 0px 3px orange, 2px 1px 3px red, -2px 0px 7px yellow;
font-size: 1.5em;
}`,
        img: "",
        attrList: []
      },
    ]
  },
  {
    value: 'border',
    label: '边框',
    children: [
      {
        type: 'css',
        value: 'fg',
        label: '效果1',
        activeClassList: [],
        style: "{color: red;}",
        img: "",
        attrList: []
      }
    ]
  },
  {
    value: 'image',
    label: '图片',
    children: [
      {
        type: 'css',
        value: 'fg2',
        label: '效果2',
        activeClassList: [],
        style: "{color: red;}",
        img: "",
        attrList: []
      }
    ]
  }
]

// 编辑器左侧组件列表
const list = [
  // 文字
  {
    uniqueId: '',
    component: 'v-text',
    label: '文字',
    icon: 'wenben',
    data: {
      text: "请输入文本...",
      verticalAlign: "",
      writingMode: "horizontal",
      show: true,
      isAlign: true
    },
    attrExcludes: [],
    style: {
      width: 211,
      height: 22,
      fontSize: 14,
      fontStyle: 2500,
      fontWeight: 2500,
      borderRadius: 0,
      lineHeight: '',
      letterSpacing: 0,
      left: 0,
      textAlign: '',
      color: 'rgba(0, 0, 0, 1)',
      backgroundColor: 'rgba(0,0,0,0)',
      fontFamily: '宋体'
    },
    styleUnit: {
      top: "px",
      left: "px",
      width: 'px',
      height: 'px',
      fontSize: 'px',
    },
    attrList: [
      {
        key: "name",
        type: "text",
        label: '名称',
        bind: "data"
      },
      {
        key: "show",
        type: "checkbox",
        label: '显示',
        bind: "data"
      },
      {
        key: "isAlign",
        type: "checkbox",
        label: '对齐',
        bind: 'data'
      },
      {
        key: "left",
        type: "number",
        label: 'x 坐标',
        bind: "style"
      },
      {
        key: "top",
        type: "number",
        label: 'y 坐标',
        bind: "style"
      },
      {
        key: "width",
        type: "number",
        label: '宽',
        bind: "style"
      },
      {
        key: "height",
        type: "number",
        label: '高',
        bind: "style"
      },
      {
        key: "rotate",
        type: "number",
        label: '旋转',
        bind: "style"
      },
      {
        key: "color",
        type: "color-picker",
        label: '颜色',
        bind: 'style',
        options: {
          showAlpha: false
        }
      },
      {
        key: "backgroundColor",
        type: "color-picker",
        label: '背景色',
        bind: 'style',
        options: {
          showAlpha: false
        }
      },
      {
        key: "borderRadius",
        type: "number",
        label: '边框半径',
        bind: 'style'
      },
      {
        key: "fontSize",
        type: "number",
        label: '字体大小',
        bind: 'style'
      },
      {
        key: "fontWeight",
        type: "number",
        label: '字体粗细',
        bind: 'style'
      },
      {
        key: "lineHeight",
        type: "number",
        label: '行高',
        bind: 'style'
      },
      {
        key: "letterSpacing",
        type: "number",
        label: '字间距',
        bind: 'style'
      },
      {
        key: "writingMode",
        type: "select",
        label: '文字排列',
        bind: 'data',
        options: [
          {
            label: '水平',
            value: 'horizontal'
          },
          {
            label: '垂直',
            value: 'vertical'
          }
        ]
      },
      {
        key: "textAlign",
        type: "select",
        label: '左右对齐',
        bind: 'style',
        options: [
          {
            label: '左对齐',
            value: 'left'
          },
          {
            label: '居中',
            value: 'center',
          },
          {
            label: '右对齐',
            value: 'right',
          }
        ]
      },
      {
        key: "verticalAlign",
        type: "select",
        label: '垂直对齐',
        bind: 'data',
        options: [
          {
            label: '上对齐',
            value: 'top'
          },
          {
            label: '居中',
            value: 'middle',
          },
          {
            label: '下对齐',
            value: 'bottom',
          }
        ]
      },
      {
        key: "opacity",
        type: "number",
        label: '透明度',
        bind: 'style'
      },
      {
        key: "fontFamily",
        type: "select",
        label: '字体',
        options: fontFamilyOpts,
        bind: 'style'
      },
      {
        key: "text",
        type: "textarea",
        label: '文本',
        bind: "data"
      }
    ],
    events: {

      onBeforeCreate: (self, caller) => {

        console.log("生命周期组件onBeforeCreate-self", self);
        console.log("生命周期组件onBeforeCreate-caller", caller);

        // return new Promise((resolve, reject) => {
        //   setTimeout(() => {
        //     console.log("更新之前2");
        //     caller.$set(self.styleList, 0, {
        //       value: 'border',
        //       label: '边框',
        //       children: [
        //         {
        //           type: 'css',
        //           value: 'fg',
        //           label: '效果1',
        //           activeClassList: [],
        //           style: "{color: red;}",
        //           img: "",
        //           attrList: []
        //         }
        //       ]
        //     })
        //     // self.styleList = textStyleList
        //     resolve()
        //   }, 5000);
        // })

      },

      onMounted: (self, caller) => {

        console.log("生命周期组件onMounted-self", self);
        console.log("生命周期组件onMounted-caller", caller);

        // return new Promise((resolve, reject) => {
        //   setTimeout(() => {
        //     console.log("更新之前2");
        //     caller.$set(self.styleList, 0, {
        //       value: 'border',
        //       label: '边框',
        //       children: [
        //         {
        //           type: 'css',
        //           value: 'fg',
        //           label: '效果1',
        //           activeClassList: [],
        //           style: "{color: red;}",
        //           img: "",
        //           attrList: []
        //         }
        //       ]
        //     })
        //     // self.styleList = textStyleList
        //     resolve()
        //   }, 5000);
        // })

      },

      /**
       *
       * @param {*} self 当前的组件配置
       * @param {*} caller 调用者
       * @param {*} newData 新数据
       * @param {*} oldData 旧数据
       */
      onBeforeDataChange: (self, caller, newData, oldData) => {

        console.log("数据已经改变1111111");

      },
      onAfterDataChange: (self, caller, newData, oldData) => {

        console.log("数据已经改变222222222");

      }
    },
    styleList: //todo: 从后台读取组件支持的样式列表
      [
        // {
        //   elementId: "",
        //   selector: "",
        //   styleName: "",
        //   css: ""
        // }
      ]
  },
  // 组件容器
  {
    uniqueId: '',
    component: 'v-text',
    label: '容器',
    icon: 'wenben',
    data: {
      text: "文本222",
      verticalAlign: "",
      writingMode: "horizontal",
      show: true,
      isAlign: true
    },
    attrExcludes: [],
    style: {
      width: 211,
      height: 22,
      fontSize: 14,
      fontStyle: 2500,
      fontWeight: 2500,
      borderRadius: 0,
      lineHeight: '',
      letterSpacing: 0,
      left: 0,
      textAlign: '',
      color: 'rgba(0, 0, 0, 1)',
      backgroundColor: 'rgba(0,0,0,0)',
      fontFamily: '宋体'
    },
    styleUnit: {
      top: "px",
      left: "px",
      width: 'px',
      height: 'px',
      fontSize: 'px',
    },
    attrList: [
      {
        key: "name",
        type: "text",
        label: '名称',
        bind: "data"
      },
      {
        key: "show",
        type: "checkbox",
        label: '显示',
        bind: 'data'
      },
      {
        key: "isAlign",
        type: "checkbox",
        label: '对齐',
        bind: 'data'
      },
      {
        key: "left",
        type: "number",
        label: 'x 坐标',
        bind: "style"
      },
      {
        key: "top",
        type: "number",
        label: 'y 坐标',
        bind: "style"
      },
      {
        key: "width",
        type: "number",
        label: '宽',
        bind: "style"
      },
      {
        key: "rotate",
        type: "number",
        label: '旋转',
        bind: "style"
      },
      {
        key: "color",
        type: "color-picker",
        label: '颜色',
        bind: 'style',
        options: {
          showAlpha: false
        }
      },
      {
        key: "backgroundColor",
        type: "color-picker",
        label: '背景色',
        bind: 'style',
        options: {
          showAlpha: false
        }
      },
      {
        key: "borderRadius",
        type: "number",
        label: '边框半径',
        bind: 'style'
      },
      {
        key: "fontSize",
        type: "number",
        label: '字体大小',
        bind: 'style'
      },
      {
        key: "fontWeight",
        type: "number",
        label: '字体粗细',
        bind: 'style'
      },
      {
        key: "lineHeight",
        type: "number",
        label: '行高',
        bind: 'style'
      },
      {
        key: "letterSpacing",
        type: "number",
        label: '字间距',
        bind: 'style'
      },
      {
        key: "writingMode",
        type: "select",
        label: '文字排列',
        bind: 'data',
        options: [
          {
            label: '水平',
            value: 'horizontal'
          },
          {
            label: '垂直',
            value: 'vertical'
          }
        ]
      },
      {
        key: "textAlign",
        type: "select",
        label: '左右对齐',
        bind: 'style',
        options: [
          {
            label: '左对齐',
            value: 'left'
          },
          {
            label: '居中',
            value: 'center',
          },
          {
            label: '右对齐',
            value: 'right',
          }
        ]
      },
      {
        key: "verticalAlign",
        type: "select",
        label: '垂直对齐',
        bind: 'data',
        options: [
          {
            label: '上对齐',
            value: 'top'
          },
          {
            label: '居中',
            value: 'middle',
          },
          {
            label: '下对齐',
            value: 'bottom',
          }
        ]
      },
      {
        key: "opacity",
        type: "number",
        label: '透明度',
        bind: 'style'
      },
      {
        key: "fontFamily",
        type: "select",
        label: '字体',
        options: fontFamilyOpts,
        bind: 'style'
      },
      {
        key: "text",
        type: "textarea",
        label: '文本',
        bind: "data"
      }
    ],
    events: {

      onBeforeCreate: (self, caller) => {

        console.log("生命周期组件onBeforeCreate-self", self);
        console.log("生命周期组件onBeforeCreate-caller", caller);

        // return new Promise((resolve, reject) => {
        //   setTimeout(() => {
        //     console.log("更新之前2");
        //     caller.$set(self.styleList, 0, {
        //       value: 'border',
        //       label: '边框',
        //       children: [
        //         {
        //           type: 'css',
        //           value: 'fg',
        //           label: '效果1',
        //           activeClassList: [],
        //           style: "{color: red;}",
        //           img: "",
        //           attrList: []
        //         }
        //       ]
        //     })
        //     // self.styleList = textStyleList
        //     resolve()
        //   }, 5000);
        // })

      },

      onMounted: (self, caller) => {

        console.log("生命周期组件onMounted-self", self);
        console.log("生命周期组件onMounted-caller", caller);

        // return new Promise((resolve, reject) => {
        //   setTimeout(() => {
        //     console.log("更新之前2");
        //     caller.$set(self.styleList, 0, {
        //       value: 'border',
        //       label: '边框',
        //       children: [
        //         {
        //           type: 'css',
        //           value: 'fg',
        //           label: '效果1',
        //           activeClassList: [],
        //           style: "{color: red;}",
        //           img: "",
        //           attrList: []
        //         }
        //       ]
        //     })
        //     // self.styleList = textStyleList
        //     resolve()
        //   }, 5000);
        // })

      },

      /**
       *
       * @param {*} self 当前的组件配置
       * @param {*} caller 调用者
       * @param {*} newData 新数据
       * @param {*} oldData 旧数据
       */
      onBeforeDataChange: (self, caller, newData, oldData) => {

        console.log("数据已经改变1111111");

      },
      onAfterDataChange: (self, caller, newData, oldData) => {

        console.log("数据已经改变222222222");

      }
    },
    styleList: //todo: 从后台读取组件支持的样式列表
      [
        // {
        //   elementId: "",
        //   selector: "",
        //   styleName: "",
        //   css: ""
        // }
      ]
  },
  {
    component: 'v-button',
    label: '按钮',
    propValue: '按钮',
    icon: 'button',
    style: {
      width: 100,
      height: 34,
      borderWidth: 1,
      borderColor: '',
      borderRadius: '',
      fontSize: 14,
      fontWeight: 500,
      lineHeight: '',
      letterSpacing: 0,
      textAlign: '',
      color: 'rgba(0, 0, 0, 1)',
      backgroundColor: '',
    },
    attrList: [
      {
        key: "id",
        type: "text",
        label: 'id',
        events: {
          onInput: function (self, value) { }
        },
        bind: "data"
      },
      {
        key: "left",
        type: "number",
        label: 'x 坐标',
        bind: "style",
        events: {
          onInput: function (self, value) { }
        }
      },
      {
        key: "top",
        type: "number",
        label: 'y 坐标',
        bind: "style",
        events: {
          onInput: function (self, value) {
          }
        }
      },
      {
        key: "width",
        type: "number",
        label: '宽',
        bind: "style",
        events: {
          onInput: function (self, value) { }
        }
      },
      {
        key: "rotate",
        type: "number",
        label: '旋转',
        bind: "style",
        events: {
          onInput: function (self, value) { }
        }
      },
      {
        key: "color",
        type: "color-picker",
        label: '颜色',
        bind: 'style',
        options: {
          showAlpha: false
        }
      },
      {
        key: "backgroundColor",
        type: "color-picker",
        label: '背景色',
        bind: 'style',
        options: {
          showAlpha: true
        }
      },
      {
        key: "borderRadius",
        type: "number",
        label: '边框半径',
        bind: 'style'
      },
      {
        key: "fontSize",
        type: "number",
        label: '字体大小',
        bind: 'style'
      },
      {
        key: "fontWeight",
        type: "number",
        label: '字体粗细',
        bind: 'style'
      },
      {
        key: "lineHeight",
        type: "number",
        label: '行高',
        bind: 'style'
      },
      {
        key: "letterSpacing",
        type: "number",
        label: '字间距',
        bind: 'style'
      },
      {
        key: "textAlign",
        type: "select",
        label: '左右对齐',
        bind: 'style',
        options: [
          {
            label: '左对齐',
            value: 'left'
          },
          {
            label: '居中',
            value: 'center',
          },
          {
            label: '右对齐',
            value: 'right',
          }
        ]
      },
      {
        key: "opacity",
        type: "number",
        label: '透明度',
        bind: 'style'
      },
      {
        key: "fontFamily",
        type: "select",
        label: '字体',
        options: fontFamilyOpts,
        bind: 'style'
      },
      {
        key: "text",
        type: "text",
        label: '文本',
        bind: "data"
      }
    ]
  },
  // 图片
  {
    uniqueId: '',
    component: 'v-picture',
    label: '图片',
    icon: 'tupian',
    data: {
      name: "",
      image: require('../assets/img-default.webp'),
      fit: "scale-down",
      show: true,
      isAlign: true
    },
    attrExcludes: [],
    style: {
      width: 500,
      height: 260,
      fontSize: 14,
      fontStyle: 2500,
      fontWeight: 2500,
      borderRadius: 0,
      lineHeight: '',
      letterSpacing: 0,
      textAlign: '',
      color: 'rgba(0, 0, 0, 1)',
      backgroundColor: 'rgba(0,0,0,0)',
      fontFamily: '宋体'
    },
    styleUnit: {
      top: "px",
      left: "px",
      width: 'px',
      height: 'px',
      fontSize: 'px',
    },
    attrList: [
      {
        key: "name",
        type: "text",
        label: '名称',
        bind: "data"
      },
      {
        key: "show",
        type: "checkbox",
        label: '显示',
        bind: "data"
      },
      {
        key: "isAlign",
        type: "checkbox",
        label: '对齐',
        bind: 'data'
      },
      {
        key: "left",
        type: "number",
        label: 'x 坐标',
        bind: "style"
      },
      {
        key: "top",
        type: "number",
        label: 'y 坐标',
        bind: "style"
      },
      {
        key: "width",
        type: "number",
        label: '宽',
        bind: "style"
      },
      {
        key: "height",
        type: "number",
        label: '高',
        bind: "style"
      },
      {
        key: "rotate",
        type: "number",
        label: '旋转',
        bind: "style"
      },
      {
        key: "fit",
        type: "select",
        label: '图片适配',
        bind: 'data',
        options: [
          {
            label: 'fill',
            value: 'fill'
          },
          {
            label: 'contain',
            value: 'contain',
          },
          {
            label: 'cover',
            value: 'cover',
          },
          {
            label: 'none',
            value: 'none',
          },
          {
            label: 'scale-down',
            value: 'scale-down',
          }
        ]
      },
      {
        type: "input-file",
        label: '选择图片',
        bind: function (self, event) {
          const file = event.target.files[0]
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = function (e) {
            self.data.image = this.result
          }
        }
      },
      {
        type: "eventbus-select",
        label: '填充画布',
        bind: {
          change: "onFillCanvas",
          value: 'none',
        },
        options: [
          {
            label: 'fill',
            value: 'fill'
          },
          {
            label: 'horizontal',
            value: 'horizontal',
          },
          {
            label: 'vertical',
            value: 'vertical',
          },
          {
            label: 'none',
            value: 'none',
          }
        ]
      },
      {
        key: "borderRadius",
        type: "number",
        label: '边框半径',
        bind: 'style'
      },
      {
        key: "fontSize",
        type: "number",
        label: '字体大小',
        bind: 'style'
      },
      {
        key: "fontWeight",
        type: "number",
        label: '字体粗细',
        bind: 'style'
      },
      {
        key: "lineHeight",
        type: "number",
        label: '行高',
        bind: 'style'
      },
      {
        key: "letterSpacing",
        type: "number",
        label: '字间距',
        bind: 'style'
      },
      {
        key: "textAlign",
        type: "select",
        label: '左右对齐',
        bind: 'style',
        options: [
          {
            label: '左对齐',
            value: 'left'
          },
          {
            label: '居中',
            value: 'center',
          },
          {
            label: '右对齐',
            value: 'right',
          }
        ]
      },
      {
        key: "opacity",
        type: "number",
        label: '透明度',
        bind: 'style'
      },
      {
        key: "fontFamily",
        type: "select",
        label: '字体',
        options: fontFamilyOpts,
        bind: 'style'
      },
      {
        key: "text",
        type: "textarea",
        label: '文本',
        bind: "data"
      }
    ],
    events: {

      onBeforeCreate: (self, caller) => {
        console.log("生命周期组件onBeforeCreate-self", self);
      },

      onMounted: (self, caller) => {
        console.log("生命周期组件onMounted-self", self);
      },

      /**
       *
       * @param {*} self 当前的组件配置
       * @param {*} caller 调用者
       * @param {*} newData 新数据
       * @param {*} oldData 旧数据
       */
      onDataChange: (self, caller, newData, oldData) => {
        console.log("数据已经改变");
      }
    },
    styleList: //todo: 从后台读取组件支持的样式列表
      [
        // {
        //   elementId: "",
        //   selector: "",
        //   styleName: "",
        //   css: ""
        // }
      ]
  },
  // 矩形
  {
    component: 'v-rect-shape',
    label: '边框',
    data: {
      name: "",
      type: "dv-border-box-1",
      show: true,
      isAlign: true
    },
    icon: 'juxing',
    style: {
      width: 200,
      height: 200,
      // fontSize: 14,
      // fontWeight: 500,
      // lineHeight: '',
      // letterSpacing: 0,
      // textAlign: 'center',
      // color: 'rgba(0, 0, 0, 1)',
      // borderColor: '#000',
      // borderWidth: 1,
      // backgroundColor: '',
      // borderStyle: 'solid',
      // borderRadius: '',
      // verticalAlign: 'middle',
    },
    styleUnit: {
      top: "px",
      left: "px",
      width: 'px',
      height: 'px',
    },
    attrList: [
      {
        key: "name",
        type: "text",
        label: '名称',
        events: {

        },
        bind: "data",
        options: {

        }
      },
      {
        key: "show",
        type: "checkbox",
        label: '显示',
        bind: "data"
      },
      {
        key: "isAlign",
        type: "checkbox",
        label: '对齐',
        bind: 'data'
      },
      {
        key: "left",
        type: "number",
        label: 'x 坐标',
        bind: "style",
        events: {
          onInput: function (self, value) { }
        }
      },
      {
        key: "top",
        type: "number",
        label: 'y 坐标',
        bind: "style",
        events: {
          onInput: function (self, value) {
          }
        }
      },
      {
        key: "width",
        type: "number",
        label: '宽',
        bind: "style",
        events: {
          onInput: function (self, value) { }
        }
      },
      {
        key: "rotate",
        type: "number",
        label: '旋转',
        bind: "style",
        events: {
          onInput: function (self, value) { }
        }
      },
      {
        key: "type",
        type: "select",
        label: '边框类型',
        bind: 'data',
        options: [
          {
            label: '边框1',
            value: 'dv-border-box-1',
          },
          {
            label: '边框2',
            value: 'dv-border-box-2',
          },
          {
            label: '边框3',
            value: 'dv-border-box-3',
          },
          {
            label: '边框4',
            value: 'dv-border-box-4',
          },
          {
            label: '边框5',
            value: 'dv-border-box-5',
          },
          {
            label: '边框6',
            value: 'dv-border-box-6',
          },
          {
            label: '边框7',
            value: 'dv-border-box-7',
          },
          {
            label: '边框8',
            value: 'dv-border-box-8',
          },
          {
            label: '边框9',
            value: 'dv-border-box-9',
          },
          {
            label: '边框10',
            value: 'dv-border-box-10',
          },
          {
            label: '边框11',
            value: 'dv-border-box-11',
          },
          {
            label: '边框12',
            value: 'dv-border-box-12',
          },
          {
            label: '边框13',
            value: 'dv-border-box-13',
          }
        ]
      },
      {
        key: "color",
        type: "color-picker",
        label: '颜色',
        bind: 'style',
        options: {
          showAlpha: true
        }
      },
      {
        key: "backgroundColor",
        type: "color-picker",
        label: '背景色',
        bind: 'style',
        options: {
          showAlpha: true
        }
      },
      {
        key: "borderRadius",
        type: "number",
        label: '边框半径',
        bind: 'style'
      },
      {
        key: "opacity",
        type: "number",
        label: '透明度',
        bind: 'style'
      }
    ]
  },
  // 直线
  {
    component: 'v-line',
    label: '直线',
    propValue: {
    },
    icon: 'wenben',
    data: {
      width: 1,
      length: 100,
      color: "rgba(0, 0, 0, 1)",
      lineStyle: "solid", // dotted solid double dashed
      show: true,
      isAlign: true
    },
    attrExcludes: [],
    style: {
      width: 200,
      height: 30,
      backgroundColor: 'rgba(0,0,0,0)',
    },
    styleUnit: {
      top: "px",
      left: "px",
      width: 'px',
      height: 'px',
      fontSize: 'px',
    },
    type: "line",
    attrList: [
      {
        key: "color",
        type: "color-picker",
        label: '颜色',
        bind: 'data',
        options: {
          showAlpha: true
        }
      },
      {
        key: "width",
        type: "number",
        label: '宽度',
        bind: 'data'
      },
      {
        key: "rotate",
        type: "number",
        label: '旋转',
        bind: "style"
      },
      {
        key: "lineStyle",
        type: "select",
        label: '线条风格',
        bind: 'data',
        options: [{
          value: 'solid',
          label: 'solid'
        }, {
          value: 'dotted',
          label: 'dotted'
        }, {
          value: 'double',
          label: 'double'
        }, {
          value: 'dashed',
          label: 'dashed'
        }, {
          value: 'dotted && dashed',
          label: 'dotted && dashed'
        }, {
          value: 'double && dashed',
          label: 'double && dashed'
        }, {
          value: 'three && dashed',
          label: 'three && dashed'
        }]
      },
    ]
  },
  // 表格
  {
    uniqueId: '',
    component: 'v-table',
    label: '表格',
    icon: 'wenben',
    data: {
      name: "",
      columns: [],
      tableData: [],
      showBorder: true,
      editColumnsDialog: false,
      showMode: "roll",
      rollingSpeed: 1, // 滚动速度
      total: 0,//总条目数
      currentPage: 1,//当前页码
      pageSize: 10, //每页显示条目个数，支持 .sync 修饰符
      show: true,
      isAlign: true
    },
    attrExcludes: [],
    style: {
      width: 500,
      height: 260,
      fontSize: 14,
      fontStyle: 2500,
      fontWeight: 2500,
      borderRadius: 0,
      lineHeight: '',
      letterSpacing: 0,
      textAlign: '',
      color: 'rgba(0, 0, 0, 1)',
      backgroundColor: 'rgba(0,0,0,0)',
      fontFamily: '宋体'
    },
    styleUnit: {
      top: "px",
      left: "px",
      width: 'px',
      height: 'px',
      fontSize: 'px',
    },
    attrList: [
      {
        key: "name",
        type: "text",
        label: '名称',
        bind: 'data'
      },
      {
        key: "show",
        type: "checkbox",
        label: '显示',
        bind: "data"
      },
      {
        key: "isAlign",
        type: "checkbox",
        label: '对齐',
        bind: 'data'
      },
      {
        key: "left",
        type: "number",
        label: 'x 坐标',
        bind: "style"
      },
      {
        key: "top",
        type: "number",
        label: 'y 坐标',
        bind: "style"
      },
      {
        key: "width",
        type: "number",
        label: '宽',
        bind: "style"
      },
      {
        key: "height",
        type: "number",
        label: '高',
        bind: "style"
      },
      {
        key: "showBorder",
        type: "select",
        label: '显示边框',
        bind: 'data',
        options: [
          {
            label: '是',
            value: true
          },
          {
            label: '否',
            value: false,
          }
        ]
      },
      {
        key: "showMode",
        type: "select",
        label: '显示模式',
        bind: 'data',
        options: [
          {
            label: '滚动',
            value: "roll"
          },
          {
            label: '翻页',
            value: "flip-over",
          },
          {
            label: '分页',
            value: "paging",
          }
        ]
      },
      {
        key: "rollingSpeed",
        type: "number",
        label: '滚动速度',
        bind: "data"
      },
      {
        key: "rotate",
        type: "number",
        label: '旋转',
        bind: "style"
      },
      {
        key: "borderRadius",
        type: "number",
        label: '边框半径',
        bind: 'style'
      },
      {
        type: "eventbus-button",
        label: '',
        bind: {
          label: '编辑表头',
          click: "onEditColumns",
          dblclick: "onEditColumns"
        }
      },

    ],
    events: {

      onBeforeCreate: (self, caller) => {

        console.log("生命周期组件onBeforeCreate-self", self);
        console.log("生命周期组件onBeforeCreate-caller", caller);

        // return new Promise((resolve, reject) => {
        //   setTimeout(() => {
        //     console.log("更新之前2");
        //     caller.$set(self.styleList, 0, {
        //       value: 'border',
        //       label: '边框',
        //       children: [
        //         {
        //           type: 'css',
        //           value: 'fg',
        //           label: '效果1',
        //           activeClassList: [],
        //           style: "{color: red;}",
        //           img: "",
        //           attrList: []
        //         }
        //       ]
        //     })
        //     // self.styleList = textStyleList
        //     resolve()
        //   }, 5000);
        // })

      },
      onMounted: (self, caller) => {
        console.log("生命周期组件onMounted-self", self);
        console.log("生命周期组件onMounted-caller", caller);
      },

      /**
       *
       * @param {*} self 当前的组件配置
       * @param {*} caller 调用者
       * @param {*} newData 新数据
       * @param {*} oldData 旧数据
       */
      onDataChange: (self, caller, newData, oldData) => {
        console.log("数据已经改变");
      }
    },
    selectorList: [
      //  { label: "奇数行颜色", value: ".el-table tbody tr:nth-child(odd) .cell" },
    ],
    styleList: //todo: 已应用的样式列表, 从后台读取组件支持的样式列表
      [
        // {
        //   elementId: "",
        //   selector: "",
        //   styleName: "",
        //   css: ""
        // }
      ]
  },
  // 视频
  {
    uniqueId: '',
    component: 'v-video',
    label: '视频',
    icon: 'wenben',
    data: {
      name: "",
      video: "http://www.emacrosys.cn:8019/file/%E6%96%87%E4%BB%B6%E4%B8%8B%E8%BD%BD%E5%AD%98%E6%94%BE/X5.mp4",
      poster: "https://img1.baidu.com/it/u=413643897,2296924942&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=500",
      controls: true,
      autoplay: false,
      loop: true,
      muted: false,
      show: true,
      isAlign: true
    },
    attrExcludes: [],
    style: {
      width: 500,
      height: 260,
      fontSize: 14,
      fontStyle: 2500,
      fontWeight: 2500,
      borderRadius: 0,
      lineHeight: '',
      letterSpacing: 0,
      textAlign: '',
      color: 'rgba(0, 0, 0, 1)',
      backgroundColor: 'rgba(0,0,0,0)',
      fontFamily: '宋体'
    },
    styleUnit: {
      top: "px",
      left: "px",
      width: 'px',
      height: 'px',
      fontSize: 'px',
    },
    attrList: [
      {
        key: "name",
        type: "text",
        label: '名称',
        bind: 'data'
      },
      {
        key: "left",
        type: "number",
        label: 'x 坐标',
        bind: "style"
      },
      {
        key: "isAlign",
        type: "checkbox",
        label: '对齐',
        bind: 'data'
      },
      {
        key: "top",
        type: "number",
        label: 'y 坐标',
        bind: "style"
      },
      {
        key: "width",
        type: "number",
        label: '宽',
        bind: "style"
      },
      {
        key: "height",
        type: "number",
        label: '高',
        bind: "style"
      },
      {
        key: "showBorder",
        type: "select",
        label: '显示边框',
        bind: 'data',
        options: [
          {
            label: '是',
            value: "true"
          },
          {
            label: '否',
            value: "false",
          }
        ]
      },
      {
        key: "rotate",
        type: "number",
        label: '旋转',
        bind: "style"
      },
      {
        key: "borderRadius",
        type: "number",
        label: '边框半径',
        bind: 'style'
      },
      {
        type: "eventbus-button",
        label: '',
        bind: {
          label: '播放',
          click: "onPlay",
          dblclick: "onPlay"
        }
      },

    ],
    events: {

      onBeforeCreate: (self, caller) => {

        console.log("生命周期组件onBeforeCreate-self", self);
        console.log("生命周期组件onBeforeCreate-caller", caller);

        // return new Promise((resolve, reject) => {
        //   setTimeout(() => {
        //     console.log("更新之前2");
        //     caller.$set(self.styleList, 0, {
        //       value: 'border',
        //       label: '边框',
        //       children: [
        //         {
        //           type: 'css',
        //           value: 'fg',
        //           label: '效果1',
        //           activeClassList: [],
        //           style: "{color: red;}",
        //           img: "",
        //           attrList: []
        //         }
        //       ]
        //     })
        //     // self.styleList = textStyleList
        //     resolve()
        //   }, 5000);
        // })

      },
      onMounted: (self, caller) => {
        console.log("生命周期组件onMounted-self", self);
        console.log("生命周期组件onMounted-caller", caller);
      },

      /**
       *
       * @param {*} self 当前的组件配置
       * @param {*} caller 调用者
       * @param {*} newData 新数据
       * @param {*} oldData 旧数据
       */
      onDataChange: (self, caller, newData, oldData) => {
        console.log("数据已经改变");
      }
    },
    selectorList: [
      //  { label: "奇数行颜色", value: ".el-table tbody tr:nth-child(odd) .cell" },
    ],
    styleList: //todo: 已应用的样式列表, 从后台读取组件支持的样式列表
      [
        // {
        //   elementId: "",
        //   selector: "",
        //   styleName: "",
        //   css: ""
        // }
      ]
  },
  // 图表
  {
    uniqueId: '',
    component: 'vc-chart',
    label: '图表',
    icon: 'wenben',
    data: {
      chartId: "",
      show: true,
      isAlign: true,
      option:
      {
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: [
              {
                value: 150,
                itemStyle: {
                  color: '#a90000'
                }
              },
              {
                value: 200,
                itemStyle: {
                  color: '#a90000'
                }
              },
              {
                value: 30,
                itemStyle: {
                  color: '#a90000'
                }
              },
              {
                value: 230,
                itemStyle: {
                  color: '#a90000'
                }
              },
              {
                value: 180,
                itemStyle: {
                  color: '#a90000'
                }
              },
              {
                value: 80,
                itemStyle: {
                  color: '#a90000'
                }
              },
              {
                value: 120,
                itemStyle: {
                  color: '#a90000'
                }
              },
            ],
            type: 'bar'
          }
        ]
      }

      // {
      //   grid: {
      //     left: "20"
      //   },
      //   xAxis: {
      //     type: "category",
      //     data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      //   },
      //   yAxis: {
      //     type: "value",
      //   },
      //   series: [
      //     {
      //       id: "红色1",
      //       name: "职业22222222222222222222",
      //       data: [10, 200, 150, 80, 70, 110, 130],
      //       type: "bar",
      //       showBackground: true,
      //       backgroundStyle: {
      //         color: "rgba(255, 123, 321, 0.5)",
      //       },
      //     },
      //     {
      //       id: "绿色2",
      //       name: "收入士大夫萨芬",
      //       data: [130, 200, 150, 80, 70, 110, 130],
      //       type: "bar",
      //       showBackground: true,
      //       backgroundStyle: {
      //         color: "rgba(0, 255, 0, 1)",
      //       },
      //     },
      //     {
      //       id: "蓝色3",
      //       name: "地区",
      //       data: [140, 200, 150, 80, 70, 110, 130],
      //       type: "bar",
      //       showBackground: true,
      //       backgroundStyle: {
      //         color: "rgba(0, 0, 255, 1)",
      //       },
      //     }
      //   ],
      // }
    },
    attrExcludes: [],
    style: {
      width: 350,
      height: 260,
      fontSize: 14,
      fontStyle: 2500,
      fontWeight: 2500,
      borderRadius: 0,
      lineHeight: '',
      letterSpacing: 0,
      left: 0,
      textAlign: '',
      color: 'rgba(0, 0, 0, 1)',
      backgroundColor: 'rgba(0,0,0,0)',
      fontFamily: '宋体'
    },
    styleUnit: {
      top: "px",
      left: "px",
      width: 'px',
      height: 'px',
      fontSize: 'px',
    },
    attrList: [
      {
        key: "name",
        type: "text",
        label: '名称',
        bind: "data"
      },
      {
        key: "show",
        type: "checkbox",
        label: '显示',
        bind: "data"
      },
      {
        key: "isAlign",
        type: "checkbox",
        label: '对齐',
        bind: 'data'
      },
      {
        key: "left",
        type: "number",
        label: 'x 坐标',
        bind: "style"
      },
      {
        key: "top",
        type: "number",
        label: 'y 坐标',
        bind: "style"
      },
      {
        key: "width",
        type: "number",
        label: '宽',
        bind: "style"
      },
      {
        key: "height",
        type: "number",
        label: '高',
        bind: "style"
      },
      {
        key: "rotate",
        type: "number",
        label: '旋转',
        bind: "style"
      },
      {
        type: "eventbus-button",
        label: '',
        bind: {
          label: '编辑',
          click: "onEditSeries",
          dblclick: "onEditSeries"
        }
      }
    ],
    events: {

      onBeforeCreate: (self, caller) => {

        console.log("生命周期组件onBeforeCreate-self", self);
        console.log("生命周期组件onBeforeCreate-caller", caller);

        // return new Promise((resolve, reject) => {
        //   setTimeout(() => {
        //     console.log("更新之前2");
        //     caller.$set(self.styleList, 0, {
        //       value: 'border',
        //       label: '边框',
        //       children: [
        //         {
        //           type: 'css',
        //           value: 'fg',
        //           label: '效果1',
        //           activeClassList: [],
        //           style: "{color: red;}",
        //           img: "",
        //           attrList: []
        //         }
        //       ]
        //     })
        //     // self.styleList = textStyleList
        //     resolve()
        //   }, 5000);
        // })

      },

      onMounted: (self, caller) => {

        console.log("生命周期组件onMounted-self", self);
        console.log("生命周期组件onMounted-caller", caller);

        // return new Promise((resolve, reject) => {
        //   setTimeout(() => {
        //     console.log("更新之前2");
        //     caller.$set(self.styleList, 0, {
        //       value: 'border',
        //       label: '边框',
        //       children: [
        //         {
        //           type: 'css',
        //           value: 'fg',
        //           label: '效果1',
        //           activeClassList: [],
        //           style: "{color: red;}",
        //           img: "",
        //           attrList: []
        //         }
        //       ]
        //     })
        //     // self.styleList = textStyleList
        //     resolve()
        //   }, 5000);
        // })

      },

      /**
       *
       * @param {*} self 当前的组件配置
       * @param {*} caller 调用者
       * @param {*} newData 新数据
       * @param {*} oldData 旧数据
       */
      onBeforeDataChange: (self, caller, newData, oldData) => {

        console.log("数据已经改变1111111");

      },
      onAfterDataChange: (self, caller, newData, oldData) => {

        console.log("数据已经改变222222222");

      }
    },
    styleList: //todo: 从后台读取组件支持的样式列表
      [
        // {
        //   elementId: "",
        //   selector: "",
        //   styleName: "",
        //   css: ""
        // }
      ]
  },
  // 网页
  {
    component: 'v-iframe',
    label: '网页',
    propValue: {
    },
    icon: 'wenben',
    data: {
      src: "http://localhost:9538/sub01/#/DisplayBoardAdmin",
      horizontalAlignment: "",
      verticalAlignment: "",
      iframeWidth: "100%",
      iframeHeight: "100%",
      show: true,
      isAlign: true
    },
    attrExcludes: [],
    style: {
      width: 800,
      height: 600,
      backgroundColor: 'rgba(0,0,0,0)',
    },
    styleUnit: {
      top: "px",
      left: "px",
      width: 'px',
      height: 'px',
      fontSize: 'px',
    },
    type: "line",
    attrList: [
      {
        key: "name",
        type: "text",
        label: '名称'
      },
      {
        key: "show",
        type: "checkbox",
        label: '显示',
        bind: "data"
      },
      {
        key: "isAlign",
        type: "checkbox",
        label: '对齐',
        bind: 'data'
      },
      {
        key: "left",
        type: "number",
        label: 'x 坐标',
        bind: "style"
      },
      {
        key: "top",
        type: "number",
        label: 'y 坐标',
        bind: "style"
      },
      {
        key: "width",
        type: "number",
        label: '宽',
        bind: "style"
      },
      {
        key: "rotate",
        type: "number",
        label: '旋转',
        bind: "style"
      },
      {
        key: "src",
        type: "textarea",
        label: '网址',
        bind: "data"
      }
    ]
  }
]


for (let i = 0, len = list.length; i < len; i++) {
  const item = list[i]
  item.style = { ...commonStyle, ...item.style }
  list[i] = { ...commonAttr, ...item }
}

export function getComponentSharedData(component, attributeName) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve([{
        value: 'border2',
        label: '边框2',
        children: [
          {
            type: 'css',
            value: 'fg',
            label: '效果1',
            activeClassList: [],
            style: "{color: red;}",
            img: "",
            attrList: []
          }
        ]
      }])
    }, 5000);
  })
}



export default list
