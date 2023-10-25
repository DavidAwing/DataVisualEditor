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
    console.log('BaseMixins created', this.element.data.name);


  },
  mounted: function () {
    console.log('BaseMixins mounted', this.element.data.name);
  },
  methods: {

  }
}
