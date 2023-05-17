<!-- TODO: 这个页面后续将用 JSX 重构 -->
<template>
  <div class="attr-list">
    <el-form>
      <!-- 样式 -->
      <el-form-item
        v-for="({ key, label, bind, type, options }, index) in attrList"
        :key="index"
        :label="label"
        v-if="showAttr(curComponent, key)"
      >
        <div v-if="type == 'text'">
          <el-input v-model="curComponent[bind][key]"> </el-input>
        </div>

        <div v-else-if="type == 'textarea'">
          <el-input v-model="curComponent[bind][key]" type="textarea" />
        </div>

        <div
          v-else-if="type == 'number'"
          style="display: flex; width: 100%; position: relative"
        >
          <el-input v-model.number="curComponent[bind][key]" type="number" step="0.1"/>
          <el-select
            v-if="curComponent.styleUnit[key]"
            v-model="curComponent.styleUnit[key]"
            style="width: 100px; margin-left: 6px"
          >
            <el-option key="px" label="px" value="px"></el-option>
            <el-option key="vw" label="vw" value="vw"></el-option>
            <el-option key="vh" label="vh" value="vh"></el-option>
            <!-- <el-option key="%" label="%" value="%"></el-option> -->
          </el-select>
        </div>

        <div v-else-if="type == 'select'">
          <el-select v-model="curComponent[bind][key]" placeholder="">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>

        <div v-else-if="type == 'color-picker'">
          <el-color-picker
            v-model="curComponent[bind][key]"
            :showAlpha="options.showAlpha"
          >
          </el-color-picker>
        </div>

        <div
          v-else-if="type == 'input-file'"
          style="
            display: flex;
            width: 110px;
            position: relative;
            height: 30px;
            line-height: 30px;
            margin-bottom: 12px;
            border: 1px solid #d9d9d9;
            cursor: pointer;
          "
        >
          <img
            style="margin-left: 10px"
            src="../assets/上传.svg"
            width="20"
            alt=""
          />
          <input
            type="file"
            @change="bind(curComponent, $event)"
            style="
              position: absolute;
              left: 0;
              opacity: 0;
              height: 100%;
              width: 100%;
            "
          />
        </div>

        <div v-else-if="type == 'checkbox'">
          <el-checkbox v-model="curComponent[bind][key]"></el-checkbox>
        </div>

        <div v-else-if="type == 'checkbox'">
          <el-checkbox v-model="curComponent[bind][key]"></el-checkbox>
        </div>

        <div v-else-if="type == 'eventbus-button'">
          <el-button
            @click="eventBus.$emit(bind['click'], curComponent.data.name, $event)"
          >
            {{ bind["label"] }}</el-button
          >
        </div>

        <div v-else-if="type == 'eventbus-select'">
          <el-select
            v-model="bind.value"
            @change="
              (value) =>
                eventBus.$emit(bind['change'], curComponent.name, value)
            "
            placeholder=""
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { styleData } from "../utils/style";
import eventBus from "../utils/eventBus";

export default {
  data() {
    return {
      excludes: ["Group"], // 这些组件不显示内容
      borderStyleOptions: [
        {
          label: "实线",
          value: "solid",
        },
        {
          label: "虚线",
          value: "dashed",
        },
      ],
      verticalAlignOptions: [
        {
          label: "上对齐",
          value: "top",
        },
        {
          label: "居中对齐",
          value: "middle",
        },
        {
          label: "下对齐",
          value: "bottom",
        },
      ],
      selectKey: ["textAlign", "borderStyle", "verticalAlign"],
      styleData,
      eventBus,
    };
  },
  computed: {
    attrList() {
      let attrList = [];

      // if (this.$store.state.curComponent) {
      //   const curComponentStyleKeys = Object.keys(this.$store.state.curComponent.style)
      //   styleKeys = styleKeys.concat(this.styleData.filter(item => curComponentStyleKeys.includes(item.key)))
      // }

      attrList = attrList.concat(this.curComponent.attrList);

      return attrList;
    },
    curComponent() {
      return this.$store.state.curComponent;
    },
    attrModel: {
      get() {
        return (key, bind) => {
          if (bind) {
            return this.curComponent[bind][key];
          } else {
            return this.curComponent[key];
          }
        };
      },
      set(value) {
        if (bind) {
          this.curComponent[bind][key] = value;
        } else {
          return (this.curComponent[key] = value);
        }
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
