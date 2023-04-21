import Vue, { PropType, VNode } from "vue";
import ComponentBase from "../ComponentBase";
import { Component, Prop, Emit, Watch } from 'vue-property-decorator'
import * as echarts from "echarts";
import { getRandStr } from "../../utils/utils";
import { setJsonAttribute, testString } from "../../utils/chartStyleUtils";

@Component({
  components: {
  },
})
export default class ChartsComponentBase extends ComponentBase {

  // todo: 撑满父组件

  chartDom: HTMLElement | undefined = undefined
  chart: any = undefined

  // 计算属性
  get styleList() {
    return this.element.styleList;
  }

  get option() {
    return this.element.data.option;
  }

  set option(val) {
    this.element.data.option = val;
  }


  constructor() {
    super()
    console.log("图表基类创建组件");
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
    console.log("图表基类生命周期", this.element);
    this.element.data.chartId = getRandStr();




  }

  public mounted() {
    console.log("图表基类生命周期: mounted");


    const data = this.element.data
    this.chartDom = document.getElementById(data.chartId) as HTMLElement;
    this.chart = echarts.init(this.chartDom);
    this.chart.setOption(this.option)


    this.$watch('element', (newValue: any, oldValue) => {

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

      console.log("样式修改...", newValue, oldValue);


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
          // $开头的字符串是方法
          this.option = setJsonAttribute(this.option, attributePath, value)
          this.chart.setOption(this.option)
        }
      }

    }, { deep: true })

  }

}
