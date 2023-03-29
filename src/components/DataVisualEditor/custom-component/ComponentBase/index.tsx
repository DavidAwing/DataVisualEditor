import Vue, { PropType, VNode } from "vue";
import { Component, Prop, Emit, Watch } from 'vue-property-decorator'

@Component({
  components: {},
})
export default class ComponentBase extends Vue {

  @Prop() element: any;

  // todo: 撑满父组件

  constructor() {
    super()
    console.log("基类创建组件");
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

  created() {
    console.log("基类生命周期", this.element);

    this.element.data.p = "父组件挂载的数据"
  }

  mounted() {
    console.log("基类生命周期: mounted");
  }

}
