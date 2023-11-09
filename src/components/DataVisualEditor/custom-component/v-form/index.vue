<template>

  <div class="v-form">

    <div v-if="element.data.formConf.fields.length == 0" class="empty-info">
      点选组件进行表单设计
    </div>

    <parser v-else :key="element.data.name" :form-conf="element.data.formConf" @submit="sumbitForm" />

    <top-el-dialog title="表单设计" :visible.sync="element.data.showFormDesignerDialog" width="90%" v-el-drag-dialog center>
      <el-form :inline="true" label-width="auto">
        <VIframe :src="iframeSrc" style="width: 90vw; height: 70vh;" />
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="element.data.showFormDesignerDialog = false">取 消</el-button>
        <el-button type="primary" @click="element.data.showFormDesignerDialog = false">确 定</el-button>
      </span>
    </top-el-dialog>

  </div>

</template>

<script>
  import ComponentBase from '../ComponentBase';
  import BaseMixins from '../BaseMixins';
  import eventBus from '../../utils/eventBus'

  import VIframe from '../v-iframe'

  import Parser from 'form-gen-parser'

  export default {
    components: {
      Parser,
      VIframe
    },
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
        iframeSrc: 'http://192.168.0.100:8080/#/'
      }
    },
    created() {
      eventBus.$on('onFormDesigner', (name, event) => {

        console.log('onFormDesigner', name, event);

        if (name !== this.element.data.name) return



        this.element.data.showFormDesignerDialog = true

      });
    },
    mounted() {

      // 表单数据回填，模拟异步请求场景
      setTimeout(() => {

        // this.fillFormData(this.formConf, data)
        // this.key2 = +new Date()
      }, 2000)

    },
    methods: {
      fillFormData(form, data) {
        form.fields.forEach(item => {
          const val = data[item.__vModel__]
          if (val) {
            item.__config__.defaultValue = val
          }
        })
      },
      sumbitForm(data) {
        console.log('sumbitForm1提交数据：', data)
      }
    },
  };
</script>

<style lang="less" scoped>
  @import 'index.less';
</style>
