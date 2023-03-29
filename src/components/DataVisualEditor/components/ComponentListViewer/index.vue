<template>
  <div v-if="show" class="bg">
    <el-button class="close" @click="close" v-show="closeShow">{{
      closeText
    }}</el-button>

    <div class="hint" v-if="hintShow">{{ hint }}</div>
    <el-button class="print" id="label-print" v-show="false" v-else>{{
      hint
    }}</el-button>

    <div class="canvas-container" :id="containerId" :style="canvasData">
      <div
        v-for="(pageData, pageIndex) in pageList"
        class="canvas"
        :style="getPageStyle(pageIndex)"
        :key="'page-' + pageIndex"
      >
        <ComponentWrapper
          v-for="(item, index) in pageComponentData(pageData, pageIndex)"
          :key="'component-' + pageIndex + '-' + index"
          :config="item"
        />
      </div>
    </div>
  </div>
</template>

<script>
// 页面内容过多自动换页（个人理解是某个页面内容过多，让其换到下一张打印，而不影响后面的内容整张打印） 在style中加入page-break-after: always;

const cloneWithStyles = require("clone-with-styles");

import { getUnit } from "../../utils/style";
import { mapState } from "vuex";
import ComponentWrapper from "../Editor/ComponentWrapper";
import { changeStyleWithScale } from "../../utils/translate";
import { generateUniqueId } from "../../utils/generateID";
import htmlToPdf from "../../utils/htmlToPdf";
import { log } from "mathjs";
import toast from "../../utils/toast";
const JSONfn = require("jsonfn").JSONfn;
import printjs from "print-js";

export default {
  components: { ComponentWrapper },
  data() {
    return {
      includes: ["propValue", "uniqueId"],
      containerId: "",
      currentPage: -1,
      closeText: "关闭",
      hint: "",
      hintShow: false,
      canvasStyle: {},
      printObj: {},
      closeShow: false,
    };
  },
  model: {
    prop: "show",
    event: "change",
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    printType: {
      type: String,
      default: "",
    },
  },
  computed: {
    pageList() {
      const start = this.currentPage * this.listData.max;
      const end = this.currentPage * this.listData.max + this.listData.max;
      const list = this.listData.data.slice(start, end);
      return list;
    },
    printCount() {
      return Math.ceil(this.listData.data.length / this.listData.max);
    },
    pdfName() {
      if (this.listData.name == null || this.listData.name == "") {
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const second = date.getSeconds();
        return `${year}.${month}.${day}.${hours}.${minutes}.${second}`;
      }
      return this.listData.name;
    },
    templateDataCopy() {
      return JSONfn.stringify(this.canvasComponentData);
    },
    ...mapState([
      "canvasComponentData",
      "canvasStyleData",
      "listData",
      "currentPrintIndex",
    ]),
  },
  created() {
    this.containerId = generateUniqueId();
  },
  mounted() {},
  updated() {},
  watch: {
    show(val) {
      if (val) {
        this.closeText = "关闭";
        this.currentPage = 0;

        if (this.printType.toLowerCase() === "pdf") {
          this.hintShow = true;
          this.closeShow = true;
          this.closeText = "停止";

          if (
            this.listData == null ||
            this.listData.data == null ||
            this.listData.data.length == 0
          ) {
            toast("未导入数据, 请导入标签数据再试一试");
            this.close();
            return;
          }
          this.canvasStyle = "transform: translateX(-500%);";
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
          this.canvasStyle = { transform: "translateX(0%)" };

          this.toPrint();
        }
      }
    },
  },
  methods: {
    pageComponentData(pageData, pageIndex) {
      const componentDataCopy = JSONfn.parse(this.templateDataCopy);

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

    getPageStyle(pageIndex) {
      if (this.printType.toLowerCase() === "pdf") {
        return {
          width:
            changeStyleWithScale(this.canvasStyleData.width) +
            getUnit("width1", this.canvasStyleData.unit),
          height:
            changeStyleWithScale(this.canvasStyleData.height) +
            getUnit("height1", this.canvasStyleData.unit),
          // 'page-break-after': pageIndex == 0 ? "auto" : "always",
          // 'break-before': 'page',
          "margin-top": pageIndex == 0 ? "0px" : "15px",
        };
      } else if (this.printType.toLowerCase() === "label") {
        return {
          width:
            changeStyleWithScale(this.canvasStyleData.width) +
            getUnit("width2", this.canvasStyleData.unit),
          height:
            changeStyleWithScale(this.canvasStyleData.height) +
            getUnit("height2", this.canvasStyleData.unit),
          "margin-top": 0,
        };
      }
    },

    toPdf() {
      this.hint = `全部${this.printCount}个, 正在分析第${
        this.currentPage + 1
      }个数据, 请稍等...`;
      setTimeout(() => {
        this.$nextTick(() => {
          const ele = document.getElementById(this.containerId);
          if (ele == null) {
            toast("标签已停止生成,请检查");
            this.close();
            return;
          }
          const count = ele.children.length;
          htmlToPdf.downloadPDF3(
            ele,
            this.pdfName + ".pdf",
            this.canvasStyleData.unit,
            function (i) {
              this.hint = `标签总数量${this.listData.data.length} 当前${
                this.currentPage * this.listData.max + i + 1
              }`;
            }.bind(this),
            function () {
              this.currentPage++;
              if (this.currentPage < this.printCount) {
                this.toPdf();
              } else {
                this.close();
                this.$emit("onexit");
              }
            }.bind(this)
          );
        });
      }, 10);
    },

    toPrint() {
      const app = document.getElementById("app");
      app.setAttribute("style", "display: none;");
      document.body.setAttribute(
        "style",
        "overflow: scroll;position: relative;"
      );

      this.$nextTick(() => {
        const childs = document
          .getElementById(this.containerId)
          .getElementsByClassName("canvas");
        for (let i = childs.length - 1; i >= 0; i--) {
          const child = document.createElement("div");
          child.className = "label-div";
          //  page-break-after: always;break-before: always;
          child.setAttribute(
            "style",
            `page-break-after: always; overflow: hidden; position: relative; padding: 0; margin: 0 0 0 0; top: 0; bottom: 0; left: 0; right: 0;`
          );
          child.appendChild(childs[i]);
          document.body.insertBefore(child, document.body.firstChild);
        }

        this.$nextTick(() => {
          window.onbeforeprint = function () {};

          window.onafterprint = function () {
            document.body.setAttribute("style", "overflow: hidden;");
            app.setAttribute("style", "display:  block;");
            this.close();
            const divList = Array.from(
              document.getElementsByClassName("label-div")
            );
            for (let i = 0; i < divList.length; i++) {
              document.body.removeChild(divList[i]);
            }
            ++this.currentPage;
            this.$store.commit("setCurrentPrintIndex", this.currentPage);
            if (this.currentPage < this.printCount) {
              this.$emit("onafterprint");
            } else {
              this.$emit("onexit");
            }
          }.bind(this);

          print();
        });
      });
    },

    changeStyleWithScale,

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

.bg {
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
  padding: 20px;

  .hint {
    position: absolute;
    color: #ff0;
    font-size: 36px;
    top: 230px;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .canvas-container {
    width: calc(100% - 40px);
    height: calc(100% - 120px);
    overflow: auto;
    /* transform: translateX(-500%); */

    .canvas {
      background: #fff;
      position: relative;
      margin: auto;
    }
  }

  .close {
    position: absolute;
    right: 20px;
    top: 20px;
  }

  .print {
    position: absolute;
    left: 20px;
    top: 20px;
  }
}
</style>
