import Vue, { VNode } from 'vue'

declare global {
  namespace JSX {
    interface Element extends VNode { }
    interface ElementClass extends Vue { }
    interface IntrinsicElements {
      [elem: string]: any
    }
  }

  interface Window {
    __wxjs_environment: any;
    WebViewJavascriptBridge: any;
    _czc: any;
  }

}
