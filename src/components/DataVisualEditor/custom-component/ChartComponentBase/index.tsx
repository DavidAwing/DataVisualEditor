import Vue, { PropType, VNode, CreateElement } from "vue";
import ComponentBase from "../ComponentBase";
import { Component, Prop, Emit, Watch } from 'vue-property-decorator'
import * as echarts from "echarts";
import { getRandStr } from "../../utils/utils";
import { setJsonAttribute, testString, CRUD, getValueByAttributePath } from "../../utils/chartUtils";
import eventBus from '../../utils/eventBus'
const equal = require('fast-deep-equal')
const JSONfn = require("jsonfn").JSONfn;
@Component({
  components: {
  },
})
export default class ChartsComponentBase extends ComponentBase {

  // todo: 撑满父组件

  chartDom: HTMLElement | undefined = undefined
  chart: any = undefined
  editSeriesDialog = false
  editOptionDialog = false
  oldSeries: any = undefined
  oldStyle: any = {}
  selectChartStyle: any = {}
  activeSerieIndex = 0
  chartStyleMap: any = {}



  // 计算属性
  get styleList() {
    return this.element.styleList;
  }

  get chartStyleList() {

    if (Object.keys(this.chartStyleMap).length === 0)
      return []

    if (this.activeSerie.type === "bar") {

    }
    if (this.activeSerie.type === "line") {

    }
    if (this.activeSerie.type === "pie") {

    }
    if (this.activeSerie.type === "scatter") {

    }
    if (this.activeSerie.type === "gauge") {

    }

    return this.chartStyleMap[this.activeSerie.type] || []
  }

  get option() {
    return this.element.data.option;
  }

  set option(val: any) {
    this.element.data.option = val;
  }
  get test222(): any {

    const aa: any = []
    for (let i = 0; i < 60; i++) {
      aa.push({
        id: "蓝色" + i,
        name: "地区" + i,
        data: [140, 200, 150, 80, 70, 110, 130],
        type: "bar",
        showBackground: true,
        backgroundStyle: {
          color: "rgba(0, 0, 255, 1)",
        },
      })
    }
    return aa
  }

  deleteSerie() {
    const index = this.element.data.option.series.indexOf(this.activeSerie)
    this.activeSerieIndex = index - 1
    if (this.activeSerieIndex < 0)
      this.activeSerieIndex = 0
    Vue.delete(this.element.data.option.series, index)
  }

  addSerie() {
    const serie = JSONfn.parse(JSONfn.stringify(this.activeSerie))
    serie.id = getRandStr()
    this.element.data.option.series.splice(this.activeSerieIndex, 0, serie)
  }

  get activeSerie() {
    return this.element.data.option.series[this.activeSerieIndex] || {};
  }

  get serieTypeList() {
    return [
      {
        label: "折线图",
        value: "line",
      },
      {
        label: "柱状图",
        value: "bar",
      },
      {
        label: "饼图",
        value: "pie",
      },
      {
        label: "仪表盘",
        value: "gauge",
      },
      {
        label: "散点(气泡)图",
        value: "scatter",
      },

    ]
  }

  constructor() {
    super()
    console.log('');
  }

  // render(createElement: any) {
  //     return createElement(
  //         'div',   // 标签名称
  //         {
  //             attrs: {
  //                 id: this.element.data.id
  //             }
  //         },
  //         this.$slots.default // 子节点数组
  //     )
  // }

  public created() {

    this.element.data.chartId = getRandStr();

    eventBus.$on("onEditSeries", (name: string, event: Event) => {
      if (name !== this.element.data.name) return;
      this.editSeriesDialog = true
    });

  }

  public mounted() {

    const data = this.element.data
    this.chartDom = document.getElementById(data.chartId) as HTMLElement;
    this.chart = echarts.init(this.chartDom);
    this.chart.setOption(this.option)

    eventBus.$on("endDraggable", (dragEvent: any) => {

      const { newIndex, oldIndex } = dragEvent

      function equalSeries(obj1: any, obj2: any, ignoreProps = ["id", "name"]) {
        if (obj2 === undefined)
          return true
        let newobj1 = JSONfn.parse(JSONfn.stringify(obj1))
        let newobj2 = JSONfn.parse(JSONfn.stringify(obj2))
        ignoreProps.forEach((prop: string) => {
          delete newobj1[prop]
          delete newobj2[prop]
        })
        return equal(newobj1, newobj2);
      }

      if (!equalSeries(this.option.series, this.oldSeries)) {
        // todo 重新设置  已保存的样式
        if (this.element.styleList !== undefined && this.element.styleList.length > 0) {
          let isSetNewIndex = false
          let isSetOldIndex = false
          for (let i = 0; i < this.element.styleList.length; i++) {
            const style = this.element.styleList[i];
            if (!isSetNewIndex && style.attributePath.includes(`series[${newIndex}]`)) {
              style.attributePath = style.attributePath.replaceAll(`series[${newIndex}]`, `series[${oldIndex}]`)
              style.styleId = style.styleId.replaceAll(`series[${newIndex}]`, `series[${oldIndex}]`)
              // 获取hierarchy里面的@开头的变量, 替换cssData里面的同名属性的值为oldIndex
              const match = style.hierarchy.match(/(?<=(series(\s*\[\s*)+)@)(\w)+(?=(\s*\]+))/g)
              if (match === null) {
                console.warn("style更新异常newIndex: ", style);
                isSetNewIndex = true
                return
              }
              if (Object.prototype.hasOwnProperty.call(style.cssData, match[0])) {
                style.cssData[match[0]] = oldIndex
                isSetNewIndex = true
              }
            }
            if (!isSetOldIndex && style.attributePath.includes(`series[${oldIndex}]`)) {
              style.attributePath = style.attributePath.replaceAll(`series[${oldIndex}]`, `series[${newIndex}]`)
              style.styleId = style.styleId.replaceAll(`series[${oldIndex}]`, `series[${newIndex}]`)
              const match = style.hierarchy.match(/(?<=(series(\s*\[\s*)+)@)(\w)+(?=(\s*\]+))/g)
              if (match === null) {
                console.warn("style更新异常oldIndex: ", style);
                isSetOldIndex = true
                return
              }
              if (Object.prototype.hasOwnProperty.call(style.cssData, match[0])) {
                style.cssData[match[0]] = newIndex
                isSetOldIndex = true
              }
            }
            if (isSetNewIndex && isSetOldIndex)
              break
          }
        }
        this.chart.setOption(this.option, true)
      }

    })

    this.$watch('option', (val: any, old) => {




    }, { deep: true });

    this.$watch('element', (val: any, old) => {

      if (val.style.width !== this.oldStyle.width || val.style.height !== this.oldStyle.height) {
        setTimeout(() => {
          this.$nextTick(() => {
            this.chart.resize()
            this.oldStyle = val
          })
        }, 300);
      }


      // setJsonAttribute(
      //   option,
      //   "series[0].backgroundStyle.color",
      //   "rgba(255, 0, 0, 1)"
      // );
      // setJsonAttribute(option, "xAxis.type", "time");
      // setJsonAttribute(option, "yAxis", { type: "value", name: "yAxis222" });
      // setJsonAttribute(option, "xAxis.data[0]", "Monday222");
      // setJsonAttribute(option, "series[0].data[0]", 1560);
      // setJsonAttribute(
      //   option,
      //   "series[0].data",
      //   [12345, 200, 150, 80, 70, 110, 130]
      // );

    }, { deep: true });

    this.$watch('styleList', (newValue: any, oldValue) => {

      for (let i = 0; i < newValue.length; i++) {
        const style = newValue[i];

        if (style == null || style.attributePath == null || style.attributePath.trim() === "")
          continue

        const keys = Object.keys(style.cssData)
        if (testString(style.css) === 'object') {
          const value = JSON.parse(style.css)
          keys.forEach(key => {
            // todo 判断style.cssData[key]的值有没有带.,如果带.要找到属性的路径
            value[key] = style.cssData[key]
          })

          let attributePath = style.attributePath.includes("~~~") ? style.attributePath.split("~~~")[0] : style.attributePath
          //  attributePath = attributePath.includes(" ") ? attributePath.replaceAll(" ", "") : attributePath
          // @开头的字符串是变量
          if (attributePath.includes("@")) {
            const regex = /@\w+(?=[\x20\].])/g;
            const match = attributePath.match(regex); // ['@index', '@aaindex']
            match.forEach((placeholder: string) => {
              const key = placeholder.substring(1)
              attributePath = attributePath.replaceAll(placeholder, style.cssData[key])
              // 参与路径的变量必须删, 不修改样式
              delete value[key];
            });
          }
          // todo $开头的字符串是方法
          this.option = setJsonAttribute(this.option, attributePath, value)
          this.chart.setOption(this.option, true)
        }
      }

    }, { deep: true })

    eventBus.$on('SetOption', (name: string, newOption: any) => {

      if (name !== this.element.data.name) return
      function removeEmpty(obj: any) {
        for (let prop in obj) {
          if (obj[prop] === null) {
            delete obj[prop];
          } else if (Array.isArray(obj[prop])) {
            obj[prop] = obj[prop].filter((el: any) => el !== null && el !== undefined); // 过滤空元素
            if (obj[prop].length === 0) {
              delete obj[prop];
            } else {
              obj[prop].forEach((el: any) => {
                if (typeof el === "object") {
                  removeEmpty(el);
                }
              });
            }
          } else if (typeof obj[prop] === "object") {
            removeEmpty(obj[prop]);
          }
        }
      }

      removeEmpty(newOption)
      this.option = newOption
      this.chart.setOption(this.option, true)

    });

    this.$watch('activeSerie', (val: any, old) => {
      // this.element.data.activeSerieType = "vc-" + val.type
      Vue.set(this.element.data, "activeSerieType", "vc-" + val.type)
      this.chart.setOption(this.option, true)
    }, { deep: true, immediate: true });

  }

}
