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
        <div v-if="item.type == 'select'">
          <el-select v-model="item.value" placeholder="">
            <el-option
              v-for="option in item.options"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            >
            </el-option>
          </el-select>
        </div>

        <div v-if="item.type == 'number'">
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
import { getElementCenter } from "../utils/domUtils";
import eventBus from "../utils/eventBus";

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
          label: "对齐方式",
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
          label: "排列方式",
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
          ],
        },
        left: {
          type: "number",
          label: "x位移",
          value: 0,
          step: 0.1
        },
        top: {
          type: "number",
          label: "y位移",
          value: 0,
          step: 0.1
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
    ...mapState([
      "canvasComponentData",
      "canvasStyleData",
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
          for (let i = 1; i < activeComponentList.length; i++) {
            const item = activeComponentList[i];
            const nextValue = item.style.top + item.style.height;
            if (nextValue > value) value = nextValue;
          }
          activeComponentList.forEach((item) => {
            item.style.top = value - item.style.height;
          });
        } else if (val === "left") {
          let value = activeComponentList[0].style.left;
          for (let i = 1; i < activeComponentList.length; i++) {
            const item = activeComponentList[i];
            const nextValue = item.style.left;
            if (nextValue < value) value = nextValue;
          }
          activeComponentList.forEach((item) => {
            item.style.left = value;
          });
        } else if (val === "right") {
          let value =
            activeComponentList[0].style.left +
            activeComponentList[0].style.width;
          for (let i = 1; i < activeComponentList.length; i++) {
            const item = activeComponentList[i];
            const nextValue = item.style.left + item.style.width;
            if (nextValue > value) value = nextValue;
          }
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
        } else if (val === "space-evenly") {

        } else if (val === "no-space") {

        }
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
  },
  methods: {
    showAttr(curComponent, key) {
      if (curComponent == null) return false;
      if (curComponent.attrExcludes == null) return true;
      return !curComponent.attrExcludes.includes(key);
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
