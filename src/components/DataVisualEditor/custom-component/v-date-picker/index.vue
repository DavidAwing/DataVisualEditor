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
        if (val === 'date') {
          this.element.data.format = 'yyyy年 MM月 dd日'
          this.element.data.placeholder = '选择日期'
          this.element.data.date = null
        } else if (val === 'datetime') {
          this.element.data.format = 'yyyy年 MM月 dd日 HH时mm分ss秒'
          this.element.data.placeholder = '选择日期和时间'
          this.element.data.date = null
        } else if (val === 'time') {
          this.element.data.format = 'HH时mm分ss秒'
          this.element.data.placeholder = '选择时间'
          this.element.data.date = null
        }
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
