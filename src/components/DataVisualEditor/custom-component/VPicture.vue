<template>
  <div class="container">
    <el-image
      ref="image"
      @load="imageLoad"
      style="width: 100%; height: 100%"
      :src="src"
      :fit="element.data.fit"
    ></el-image>
  </div>
</template>

<script>
import ComponentBase from './ComponentBase';
import eventBus from '../utils/eventBus';
import { mapState } from 'vuex';
import axios from 'axios';
// import {  } from "../utils/style";
import { changeStyleWithScale } from '../utils/translate';
import BaseMixins from './BaseMixins';
function convertImgToBase64(url, callback, outputFormat) {
  const canvas = document.createElement('CANVAS');
  const ctx = canvas.getContext('2d');
  const img = new Image();
  img.crossOrigin = 'Anonymous';
  img.onload = function () {
    canvas.height = img.height;
    canvas.width = img.width;
    ctx.drawImage(img, 0, 0);
    const dataURL = canvas.toDataURL(outputFormat || 'image/png');
    callback.call(this, dataURL);
    canvas = null;
  };
  img.src = url;
}

function imgToBase64(img, callback, outputFormat) {
  const canvas = document.createElement('CANVAS');
  const ctx = canvas.getContext('2d');
  img.crossOrigin = 'anonymous';
  canvas.height = img.height;
  canvas.width = img.width;
  ctx.drawImage(img, 0, 0);
  const dataURL = canvas.toDataURL(outputFormat || 'image/png');
  callback.call(this, dataURL);
  canvas = null;
}

export default {
  extends: ComponentBase,
  mixins: [BaseMixins],
  data() {
    return {};
  },
  props: {},
  computed: {
    ...mapState(['canvasData']),
    styleKeys() {
      if (this.$store.state.curComponent) {
        const curComponentStyleKeys = Object.keys(this.$store.state.curComponent.style);
        return this.styleData.filter(item => curComponentStyleKeys.includes(item.key));
      }
      return [];
    },
    curComponent() {
      return this.$store.state.curComponent;
    },
    src() {
      return this.element.data.image;
    },
  },
  created() {
    eventBus.$on('onFillCanvas', (name, value) => {
      if (name !== this.element.name) return;

      if (value === 'fill') {
        this.element.style.top = 0;
        this.element.style.left = 0;
        this.element.style.width = 100;
        this.element.styleUnit.width = '%';
        this.element.style.height = 100;
        this.element.styleUnit.height = '%';
      } else if (value === 'horizontal') {
        this.element.style.left = 0;
        this.element.style.width = 100;
        this.element.styleUnit.width = '%';
      } else if (value === 'vertical') {
        this.element.style.top = 0;
        this.element.style.height = 100;
        this.element.styleUnit.height = '%';
      }
    });

    this.$watch('element.data.imageUrl', val => {
      if (
        this.element.data.imageUrl !== undefined &&
        this.element.data.imageUrl !== null &&
        this.element.data.imageUrl.trim() !== ''
      ) {
        const src = this.element.data.imageUrl.trim();
        // 第3方网址把图片存起来防止丢失
        if (src.startsWith('https') || src.startsWith('http')) {
          axios.get('/BI-API/Component/GetImageBase64?file=' + src, { timeout: 6000 }).then(({ data }) => {
            if (data.state !== 200) {
              console.warn('图片转base64发生错误');
              return;
            }
            this.element.data.image = 'data:image/png;base64,' + data.data;
          });
        }
      }
    });
  },
  watch: {
    element: {
      handler: function (val) {
        // if (
        //   val.imgScaledWidth != this.$refs.img.width ||
        //   val.imgScaledHeight != this.$refs.img.height
        // ) {
        //   val.imgScaledWidth = this.$refs.img.width;
        //   val.imgScaledHeight = this.$refs.img.height;
        // }
      },
      deep: true,
    },
  },
  methods: {
    imageLoad(e) {},
  },
};
</script>

<style lang="less" scoped>
.container {
  width: 100%;
  height: 100%;
  display: flex;
  overflow: auto;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
}

/* img {
  width: 100%;
  height: auto;


    width: 100%;
    height: auto;
    max-width: 100%;
    max-height: 100%;


  position: absolute;
    top: 50%;
    left: 50%;
    display: block;
    min-width: 100%;
    min-height: 100%;
    transform: translate(-50%, -50%);
} */
</style>
