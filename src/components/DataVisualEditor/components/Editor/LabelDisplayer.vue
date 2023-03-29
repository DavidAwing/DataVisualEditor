<template>
  <div class="canvas" :style="getCanvasStyle()">
    <!-- 网格线 -->
    <Grid v-if="background == 'grid' || (background instanceof Object)" :config="background" />
    <ComponentWrapper v-for="(item, index) in pageComponentData()" :key="index" :config="item" />
  </div>
</template>

<script>

  // 匹配
  // OK
  // OK;
  // OK;;;...

  // Regex r = new Regex("^OK(;*)$");
  //                         if (r.IsMatch(cmdRes))
  //                         {
  //                             res.Add("Error", "无数据");
  //                             return res.ToString();
  //                         }

  import { mapState } from 'vuex'
  import ComponentWrapper from './ComponentWrapper'
  import { changeStyleWithScale } from '../../utils/translate'
  import { deepCopy, getOneMmsPx, accMul } from '../../utils/utils'
  import { divide, multiply } from 'mathjs'

  import Grid from './Grid.vue'
  const JSONfn = require('jsonfn').JSONfn

  export default {
    components: { ComponentWrapper, Grid },
    data() {
      return {
        includes: ['propValue', 'uniqueId'],
        containerId: "",
        needToChange: [
          'top',
          'left',
          'width',
          'height',
          'fontSize',
        ]
      }
    },
    model: {
      prop: 'show',
      event: 'change',
    },
    props: {
      show: {
        type: Boolean,
        default: false,
      },
      data: {
        type: Object,
        default: () => { }
      },
      scale: {
        type: Number,
        default: 100
      },
      background: {
        type: [String, Object],
        default: () => "#FFFFF0"
      }
    },
    computed: {

      templateDataCopy() {
        return JSONfn.stringify(this.canvasComponentData)
      },
      ...mapState([
        'canvasComponentData',
        'canvasStyleData',
      ])

    },
    created() {
      this.handleScaleChange()
    },
    methods: {

      getCanvasStyle() {

        if (this.background == 'grid' || this.background instanceof Object)
          return {
            width: changeStyleWithScale(this.canvasStyleData.width) + this.canvasStyleData.unit,
            height: changeStyleWithScale(this.canvasStyleData.height) + this.canvasStyleData.unit,
            position: 'absolute'
          }

        return {
          width: changeStyleWithScale(this.canvasStyleData.width) + this.canvasStyleData.unit,
          height: changeStyleWithScale(this.canvasStyleData.height) + this.canvasStyleData.unit,
          position: 'absolute',
          background: this.background,
        }

      },

      format(value) {
        return multiply(value, divide(parseFloat(this.scale), 100))
      },

      getOriginStyle(value) {
        return divide(value, divide(parseFloat(this.canvasStyleData.scale), 100))
      },

      handleScaleChange() {

        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          // 画布比例设一个最小值，不能为 0
          // eslint-disable-next-line no-bitwise
          const scale = (~~this.scale) || 1
          const canvasComponentData = deepCopy(this.canvasComponentData)
          canvasComponentData.forEach(component => {
            Object.keys(component.style).forEach(key => {
              if (this.needToChange.includes(key)) {
                // 根据原来的比例获取样式原来的尺寸
                // 再用原来的尺寸 * 现在的比例得出新的尺寸
                component.style[key] = this.format(this.getOriginStyle(component.style[key]))
              }
            })
          })

          this.$store.commit('setCanvasComponentData', canvasComponentData)
          // 更新画布数组后，需要重新设置当前组件，否则在改变比例后，直接拖动圆点改变组件大小不会生效 https://github.com/woai3c/visual-drag-demo/issues/74
          this.$store.commit('setCurComponent', { component: canvasComponentData[this.curComponentIndex], index: this.curComponentIndex })
          this.$store.commit('setCanvasData', {
            ...this.canvasStyleData,
            scale: scale,
          })

        }, 100)
      },

      pageComponentData() {

        if (this.data == null || JSON.stringify(this.data) == "{}") {
          return JSONfn.parse(this.templateDataCopy)
        }

        const pageData = this.data;

        const componentDataCopy = JSONfn.parse(this.templateDataCopy)

        for (let i = 0; i < componentDataCopy.length; i++) {
          const item = componentDataCopy[i];
          const keys = Object.keys(item)

          for (let j = 0; j < keys.length; j++) {

            if (!this.includes.includes(keys[j])) {
              continue;
            }

            if (typeof item[keys[j]] === 'string' && /\[\w+\]/.test(item[keys[j]])) {
              const placeholderList = item[keys[j]].match(/\[\w+\]/g);
              for (let k = 0; k < placeholderList.length; k++) {
                const variableName = placeholderList[k].match(/(?<=\[)(\w+)(?=])/g)  // 匹配以 '[' 开头以 ']' 结尾,但不包含

                if (Array.isArray(pageData[variableName])) {
                  throw Error("数据类型错误, 数组类型无法解析")
                }

                if (typeof pageData[variableName] !== 'object') {
                  item[keys[j]] = item[keys[j]].replace(placeholderList[k], pageData[variableName] ? pageData[variableName] : placeholderList[k])
                }

              }
              continue;
            } else if (typeof item[keys[j]] === 'object' && false) {
              continue;
            }

            if (keys[j] == "uniqueId") {
              componentDataCopy[i]["uniqueId"] = componentDataCopy[i]["uniqueId"] + "-" + i;
              continue;
            }
          }
        }

        return componentDataCopy
      },

      changeStyleWithScale
    },
  }
</script>

<style lang="less" scoped>

</style>
