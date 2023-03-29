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

export default {
  mixins: [mixins],
  props: {
    config: {
      type: Object,
      require: true,
      default: () => {},
    },
  },
  mounted() {
    try {
      runAnimation(this.$refs.component.$el, this.config.animations);
    } catch (error) {
      console.log(error.message);
    }
  },
  methods: {
    getComponentStyle() {
      return getStyle(this.config.style, this.config.styleUnit);
    },

    handleClick() {
      const events = this.config.events;
      Object.keys(events).forEach((event) => {
        try {
          this[event](events[event]);
        } catch (error) {
          console.warn("handleClick", error);
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.component {
  position: absolute;
}
</style>
