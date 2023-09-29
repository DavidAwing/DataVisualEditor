

import Vue, { PropType, VNode, CreateElement } from "vue";
import { Component, Prop, Emit, Watch } from 'vue-property-decorator'
import { getRandStr } from "../../utils/utils";
@Component({
  components: {},
})
export default class ComponentBase extends Vue {

  @Prop({ required: true }) element!: any;

  public onEvent(name: string, data = {}) {
    const func = this.element.events[name];
    if (!func) {
      console.warn(`onEvent|组件${this.element.data.name}未定义${name}事件`);
      return;
    }

    if (typeof func != 'function') {
      console.warn(`onEvent|组件${this.element.data.name}的${name}事件不是function`);
      return;
    }
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

  // render(createElement: CreateElement) {
  //   const baseId = getRandStr()
  //   return createElement(
  //     'div',   // 标签名称
  //     {
  //       attrs: {
  //         id: this.element.data.baseId ?? baseId
  //       }
  //     },
  //     this.$slots.default // 子节点数组
  //   )
  // }

  public created() {
    // this.element.data.p = "父组件挂载的数据"
    this.onEvent('onCreated')
  }

  public mounted() {
    this.onEvent('onMounted')




    // <top-el-dialog
    // id="test-dialog"
    //   title="编辑表头"
    //   :visible.sync="visible"
    //   :isModalDialog="isModalDialog"
    //   width="35%"
    //   v-el-drag-dialog
    //   center
    //   v-if="sssssss"
    // >

    // <div style="display: inline;">1113213232132</div>
    // <span slot="footer" class="dialog-footer">
    //   <el-button>取 消</el-button>
    //   <el-button type="primary">确 定</el-button>
    // </span>
    // </top-el-dialog>

  }



}
