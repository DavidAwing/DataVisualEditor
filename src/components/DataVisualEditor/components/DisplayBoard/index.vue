<template>
  <div class="canvas-container">
    <div class="canvas" :style="canvasStyle">
      <ComponentWrapper
        v-for="(component, index) in canvasComponentData"
        :key="index"
        :config="component"
      />
    </div>
  </div>
</template>

<script>
const cloneWithStyles = require("clone-with-styles");

import { getCanvasStyle } from "../../utils/style";
import * as DB from "../../utils/indexDB";
import { mapState } from "vuex";
import ComponentWrapper from "../Editor/ComponentWrapper";
import { changeStyleWithScale } from "../../utils/translate";
import { generateUniqueId, resetID } from "../../utils/generateID";
import htmlToPdf from "../../utils/htmlToPdf";
import toast from "../../utils/toast";
import { getRandStr } from "../../utils/utils";
const JSONfn = require("jsonfn").JSONfn;
const schedule = require("node-schedule");
var CronJob = require("cron").CronJob;

// var job = new CronJob(
//     '* * * * * *',
//     function() {
//         console.log('You will see this message every second');
//     },
//     null,
//     true,
//     'America/Los_Angeles'
// );

export default {
  components: { ComponentWrapper },
  data() {
    return {
      includes: ["propValue", "uniqueId"],
      canvasName: null,
      id: null, //此id不为空,则可进行实时刷新
    };
  },
  model: {
    event: "change",
  },
  props: {},
  computed: {
    ...mapState(["canvasComponentData", "canvasData"]),
    templateDataCopy() {
      return JSONfn.parse(JSONfn.stringify(this.canvasComponentData));
    },
    canvasStyle() {
      return getCanvasStyle(this.canvasData);
    },
  },
  created() {
    // dev环境下支持实时数据传输
    // http://localhost:9538/sub01/#/DisplayBoardViewer?name=生产进度看板&id=test&env=dev

    this.canvasName = this.$route.query.name;
    if (!this.canvasName) {
      // todo: 显示画布列表
      toast("请设置画布名称!!!");
      return;
    }

    this.id = this.$route.query.id;
    this.env = this.$route.query.env; // prod/dev

    if (this.env === "dev" && this.id === undefined)
      this.$router.push({ query: { ...this.$route.query, id: getRandStr() } });

    // todo: id不为空的时候连接后台,远程调试
    if (this.id !== undefined) {
    }

    this.$store.commit("setCanvasName", this.canvasName);
    const getCanvasData = async (name) => {
      const canvasList = await DB.getAllItemByType("Canvas-Data");
      for (const data of canvasList)
        if (data.name == name) {
          const canvasComponentData = JSONfn.parse(data.canvasComponentData);
          const canvasData = JSONfn.parse(data.canvasData);
          // 恢复画布
          this.$store.commit(
            "setCanvasComponentData",
            this.resetID(canvasComponentData)
          );

          this.$store.commit("setCanvasData", canvasData);

          const job = schedule.scheduleJob(
            "更新数据",
            canvasData.dataSource.cron,
            () => {
              // 设置组件数据
              this.$store.commit("setCanvasComponentAttribute", [
                "data",
                {
                  ptjLrNXwDoVxaCQ: {
                    text: new Date().toJSON(),
                    name: "aaadsfs撒地方",
                  },
                },
              ]);

              console.log("执行任务Today is recognized by Rebecca Black!");
            }
          );

          // 取消任务
          // schedule.cancelJob("执行任务AAA");
          return;
        }
    };

    DB.CallbackMap.onOpenSuccess.push(async () => {
      getCanvasData(this.canvasName);
    });
  },
  mounted() {},
  updated() {},
  watch: {
    show(val) {
      if (val) {
        this.currentPage = 0;

        if (this.printType.toLowerCase() === "pdf") {
          this.hintShow = true;
          this.closeShow = true;

          if (
            this.listData == null ||
            this.listData.data == null ||
            this.listData.data.length == 0
          ) {
            toast("未导入数据, 请导入标签数据再试一试");
            this.close();
            return;
          }
          this.canvasData = "transform: translateX(-500%);";
          setTimeout(() => {
            this.toPdf();
          }, 100);
        } else if (this.printType.toLowerCase() === "label") {
          if (
            this.listData == null ||
            this.listData.data == null ||
            this.listData.data.length == 0
          ) {
            toast("未导入数据, 请导入标签数据再试一试");
            this.close();
            return;
          }

          if (this.currentPrintIndex >= this.printCount) {
            this.currentPage = 0;
          } else {
            this.currentPage = this.currentPrintIndex;
          }

          this.hintShow = false;
          this.closeShow = false;
          this.hint = "打印";
          this.canvasData = { transform: "translateX(0%)" };

          this.toPrint();
        }
      }
    },
  },

  methods: {
    changeStyleWithScale,

    resetID,

    pageComponentData(pageData, pageIndex) {
      const componentDataCopy = this.templateDataCopy;

      for (let i = 0; i < componentDataCopy.length; i++) {
        const item = componentDataCopy[i];
        const keys = Object.keys(item);

        for (let j = 0; j < keys.length; j++) {
          if (!this.includes.includes(keys[j])) {
            continue;
          }

          if (
            typeof item[keys[j]] === "string" &&
            /\[\w+\]/.test(item[keys[j]])
          ) {
            const placeholderList = item[keys[j]].match(/\[\w+\]/g);
            for (let k = 0; k < placeholderList.length; k++) {
              const variableName =
                placeholderList[k].match(/(?<=\[)(\w+)(?=])/g); // 匹配以 '[' 开头以 ']' 结尾,但不包含

              if (Array.isArray(pageData[variableName])) {
                throw Error("数据类型错误, 数组类型无法解析");
              }

              if (typeof pageData[variableName] !== "object") {
                item[keys[j]] = item[keys[j]].replace(
                  placeholderList[k],
                  pageData[variableName]
                    ? pageData[variableName]
                    : placeholderList[k]
                );
              }
            }
            continue;
          } else if (typeof item[keys[j]] === "object" && false) {
            continue;
          }

          if (keys[j] == "uniqueId") {
            componentDataCopy[i]["uniqueId"] =
              componentDataCopy[i]["uniqueId"] + "-" + pageIndex + "-" + i;
            continue;
          }
        }
      }

      return componentDataCopy;
    },

    close() {
      this.$emit("change", false);
    },
  },
};

//  page-break-after: avoid;
// page-break-after: always;
// @media print {}
</script>

<style lang="less" scoped>
@page {
  margin: 0;
}

.canvas-container {
  /* width: calc(100% - 40px);
  height: calc(100% - 120px);
  overflow: auto;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  position: fixed;
  background: rgba(0, 0, 0, 0.8);
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: auto;
  padding: 20px; */

  /* transform: translateX(-500%); */

  /* .canvas {
    background: #fff;
    position: relative;
    margin: auto;
  } */
}
</style>
