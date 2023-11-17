<template>
  <div style="overflow: hidden">
    <canvas
      :id="'qrcode_' + element.data.name"
      :width="width"
      :height="height"
      :style="element.data.code == '' ? 'background-color: rgba(0,0,0,0.25)' : 'background-color: #fff;'"
    ></canvas>
  </div>
</template>

<script>
import ComponentBase from '../ComponentBase';
let QRCode = require('qrcode');

import { generateUniqueId } from '../../utils/generateID';
import BaseMixins from '../BaseMixins';
export default {
  extends: ComponentBase,
  mixins: [BaseMixins],
  data() {
    return {
      width: 50,
      height: 50,
      checkItems: {},
    };
  },
  props: {},
  computed: {
    code: {
      get() {
        return () => {
          return this.element.data.code
        };
      },
      set(value) {},
    },
  },
  watch: {
    element: {
      handler: function (val) {
        this.drawCode(val, val.data.text);
      },
      deep: true,
    },
  },
  created() {
    // if (this.element.uniqueId == null || this.element.uniqueId == '') {
    //   this.element.uniqueId = generateUniqueId();
    // }
  },
  mounted() {
    this.drawCode(this.element, this.element.data.text);
  },
  methods: {
    drawCode(ele, val) {
      if (val == null || val == '') {
        console.warn('No input qrcode text');
        return;
      }
      if (ele.data.margin < 0) ele.data.margin = 0;

      if (
        this.checkItems.text === val &&
        this.checkItems.width === ele.style.width &&
        this.checkItems.height === ele.style.height &&
        this.checkItems.borderRadius === ele.style.borderRadius &&
        this.checkItems.margin === ele.data.margin &&
        this.checkItems.dark === ele.data.dark &&
        this.checkItems.light === ele.data.light &&
        this.checkItems.quality === ele.data.quality &&
        this.checkItems.errorCorrectionLevel === ele.data.errorCorrectionLevel
      ) {
        console.log('qrcode未更新');
        return;
      }

      this.checkItems.text = val;
      this.checkItems.margin = ele.data.margin;
      this.checkItems.width = ele.style.width;
      this.checkItems.height = ele.style.width;
      this.checkItems.borderRadius = ele.style.borderRadius;
      this.checkItems.dark = ele.data.dark;
      this.checkItems.light = ele.data.light;
      this.checkItems.quality = ele.data.quality;
      this.checkItems.errorCorrectionLevel = ele.data.errorCorrectionLevel;

      ele.style.height = ele.style.width;
      this.width = ele.style.width;
      this.height = ele.style.width;

      let opts = {
        errorCorrectionLevel: ele.data.errorCorrectionLevel,
        type: 'image/png',
        quality: ele.data.quality,
        margin: ele.data.margin,
        color: {
          dark: ele.data.dark,
          light: ele.data.light,
        },
        width: this.width,
      };

      this.$nextTick(() => {
        const qrcodeCanvas = document.getElementById('qrcode_' + ele.data.name);
        QRCode.toCanvas(qrcodeCanvas, val, opts, function (error) {
          if (error) {
            toast('二维码生成' + error);
          }
        });
      });
    },
  },
};
</script>

<style lang="less" scoped></style>
