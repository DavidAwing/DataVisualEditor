<template>
  <div id="codeEditing" class="test2">
    <div class="CN_WebEditor">
      <div class="left">
        <div class="head">
          <!-- 选择代码类型 -->
          <div>
            语言类型：
            <select id="aa" @change="modifyLanguageType">
              <option :value="0">--请选择语言类型--</option>
              <option
                v-for="(value, index) in modesIds"
                :key="index"
                :value="value"
              >
                {{ value }}
              </option>
            </select>
          </div>
          <!-- / 选择代码类型 -->

          <!-- 点击运行 PS:这里运行代码需要后端配置处理按照自己需求进行修改 -->
          <button @click="submitA">点击运行</button>
          <!-- / 点击运行 -->
        </div>
        <div class="content">
          <!-- 代码编辑器 -->
          <div id="container"></div>
          <!-- / 代码编辑器 -->
        </div>
      </div>
      <div class="right">
        <div class="head">
          <h3>运行结果：</h3>
        </div>
        <div id="abc" class="content"></div>
      </div>
    </div>

    <button @click="submitCode">提交</button>
  </div>
</template>

<script>
import * as monaco from 'monaco-editor'
export default {

  props: {
    callback1: {
      type: Function, // 定义传递的数据类型
      required: true, // 必填
    }
  },

  /**
   * 数据
   */
  data() {
    return {
      editor: null, // 文本编辑器
      modesIds: null, // 语言列表
      oldValue: '', // 保存后的文本
      languageType: 0, // 语言类型
      operationResult: '', // 运行结果
    }
  },

  /**
   * mounted 钩子函数
   */
  mounted() {
    this.initEditor() // 初始化网页代码编辑器
  },

  /**
   * 方法
   */
  methods: {

    /* 提交代码 */
    submitCode() {
      this.saveEditor() // 更新代码数据
      this.callback1({'type':this.languageType, 'code':this.oldValue}) // 给使用他的父组件返回代码
    },

    /* 提交按钮 */
    async submitA() {
      this.saveEditor() // 更新代码数据

      console.log(`type:${this.languageType}, code:${this.oldValue}`)

      // 判断用户是否选择了语言
      if (this.languageType === 0) return alert('请选择代码类型')

      // 问一下用户是否运行 为了防止用户频繁点击 也可以做一个节流阀
      if (!window.confirm('确定运行吗?')) return

      /* 使用 fetch发起请求 这里的请求方式按照自己的需求进行变动 一般都是使用 axios 不过我为了翻遍直接用的 fetch 内置API */
      //#region
      try {
        // 使用 fetch 请求接口
        const data = await fetch(`/test/compile/compile`, {
          // 传递方式
          method: 'POST',

          // 传递数据
          body: JSON.stringify({
            type: this.languageType,
            code: this.oldValue,
          }),

          // 设置请求头
          headers: {
            Authorization:
              'Bearer eyJhbGciOiJIUzUxMiJ9.eyJsb2dpbl91c2VyX2tleSI6IjlhMjg4ZGQ1LTQ0MzMtNDFlMi1iOTA3LWYzZTBiOWMzODBiYyJ9.uoRHNVzIUdmLDMpPgkN0ZAKFt5TAg-NtEX_YXUyqk7NXwO_7PJIA8peodrlpYhk-9ax2BrVp9G_7S1a3woXojg',
              'Content-Type': 'application/json ',
          },
        })

        // 结构返回的结果
        const { msg } = await data.json()

        // 打印 结果
        console.log(brdata)

        document.querySelector('#abc').innerHTML = msg

        // console.log(str)
      } catch (error) {
        // 用来捕捉错误并且处理错误 防止程序崩溃
        // 输出错误
        console.log(error)
      }
      //#endregion
    },

    /* 修改语言类型 */
    modifyLanguageType(e) {
      this.languageType = e.target.value // 获取到的 语言id 赋值给本地

      var oldModel = this.editor.getModel() // 获取旧模型

      var value = this.editor.getValue() // 获取旧的文本

      /* modesIds即为支持语言 var modesIds = monaco.languages.getLanguages().map(function(lang) { return lang.id; }); */
      var newModel = monaco.editor.createModel(value, this.languageType)

      // 销毁旧模板
      if (oldModel) {
        oldModel.dispose()
      }

      // 设置新模型
      this.editor.setModel(newModel)
    },

    /* 初始化网页代码编辑器 */
    initEditor() {
      // 代码 ID 栗子：['java', 'javascript']; java || javascript 称为 id 下面操作获取全部
      var modesIds = monaco.languages.getLanguages().map(function (lang) {
        return lang.id
      })

      this.modesIds = modesIds

      // 初始化编辑器，确保dom已经渲染
      this.editor = monaco.editor.create(document.getElementById('container'), {
        value: '', // 编辑器初始显示文字

        language: 'plaintext', // 语言支持自行查阅demo

        theme: 'vs-dark', // 官方自带三种主题vs, hc-black, or vs-dark

        selectOnLineNumbers: true, // 显示行号

        roundedSelection: false,

        readOnly: false, // 只读

        cursorStyle: 'line', // 光标样式

        automaticLayout: false, // 自动布局

        glyphMargin: true, // 字形边距

        useTabStops: false,

        fontSize: 20, // 字体大小

        autoIndent: true, // 自动缩进

        quickSuggestionsDelay: 500, // 代码提示延时
      })
    },

    /* 获取编辑器内容 */
    getValue() {
      this.editor.getValue() // 获取编辑器中的文本
    },

    /* 保存编辑器状态修改 */
    saveEditor() {
      this.oldValue = this.editor.getValue()
    },
  },
}
</script>

<style lang="less" scoped>
/* 宽高按照需求自定义 */
#container {
  width: 100%;
  height: 500px;
}

.CN_WebEditor {
  width: 100%;
  height: 500px;
  overflow: hidden;

  display: flex;
  align-items: center;

  .left {
    width: 50%;
    height: 100%;
    margin-right: 15px;
    border: 1px solid #ccc;
    background-color: #2c3e50;

    overflow: hidden;

    .head {
      height: 50px;
      background-color: #eee;

      padding: 0 15px;

      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }

  .right {
    width: 50%;
    height: 100%;
    background-color: #333;
    overflow: hidden;
    border: 1px solid #ccc;

    .head {
      height: 50px;
      background-color: #eee;

      padding: 0 15px;

      display: flex;
      align-items: center;

      h3 {
        margin: 0;
        padding: 0;
      }
    }

    .content {
      color: white;
      padding: 15px;
    }
  }
}

.container{
  position: relative;
  display: flex;
  justify-content: flex-start;
  align-items: self-start;

}



/deep/ .view-line {
  /* display: flex; */
  /* justify-content: flex-start; */
  /* align-items: flex-start; */
}

</style>
