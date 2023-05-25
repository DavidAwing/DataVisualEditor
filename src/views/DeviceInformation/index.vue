<template>
  <div class="container">
    <div>宽度像素: {{ width }}</div>
    <div>高度像素: {{ height }}</div>
    <div>屏幕宽高比: {{ aspectRatio }}</div>
  </div>
</template>

<script>
export default {
  name: "DeviceInformation",
  data() {
    return {
      width: 0,
      height: 0,
      aspectRatio: 0,
    };
  },
  components: {},
  props: {},
  computed: {},
  created() {},
  mounted() {
    this.width = screen.width;
    this.height = screen.height;
    this.aspectRatio = Math.floor(screen.width / screen.height * 1000000) / 1000000
  },
  methods: {},
};
</script>

<style lang="less" scoped>
@import "index.less";
</style>
