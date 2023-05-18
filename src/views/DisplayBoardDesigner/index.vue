<template>
  <div class="home">
    <Toolbar ref="Toolbar" />

    <main>
      <!-- 左侧组件列表 -->
      <section class="left">
        <ComponentList />
      </section>
      <!-- 中间画布 -->
      <section class="center">
        <div
          class="content"
          @drop="handleDrop"
          @dragover="handleDragOver"
          @mousedown="handleMouseDown"
          @mouseup="deselectCurComponent"
        >
          <Editor v-show="canvasData.deviceType === 'pc'" />
          <MobilePreview
            ref="MobilePreview"
            v-if="canvasData.deviceType !== 'pc'"
          />
        </div>
        <div class="canvas-hint" v-html="hint"></div>
      </section>
      <!-- 右侧属性列表 -->
      <section class="right">
        <el-tabs v-model="activeName">
          <el-tab-pane label="属性" name="attr">
            <LayoutList v-if="activeComponentList.length > 1" />
            <GroupAttrList v-else-if="curComponent && curComponent.component === 'Group'" />
            <AttrList v-else-if="curComponent" />
            <p v-else class="placeholder">请选择组件</p>
          </el-tab-pane>
          <el-tab-pane label="样式" name="style">
            <StyleList
              v-if="curComponent && curComponent.component.startsWith('v-')"
            />
            <ChartStyleList
              v-else-if="
                curComponent && curComponent.component.startsWith('vc-')
              "
            />
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
  </div>
</template>

<script>
import Editor from "../../components/DataVisualEditor/components/Editor/index";
import ComponentList from "../../components/DataVisualEditor/components/ComponentList"; // 左侧列表组件
import AttrList from "../../components/DataVisualEditor/components/AttrList"; // 右侧属性列表
import GroupAttrList from "../../components/DataVisualEditor/components/GroupAttrList";
import LayoutList from "../../components/DataVisualEditor/components/LayoutList";
import StyleList from "../../components/DataVisualEditor/components/StyleConfig/CssStyleList"; // 右侧样式列表
import ChartStyleList from "../../components/DataVisualEditor/components/StyleConfig/ChartStyleList"; // 右侧图表样式列表
import AnimationList from "../../components/DataVisualEditor/components/AnimationList"; // 右侧动画列表
import EventList from "../../components/DataVisualEditor/components/EventList"; // 右侧事件列表
import MobilePreview from "../../components/DataVisualEditor/components/MobilePreview"; // 图片
import componentList, {
  getComponentSharedData,
} from "../../components/DataVisualEditor/custom-component/component-list"; // 左侧列表数据
import Toolbar from "../../components/DataVisualEditor/components/Toolbar";
import {
  deepCopy,
  selectFile,
  saveText,
  getRandStr,
} from "../../components/DataVisualEditor/utils/utils";
import { get, post } from "../../components/DataVisualEditor/utils/request";
import { mapState } from "vuex";
import generateID, {
  resetID,
} from "../../components/DataVisualEditor/utils/generateID";
import { listenGlobalKeyDown } from "../../components/DataVisualEditor/utils/shortcutKey";
import eventBus from "../../components/DataVisualEditor/utils/eventBus";
const JSONfn = require("jsonfn").JSONfn;
const LZ = require("lz-string");

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
  },
  data() {
    return {
      activeName: "attr",
      reSelectAnimateIndex: undefined,
      hint: "",
      saveConfig: {},
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
    editorHint: function (val) {
      this.hint = this.editorHint;
      setTimeout(() => {
        this.hint = "";
      }, 360000);
    },
    canvasName: function (val) {
      this.loadMobileUrl();
    },
  },
  beforeCreate() {},
  created() {
    eventBus.$on("saveEvent", this.save);
    eventBus.$on("restoreEvent", this.restore);

    // 全局监听按键事件
    listenGlobalKeyDown();
    document.title = "数据可视化编辑器";
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
  },
  methods: {
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

    handleDrop(event) {
      console.log("移动中...");
      event.preventDefault();
      event.stopPropagation();
      const index = event.dataTransfer.getData("index");
      const rectInfo = this.editor.getBoundingClientRect();
      if (index) {
        const component = deepCopy(componentList[index]);
        component.style.top = parseInt(event.clientY - rectInfo.y);
        component.style.left = parseInt(event.clientX - rectInfo.x);
        component.id = generateID();
        component.data.name = getRandStr();
        // 组件生命周期回调
        // component.events &&
        //   component.events.onBeforeCreate &&
        //   component.events.onBeforeCreate(component, this);
        this.$store.commit("addComponent", { component });
        this.$store.commit("recordSnapshot");

        this.$nextTick(() => {
          setTimeout(() => {
            // 组件生命周期回调
            // component.events &&
            //   component.events.onMounted &&
            //   component.events.onMounted(component, this);
          }, 1);
        });
      }
    },

    handleDragOver(event) {
      event.preventDefault();
      event.dataTransfer.dropEffect = "copy";
    },

    handleMouseDown(e) {
      e.stopPropagation();
      this.$store.commit("setClickComponentStatus", false);
      this.$store.commit("setInEditorStatus", true);
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
      padding-top: 10px;
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

      .content {
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
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
</style>
