<template>
  <div class="container">
    <el-image
      style="width: 100%; height: 100%"
      :src="element.data.image"
      :fit="element.data.fit"
    ></el-image>
  </div>
</template>

<script>
import ComponentBase from "./ComponentBase";
import eventBus from "../utils/eventBus";
import { mapState } from "vuex";
import { getUnit } from "../utils/style";
import { changeStyleWithScale } from "../utils/translate";

export default {
  extends: ComponentBase,
  data() {
    return {};
  },
  props: {},
  computed: {
    ...mapState(["canvasData"]),
    styleKeys() {
      if (this.$store.state.curComponent) {
        const curComponentStyleKeys = Object.keys(
          this.$store.state.curComponent.style
        );
        return this.styleData.filter((item) =>
          curComponentStyleKeys.includes(item.key)
        );
      }
      return [];
    },
    curComponent() {
      return this.$store.state.curComponent;
    },
  },
  created() {
    eventBus.$on("onFillCanvas", (name, value) => {
      if (name !== this.element.name) return;

      if (value === "fill") {
        this.element.style.top = 0;
        this.element.style.left = 0;
        this.element.style.width = this.canvasData.width;
        this.element.styleUnit.width = getUnit("width", this.canvasData.unit);
        this.element.style.height = this.canvasData.height;
        this.element.styleUnit.height = getUnit("height", this.canvasData.unit);
      } else if (value === "horizontal") {
        this.element.style.left = 0;
        this.element.style.width = this.canvasData.width;
        this.element.styleUnit.width = getUnit("width", this.canvasData.unit);
      } else if (value === "vertical") {
        this.element.style.top = 0;
        this.element.style.height = this.canvasData.height;
        this.element.styleUnit.height = getUnit("height", this.canvasData.unit);
      }
    });
  },
  watch: {
    element: {
      handler: function (val) {
        // if (
        //   val.imgScaledWidth != this.$refs.img.width ||
        //   val.imgScaledHeight != this.$refs.img.height
        // ) {
        //   val.imgScaledWidth = this.$refs.img.width;
        //   val.imgScaledHeight = this.$refs.img.height;
        // }
      },
      deep: true,
    },
  },
};
</script>

<style lang="less" scoped>
.container {
  width: 100%;
  height: 100%;
  display: flex;
  overflow: auto;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
}

/* img {
  width: 100%;
  height: auto;


    width: 100%;
    height: auto;
    max-width: 100%;
    max-height: 100%;


  position: absolute;
    top: 50%;
    left: 50%;
    display: block;
    min-width: 100%;
    min-height: 100%;
    transform: translate(-50%, -50%);
} */
</style>
