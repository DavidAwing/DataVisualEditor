<template>
  <div id="app">

    <router-view />

  </div>
</template>

<script lang="js">

  import {
    stringToFunction,
    CompileSourcecode,
    CompileToModule,
    CompileTypescriptToIIFE,
  } from './components/DataVisualEditor/utils/compiler.ts';
  import {
    getValueByAttributePath,
    setJsonAttribute,
    SetValueAndAttributePathFromKey,
  } from './components/DataVisualEditor/utils/chartUtils';
  import { printByTemplate, compileVueTemplate } from './components/DataVisualEditor/utils/print';
  // import { deepCopy } from './components/DataVisualEditor/utils/utils';
  import Vue from 'vue';
  import axios from 'axios';
  // import moment from 'moment';
  // import BigNumber from 'bignumber.js';
  // import store from '@/store';
  import * as ElementUI from 'element-ui';
  import * as xlsx from 'xlsx-js-style';

  import bi from '@/bi.js';

  // import eventBus from './components/DataVisualEditor/utils/eventBus';
  // import MySharedWorker from './components/DataVisualEditor/utils/shared-worker.worker.js'
  // import { loadModule } from './components/DataVisualEditor/utils/webpackUtils';

  // import * as tesseract from 'tesseract.js'
  // import * as tf from '@tensorflow/tfjs';
  // import * as ml5 from 'ml5';
  // import * as Vue3 from '@/vue3/vue@3.3.4.esm-browser.js'
  // import * as CompilerSFC from '@/vue3/compiler-sfc'
  // import * as repl from '@/vue3/repl'
  // import Monaco from '@/vue3/repl/dist/monaco-editor.js'


  // const repl = require('@vue/repl')
  // const  Monaco = require('@vue/repl/monaco-editor')
  // import { Repl } from '@vue/repl'

  const VueTemplateCompiler = require('vue-template-compiler');


  // import * as ts from './compiler/typescript@5.0.4.js';
  const JSONfn = require('jsonfn').JSONfn;
  const schedule = require('node-schedule');
  const { Engine } = require('json-rules-engine')

  // const FFmpeg = require('@ffmpeg/ffmpeg');
  // const FFmpegUtil = require('@ffmpeg/util');



  export default {
    name: 'App',
    data() {
      return {
      };
    },
    components: {},
    props: {},
    computed: {},
    async beforeCreate() {

      const userId = 'admin';
      const { data } = await axios.post(`/BI-API/DataSource/FindDatabaseByUserId?userId=${userId}`, { timeout: 6000 })
      if (data.state === 200 && data.data.length > 0) {
        localStorage.setItem('UserDatabaseList', JSON.stringify(data.data));
      } else {
        localStorage.setItem('UserDatabaseList', '[]');
      }

    },
    created() {

      const lessCode = `
        @primary-color: #007bff;
        body {
          background-color: @primary-color;
        }
      `;
      less.render(lessCode).then(output => {
        console.log('在线编译less', output);
        console.log('在线编译less', output.css);
      });

      bi.addProperty([['App', this],['$watch', this.$watch], ['$route', this.$route]])


      axios
        .get('/BI-API/Component/GetGlobalModuleScript', { timeout: 10000 })
        .then(({ data }) => {
          if (data.state !== 200) {
            console.error('获取全局挂载脚本异常', error);
            return;
          }

          data.data.forEach(item => {
            if (item.type === 'ts') {
              const iife = CompileTypescriptToIIFE(item.code);
              const instance = new iife();
              let name = iife.name;
              if (instance.Name) name = instance.Name;
              if (instance.MountTarget === undefined || instance.MountTarget === null) {
                console.warn('GetGlobalModuleScript|MountTarget未赋值,挂载默认目标window', item);
                instance.MountTarget = window;
              }
              if (name === undefined || name === null)
                console.warn('GetGlobalModuleScript|Name未赋值,设置为文件名', item);

              if (instance.MountTarget[name] === undefined) instance.MountTarget[name] = new Object();
              for (const key in instance) {
                // if (instance.hasOwnProperty(key) && Object.prototype.toString.call(instance[key]) == '[object Function]')
                instance.MountTarget[name][key] = instance[key];
              }
              return;
            }

            CompileToModule.bind(this)(item.code).then(module => {
              if (Object.prototype.toString.call(module) === '[object Module]' && module.default === undefined) {
              } else if (Object.prototype.toString.call(module.default) === '[object Function]') {
                const instance = new module.default();

                let name = instance.Name;
                if (instance.MountTarget === undefined || instance.MountTarget === null) {
                  console.warn('GetGlobalModuleScript|MountTarget未赋值,挂载默认目标window', item);
                  instance.MountTarget = window;
                }
                if (name === undefined || name === null) {
                  console.warn('GetGlobalModuleScript|Name未赋值,设置为文件名', item);
                  name = item.name;
                }
                instance.MountTarget[name] = { ...instance.MountTarget[name], ...instance };
              } else if (Object.prototype.toString.call(module.default) === '[object Object]') {
                let name = module.Name;
                if (module.MountTarget === undefined || module.MountTarget === null) {
                  console.warn('GetGlobalModuleScript|MountTarget未赋值,挂载默认目标window', item);
                  module.MountTarget = window;
                }
                if (!name) {
                  console.warn('GetGlobalModuleScript|Name未赋值,设置为文件名', item);
                  name = item.name;
                }
                const target = bi.utils.deepMerge(module.MountTarget[name], module.default)
                module.MountTarget[name] = target;
              }

            });
          });
        })
        .catch(error => {
          console.error(`挂载全局脚本异常: `, error);
        })










      const exportExcle = (fileName, excelData, excelStyle = null) => {
        // var data1 = [
        //   ['id', 'name', 'value'],
        //   [1, 'sheetjs', 7262],
        //   [2, 'js-xlsx', 6969],
        // ];

        // var data2 = [
        //   {
        //     周一: '语文',
        //     周二: '数学',
        //     周三: '历史',
        //     周四: '政治',
        //     周五: '英语',
        //   },
        //   {
        //     周一: '数学',
        //     周二: '数学',
        //     周三: '政治',
        //     周四: '英语',
        //     周五: '英语',
        //   },
        //   {
        //     周一: '政治',
        //     周二: '英语',
        //     周三: '历史',
        //     周四: '政治',
        //     周五: '数学',
        //   },
        // ];

        // const XLSX = xlsx

        // //1. 新建一个工作簿
        // let workbook = XLSX.utils.book_new();

        // //2. 生成一个工作表，
        // //2.1 aoa_to_sheet 把数组转换为工作表
        // let sheet1 = XLSX.utils.aoa_to_sheet(data1);
        // //2.2 把json对象转成工作表
        // let sheet2 = XLSX.utils.json_to_sheet(data2);
        // //3.在工作簿中添加工作表
        // XLSX.utils.book_append_sheet(workbook, sheet1, 'sheetName1'); //工作簿名称
        // XLSX.utils.book_append_sheet(workbook, sheet2, 'sheetName2'); //工作簿名称
        // // XLSX.utils.sheet_add_json(sheet1,data2);//把已存在的sheet中数据替换成json数据

        // //4.输出工作表,由文件名决定的输出格式
        // XLSX.writeFile(workbook, 'workBook1.xlsx'); // 保存的文件名

        // excel的表数据，根据实际情况生成

        let workbook = xlsx.utils.book_new(); // 工作簿
        let worksheet = xlsx.utils.aoa_to_sheet(excelData); // 数据表

        // let cols = []; // 设置每列的宽度
        // // wpx 字段表示以像素为单位，wch 字段表示以字符为单位
        // for (let i = 0; i <= excelData[0].length; i++) {
        //   let col = {};
        //   if (i == 0) {
        //     col.wch = 30;
        //   } else {
        //     col.wch = 18;
        //   }
        //   cols.push(col);
        // }
        // worksheet['!cols'] = cols; // 设置列宽信息到工作表

        // console.log("数据啊啊啊啊", worksheet);

        // worksheet['!cols'] = [{ wch: 30, hidden: true }];

        //以下是样式设置，样式设置放在组织完数据之后，xlsx-js-style的核心API就是SheetJS的
        // Object.keys(worksheet).forEach(key => {
        //   // 非!开头的属性都是单元格
        //   if (!key.startsWith('!')) {
        //     worksheet[key].s = {
        //       font: {
        //         name: '黑体',
        //         color: { rgb: '4b0082' },
        //         sz: '12',
        //       },
        //       alignment: {
        //         horizontal: 'left',
        //         vertical: 'center',
        //         wrapText: true,
        //       },
        //       border: {
        //         top: { style: 'thin', color: { rgb: 'ff0000' } },
        //         right: { style: 'thin', color: { rgb: 'ff0000' } },
        //         bottom: { style: 'thin', color: { rgb: 'ff0000' } },
        //         left: { style: 'thin' },
        //       },
        //     };
        //   }
        // });

        // worksheet['A1'].s = {
        //   font: {
        //     name: '黑体',
        //     color: { rgb: '4b0082' },
        //     sz: '12',
        //   },
        //   alignment: {
        //     horizontal: 'left',
        //     vertical: 'center',
        //     wrapText: true,
        //   },
        //   border: {
        //     top: { style: 'thin', color: { rgb: 'ff0000' } },
        //     right: { style: 'thin', color: { rgb: 'ff0000' } },
        //     bottom: { style: 'thin', color: { rgb: 'ff0000' } },
        //     left: { style: 'thin' },
        //   },
        // };

        if (worksheet['!cols'] === undefined) worksheet['!cols'] = [];

        if (Array.isArray(excelStyle)) {
          for (let i = 0; i < excelStyle.length; i++) {
            const style = excelStyle[i];
            if (!style.key) continue;
            if (!style.value || JSON.stringify(style.value) === '{}' || JSON.stringify(style.value) === '[]') continue;
            if (style.key === 'cols') {
              for (let j = 0; j < style.value.length; j++) {
                const colStyle = style.value[j];
                if (worksheet['!cols'][j] === undefined || worksheet['!cols'][j] === null) worksheet['!cols'][j] = {};
                Object.keys(colStyle).forEach(key => {
                  worksheet['!cols'][j][key] = colStyle[key];
                });
              }
            } else {
              const key = style.key.toLocaleUpperCase().replace(/\s/g, '');
              if (/^\[[A-Z]-[A-Z]\]\[\d{1,9}-\d{1,9}\]$/.test(key)) {
                // [A-K][1-20]
                const charMatch = key.match(/^\[([A-Z])-([A-Z])\]/);
                const indexMatch = key.match(/\[(\d{1,9})-(\d{1,9})\]/);
                for (let i = charMatch[1].charCodeAt(0); i <= charMatch[2].charCodeAt(0); i++) {
                  const c = String.fromCharCode(i);
                  for (let j = indexMatch[1]; j <= indexMatch[2]; j++) worksheet[c + j].s = style.value;
                }
              } else if (/^[A-Z]\[\d{1,9}-\d{1,9}\]$/.test(key)) {
                // A[1-20]
                const c = key.match(/^([A-Z])(?!=\[)/g)[0];
                const indexMatch = key.match(/\[(\d{1,9})-(\d{1,9})\]/);
                for (let i = indexMatch[1]; i <= indexMatch[2]; i++) worksheet[c + i].s = style.value;
              } else if (/^\[[A-Z]-[A-Z]\]\d{1,9}$/.test(key)) {
                // [A-K]3
                const charMatch = key.match(/^\[([A-Z])-([A-Z])\]/);
                const j = key.match(/(?!\])(\d{1,9})/g)[0];
                for (let i = charMatch[1].charCodeAt(0); i <= charMatch[2].charCodeAt(0); i++) {
                  const c = String.fromCharCode(i);
                  worksheet[c + j].s = style.value;
                }
              } else if (/^[A-Z]\d{1,9}$/.test(key)) {
                // C16
                worksheet[key].s = style.value;
              }
            }
          }
        } else if (Object.prototype.toString.call(excelStyle) === '[object Object]') {
        }

        if (!fileName.toLocaleLowerCase().endsWith('.xlsx')) fileName += '.xlsx';
        xlsx.utils.book_append_sheet(workbook, worksheet, 'sheet1');
        xlsx.writeFile(workbook, fileName);
      };

      let excelData = [
        ['指标', '2021年', '2020年', '2019年', '2018年', '2017年', '2016年', '2015年', '2014年', '2013年', '2012年'],
        [
          '国民总收入(亿元)',
          '1133239.8',
          '1005451.3',
          '983751.2',
          '915243.5',
          '830945.7',
          '742694.1',
          '685571.2',
          '644380.2',
          '588141.2',
          '537329.0',
        ],
        [
          '国内生产总值(亿元)',
          '1143669.7',
          '1013567.0',
          '986515.2',
          '919281.1',
          '832035.9',
          '746395.1',
          '688858.2',
          '643563.1',
          '592963.2',
          '538580.0',
        ],
        [
          '第一产业增加值(亿元)',
          '83085.5',
          '78030.9',
          '70473.6',
          '64745.2',
          '62099.5',
          '60139.2',
          '57774.6',
          '55626.3',
          '53028.1',
          '49084.6',
        ],
        [
          '第二产业增加值(亿元)',
          '450904.5',
          '383562.4',
          '380670.6',
          '364835.2',
          '331580.5',
          '295427.8',
          '281338.9',
          '277282.8',
          '261951.6',
          '244639.1',
        ],
        [
          '第三产业增加值(亿元)',
          '609679.7',
          '551973.7',
          '535371.0',
          '489700.8',
          '438355.9',
          '390828.1',
          '349744.7',
          '310654.0',
          '277983.5',
          '244856.2',
        ],
        [
          '人均国内生产总值(元)',
          '80976',
          '71828',
          '70078',
          '65534',
          '59592',
          '53783',
          '49922',
          '46912',
          '43497',
          '39771',
        ],
        ['指标', '2021年', '2020年', '2019年', '2018年', '2017年', '2016年', '2015年', '2014年', '2013年', '2012年'],
        [
          '国民总收入(亿元)',
          '1133239.8',
          '1005451.3',
          '983751.2',
          '915243.5',
          '830945.7',
          '742694.1',
          '685571.2',
          '644380.2',
          '588141.2',
          '537329.0',
        ],
        [
          '国内生产总值(亿元)',
          '1143669.7',
          '1013567.0',
          '986515.2',
          '919281.1',
          '832035.9',
          '746395.1',
          '688858.2',
          '643563.1',
          '592963.2',
          '538580.0',
        ],
        [
          '第一产业增加值(亿元)',
          '83085.5',
          '78030.9',
          '70473.6',
          '64745.2',
          '62099.5',
          '60139.2',
          '57774.6',
          '55626.3',
          '53028.1',
          '49084.6',
        ],
        [
          '第二产业增加值(亿元)',
          '450904.5',
          '383562.4',
          '380670.6',
          '364835.2',
          '331580.5',
          '295427.8',
          '281338.9',
          '277282.8',
          '261951.6',
          '244639.1',
        ],
        [
          '第三产业增加值(亿元)',
          '609679.7',
          '551973.7',
          '535371.0',
          '489700.8',
          '438355.9',
          '390828.1',
          '349744.7',
          '310654.0',
          '277983.5',
          '244856.2',
        ],
        [
          '人均国内生产总值(元)',
          '80976',
          '71828',
          '70078',
          '65534',
          '59592',
          '53783',
          '49922',
          '46912',
          '43497',
          '39771',
        ],
        ['指标', '2021年', '2020年', '2019年', '2018年', '2017年', '2016年', '2015年', '2014年', '2013年', '2012年'],
        [
          '国民总收入(亿元)',
          '1133239.8',
          '1005451.3',
          '983751.2',
          '915243.5',
          '830945.7',
          '742694.1',
          '685571.2',
          '644380.2',
          '588141.2',
          '537329.0',
        ],
        [
          '国内生产总值(亿元)',
          '1143669.7',
          '1013567.0',
          '986515.2',
          '919281.1',
          '832035.9',
          '746395.1',
          '688858.2',
          '643563.1',
          '592963.2',
          '538580.0',
        ],
        [
          '第一产业增加值(亿元)',
          '83085.5',
          '78030.9',
          '70473.6',
          '64745.2',
          '62099.5',
          '60139.2',
          '57774.6',
          '55626.3',
          '53028.1',
          '49084.6',
        ],
        [
          '第二产业增加值(亿元)',
          '450904.5',
          '383562.4',
          '380670.6',
          '364835.2',
          '331580.5',
          '295427.8',
          '281338.9',
          '277282.8',
          '261951.6',
          '244639.1',
        ],
        [
          '第三产业增加值(亿元)',
          '609679.7',
          '551973.7',
          '535371.0',
          '489700.8',
          '438355.9',
          '390828.1',
          '349744.7',
          '310654.0',
          '277983.5',
          '244856.2',
        ],
        [
          '人均国内生产总值(元)',
          '80976',
          '71828',
          '70078',
          '65534',
          '59592',
          '53783',
          '49922',
          '46912',
          '43497',
          '39771',
        ],
        ['指标', '2021年', '2020年', '2019年', '2018年', '2017年', '2016年', '2015年', '2014年', '2013年', '2012年'],
        [
          '国民总收入(亿元)',
          '1133239.8',
          '1005451.3',
          '983751.2',
          '915243.5',
          '830945.7',
          '742694.1',
          '685571.2',
          '644380.2',
          '588141.2',
          '537329.0',
        ],
        [
          '国内生产总值(亿元)',
          '1143669.7',
          '1013567.0',
          '986515.2',
          '919281.1',
          '832035.9',
          '746395.1',
          '688858.2',
          '643563.1',
          '592963.2',
          '538580.0',
        ],
        [
          '第一产业增加值(亿元)',
          '83085.5',
          '78030.9',
          '70473.6',
          '64745.2',
          '62099.5',
          '60139.2',
          '57774.6',
          '55626.3',
          '53028.1',
          '49084.6',
        ],
        [
          '第二产业增加值(亿元)',
          '450904.5',
          '383562.4',
          '380670.6',
          '364835.2',
          '331580.5',
          '295427.8',
          '281338.9',
          '277282.8',
          '261951.6',
          '244639.1',
        ],
        [
          '第三产业增加值(亿元)',
          '609679.7',
          '551973.7',
          '535371.0',
          '489700.8',
          '438355.9',
          '390828.1',
          '349744.7',
          '310654.0',
          '277983.5',
          '244856.2',
        ],
        [
          '人均国内生产总值(元)',
          '80976',
          '71828',
          '70078',
          '65534',
          '59592',
          '53783',
          '49922',
          '46912',
          '43497',
          '39771',
        ],
      ]; // excel表数据

      let excelStyle = [
        {
          key: 'cols',
          value: [
            {
              wch: 30,
              hidden: false,
            },
            {
              wch: 50,
              hidden: false,
            },
          ],
        },
        {
          key: 'A[1-20]',
          value: {},
        },
        {
          key: '[A-K][1-20]',
          value: {},
        },
        {
          key: '[A-K]3',
          value: {
            font: {
              name: '黑体',
              color: { rgb: '4b0082' },
              sz: '12',
            },
            alignment: {
              horizontal: 'left',
              vertical: 'center',
              wrapText: true,
            },
            border: {
              top: { style: 'thin', color: { rgb: 'ff0000' } },
              right: { style: 'thin', color: { rgb: 'ff0000' } },
              bottom: { style: 'thin', color: { rgb: 'ff0000' } },
              left: { style: 'thin' },
            },
          },
        },
        {
          key: 'C16',
          value: {
            font: {
              name: '黑体',
              color: { rgb: '4b0082' },
              sz: '12',
            },
            alignment: {
              horizontal: 'left',
              vertical: 'center',
              wrapText: true,
            },
            border: {
              top: { style: 'thin', color: { rgb: 'ff0000' } },
              right: { style: 'thin', color: { rgb: 'ff0000' } },
              bottom: { style: 'thin', color: { rgb: 'ff0000' } },
              left: { style: 'thin' },
            },
          },
        },
      ];

      // exportExcle('aaa', 'shsdd', excelData, excelStyle);

      const exprotTable = (componentName, fileName, excelStyle = null) => {
        const tableData = bi.utils.getComponentData(componentName).data.tableData;
        const columns = bi.utils.getComponentData(componentName).data.columns;

        const excelData = [];
        excelData.push(columns.map(item => item.label));

        bi.utils.getComponentData(componentName).data.tableData.map(item => {
          const row = [];
          columns
            .map(item => item.prop)
            .forEach(key => {
              row.push(item[key]);
            });
          excelData.push(row);
        });
        // todo: 转换表格的样式
        exportExcle(fileName, excelData);
      };

      setTimeout(() => {
        // exprotTable('DuBtSYqvEsHVwJn', '导出表格');
      }, 3000);

      let code0 = `
export default function addAxisData(extraData) {

    //   "$this_add(this.curStyle.attrList[3].value, \"@dataIndex\", \"无\")"
    // "$this_deleteOptionItem(\"xAxis.data\", \"@dataIndex\")"

    try {
        const arr = extraData.ParameterString.split("|")
        const attr = extraData.attr
        const indexAttr = this.curStyle.attrList.find(item => item.variable === arr[1] || item.variable === arr[1].substring(1))
        if (!Array.isArray(attr.value))
            attr.value = []
        this.add(extraData.attr.value, indexAttr.value + 1, "")
    } catch (error) {
        console.log("addAxisData发生了异常");
    }

}`;

      // function anonymous(param) {
      //   const component = param.component;
      //   const event = param.event;
      //   const element = param.element;
      //   console.log('组件onClick事件', component, event, element);

      //   bi.utils
      //     .request(
      //       'http://www.emacrosys.cn:8031/H5/prod/requestVueData',
      //       `{"id":0,"action":"GB/GB_getContractList","user":{"id":"0000","siteid":"1001","userno":"0000","sitename":"苏州冠礼","cardid":"WFM600000","factoryList":"0@Unassign,1002@上海冠礼,1003@苏州二部,1001@苏州冠礼","authorization":"CPA","userid":"10000001","settings":"生管系统,工单管理,专案号维护,100555,Full Control,/GBCustomize/mPMGContract","timestamp":1690266594115},"data":{"startDate":"","endDate":"2023-07-25","contractNo":"","customer":""}}`
      //     )
      //     .then(({ data }) => {
      //       bi.utils.setComponentData('表格111', data);
      //     });
      // }

      let code1 = `(self, caller) => {
      console.log("BBB生命周期组件onBeforeCreate-self", self);
      console.log("BBB生命周期组件onBeforeCreate-caller", caller);

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
    }`;

      let code2 = `(self, caller) => {
      console.log("AAA生命周期组件onBeforeCreate-self", self);
      console.log("AAAA生命周期组件onBeforeCreate-caller", caller);


    }`;

      let codee = `function anonymous(param
) {


    const component = param.component
    const event = param.event
    const element = param.element
    console.log("组件onClick事件", component, event, element);

      bi.utils
        .request(
          'http://www.emacrosys.cn:8031/H5/prod/requestVueData',
          \`{"id":0,"message":"","action":"GB/GB_getContractList","user":{"id":"0000","name":"管理员","language":"Chinese","siteid":"1001","userno":"0000","sitename":"苏州冠礼","cardid":"WFM600000","avatar":"http://localhost:8056/video/touxiang.png","address":"苏州市","company":"XX 系統技術公司","factoryList":"0@Unassign,1002@上海冠礼,1003@苏州二部,1001@苏州冠礼","authorization":"CPA","userid":"10000001","settings":"生管系统,工单管理,专案号维护,100555,Full Control,/GBCustomize/mPMGContract","timestamp":1690178744783},"data":{"startDate":"","endDate":"2023-07-24","contractNo":"","customer":""}}\`
        )
        .then(({ data }) => {
          bi.utils.setComponentData('表格', data);
        });
}`;
      let f03 = stringToFunction(codee);

      let code3 = `"function (params) {\n      console.log(\"onBeforeCreate函数编译\", params);\n    }"`;

      let f0 = stringToFunction(code2);
      f0('测试函数1');
      let f1 = stringToFunction(code2);
      f1('测试函数2');
      let f2 = stringToFunction(code1);
      f2('测试函数3');
      let f3 = stringToFunction(code3);
      f3('测试函数没有函数体4');




      // 在js中这样调用

      if (false) {
        const ui = bi.ElementUI;
        ui.Message({
          message: 'aaa',
          type: 'error',
          duration: 300,
        });

        ui.Message.success('操作成功');
        ui.Message.warning({
          message: '警告',
          duration: 3000,
          showClose: true,
        });

        // 使用挂载的 ElementUI 调用 Button 组件
        const button = new ui.Button();
        button.text = 'Click me';
        button.onClick(() => {
          console.log('Button clicked');
        });
      }


    },
    mounted() {
    },
    methods: {},
  };
</script>

<style lang="less">
  #app {
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }
</style>
