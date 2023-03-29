<template>
  <div class="container" :style="getLabelWrapperStyle()">
    <DisplayBoard
      v-model="isShowPreview"
      @change="handlePreviewChange"
      :data="labelData"
      :scale="scale"
      :background="background"
    />
  </div>
</template>

<script>
import DisplayBoard from "../../components/DataVisualEditor/components/DisplayBoard";
import { listenGlobalKeyDown } from "../../components/DataVisualEditor/utils/shortcutKey";
import {
  deepCopy,
  selectFile,
  saveText,
  accMul,
  getOneMmsPx,
} from "../../components/DataVisualEditor/utils/utils";
import { get } from "../../components/DataVisualEditor/utils/request";

import generateID, {
  resetID,
} from "../../components/DataVisualEditor/utils/generateID";
const JSONfn = require("jsonfn").JSONfn;

export default {
  name: "LabelViewer",
  data() {
    return {
      isShowPreview: true,
      labelData: {},
      scale: 100,
      background: "#FFFFF0",
      alignType: {
        justifyContent: "flex-start",
        alignItems: "flex-start",
      },
    };
  },
  components: { DisplayBoard },
  props: {},
  computed: {},
  created() {
    this.restore();
    // 全局监听按键事件
    listenGlobalKeyDown();
    document.title = "预览标签";
  },
  mounted() {},
  methods: {
    getLabelWrapperStyle() {
      return this.alignType;
    },

    handlePreviewChange() {
      this.$store.commit("setEditMode", "edit");
    },

    restore() {
      if (
        JSONfn.stringify(this.$route.query) == "{}" ||
        this.$route.query.labelPath == undefined
      ) {
        console.warn("标签模板路径缺失");
        return;
      }

      if (this.$route.query.labelData != undefined)
        this.labelData = JSONfn.parse(this.$route.query.labelData);
      if (this.$route.query.scale != null)
        this.scale = parseFloat(this.$route.query.scale);
      else this.scale = 0;
      const background = this.$route.query.background;
      if (background == null || background == "grid") this.background = "grid";
      else if (
        background.startsWith("#") ||
        background.startsWith("rgb(") ||
        background.startsWith("rgba(")
      )
        this.background = background;
      else if (background.startsWith("{") && background.endsWith("}"))
        this.background = JSON.parse(background);
      else this.background = "grid";

      const labelTemplateUrl =
        "/H5/GetFile?type=0&path=" + this.$route.query.labelPath;
      get(labelTemplateUrl).then((res) => {
        const labelTemplate = res.data;
        const canvas = labelTemplate;

        // 用保存的数据恢复画布
        if (
          typeof canvas.canvasData === "string" &&
          typeof canvas.canvasData === "string"
        ) {
          const canvasData = JSONfn.parse(canvas.canvasData);

          let w;
          let h;
          if (canvasData.unit == "mm") {
            w = accMul(getOneMmsPx(), Number(canvasData.width));
            h = accMul(getOneMmsPx(), Number(canvasData.height));
          } else if (canvasData.unit == "px") {
            w = canvasData.height;
            h = canvasData.height;
          }

          const clientWidth = document.body.clientWidth;
          const clientHeight = document.body.clientHeight;
          const margin = 2;

          // 自适应缩放
          if (this.scale == 0) {
            let adaptHeight = 0;
            let adaptWidth = 0;

            const widthScale = clientWidth / w;
            const heightScale = clientHeight / h;

            if (
              widthScale * w - margin < clientWidth &&
              widthScale * h - margin < clientHeight
            ) {
              this.scale = widthScale * 100;
            } else if (
              heightScale * w - margin < clientWidth &&
              heightScale * h - margin < clientHeight
            ) {
              this.scale = heightScale * 100;
            } else {
              this.scale = 100;
              console.warn("自适应计算错误");
            }

            this.alignType = {
              justifyContent: "center",
              alignItems: "center",
            };
          } else {
            if (
              (this.scale / 100) * w - margin < clientWidth &&
              (this.scale / 100) * h - margin > clientHeight
            ) {
              this.alignType = {
                justifyContent: "center",
                alignItems: "flex-start",
              };
            } else if (
              (this.scale / 100) * w - margin > clientWidth &&
              (this.scale / 100) * h - margin < clientHeight
            ) {
              this.alignType = {
                justifyContent: "flex-start",
                alignItems: "center",
              };
            } else if (
              (this.scale / 100) * w - margin < clientWidth &&
              (this.scale / 100) * h - margin < clientHeight
            ) {
              this.alignType = {
                justifyContent: "center",
                alignItems: "center",
              };
            } else {
              this.alignType = {
                justifyContent: "flex-start",
                alignItems: "flex-start",
              };
            }
          }

          this.$store.commit(
            "setCanvasComponentData",
            this.resetID(JSONfn.parse(canvas.canvasData))
          );
          this.$store.commit("setCanvasData", canvasData);
        } else {
          toast("标签模板数据错误");
        }
      });
    },

    resetID,
  },
};
</script>

<style lang="less" scoped>
@import "index.less";
</style>
