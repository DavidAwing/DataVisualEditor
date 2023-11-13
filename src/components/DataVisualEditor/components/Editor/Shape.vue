<template>
  <div class="shape" :class="{ active }" @click="selectCurComponent" @mousedown="handleMouseDownOnShape"
    @mouseup="handleMouseUpOnShape" @mousemove="handleMouseMoveOnShape" @mouseover="handleMouseOverOnShape"
    @mouseout="handleMouseOutOnShape">
    <span v-show="isActive()" class="iconfont icon-xiangyouxuanzhuan" @mousedown="handleRotate"></span>
    <span v-show="element.isLock" class="iconfont icon-suo"></span>
    <div v-for="item in isActive() ? pointList : []" :key="item" class="shape-point" :style="getPointStyle(item)"
      @mousedown="handleMouseDownOnPoint(item, $event)"></div>
    <slot></slot>
  </div>
</template>

<script>
  import eventBus from "../../utils/eventBus";
  import runAnimation from "../../utils/runAnimation";
  import { pxToVw, pxToVh, vwToPx, vhToPx } from "../../utils/style";
  import { getElementCenter } from "../../utils/domUtils";
  import { mapState } from "vuex";
  import calculateComponentPositonAndSize from "../../utils/calculateComponentPositonAndSize";
  import { mod360 } from "../../utils/translate";
  import { isCtrlDown } from "../../utils/shortcutKey";

  // todo draggable 左键+CTRL点击组件后变为可拖拽,抬起后禁止并且不要显示右键菜单,

  export default {
    props: {
      active: {
        type: Boolean,
        default: false,
      },
      element: {
        require: true,
        type: Object,
        default: (val, old) => { },
      },
      defaultStyle: {
        require: true,
        type: Object,
        default: () => { },
      },
      index: {
        require: true,
        type: [Number, String],
        default: 0,
      },
    },
    data() {
      return {
        pointList: ["lt", "t", "rt", "r", "rb", "b", "lb", "l"], // 八个方向
        initialAngle: {
          // 每个点对应的初始角度
          lt: 0,
          t: 45,
          rt: 90,
          r: 135,
          rb: 180,
          b: 225,
          lb: 270,
          l: 315,
        },
        angleToCursor: [
          // 每个范围的角度对应的光标
          { start: 338, end: 23, cursor: "nw" },
          { start: 23, end: 68, cursor: "n" },
          { start: 68, end: 113, cursor: "ne" },
          { start: 113, end: 158, cursor: "e" },
          { start: 158, end: 203, cursor: "se" },
          { start: 203, end: 248, cursor: "s" },
          { start: 248, end: 293, cursor: "sw" },
          { start: 293, end: 338, cursor: "w" },
        ],
        cursors: {},
        lastClickDate: undefined
      };
    },
    computed: mapState([
      "curComponent",
      "editor",
      "activeComponentList",
      "canvasComponentData",
      "canvasData",
    ]),
    mounted() {


      // 用于 Group 组件
      if (this.curComponent) {
        this.cursors = this.getCursor(); // 根据旋转角度获取光标位置
      }
      eventBus.$on("runAnimation", () => {
        if (this.element == this.curComponent) {
          runAnimation(this.$el, this.curComponent.animations);
        }
      });
      eventBus.$on("stopAnimation", () => {
        this.$el.classList.remove("animated", "infinite");
      });
    },
    methods: {

      isActive() {
        return this.active && !this.element.isLock;
      },

      // 处理旋转
      handleRotate(e) {

        this.$store.commit("setClickComponentStatus", true);
        e.preventDefault();
        e.stopPropagation();
        // 初始坐标和初始角度
        const pos = { ...this.defaultStyle };
        const startY = e.clientY;
        const startX = e.clientX;

        const startRotate = pos.rotate;

        // 获取元素中心点位置
        const rect = this.$el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // 旋转前的角度
        const rotateDegreeBefore =
          Math.atan2(startY - centerY, startX - centerX) / (Math.PI / 180);

        // 如果元素没有移动，则不保存快照
        let hasMove = false;
        const move = (moveEvent) => {
          hasMove = true;
          const curX = moveEvent.clientX;
          const curY = moveEvent.clientY;
          // 旋转后的角度
          const rotateDegreeAfter =
            Math.atan2(curY - centerY, curX - centerX) / (Math.PI / 180);
          // 获取旋转的角度值
          const rotate =
            parseFloat(startRotate) + rotateDegreeAfter - rotateDegreeBefore;
          pos.rotate = rotate.toFixed(2);

          // 修改当前组件样式
          this.$store.commit("setShapeStyle", pos);
        };

        const up = () => {
          hasMove && this.$store.commit("recordSnapshot");
          document.removeEventListener("mousemove", move);
          document.removeEventListener("mouseup", up);
          this.cursors = this.getCursor(); // 根据旋转角度获取光标位置
        };

        document.addEventListener("mousemove", move);
        document.addEventListener("mouseup", up);
      },

      getPointStyle(point) {
        const { width, height } = this.defaultStyle;
        const hasT = /t/.test(point);
        const hasB = /b/.test(point);
        const hasL = /l/.test(point);
        const hasR = /r/.test(point);
        let newLeft = 0;
        let newTop = 0;

        let leftUnit = "px";
        let topUnit = "px";

        // 四个角的点
        if (point.length === 2) {
          newLeft = hasL ? 0 : width;
          newTop = hasT ? 0 : height;

          if (!hasL) leftUnit = this.element.styleUnit.width;
          if (!hasT) topUnit = this.element.styleUnit.height;

          if (point === "rt" && leftUnit === "%") newLeft = 100;
          if (point === "rb" && leftUnit === "%") {
            newLeft = 100;
            newTop = 100;
          }
          if (point === "lb" && topUnit === "%") newTop = 100;
        } else {
          // 上下两点的点，宽度居中
          if (hasT || hasB) {
            newLeft = width / 2;
            newTop = hasT ? 0 : height;
          }

          // 左右两边的点，高度居中
          if (hasL || hasR) {
            newLeft = hasL ? 0 : width;
            newTop = parseInt(height / 2);
          }

          if (point == "t") {
            leftUnit = this.element.styleUnit.width;
            if (leftUnit === "%") newLeft = 50;
          } else if (point == "l") {
            topUnit = this.element.styleUnit.height;
            if (topUnit === "%") newTop = 50;
            else if (topUnit === "vw" || topUnit === "vh")
              newTop = this.element.style.height / 2;
          } else if (point == "r" || point == "b") {
            leftUnit = this.element.styleUnit.width;
            topUnit = this.element.styleUnit.height;

            if (point === "r" && leftUnit === "%") {
              newLeft = 100;
              newTop = 50;
            } else if (
              point === "r" &&
              (leftUnit === "vw" || leftUnit === "vh")
            ) {
              newTop = this.element.style.height / 2;
            } else if (point === "b" && topUnit === "%") {
              newLeft = 50;
              newTop = 100;
            }
          } else {
            console.warn("getPointStyle获取尺寸单位异常");
          }
        }

        const style = {
          marginLeft: "-4px",
          marginTop: "-4px",
          left: `${newLeft}${leftUnit}`,
          top: `${newTop}${topUnit}`,
          cursor: this.cursors[point],
        };

        return style;
      },

      getCursor() {
        const { angleToCursor, initialAngle, pointList, curComponent } = this;
        const rotate = mod360(curComponent.style.rotate); // 取余 360
        const result = {};
        let lastMatchIndex = -1; // 从上一个命中的角度的索引开始匹配下一个，降低时间复杂度

        pointList.forEach((point) => {
          const angle = mod360(initialAngle[point] + rotate);
          const len = angleToCursor.length;
          while (true) {
            lastMatchIndex = (lastMatchIndex + 1) % len;
            const angleLimit = angleToCursor[lastMatchIndex];
            if (angle < 23 || angle >= 338) {
              result[point] = "nw-resize";
              return;
            }

            if (angleLimit.start <= angle && angle < angleLimit.end) {
              result[point] = angleLimit.cursor + "-resize";
              return;
            }
          }
        });

        return result;
      },

      handleMouseDownOnShape(e) {

        this.lastClickDate = new Date()

        this.$store.commit("setInEditorStatus", true);
        this.$store.commit("setClickComponentStatus", true);
        if (
          this.element.component != "v-text" &&
          this.element.component != "v-rect-shape"
        ) {
          e.preventDefault();
        }
        e.stopPropagation();

        if (isCtrlDown() && e.button === 0) {
          if (
            this.curComponent !== null &&
            !this.activeComponentList.includes(this.curComponent.id)
          )
            this.$store.commit("addActiveComponent", this.curComponent.id);

          if (this.activeComponentList.includes(this.element.id)) {
            this.$store.commit("deleteActiveComponent", this.element.id);
          } else {
            this.$store.commit("addActiveComponent", this.element.id);
          }

          const last = this.canvasComponentData.find(
            (item) =>
              item.id ===
              this.activeComponentList[this.activeComponentList.length - 1]
          );

          if (last !== undefined) {
            this.$store.commit("setCurComponent", {
              component: last,
              index: last.id,
            });
          } else {
            this.$store.commit("setCurComponent", {
              component: null,
              index: null,
            });
          }

          if (this.activeComponentList.length > 0) {
            const activeComponentList = [];
            this.activeComponentList.forEach((id) => {
              const item = this.canvasComponentData.find(
                (item) => item.id === id
              );
              activeComponentList.push(item);
            });
            eventBus.$emit("createGroup", activeComponentList);
          }
          return;
        }

        if (e.button === 0) {
          this.$store.commit("clearAreaData")
          this.$store.commit("clearActiveComponent");
        }

        this.$store.commit("setCurComponent", {
          component: this.element,
          index: this.index,
        });
        if (this.element.isLock) return;

        this.cursors = this.getCursor(); // 根据旋转角度获取光标位置

        const pos = { ...this.defaultStyle };
        const startY = e.clientY;
        const startX = e.clientX;
        // 如果直接修改属性，值的类型会变为字符串，所以要转为数值型
        const startTop = Number(pos.top);
        const startLeft = Number(pos.left);

        // 如果元素没有移动，则不保存快照
        let hasMove = false;

        const editorRect = document
          .getElementById("editor")
          .getBoundingClientRect();

        const move = (moveEvent) => {

          // 防止误拖动
          const milliseconds = new Date().getTime() - this.lastClickDate.getTime();
          if (milliseconds < 200) {
            return
          }

          if (moveEvent.ctrlKey) {
            return
          }

          hasMove = true;
          const curX = moveEvent.clientX;
          const curY = moveEvent.clientY;

          if (this.element.styleUnit.left === "vw") {
            pos.left = pxToVw(curX - startX) + startLeft;
          } else if (this.element.styleUnit.left === "vh") {
            pos.left = pxToVh(curX - startX) + startLeft;
          } else if (this.element.styleUnit.left === "%") {
            pos.left = (curX - startX) / 13 + startLeft;

            // if (this.canvasData.unit === "px") {
            //   pos.top = moveEvent.offsetX / this.canvasData.width * 100 * (this.canvasData.scale / 100)
            // } else {
            //   pos.top = moveEvent.offsetX / screen.width  * 100 * (this.canvasData.scale / 100)
            // }
          } else {
            pos.left = curX - startX + startLeft;
          }

          if (this.element.styleUnit.top === "vw") {
            pos.top = pxToVw(curY - startY) + startTop;
          } else if (this.element.styleUnit.top === "vh") {
            pos.top = pxToVh(curY - startY) + startTop;
          } else if (this.element.styleUnit.top === "%") {
            pos.top = (curY - startY) / 9 + startTop;

            // if (this.canvasData.unit === "px") {
            //   pos.top = moveEvent.clientY / this.canvasData.height * 100 * (this.canvasData.scale / 100)
            // } else {
            //   pos.top = moveEvent.clientY / 100 / screen.height  * 100 * (this.canvasData.scale / 100)
            // }
          } else {
            pos.top = curY - startY + startTop;
          }

          // 修改当前组件样式
          this.$store.commit("setShapeStyle", pos);

          // 等更新完当前组件的样式并绘制到屏幕后再判断是否需要吸附
          // 如果不使用 $nextTick，吸附后将无法移动
          this.$nextTick(() => {
            if (this.curComponent.data.isAlign === false) return;
            // 触发元素移动事件，用于显示标线、吸附功能
            // 后面两个参数代表鼠标移动方向
            // curY - startY > 0 true 表示向下移动 false 表示向上移动
            // curX - startX > 0 true 表示向右移动 false 表示向左移动
            eventBus.$emit("move", curY - startY > 0, curX - startX > 0);
          });
        };

        const up = () => {
          hasMove && this.$store.commit("recordSnapshot");
          // 触发元素停止移动事件，用于隐藏标线
          eventBus.$emit("unmove");
          document.removeEventListener("mousemove", move);
          document.removeEventListener("mouseup", up);
        };

        document.addEventListener("mousemove", move);
        document.addEventListener("mouseup", up);
      },

      handleMouseUpOnShape(e) {

      },

      handleMouseMoveOnShape(e) {

      },

      handleMouseOverOnShape(e) {
      },

      handleMouseOutOnShape(e) {
      },

      selectCurComponent(e) {
        // 阻止向父组件冒泡
        e.stopPropagation();
        e.preventDefault();
        this.$store.commit("hideContextMenu");
      },

      getElementCenter,

      handleMouseDownOnPoint(point, e) {
        this.$store.commit("setInEditorStatus", true);
        this.$store.commit("setClickComponentStatus", true);
        e.stopPropagation();
        e.preventDefault();

        const style = { ...this.defaultStyle };

        const prevLeft = style.left;
        const prevTop = style.top;
        const prevWidth = style.width;
        const prevHeight = style.height;

        // 组件宽高比
        const proportion = style.width / style.height;

        // 组件中心点, 对于vw等单位计算错误
        // const center = {
        //   x: style.left + style.width / 2,
        //   y: style.top + style.height / 2,
        // };

        const center = this.getElementCenter(
          document.getElementById("component" + this.curComponent.id)
        );

        // 获取画布位移信息
        const editorRectInfo = this.editor.getBoundingClientRect();

        // 获取 point 与实际拖动基准点的差值 @justJokee
        // fix https://github.com/woai3c/visual-drag-demo/issues/26#issue-937686285
        const pointRect = e.target.getBoundingClientRect();
        // 当前点击圆点相对于画布的中心坐标
        const curPoint = {
          x: Math.round(
            pointRect.left - editorRectInfo.left + e.target.offsetWidth / 2
          ),
          y: Math.round(
            pointRect.top - editorRectInfo.top + e.target.offsetHeight / 2
          ),
        };

        // 获取对称点的坐标
        const symmetricPoint = {
          x: center.x - (curPoint.x - center.x),
          y: center.y - (curPoint.y - center.y),
        };

        // 是否需要保存快照
        let needSave = false;
        let isFirst = true;

        const needLockProportion = this.isNeedLockProportion();
        const move = (moveEvent) => {
          // 第一次点击时也会触发 move，所以会有“刚点击组件但未移动，组件的大小却改变了”的情况发生
          // 因此第一次点击时不触发 move 事件
          if (isFirst) {
            isFirst = false;
            return;
          }

          needSave = true;

          const curPositon = {
            x: moveEvent.clientX - editorRectInfo.left,
            y: moveEvent.clientY - editorRectInfo.top,
          };

          const curComponent = this.curComponent;

          calculateComponentPositonAndSize(
            point,
            style,
            curPositon,
            proportion,
            needLockProportion,
            {
              center,
              curPoint,
              symmetricPoint,
            }
          );

          if (curComponent.styleUnit.top === "vw") {
            style.top = pxToVw(style.top);
          } else if (curComponent.styleUnit.top === "vh") {
            style.top = pxToVh(style.top);
          } else if (curComponent.styleUnit.top === "%") {
            style.top = pxToVh(style.top);
          }

          if (curComponent.styleUnit.left === "vw") {
            style.left = pxToVw(style.left);
          } else if (curComponent.styleUnit.left === "vh") {
            style.left = pxToVh(style.left);
          } else if (curComponent.styleUnit.left === "%") {
            style.left = pxToVw(style.left);
          }

          if (curComponent.styleUnit.width === "vw") {
            style.width = pxToVw(style.width);
          } else if (curComponent.styleUnit.width === "vh") {
            style.width = pxToVh(style.width);
          } else if (curComponent.styleUnit.width === "%") {
            style.width = pxToVw(style.width);
          }

          if (curComponent.styleUnit.height === "vw") {
            style.height = pxToVw(style.height);
          } else if (curComponent.styleUnit.height === "vh") {
            style.height = pxToVh(style.height);
          } else if (curComponent.styleUnit.height === "%") {
            style.height = pxToVh(style.height);
          }

          // lt rt rb lb
          if (point === "rb") {
            // OK
            delete style["left"];
            delete style["top"];
          } else if (point === "lt") {
          } else if (point === "r") {
            // OK
            delete style["top"];
            delete style["left"];
            delete style["height"];
          } else if (point === "l") {
            // OK
            if (
              (curComponent.styleUnit.width.startsWith("v") &&
                curComponent.styleUnit.left.startsWith("v")) ||
              (curComponent.styleUnit.width.startsWith("%") &&
                curComponent.styleUnit.left.startsWith("%"))
            ) {
              const correction = prevLeft - style.left;
              style.left = prevLeft - correction;
              style.width = prevWidth + correction;
            }

            delete style["top"];
            delete style["height"];
          } else if (point === "t") {
            // OK
            if (
              (curComponent.styleUnit.height.startsWith("v") &&
                curComponent.styleUnit.top.startsWith("v")) ||
              (curComponent.styleUnit.height.startsWith("%") &&
                curComponent.styleUnit.top.startsWith("%"))
            ) {
              const correction = prevTop - style.top;
              style.top = prevTop - correction;
              style.height = prevHeight + correction;
            }

            delete style["width"];
            delete style["left"];
          } else if (point === "b") {
            // OK
            delete style["top"];
            delete style["width"];
            delete style["left"];
          }

          this.$store.commit("setShapeStyle", style);
        };

        const up = () => {
          document.removeEventListener("mousemove", move);
          document.removeEventListener("mouseup", up);
          needSave && this.$store.commit("recordSnapshot");
        };

        document.addEventListener("mousemove", move);
        document.addEventListener("mouseup", up);
      },

      isNeedLockProportion() {
        if (this.element.component != "Group") return false;
        const ratates = [0, 90, 180, 360];
        for (const component of this.element.propValue) {
          if (!ratates.includes(mod360(parseFloat(component.style.rotate)))) {
            return true;
          }
        }

        return false;
      },
    },
  };
</script>

<style lang="less" scoped>
  .shape {
    position: absolute;

    &:hover {
      cursor: move;
    }
  }

  .active {
    outline: 1px solid #70c0ff;
    user-select: none;
  }

  .shape-point {
    position: absolute;
    background: #fff;
    border: 1px solid #59c7f9;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    z-index: 1;
  }

  .icon-xiangyouxuanzhuan {
    position: absolute;
    top: -34px;
    left: 50%;
    transform: translateX(-50%);
    cursor: grab;
    color: #59c7f9;
    font-size: 20px;
    font-weight: 600;

    &:active {
      cursor: grabbing;
    }
  }

  .icon-suo {
    position: absolute;
    top: 0;
    right: 0;
  }
</style>
