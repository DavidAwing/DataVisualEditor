import Vue, { PropType, VNode } from "vue";
import { Component, Prop, Emit, Watch } from 'vue-property-decorator'

@Component({
  components: {},
})
export default class ComponentBase extends Vue {

  @Prop({ required: true }) element!: any;

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

  public created() {
    console.log("基类生命周期", this.element);

    this.element.data.p = "父组件挂载的数据"

  }

  public mounted() {
    console.log("基类生命周期: mounted");


    this.$watch('element', (newValue, oldValue) => {
      console.log('基类生命周期 element changed:', newValue, oldValue);
    }, { deep: false });

  }

}
