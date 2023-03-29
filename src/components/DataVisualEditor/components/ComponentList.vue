<template>
  <div class="component-list" @dragstart="handleDragStart">
    <div v-for="(item, index) in componentList" :key="index" class="list" draggable :data-index="index">
      <img v-if="item.icon.endsWith('.jpg') || item.icon.endsWith('.png') || item.icon.startsWith('data:image/')"
        width="17" class="iconfont" :src="item.icon" style="margin-top: 3px;margin-bottom:3px;">
      <span v-else class="iconfont" :class="'icon-' + item.icon"></span>
      <span>{{ item.label }}</span>
    </div>
  </div>
</template>

<script>
  import componentList from '../custom-component/component-list'

  export default {
    data() {
      return {
        componentList,
      }
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
      handleDragStart(e) {
        e.dataTransfer.setData('index', e.target.dataset.index)
      },
    },
  }
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
</style>
