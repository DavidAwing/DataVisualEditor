<template>
  <div>
    <div v-for="(item, index) in canvasComponentData" :key="index"
      :class="'canvas-element ' + (curComponent === item ? 'selected' : 'unselected')" @click="selectElement(item)">

      <div style="margin-left: 8px;" v-if="item.component !== 'Group' && !item.data.name.endsWith('_$copy$')">
        {{ item.data.name }}
      </div>

      <div class="group-element" style="margin-left: 8px;" v-else-if="!item.data.name.endsWith('_$copy$')">
        <div> {{ item.data.name }}</div>
        <div>
          <div v-for="(child,index) in item.propValue" @click="handleChildComponentClick(child, $event)">
            {{child.data.name}}</div>
        </div>
      </div>

      <!-- <div class="group-element" style="margin-left: 8px;" v-else>
        <el-collapse  v-model="activeGroupNames" @change="handleGroupChange">
          <el-collapse-item :title="item.data.name" :name="item.data.name">
            <div v-for="(child,index) in item.propValue" @click="handleChildComponentClick(child, $event)">{{child.data.name}}</div>
          </el-collapse-item>
        </el-collapse>
      </div> -->

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
        activeGroupNames: [],
        componentCopyList: []
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
      handleGroupChange() {

      },
      handleChildComponentClick(item) {

        // copy
        // 1. 监听copy,一旦失去焦点就删除
        // 2. 需要重新从子组件绑定样式

        return

        const i = bi.store.state.canvasComponentData.findIndex(c => c.data.name === (item.data.name + "_$copy$"))
        if (i !== -1) {
          bi.store.state.canvasComponentData.splice(i, 1)
        }

        const componentCopy = f.deepCopy(item);

        ['name', 'show', 'isAlign'].forEach(key => {
          bi.Vue.delete(componentCopy.attrList, componentCopy.attrList.findIndex(attr => attr.key === key))
        });

        this.componentCopyList.push(componentCopy)
        componentCopy.data.name += "_$copy$"
        this.$store.commit('addComponent', {
          component: componentCopy,
        })

        this.$nextTick(() => {
          setTimeout(() => {
            this.selectElement(componentCopy)
          }, 100);
        })


      }
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
