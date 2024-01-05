<template>
  <!-- <input class="v-input" :value="element.data.text" :placeholder="element.data.placeholder"></input> -->
  <el-input v-model="element.data.text" :type="element.data.type"
  :placeholder="element.data.placeholder" @focus="onEvent('onFocus', { $event })"
  @input="onEvent('onInput', { $event })" @clear="onEvent('onClear', { $event })"
  @change="onEvent('onChange', $event)" @blur="onEvent('onBlur', { $event })"
  @keyup.native="onEvent('onKeyup', { $event })" @keydown.native="onEvent('onKeydown', { $event })"
  @keypress.native="onEvent('onKeypress', { $event })" :step="1" />
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
    mounted() {
      this.$watch(() => this.element.data.text, (val) => {
      })
    },
    methods: {
      test(a, b) {
        console.log('数据', a, b);
      },
    },
  };
</script>

<style lang="less" scoped>
  .v-button {
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    background: #fff;
    border: 1px solid #dcdfe6;
    color: #606266;
    -webkit-appearance: none;
    text-align: center;
    box-sizing: border-box;
    outline: 0;
    margin: 0;
    transition: 0.1s;
    font-weight: 500;
    width: 100%;
    height: 100%;
    font-size: 14px;

    &:active {
      color: #3a8ee6;
      border-color: #3a8ee6;
      outline: 0;
    }

    &:hover {
      background-color: #ecf5ff;
      color: #3a8ee6;
    }
  }

  /deep/ .el-textarea__inner,
  /deep/ .el-input__inner {
    height: 100%;
  }
</style>
