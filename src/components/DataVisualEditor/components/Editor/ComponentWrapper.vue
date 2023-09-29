<template>
  <div @click="handleClick" @mousedown="handleMousedown" ref="shape" class="shape" :style="getComponentStyle()">
    <component :is="element.component" class="component" :id="'component' + element.id" :prop-value="element.propValue"
      :element="element" />
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
      element: {
        type: Object,
        require: true,
        default: () => { },
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
        // runAnimation(this.$refs.component.$el, this.element.animations);
      } catch (error) {
        console.error('ComponentWrapper', error);
      }



    },
    updated() {

    },
    methods: {
      getComponentStyle() {
        const style = getStyle(this.element.style, this.element.styleUnit, this.canvasData.scale / 100)
        style.position = 'absolute'
        return style;
      },

      handleClick(e) {




        // todo 事件处理
        // const events = this.element.events;
        // Object.keys(events).forEach((event) => {
        //   try {
        //     this[event](events[event]);
        //   } catch (error) {
        //     console.warn("handleClick", error);
        //   }
        // });
      },
      handleMousedown(e) {

        if (this.element.data.isDrag && this.element.data.isModal && !location.hash.includes('/editor')) {

          const shape = $(this.$refs.shape)

          const { left, top } = this.$refs.shape.getBoundingClientRect()
          const leftT = parseFloat(this.$refs.shape.style.left)
          const topT = parseFloat(this.$refs.shape.style.top)

          bi.utils.makeDraggable(e, (newLeft, newTop) => {

            const rotate = this.element.style.rotate;
            shape.css('transform', `translateX(${newLeft - leftT}px) translateY(${newTop - topT}px) rotate(${rotate}deg)`)
          })
        } else if (this.element.data.isDrag && !location.hash.includes('/editor')) {

          bi.utils.makeDraggable(e, (newLeft, newTop) => {
            this.element.style.left = newLeft;
            this.element.style.top = newTop
          })
        }

        // todo 保存拖拽的位置



      }
    },
  };
</script>

<style lang="less" scoped>
  .component {
    width: 100%;
    height: 100%;
    /* position: absolute; */
  }
</style>
