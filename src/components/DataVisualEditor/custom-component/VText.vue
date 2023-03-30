<!-- eslint-disable vue/no-v-html -->
<template>
  <div>
    <div
      v-if="editMode == 'edit'"
      class="v-text"
      @keydown="handleKeydown"
      @keyup="handleKeyup"
    >
      <!-- tabindex >= 0 使得双击时聚焦该元素 -->
      <div
        ref="text"
        :contenteditable="canEdit"
        :class="{ canEdit }"
        :tabindex="element.id"
        :style="{ verticalAlign: element.style.verticalAlign }"
        @dblclick="setEdit"
        @paste="clearStyle"
        @mousedown="handleMousedown"
        @blur="handleBlur"
        @input="handleInput"
        v-html="element.data.text"
      ></div>
    </div>
    <div v-else class="v-text preview">
      <div
        :style="{ verticalAlign: element.style.verticalAlign }"
        v-html="element.data.text"
      ></div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import axios from "axios";
import { keycodes } from "../utils/shortcutKey";
import ComponentBase from "./ComponentBase";
import { getRandStr } from "../utils/utils";

export default {
  extends: ComponentBase,
  props: {
    // element: {
    //   type: Object,
    //   default: () => {},
    // },
  },
  data() {
    return {
      canEdit: false,
      ctrlKey: 17,
      isCtrlDown: false
    };
  },
  computed: {
    ...mapState(["editMode"]),
  },
  watch: {
    element: {
      handler: function (val) {
        console.log("element", this.element);
      },
      deep: true,
    },
  },
  created() {
    console.log("txt的组件生命周期created");
  },
  mounted() {
    console.log("txt的组件生命周期mounted");
  },
  methods: {
    handleInput(e) {
      this.$emit("input", this.element, e.target.innerHTML);
    },

    handleKeydown(e) {
      // 阻止冒泡，防止触发复制、粘贴组件操作
      this.canEdit && e.stopPropagation();
      if (e.keyCode == this.ctrlKey) {
        this.isCtrlDown = true;
      } else if (
        this.isCtrlDown &&
        this.canEdit &&
        keycodes.includes(e.keyCode)
      ) {
        e.stopPropagation();
      } else if (e.keyCode == 46) {
        // deleteKey
        e.stopPropagation();
      }
    },

    handleKeyup(e) {
      // 阻止冒泡，防止触发复制、粘贴组件操作
      this.canEdit && e.stopPropagation();
      if (e.keyCode == this.ctrlKey) {
        this.isCtrlDown = false;
      }
    },

    handleMousedown(e) {
      if (this.canEdit) {
        e.stopPropagation();
      }
    },

    clearStyle(e) {
      e.preventDefault();
      const clp = e.clipboardData;
      const text = clp.getData("text/plain") || "";
      if (text !== "") {
        document.execCommand("insertText", false, text);
      }

      this.$emit("input", this.element, e.target.innerHTML);
    },

    handleBlur(e) {
      this.element.data.text = e.target.innerHTML || "&nbsp;";
      const html = e.target.innerHTML;
      if (html !== "") {
        this.element.data.text = e.target.innerHTML;
      } else {
        this.element.data.text = "";
        this.$nextTick(() => {
          this.element.data.text = "&nbsp;";
        });
      }
      this.canEdit = false;
    },

    setEdit() {
      if (this.element.isLock) return;

      this.canEdit = true;
      // 全选
      this.selectText(this.$refs.text);
    },

    selectText(element) {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(element);
      selection.removeAllRanges();
      selection.addRange(range);
    },
  },
};
</script>

<style lang="less" scoped>
.v-text {
  width: 100%;
  height: 100%;
  display: table;

  div {
    display: table-cell;
    width: 100%;
    height: 100%;
    outline: none;
  }

  .canEdit {
    cursor: text;
    height: 100%;
  }
}

.preview {
  user-select: none;
}
</style>
