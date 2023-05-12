
import { defineComponent } from '@vue/composition-api'


// import { applyPureReactInVue, applyPureVueInReact } from 'veaury'


// 输入框支持搜索
//
export default defineComponent({
  components: {  },
  data() {
    return {
      msg: "default",
    };
  },
  props: {
    data: { type: Array, default: new Array<any>() },
    placeholder: {
      type: String,
      default: ''
    },
    defaultValue: {
      type: String,
      default: ''
    },
    css: {
      type: String,
      default: 'width: 300px;'
    },
    // 失去焦点时回调
    focus: {
      type: Function,
      default: () => {
        console.log('focus');
      }
    },
    blur: {
      type: Function,
      default: () => {
        console.log('blur');
      }
    },
    // 选中 option，或 input 的 value 变化（combobox 模式下）时，调用此函数
    change: {
      type: Function,
      default: (value: any, option: any) => {
        console.log('change');
      }
    },
    // 键盘按下时回调
    inputKeydown: {
      type: Function,
      default: (event: Event) => {
        console.log('inputKeydown', event);
      }
    },
    // 鼠标移入时回调
    mouseenter: {
      type: Function,
      default: (event: Event) => {
        console.log('mouseenter', event);
      }
    },
    // 鼠标移出时回调
    mouseleave: {
      type: Function,
      default: (event: Event) => {
        console.log('mouseleave', event);
      }
    },
    // 下拉列表滚动时的回调
    popupScroll: {
      type: Function,
      default: (event: Event) => {
        console.log('popupScroll', event);
      }
    },
    // 文本框值变化时回调
    search: {
      type: Function,
      default: (value: Event) => {
        console.log('search', value);
      }
    },
    // 被选中时调用，参数为选中项的 value (或 key) 值
    select: {
      type: Function,
      default: (value: any, option: any) => {
        console.log('select', value, option);
      }
    },
    // 展开下拉菜单的回调
    dropdownVisibleChange: {
      type: Function,
      default: (open: any) => {
        console.log('dropdownVisibleChange', open);
      }
    },

  },
  methods: {
    click(msg: any) {
      // 子组件 input的事件回调
      // 实现 改变msg值
      //   this.user = '123';
      console.log(msg);
    }
  },
  render() {
    return (
      <div>
        <a-select show-search placeholder={this.placeholder} option-filter-prop="children" style={this.css}
          onfocus={this.focus} onblur={this.blur} onchange={this.change} oninputKeydown={this.inputKeydown} defaultValue={this.defaultValue}>
          {
            this.data.map((item: any) => {
              return <a-select-option value={item}>{item}</a-select-option>
            })
          }
        </a-select>
      </div>
    );
  }
})
