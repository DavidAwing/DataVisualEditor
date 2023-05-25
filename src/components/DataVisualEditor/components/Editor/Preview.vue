<template>
  <div v-if="show" class="bg">
    <el-button class="close" @click="close">关闭</el-button>
    <div class="canvas-container">
      <div
        class="canvas"
        :style="getCanvasStyle(canvasData)"
      >
        <ComponentWrapper
          v-for="(item, index) in canvasComponentData"
          :key="index"
          :config="item"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { getCanvasStyle } from "../../utils/style";
import { mapState } from "vuex";
import ComponentWrapper from "./ComponentWrapper";
import { changeStyleWithScale } from "../../utils/translate";

export default {
  components: { ComponentWrapper },
  model: {
    prop: "show",
    event: "change",
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  computed: mapState(["canvasComponentData", "canvasData"]),
  methods: {
    getCanvasStyle,
    changeStyleWithScale,

    close() {
      this.$emit("change", false);
    },
  },
};
</script>

<style lang="less" scoped>
.bg {
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  position: fixed;
  background: rgb(0, 0, 0, 0.5);
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: auto;
  padding: 20px;

  .canvas-container {
    width: calc(100% - 40px);
    height: calc(100% - 120px);
    overflow: auto;

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
}
</style>
