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
  {
    uniqueId: '',
    component: 'v-text',
    label: '文字',
    icon: 'wenben',
    name: "",
    data: {
      text: "文本222"
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
  {
    uniqueId: '',
    component: 'Picture',
    label: '图片',
    icon: 'tupian',
    name: "",
    data: {
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
  {
    component: 'Picture',
    label: '()',
    icon: 'tupian',
    propValue: require('../assets/img-default.webp'),
    style: {
      width: 300,
      height: 200,
      borderRadius: '',
    },
    imgWidth: "0",
    imgHeight: "0",
    imgScaledWidth: "0",
    imgScaledHeight: "0",
    attrList: [
      // {
      //   key: "A111",
      //   type: "input-file",
      //   label: '选择图片',
      //   bind: function (self, event) {
      //     const file = event.target.files[0]
      //     const reader = new FileReader();
      //     reader.readAsDataURL(file);
      //     reader.onload = function (e) {
      //       self.propValue = this.result
      //     }
      //   }
      // },
      // {
      //   key: "A2",
      //   type: "text",
      //   label: '实际尺寸',
      //   bind: function (self) {

      //     function getImgWH() {
      //       return new Promise(resolve => {
      //         let img = new Image()
      //         img.src = self.propValue
      //         img.onload = () => {
      //           resolve(img)
      //         }
      //       })
      //     }
      //     getImgWH().then(img => {
      //       self.imgWidth = img.width
      //       self.imgHeight = img.height
      //     })
      //     return self.imgWidth + " * " + self.imgHeight
      //   }
      // },
      // {
      //   key: "A3",
      //   type: "text",
      //   label: '缩放尺寸',
      //   bind: function (self) {
      //     return self.imgScaledWidth + " * " + self.imgScaledHeight
      //   }
      // }
    ]
  },
  {
    component: 'rect-shape',
    label: '矩形',
    data: {
      text: ""
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
    ]
  },
  {
    component: 'v-qrcode',
    label: '二维码',
    icon: require('../assets/qrcode.png'),
    attrExcludes: ['height'],
    propValue: '[qrcode]',
    uniqueId: "",
    margin: 5,
    dark: '#000',
    light: '#ffffff00',
    quality: 0.3,
    errorCorrectionLevel: 'H',
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
    },
    attrList: [
      {
        key: "uniqueId",
        type: "text",
        label: 'id',
        bind: 'uniqueId'
      },
      {
        key: "qrcode-attr-margin",
        type: "number",
        label: '页边空白',
        bind: 'margin'
      },
      {
        key: "qrcode-attr-dark",
        type: "color-picker",
        label: '前景色',
        bind: 'dark',
        options: {
          showAlpha: false
        }
      },
      {
        key: "qrcode-attr-light",
        type: "color-picker",
        label: '背景色',
        bind: 'light',
        options: {
          showAlpha: false
        }
      },
      {
        key: "qrcode-attr-errorCorrectionLevel",
        type: "select",
        label: '纠错级别',
        bind: 'errorCorrectionLevel',
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
        key: "qrcode-attr-quality",
        type: "number",
        label: '质量',
        bind: 'quality'
      }
    ]
  },
  {
    component: 'v-barcode',
    label: '条形码',
    icon: require('../assets/条码.png'),
    propValue: '[barcode]',
    uniqueId: "",
    style: {
      width: 300,
      height: 150,
      borderRadius: '',
    },
    attrExcludes: ['fontFamily'],
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
        toast("条码生成失败")
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
  {
    component: 'v-line',
    label: '直线',
    propValue: {
    },
    icon: 'wenben',
    attrExcludes: [],
    style: {
      width: 200,
      height: 30,
      backgroundColor: 'rgba(0,0,0,0)',
    },
    type: "line",
    width: 1,
    length: 100,
    color: "rgba(0, 0, 0, 1)",
    lineStyle: "solid", // dotted solid double dashed
    points: [],
    attrList: [
      {
        key: "text-attr-width",
        type: "number",
        label: '宽度',
        bind: 'width'
      },
      {
        key: "text-attr-color",
        label: '颜色',
        bind: 'color',
        type: "color-picker",
        options: {
          showAlpha: true
        }
      },
      {
        key: "barcode-attr-lineStyle",
        type: "select",
        label: '线条风格',
        bind: 'lineStyle',
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
    name: "",
    data: {
      columns: [],
      tableData: [],
      showBorder: true
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
  {
    component: 'v-shape',
    label: '形状',
    propValue: {},
    icon: 'wenben',
    style: {
      width: 200,
      height: 22,
      fontSize: 14,
      fontWeight: 500,
      lineHeight: '',
      letterSpacing: 0,
      textAlign: '',
      color: 'rgba(0, 0, 0, 1)',
    },
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



export default list
