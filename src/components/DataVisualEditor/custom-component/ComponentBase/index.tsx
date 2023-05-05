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
    console.log();
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
    this.element.data.p = "父组件挂载的数据"
  }

  public mounted() {
    this.$watch('element', (newValue, oldValue) => {
    }, { deep: false });

    // todo  监听组件样式, 执行组件的配置事件
  }

}
