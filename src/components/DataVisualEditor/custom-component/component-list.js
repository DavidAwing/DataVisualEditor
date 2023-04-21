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
      text: "文本222",
      verticalAlign: "",
      writingMode: "horizontal"
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
  // 组件容器
  {
    uniqueId: '',
    component: 'v-text',
    label: '容器',
    icon: 'wenben',
    data: {
      text: "文本222",
      verticalAlign: "",
      writingMode: "horizontal"
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
    component: 'Picture',
    label: '图片',
    icon: 'tupian',
    data: {
      name: "",
      image: require('../assets/img-default.webp'),
      fit: "scale-down"
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
    component: 'rect-shape',
    label: '矩形',
    data: {
      text: "",
      verticalAlign: "top"
    },
    icon: 'juxing',
    style: {
      width: 200,
      height: 200,
      fontSize: 14,
      fontWeight: 500,
      lineHeight: '',
      letterSpacing: 0,
      textAlign: 'center',
      color: 'rgba(0, 0, 0, 1)',
      borderColor: '#000',
      borderWidth: 1,
      backgroundColor: '',
      borderStyle: 'solid',
      borderRadius: '',
      verticalAlign: 'middle',
    },
    styleUnit: {
      top: "px",
      left: "px",
      width: 'px',
      height: 'px',
    },
    attrList: [
      {
        key: "id",
        type: "text",
        label: 'id',
        events: {
          onInput: function (self, value) { }
        },
        bind: "data",
        options: {
          showAlpha: false
        }
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
        label: '水平对齐',
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
      editColumnsDialog: false
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
  // 柱状图
  {
    uniqueId: '',
    component: 'vc-bar',
    label: '柱状图',
    icon: 'wenben',
    data: {
      chartId: "",
      option: {
        grid: {
          left: "20"
        },
        xAxis: {
          type: "category",
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: [120, 200, 150, 80, 70, 110, 130],
            type: "bar",
            showBackground: true,
            backgroundStyle: {
              color: "rgba(180, 180, 180, 0.2)",
            },
          },
          {
            data: [120, 200, 150, 80, 70, 110, 130],
            type: "bar",
            showBackground: true,
            backgroundStyle: {
              color: "rgba(180, 180, 180, 0.2)",
            },
          },
        ],
      }
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
  // 柱折线图
  {
    uniqueId: '',
    component: 'vc-bar-MultipleYAxes',
    label: '柱折线图',
    icon: 'wenben',
    data: {
      chartId: "",
      option: {
        color: ['#5470C6', '#91CC75', '#EE6666'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        grid: {
          right: '20%'
        },
        toolbox: {
          feature: {
            dataView: { show: true, readOnly: false },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        legend: {
          data: ['Evaporation', 'Precipitation', 'Temperature']
        },
        xAxis: [
          {
            type: 'category',
            axisTick: {
              alignWithLabel: true
            },
            // prettier-ignore
            data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: 'Evaporation',
            position: 'right',
            alignTicks: true,
            axisLine: {
              show: true,
              lineStyle: {
                color: '#5470C6'
              }
            },
            axisLabel: {
              formatter: '{value} ml'
            }
          },
          {
            type: 'value',
            name: 'Precipitation',
            position: 'right',
            alignTicks: true,
            offset: 80,
            axisLine: {
              show: true,
              lineStyle: {
                color: '#91CC75'
              }
            },
            axisLabel: {
              formatter: '{value} ml'
            }
          },
          {
            type: 'value',
            name: '温度',
            position: 'left',
            alignTicks: true,
            axisLine: {
              show: true,
              lineStyle: {
                color: '#EE6666'
              }
            },
            axisLabel: {
              formatter: '{value} °C'
            }
          }
        ],
        series: [
          {
            name: 'Evaporation',
            type: 'bar',
            data: [
              2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3
            ]
          },
          {
            name: 'Precipitation',
            type: 'bar',
            yAxisIndex: 1,
            data: [
              2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3
            ]
          },
          {
            name: 'Temperature',
            type: 'line',
            yAxisIndex: 2,
            data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
          }
        ]
      }
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
