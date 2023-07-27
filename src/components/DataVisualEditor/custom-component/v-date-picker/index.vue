<template>
    <el-date-picker
    v-model="element.data.date"
    type="date"
    :placeholder="element.data.placeholder"
    :format="element.data.format"
    :value-format="element.data.format"
    :align="element.data.align"
    >
  </el-date-picker>
</template>

<script>
  import ComponentBase from "../ComponentBase";

export default {
    extends: ComponentBase,
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
    mounted() {
    },
}
</script>

<style lang="less" scoped>
/deep/ .el-input__inner {
    height: 100%;
}
</style>
