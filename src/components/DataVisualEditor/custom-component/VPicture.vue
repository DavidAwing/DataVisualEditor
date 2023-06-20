<template>
  <div class="container">
    <el-image
      style="width: 100%; height: 100%"
      :src="src"
      :fit="element.data.fit"
    ></el-image>
  </div>
</template>

<script>
import ComponentBase from "./ComponentBase";
import eventBus from "../utils/eventBus";
import { mapState } from "vuex";
// import {  } from "../utils/style";
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
    src() {
      if (this.element.data.imageUrl !== undefined && this.element.data.imageUrl !== null && this.element.data.imageUrl.trim() !== "") {
        return this.element.data.imageUrl
      }
      return this.element.data.image
    }
  },
  created() {
    eventBus.$on("onFillCanvas", (name, value) => {
      if (name !== this.element.name) return;

      if (value === "fill") {
        this.element.style.top = 0;
        this.element.style.left = 0;
        this.element.style.width = 100;
        this.element.styleUnit.width = "%";
        this.element.style.height = 100;
        this.element.styleUnit.height = "%";
      } else if (value === "horizontal") {
        this.element.style.left = 0;
        this.element.style.width = 100;
        this.element.styleUnit.width = "%";
      } else if (value === "vertical") {
        this.element.style.top = 0;
        this.element.style.height = 100;
        this.element.styleUnit.height = "%";
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
