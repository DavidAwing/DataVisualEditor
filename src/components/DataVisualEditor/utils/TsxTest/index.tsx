import { Component, Prop } from "vue-property-decorator";
import { Component as tsc } from "vue-tsx-support";
import Button, { ButtonType, ButtonSize } from "./button";

interface IContainerProps {
  name?: string;
}

@Component
export default class Container extends tsc<IContainerProps> {
  @Prop() public name!: string;

  protected render(createElement: any) {
    console.log("渲染函数测试", createElement);
    // return createElement('div', {}, ['<em>test1</em>'])
    // return createElement('div', {}, [createElement('em', {}, 'test2')])
    // return createElement(
    //   'div',
    //   {
    //     domProps: {
    //       innerHTML: '<em>test3</em>'
    //     }
    //   },
    //   []
    // )

    return (
      <div>
        <p>container Name:{this.name}</p>
        <p>{this.$slots.default}</p>
        <p>
          button:
          <Button num={9} type={ButtonType.primary} size={ButtonSize.large} />
        </p>
      </div>
    );
  }
}
