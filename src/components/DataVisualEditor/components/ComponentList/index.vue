<template>
  <div>
    <el-collapse v-model="activeCollapses" class="collapse">
      <el-collapse-item title="内置组件" name="0">
        <div class="component-list" @dragstart="handleDragStart">
          <div v-for="(item, index) in componentList" :key="index" class="list" draggable :data-index="index">
            <img
              v-if="
                item.icon.endsWith('.jpg') ||
                item.icon.endsWith('.png') ||
                item.icon.startsWith('data:image/') ||
                item.icon.startsWith('http')
              "
              width="17"
              class="iconfont"
              :src="item.icon"
              style="margin-top: 3px; margin-bottom: 3px"
            />
            <span v-else class="iconfont" :class="'icon-' + item.icon"></span>
            <span>{{ item.label }}</span>
          </div>
        </div>
      </el-collapse-item>
      <el-collapse-item title="组件市场" name="1">
        <div>
          <el-button type="primary" plain @click="addComponentMarket">添加到组件市场</el-button>
        </div>
        <div class="component-list">
          <div
            v-for="(item, index) in userComponentList"
            :key="index"
            class="list user-component-item"
            draggable
            @dragstart="handleDragStart($event, item.data.name)"
          >
            <img
              v-if="
                item.icon.endsWith('.jpg') ||
                item.icon.endsWith('.png') ||
                item.icon.startsWith('data:image/') ||
                item.icon.startsWith('http')
              "
              width="100%"
              :height="imgHeight"
              :src="item.icon"
              style="margin-top: 3px; margin-bottom: 3px"
            />
            <label>{{ item.data.name }}</label>
            <!-- <span v-else class="iconfont" :class="'icon-' + item.icon"></span>
             -->
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import componentList, { userComponentList } from '../../custom-component/component-list';
import { toImage } from '../../utils/domUtils';
import { getRandStr } from '../../utils/utils';
import axios from 'axios';
const JSONfn = require('jsonfn').JSONfn;

export default {
  data() {
    return {
      activeCollapses: ['0', '1'],
      componentList,
      userComponentList,
      imgHeight: '60px',
    };
  },
  computed: {
    ...mapState(['curComponent']),
  },
  beforeCreate() {
    // for (let i = 0; i < componentList.length; i++) {
    //   const component = componentList[i]
    //   if (component.events && component.events.onBeforeCreate)
    //     await component.events.onBeforeCreate(component, this)
    // }
  },
  created() {},
  mounted() {
    // this.imgHeight = getComputedStyle(document.getElementsByClassName('list')[0]).width;

    axios.get(`/BI-API/Component/GetUserCustomizedComponentList`).then(({ data }) => {
      for (const item of data.data) {
        this.userComponentList.push(JSON.parse(item));
      }
    });
  },
  methods: {
    handleDragStart(e, index) {
      if (!index) {
        e.dataTransfer.setData('index', e.target.dataset.index);
      } else {
        e.dataTransfer.setData('index', index);
      }
    },
    addComponentMarket() {
      if (!this.curComponent) {
        return;
      }
      toImage(document.getElementById('component' + this.curComponent.id)).then(async image => {
        this.curComponent.icon = image;
        const curComponentText = JSONfn.stringify(this.curComponent);
        await axios.post(`/BI-API/Component/SaveUserCustomizedComponent`, {
          name: this.curComponent.data.name,
          component: curComponentText,
        });
        for (let i = 0; i < this.userComponentList.length; i++) {
          const item = this.userComponentList[i];
          if (item.data.name === this.curComponent.data.name) {
            this.$set(this.userComponentList, i, JSON.parse(curComponentText));
            return;
          }
        }
        this.userComponentList.push(JSON.parse(curComponentText));
      });
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
