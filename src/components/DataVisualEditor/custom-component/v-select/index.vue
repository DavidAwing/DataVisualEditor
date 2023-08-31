<template>
  <el-select
    v-model="element.data.selectedValue"
    :placeholder="element.data.placeholder"
    :clearable="element.data.clearable"
    :multiple="element.data.multiple"
    :collapse-tags="element.data.multiple"
    filterable
  >
    <el-option v-for="item in element.data.options" :key="item.value" :label="item.label" :value="item.value">
    </el-option>
  </el-select>
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
      default: () => {},
    },
  },
  mounted() {},
};
</script>

<style lang="less" scoped>
/deep/ .el-input,
/deep/ .el-input input {
  height: 100%;
}
</style>
