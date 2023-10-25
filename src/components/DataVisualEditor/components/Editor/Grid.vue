<template>
  <svg class="grid" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="smallGrid" width="7.236328125" height="7.236328125" patternUnits="userSpaceOnUse">
        <path d="M 7.236328125 0 L 0 0 0 7.236328125" fill="none" :stroke="smallGridColor" stroke-width="1">
        </path>
      </pattern>
      <pattern id="grid" width="36.181640625" height="36.181640625" patternUnits="userSpaceOnUse">
        <rect width="36.181640625" height="36.181640625" fill="url(#smallGrid)"></rect>
        <path d="M 36.181640625 0 L 0 0 0 36.181640625" fill="none" :stroke="gridColor" stroke-width="1">
        </path>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#grid)"></rect>
  </svg>

</template>

<script>
  export default {
    data() {
      return {
        smallGridColor: "rgba(207, 207, 207, 0.25)",
        gridColor: "rgba(186, 186, 186, 0.6)"
      }
    },
    mounted() {
      if (this.config != null && this.config.smallGridColor && this.config.gridColor) {
        this.smallGridColor = this.config.smallGridColor
        this.gridColor = this.config.gridColor
      }


      if (screen.width > 1800) {

        // const grid = document.getElementById("grid")
        // const smallGrid = document.getElementById("smallGrid")

        // grid.setAttribute("width", "36")
        // grid.setAttribute("height", "36")

        // smallGrid.setAttribute("width", "2")
        // smallGrid.setAttribute("height", "2")

      } else if (screen.width > 1300) {

      }
    },
    props: {
      config: {
        type: [String, Object],
        default: () => null
      }
    }
  }
</script>

<style lang="less" scoped>
  .grid {
    background-color: white;
    position: absolute;
    top: 0;
    left: 0;
  }
</style>
