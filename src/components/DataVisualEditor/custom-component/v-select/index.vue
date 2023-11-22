<template>

  <div>

    <el-select class="bi-component-select" v-model="element.data.selectedValue" :placeholder="element.data.placeholder"
      :clearable="element.data.clearable" :multiple="element.data.multiple" :collapse-tags="element.data.multiple"
      @change="(value)=>onEvent('onChange', { value })" @visible-change="onVisibleChange"
      @clear="()=>onEvent('onClear', { })" @keyup.enter.native="onEnter($event)" filterable>
      <el-option v-for="item in element.data.options" :key="item.value" :label="item.label" :value="item.value">
      </el-option>
    </el-select>

    <top-el-dialog title="编辑选项" :visible.sync="showDialog" width="30%" v-el-drag-dialog center>
      <el-form :inline="true" label-width="auto">

        <el-form-item label="实值" :style="{ width: '100%' }">
          <el-input v-model="column.value" autocomplete="off" style="width: 100%"></el-input>
        </el-form-item>

        <el-form-item label="标签" :style="{ width: '100%' }">
          <el-input v-model="column.label" autocomplete="off" style="width: 100%"></el-input>
        </el-form-item>

      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="showDialog = false">取 消</el-button>
        <el-button type="primary" @click="showDialog = false;addItem()">确 定</el-button>
      </span>
    </top-el-dialog>

  </div>

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
    data() {
      return {
        column: { value: "", label: "" },
        showDialog: false
      }
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

        if (document.location.href.includes('/editor')) {

          const val = $(event.target).val().trim()
          this.column.value = val
          this.column.label = val
          this.showDialog = true

        } else {
          this.onEvent('onEnter', { value: val, event })
        }
      },
      onClear() {

      },
      addItem() {

        const label = this.column.label
        const value = this.column.value
        const options = this.element.data.options
        if (!options.find(item => item.label === label || item.value === value))
          options.push({
            label: label,
            value: value
          })
        else
          console.warn('添加失败,已存在相同的');
      }
    },
  };
</script>

<style lang="less" scoped>
  /deep/ .bi-component-select,
  /deep/ .bi-component-select .el-input,
  /deep/ .bi-component-select .el-input input {
    height: 100%;
    width: 100%;
  }
  @import 'index.less';
</style>
