<template>
  <div id="editor" class="editor" :class="{ edit: isEdit }" :style="getCanvasStyle(canvasData)"
    @contextmenu="handleContextMenu" @mousedown="handleMouseDown">
    <!-- 网格线 -->
    <Grid />
    <!--页面组件列表展示-->

    <template v-for="(item, index) in canvasComponentData">
      <component-dialog :key="item.id" v-if="item.data.isModal" title="编辑表头" :visible.sync="item.data.isModalVisible"
        width="35%" :element="item" v-el-drag-dialog center>
        <Shape :default-style="item.style" :style="getShapeStyle(item.style, item.styleUnit)"
          :active="item.id === (curComponent || {}).id || activeComponentList.includes(item.id)" :element="item"
          :index="index" :class="{ lock: item.isLock }" v-show="item.data.show">
          <component :is="item.component" v-if="item.component != 'v-text'" :id="'component' + item.id" class="component"
            :style="getComponentStyle(item)" :prop-value="item.propValue" :element="item" />
          <component :is="item.component" v-else :id="'component' + item.id" class="component"
            :style="getComponentStyle(item)" :prop-value="item.propValue" :element="item" @input="handleInput" />
        </Shape>
      </component-dialog>

      <Shape v-else :key="item.id" :default-style="item.style" :style="getShapeStyle(item.style, item.styleUnit)"
        :active="item.id === (curComponent || {}).id || activeComponentList.includes(item.id)" :element="item"
        :index="index" :class="{ lock: item.isLock }" v-show="item.data.show">
        <component v-if="item.component != 'v-text'" :is="item.component" :id="'component' + item.id" class="component"
          :style="getComponentStyle(item)" :prop-value="item.propValue" :element="item" />
        <component v-else :is="item.component" :id="'component' + item.id" class="component"
          :style="getComponentStyle(item)" :prop-value="item.propValue" :element="item" @input="handleInput" />
      </Shape>
    </template>

    <!-- 右击菜单 -->
    <ContextMenu />
    <!-- 标线 -->
    <MarkLine />
    <!-- 选中区域 -->
    <Area v-show="isShowArea" :start="start" :width="width" :height="height" />
  </div>
</template>

<script lang="js">
import { mapState } from 'vuex';
import Shape from './Shape';
import { getStyle, getComponentRotatedStyle, getCanvasStyle, addStyleListToHead } from '../../utils/style';
import { $ as querySelector } from '../../utils/utils';
import ContextMenu from './ContextMenu';
import MarkLine from './MarkLine';
import Area from './Area';
import eventBus from '../../utils/eventBus';
import { getElementRect, getScrollBarWidth } from '../../utils/domUtils';
import Grid from './Grid.vue';
import { changeStyleWithScale } from '../../utils/translate';
import { getComponentSharedData } from '../../custom-component/component-list'; // 左侧列表数据
import { requestCanvasData } from '../../utils/dataBinder';
import * as DB from '../../utils/indexDB';
import generateID, { resetID } from '../../utils/generateID';
import ElementUI, { Dialog } from 'element-ui';
import Vue from 'vue';
import elDragDialog from '../../directive/el-drag-dialog';

Vue.component('component-dialog', {
  extends: Dialog,
  components: {},
  props: {
    isModalDialog: Boolean,
    element: Object,
    toBody: {
      type: Boolean,
      default: true,
    },
  },
  beforeMount() { },
  mounted() {
    this.$el.classList.add('component-dialog');
    if (this.toBody === false) {
      console.log('toBody');
    } else {
      document.body.appendChild(this.$el);
    }
  },
  watch: {
    visible: {
      handler: function (val) {
        this.$nextTick(() => {
          if (val) {

            $(this.$el).find('.el-dialog').css('position', 'absolute');

            if (this.element.component === 'Group') {
              const component = $(this.$el).find('.group.component')
              component.css('width', '100%');
              component.css('height', '100%');
            } else {
              const component = $(this.$el).find('.el-dialog>.el-dialog__body>.shape>.component')
              component.css('width', '100%');
              component.css('height', '100%');
            }
            this.element.dialogData = { align: 'top|center' }
            if (!this.element.dialogData)
              return
            let { align, left, top } = this.element.dialogData
            if (!left)
              left = '0px'
            if (!top)
              top = '0px'
            left = left.trim()
            top = top.trim()

            function isNumeric(str) {
              return /^(\d|\.)+$/.test(str);
            }
            if (isNumeric(left))
              left += 'px'
            if (isNumeric(top))
              top += 'px'
            const clientWidth = document.body.clientWidth
            const clientHeight = document.body.clientHeight
            const shape = $(this.$el).find('.shape')
            const shapeHeight = shape.height()
            const shapeWidth = shape.width()
            const rotate = this.element.style.rotate;

            if (!align.includes('|') && align.includes('center')) {
              // 居中
              const leftMove = ((clientWidth - shapeWidth) / 2) - parseFloat(shape.css('left'));
              const topMove = ((clientHeight - shapeHeight) / 2) - parseFloat(shape.css('top'))
              shape.css('transform', `translateX(${leftMove}px) translateY(${topMove}px) rotate(${rotate}deg)`)
            } else if ((!align.includes('|') && align.includes('left')) || (align.includes('|') && align.includes('center') && align.includes('left'))) {
              // 左对齐,上下居中
              const topMove = ((clientHeight - shapeHeight) / 2) - parseFloat(shape.css('top'))
              shape.css('transform', `translateX(${left}) translateY(${topMove}px) rotate(${rotate}deg)`)
            } else if ((!align.includes('|') && align.includes('top')) || (align.includes('|') && align.includes('center') && align.includes('top'))) {
              // 左右居中,顶部对齐
              const leftMove = ((clientWidth - shapeWidth) / 2) - parseFloat(shape.css('left'));
              shape.css('transform', `translateX(${leftMove}px) translateY(${top}) rotate(${rotate}deg)`)
            } else if (align.includes('|') && align.includes('left') && align.includes('top')) {
              shape.css('transform', `translateX(${left}px) translateY(${top}) rotate(${rotate}deg)`)
            } else {
              shape.css('transform', `translateX(${0}px) translateY(${0}px) rotate(${rotate}deg)`)
            }
          }
        });
      },
      deep: true,
      immediate: true,
    },
  },
});

export default {
  components: { Shape, ContextMenu, MarkLine, Area, Grid },
  directives: {
    elDragDialog,
  },
  props: {
    isEdit: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      editorX: 0,
      editorY: 0,
      start: {
        // 选中区域的起点
        x: 0,
        y: 0,
      },
      width: 0,
      height: 0,
      isShowArea: false,
      componentTopDialogVisible: true,
    };
  },
  computed: {
    ...mapState([
      'canvasComponentData',
      'curComponent',
      'canvasData',
      'editor',
      'canvasName',
      'activeComponentList',
      'curComponentIndex',
    ]),
  },
  watch: {
    canvasComponentData: {
      handler: function (val, old) { },
      deep: false,
    },
    canvasName: {
      handler: function (val, old) {
        if (this.canvasName === undefined || this.canvasName === null || this.canvasName.trim() === '') return;
      },
      deep: false,
      immediate: true,
    },
  },
  created() { },
  mounted() {
    // 获取编辑器元素
    this.$store.commit('getEditor');

    eventBus.$on('createGroup', areaData => {
      this.createGroup(areaData);
    });

    eventBus.$on('hideArea', () => {
      this.hideArea();
    });

    eventBus.$on('SwitchNextComponent', e => {
      if (
        this.canvasComponentData === undefined ||
        this.canvasComponentData === null ||
        this.canvasComponentData.length === 0
      )
        return;

      let component = null;
      let index = 0;
      if (this.curComponent === undefined || this.curComponent === null) {
        component = this.canvasComponentData[0];
      } else {
        for (let i = 0; i < this.canvasComponentData.length; i++) {
          if (this.canvasComponentData[i].id === this.curComponent.id) {
            index = i + 1;
            if (index >= this.canvasComponentData.length) index = 0;
            component = this.canvasComponentData[index];
            break;
          }
        }
      }

      this.$store.commit('setCurComponent', {
        component: this.canvasComponentData[index],
        index: index,
      });
    });

    DB.CallbackMap.onOpenSucceedEventList.push(async () => {
      console.log('数据库开启成功...');
    });

    // const ComponentConstructor = Vue.extend({
    //   extends: Dialog,
    //   props: {
    //   },
    //   mounted() {
    //     // document.body.appendChild(this.$el);
    //     // document.getElementById('editor').appendChild(this.$el);
    //   },
    //   watch: {
    //     isModalDialog: {
    //       handler: function (val) {},
    //       deep: true,
    //       immediate: true,
    //     },
    //   },
    // });
    // const componentInstance = new ComponentConstructor({
    //     // el: '#editor',
    //     propsData: {
    //       title: '编辑表头',
    //       visible: true,
    //       width: '35%',
    //       vElDragDialog: true,
    //       center: true,
    //     },
    //   });
    // componentInstance.$mount();
    // componentInstance.$destroy()
    // componentInstance.$el.remove()
  },
  updated() {
    setTimeout(() => {
      const editor = document.getElementById('editor');
      const content = document.getElementsByClassName('content')[0];
      const editorRect = editor.getClientRects()[0];
      const contentRect = content.getClientRects()[0];
      if (editorRect.width < contentRect.width && editorRect.height < contentRect.height) {
        const x = (contentRect.width - editorRect.width) / 2;
        const y = (contentRect.height - editorRect.height) / 2;
        document.getElementById('editor').style.transform = `translate(${x}px, ${y}px)`;
      } else if (editorRect.width < contentRect.width && editorRect.height > contentRect.height) {
        const x = (contentRect.width - editorRect.width - getScrollBarWidth()) / 2;
        document.getElementById('editor').style.transform = `translate(${x}px, 0)`;
      } else if (editorRect.height < contentRect.height && editorRect.width > contentRect.width) {
        const y = (contentRect.height - editorRect.height - getScrollBarWidth()) / 2;
        document.getElementById('editor').style.transform = `translate(0, ${y}px)`;
      } else {
        document.getElementById('editor').style.transform = 'translate(0, 0)';
      }
    }, 10);
  },
  methods: {
    changeStyleWithScale,

    resetID,

    getCanvasStyle,

    handleMouseDown(e) {
      // 如果没有选中组件 在画布上点击时需要调用 e.preventDefault() 防止触发 drop 事件
      if (
        !this.curComponent ||
        (this.curComponent.component != 'v-text' && this.curComponent.component != 'v-rect-shape')
      ) {
        e.preventDefault();
      }

      this.hideArea();

      // 获取编辑器的位移信息，每次点击时都需要获取一次。主要是为了方便开发时调试用。
      const rectInfo = this.editor.getBoundingClientRect();
      this.editorX = rectInfo.x;
      this.editorY = rectInfo.y;

      const startX = e.clientX;
      const startY = e.clientY;
      this.start.x = startX - this.editorX;
      this.start.y = startY - this.editorY;
      // 展示选中区域
      this.isShowArea = true;

      const move = moveEvent => {
        this.width = Math.abs(moveEvent.clientX - startX);
        this.height = Math.abs(moveEvent.clientY - startY);
        if (moveEvent.clientX < startX) {
          this.start.x = moveEvent.clientX - this.editorX;
        }

        if (moveEvent.clientY < startY) {
          this.start.y = moveEvent.clientY - this.editorY;
        }
      };

      const up = e => {
        document.removeEventListener('mousemove', move);
        document.removeEventListener('mouseup', up);

        if (e.clientX == startX && e.clientY == startY) {
          this.hideArea();
          return;
        }

        const areaData = this.getSelectArea();
        this.createGroup(areaData);
      };

      document.addEventListener('mousemove', move);
      document.addEventListener('mouseup', up);
    },

    hideArea() {
      this.isShowArea = 0;
      this.width = 0;
      this.height = 0;

      this.$store.commit('setAreaData', {
        style: {
          left: 0,
          top: 0,
          width: 0,
          height: 0,
        },
        components: [],
      });
    },

    createGroup(areaData) {
      // 获取选中区域的组件数据
      if (areaData.length <= 1) {
        this.hideArea();
        return;
      }

      // 根据选中区域和区域中每个组件的位移信息来创建 Group 组件
      // 要遍历选择区域的每个组件，获取它们的 left top right bottom 信息来进行比较
      let top = Infinity,
        left = Infinity;
      let right = -Infinity,
        bottom = -Infinity;
      areaData.forEach(component => {
        let style = {};
        if (component.component == 'Group') {
          component.propValue.forEach(item => {
            const rectInfo = querySelector(`#component${item.id}`).getBoundingClientRect();
            style.left = rectInfo.left - this.editorX;
            style.top = rectInfo.top - this.editorY;
            style.right = rectInfo.right - this.editorX;
            style.bottom = rectInfo.bottom - this.editorY;

            if (style.left < left) left = style.left;
            if (style.top < top) top = style.top;
            if (style.right > right) right = style.right;
            if (style.bottom > bottom) bottom = style.bottom;
          });
        } else {
          style = getComponentRotatedStyle(component.style);
        }

        if (style.left < left) left = style.left;
        if (style.top < top) top = style.top;
        if (style.right > right) right = style.right;
        if (style.bottom > bottom) bottom = style.bottom;
      });

      this.start.x = left;
      this.start.y = top;
      this.width = right - left;
      this.height = bottom - top;

      // 设置选中区域位移大小信息和区域内的组件数据
      this.$store.commit('setAreaData', {
        style: {
          left,
          top,
          width: this.width,
          height: this.height,
        },
        components: areaData,
      });
    },

    getSelectArea() {
      const result = [];
      // 区域起点坐标
      const { x, y } = this.start;
      // 计算所有的组件数据，判断是否在选中区域内
      this.canvasComponentData.forEach(component => {
        if (component.isLock) return;

        const { left, top, width, height } = getComponentRotatedStyle(component.style);
        if (x <= left && y <= top && left + width <= x + this.width && top + height <= y + this.height) {
          result.push(component);
        }
      });

      // 返回在选中区域内的所有组件
      return result;
    },

    handleContextMenu(e) {
      e.stopPropagation();
      e.preventDefault();

      // 计算菜单相对于编辑器的位移
      let target = e.target;
      let top = e.offsetY;
      let left = e.offsetX;
      while (target instanceof SVGElement) {
        target = target.parentNode;
      }

      while (!target.className.includes('editor')) {
        left += target.offsetLeft;
        top += target.offsetTop;
        target = target.parentNode;
      }

      this.$store.commit('showContextMenu', { top, left });
    },

    getShapeStyle(style, styleUnit) {
      const result = {};
      ['width', 'height', 'top', 'left', 'rotate'].forEach(attr => {
        if (attr != 'rotate') {
          result[attr] = style[attr] + (styleUnit ? styleUnit[attr] : 'px');
        } else {
          result.transform = 'rotate(' + style[attr] + 'deg)';
        }
      });
      return result;
    },

    getComponentStyle(component) {
      return getStyle(component.style, component.styleUnit, this.canvasData.scale / 100, [
        'top',
        'left',
        'width',
        'height',
        'rotate',
      ]);
    },

    handleInput(element, value) {
      // 根据文本组件高度调整 shape 高度
      this.$store.commit('setShapeStyle', {
        height: this.getTextareaHeight(element, value),
      });
    },

    getTextareaHeight(element, text) {
      let { lineHeight, fontSize, height } = element.style;
      if (lineHeight === '') {
        lineHeight = 1.5;
      }

      const newHeight = (text.split('<br>').length - 1) * lineHeight * fontSize;
      return height > newHeight ? height : newHeight;
    },
  },
};
</script>

<style lang="less" scoped>
.editor {
  position: absolute;
  background: transparent;
  margin: 0;
  padding: 0;
  overflow: auto;

  /* left: 3px;
  top: 3px; */

  .lock {
    opacity: 0.5;

    &:hover {
      cursor: not-allowed;
    }
  }
}

.edit {
  .component {
    outline: none;
    width: 100%;
    height: 100%;
  }
}
</style>
