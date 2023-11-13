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
            <p v-else class="placeholder">请选择组件</p>
          </el-tab-pane>
        </el-tabs>
      </section>
    </main>

    <img draggable="false" style="position: absolute;left: 0;right: 0;" id="EmbeddedComponentModeDiv" width="30"
      height="auto" src="http://127.0.0.1/files/drag.png" alt="" srcset="">

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
      CanvasElementList
    },
    data() {
      return {
        activeName: "attr",
        activeLeft: "ComponentList",
        reSelectAnimateIndex: undefined,
        saveConfig: {},
        showCanvasIocn: false
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
              data: dataSourceParameters
            }
            bi.sharedWorker.postMessage(JSON.stringify(obj))
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

        const content = document.getElementsByClassName("content")[0];
        const contentRect = content.getClientRects()[0];
        if (event.layerY < 60 && event.layerX > contentRect.width - 100) {
          this.showCanvasIocn = true
          throttle(() => {
            this.showCanvasIocn = false
          }, 6000, 'showCanvasIocn')
        } else if (event.layerY < 60 && (event.layerX > contentRect.width * 0.35 && event.layerX < contentRect.width * 0.75)) {
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
      height: calc(100% - 64px);
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
