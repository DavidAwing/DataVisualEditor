<template>
  <el-select v-model="element.data.selectedValue" :placeholder="element.data.placeholder"
    :clearable="element.data.clearable" :multiple="element.data.multiple" :collapse-tags="element.data.multiple"
    @change="(value)=>onEvent('onChange', { value })" @visible-change="onVisibleChange"
    @clear="()=>onEvent('onClear', { })" @keyup.enter.native="onEnter($event)" filterable>
    <el-option v-for="item in element.data.options" :key="item.value" :label="item.label" :value="item.value">
    </el-option>
  </el-select>
</template>

<script>
  import ComponentBase from '../ComponentBase';
  import BaseMixins from '../BaseMixins';
  import eventBus from '../../utils/eventBus'
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
      eventBus.$on('onDeleteItem', (name, event) => {
        if (name !== this.element.data.name) return
        if (!this.element.data.selectedValue)
          return
        const options = this.element.data.options
        const val = this.element.data.selectedValue
        let at = -1;
        for (let i = 0; i < options.length; i++) {
          if (options[i].value === val) {
            at = i;
            break;
          }
        }
        if (at !== -1) {
          options.splice(at, 1);
          this.element.data.selectedValue = ""
        }
      });
    },
    mounted() { },
    methods: {
      onVisibleChange(visible) {
        console.log('测试选择器', visible);
      },
      onEnter(event) {
        const val = $(event.target).val()
        if (document.location.href.includes('/editor')) {
          this.element.data.options.push({
            label: val,
            value: val
          })
        } else {
          this.onEvent('onEnter', { value: val, event })
        }
      },
      onClear() {

      }
    },
  };
</script>

<style lang="less" scoped>
  /deep/ .el-input,
  /deep/ .el-input input {
    height: 100%;
  }
</style>
