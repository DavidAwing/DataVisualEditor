<template>

  <div class="v-date-time">

    <el-time-picker v-if="element.data.type === 'time'" v-model="element.data.date" :picker-options="{
      selectableRange: '00:00:00 - 23:59:59'
    }" :placeholder="element.data.placeholder" :format="element.data.format" :value-format="element.data.format">
    </el-time-picker>

    <el-date-picker ref="picker" v-else v-model="element.data.date" :type="element.data.type"
      :placeholder="element.data.placeholder" :format="element.data.format" :value-format="element.data.format"
      :align="element.data.align" :style="{ width: '100%', height: '100%' }" :editable="true"
      :picker-options="pickerOptions">
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
    data() {
      return {
        pickerOptions: {
        }
      };
    },
    created() {

      this.$watch(() => this.element.data.type, (val) => {
        const data = this.element.data
        if (val === 'date') {
          data.format = 'yyyy-MM-dd'
          data.placeholder = '选择日期'
        } else if (val === 'datetime') {
          data.format = 'yyyy-MM-dd HH:mm:ss'
          data.placeholder = '选择日期和时间'

          this.$nextTick(() => {
            window.test = this.$refs.picker
            console.log('picker', this.$refs.picker);
          })

        } else if (val === 'time') {
          data.format = 'HH:mm:ss'
          data.placeholder = '选择时间'
        }
        data.date = null
      })

    },
    mounted() { },
    methods: {
    },
  };
</script>

<style lang="less" scoped>
  /* /deep/ .v-date-time  .el-date-editor,
  /deep/ .v-date-time .el-input__inner {
    width: 100% !important;
    height: 100% !important;
  } */
</style>
