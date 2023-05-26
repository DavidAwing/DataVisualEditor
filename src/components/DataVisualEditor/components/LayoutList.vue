<!-- TODO: 这个页面后续将用 JSX 重构 -->
<template>
  <div class="attr-list">
    <el-form>
      <!-- 样式 -->
      <el-form-item
        v-for="(item, key) in layoutList"
        :key="key"
        :label="item.label"
      >
        <div v-if="item.type === 'select'">
          <el-select v-model="item.value" placeholder="" clearable>
            <el-option
              v-for="option in item.options"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            >
            </el-option>
          </el-select>
        </div>

        <div v-else-if="item.type === 'checkbox'">
          <el-checkbox v-model="item.value"></el-checkbox>
        </div>

        <div v-if="item.type === 'number'">
          <el-input
            v-model.number="item.value"
            type="number"
            :step="item.step || 0.1"
          />
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapState } from "vuex";
import {
  styleData,
  vhToPx,
  pxToVw,
  vwToPx,
  pxToVh,
  getCanvasStyle,
} from "../utils/style";
import { getElementCenter, getElementRect } from "../utils/domUtils";
import BigNumber from "bignumber.js";
import eventBus from "../utils/eventBus";
import toast, { toastClose } from "../utils/toast";
const JSONfn = require("jsonfn").JSONfn;

export default {
  data() {
    return {
      excludes: ["Group"], // 这些组件不显示内容
      selectKey: ["textAlign", "borderStyle", "verticalAlign"],
      styleData,
      eventBus,
      componentListCopy: [],
      layoutList: {
        align: {
          type: "select",
          label: "组件对齐",
          value: "",
          options: [
            {
              label: "顶对齐",
              value: "top",
            },
            {
              label: "底对齐",
              value: "bottom",
            },
            {
              label: "左对齐",
              value: "left",
            },
            {
              label: "右对齐",
              value: "right",
            },
            {
              label: "水平居中",
              value: "horizontal-center",
            },
            {
              label: "垂直居中",
              value: "vertical-center",
            },
            {
              label: "宽相等",
              value: "equal-width",
            },
            {
              label: "高相等",
              value: "equal-height",
            },
            {
              label: "组件中点间距均匀",
              value: "center-space-evenly",
            },
            {
              label: "间距均匀",
              value: "space-evenly",
            },
            {
              label: "去除间距",
              value: "no-space",
            },
          ],
        },
        arrangement: {
          type: "select",
          label: "对齐到画布",
          value: "",
          options: [
            {
              label: "水平居中",
              value: "horizontal-center",
            },
            {
              label: "垂直居中",
              value: "vertical-center",
            },
            {
              label: "间距均匀",
              value: "space-evenly",
            },
            {
              label: "两端对齐",
              value: "space-between",
            },
            {
              label: "起始边缘",
              value: "start",
            },
            {
              label: "末端边缘",
              value: "end",
            },
            {
              label: "填充",
              value: "fill",
            },
            {
              label: "顶对齐",
              value: "top",
            },
            {
              label: "底对齐",
              value: "bottom",
            },
            {
              label: "左对齐",
              value: "left",
            },
            {
              label: "右对齐",
              value: "right",
            },
          ],
        },
        unitConversion: {
          type: "select",
          label: "单位转换",
          value: "",
          options: [
            {
              label: "转为px",
              value: "to-px",
            },
            {
              label: "转为%",
              value: "to-%",
            },
            {
              label: "转为mm",
              value: "to-mm",
            },
            {
              label: "自定义转换",
              value: "custom-conversion",
            },
          ],
        },
        left: {
          type: "number",
          label: "x微调",
          value: 0,
          step: 0.1,
        },
        top: {
          type: "number",
          label: "y微调",
          value: 0,
          step: 0.1,
        },
        adjustmentDirection: {
          type: "select",
          label: "调整方向",
          value: "",
          options: [
            {
              label: "正方向",
              value: "positive",
            },
            {
              label: "负方向",
              value: "negative",
            },
            {
              label: "对称",
              value: "symmetry",
            },
          ],
        },
        width: {
          type: "number",
          label: "宽微调",
          value: 0,
          step: 0.1,
        },
        height: {
          type: "number",
          label: "高微调",
          value: 0,
          step: 0.1,
        },
      },
    };
  },
  computed: {
    attrModel: {
      get() {
        return (key, bind) => {};
      },
      set(value) {},
    },
    componentList() {
      // 保持激活组件选中时顺序
      const activeComponentList = [];
      this.activeComponentList.forEach((id) => {
        for (let i = 0; i < this.canvasComponentData.length; i++) {
          const item = this.canvasComponentData[i];
          if (id === item.id) {
            activeComponentList.push(item);
            return;
          }
        }
      });
      if (
        this.componentListCopy.length !== activeComponentList.length ||
        !this.componentListCopy.every((item) =>
          this.activeComponentList.includes(item.id)
        )
      ) {
        this.componentListCopy = JSON.parse(
          JSON.stringify(activeComponentList)
        );
      }
      return activeComponentList;
    },
    align: {
      get() {
        return this.layoutList.align.value;
      },
    },
    arrangement: {
      get() {
        return this.layoutList.arrangement.value;
      },
    },
    unitConversion: {
      get() {
        return this.layoutList.unitConversion.value;
      },
    },
    left: {
      get() {
        return this.layoutList.left.value;
      },
    },
    top: {
      get() {
        return this.layoutList.top.value;
      },
    },
    width: {
      get() {
        return this.layoutList.width.value;
      },
    },
    height: {
      get() {
        return this.layoutList.height.value;
      },
    },
    adjustmentDirection() {
      return this.layoutList.adjustmentDirection.value;
    },
    ...mapState([
      "canvasComponentData",
      "canvasData",
      "listData",
      "currentPrintIndex",
      "activeComponentList",
    ]),
  },
  watch: {
    align: {
      handler: function (val, old) {
        const activeComponentList = this.componentList;
        if (val === "top") {
          const rect = getElementRect(
            document.getElementById("component" + activeComponentList[0].id)
          );
          const offset = rect.top;
          const canvasHeight = parseFloat(
            getCanvasStyle(this.canvasData).height
          );
          const offsetByPercentage = (offset / canvasHeight) * 100;
          activeComponentList.forEach((item) => {
            if (item.styleUnit.top === "%") {
              item.style.top = offsetByPercentage;
            } else {
              item.style.top = offset;
            }
          });
        } else if (val === "bottom") {
          const rect = getElementRect(
            document.getElementById("component" + activeComponentList[0].id)
          );
          const offset = rect.top + rect.height;
          const canvasHeight = parseFloat(
            getCanvasStyle(this.canvasData).height
          );
          const offsetByPercentage = (offset / canvasHeight) * 100;
          activeComponentList.forEach((item) => {
            if (item.styleUnit.top === "%") {
              item.style.top = offsetByPercentage - item.style.height;
            } else {
              item.style.top = offset - item.style.height;
            }
          });
        } else if (val === "left") {
          const rect = getElementRect(
            document.getElementById("component" + activeComponentList[0].id)
          );
          const offset = rect.left;
          const canvasWidth = parseFloat(getCanvasStyle(this.canvasData).width);
          const offsetByPercentage = (offset / canvasWidth) * 100;
          activeComponentList.forEach((item) => {
            if (item.styleUnit.top === "%") {
              item.style.left = offsetByPercentage;
            } else if (item.styleUnit.top === "px") {
              item.style.left = offset;
            } else {
              throw Error("单位不支持");
            }
          });
        } else if (val === "right") {
          const rect = getElementRect(
            document.getElementById("component" + activeComponentList[0].id)
          );
          const offset = rect.left + rect.width;
          const canvasWidth = parseFloat(getCanvasStyle(this.canvasData).width);
          const offsetByPercentage = (offset / canvasWidth) * 100;
          activeComponentList.forEach((item) => {
            if (item.styleUnit.left === "%") {
              item.style.left = offsetByPercentage - item.style.width;
            } else if (item.styleUnit.left === "px") {
              item.style.left = offset - item.style.width;
            }
          });
        } else if (val === "horizontal-center") {
          const center = getElementCenter(
            document.getElementById("component" + activeComponentList[0].id)
          );

          const canvasHeight = parseFloat(
            getCanvasStyle(this.canvasData).height
          );

          for (let i = 1; i < activeComponentList.length; i++) {
            const item = activeComponentList[i];
            const curCenter = getElementCenter(
              document.getElementById("component" + item.id)
            );
            const value = center.y - curCenter.y;
            if (item.styleUnit.top === "%") {
              const offsetByPercentage = (value / canvasHeight) * 100;
              item.style.top += offsetByPercentage;
            } else if (item.styleUnit.top === "px") {
              item.style.top += value;
            }
          }
        } else if (val === "vertical-center") {
          const center = getElementCenter(
            document.getElementById("component" + activeComponentList[0].id)
          );

          const canvasWidth = parseFloat(getCanvasStyle(this.canvasData).width);

          for (let i = 1; i < activeComponentList.length; i++) {
            const item = activeComponentList[i];
            const curCenter = getElementCenter(
              document.getElementById("component" + item.id)
            );
            const value = center.x - curCenter.x;
            if (item.styleUnit.left === "%") {
              const offsetByPercentage = (value / canvasWidth) * 100;
              item.style.left += offsetByPercentage;
            } else if (item.styleUnit.left === "px") {
              item.style.left += value;
            }
          }
        } else if (val === "center-space-evenly") {
          if (activeComponentList.length < 3) return;

          let list = [];
          activeComponentList.forEach((item) => {
            const rect = getElementRect(
              document.getElementById("component" + item.id)
            );
            rect.id = item.id;
            list.push(rect);
          });

          const xList = list
            .map((item) => item.cx)
            .sort((a, b) => {
              return a - b;
            });
          const maxX = xList[xList.length - 1] - xList[0];

          const yList = list
            .map((item) => item.cy)
            .sort((a, b) => {
              return a - b;
            });
          const maxY = yList[yList.length - 1] - yList[0];

          // 判断是竖排还是横排
          if (maxX > maxY) {
            const canvasWidth = parseFloat(
              getCanvasStyle(this.canvasData).width
            );

            list.sort((a, b) => {
              return a.left - b.left;
            });
            const start = list[0];
            const space = new BigNumber(maxX)
              .dividedBy(activeComponentList.length - 1)
              .toNumber();
            for (let i = 1; i < list.length - 1; i++) {
              const item = list[i];
              const find = activeComponentList.find((a) => a.id === item.id);
              const newCenterX = start.cx + space * i;
              const offset = newCenterX - item.width / 2;
              if (find.styleUnit.left === "%") {
                const offsetByPercentage = (offset / canvasWidth) * 100;
                find.style.left = offsetByPercentage;
              } else if (find.styleUnit.left === "px") {
                find.style.left = offset;
              }
            }
          } else {
            const canvasHeight = parseFloat(
              getCanvasStyle(this.canvasData).height
            );
            list.sort((a, b) => {
              return a.top - b.top;
            });
            const start = list[0];
            const space = new BigNumber(maxY)
              .dividedBy(activeComponentList.length - 1)
              .toNumber();
            for (let i = 1; i < list.length - 1; i++) {
              const item = list[i];
              const find = activeComponentList.find((a) => a.id === item.id);
              const newCenterY = start.cy + space * i;
              const offset = newCenterY - item.height / 2;

              if (find.styleUnit.top === "%") {
                const offsetByPercentage = (offset / canvasHeight) * 100;
                find.style.top = offsetByPercentage;
              } else if (find.styleUnit.left === "px") {
                find.style.top = offset;
              }
            }
          }
        } else if (val === "space-evenly") {
          if (activeComponentList.length < 3) return;
          let list = [];
          activeComponentList.forEach((item) => {
            const rect = getElementRect(
              document.getElementById("component" + item.id)
            );
            rect.id = item.id;
            list.push(rect);
          });

          const xList = list
            .map((item) => item.cx)
            .sort((a, b) => {
              return a - b;
            });
          const maxX = xList[xList.length - 1] - xList[0];

          const yList = list
            .map((item) => item.cy)
            .sort((a, b) => {
              return a - b;
            });
          const maxY = yList[yList.length - 1] - yList[0];

          // 判断是竖排还是横排
          if (maxX > maxY) {
            const canvasWidth = parseFloat(
              getCanvasStyle(this.canvasData).width
            );

            list.sort((a, b) => {
              return a.left - b.left;
            });

            const first = list[0];
            const last = list[list.length - 1];
            let totalSpace = last.left - (first.left + first.width);
            for (let i = 1; i < list.length - 1; i++) {
              const item = list[i];
              totalSpace = new BigNumber(totalSpace)
                .minus(item.width)
                .toNumber();
            }
            const space = new BigNumber(totalSpace)
              .dividedBy(activeComponentList.length - 1)
              .toNumber();
            let totalWidth = first.left;
            for (let i = 1; i < list.length - 1; i++) {
              const item = list[i];
              totalWidth += list[i - 1].width;
              const find = activeComponentList.find((a) => a.id === item.id);
              const newLeft = totalWidth + space * i;
              if (find.styleUnit.left === "%") {
                const leftByPercentage = (newLeft / canvasWidth) * 100;
                find.style.left = leftByPercentage;
              } else if (find.styleUnit.left === "px") {
                find.style.left = newLeft;
              }
            }
          } else {
            const canvasHeight = parseFloat(
              getCanvasStyle(this.canvasData).height
            );

            list.sort((a, b) => {
              return a.top - b.top;
            });
            const first = list[0];
            const last = list[list.length - 1];
            let totalSpace = last.top - (first.top + first.height);

            for (let i = 1; i < list.length - 1; i++) {
              const item = list[i];
              totalSpace = new BigNumber(totalSpace)
                .minus(item.height)
                .toNumber();
            }
            const space = new BigNumber(totalSpace)
              .dividedBy(activeComponentList.length - 1)
              .toNumber();
            let totalHeight = first.top;
            for (let i = 1; i < list.length - 1; i++) {
              const item = list[i];
              totalHeight += list[i - 1].height;
              const find = activeComponentList.find((a) => a.id === item.id);

              const newTop = totalHeight + space * i;
              if (find.styleUnit.top === "%") {
                const topByPercentage = (newTop / canvasHeight) * 100;
                find.style.top = topByPercentage;
              } else if (find.styleUnit.top === "px") {
                find.style.top = newTop;
              }
            }
          }
        } else if (val === "no-space") {
          if (activeComponentList.length < 2) return;
          let list = [];
          activeComponentList.forEach((item) => {
            const rect = getElementRect(
              document.getElementById("component" + item.id)
            );
            rect.id = item.id;
            list.push(rect);
          });

          const xList = list
            .map((item) => item.cx)
            .sort((a, b) => {
              return a - b;
            });
          const maxX = xList[xList.length - 1] - xList[0];

          const yList = list
            .map((item) => item.cy)
            .sort((a, b) => {
              return a - b;
            });
          const maxY = yList[yList.length - 1] - yList[0];

          if (maxX > maxY) {
            const canvasWidth = parseFloat(
              getCanvasStyle(this.canvasData).width
            );

            list.sort((a, b) => {
              return a.left - b.left;
            });

            let left = list[0].left + list[0].width;
            for (let i = 1; i < list.length; i++) {
              const item = list[i];
              const find = activeComponentList.find((a) => a.id === item.id);
              if (find.styleUnit.left === "%") {
                const leftByPercentage = (left / canvasWidth) * 100;
                find.style.left = leftByPercentage;
              } else if (find.styleUnit.left === "px") {
                find.style.left = left;
              }
              left += item.width;
            }
          } else {
            const canvasHeight = parseFloat(
              getCanvasStyle(this.canvasData).height
            );

            list.sort((a, b) => {
              return a.top - b.top;
            });

            let top = list[0].top + list[0].height;
            for (let i = 1; i < list.length; i++) {
              const item = list[i];
              const find = activeComponentList.find((a) => a.id === item.id);

              if (find.styleUnit.top === "%") {
                const topByPercentage = (top / canvasHeight) * 100;
                find.style.top = topByPercentage;
              } else if (find.styleUnit.top === "px") {
                find.style.top = top;
              }
              top += item.height;
            }
          }
        } else if (val === "equal-width") {
          const value = getElementRect(
            document.getElementById("component" + activeComponentList[0].id)
          ).width;
          const canvasWidth = parseFloat(getCanvasStyle(this.canvasData).width);
          const valueByPercentage = (value / canvasWidth) * 100;

          activeComponentList.forEach((item) => {
            if (item.styleUnit.width === "%") {
              item.style.width = valueByPercentage;
            } else if (item.styleUnit.width === "px") {
              item.style.width = value;
            }
          });
        } else if (val === "equal-height") {
          const value = getElementRect(
            document.getElementById("component" + activeComponentList[0].id)
          ).height;
          const canvasHeight = parseFloat(
            getCanvasStyle(this.canvasData).height
          );
          const valueByPercentage = (value / canvasHeight) * 100;
          activeComponentList.forEach((item) => {
            if (item.styleUnit.height === "%") {
              item.style.height = valueByPercentage;
            } else if (item.styleUnit.height === "px") {
              item.style.height = value;
            }
          });
        }

        this.componentListCopy = JSON.parse(JSON.stringify(this.componentList));
      },
      deep: false,
      immediate: false,
    },
    unitConversion(val) {
      const activeComponentList = this.componentList;

      const editorRect = document
        .getElementById("editor")
        .getBoundingClientRect();

      const scale = this.canvasData.scale / 100;

      if (val === "to-px") {
        activeComponentList.forEach((item) => {
          const element = document.getElementById("component" + item.id);
          const rect = getElementRect(element);

          item.style.left = rect.left;
          item.style.top = rect.top;
          item.style.width = rect.width;
          item.style.height = rect.height;

          item.styleUnit.left = "px";
          item.styleUnit.top = "px";
          item.styleUnit.width = "px";
          item.styleUnit.height = "px";
        });
      } else if (val === "to-%") {
        activeComponentList.forEach((item) => {
          const element = document.getElementById("component" + item.id);
          const rect = getElementRect(element);

          item.style.left = new BigNumber(rect.left)
            .dividedBy(editorRect.width)
            .multipliedBy(100)
            .toNumber();

          item.style.top = new BigNumber(rect.top)
            .dividedBy(editorRect.height)
            .multipliedBy(100)
            .toNumber();

          item.style.width = new BigNumber(rect.width)
            .dividedBy(editorRect.width)
            .multipliedBy(100)
            .toNumber();

          item.style.height = new BigNumber(rect.height)
            .dividedBy(editorRect.height)
            .multipliedBy(100)
            .toNumber();

          item.styleUnit.left = "%";
          item.styleUnit.top = "%";
          item.styleUnit.width = "%";
          item.styleUnit.height = "%";
        });
      } else if (val === "to-vw") {
        activeComponentList.forEach((item) => {
          const element = document.getElementById("component" + item.id);
          const rect = getElementRect(element);

          item.style.left = new BigNumber(rect.left)
            .dividedBy(editorRect.width)
            .multipliedBy(100)
            .multipliedBy(scale)
            .toNumber();

          item.style.top = new BigNumber(rect.top)
            .dividedBy(editorRect.width)
            .multipliedBy(100)
            .multipliedBy(scale)
            .toNumber();

          item.style.width = new BigNumber(rect.width)
            .dividedBy(editorRect.width)
            .multipliedBy(100)
            .multipliedBy(scale)
            .toNumber();

          item.style.height = new BigNumber(rect.height)
            .dividedBy(editorRect.width)
            .multipliedBy(100)
            .multipliedBy(scale)
            .toNumber();

          item.styleUnit.left = "vw";
          item.styleUnit.top = "vw";
          item.styleUnit.width = "vw";
          item.styleUnit.height = "vw";
        });
      } else if (val === "to-vh") {
        activeComponentList.forEach((item) => {
          const element = document.getElementById("component" + item.id);
          const rect = getElementRect(element);

          item.style.left = new BigNumber(rect.left)
            .dividedBy(editorRect.height)
            .multipliedBy(100)
            .multipliedBy(scale)
            .toNumber();

          item.style.top = new BigNumber(rect.top)
            .dividedBy(editorRect.height)
            .multipliedBy(100)
            .multipliedBy(scale)
            .toNumber();

          item.style.width = new BigNumber(rect.width)
            .dividedBy(editorRect.height)
            .multipliedBy(100)
            .multipliedBy(scale)
            .toNumber();

          item.style.height = new BigNumber(rect.height)
            .dividedBy(editorRect.height)
            .multipliedBy(100)
            .multipliedBy(scale)
            .toNumber();

          item.styleUnit.left = "vh";
          item.styleUnit.top = "vh";
          item.styleUnit.width = "vh";
          item.styleUnit.height = "vh";
        });
      } else if (val === "to-vw-vh") {
        activeComponentList.forEach((item) => {
          const element = document.getElementById("component" + item.id);
          const rect = getElementRect(element);

          item.style.left = new BigNumber(rect.left)
            .dividedBy(editorRect.width)
            .multipliedBy(100)
            .multipliedBy(scale)
            .toNumber();
          item.style.width = new BigNumber(rect.width)
            .dividedBy(editorRect.width)
            .multipliedBy(100)
            .multipliedBy(scale)
            .toNumber();

          item.style.top = new BigNumber(rect.top)
            .dividedBy(editorRect.height)
            .multipliedBy(100)
            .multipliedBy(scale)
            .toNumber();
          item.style.height = new BigNumber(rect.height)
            .dividedBy(editorRect.height)
            .multipliedBy(100)
            .multipliedBy(scale)
            .toNumber();

          item.styleUnit.left = "vw";
          item.styleUnit.width = "vw";
          item.styleUnit.top = "vh";
          item.styleUnit.height = "vh";
        });
      }
    },
    left: {
      handler: function (val) {
        this.componentList.forEach((item) => {
          const findItem = this.componentListCopy.find(
            (copy) => copy.id === item.id
          );
          item.style.left = findItem.style.left + val;
        });
      },
    },
    top: {
      handler: function (val) {
        this.componentList.forEach((item) => {
          const findItem = this.componentListCopy.find(
            (copy) => copy.id === item.id
          );
          item.style.top = findItem.style.top + val;
        });
      },
    },
    width: {
      handler: function (val) {
        this.componentList.forEach((item) => {
          const findItem = this.componentListCopy.find(
            (copy) => copy.id === item.id
          );

          if (this.adjustmentDirection === "symmetry") {
            item.style.width = findItem.style.width + val;
            const offset = new BigNumber(val).dividedBy(2).toNumber();
            item.style.left = findItem.style.left - offset;
          } else if (this.adjustmentDirection === "negative") {
            item.style.width = findItem.style.width + val;
            item.style.left = findItem.style.left - val;
          } else {
            item.style.width = findItem.style.width + val;
          }
        });
      },
    },
    height: {
      handler: function (val) {
        this.componentList.forEach((item) => {
          const findItem = this.componentListCopy.find(
            (copy) => copy.id === item.id
          );
          if (this.adjustmentDirection === "symmetry") {
            item.style.height = findItem.style.height + val;
            const offset = new BigNumber(val).dividedBy(2).toNumber();
            item.style.top = findItem.style.top - offset;
          } else if (this.adjustmentDirection === "negative") {
            item.style.height = findItem.style.height + val;
            item.style.top = findItem.style.top - val;
          } else {
            item.style.height = findItem.style.height + val;
          }
        });
      },
    },
    adjustmentDirection() {
      this.componentListCopy = JSON.parse(JSON.stringify(this.componentList));
      this.layoutList.width.value = 0;
      this.layoutList.height.value = 0;
    },
    arrangement(val) {
      // 填充画布
      const activeComponentList = this.componentList;
      if (val === "space-evenly") {
        if (activeComponentList.length < 2) return;
        let list = [];
        activeComponentList.forEach((item) => {
          const element = document.getElementById("component" + item.id);
          const rect = getElementRect(element);
          rect.id = item.id;
          list.push(rect);
        });

        if (
          this.getComponentOrientation(activeComponentList) === "horizontal"
        ) {
          const canvasWidth = parseFloat(getCanvasStyle(this.canvasData).width);

          list.sort((a, b) => {
            return a.left - b.left;
          });

          let space = canvasWidth;
          list.forEach((item) => {
            space = space - item.width;
          });

          space = space / (activeComponentList.length + 1);

          let offset = 0;
          for (let i = 0; i < list.length; i++) {
            const item = list[i];
            const find = activeComponentList.find((a) => a.id === item.id);

            if (find.styleUnit.left === "%") {
              const spaceByPercentage = ((space + offset) / canvasWidth) * 100;
              find.style.left = spaceByPercentage;
              offset += space + item.width;
            } else {
              find.style.left = space + offset;
              offset += space + item.width;
            }
          }
        } else {
          const canvasHeight = parseFloat(
            getCanvasStyle(this.canvasData).height
          );
          list.sort((a, b) => {
            return a.top - b.top;
          });
          let space = canvasHeight;
          list.forEach((item) => {
            space = space - item.height;
          });
          space = space / (activeComponentList.length + 1);
          let offset = 0;
          for (let i = 0; i < list.length; i++) {
            const item = list[i];
            const find = activeComponentList.find((a) => a.id === item.id);

            if (find.styleUnit.top === "%") {
              const spaceByPercentage = ((space + offset) / canvasHeight) * 100;
              find.style.top = spaceByPercentage;
              offset += space + item.height;
            } else {
              find.style.top = space + offset;
              offset += space + item.height;
            }
          }
        }
      } else if (val === "space-between") {
        if (activeComponentList.length < 2) return;
        let list = [];
        activeComponentList.forEach((item) => {
          const element = document.getElementById("component" + item.id);
          const rect = getElementRect(element);
          rect.id = item.id;
          list.push(rect);
        });

        const xList = list
          .map((item) => item.cx)
          .sort((a, b) => {
            return a - b;
          });
        const maxX = xList[xList.length - 1] - xList[0];

        const yList = list
          .map((item) => item.cy)
          .sort((a, b) => {
            return a - b;
          });
        const maxY = yList[yList.length - 1] - yList[0];

        if (Math.abs(maxX) > Math.abs(maxY)) {
          list.sort((a, b) => {
            return a.left - b.left;
          });

          const canvasWidth = parseFloat(getCanvasStyle(this.canvasData).width);
          let space = canvasWidth;
          list.forEach((item) => {
            space = space - item.width;
          });

          space = space / (activeComponentList.length - 1);

          let offset = 0;
          for (let i = 0; i < list.length; i++) {
            const item = list[i];
            const find = activeComponentList.find((a) => a.id === item.id);

            if (find.styleUnit.left === "%") {
              find.style.left = (offset / canvasWidth) * 100;
              offset += space + item.width;
            } else {
              find.style.left = offset;
              offset += space + item.width;
            }
          }
        } else {
          list.sort((a, b) => {
            return a.top - b.top;
          });
          const canvasHeight = parseFloat(
            getCanvasStyle(this.canvasData).height
          );

          let space = canvasHeight;
          list.forEach((item) => {
            space = space - item.height;
          });
          space = space / (activeComponentList.length - 1);
          let offset = 0;
          for (let i = 0; i < list.length; i++) {
            const item = list[i];
            const find = activeComponentList.find((a) => a.id === item.id);
            if (find.styleUnit.top === "%") {
              find.style.top = (offset / canvasHeight) * 100;
              offset += space + item.height;
            } else {
              find.style.top = offset;
              offset += space + item.height;
            }
          }
        }
      } else if (val === "start") {
        if (activeComponentList.length < 2) return;

        let list = [];
        activeComponentList.forEach((item) => {
          const element = document.getElementById("component" + item.id);
          const rect = getElementRect(element);
          rect.id = item.id;
          list.push(rect);
        });

        const xList = list
          .map((item) => item.cx)
          .sort((a, b) => {
            return a - b;
          });
        const maxX = xList[xList.length - 1] - xList[0];

        const yList = list
          .map((item) => item.cy)
          .sort((a, b) => {
            return a - b;
          });
        const maxY = yList[yList.length - 1] - yList[0];

        if (Math.abs(maxX) > Math.abs(maxY)) {
          list.sort((a, b) => {
            return a.left - b.left;
          });

          const canvasWidth = parseFloat(getCanvasStyle(this.canvasData).width);
          let offset = 0;
          for (let i = 0; i < list.length; i++) {
            const item = list[i];
            const find = activeComponentList.find((a) => a.id === item.id);
            if (find.styleUnit.left === "%") {
              find.style.left = (offset / canvasWidth) * 100;
            } else if (find.styleUnit.left === "px") {
              find.style.left = offset;
            }
            offset += item.width;
          }
        } else {
          list.sort((a, b) => {
            return a.top - b.top;
          });
          const canvasHeight = parseFloat(
            getCanvasStyle(this.canvasData).height
          );
          let offset = 0;
          for (let i = 0; i < list.length; i++) {
            const item = list[i];
            const find = activeComponentList.find((a) => a.id === item.id);
            if (find.styleUnit.top === "%") {
              find.style.top = (offset / canvasHeight) * 100;
            } else if (find.styleUnit.top === "px") {
              find.style.top = offset;
            }
            offset += item.height;
          }
        }
      } else if (val === "end") {
        if (activeComponentList.length < 2) return;

        let list = [];
        activeComponentList.forEach((item) => {
          const element = document.getElementById("component" + item.id);
          const rect = getElementRect(element);
          rect.id = item.id;
          list.push(rect);
        });

        if (
          this.getComponentOrientation(activeComponentList) === "horizontal"
        ) {
          list.sort((a, b) => {
            return b.left - a.left;
          });
          const canvasWidth = parseFloat(getCanvasStyle(this.canvasData).width);
          let offset = canvasWidth;
          for (let i = 0; i < list.length; i++) {
            const item = list[i];
            const find = activeComponentList.find((a) => a.id === item.id);

            if (find.styleUnit.left === "%") {
              find.style.left = ((offset - item.width) / canvasWidth) * 100;
            } else if (find.styleUnit.left === "px") {
              find.style.left = offset - find.style.width;
            }
            offset = offset - item.width;
          }
        } else {
          list.sort((a, b) => {
            return b.top - a.top;
          });
          const canvasHeight = parseFloat(
            getCanvasStyle(this.canvasData).height
          );
          let offset = canvasHeight;
          for (let i = 0; i < list.length; i++) {
            const item = list[i];
            const find = activeComponentList.find((a) => a.id === item.id);

            if (find.styleUnit.left === "%") {
              find.style.top = ((offset - item.height) / canvasHeight) * 100;
            } else if (find.styleUnit.left === "px") {
              find.style.top = offset - find.style.height;
            }
            offset = offset - item.height;
          }
        }
      } else if (val === "fill") {
        if (activeComponentList.length === 1) {
          const component = activeComponentList[0];
          if (component.style.width > component.style.height) {
            component.style.left = 0;
            if (component.styleUnit.width === "%") {
              component.style.width = 100;
            } else if (component.styleUnit.width === "px") {
              const canvasWidth = parseFloat(
                getCanvasStyle(this.canvasData).width
              );
              component.style.width = canvasWidth;
            }
          } else {
            component.style.top = 0;
            if (component.styleUnit.height === "%") {
              component.style.height = 100;
            } else if (component.styleUnit.height === "px") {
              const canvasHeight = parseFloat(
                getCanvasStyle(this.canvasData).height
              );
              component.style.height = canvasHeight;
            }
          }
          return;
        }

        let list = [];
        activeComponentList.forEach((item) => {
          const element = document.getElementById("component" + item.id);
          const rect = getElementRect(element);
          rect.id = item.id;
          list.push(rect);
        });

        if (
          this.getComponentOrientation(activeComponentList) === "horizontal"
        ) {
          list.sort((a, b) => {
            return a.left - b.left;
          });

          const canvasWidth = parseFloat(getCanvasStyle(this.canvasData).width);

          let totalWidth = 0;
          list.forEach((item) => {
            totalWidth += item.width;
          });

          let offset = 0;
          list.forEach((item) => {
            const rate = new BigNumber(item.width)
              .dividedBy(totalWidth)
              .toNumber();
            const find = activeComponentList.find((a) => a.id === item.id);
            const newWidth = new BigNumber(canvasWidth)
              .multipliedBy(rate)
              .toNumber();
            if (find.styleUnit.left === "%" && find.styleUnit.width === "%") {
              find.style.width = new BigNumber(newWidth)
                .dividedBy(canvasWidth)
                .multipliedBy(100)
                .toNumber();
              find.style.left = (offset / canvasWidth) * 100;
            } else if (
              find.styleUnit.left === "px" &&
              find.styleUnit.width === "px"
            ) {
              find.style.width = newWidth;
              find.style.left = offset;
            } else {
              throw new Error("单位不支持");
            }
            offset += newWidth;
          });
        } else {
          list.sort((a, b) => {
            return a.top - b.top;
          });

          const canvasHeight = parseFloat(
            getCanvasStyle(this.canvasData).height
          );

          let totalHeight = 0;
          list.forEach((item) => {
            totalHeight += item.height;
          });

          let offset = 0;
          list.forEach((item) => {
            const rate = new BigNumber(item.height)
              .dividedBy(totalHeight)
              .toNumber();
            const find = activeComponentList.find((a) => a.id === item.id);
            const newHeight = new BigNumber(canvasHeight)
              .multipliedBy(rate)
              .toNumber();

            if (find.styleUnit.top === "%" && find.styleUnit.height === "%") {
              find.style.height = new BigNumber(newHeight)
                .dividedBy(canvasHeight)
                .multipliedBy(100)
                .toNumber();
              find.style.top = (offset / canvasHeight) * 100;
            } else if (
              find.styleUnit.top === "px" &&
              find.styleUnit.height === "px"
            ) {
              find.style.height = newHeight;
              find.style.top = offset;
            } else {
              throw new Error("单位不支持");
            }

            offset += newHeight;
          });
        }
      } else if (val === "top") {
        activeComponentList.forEach((item) => {
          item.style.top = 0;
        });
      } else if (val === "bottom") {
        const canvasHeight = parseFloat(getCanvasStyle(this.canvasData).height);
        activeComponentList.forEach((item) => {
          const element = document.getElementById("component" + item.id);
          const rect = getElementRect(element);
          const newTop = canvasHeight - rect.height;
          if (item.styleUnit.top === "%") {
            item.style.top = (newTop / canvasHeight) * 100;
          } else if (item.styleUnit.top === "px") {
            item.style.top = newTop;
          }
        });
      } else if (val === "left") {
        activeComponentList.forEach((item) => {
          item.style.left = 0;
        });
      } else if (val === "right") {
        const canvasWidth =
          this.canvasData.width * (this.canvasData.scale / 100);
        activeComponentList.forEach((item) => {
          item.style.left = canvasWidth - item.style.width;
        });
      } else if (val === "horizontal-center") {
        let list = [];
        activeComponentList.forEach((item) => {
          const element = document.getElementById("component" + item.id);
          const rect = getElementRect(element);
          rect.id = item.id;
          list.push(rect);
        });

        list.sort((a, b) => {
          return a.left - b.left;
        });

        let right = list[0].left + list[0].width;

        list.forEach((item) => {
          const lastRight = item.left + item.width;
          if (lastRight > right) {
            right = lastRight;
          }
        });

        const canvasWidth = parseFloat(getCanvasStyle(this.canvasData).width);
        const width = new BigNumber(right).minus(list[0].left).toNumber();
        const centerX = new BigNumber(list[0].left)
          .plus(new BigNumber(width).dividedBy(2).toNumber())
          .toNumber();

        let offset = new BigNumber(canvasWidth)
          .dividedBy(2)
          .minus(centerX)
          .toNumber();
        const offsetByPercentage = (offset / canvasWidth) * 100;
        activeComponentList.forEach((item) => {
          if (item.styleUnit.left === "%") {
            item.style.left = item.style.left + offsetByPercentage;
          } else {
            item.style.left = item.style.left + offset;
          }
        });
      } else if (val === "vertical-center") {
        let list = [];
        activeComponentList.forEach((item) => {
          const element = document.getElementById("component" + item.id);
          const rect = getElementRect(element);
          rect.id = item.id;
          list.push(rect);
        });

        list.sort((a, b) => {
          return a.top - b.top;
        });

        let bottom = list[0].top + list[0].height;
        list.forEach((item) => {
          const lastBottom = item.top + item.height;
          if (lastBottom > bottom) {
            bottom = lastBottom;
          }
        });

        const canvasHeight = parseFloat(getCanvasStyle(this.canvasData).height);

        const height = new BigNumber(bottom).minus(list[0].top).toNumber();
        const centerY = new BigNumber(list[0].top)
          .plus(new BigNumber(height).dividedBy(2).toNumber())
          .toNumber();

        const offset = new BigNumber(canvasHeight)
          .dividedBy(2)
          .minus(centerY)
          .toNumber();

        const offsetByPercentage = (offset / canvasHeight) * 100;
        activeComponentList.forEach((item) => {
          if (item.styleUnit.top === "%") {
            item.style.top = item.style.top + offsetByPercentage;
          } else {
            item.style.top = item.style.top + offset;
          }
        });
      }

      this.componentListCopy = JSON.parse(JSON.stringify(this.componentList));
      this.layoutList.width.value = 0;
      this.layoutList.height.value = 0;
    },
  },
  methods: {
    showAttr(curComponent, key) {
      if (curComponent == null) return false;
      if (curComponent.attrExcludes == null) return true;
      return !curComponent.attrExcludes.includes(key);
    },
    getComponentOrientation(componentList) {
      let list = [];
      componentList.forEach((item) => {
        const element = document.getElementById("component" + item.id);
        const rect = getElementRect(element);
        list.push(rect);
      });

      const xList = list
        .map((item) => item.cx)
        .sort((a, b) => {
          return a - b;
        });
      const maxX = xList[xList.length - 1] - xList[0];

      const yList = list
        .map((item) => item.cy)
        .sort((a, b) => {
          return a - b;
        });
      const maxY = yList[yList.length - 1] - yList[0];

      return Math.abs(maxX) > Math.abs(maxY) ? "horizontal" : "vertical";
    },
    getComponentRect(component) {
      let cx = new BigNumber(component.style.left)
        .plus(new BigNumber(component.style.width).dividedBy(2))
        .toNumber();

      let cy = new BigNumber(component.style.top)
        .plus(new BigNumber(component.style.height).dividedBy(2))
        .toNumber();

      let width = component.style.width;
      let height = component.style.height;
      let top = component.style.top;
      let left = component.style.left;

      return {
        cx: cx,
        cy: cy,
        width: width,
        height: height,
        top: top,
        left: left,
      };
    },
    getComponentListRect(componentList) {
      const aspectRatio = screen.width / screen.height;

      const list = [];
      componentList.forEach((item) => {
        const element = document.getElementById("component" + item.id);
        const rect = getElementRect(element);
        rect.id = item.id;
        list.push(rect);
      });

      list.sort((a, b) => {
        return a.left - b.left;
      });
      const left = list[0].left;

      list.sort((a, b) => {
        return b.left + b.width - (a.left + b.width);
      });
      const right = list[0].left + list[0].width;

      list.sort((a, b) => {
        return a.top - b.top;
      });
      const top = list[0].top;

      list.sort((a, b) => {
        return b.top + b.height - (a.top + b.height);
      });
      const bottom = list[0].top + list[0].height;

      const width = right - left;
      const height = bottom - top;

      const rect = {
        left: left,
        right: right,
        top: top,
        bottom: bottom,
        width: width,
        height: height,
        cx: left + width / 2,
        cy: top + height / 2,
      };

      return rect;
    },
  },
};
</script>

<style lang="less" scoped>
.attr-list {
  overflow: auto;
  padding: 20px;
  padding-top: 0;
  height: 100%;
}
</style>
