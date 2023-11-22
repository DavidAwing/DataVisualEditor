<template>
  <div class="v-form" :style="getShapeStyle(element.style, element.styleUnit)">
    <div v-if="element.data.formConf.fields.length == 0" class="empty-info">
      请打开表单设计器进行编辑
    </div>

    <div v-else style="width: 100%;height: 100%;">
      <parser ref="form" :key="element.data.name + formKey" :form-conf="element.data.formConf" @submit="sumbitForm" />
      <el-button v-if="element.data.isModal" class="icon-form-close" icon="el-icon-close" circle type="danger"
        @click="if(element.data.isModal){element.data.show=false;onEvent('onCloseDialog')}"></el-button>
    </div>
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
          field.__config__.regList && field.__config__.regList.forEach(reg => {
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
        this.$watch(() => model[key], (val, old) => {
          if (!val)
            return
          this.onEvent('onModelChange', { key, value: val, oldValue: old, model: model })
        }, { immediate: true, deep: false })
      })

      this.repair()

      // 表单数据回填，模拟异步请求场景
      setTimeout(() => {

        // this.fillFormData(this.formConf, data)
        // this.key2 = +new Date()
      }, 2000)

    },
    updated() {

    },
    methods: {

      getAllComponents(c, list = []) {
        if (Array.isArray(c)) {
          c.forEach(item => this.getAllComponents(item, list))
        } else {
          if (!list.find(item => item.$el === c.$el) && c.$el.nodeType != 8) {
            list.push(c)
          }
          if (c.$children) {
            return this.getAllComponents(c.$children, list)
          }
        }
        return list
      },

      repair() {

        const addListener = (list) => {

          list.forEach(c => {
            if (c.$el.tagName === 'BUTTON' || c.$el.tagName === 'LABEL') {
              c.$el.addEventListener('click', () => {
                this.onEvent('onTriggerEvent', { eventName: 'click', el: c.$el, component: c })
              })
              c.$el.addEventListener('mouseover', () => {
                this.onEvent('onTriggerEvent', { eventName: 'mouseover', el: c.$el, component: c })
              })
              c.$el.addEventListener('mouseout', () => {
                this.onEvent('onTriggerEvent', { eventName: 'mouseout', el: c.$el, component: c })
              })
            }

            if (c.$el.tagName === 'BUTTON') {
              if (c.$el.parentNode.className.includes('el-upload'))
                return
              // c.$el.removeEventListener('click', function () {
              //   console.log("removing the click event!");
              // }, false)

              if (!c.$el.querySelector('span')) {
                const spanText = c._props.conf?.__slot__.default
                const span = document.createElement("span")
                span.textContent = spanText
                span.style.marginLeft = '5px'
                c.$el.append(span)
              }
            }

            if (c._vnode.tag === "vue-component-162-ElUpload") {

              console.log('点击了文件1', c);
              const _props = c.$children[0]._props
              _props.onPreview = (file) => {
                console.log('点击了文件11111111', file);
              }
              _props.onRemove = function (file, fileList) {
                console.log('点击了文件2', file);
              }
              _props.onChange = f => console.log('点击了文件fff', f)
            }

          })
        }
        addListener(this.getAllComponents(this.form))
      },

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
        const files = []
        this.form.$el.querySelectorAll('.el-upload__input').forEach(input => {
          input.files?.forEach(file => {
            files.push(file)
          })
        })
        this.onEvent('onSubmitForm', { formData, files })
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
