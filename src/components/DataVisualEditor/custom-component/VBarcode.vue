<template>
  <div style="overflow: hidden">
    <canvas :id="element.uniqueId"
      :style="element.data.text == '' ? 'background-color: rgba(0,0,0,0.25)' : 'background-color: #fff;'"></canvas>
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
        default: () => { },
      },
      margin: {
        type: Number,
        default: 1,
      },
    },
    watch: {
      element: {
        handler: function (val) {
          this.drawCode(val);
        },
        deep: true,
      },
    },
    mounted() {
      console.log('ele.valid', this.element.valid);
      this.drawCode(this.element);
    },
    methods: {
      drawCode(ele) {
        if (!ele.data.text) {
          console.warn('No input barcode text');
          return;
        }

        const { format, mod43, ean128, width, height, displayValue, fontOptions,
          font, fontSize, textAlign, textPosition, textMargin, background,
          lineColor,
          margin,
          text } = ele.data

        if (
          this.checkItems.text === text &&
          this.checkItems.format === format &&
          this.checkItems.ean128 === ean128 &&
          this.checkItems.mod43 === mod43 &&
          this.checkItems.width === width &&
          this.checkItems.height === height &&
          // && this.checkItems.styleWidth === ele.style.width
          // && this.checkItems.styleHeight === ele.style.height
          this.checkItems.displayValue === displayValue &&
          this.checkItems.fontOptions === fontOptions &&
          this.checkItems.font === font &&
          this.checkItems.fontSize === fontSize &&
          this.checkItems.textAlign === textAlign &&
          this.checkItems.textPosition === textPosition &&
          this.checkItems.textMargin === textMargin &&
          this.checkItems.background === background &&
          this.checkItems.lineColor === lineColor &&
          this.checkItems.margin === margin
        ) {
          console.log('barcode未更新');
          return;
        }
        if (ele.uniqueId == null || ele.uniqueId == '') {
          ele.uniqueId = generateUniqueId();
        }

        this.checkItems.text = text;
        this.checkItems.format = format;
        this.checkItems.ean128 = ean128;
        this.checkItems.mod43 = mod43;
        this.checkItems.width = width;
        this.checkItems.height = height;
        this.checkItems.displayValue = displayValue;
        this.checkItems.fontOptions = fontOptions;
        this.checkItems.font = font;
        this.checkItems.fontSize = fontSize;
        this.checkItems.textAlign = ele.textAlign;
        this.checkItems.textPosition = ele.textPosition;
        this.checkItems.textMargin = ele.textMargin;
        this.checkItems.background = ele.background;
        this.checkItems.lineColor = ele.lineColor;
        this.checkItems.margin = ele.margin;
        // this.checkItems.styleWidth === ele.style.width
        // this.checkItems.styleHeight === ele.style.height


        let opts = {
          format: format,
          ean128: ean128,
          mod43: mod43,
          width: width,
          height: height,
          displayValue: displayValue,
          fontOptions: fontOptions,
          font: font,
          fontSize: fontSize,
          textAlign: textAlign,
          textPosition: textPosition,
          textMargin: textMargin,
          background: background,
          lineColor: lineColor,
          margin: margin,
          valid: ele.valid,
        };

        this.$nextTick(() => {
          const codeCanvas = document.getElementById(ele.uniqueId);
          JsBarcode(codeCanvas, text, opts);
        });
      },
    },
  };
</script>

<style lang="less" scoped></style>
