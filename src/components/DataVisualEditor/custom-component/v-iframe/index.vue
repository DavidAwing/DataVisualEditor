<!-- eslint-disable vue/no-v-html -->
<template>
  <div class="container">
    <iframe
      v-if="iframeShow"
      :onload="onload()"
      ref="iframe"
      :src="iframeSrc"
      :id="iframeId"
      height="100%"
      width="100%"
      frameborder="no"
      border="10"
      marginwidth="0"
      marginheight="0"
      scrolling="no"
      allowtransparency="yes"
      seamless
      allowfullscreen="true"
      webkitallowfullscreen="true"
      mozallowfullscreen="true"
    ></iframe>
    <div class="mask-layer"></div>
  </div>
</template>

<script lang="js">
import { mapState } from "vuex";
import axios from "axios";
import { keycodes } from "../../utils/shortcutKey";
import ComponentBase from "../ComponentBase";
import { getRandStr } from "../../utils/utils";
import VResize from 'v-resize'
import eventBus from '../../utils/eventBus'
import BaseMixins from '../BaseMixins';
export default {
  extends: ComponentBase,
  mixins:[BaseMixins],
  props: {
  },
  mixins: [],
  data() {
    return {
      iframeId: "",
      iframeSrc: "",
      iframeShow: true
    };
  },
  computed: {
    list() {
      return []
    }
  },
  watch: {
    element: {
      handler: function (val, old) {
        if (!this.iframeSrc || val.data.src !== this.iframeSrc) {
          this.iframeSrc = val.data.src
          this.iframeShow = false
          this.$nextTick(() => {
            this.iframeShow = true
          })
        }
      },
      deep: true,
      immediate: true
    },
  },
  beforeCreate() {

  },
  created() {
    this.iframeId = getRandStr()
  },
  mounted() {

  },
  updated() {

  },
  methods: {
    onload() {

      // 获取iframe元素
      const iframe = document.getElementById(this.iframeId);
      if (iframe == null) {
        setTimeout(() => {
          this.onload()
        }, 300);
        return
      }

      // 获取iframe内部网页的body元素
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
      const iframeBody = iframeDoc.body;
      const iframeHtml = iframeDoc.querySelector("html")

    }

  }
};
</script>

<style lang="less" scoped>
@import 'index.less';
</style>
