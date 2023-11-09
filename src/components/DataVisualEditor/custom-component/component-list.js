import axios from 'axios'
import { getRandStr } from '../utils/utils'
import Vue from 'vue'
const JSONfn = require('jsonfn').JSONfn;


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


export const userComponentList = []

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
      isAlign: false,
      isModal: false
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
      borderRadius: 'px',
      letterSpacing: 'px'
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
    eventOptions: [
      {
        label: "click",
        value: "onClick"
      },
      {
        label: "hover",
        value: "onHover"
      },
      {
        label: "mouseover",
        value: "onMouseover"
      }
    ],
    events: {
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
    component: 'v-container',
    label: '容器',
    icon: 'wenben',
    data: {
      text: "请拖放组件到容器上",
      verticalAlign: "",
      writingMode: "horizontal",
      show: true,
      isAlign: true,
      isModal: false
    },
    attrExcludes: [],
    style: {
      width: 330,
      height: 160,
      fontSize: 14,
      fontStyle: 2500,
      fontWeight: 2500,
      borderRadius: 0,
      lineHeight: '',
      letterSpacing: 0,
      left: 0,
      textAlign: '',
      color: 'rgba(0, 0, 0, 1)',
      backgroundColor: 'rgba(0,0,0,0.1)',
      fontFamily: '宋体'
    },
    styleUnit: {
      top: "px",
      left: "px",
      width: 'px',
      height: 'px',
      fontSize: 'px',
      borderRadius: 'px',
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
  // 表单
  {
    component: "v-form",
    label: '表单',
    icon: 'wenben',
    animations: [],
    events: {},
    style: {
      rotate: 0,
      opacity: 1,
      left: 130,
      top: 215,
      width: 430,
      height: 500,
      backgroundColor: "rgba(255,255,255,1)",
      borderRadius: 0
    },
    data: {
      name: "",
      show: true,
      isAlign: false,
      isModal: false,
      dialogAlign: "top|center",
      formConf: {
        fields: [],
        formRef: "elForm",
        formModel: "formData",
        size: "medium",
        labelPosition: "right",
        labelWidth: 100,
        formRules: "rules",
        gutter: 15,
        disabled: false,
        span: 6,
        formBtns: true
      },
      showFormDesignerDialog: false
    },
    styleUnit: {
      top: "px",
      left: "px",
      width: "px",
      height: "px",
      borderRadius: "px"
    },
    attrList: [
      {
        key: "name",
        type: "text",
        label: "名称",
        bind: "data",
        options: {}
      },
      {
        key: "show",
        type: "checkbox",
        label: "显示",
        bind: "data",
        options: {}
      },
      {
        key: "isModal",
        type: "checkbox",
        label: "浮框模式",
        bind: "data"
      },
      {
        key: "isDrag",
        type: "checkbox",
        label: "可拖拽",
        bind: "data"
      },
      {
        key: "left",
        type: "number",
        label: "x 坐标",
        bind: "style",
        options: {}
      },
      {
        key: "top",
        type: "number",
        label: "y 坐标",
        bind: "style",
        options: {}
      },
      {
        key: "width",
        type: "number",
        label: "宽",
        bind: "style",
        options: {}
      },
      {
        key: "height",
        type: "number",
        label: "高",
        bind: "style",
        options: {}
      },
      {
        key: "rotate",
        type: "number",
        label: "旋转",
        bind: "style",
        options: {}
      },
      {
        key: "backgroundColor",
        type: "color-picker",
        label: "背景色",
        bind: "style",
        options: {
          showAlpha: true
        }
      },
      {
        key: "borderRadius",
        type: "number",
        label: "边框半径",
        bind: "style"
      },
      {
        type: "eventbus-button",
        label: '',
        bind: {
          label: '表单设计',
          click: "onFormDesigner",
          dblclick: "onFormDesigner"
        }
      }
    ]
  },
  // 按钮
  {
    component: 'v-button',
    label: '按钮',
    propValue: '按钮',
    icon: 'button',
    data: {
      text: "点击",
      show: true,
      isAlign: false,
      isModal: false
    },
    eventOptions: [
      {
        label: "click",
        value: "onClick"
      },
      {
        label: "hover",
        value: "onHover"
      },
      {
        label: "mouseover",
        value: "onMouseover"
      }
    ],
    events: {

    },
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
    styleUnit: {
      top: "px",
      left: "px",
      width: 'px',
      height: 'px',
      fontSize: 'px',
      borderRadius: 'px',
      letterSpacing: 'px'
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
        key: "rotate",
        type: "number",
        label: '旋转',
        bind: "style"
      },
      {
        key: "text",
        type: "text",
        label: '文本',
        bind: "data"
      },
    ]
  },
  // 输入框
  {
    component: 'v-input',
    label: '输入框',
    propValue: '',
    icon: 'button',
    eventOptions: [
      {
        label: "focus",
        value: "onFocus"
      },
      {
        label: "blur",
        value: "onBlur"
      },
      {
        label: "change",
        value: "onChange"
      },
      {
        label: "input",
        value: "onInput"
      },
      {
        label: "clear",
        value: "onClear"
      },
      {
        label: "keyup",
        value: "onKeyup"
      },
      {
        label: "keydown",
        value: "onKeydown"
      },
      {
        label: "keypress",
        value: "onKeypress"
      }
    ],
    events: {

    },
    data: {
      text: "",
      placeholder: "请输入文字",
      show: true,
      isAlign: false,
      isModal: false,
      type: "text"
    },
    style: {
      width: 200,
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
    styleUnit: {
      top: "px",
      left: "px",
      width: 'px',
      height: 'px',
      fontSize: 'px',
      borderRadius: 'px',
      letterSpacing: 'px'
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
        key: "rotate",
        type: "number",
        label: '旋转',
        bind: "style"
      },
      {
        key: "text",
        type: "text",
        label: '文本',
        bind: "data"
      },
      {
        key: "placeholder",
        type: "text",
        label: '提示',
        bind: "data"
      },
      {
        key: "type",
        type: "select",
        label: '类型',
        bind: 'data',
        options: [
          {
            label: 'text',
            value: 'text'
          },
          {
            label: 'textarea ',
            value: 'textarea ',
          },
          {
            label: 'number',
            value: 'number',
          },
          {
            label: 'password',
            value: 'password',
          }
        ]
      },
    ]
  },
  // 选择器
  {
    component: 'v-select',
    label: '选择器',
    propValue: '',
    icon: 'button',
    data: {
      text: "",
      show: true,
      isAlign: false,
      selectedValue: "",
      placeholder: "请选择",
      clearable: false,
      multiple: false,
      isModal: false,
      options: []
    },
    eventOptions: [
      {
        label: "选中值变化",
        value: "onChange"
      },
      {
        label: "清空",
        value: "onClear"
      },
      {
        label: "失去焦点",
        value: "onBlur"
      },
      {
        label: "回车",
        value: "onEnter"
      },
    ],
    style: {
      width: 200,
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
    styleUnit: {
      top: "px",
      left: "px",
      width: 'px',
      height: 'px',
      fontSize: 'px',
      borderRadius: 'px',
      letterSpacing: 'px'
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
        key: "rotate",
        type: "number",
        label: '旋转',
        bind: "style"
      },
      {
        key: "placeholder",
        type: "text",
        label: '提示',
        bind: "data"
      },
      {
        key: "clearable",
        type: "checkbox",
        label: '可清空',
        bind: "data"
      },
      {
        key: "multiple",
        type: "checkbox",
        label: '多选',
        bind: "data"
      },
      {
        type: "eventbus-button",
        label: '',
        bind: {
          label: '删除下拉项',
          click: "onDeleteItem",
          dblclick: "onDeleteItem"
        }
      },
    ],
    styleList: []
  },
  // 日期选择器
  {
    component: 'v-date-picker',
    label: '日期时间',
    propValue: '',
    icon: '',
    data: {
      text: "",
      show: true,
      isAlign: false,
      isModal: false,
      date: "",
      placeholder: "选择日期",
      format: "yyyy年 MM月 dd日",
      align: "left",
      type: "date"
    },
    eventOptions: [
    ],
    style: {
      width: 200,
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
    styleUnit: {
      top: "px",
      left: "px",
      width: 'px',
      height: 'px',
      fontSize: 'px',
      borderRadius: 'px',
      letterSpacing: 'px'
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
        key: "rotate",
        type: "number",
        label: '旋转',
        bind: "style"
      },
      {
        key: "type",
        type: "select",
        label: '模式',
        bind: 'data',
        options: [
          {
            label: '日期',
            value: 'date'
          },
          {
            label: '日期时间',
            value: 'datetime',
          },
          {
            label: '时间',
            value: 'time',
          }
        ]
      },
      {
        key: "date",
        type: "text",
        label: '日期',
        bind: "data"
      },
      {
        key: "placeholder",
        type: "text",
        label: '提示',
        bind: "data"
      },
      {
        key: "format",
        type: "text",
        label: '格式',
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
      imageUrl: "",
      fit: "scale-down",
      show: true,
      isModal: false,
      isAlign: false
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
        key: "imageUrl",
        type: "text",
        label: '图片地址',
        bind: "data"
      },
      {
        type: "input-file",
        label: '选择图片',
        bind: function (self, event) {
          window.bi.Vue.set(self.data, "imageUrl", "")
          self.data.imageUrl = ""
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
      }
    ],
    eventOptions: [
    ],
    events: {

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
  // 边框
  {
    component: 'v-rect-shape',
    label: '边框',
    data: {
      name: "",
      type: "dv-border-box-1",
      show: true,
      isModal: false,
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
    eventOptions: [
    ],
    styleUnit: {
      top: "px",
      left: "px",
      width: 'px',
      height: 'px',
      borderRadius: 'px'
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
        }
      },
      {
        key: "top",
        type: "number",
        label: 'y 坐标',
        bind: "style",
        events: {

        }
      },
      {
        key: "width",
        type: "number",
        label: '宽',
        bind: "style",
        events: {
        }
      },
      {
        key: "height",
        type: "number",
        label: '高',
        bind: "style",
        events: {
        }
      },
      {
        key: "rotate",
        type: "number",
        label: '旋转',
        bind: "style",
        events: {
        }
      },
      {
        key: "type",
        type: "select",
        label: '边框类型',
        bind: 'data',
        options: [
          {
            label: '无',
            value: 'dv-border-box-0',
          },
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
      isModal: false,
      isAlign: true
    },
    eventOptions: [
    ],
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
      isModal: false,
      columns: [
        {
          prop: "date",
          label: "日期",
          width: 10,
          align: "center"
        },
        {
          prop: "name",
          label: "姓名",
          width: 10,
          align: "center"
        },
        {
          prop: "province",
          label: "省份",
          width: 10,
          align: "center"
        },
        {
          prop: "city",
          label: "市区",
          width: 10,
          align: "center"
        },
        {
          "prop": "address",
          "label": "地址",
          "width": 10,
          "align": "center"
        },
        {
          "prop": "zip",
          "label": "邮编",
          "width": 10,
          "align": "center"
        }
      ],
      tableData: [
        {
          "date": "2016-05-02",
          "name": "王小虎",
          "province": "上海",
          "city": "普陀区",
          "address": "上海市普陀区金沙江路 1518 弄",
          "zip": 200333
        },
        {
          "date": "2016-05-04",
          "name": "王小虎",
          "province": "上海",
          "city": "普陀区",
          "address": "上海市普陀区金沙江路 1517 弄",
          "zip": 200333
        },
        {
          "date": "2016-05-01",
          "name": "王小虎",
          "province": "上海",
          "city": "普陀区",
          "address": "上海市普陀区金沙江路 1519 弄",
          "zip": 200333
        },
        {
          "date": "2016-05-03",
          "name": "王小虎",
          "province": "上海",
          "city": "普陀区",
          "address": "上海市普陀区金沙江路 1516 弄",
          "zip": 200333
        },
        {
          "date": "2016-05-04",
          "name": "王小虎",
          "province": "上海",
          "city": "普陀区",
          "address": "上海市普陀区金沙江路 1517 弄",
          "zip": 200333
        },
        {
          "date": "2016-05-01",
          "name": "王小虎",
          "province": "上海",
          "city": "普陀区",
          "address": "上海市普陀区金沙江路 1519 弄",
          "zip": 200333
        },
        {
          "date": "2016-05-03",
          "name": "王小虎",
          "province": "上海",
          "city": "普陀区",
          "address": "上海市普陀区金沙江路 1516 弄",
          "zip": 200333
        },
        {
          "date": "2016-05-04",
          "name": "王小虎",
          "province": "上海",
          "city": "普陀区",
          "address": "上海市普陀区金沙江路 1517 弄",
          "zip": 200333
        },
        {
          "date": "2016-05-01",
          "name": "王小虎",
          "province": "上海",
          "city": "普陀区",
          "address": "上海市普陀区金沙江路 1519 弄",
          "zip": 200333
        },
        {
          "date": "2016-05-03",
          "name": "王小虎",
          "province": "上海",
          "city": "普陀区",
          "address": "上海市普陀区金沙江路 1516 弄",
          "zip": 200333
        },
        {
          "date": "2016-05-04",
          "name": "王小虎",
          "province": "上海",
          "city": "普陀区",
          "address": "上海市普陀区金沙江路 1517 弄",
          "zip": 200333
        },
        {
          "date": "2016-05-01",
          "name": "王小虎",
          "province": "上海",
          "city": "普陀区",
          "address": "上海市普陀区金沙江路 1519 弄",
          "zip": 200333
        },
        {
          "date": "2016-05-03",
          "name": "王小虎",
          "province": "上海",
          "city": "普陀区",
          "address": "上海市普陀区金沙江路 1516 弄",
          "zip": 200333
        },
        {
          "date": "2016-05-04",
          "name": "王小虎",
          "province": "上海",
          "city": "普陀区",
          "address": "上海市普陀区金沙江路 1517 弄",
          "zip": 200333
        },
        {
          "date": "2016-05-01",
          "name": "王小虎",
          "province": "上海",
          "city": "普陀区",
          "address": "上海市普陀区金沙江路 1519 弄",
          "zip": 200333
        },
        {
          "date": "2016-05-03",
          "name": "王小虎",
          "province": "上海",
          "city": "普陀区",
          "address": "上海市普陀区金沙江路 1516 弄",
          "zip": 200333
        }
      ],
      showBorder: true,
      editColumnsDialog: false,
      editStyleDialog: false,
      showMode: "roll",
      rollingSpeed: 1, // 滚动速度
      total: 0,//总条目数
      currentPage: 1,//当前页码
      pageSize: 10, //每页显示条目个数，支持 .sync 修饰符
      show: true,
      isAlign: false
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
      // {
      //   key: "showBorder",
      //   type: "select",
      //   label: '显示边框',
      //   bind: 'data',
      //   options: [
      //     {
      //       label: '是',
      //       value: true
      //     },
      //     {
      //       label: '否',
      //       value: false,
      //     }
      //   ]
      // },
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
      // {
      //   type: "eventbus-button",
      //   label: '',
      //   bind: {
      //     label: '编辑样式',
      //     click: "onEditStyle",
      //     dblclick: "onEditStyle"
      //   }
      // },

    ],
    eventOptions: [
      {
        label: "select",
        value: "onSelect"
      },
      {
        label: "select-all",
        value: "onSelectAll"
      },
      {
        label: "selection-change",
        value: "onSelectionChange"
      },
      {
        label: "cell-mouse-enter",
        value: "onCellMouseEnter"
      },
      {
        label: "cell-mouse-leave",
        value: "onCellMouseLeave"
      },
      {
        label: "cell-click",
        value: "onCellClick"
      },
      {
        label: "cell-dblclick",
        value: "onCellDblClick"
      },
      {
        label: "row-click",
        value: "onRowClick"
      },
      {
        label: "row-contextmenu",
        value: "onRowContextmenu"
      },
      {
        label: "row-dblclick",
        value: "onRowDblClick"
      },
      {
        label: "header-click",
        value: "onHeaderClick"
      },
      {
        label: "header-contextmenu",
        value: "onHeaderContextmenu"
      },
      {
        label: "sort-change",
        value: "onSortChange"
      },
      {
        label: "filter-change",
        value: "onFilterChange"
      },
      {
        label: "current-change",
        value: "onCurrentChange"
      },
      {
        label: "header-dragend",
        value: "onHeaderDragend"
      },
      {
        label: "expand-change",
        value: "onExpandChange"
      }
    ],
    events: {


    },
    selectorList: [
      //  { label: "奇数行颜色", value: ".el-table tbody tr:nth-child(odd) .cell" },
    ],
    styleList: //todo: 已应用的样式列表, 从后台读取组件支持的样式列表
      [
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
      isModal: false,
      show: true,
      isAlign: false
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
        key: "isAlign",
        type: "checkbox",
        label: '对齐',
        bind: 'data'
      },
      {
        key: "show",
        type: "checkbox",
        label: '显示',
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
        key: "video",
        type: "text",
        label: '视频地址',
        bind: "data"
      },
      {
        key: "poster",
        type: "text",
        label: '封面地址',
        bind: "data"
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
    eventOptions: [
    ],
    events: {

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
      name: "",
      chartId: "",
      show: true,
      isModal: false,
      isAlign: false,
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
            name: 'bar',
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
    eventOptions: [
    ],
    events: {
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
      name: "",
      src: "http://localhost:9538/bi/#/DisplayBoardAdmin",
      horizontalAlignment: "",
      verticalAlignment: "",
      iframeWidth: "100%",
      iframeHeight: "100%",
      isModal: false,
      show: true,
      isAlign: false
    },
    eventOptions: [
    ],
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
  },
  // 二维码
  {
    component: 'v-qrcode',
    label: '二维码',
    icon: require('../assets/qrcode.png'),
    styleExcludes: ['height'],
    propValue: '[qrcode]',
    uniqueId: "",
    data: {
      text: "test",
      margin: 5,
      dark: '#000',
      light: '#ffffff00',
      quality: 0.3,
      isModal: false,
      errorCorrectionLevel: 'H',
      show: true,
      isAlign: false
    },
    eventOptions: [
    ],
    style: {
      width: 200,
      height: 200,
      borderRadius: 0,
    },
    styleUnit: {
      top: "px",
      left: "px",
      width: 'px',
      height: 'px',
      fontSize: 'px',
      borderRadius: 'px',
      letterSpacing: 'px'
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
        key: "text",
        type: "text",
        label: '二维码',
        bind: "data"
      },
      {
        key: "margin",
        type: "number",
        label: '页边空白',
        bind: 'data'
      },
      {
        key: "dark",
        type: "color-picker",
        label: '前景色',
        bind: 'data',
        options: {
          showAlpha: false
        }
      },
      {
        key: "light",
        type: "color-picker",
        label: '背景色',
        bind: 'data',
        options: {
          showAlpha: false
        }
      },
      {
        key: "errorCorrectionLevel",
        type: "select",
        label: '纠错级别',
        bind: 'data',
        options: [{
          value: 'H',
          label: 'H'
        }, {
          value: 'L',
          label: 'L'
        }, {
          value: 'M',
          label: 'M'
        }, {
          value: 'Q',
          label: 'Q'
        }]
      },
      {
        key: "quality",
        type: "number",
        label: '质量',
        bind: 'data'
      }
    ]
  },
  // 条形码
  {
    component: 'v-barcode',
    label: '条形码',
    icon: require('../assets/条码.png'),
    propValue: '[barcode]',
    uniqueId: "",
    data: {
      show: true,
      isAlign: false,
      isModal: false,
    },
    style: {
      width: 300,
      height: 150,
      borderRadius: '',
    },
    eventOptions: [
    ],
    styleUnit: {
      top: "px",
      left: "px",
      width: 'px',
      height: 'px',
      fontSize: 'px',
      borderRadius: 'px',
      letterSpacing: 'px'
    },
    styleExcludes: ['fontFamily'],
    format: "CODE128",
    mod43: true,
    ean128: true,
    width: 2,
    height: 100,
    displayValue: true,
    fontOptions: '',
    font: '等宽',
    fontSize: 16,
    textAlign: 'center',
    textPosition: 'bottom',
    textMargin: 2,
    background: '#ffffff',
    lineColor: '#000000',
    margin: 10,
    valid: function (valid) {
      if (!valid) {
        // toast("条码生成失败")
      }
    },
    attrList: [
      {
        key: "barcode-attr-0",
        type: "select",
        label: '条形码类型',
        bind: 'format',
        options: [{
          value: 'CODE128',
          label: 'CODE128'
        }, {
          value: 'CODE128A',
          label: 'CODE128A'
        }, {
          value: 'CODE128B',
          label: 'CODE128B'
        }, {
          value: 'CODE128C',
          label: 'CODE128C'
        }, {
          value: 'CODE39',
          label: 'CODE39'
        }, {
          value: 'codabar',
          label: 'codabar'
        }, {
          value: 'EAN13',
          label: 'EAN13'
        }, {
          value: 'UPC',
          label: 'UPC'
        }, {
          value: 'EAN8',
          label: 'EAN8'
        }, {
          value: 'EAN5',
          label: 'EAN5'
        }, {
          value: 'EAN2',
          label: 'EAN2'
        }, {
          value: 'ITF14',
          label: 'ITF14'
        }, {
          value: 'MSI',
          label: 'MSI'
        }, {
          value: 'MSI10',
          label: 'MSI10'
        }, {
          value: 'MSI11',
          label: 'MSI11'
        }, {
          value: 'MSI1010',
          label: 'MSI1010'
        }, {
          value: 'MSI1110',
          label: 'MSI1110'
        }, {
          value: 'pharmacode',
          label: 'pharmacode'
        }]
      },
      {
        key: "barcode-attr-mod43",
        type: "checkbox",
        label: 'mod43',
        bind: 'mod43'
      },
      {
        key: "barcode-attr-ean128",
        type: "checkbox",
        label: 'ean128',
        bind: 'ean128'
      },
      {
        key: "barcode-attr-width",
        type: "number",
        label: '竖线宽度',
        bind: 'width'
      },
      {
        key: "barcode-attr-height",
        type: "number",
        label: '条形码高度',
        bind: 'height'
      },
      {
        key: "barcode-attr-displayValue",
        type: "checkbox",
        label: '是否显示文本',
        bind: 'displayValue'
      },
      {
        key: "barcode-attr-fontOptions",
        type: "select",
        label: '文本选项',
        bind: 'fontOptions',
        options: [
          {
            value: '',
            label: '无'
          }, {
            value: 'bold',
            label: 'bold'
          }, {
            value: 'italic',
            label: 'italic'
          }, {
            value: 'bold italic',
            label: 'bold italic'
          }]
      },
      {
        key: "text-attr-font",
        type: "select",
        label: '字体',
        bind: 'font',
        options: fontFamilyOpts
      },
      {
        key: "barcode-attr-fontSize",
        type: "number",
        label: '字体大小',
        bind: 'fontSize'
      },
      {
        key: "barcode-attr-textAlign",
        type: "select",
        label: '文本对齐',
        bind: 'textAlign',
        options: [{
          value: 'center',
          label: 'center'
        }, {
          value: 'left',
          label: 'left'
        }, {
          value: 'right',
          label: 'right'
        }]
      },
      {
        key: "barcode-attr-textPosition",
        type: "select",
        label: '文本位置',
        bind: 'textPosition',
        options: [{
          value: 'bottom',
          label: 'bottom'
        }, {
          value: 'top',
          label: 'top'
        }]
      },
      {
        key: "barcode-attr-textMargin",
        type: "number",
        label: '文本顶边',
        bind: 'textMargin'
      },
      {
        key: "barcode-attr-background",
        type: "color-picker",
        label: '背景',
        bind: 'background',
        options: {
          showAlpha: true
        }
      },
      {
        key: "barcode-attr-lineColor",
        type: "color-picker",
        label: '条码颜色',
        bind: 'lineColor',
        options: {
          showAlpha: true
        }
      },
      {
        key: "barcode-attr-margin",
        type: "number",
        label: '页边空白',
        bind: 'margin'
      },
    ]
  },
  // 可变组件
  {
    uniqueId: '',
    component: 'v-variable',
    label: '可变组件',
    icon: 'wenben',
    data: {
      verticalAlign: "",
      writingMode: "horizontal",
      show: true,
      isAlign: false,
      title: "",
      isDrag: true,
      componentListFlexDirection: "row",
      componentListFlexWrap: "wrap",
      isModal: false,
      componentName: "",
      dialogAlign: 'top|center'
    },
    attrExcludes: [],
    style: {
      width: 600,
      height: 200,
      fontSize: 14,
      fontStyle: 2500,
      fontWeight: 2500,
      borderRadius: 0,
      lineHeight: '',
      letterSpacing: 0,
      left: 0,
      textAlign: '',
      color: 'rgba(0, 0, 0, 1)',
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      fontFamily: '宋体'
    },
    styleUnit: {
      top: "px",
      left: "px",
      width: 'px',
      height: 'px',
      fontSize: 'px',
      borderRadius: 'px',
      letterSpacing: 'px'
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
        key: "isModal",
        type: "checkbox",
        label: '浮框模式',
        bind: "data"
      },
      {
        key: "isDrag",
        type: "checkbox",
        label: '可拖拽',
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
        key: "dialogAlign",
        type: "select",
        label: '位置',
        bind: 'data',
        options: [
          {
            label: '居中',
            value: 'center',
          },
          {
            label: '上对齐,左右居中',
            value: 'top|center'
          },
          {
            label: '左对齐,上下居中',
            value: 'left|center'
          },
          {
            label: '左上对齐',
            value: 'left|top'
          },
          {
            label: '无',
            value: 'none',
          }
        ]
      },
      {
        key: "componentName",
        type: "text",
        label: '组件名称',
        bind: "data"
      },
    ],
    eventOptions: [
      {
        label: "click",
        value: "onClick"
      },
      {
        label: "hover",
        value: "onHover"
      },
      {
        label: "mouseover",
        value: "onMouseover"
      }
    ],
    events: {
    },
    styleList: [
    ]
  },
  // 循环组件
  {
    uniqueId: '',
    component: 'v-loop-rendering',
    label: '组件循环',
    icon: 'wenben',
    data: {
      text: "请输入文本...",
      verticalAlign: "",
      writingMode: "horizontal",
      show: true,
      isAlign: false,
      isModal: false
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
      borderRadius: 'px',
      letterSpacing: 'px'
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
    ],
    eventOptions: [
      {
        label: "click",
        value: "onClick"
      },
      {
        label: "hover",
        value: "onHover"
      },
      {
        label: "mouseover",
        value: "onMouseover"
      }
    ],
    events: {
    },
    styleList: //todo: 从后台读取组件支持的样式列表
      [
      ]
  },
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




async function getUserCustomizedComponentTemplate() {

  list.forEach(c => {

    const key = c.component

    axios.get(`/BI-API/File/Get?name=UserCustomizedComponentTemplate/${key}.js`).then(async response => {

      if (response.status !== 200) {
        console.warn('UserCustomizedComponentTemplate', key);
        return
      }

      const newComponent = (await window.bi.utils.CompileToModule(response.data)).default
      if (newComponent.setComponentTemplate && newComponent.setComponentTemplate(c)) {
        return
      }

      Object.keys(newComponent).forEach(key => {
        if (['setComponentTemplate'].includes(key)) {
          return
        }
        if (Array.isArray(newComponent[key])) {

          const data = []
          if (c[key])
            data.push(...c[key])
          data.push(...newComponent[key])
          Vue.set(c, key, data)
        } else if (typeof newComponent[key] === 'object') {

          const data = {}
          if (c[key])
            window.bi.utils.deepMerge(data, c[key])
          window.bi.utils.deepMerge(data, newComponent[key])
          Vue.set(c, key, data)
        }
      })

    }).catch(error => {
      console.warn('保存数据异常', error);
    });
  })

}




getUserCustomizedComponentTemplate()


export default list







