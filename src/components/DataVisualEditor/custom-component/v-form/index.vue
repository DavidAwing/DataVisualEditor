<template>
  <div class="v-form" :style="getShapeStyle(element.style, element.styleUnit)">
    <div v-if="element.data.formConf.fields.length == 0" class="empty-info">
      请打开表单设计器进行编辑
    </div>
    <parser v-else ref="form" :key="element.data.name + formKey" :form-conf="element.data.formConf"
      @submit="sumbitForm" />
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
    computed: {
      model() {
        try {
          const form = this.$children[0]
          return form.$refs.elForm._props.model
        } catch (error) {
          console.warn('模型model', error);
          return {}
        }
      }
    },
    created() {
      eventBus.$on('onFormDesigner', (name, event) => {
        if (name !== this.element.data.name) return
        const canvasName = bi.store.state.canvasName
        f.openWindow(`/FormDesigner/#/home?canvasName=${canvasName}&componentName=${name}`, `表单设计器-${canvasName}-${name}`)
      });

      eventBus.$on('getFormConf', (name, canvasName, data) => {
        if (!location.hash.includes('/editor') || name !== this.element.data.name || canvasName !== bi.store.state.canvasName) return
        const obj = {
          action: 'setFormConf',
          urls: ['/FormDesigner'],
          canvasName: canvasName,
          componentName: name,
          data: this.element.data.formConf
        }
        window.bi.sharedWorker.postMessage(obj)
      });

      eventBus.$on('setFormConf', (name, canvasName, data) => {
        if (!location.hash.includes('/editor') || name !== this.element.data.name || canvasName !== bi.store.state.canvasName) return
        for (const field of data.fields) {
          field.__config__.regList.forEach(reg => {
            if (!/^\/.+\//.test(reg.pattern))
              reg.pattern = new RegExp(`${reg.pattern}`, 'g').toString()
          })
        }
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

      this.form = this.$children[0]
      const model = this.$children[0].$refs.elForm._props.model

      Object.keys(model).forEach(key => {
        this.$watch(() => this.model[key], (val, old) => {
          if (!val)
            return
          this.onEvent('onModelChange', { key, value: val, oldValue: old })
        }, { immediate: true, deep: false })
      })

      // 表单数据回填，模拟异步请求场景
      setTimeout(() => {

        // this.fillFormData(this.formConf, data)
        // this.key2 = +new Date()
      }, 2000)

    },
    methods: {
      setFieldValue(key, value) {
        const field = this.element.data.formConf.fields.find(item => item.__vModel__ === key)
        if (field) {
          field.__config__.defaultValue = value
        }
        this.formKey = +new Date()
      },
      fillFormData(form, data) {
        form.fields.forEach(item => {
          const val = data[item.__vModel__]
          if (val) {
            item.__config__.defaultValue = val
          }
        })
      },
      sumbitForm(formData) {
        this.onEvent('onSubmitForm', { formData })
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
