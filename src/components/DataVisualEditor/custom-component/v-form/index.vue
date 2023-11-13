<template>

  <div class="v-form">

    <div v-if="element.data.formConf.fields.length == 0" class="empty-info">
      请打开表单设计器进行编辑
    </div>

    <parser v-else :key="element.data.name" :form-conf="element.data.formConf" @submit="sumbitForm" />

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
        iframeSrc: '/FormDesigner/#/home'
      }
    },
    created() {
      eventBus.$on('onFormDesigner', (name, event) => {
        if (name !== this.element.data.name) return
        f.openWindow(`/FormDesigner/#/home?c=${name}`, '表单设计器-' + name)
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
