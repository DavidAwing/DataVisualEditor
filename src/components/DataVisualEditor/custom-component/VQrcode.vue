<template>
  <div style="overflow: hidden;">
    <canvas :id="element.uniqueId" :width="width" :height="height"
      :style="propValue == '' ? 'background-color: rgba(0,0,0,0.25)' :  'background-color: #fff;' "></canvas>
  </div>
</template>

<script>

  let QRCode = require('qrcode')

  import { generateUniqueId } from '../utils/generateID'

  export default {
    data() {
      return {
        width: 50,
        height: 50,
        checkItems: {}
      }
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
      }
    },
    watch: {
      element: {
        handler: function (val) {
          this.drawCode(val, this.propValue)
        },
        deep: true
      }
    },
    created() {
      if (this.element.uniqueId == null || this.element.uniqueId == "") {
        this.element.uniqueId = generateUniqueId()
      }
    },
    mounted() {
      this.drawCode(this.element, this.propValue);
    },
    methods: {

      drawCode(ele, val) {

        if (val == null || val == "") {
          console.warn("No input qrcode text");
          return
        }
        if (ele.margin < 0)
          ele.margin = 0;

        if (this.checkItems.text === val
          && this.checkItems.width === ele.style.width
          && this.checkItems.height === ele.style.height
          && this.checkItems.borderRadius === ele.style.borderRadius
          && this.checkItems.margin === ele.margin
          && this.checkItems.dark === ele.dark
          && this.checkItems.light === ele.light
          && this.checkItems.quality === ele.quality
          && this.checkItems.errorCorrectionLevel === ele.errorCorrectionLevel) {
          console.log("qrcode未更新");
          return
        }

        this.checkItems.text = val
        this.checkItems.margin = ele.margin
        this.checkItems.width = ele.style.width
        this.checkItems.height = ele.style.width
        this.checkItems.borderRadius = ele.style.borderRadius
        this.checkItems.dark = ele.dark
        this.checkItems.light = ele.light
        this.checkItems.quality = ele.quality
        this.checkItems.errorCorrectionLevel = ele.errorCorrectionLevel

        ele.style.height = ele.style.width
        this.width = ele.style.width
        this.height = ele.style.width

        let opts = {
          errorCorrectionLevel: ele.errorCorrectionLevel,
          type: 'image/png',
          quality: ele.quality,
          margin: ele.margin,
          color: {
            dark: ele.dark,
            light: ele.light
          },
          width: this.width
        }

        this.$nextTick(() => {
          const qrcodeCanvas = document.getElementById(ele.uniqueId)
          QRCode.toCanvas(qrcodeCanvas, val, opts, function (error) {
            if (error) {
              toast("二维码生成" + error)
            }
          })

        })

      }

    },
  }
</script>

<style lang="less" scoped>

</style>
