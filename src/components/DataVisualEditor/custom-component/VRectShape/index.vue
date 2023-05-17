<template>
  <div class="rect-shape">
    <!-- <div class="rect-shape"> </div> -->

    <dv-border-box-1
      v-if="borderType === 'dv-border-box-1' && show"
    ></dv-border-box-1>
    <dv-border-box-2
      v-else-if="borderType === 'dv-border-box-2' && show"
    ></dv-border-box-2>
    <dv-border-box-3
      v-else-if="borderType === 'dv-border-box-3' && show"
    ></dv-border-box-3>
    <dv-border-box-4
      v-else-if="borderType === 'dv-border-box-4' && show"
    ></dv-border-box-4>
    <dv-border-box-5
      v-else-if="borderType === 'dv-border-box-5' && show"
    ></dv-border-box-5>
    <dv-border-box-6
      v-else-if="borderType === 'dv-border-box-6' && show"
    ></dv-border-box-6>
    <dv-border-box-7
      v-else-if="borderType === 'dv-border-box-7' && show"
    ></dv-border-box-7>
    <dv-border-box-8
      v-else-if="borderType === 'dv-border-box-8' && show"
    ></dv-border-box-8>
    <dv-border-box-9
      v-else-if="borderType === 'dv-border-box-9' && show"
    ></dv-border-box-9>
    <dv-border-box-10
      v-else-if="borderType === 'dv-border-box-10' && show"
    ></dv-border-box-10>
    <dv-border-box-11
      v-else-if="borderType === 'dv-border-box-11' && show"
    ></dv-border-box-11>
    <dv-border-box-12
      v-else-if="borderType === 'dv-border-box-12' && show"
    ></dv-border-box-12>
    <dv-border-box-13
      v-else-if="borderType === 'dv-border-box-13' && show"
    ></dv-border-box-13>
  </div>
</template>

<script>
import ComponentBase from "../ComponentBase";
// import { borderBox1 } from "@jiaminghi/data-view";
import borderBox1 from "./border-box/borderBox1";
import borderBox2 from "./border-box/borderBox2";
import borderBox3 from "./border-box/borderBox3";
import borderBox4 from "./border-box/borderBox4";
import borderBox5 from "./border-box/borderBox5";
import borderBox6 from "./border-box/borderBox6";
import borderBox7 from "./border-box/borderBox7";
import borderBox8 from "./border-box/borderBox8";
import borderBox9 from "./border-box/borderBox9";
import borderBox10 from "./border-box/borderBox10";
import borderBox11 from "./border-box/borderBox11";
import borderBox12 from "./border-box/borderBox12";
import borderBox13 from "./border-box/borderBox13";
import borderBox14 from "./border-box/borderBox14";

export default {
  extends: ComponentBase,
  components: {
    "dv-border-box-1": borderBox1,
    "dv-border-box-2": borderBox2,
    "dv-border-box-3": borderBox3,
    "dv-border-box-4": borderBox4,
    "dv-border-box-5": borderBox5,
    "dv-border-box-6": borderBox6,
    "dv-border-box-7": borderBox7,
    "dv-border-box-8": borderBox8,
    "dv-border-box-9": borderBox9,
    "dv-border-box-10": borderBox10,
    "dv-border-box-11": borderBox11,
    "dv-border-box-12": borderBox12,
    "dv-border-box-13": borderBox13,
    "dv-border-box-14": borderBox14,
  },
  data() {
    return {
      show: true,
      oldStyle: {},
    };
  },
  props: {
    // propValue: {
    //   type: String,
    //   require: true,
    //   default: "",
    // },
  },
  computed: {
    borderType() {
      return this.element.data.type;
    },
  },
  watch: {
    element: {
      handler: function (val) {
        if (
          val.style.width !== this.oldStyle.width ||
          val.style.height !== this.oldStyle.height
        ) {
          this.show = false;
          setTimeout(() => {
            this.show = true;
            this.oldStyle.width = val.style.width;
            this.oldStyle.height = val.style.height;
          }, 300);
        }
      },
      deep: true,
      immediate: true,
    },
    borderType: {
      handler: function (val, old) {
        // this.element.data.type = undefined;

        console.log("边框类型发生改变", val);
      },
      immediate: true,
    },
  },
};
</script>

<style lang="less" scoped>
.rect-shape {
  width: 100%;
  height: 100%;
  overflow: auto;
}
</style>
