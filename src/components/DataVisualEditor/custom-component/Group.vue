<template>
  <div class="group">
    <div>
      <template v-for="item in propValue">
        <component :is="item.component" :id="'component' + item.id" :key="item.id" class="component"
          :style="item.groupStyle" :prop-value="item.propValue" :element="item" />
      </template>
    </div>
  </div>
</template>

<script>
  import BaseMixins from './BaseMixins';
  export default {
    mixins: [BaseMixins],
    created() {

      this.$watch(() => this.element.data.isModal, (val) => {
        if (!location.hash.includes('/editor')) return
        if (val === false) {
          this.$set(this.element.data, 'show', true)
        }
      }, { immediate: true, deep: false })

      this.$watch(() => this.element.data.show, (val) => {
        if (!location.hash.includes('/editor'))
          return
        if (this.element.data.isModal === false && this.element.data.show === true) {
          this.$nextTick(() => {
            document.getElementById('editor').appendChild($(this.$el).parent()[0])
          })
        }
      }, { immediate: true, deep: false })

    },
    props: {
      propValue: {
        type: Array,
        default: () => [],
      },
      element: {
        type: Object,
        default: () => { },
      },
    },
    methods: {
      test() {
        console.log('tuossfsdf');
      }
    },
  }
</script>

<style lang="less" scoped>
  .group {
    &>div {
      position: relative;
      width: 100%;
      height: 100%;

      .component {
        position: absolute;
      }
    }
  }
</style>
