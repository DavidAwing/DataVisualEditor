<!-- eslint-disable vue/no-v-html -->
<template>
  <div class="container">
    <device-emulator :url="url" :type="type"></device-emulator>
  </div>
</template>

<script>
import Vue, { PropType, VNode } from "vue";
// const puppeteer = require("puppeteer");

import React, { useRef } from "react";
import ReactDom from "react-dom";

import ReactComponent from "./ReactComponent";
import DeviceEmulator from "./DeviceEmulator";

export default {
  extends: undefined,
  components: {
    "react-component": ReactComponent,
    "device-emulator": DeviceEmulator,
  },
  directives: {},
  props: {
    type2: {
      type: String, //  tab,mobile
      default: "",
    },
    url2: {
      type: String,
      default: "", // http://localhost:9538/sub01/#/viewer?name=aaa
    },
  },
  data() {
    return {
      type: "",
      url: "",
      show: true,
    };
  },
  computed: {},
  watch: {
    type: {
      handler: function (val, old) {},
      deep: false,
      immediate: true,
    },
  },
  created() {},
  mounted() {
    // (async () => {
    //   const browser = await puppeteer.launch({
    //     //启动浏览器
    //     args: ["--no-sandbox"],
    //     headless: false, //代码运行时打开浏览器方便观察
    //     // devtools:true   //打开f12界面
    //   });
    //   const page = await browser.newPage();
    //   const navigationPromise = page.waitForNavigation();
    //   await page.goto("https://www.baidu.com/");
    //   await page.setViewport({ width: 1653, height: 1243 });
    //   await navigationPromise;
    //   await page.waitForSelector(".s_form #kw");
    //   await page.click(".s_form #kw");
    //   await page.type(".s_form #kw", "测试ppppp");
    //   await page.waitForSelector(".s_form #su");
    //   await page.click(".s_form #su");
    //   // await browser.close()
    // })();
  },
  methods: {
    load(type, url) {

      this.type = type;
      this.url = url;

      const deviceEmulator = document.getElementsByClassName(
        "device-emulator-container"
      )[0].children[1];

      // deviceEmulator.classList.forEach((name) => {
      //   deviceEmulator.classList.remove(name);
      // });

      const iframe = deviceEmulator.querySelectorAll("iframe")[0];
      iframe.src = this.url
      iframe.contentWindow.location.reload()

      if (this.deviceType === "tab") {
        iframe.style.transformOrigin = "center";
        iframe.style.transform = "translate3d(-22px, 0px, 0px) scale(0.99)";
      } else {
        iframe.style.transformOrigin = "center";
        iframe.style.transform = "translate3d(-17px, 0px, 0px) scale(0.99)";
        // deviceEmulator.classList.add("mobile-chrome")
        // deviceEmulator.classList.add("chrome-rotate")
        // deviceEmulator.classList.add("mobile-reposition")
      }
    },
  },
};
</script>

<style lang="less" scoped>
@import "index.less";
</style>
