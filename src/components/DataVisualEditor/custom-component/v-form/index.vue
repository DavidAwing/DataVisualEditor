<template>
  <div class="v-form" :style="getShapeStyle(element.style, element.styleUnit)">
    <div v-if="element.data.formConf.fields.length == 0" class="empty-info">
      请打开表单设计器进行编辑
    </div>
    <parser v-else :key="element.data.name + formKey" :form-conf="element.data.formConf" @submit="sumbitForm" />
  </div>
</template>

<script>
  import ComponentBase from '../ComponentBase';
  import BaseMixins from '../BaseMixins';
  import eventBus from '../../utils/eventBus'
  import VIframe from '../v-iframe'
  import Parser from 'form-gen-parser'
  const _ = require('lodash');

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
        formKey: +new Date()
      }
    },
    created() {
      eventBus.$on('onFormDesigner', (name, event) => {
        if (name !== this.element.data.name) return
        f.openWindow(`/FormDesigner/#/home?c=${name}`, '表单设计器-' + name)
      });

      eventBus.$on('setFormConf', (name, data) => {
        if (name !== this.element.data.name) return
        this.element.data.formConf = data
        this.formKey = +new Date()
      });

      this.$watch(() => this.element.data.isModal, (val) => {
        if (!location.hash.includes('/editor')) return
        if (val === false)
          this.$set(this.element.data, 'show', true)
      }, { immediate: true, deep: false })

      this.$watch(() => this.element.data.show, (val) => {
        if (!location.hash.includes('/editor'))
          return
        if (this.element.data.isModal === false && this.element.data.show === true) {
          this.$nextTick(() => {
            document.getElementById('editor').appendChild($(this.$el).parent()[0])
          })
        }
      }, { immediate: true, deep: false })

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
      },
      getShapeStyle(style, styleUnit) {
        const result = {};
        ['padding', 'paddingLeft', 'paddingRight', 'paddingBottom', 'paddingTop'].forEach(attr => {
          if (style[attr] == null)
            return
          if (attr != 'rotate') {
            result[_.kebabCase(attr)] = style[attr] + (styleUnit ? styleUnit[attr] : 'px');
          } else {
            result.transform = 'rotate(' + style[attr] + 'deg)';
          }
        });
        result['overflow-y'] = 'auto'
        result['overflow-x'] = 'hidden'
        return result;
      },
    },
  };
</script>

<style lang="less" scoped>
  @import 'index.less';
</style>
