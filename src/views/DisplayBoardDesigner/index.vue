<template>
  <div class="home">
    <Toolbar ref="Toolbar" />
    <main>
      <!-- 左侧组件列表 -->
      <section class="left">
        <el-tabs v-model="activeLeft">
          <el-tab-pane label="组件" name="ComponentList">
            <ComponentList />
          </el-tab-pane>
          <el-tab-pane label="列表" name="Canvas">
            <CanvasElementList />
          </el-tab-pane>
        </el-tabs>
      </section>
      <!-- 中间画布 -->
      <section class="center">
        <div class="content" @drop="handleDrop" @dragover="handleDragOver" @mousedown="handleMouseDown"
          @mousemove="handleMouseMove" @mouseup="deselectCurComponent">
          <Editor v-show="canvasData.deviceType === 'pc'" />
          <MobilePreview ref="MobilePreview" v-if="canvasData.deviceType !== 'pc'" />
        </div>
        <div class="canvas-hint" v-html="editorHint"></div>
        <div class="canvas-iocn-container" v-show="showCanvasIocn">
          <img class="canvas-iocn" src="../../assets/maximize.png" @click="maximize"></img>
          <img class="canvas-iocn" src="../../assets/publish.png" @click="openPublishingPage"></img>
        </div>
        <div style="position: relative; margin-top: 8px;width: 80%;left: 10%;display: flex;justify-content: center;">
          <div style="display: flex;flex-flow: row nowrap; justify-content: center;align-items: center;
          background-color:  rgba(0, 0, 0, 0.3);  width: fit-content; padding: 0px 22px;border-radius: 5px;">
            <div v-for="item in topIntelligentMenu.children" :class="'top-intelligent-menu-item ' +  (item.className)"
              v-show="item.show" @click="handleTopMenu(item.name)">
              <img draggable="false" :width="(item.width || topIntelligentMenu.width) * 0.7" height="auto"
                :src="item.img" alt="" srcset="">
            </div>
          </div>
        </div>
      </section>
      <!-- 右侧属性列表 -->
      <section class="right">
        <el-tabs v-model="activeName">
          <el-tab-pane label="属性" name="attr">
            <LayoutList v-if="activeComponentList.length > 0" />
            <!-- <GroupAttrList
              v-else-if="curComponent && curComponent.component === 'Group'"
            /> -->
            <AttrList v-else-if="curComponent" />
            <p v-else class="placeholder">请选择组件</p>
          </el-tab-pane>
          <el-tab-pane label="样式" name="style">
            <StyleList
              v-if="curComponent && (curComponent.component.startsWith('v-') ||  curComponent.component === 'Group' )" />
            <ChartStyleList v-else-if="curComponent && curComponent.component.startsWith('vc-') && false" />
            <p v-else class="placeholder">请选择组件</p>
          </el-tab-pane>
          <el-tab-pane label="动画" name="animation">
            <AnimationList v-if="curComponent" />
            <p v-else class="placeholder">请选择组件</p>
          </el-tab-pane>
          <el-tab-pane label="事件" name="events">
            <EventList v-if="curComponent" />
            <div v-else style="overflow-y: hidden;overflow-x: hidden;">
              <p class="placeholder add-global-event"
                @click="if(!canvasName) return;globalEventDialogVisible = true;setGlobalEventDialog()">
                点我添加全局事件
              </p>
            </div>
          </el-tab-pane>
        </el-tabs>
      </section>
    </main>

    <img draggable="false" style="position: absolute;left: 0;right: 0;" id="EmbeddedComponentModeDiv" width="30"
      height="auto" src="http://127.0.0.1/files/drag.png" alt="" srcset="">

    <top-el-dialog title="编辑全局事件" :visible.sync="globalEventDialogVisible" width="65vw" v-el-drag-dialog top="3vh"
      class="global-event-dialog">
      <div class="block event-list" style="height: 75vh;">
        <js-editor ref="jsEditor" :onEditCode="onEditCode" />
      </div>
      <span slot="footer" class="dialog-footer">
        <!-- <el-button @click="globalEventDialogVisible = false">关 闭</el-button> -->
        <el-button type="primary" @click="runCode($refs.jsEditor.getSelectedCode())">运 行</el-button>
      </span>
    </top-el-dialog>

    <el-dialog title="代码运行控制台" :visible.sync="runCodeDialogVisible">
      <div>
        <el-input type="textarea" :rows="30" placeholder="" v-model="codeRunData">
        </el-input>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import Editor from "../../components/DataVisualEditor/components/Editor/index";
  import ComponentList from "../../components/DataVisualEditor/components/ComponentList"; // 左侧列表组件
  import CanvasElementList from "../../components/DataVisualEditor/components/CanvasElementList"; // 左侧画布元素列表
  import AttrList from "../../components/DataVisualEditor/components/AttrList"; // 右侧属性列表
  import GroupAttrList from "../../components/DataVisualEditor/components/GroupAttrList";
  import LayoutList from "../../components/DataVisualEditor/components/LayoutList";
  import StyleList from "../../components/DataVisualEditor/components/StyleConfig/CssStyleList"; // 右侧样式列表
  import ChartStyleList from "../../components/DataVisualEditor/components/StyleConfig/ChartStyleList"; // 右侧图表样式列表
  import AnimationList from "../../components/DataVisualEditor/components/AnimationList"; // 右侧动画列表
  import EventList from "../../components/DataVisualEditor/components/EventList"; // 右侧事件列表
  import MobilePreview from "../../components/DataVisualEditor/components/MobilePreview"; // 图片
  import componentList, {
    getComponentSharedData, userComponentList
  } from "../../components/DataVisualEditor/custom-component/component-list"; // 左侧列表数据
  import Toolbar from "../../components/DataVisualEditor/components/Toolbar";
  import {
    deepCopy,
    selectFile,
    saveText,
    getRandStr,
    throttle
  } from "../../components/DataVisualEditor/utils/utils";
  import { get, post } from "../../components/DataVisualEditor/utils/request";
  import { mapState } from "vuex";
  import generateID, {
    resetID,
  } from "../../components/DataVisualEditor/utils/generateID";
  import { listenGlobalKeyDown } from "../../components/DataVisualEditor/utils/shortcutKey";
  import eventBus from "../../components/DataVisualEditor/utils/eventBus";
  import * as DB from '../../components/DataVisualEditor/utils/indexDB';
  const JSONfn = require("jsonfn").JSONfn;
  const LZ = require("lz-string");
  import axios from 'axios';
  import { saveCanvas } from '../../components/DataVisualEditor/components/MenuHandler';

  import JsEditor from '../../components/DataVisualEditor/components/EventList/JsEditor';

  // http://127.0.0.1:9538/#/DataVisualEditor?type=print&max=100&labelName=SN&labelPath=C%3A%5CMES_upload_file%5CLabel%5CSN.label&sqlPath=N%2FA&printData=%22C%3A%5C%5CMES_upload_file%5C%5CLabel%5C%5CTemp%5C%5C445bdeab-85e3-4f29-aa07-ae453078f177.tmp%22&id=0000&name=undefined&language=undefined&siteid=2035&userno=0000&sitename=HS1&cardid=undefined&address=undefined&authorization=undefined&userid=20000063

  export default {
    components: {
      Editor,
      ComponentList,
      AttrList,
      LayoutList,
      AnimationList,
      EventList,
      Toolbar,
      StyleList,
      ChartStyleList,
      MobilePreview,
      GroupAttrList,
      CanvasElementList,
      JsEditor
    },
    data() {
      return {
        activeName: "attr",
        activeLeft: "ComponentList",
        reSelectAnimateIndex: undefined,
        saveConfig: {},
        showCanvasIocn: false,
        globalEventDialogVisible: false,
        updateGlobalEventCode: '',
        runCodeDialogVisible: false,
        codeRunData: ``
      };
    },
    computed: mapState([
      "canvasComponentData",
      "canvasData",
      "listData",
      "curComponent",
      "isClickComponent",
      "editor",
      "editorHint",
      "canvasName",
      "activeComponentList",
      "topIntelligentMenu"
    ]),
    watch: {
      canvasData: {
        handler: function (val, old) {
          if (val.deviceType !== "pc") this.loadMobileUrl();

          this.$nextTick(() => {
            const ele = document.getElementById("editor");
            this.$store.commit(
              "setEditorHint",
              `${ele.clientWidth} * ${ele.clientHeight} px`
            );
          });
        },
        deep: true,
      },
      canvasName: function (val) {
        this.loadMobileUrl();
      },
      globalEventDialogVisible: function (val) {
        if (!val) {
          this.updateGlobalEvent()
        } else {
          axios.get(`/BI-API/Component/GetCanvasTemplateGlobalEvent?name=${this.canvasName}`).then(({ data }) => {
            if (data.state != 200)
              return
            this.updateGlobalEventCode = data.data
            this.$refs.jsEditor.updateDoc(this.updateGlobalEventCode);
          })
        }
        bi.data.set('isShowEvent', val)
      }
    },
    beforeCreate() {
      document.title = "数据可视化编辑器";
    },
    created() {
      eventBus.$on("saveEvent", this.save);
      eventBus.$on("restoreEvent", this.restore);

      // 全局监听按键事件
      listenGlobalKeyDown()
    },
    mounted() {
      console.log("document.body.offsetwidth", document.body.offsetwidth);
      const ele = document.getElementById("editor");
      this.$store.commit(
        "setEditorHint",
        `${ele.clientWidth} * ${ele.clientHeight} px`
      );
      var demo1_w = window.getComputedStyle(ele).getPropertyValue("width");
      var demo1_h = window.getComputedStyle(ele).getPropertyValue("height");
      $('#EmbeddedComponentModeDiv').css('display', 'none')
    },
    methods: {

      async runCode(code) {
        if (!code || !code.trim()) {
          toast('请选取需要运行的代码')
          return
        }
        this.runCodeDialogVisible = true
        this.codeRunData = ''
        const overrideConsoleLog = () => {
          const consoleLog = console.log;
          console.log = (...args) => {
            // const logOutput = args.map(arg => stringify(arg)).join(' ');
            args.forEach(arg => {
              try {
                this.codeRunData += JSONfn.stringify(arg) + '  '
              } catch (error) {
                this.codeRunData += `---------- 异常 ----------\nname: ${error.name}\nmessage: ${error.message}\nmessage: ${error.stack}\narg:${arg}\n\n`
              }
            })
            this.codeRunData += '\n'
            consoleLog.apply(console, args);
          };
          return consoleLog
        }
        if (location.href.includes('/editor')) {
          const log = window.log
          window.log = (...args) => {
            args.forEach(arg => {
              try {
                this.codeRunData += JSONfn.stringify(arg) + '  '
              } catch (error) {
                this.codeRunData += `\n⭒----------⭒*.✩.*⭒ log异常 ⭒*.✩.*⭒----------👇\nname: ${error.name}\nmessage: ${error.message}\nstack: ${error.stack}\n\n`
              }
            })
            this.codeRunData += '\n'
          }
        }
        try {
          let result = null
          const list = code.split('\n').filter(line => line.trim()).map(line => line.includes('//') ? line.substring(0, line.indexOf('//')) : line)
          if (code.includes('await ')) {
            const lastLine = list[list.length - 1].trim()
            list[list.length - 1] = (lastLine.startsWith('return ')
              || lastLine.startsWith('var')
              || lastLine.startsWith('const')
              || lastLine.startsWith('let')
              || lastLine.startsWith(')')
              || lastLine.startsWith('(')
              || lastLine.startsWith('}')
              || lastLine.startsWith('{')
              || lastLine.startsWith('||')
              || lastLine.startsWith('&&')
              || lastLine.startsWith('=')
              || lastLine.startsWith('!=')
            ) ? lastLine : 'return ' + lastLine
            result = await eval(`(async () => { ${list.join('\n')} })()`);
          } else {
            result = eval(list.join('\n'));
          }
          if (result)
            this.codeRunData += JSONfn.stringify(result) + '\n'
        } catch (error) {
          this.codeRunData += `\n⭒----------⭒*.✩.*⭒ 代码解析异常 ⭒*.✩.*⭒----------👇\nname: ${error.name}\nmessage: ${error.message}\nstack: ${error.stack}\n\n`
        } finally {
          setTimeout(() => {
            window.log = log
          }, 300);
        }
      },

      updateGlobalEvent() {
        axios.post(`/BI-API/Component/SaveCanvasTemplateGlobalEvent?name=${this.canvasName}`,
          this.updateGlobalEventCode,
          {
            headers: {
              'Content-Type': 'text/plain',
            },
          }).then(({ data }) => {
            if (data.state != 200) {
              toast('全局事件保存失败: ' + data.message)
              return
            }
            const obj = {
              action: 'updateGlobalEvent',
              urls: `any`,
              data: { canvasName: this.canvasName }
            }
            bi.sharedWorker.postMessage(obj)
          }).catch(error => {
            console.warn('保存全局事件异常', error);
          });
      },

      onEditCode() {
        this.updateGlobalEventCode = this.$refs.jsEditor.getCode();
      },

      setGlobalEventDialog() {
        this.$nextTick(() => {
          const dialogBody = document.querySelector('.global-event-dialog .el-dialog__body')
          if (dialogBody == null)
            return
          $(dialogBody).css('padding', '10px 15px')
        })
      },

      handleTopMenu(name) {
        eventBus.$emit('TopMenu.' + name)
      },

      loadMobileUrl() {
        if (this.$refs.MobilePreview === undefined) {
          setTimeout(() => {
            this.loadMobileUrl();
          }, 200);
          return;
        }
        const mobileUrl = `${process.env.VUE_APP_BASE_URL}#/viewer?name=${this.canvasName}`;
        this.$refs.MobilePreview.load(this.canvasData.deviceType, mobileUrl);
      },

      isShowStyle(type, curComponent) {
        if (!curComponent) return false;

        if (type === "css" && curComponent.component.startsWith("v-")) {
          return true;
        } else if (type === "chart" && curComponent.component.startsWith("vc-")) {
          return true;
        } else {
          console.log("不知道是什么类型的样式", type, curComponent);
          return false;
        }

        // if (
        //   chartComponentList.includes(curComponent.component) &&
        //   type === "chart"
        // ) {
        //   console.log("显示AAA");
        //   return true;
        // } else if (type === "css") {
        //   return true;
        // } else {
        //   return false
        // }
      },

      save(name, canvasEditorData) {
        return;

        canvasEditorData.desc = this.saveConfig.labelDesc;
        const query = this.$route.query;

        const data = {
          action: "saveLabel",
          desc: this.saveConfig.labelDesc,
          label: canvasEditorData,
          labelName: name,
          labelPath: this.saveConfig.labelPath,
        };

        const user = {
          id: query.id,
          name: query.name,
          language: query.language,
          siteid: query.siteid,
          userno: query.userno,
          sitename: query.sitename,
          cardid: query.cardid,
          address: query.address,
          authorization: query.authorization,
          userid: query.userid,
        };

        let postData = {
          id: 0,
          message: "",
          action: "uploadLabelFile",
          user: user,
          data: data,
        };
        post("/H5/prod/requestVueData", postData, { timeout: 60000 })
          .then(({ data }) => {
            if (data.code == 200) {
              toast("可视化看板保存成功...", "success");
            } else {
              toast("可视化看板保存异常: " + data.message);
            }
          })
          .catch((error) => {
            toast("可视化看板保存失败: " + error.toString());
          });
      },

      restore(canvasName, data) {
        if (!canvasName || !data) {
          console.warn("空的画布数据");
          return;
        }
      },

      resetID,

      async handleDrop(event) {

        console.log("放下组件", event);

        event.preventDefault();
        event.stopPropagation();
        const index = event.dataTransfer.getData("index");
        const from = event.dataTransfer.getData("from");
        const rectInfo = this.editor.getBoundingClientRect();
        if (index) {
          let component = null
          if (from === 'ComponentMarket') {
            component = deepCopy(userComponentList.find(item => item.name === index) || userComponentList.find(item => item.data.name === index));
          } else {
            component = deepCopy(componentList[index]);
          }


          if (component.component === 'Group') {
            component.propValue.forEach(item => {
              item.id = generateID();
              item.data.name = getRandStr();
            });
          }
          component.style.top = parseInt(event.clientY - rectInfo.y);
          component.style.left = parseInt(event.clientX - rectInfo.x);
          component.id = generateID();

          // 是组件市场的,需要把数据源的名称修改过来
          const oldName = component.data.name
          component.data.name = getRandStr();
          if (from === 'ComponentMarket') {

            const parameters = JSONfn.parse(this.canvasData.dataSource.parameters || '[]')

            if (component.dataSourcelist) {
              for (const item of component.dataSourcelist) {

                if (item.componentName === oldName) {

                } else if (item.dataSourceType === "database") {
                  const regexp = new RegExp(`@NAME\\s+${oldName}`, 'i')
                  if (!regexp.test(item.sql)) {
                    continue
                  }
                  item.sql = item.sql.replace(regexp, `@NAME ${component.data.name}`)
                } else {
                  continue
                }

                let id = 0
                while (parameters.find(item => item.id === id)) {
                  id++
                }
                item.id = id
                item.name = item.name + "_" + parameters.length;
                parameters.push(item)
              }

              delete component.dataSourcelist
            }

            delete component.icon
            delete component.details
            delete component.name
            delete component.permission

            const dataSourceParameters = JSONfn.stringify(parameters);
            this.$set(this.canvasData.dataSource, 'parameters', dataSourceParameters)
            DB.setItem(`bi-user-canvas-data-source-${this.canvasName}`, dataSourceParameters);

            axios
              .post(`/BI-API/DataSource/SaveCanvasDataSourceList`, parameters, {
                params: { userId: bi.uid, canvasName: this.canvasName },
              })

            const obj = {
              action: 'emitEvent',
              urls: [`/DatasourceEditor?name=${this.canvasName}`],
              name: 'setCanvasDataSourceList',
              data: parameters
            }
            bi.sharedWorker.postMessage(obj)
          }


          if (event.target.dataset.onDrop) {

          } else {
            this.$store.commit("addComponent", { component });
          }

          this.$store.commit("recordSnapshot");
        }
      },

      handleDragOver(event) {
        event.preventDefault();
        event.dataTransfer.dropEffect = "copy";
      },

      handleMouseDown(event) {
        event.stopPropagation();
        this.$store.commit("setClickComponentStatus", false);
        this.$store.commit("setInEditorStatus", true);
      },

      handleMouseMove(event) {

        const left = document.querySelector("#app > div > main > section.left").offsetWidth
        const top = document.querySelector("#app > div > div > div.toolbar").offsetHeight
        const position = bi.$(event.target).position()

        const content = document.getElementsByClassName("content")[0];
        const contentRect = content.getClientRects()[0];
        if (event.layerY < 60 && event.layerX > contentRect.width - 100) {
          this.showCanvasIocn = true
          throttle(() => {
            this.showCanvasIocn = false
          }, 6000, 'showCanvasIocn')
        } else if (event.layerY + position.top - top < 60 && (event.layerX + position.left > contentRect.width * 0.35 && event.layerX + position.left < contentRect.width * 0.75)) {
          eventBus.$emit('TopMenu.setTopMenuShow', 1)
        }
      },

      maximize() {
        const editor = document.getElementById("editor");
        editor.requestFullscreen()
      },

      openPublishingPage() {
        window.open(`/bi/#/viewer?name=${this.canvasName}`, '_blank')
      },

      deselectCurComponent(e) {
        if (!this.isClickComponent) {
          this.$store.commit("setCurComponent", { component: null, index: null });
        }

        // 0 左击 1 滚轮 2 右击
        if (e.button != 2) {
          this.$store.commit("hideContextMenu");
        }
      },
    },
  };
</script>

<style lang="less">
  .home {
    height: 100vh;
    background: #fff;

    main {
      height: calc(100% - 47px);
      position: relative;

      .left {
        position: absolute;
        height: 100%;
        width: 200px;
        left: 0;
        top: 0;
        padding-top: 0px;

        & .el-tabs__content {
          overflow: scroll;

          &::-webkit-scrollbar {
            width: 0;
            border: none;
          }

          &::-webkit-scrollbar-track {
            border: none;
          }
        }
      }

      .right {
        position: absolute;
        height: 100%;
        width: 262px;
        right: 0;
        top: 0;


      }

      .center {
        position: relative;
        margin-left: 200px;
        margin-right: 262px;
        background: #f5f5f5;
        height: 100%;
        padding: 0px;
        overflow: hidden;

        .canvas-hint {
          position: absolute;
          top: 1px;
          left: 6px;
          width: 100%;
          text-align: start;
          font-size: 13px;
          color: rgba(0, 0, 0, 0.6);
        }

        .canvas-iocn-container {
          position: absolute;
          right: 16px;
          top: 6px;
          display: flex;
          flex-flow: column nowrap;

          .canvas-iocn {
            width: 16px;

            &:not(:nth-child(1)) {
              margin-top: 6px;
            }
          }
        }

        .content {
          position: absolute;
          left: 0px;
          top: 0px;
          right: -2px;
          bottom: 8px;
          overflow: auto;
        }
      }
    }

    .placeholder {
      text-align: center;
      color: #333;
    }
  }

  @import "index.less";
</style>
