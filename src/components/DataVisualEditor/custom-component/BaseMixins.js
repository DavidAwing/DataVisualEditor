import Vue from "vue";


export default {
  beforeCreate: function () {

    const onBeforCreate = this.$options.propsData.element.events.onBeforCreate
    if (onBeforCreate) {
      onBeforCreate({
        component: this,
        data: undefined,
        element: this.$options.propsData.element
      })
    }
  },
  created: function () {
    console.log('BaseMixins created', this.element);

    Vue.set(this.element, '_', this)
    Object.defineProperty(this.element, "_", { enumerable: false })

    if (!this.element.eventOptions)
      this.element.eventOptions = []

    if (!this.element.eventOptions.find(m => m.label === "创建前")) {
      this.element.eventOptions.unshift({
        label: "销毁后",
        value: "onDestroy"
      })
      this.element.eventOptions.unshift({
        label: "销毁前",
        value: "onBeforeDestroy"
      })
      this.element.eventOptions.unshift({
        label: "更新后",
        value: "onUpdated"
      })
      this.element.eventOptions.unshift({
        label: "更新前",
        value: "onBeforeUpdate"
      })
      this.element.eventOptions.unshift({
        label: "挂载后",
        value: "onMounted"
      })
      this.element.eventOptions.unshift({
        label: "挂载前",
        value: "onBeforeMount"
      })
      this.element.eventOptions.unshift({
        label: "创建后",
        value: "onCreated"
      })
      this.element.eventOptions.unshift({
        label: "创建前",
        value: "onBeforeCreate"
      })
    }

  },
  mounted: function () {
    console.log('BaseMixins mounted');
  },
  methods: {

  }
}
