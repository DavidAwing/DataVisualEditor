<template>
  <div style="overflow: hidden">
    <canvas
      :id="element.uniqueId"
      :style="propValue == '' ? 'background-color: rgba(0,0,0,0.25)' : 'background-color: #fff;'"
    ></canvas>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { generateUniqueId } from '../utils/generateID';
import BaseMixins from './BaseMixins';
let JsBarcode = require('jsbarcode');

export default {
  mixins: [BaseMixins],
  data() {
    return {
      width: 50,
      height: 50,
      checkItems: {},
    };
  },
  props: {
    propValue: {
      type: String,
      require: true,
      default: '',
    },
    element: {
      type: Object,
      default: () => {},
    },
    margin: {
      type: Number,
      default: 1,
    },
  },
  watch: {
    element: {
      handler: function (val) {
        this.drawCode(val, this.propValue);
      },
      deep: true,
    },
  },
  mounted() {
    this.drawCode(this.element, this.propValue);
  },
  methods: {
    drawCode(ele, val) {
      if (val == null || val == '') {
        console.warn('No input barcode text');
        return;
      }

      if (
        this.checkItems.text === val &&
        this.checkItems.format === ele.format &&
        this.checkItems.ean128 === ele.ean128 &&
        this.checkItems.mod43 === ele.mod43 &&
        this.checkItems.width === ele.width &&
        this.checkItems.height === ele.height &&
        // && this.checkItems.styleWidth === ele.style.width
        // && this.checkItems.styleHeight === ele.style.height
        this.checkItems.displayValue === ele.displayValue &&
        this.checkItems.fontOptions === ele.fontOptions &&
        this.checkItems.font === ele.font &&
        this.checkItems.fontSize === ele.fontSize &&
        this.checkItems.textAlign === ele.textAlign &&
        this.checkItems.textPosition === ele.textPosition &&
        this.checkItems.textMargin === ele.textMargin &&
        this.checkItems.background === ele.background &&
        this.checkItems.lineColor === ele.lineColor &&
        this.checkItems.margin === ele.margin
      ) {
        console.log('barcode未更新');
        return;
      }
      if (ele.uniqueId == null || ele.uniqueId == '') {
        ele.uniqueId = generateUniqueId();
      }

      this.checkItems.text = val;
      this.checkItems.format = ele.format;
      this.checkItems.ean128 = ele.ean128;
      this.checkItems.mod43 = ele.mod43;
      this.checkItems.width = ele.width;
      this.checkItems.height = ele.height;
      this.checkItems.displayValue = ele.displayValue;
      this.checkItems.fontOptions = ele.fontOptions;
      this.checkItems.font = ele.font;
      this.checkItems.fontSize = ele.fontSize;
      this.checkItems.textAlign = ele.textAlign;
      this.checkItems.textPosition = ele.textPosition;
      this.checkItems.textMargin = ele.textMargin;
      this.checkItems.background = ele.background;
      this.checkItems.lineColor = ele.lineColor;
      this.checkItems.margin = ele.margin;
      // this.checkItems.styleWidth === ele.style.width
      // this.checkItems.styleHeight === ele.style.height

      let opts = {
        format: ele.format,
        ean128: ele.ean128,
        mod43: ele.mod43,
        width: ele.width,
        height: ele.height,
        displayValue: ele.displayValue,
        fontOptions: ele.fontOptions,
        font: ele.font,
        fontSize: ele.fontSize,
        textAlign: ele.textAlign,
        textPosition: ele.textPosition,
        textMargin: ele.textMargin,
        background: ele.background,
        lineColor: ele.lineColor,
        margin: ele.margin,
        valid: ele.valid,
      };

      this.$nextTick(() => {
        const codeCanvas = document.getElementById(ele.uniqueId);
        JsBarcode(codeCanvas, val, opts);
      });
    },
  },
};
</script>

<style lang="less" scoped></style>
