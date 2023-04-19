import Vue, { PropType, VNode } from "vue";
import { Component, Prop, Emit, Watch } from 'vue-property-decorator'
import axios from "axios";

@Component({
  components: {},
})
export default class StyleListBase extends Vue {

  isStyleListInterrupt = false
  isSwitchToStyle = false
  styleMap: any = {} as any
  curStyle: any = {} as any
  curSelector: any = ""
  selectedStyle: any = null

  get addedStyleTags() {
    if (this.curComponent.styleList == null) return [];
    return this.curComponent.styleList;
  }

  get curComponent() {
    this.isSwitchToStyle = true;
    return this.$store.state.curComponent;
  }

  get showStyleDetails() {
    return JSON.stringify(this.curStyle) === "{}";
  }

  get styleList() {

    const key = "styleList:" + this.curComponent.component;
    if (Object.prototype.hasOwnProperty.call(this.styleMap, key)) return this.styleMap[key];

    if (this.isStyleListInterrupt) return [];

    this.isStyleListInterrupt = true;
    axios
      .get("/BI/Component/GetStyleList", {
        params: {
          name: this.curComponent.component,
        },
        timeout: 10000,
      })
      .then(({ data }) => {
        this.isStyleListInterrupt = false;
        if (Object.prototype.hasOwnProperty.call(this.styleMap, key)) return;
        if (data.data === undefined || data.data === null || data.data.length === 0) {
          console.warn("组件未配置样式");
          Vue.set(this.styleMap, key, []);
          return;
        }
        Vue.set(this.styleMap, key, data.data);
      })
      .catch((error) => {
        console.warn("获取样式异常: " + error);
        this.isStyleListInterrupt = false;
      });
    return [];
  }

  get selectorList() {
    const key = "selectorList:" + this.curComponent.component;
    if (Object.prototype.hasOwnProperty.call(this.styleMap, key)) return this.styleMap[key];
    if (this.isStyleListInterrupt) return [];
    this.isStyleListInterrupt = true;
    axios
      .get("/BI/Component/GetSelectorList", {
        params: {
          name: this.curComponent.component,
        },
        timeout: 10000,
      })
      .then(({ data }) => {
        this.isStyleListInterrupt = false;
        if (Object.prototype.hasOwnProperty.call(this.styleMap, key)) return;
        if (data.data === undefined || data.data === null || data.data.length == 0) {
          console.warn("组件未配置选择器");
          return;
        }
        Vue.set(this.styleMap, key, data.data);
      })
      .catch((error) => {
        console.warn("获取选择器异常: " + error);
        this.isStyleListInterrupt = false;
      });
    return [];
  }

  // todo: 撑满父组件

  constructor() {
    super()
    console.log("样式组件基类创建组件");
  }
  public created() {
    console.log("样式组件基类创建组件: created");
    this.isStyleListInterrupt = false;
    this.isSwitchToStyle = false;

    this.$watch('styleList', (val, old) => {
      if (!this.isSwitchToStyle) return;

      if (
        this.addedStyleTags === undefined ||
        this.addedStyleTags.length === 0
      ) {
        console.warn("组件未应用任何样式...");
        return;
      }

      if (val === undefined || val.length === 0) {
        console.warn("组件未配置任何样式...");
        return;
      }

      // todo, 需要切换到组件最后一次编辑的项
      const style = this.addedStyleTags[0];
      const regex = /\[([^\]\s]*)\]/g;
      const styleArr = [];
      let match;
      while ((match = regex.exec(style.hierarchy)) !== null)
        styleArr.push(match[1]);

      if (styleArr.length !== 2) {
        console.warn(`样式的hierarchy不正确`, style);
        return;
      }
      this.handleStyleChange(styleArr);
      this.switchToStyle(style);
      this.isSwitchToStyle = false;

    }, { deep: true, immediate: true });

    this.$watch('selectedStyle', (val, old) => {
      this.handleStyleChange(val);
    }, { deep: true })
  }

  public mounted() {
    console.log("样式组件基类创建组件: mounted");
  }

  handleStyleChange(nodes: any) {
    for (let i = 0; i < this.styleList.length; i++) {
      const category = this.styleList[i];
      if (category.children && category.value === nodes[0])
        for (let j = 0; j < category.children.length; j++) {
          const style = category.children[j];
          if (style.value === nodes[1]) {
            this.curStyle = style;
            this.curStyle.hierarchy = `[${nodes[0]}][${nodes[1]}]`;
            return;
          }
        }
    }
  }

  switchToStyle(style: any) {
    this.curSelector = style.selector;
    const regex = /\[([^\]\s]*)\]/g;
    const styleArr = [];
    let match;
    while ((match = regex.exec(style.hierarchy)) !== null)
      styleArr.push(match[1]);
    if (styleArr.length !== 2) return;
    this.selectedStyle = styleArr;
    if (this.curStyle === undefined || this.curStyle.attrList === undefined)
      return;

    this.$nextTick(() => {
      for (let i = 0; i < this.curStyle.attrList.length; i++) {
        const attr = this.curStyle.attrList[i];
        const key = attr.variable.startsWith("@")
          ? attr.variable.substring(1)
          : attr.variable;
        if (style.cssData !== undefined &&
          Object.prototype.hasOwnProperty.call(style.cssData, key))
          attr.value = style.cssData[key];
      }
    });
  }

}
