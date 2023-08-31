import Vue, { PropType, VNode } from "vue";
import { Component, Prop, Emit, Watch } from 'vue-property-decorator'

@Component({
  components: {},
})
export default class ComponentBase extends Vue {

  @Prop({ required: true }) element!: any;

  public onEvent(name: string, data = {}) {
    const func = this.element.events[name];
    if (!func) return;
    func({
      component: this,
      data: { ...data },
      element: this.element
    });
  }

  // todo: 撑满父组件

  constructor() {
    super()
    this.$watch('element', (newValue, oldValue) => {
      console.log("");
    }, { deep: true, immediate: true });
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
    // this.element.data.p = "父组件挂载的数据"
    this.onEvent('onCreated')
  }

  public mounted() {
    this.onEvent('onMounted')
  }


}
