<template>
  <div>
    <div v-for="(item, index) in canvasComponentData" :key="index" :class="'canvas-element ' + (curComponent === item ? 'selected' : 'unselected')" @click="selectElement(item)" >
      {{ item.data.name }}
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { toImage } from '../../utils/domUtils';
import { getRandStr } from '../../utils/utils';
import axios from 'axios';
const JSONfn = require('jsonfn').JSONfn;

export default {
  data() {
    return {
      activeCollapses: ['0', '1'],
    };
  },
  computed: {
    ...mapState([
      'curComponent',
      'canvasComponentData',
      'canvasData',
      'editor',
      'canvasName',
      'activeComponentList',
      'curComponentIndex',
    ]),
  },
  beforeCreate() {
    // for (let i = 0; i < componentList.length; i++) {
    //   const component = componentList[i]
    //   if (component.events && component.events.onBeforeCreate)
    //     await component.events.onBeforeCreate(component, this)
    // }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    selectElement(item) {
      if (this.curComponent === item) {
        this.$store.commit('setCurComponent', {
          component: null,
          index: null,
        });
      } else {
        this.$store.commit('setCurComponent', {
          component: item,
          index: item.id,
        });
      }
    },
  },
};
</script>

<style lang="less" scoped>
.component-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 10px;

  .list {
    width: 45%;
    border: 1px solid #ddd;
    cursor: grab;
    margin-bottom: 10px;
    text-align: center;
    color: #333;
    padding: 2px 5px;
    display: flex;
    align-items: center;
    justify-content: center;

    &:active {
      cursor: grabbing;
    }

    .iconfont {
      margin-right: 4px;
      font-size: 20px;
    }

    .icon-wenben,
    .icon-tupian {
      font-size: 18px;
    }
  }
}

@import url(index.less);
</style>
