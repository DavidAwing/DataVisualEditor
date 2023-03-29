<template>
  <div style="overflow: hidden;">
    <canvas :id="element.uniqueId" :width="element.style.width" :height="element.style.height"></canvas>
  </div>
</template>

<script>

  import { generateUniqueId } from '../utils/generateID'

  export default {
    data() {
      return {
        checkItems: {}
      }
    },
    props: {
      propValue: {
        type: Object,
        require: true,
        default: {},
      },
      element: {
        type: Object,
        default: () => { },
      }
    },
    watch: {
      element: {
        handler: function (val) {
          this.draw()
        },
        deep: true
      }
    },
    created() {
      if (this.element.uniqueId == null || this.element.uniqueId == "") {
        this.element.uniqueId = generateUniqueId()
      }
    },
    mounted() {
      this.draw();
    },
    methods: {

      draw() {

        const ele = this.element;
        let start = { x: 0, y: ele.style.height / 2 }
        let end = { x: ele.style.width, y: ele.style.height / 2 }

        const canvas = document.getElementById(ele.uniqueId)
        if (!canvas)
          return
        let gd = canvas.getContext('2d');//得到canvas上下文环境




        this.$nextTick(() => {

          gd.clearRect(0, 0, ele.style.width, ele.style.height);
          if (ele.lineStyle == "solid") {
            gd.setLineDash([]);
          } else if (ele.lineStyle == "dotted") {
            gd.setLineDash([1, 1]);
          } else if (ele.lineStyle == "double") {
            gd.setLineDash([10, 10]);
          } else if (ele.lineStyle == "dashed") {
            gd.setLineDash([20, 5]);
          } else if (ele.lineStyle == "dotted && dashed") {
            gd.setLineDash([15, 3, 3, 3]);
          } else if (ele.lineStyle == "double && dashed") {
            gd.setLineDash([12, 3, 3]);
          } else if (ele.lineStyle == "three && dashed") {
            gd.setLineDash([20, 3, 3, 3, 3, 3, 3, 3]);
          }

          gd.beginPath();//清除原来的痕迹
          gd.strokeStyle = ele.color;//线条颜色
          gd.moveTo(start.x, start.y);//起点
          gd.lineTo(end.x, end.y);//终点
          gd.lineWidth = ele.width;//线条宽度
          gd.stroke();//这是最后一步，绘制
        })
      }

    },
  }
</script>

<style lang="less" scoped>

</style>
