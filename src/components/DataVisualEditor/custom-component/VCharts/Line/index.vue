<template>
  <div style="overflow: hidden;">
    <canvas :id="element.uniqueId"
      :style="propValue == '' ? 'background-color: rgba(0,0,0,0.25)' : 'background-color: #fff;' "></canvas>
  </div>
</template>

<script>

  import { mapState } from 'vuex'
  import * as echarts from 'echarts';
  import { generateUniqueId } from '../../../utils/generateID'

  export default {
    data() {
      return {
        width: 50,
        height: 50,
        checkItems: {}
      }
    },
    props: {
      propValue: {
        type: String,
        require: true,
        default: '',
      },
      element: {
        type: Object,
        default: () => { },
      },
      margin: {
        type: Number,
        default: 1
      }
    },
    watch: {
      element: {
        handler: function (val) {



        },
        deep: true
      }
    },
    mounted() {



    },
    methods: {




    },
  }
</script>

<style lang="less" scoped>
  @import "index.less";
</style>
