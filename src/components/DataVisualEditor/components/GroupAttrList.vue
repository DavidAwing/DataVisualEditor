<!-- TODO: 这个页面后续将用 JSX 重构 -->
<template>
  <div class="attr-list">
    <div>
      {{ JSON.stringify(curComponent)}}
    </div>
  </div>
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
      "curComponent",
    ]),
    attrList() {
      let attrList = [];
      attrList = attrList.concat(this.curComponent.attrList);
      return attrList;
    },
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
