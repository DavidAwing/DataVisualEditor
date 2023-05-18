<!-- TODO: 这个页面后续将用 JSX 重构 -->
<template>
  <div class="attr-list">群组的设置</div>
</template>

<script>
import { mapState } from "vuex";
import { styleData } from "../utils/style";
import { getElementCenter } from "../utils/domUtils";
import eventBus from "../utils/eventBus";

export default {
  data() {
    return {

    };
  },
  computed: {
    ...mapState([
      "canvasComponentData",
      "canvasStyleData",
      "listData",
      "currentPrintIndex",
      "activeComponentList",
    ]),
  },
  methods: {

  },
};
</script>

<style lang="less" scoped>
.attr-list {
  overflow: auto;
  padding: 20px;
  padding-top: 0;
  height: 100%;
}
</style>
