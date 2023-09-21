<!-- eslint-disable vue/no-v-html -->
<template>
  <div
    @click="onEvent('onClick', { $event })"
    @mouseover="onEvent('onMouseover', { $event })"
    @mouseout="onEvent('onMouseout', { $event })"
    style="visibility: visible"
  >
    <div v-if="editMode == 'edit'" class="v-text" @keydown="handleKeydown" @keyup="handleKeyup">
      <!-- tabindex >= 0 使得双击时聚焦该元素 -->
      <div
        ref="text"
        :contenteditable="canEdit"
        :class="{ canEdit }"
        :tabindex="element.id"
        @dblclick="setEdit"
        @paste="clearStyle"
        @mousedown="handleMousedown"
        @blur="handleBlur"
        @input="handleInput"
        v-html="!canEdit ? text : element.data.text"
      ></div>
    </div>
    <div v-else class="v-text preview">
      <div v-html="!canEdit ? text : element.data.text"></div>
    </div>
  </div>

</template>

<script>
import { mapState } from 'vuex';
import axios from 'axios';
import { keycodes } from '../utils/shortcutKey';
import ComponentBase from './ComponentBase';
import { getRandStr } from '../utils/utils';
import BaseMixins from './BaseMixins';

// todo 文字支持超链接

export default {
  extends: ComponentBase,
  mixins: [BaseMixins],
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
      isCtrlDown: false,
      verticalAlign: '',
      writingMode: '',
      dialogVisible: true,
      isModalDialog: true,
    };
  },
  computed: {
    ...mapState(['editMode']),
    text() {
      if (this.element.data.text === undefined) return '';
      if (this.writingMode === 'vertical') {
        return this.element.data.text.split('').join('<br>');
      } else if (this.writingMode === 'horizontal') {
        return this.element.data.text;
      } else {
        return this.element.data.text;
      }
    },
    data() {
      return this.element.data;
    },
  },
  watch: {
    element: {
      handler: function (val) {
        if (val.data.verticalAlign !== this.verticalAlign) this.verticalAlign = val.data.verticalAlign;
        if (val.data.writingMode !== this.writingMode) this.writingMode = val.data.writingMode;
      },
      deep: true,
    },
    verticalAlign() {
      this.$refs['text'].style['vertical-align'] = this.verticalAlign;
    },
  },
  beforeCreate() {},
  created() {},
  mounted() {
    if (false) {
      this.$refs['text'].style['vertical-align'] = this.data.verticalAlign;
      this.writingMode = this.data.writingMode;
    }

    // this.$refs["text"].style["writing-mode"] = this.element.data.writingMode;
  },
  methods: {
    handleInput(e) {
      this.$emit('input', this.element, e.target.innerHTML);
    },

    handleKeydown(e) {
      // 阻止冒泡，防止触发复制、粘贴组件操作
      this.canEdit && e.stopPropagation();
      if (e.keyCode == this.ctrlKey) {
        this.isCtrlDown = true;
      } else if (this.isCtrlDown && this.canEdit && keycodes.includes(e.keyCode)) {
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
      const text = clp.getData('text/plain') || '';
      if (text !== '') {
        document.execCommand('insertText', false, text);
      }

      this.$emit('input', this.element, e.target.innerHTML);
    },

    handleBlur(e) {
      if (this.writingMode === 'vertical') {
        this.element.data.text = e.target.innerHTML.replace(/<br>+/g, '') || '';
      } else {
        this.element.data.text = e.target.innerHTML || '';
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
