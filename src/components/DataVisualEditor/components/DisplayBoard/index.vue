<template>
  <div class="canvas-container">
    <div class="canvas" :style="canvasStyle">

      <template v-for="(item, index) in canvasComponentData">
        <component-dialog v-if="item.data.isModal" :key="item.id" :visible.sync="item.data.show" width="35%"
          :element="item" v-el-drag-dialog center
          :before-close="done=>handleComponentDialogBeforeClose(done,$event, item)"
          @mousedown.native="onDialogWrapperMousedown($event, item)" @mouseup.native="onDialogWrapperMouseup($event,item)">
          <ComponentWrapper :key="index" :config="item" />
        </component-dialog>
        <ComponentWrapper v-else :key="index" :config="item" />
      </template>

    </div>
  </div>
</template>

<script>
  const cloneWithStyles = require("clone-with-styles");

  import { getCanvasStyle } from "../../utils/style";
  import { requestCanvasData } from "../../utils/dataBinder";
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
  import elDragDialog from '../../directive/el-drag-dialog';
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
    directives: {
      elDragDialog,
    },
    components: { ComponentWrapper },
    data() {
      return {
        includes: ["propValue", "uniqueId"],
        id: null, //todo 此id不为空,则可进行实时刷新,
        // canvasName: "",
      };
    },
    model: {
      event: "change",
    },
    props: {},
    computed: {
      ...mapState(["canvasComponentData", "canvasData", "canvasName"]),
      templateDataCopy() {
        return JSONfn.parse(JSONfn.stringify(this.canvasComponentData));
      },
      canvasStyle() {
        return getCanvasStyle(this.canvasData);
      },
    },
    created() {
      // dev环境下支持实时数据传输
      // http://localhost:9538/bi/#/DisplayBoardViewer?name=生产进度看板&id=test&env=dev

      const canvasName = this.$route.query.name;
      if (!canvasName) {
        // todo: 显示画布列表
        toast("请设置画布名称!!!");
        return;
      }

      DB.CallbackMap.onOpenSucceedEventList.push(() => {
        // 数据库开启后渲染数据
        requestCanvasData.bind(this)(canvasName, (isSuccess, data) => {
          toast(data.message);
        });
      });

      this.id = this.$route.query.id;
      this.env = this.$route.query.env; // prod/dev

      if (this.env === "dev" && this.id === undefined)
        this.$router.push({ query: { ...this.$route.query, id: getRandStr() } });

      // todo: id不为空的时候连接后台,远程调试
      if (this.id !== undefined) {
      }
    },
    mounted() { },
    updated() { },
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

      onDialogWrapperMousedown(event, component) {
        if (!component.data.isDrag) {
          return
        }
        bi.utils.makeDraggable(event)
      },

      onDialogWrapperMouseup(event, component) {

      },

      handleComponentDialogBeforeClose(done, event, component) {
        done(false)

        setTimeout(() => {
          done(true)
        }, 1000);
      }
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
