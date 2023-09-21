<template>
  <div @click="handleClick">
    <component
      :is="config.component"
      ref="component"
      class="component"
      :id="'component' + config.id"
      :style="getComponentStyle()"
      :prop-value="config.propValue"
      :element="config"
    />
  </div>
</template>

<script>
import { getStyle } from "../../utils/style";
import runAnimation from "../../utils/runAnimation";
import { mixins } from "../../utils/events";
import { mapState } from "vuex";

export default {
  mixins: [mixins],
  data() {
    return {
     
    };
  },
  props: {
    config: {
      type: Object,
      require: true,
      default: () => {},
    },
  },
  computed: {
    ...mapState([
      "canvasData"
    ])
  },
  mounted() {
    try {
      // todo 动画
      // runAnimation(this.$refs.component.$el, this.config.animations);
    } catch (error) {
      console.log(error.message);
    }
  },
  methods: {
    getComponentStyle() {
      return getStyle(this.config.style, this.config.styleUnit,  this.canvasData.scale / 100);
    },

    handleClick() {

      // todo 事件处理
      // const events = this.config.events;
      // Object.keys(events).forEach((event) => {
      //   try {
      //     // console.log("把偶哦了", this[event], event);
      //     this[event](events[event]);
      //   } catch (error) {
      //     console.warn("handleClick", error);
      //   }
      // });
    },
  },
};
</script>

<style lang="less" scoped>
.component {
  position: absolute;
}
</style>
