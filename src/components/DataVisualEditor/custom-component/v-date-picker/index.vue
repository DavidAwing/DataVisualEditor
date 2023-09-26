<template>

  <div class="v-date-time">

    <el-time-picker v-if="element.data.type === 'time'" v-model="element.data.date" :picker-options="{
      selectableRange: '00:00:00 - 23:59:59'
    }" :placeholder="element.data.placeholder" :format="element.data.format" :value-format="element.data.format">
    </el-time-picker>

    <el-date-picker v-else v-model="element.data.date" :type="element.data.type" :placeholder="element.data.placeholder"
      :format="element.data.format" :value-format="element.data.format" :align="element.data.align"
      :style="{ width: '100%', height: '100%' }">
    </el-date-picker>

  </div>

</template>

<script>
  import ComponentBase from '../ComponentBase';
  import BaseMixins from '../BaseMixins';
  export default {
    extends: ComponentBase,
    mixins: [BaseMixins],
    props: {
      propValue: {
        type: String,
        default: '',
      },
      element: {
        type: Object,
        default: () => { },
      },
    },
    created() {

      this.$watch(() => this.element.data.type, (val) => {
        const data = this.element.data
        if (val === 'date') {
          data.format = 'yyyy年 MM月 dd日'
          data.placeholder = '选择日期'
        } else if (val === 'datetime') {
          data.format = 'yyyy年 MM月 dd日 HH时mm分ss秒'
          data.placeholder = '选择日期和时间'
        } else if (val === 'time') {
          data.format = 'HH时mm分ss秒'
          data.placeholder = '选择时间'
        }
        data.date = null
      })

    },
    mounted() { },
  };
</script>

<style lang="less" scoped>
  /* /deep/ .v-date-time  .el-date-editor,
  /deep/ .v-date-time .el-input__inner {
    width: 100% !important;
    height: 100% !important;
  } */
</style>
