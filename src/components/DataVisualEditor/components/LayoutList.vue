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
import { styleData } from "../utils/style";
import { getElementCenter, getElementRect } from "../utils/domUtils";
import BigNumber from "bignumber.js";
import eventBus from "../utils/eventBus";
import toast, { toastClose } from "../utils/toast";

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
              label: "垂直居中",
              value: "verticalCenter",
            },
            {
              label: "水平居中",
              value: "horizontalCenter",
            },
            {
              label: "宽相等",
              value: "equalWidth",
            },
            {
              label: "高相等",
              value: "equalHeight",
            },
            {
              label: "中心间距相等",
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
        marginTop: {
          type: "number",
          label: "上边距",
          value: 0,
          step: 0.1,
        },
        marginRight: {
          type: "number",
          label: "右边距",
          value: 0,
          step: 0.1,
        },
        marginBottom: {
          type: "number",
          label: "下边距",
          value: 0,
          step: 0.1,
        },
        marginLeft: {
          type: "number",
          label: "左边距",
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
          let value = activeComponentList[0].style.top;
          for (let i = 1; i < activeComponentList.length; i++) {
            const item = activeComponentList[i];
            const nextValue = item.style.top;
            if (nextValue < value) value = nextValue;
          }
          activeComponentList.forEach((item) => {
            item.style.top = value;
          });
        } else if (val === "bottom") {
          let value =
            activeComponentList[0].style.top +
            activeComponentList[0].style.height;
          // for (let i = 1; i < activeComponentList.length; i++) {
          //   const item = activeComponentList[i];
          //   const nextValue = item.style.top + item.style.height;
          //   if (nextValue > value) value = nextValue;
          // }
          activeComponentList.forEach((item) => {
            item.style.top = value - item.style.height;
          });
        } else if (val === "left") {
          let value = activeComponentList[0].style.left;
          // for (let i = 1; i < activeComponentList.length; i++) {
          //   const item = activeComponentList[i];
          //   const nextValue = item.style.left;
          //   if (nextValue < value) value = nextValue;
          // }
          activeComponentList.forEach((item) => {
            item.style.left = value;
          });
        } else if (val === "right") {
          let value =
            activeComponentList[0].style.left +
            activeComponentList[0].style.width;
          // for (let i = 1; i < activeComponentList.length; i++) {
          //   const item = activeComponentList[i];
          //   const nextValue = item.style.left + item.style.width;
          //   if (nextValue > value) value = nextValue;
          // }
          activeComponentList.forEach((item) => {
            item.style.left = value - item.style.width;
          });
        } else if (val === "verticalCenter") {
          const center = getElementCenter(
            document.getElementById("component" + activeComponentList[0].id)
          );

          for (let i = 1; i < activeComponentList.length; i++) {
            const item = activeComponentList[i];
            const curCenter = getElementCenter(
              document.getElementById("component" + item.id)
            );
            const value = center.x - curCenter.x;
            item.style.left = item.style.left + value;
          }
        } else if (val === "horizontalCenter") {
          const center = getElementCenter(
            document.getElementById("component" + activeComponentList[0].id)
          );

          for (let i = 1; i < activeComponentList.length; i++) {
            const item = activeComponentList[i];
            const curCenter = getElementCenter(
              document.getElementById("component" + item.id)
            );
            const value = center.y - curCenter.y;
            item.style.top = item.style.top + value;
          }
        } else if (val === "center-space-evenly") {
          if (activeComponentList.length < 3) return;

          let list = [];

          activeComponentList.forEach((item) => {
            const center = getElementCenter(
              document.getElementById("component" + item.id)
            );

            center.top = item.style.top;
            center.left = item.style.left;
            center.width = item.style.width;
            center.height = item.style.height;
            center.id = item.id;
            list.push(center);
          });

          const xList = list
            .map((item) => item.x)
            .sort((a, b) => {
              return a.x - b.x;
            });
          const maxX = xList[xList.length - 1] - xList[0];

          const yList = list
            .map((item) => item.y)
            .sort((a, b) => {
              return a.y - b.y;
            });
          const maxY = yList[yList.length - 1] - yList[0];

          // 判断是竖排还是横排
          if (maxX > maxY) {
            list.sort((a, b) => {
              return a.left - b.left;
            });
            const start = list[0];
            const space = new BigNumber(maxX)
              .dividedBy(activeComponentList.length - 1)
              .toNumber();
            for (let i = 1; i < list.length - 1; i++) {
              const item = list[i];
              const newCenterX = start.x + space * i;
              const offset = newCenterX - item.x;
              const find = activeComponentList.find((a) => a.id === item.id);
              find.style.left += offset;
            }
          } else {
            list.sort((a, b) => {
              return a.top - b.top;
            });
            const start = list[0];
            const space = new BigNumber(maxY)
              .dividedBy(activeComponentList.length - 1)
              .toNumber();
            for (let i = 1; i < list.length - 1; i++) {
              const item = list[i];
              const newCenterY = start.y + space * i;
              const offset = newCenterY - item.y;
              const find = activeComponentList.find((a) => a.id === item.id);
              find.style.top += offset;
            }
          }
        } else if (val === "space-evenly") {
          if (activeComponentList.length < 3) return;
          let list = [];
          activeComponentList.forEach((item) => {
            const center = getElementCenter(
              document.getElementById("component" + item.id)
            );
            center.top = item.style.top;
            center.left = item.style.left;
            center.width = item.style.width;
            center.height = item.style.height;
            center.id = item.id;
            list.push(center);
          });

          const xList = list
            .map((item) => item.x)
            .sort((a, b) => {
              return a.x - b.x;
            });
          const maxX = xList[xList.length - 1] - xList[0];

          const yList = list
            .map((item) => item.y)
            .sort((a, b) => {
              return a.y - b.y;
            });
          const maxY = yList[yList.length - 1] - yList[0];

          // 判断是竖排还是横排
          if (maxX > maxY) {
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
              find.style.left = totalWidth + space * i;
            }
          } else {
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
              find.style.top = totalHeight + space * i;
            }
          }
        } else if (val === "no-space") {
          if (activeComponentList.length < 2) return;
          let list = [];
          activeComponentList.forEach((item) => {
            const center = getElementCenter(
              document.getElementById("component" + item.id)
            );
            center.top = item.style.top;
            center.left = item.style.left;
            center.width = item.style.width;
            center.height = item.style.height;
            center.id = item.id;
            list.push(center);
          });

          const xList = list
            .map((item) => item.x)
            .sort((a, b) => {
              return a.x - b.x;
            });
          const maxX = xList[xList.length - 1] - xList[0];

          const yList = list
            .map((item) => item.y)
            .sort((a, b) => {
              return a.y - b.y;
            });
          const maxY = yList[yList.length - 1] - yList[0];

          if (maxX > maxY) {
            list.sort((a, b) => {
              return a.left - b.left;
            });

            let left = list[0].left + list[0].width;
            for (let i = 1; i < list.length; i++) {
              const item = list[i];
              const find = activeComponentList.find((a) => a.id === item.id);
              find.style.left = left;
              left += item.width;
            }
          } else {
            list.sort((a, b) => {
              return a.top - b.top;
            });

            let top = list[0].top + list[0].height;
            for (let i = 1; i < list.length; i++) {
              const item = list[i];
              const find = activeComponentList.find((a) => a.id === item.id);
              find.style.top = top;
              top += item.height;
            }
          }
        } else if (val === "equalWidth") {
          let value = activeComponentList[0].style.width;
          // for (let i = 1; i < activeComponentList.length; i++) {
          //   const item = activeComponentList[i];
          //   const nextValue = item.style.width;
          //   if (nextValue > value) value = nextValue;
          // }

          activeComponentList.forEach((item) => {
            item.style.width = value;
          });
        } else if (val === "equalHeight") {
          let value = activeComponentList[0].style.height;
          // for (let i = 1; i < activeComponentList.length; i++) {
          //   const item = activeComponentList[i];
          //   const nextValue = item.style.height;
          //   if (nextValue > value) value = nextValue;
          // }

          activeComponentList.forEach((item) => {
            item.style.height = value;
          });
        }

        this.componentListCopy = JSON.parse(JSON.stringify(this.componentList));
      },
      deep: false,
      immediate: false,
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
        if (this.canvasData.unit !== "px") {
          toast("画布自动布局只支持px单位");
          return;
        }

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
            return a.cx - b.cx;
          });
        const maxX = xList[xList.length - 1] - xList[0];

        const yList = list
          .map((item) => item.cy)
          .sort((a, b) => {
            return a.cy - b.cy;
          });
        const maxY = yList[yList.length - 1] - yList[0];

        if (Math.abs(maxX) > Math.abs(maxY)) {
          list.sort((a, b) => {
            return a.left - b.left;
          });

          const canvasWidth =
            this.canvasData.width * (this.canvasData.scale / 100);
          let space = canvasWidth;
          list.forEach((item) => {
            space = space - item.width;
          });

          space = space / (activeComponentList.length + 1);

          let offset = 0;
          for (let i = 0; i < list.length; i++) {
            const item = list[i];
            const find = activeComponentList.find((a) => a.id === item.id);
            find.style.left = space + offset;
            // find.style.width = item.width;
            find.styleUnit.left = "px";
            // find.styleUnit.width = "px";
            offset += space + item.width;
          }
        } else {
          list.sort((a, b) => {
            return a.top - b.top;
          });
          const canvasHeight =
            this.canvasData.height * (this.canvasData.scale / 100);
          let space = canvasHeight;
          list.forEach((item) => {
            space = space - item.height;
          });

          space = space / (activeComponentList.length + 1);

          let offset = 0;
          for (let i = 0; i < list.length; i++) {
            const item = list[i];
            const find = activeComponentList.find((a) => a.id === item.id);
            find.style.top = space + offset;
            // find.style.height = item.height;
            find.styleUnit.top = "px";
            // find.styleUnit.height = "px";
            offset += space + item.height;
          }
        }
      } else if (val === "space-between") {
        if (this.canvasData.unit !== "px") {
          toast("画布自动布局只支持px单位");
          return;
        }

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
            return a.cx - b.cx;
          });
        const maxX = xList[xList.length - 1] - xList[0];

        const yList = list
          .map((item) => item.cy)
          .sort((a, b) => {
            return a.cy - b.cy;
          });
        const maxY = yList[yList.length - 1] - yList[0];

        if (Math.abs(maxX) > Math.abs(maxY)) {
          list.sort((a, b) => {
            return a.left - b.left;
          });

          const canvasWidth =
            this.canvasData.width * (this.canvasData.scale / 100);
          let space = canvasWidth;
          list.forEach((item) => {
            space = space - item.width;
          });

          space = space / (activeComponentList.length - 1);

          let offset = 0;
          for (let i = 0; i < list.length; i++) {
            const item = list[i];
            const find = activeComponentList.find((a) => a.id === item.id);
            find.style.left = offset;
            find.styleUnit.left = "px";
            offset += space + item.width;
          }
        } else {
          list.sort((a, b) => {
            return a.top - b.top;
          });
          const canvasHeight =
            this.canvasData.height * (this.canvasData.scale / 100);
          let space = canvasHeight;
          list.forEach((item) => {
            space = space - item.height;
          });
          space = space / (activeComponentList.length - 1);
          let offset = 0;
          for (let i = 0; i < list.length; i++) {
            const item = list[i];
            const find = activeComponentList.find((a) => a.id === item.id);
            find.style.top = offset;
            find.styleUnit.top = "px";
            offset += space + item.height;
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
            return a.cx - b.cx;
          });
        const maxX = xList[xList.length - 1] - xList[0];

        const yList = list
          .map((item) => item.cy)
          .sort((a, b) => {
            return a.cy - b.cy;
          });
        const maxY = yList[yList.length - 1] - yList[0];

        if (Math.abs(maxX) > Math.abs(maxY)) {
          list.sort((a, b) => {
            return a.left - b.left;
          });

          let offset = 0;
          for (let i = 0; i < list.length; i++) {
            const item = list[i];
            const find = activeComponentList.find((a) => a.id === item.id);
            find.style.left = offset;
            find.styleUnit.left = "px";
            offset += item.width;
          }
        } else {
          list.sort((a, b) => {
            return a.top - b.top;
          });

          let offset = 0;
          for (let i = 0; i < list.length; i++) {
            const item = list[i];
            const find = activeComponentList.find((a) => a.id === item.id);
            find.style.top = offset;
            find.styleUnit.top = "px";
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

        const xList = list
          .map((item) => item.cx)
          .sort((a, b) => {
            return a.cx - b.cx;
          });
        const maxX = xList[xList.length - 1] - xList[0];

        const yList = list
          .map((item) => item.cy)
          .sort((a, b) => {
            return a.cy - b.cy;
          });
        const maxY = yList[yList.length - 1] - yList[0];

        if (Math.abs(maxX) > Math.abs(maxY)) {
          list.sort((a, b) => {
            return b.left - a.left;
          });

          let offset = this.canvasData.width * (this.canvasData.scale / 100);
          for (let i = 0; i < list.length; i++) {
            const item = list[i];
            const find = activeComponentList.find((a) => a.id === item.id);
            find.style.left = offset - find.style.width;
            offset = find.style.left;
          }
        } else {
          list.sort((a, b) => {
            return b.top - a.top;
          });

          let offset = this.canvasData.height * (this.canvasData.scale / 100);
          for (let i = 0; i < list.length; i++) {
            const item = list[i];
            const find = activeComponentList.find((a) => a.id === item.id);
            find.style.top = offset - find.style.height;
            offset = find.style.top;
          }
        }
      } else if (val === "fill") {
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
            return a.cx - b.cx;
          });
        const maxX = xList[xList.length - 1] - xList[0];

        const yList = list
          .map((item) => item.cy)
          .sort((a, b) => {
            return a.cy - b.cy;
          });
        const maxY = yList[yList.length - 1] - yList[0];

        if (Math.abs(maxX) > Math.abs(maxY)) {
          list.sort((a, b) => {
            return a.left - b.left;
          });

          const canvasWidth =
            this.canvasData.width * (this.canvasData.scale / 100);

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
            find.style.width = new BigNumber(canvasWidth)
              .multipliedBy(rate)
              .toNumber();
            find.style.left = offset;
            offset = find.style.left + find.style.width;
          });
        } else {
          list.sort((a, b) => {
            return a.top - b.top;
          });

          const canvasHeight =
            this.canvasData.height * (this.canvasData.scale / 100);

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
            find.style.height = new BigNumber(canvasHeight)
              .multipliedBy(rate)
              .toNumber();
            find.style.top = offset;
            offset = find.style.top + find.style.height;
          });
        }
      } else if (val === "top") {
        activeComponentList.forEach((item) => {
          item.style.top = 0;
        });
      } else if (val === "bottom") {
        const canvasHeight =
          this.canvasData.height * (this.canvasData.scale / 100);
        activeComponentList.forEach((item) => {
          item.style.top = canvasHeight - item.style.height;
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

        const canvasWidth =
          this.canvasData.width * (this.canvasData.scale / 100);

        const centerX =
          list[0].left +
          new BigNumber(
            list[list.length - 1].left +
              list[list.length - 1].width -
              list[0].left
          )
            .dividedBy(2)
            .toNumber();

        let offset = new BigNumber(canvasWidth)
          .dividedBy(2)
          .minus(centerX)
          .toNumber();
        activeComponentList.forEach((item) => {
          item.style.left = item.style.left + offset;
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

        const canvasHeight =
          this.canvasData.height * (this.canvasData.scale / 100);

        const centerY =
          list[0].top +
          new BigNumber(
            list[list.length - 1].top +
              list[list.length - 1].height -
              list[0].top
          )
            .dividedBy(2)
            .toNumber();

        let offset = new BigNumber(canvasHeight)
          .dividedBy(2)
          .minus(centerY)
          .toNumber();
        activeComponentList.forEach((item) => {
          item.style.top = item.style.top + offset;
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
    selectComponentOrientation(componentList) {},
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
