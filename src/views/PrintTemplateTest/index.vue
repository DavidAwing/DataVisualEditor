<template>
  <div class="container">


    <div id="print-page-container3" v-if="false">
      <div>测试</div>
      <div>
        <!-- 注释节点 -->
        <p>Hello, world!</p>
        <div>1111</div>
      </div>
      <div>
        <div>
          <label>测试</label>
          <div>112</div>
        </div>
      </div>
    </div>

    <div id="page"></div>

    <!-- <div style="width: 50px; height: 1000px; background-color: red; margin-top: 1000px"></div> -->

    <!-- <div id="print-page-container"></div> -->
  </div>
</template>

<script src="monaco-editor/min/vs/loader.js"></script>
<script>
import CodeEditor from '../../components/DataVisualEditor/components/CodeEditor';
import { listenGlobalKeyDown } from '../../components/DataVisualEditor/utils/shortcutKey';
import { deepCopy, selectFile, saveText, accMul, getOneMmsPx } from '../../components/DataVisualEditor/utils/utils';
import { commitData } from '../../components/DataVisualEditor/utils/dataBinder';
import { get } from '../../components/DataVisualEditor/utils/request';
import * as DB from '../../components/DataVisualEditor/utils/indexDB';
import Vue from 'vue';
import { mapState } from 'vuex';
import axios from 'axios';
import {
  getStyle,
  getComponentRotatedStyle,
  getCanvasStyle,
  addStyleListToHead,
} from '../../components/DataVisualEditor/utils/style';

import {
  CompileToModule,
  CompileTypescriptToIIFE,
  codeToInstance,
} from '../../components/DataVisualEditor/utils/compiler';

import Shape from '../../components/DataVisualEditor/components/Editor/Shape';
import {
  print, printByTemplate, compileVueTemplate
} from '../../components/DataVisualEditor/utils/print';
import generateID, { resetID } from '../../components/DataVisualEditor/utils/generateID';
const JSONfn = require('jsonfn').JSONfn;

export default {
  name: 'PrintTemplateTest',
  data() {
    return {
      printPageHtml: '',
      dataMap: {},
      printPageComponent: null,
    };
  },
  components: { CodeEditor, Shape },
  props: {},
  computed: {
    ...mapState(['canvasData', 'canvasComponentData']),
  },
  created() {
    document.title = '打印模板编辑测试';
  },
  mounted() {

    const name = 'test'
    axios.get(`/BI-API//Print/GetPrintTemplate?name=${name}`, { timeout: 6000 }).then(({data})=> {
      printByTemplate(name, data.templateData)
    })

    // const ele = document.getElementById('print-page-container2');
    //  const printEle = ele.cloneNode(true);
    // printEle.removeAttribute('id');
    // this.printPageHtml = printEle.outerHTML;


    // const body = toHtml(require('./str.txt')).querySelector('body');
    // const pageEle = body.children.length > 1 ? body : body.children[0];
    // this.printPageHtml = pageEle.outerHTML;

    // this.TableData = require('./testData.json');

    // const ele = document.getElementById('print-page-container2');
    // const printEle = ele.cloneNode(true);
    // printEle.removeAttribute('id');
    // const printTemplateString = printEle.outerHTML;


    // const templateString = require('./TemplateString.txt');
    // const { TemplateData } = require('./TemplateData.js');
    // print(templateString, TemplateData)



    // const vueIntance = compileVuetemplate(templateEle.outerHTML, templateData.createData());

    // const printObject = toPrintObject(vueIntance.$el)
    // console.log("打印对象", printObject);

    // compileVuetemplate(templateString, templateData, '#print-page-container');

    // setTimeout(() => {
    //   const ele = document.getElementById('print-page-container');
    //   console.log('遍历', ele);
    //   // traverseHtmlTree(htmlToTree(), node => {
    //   //   console.log("移除元素", node);
    //   // });
    // }, 1500);

    return;
    const htmlTree = htmlToTree(ele);

    traverseHtmlTree(htmlTree, node => {
      console.log('遍历节点', node);
    });

    // console.log("打印-树结构", htmlToTree(ele));

    const htmlString = '<div id="test-find"> tes第v</div><p>Hello, <strong>world</strong>!</p>';
    // 创建 DOMParser 实例
    const parser = new DOMParser();
    // 解析字符串为 DOM 文档
    const doc = parser.parseFromString(htmlString, 'text/html');
    console.log('打印-解析成html', doc.querySelector('#test-find'));
    console.log('打印-树结构2', htmlToTree(doc));
  },
  methods: {
    compileTemplate(templateString, dynamicData) {
      // Compile the template string into a render function
      return Vue.extend({
        render: h =>
          h({
            template: templateString,
            data() {
              return {
                message: 'Hello, dynamically compiled component!',
              };
            },
          }),
      });
    },
  },
};

</script>
<style lang="less" scoped>
@import 'index.less';
</style>
