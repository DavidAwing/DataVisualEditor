/* global $ */
import Vue from 'vue'
import { Dialog } from 'element-ui';

Vue.component('top-el-dialog', {
  extends: Dialog,
  props: {
    test: String,
    toBody: {
      type: Boolean,
      default: true
    }
  },
  mounted() {
    if (this.toBody === false) {
      console.log('this.toBody', this.toBody);
    } else {
      document.body.appendChild(this.$el);
    }
  },
  watch: {
    toBody: {
      handler: function (val) {

      },
      deep: true,
      immediate: true
    },
  },
});


Vue.component('component-dialog', {
  extends: Dialog,
  components: {},
  props: {
    element: Object,
    toBody: {
      type: Boolean,
      default: true,
    },
  },
  beforeMount() { },
  created() {

    const setDialog = () => {
      if (this.element.data.show && this.element.data.isModal) {
        this.$nextTick(() => {
          this.showing()
        })
      } else {

      }
    }

    // this.$set(this.element.data, 'isModal', this.element.data.isModal)

    this.$watch(() => this.element.data.show, (val) => {
      setDialog()
    }, { immediate: false, deep: false })

    this.$watch(() => this.element.data.isModal, (val) => {
      setDialog()
    }, { immediate: true, deep: false })


  },
  mounted() {

    this.$el.classList.add('component-dialog');
    if (this.toBody === false) {
      console.log('toBody');
    } else {
      document.body.appendChild(this.$el);
    }

















    this.$el.addEventListener("mousedown", function (event) {
      // alert("Mouse button pressed!");
      // 在这里可以添加处理逻辑

      // event.stopPropagation()
      // event.preventDefault()
      // console.log('点击事件');
    });
    // this.$el.addEventListener("mouseup", (event) => {
    //   // alert("Mouse button pressed!");
    //   // 在这里可以添加处理逻辑

    //   // event.stopPropagation()
    //   // event.preventDefault()

    //   this.$nextTick(() => {
    //     // this.showing()
    //   })


    //   // setTimeout(() => {
    //   //   this.element.data.show = true
    //   // }, 10);

    // });

  },
  methods: {
    showing() {

      $(this.$el).find('.el-dialog').css('position', 'absolute');
      const component = this.element.component === 'Group' ? $(this.$el).find('.group.component') : $(this.$el).find('.el-dialog>.el-dialog__body>div>.component')
      component.css('width', '100%');
      component.css('height', '100%');


      const align = this.element.data.dialogAlign || 'center'
      let left = 0
      let top = 0
      if (!left)
        left = '0px'
      if (!top)
        top = '0px'
      left = left.trim()
      top = top.trim()

      function isNumeric(str) {
        return /^(\d|\.)+$/.test(str);
      }

      if (isNumeric(left))
        left += 'px'
      if (isNumeric(top))
        top += 'px'

      const clientWidth = document.body.clientWidth
      const clientHeight = document.body.clientHeight
      const shape = $(this.$el).find('.shape')
      const shapeHeight = shape.height()
      const shapeWidth = shape.width()
      const rotate = this.element.style.rotate;

      if (!align.includes('|') && align.includes('center')) {
        // 居中
        const leftMove = ((clientWidth - shapeWidth) / 2) - parseFloat(shape.css('left'));
        const topMove = ((clientHeight - shapeHeight) / 2) - parseFloat(shape.css('top'))
        shape.css('transform', `translateX(${leftMove}px) translateY(${topMove}px) rotate(${rotate}deg)`)
      } else if ((!align.includes('|') && align.includes('left')) || (align.includes('|') && align.includes('center') && align.includes('left'))) {
        // 左对齐,上下居中
        const topMove = ((clientHeight - shapeHeight) / 2) - parseFloat(shape.css('top'))
        shape.css('transform', `translateX(${left}) translateY(${topMove}px) rotate(${rotate}deg)`)
      } else if ((!align.includes('|') && align.includes('top')) || (align.includes('|') && align.includes('center') && align.includes('top'))) {
        // 左右居中,顶部对齐
        const leftMove = ((clientWidth - shapeWidth) / 2) - parseFloat(shape.css('left'));
        shape.css('transform', `translateX(${leftMove}px) translateY(${top}) rotate(${rotate}deg)`)
      } else if (align.includes('|') && align.includes('left') && align.includes('top')) {
        shape.css('transform', `translateX(${left}px) translateY(${top}) rotate(${rotate}deg)`)
      } else {
        shape.css('transform', `translateX(${0}px) translateY(${0}px) rotate(${rotate}deg)`)
      }

      console.log('足迹的', shape.css('transform'));

      if (location.href.includes('/editor')) {

      } else if (location.href.includes('/viewer')) {

      }
    }
  },
  watch: {
    visible: {
      handler: function (val) {

        this.$nextTick(() => {

        });
      },
      deep: true,
      immediate: true,
    },
  },
});
