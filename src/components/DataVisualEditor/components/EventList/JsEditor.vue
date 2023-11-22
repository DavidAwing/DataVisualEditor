<template>
  <div class="container">
    <div ref="editor" class="editor" :style="editorStyle"></div>
  </div>
</template>

<script>
  import { keymap, ViewPlugin, ViewUpdate } from '@codemirror/view';
  import { EditorState, StateEffect, StateEffectSpec } from '@codemirror/state';
  import { EditorView, basicSetup } from 'codemirror';
  import { json } from '@codemirror/lang-json';
  import { themesMap } from './editor-helper';
  import { foldGutter } from '@codemirror/language';
  import { javascript, esLint, javascriptLanguage, scopeCompletionSource } from '@codemirror/lang-javascript';
  import { linter, lintGutter } from '@codemirror/lint';
  import { oneDark } from '@codemirror/theme-one-dark';
  import { autocompletion, snippetCompletion, completeFromList, completionKeymap, ifNotIn, completionStatus, acceptCompletion } from '@codemirror/autocomplete';
  // Uses linter.mjs
  import * as eslint from 'eslint-linter-browserify';
  const { js_beautify } = require('js-beautify');
  import { stringToFunction } from '../../utils/compiler.ts';
  import { indentWithTab, insertTab } from "@codemirror/commands"
  import { syntaxTree } from "@codemirror/language"
  const config = {
    // eslint configuration
    parserOptions: {
      ecmaVersion: 2019,
      sourceType: 'module',
    },
    env: {
      browser: true,
      node: true,
    },
    rules: {
      semi: ['error', 'never'],
    },
  };

  export default {
    name: 'JsEditor',
    props: {
      doc: { type: String, default: '' },
      themeName: { type: String, default: 'dark' },
      editorStyle: {
        type: Object,
        default: () => ({ width: '100%', height: '100%' }),
      },
    },
    data() {
      return {
        editor: null,
        view: undefined,
        code: '',
      };
    },
    computed: {
      docText() {
        if (!this.view || !this.view.state || !this.view.state.doc || !this.view.state.doc.text) return null;
        return this.view.state.doc.text;
      },
    },
    watch: {
      docText(val) {
      },
    },
    mounted() {
      const _state = this.createState(this.doc, javascript(), themesMap[this.themeName]);

      const myEffect = StateEffect.define({
        map: (value, prevValue, state) => {
          // 处理代码修改的逻辑
          console.log('Code modified');
          return true; // 返回 true 表示继续应用此修改
        },
      });

      function myCompletions(context) {
        let word = context.matchBefore(/\w*/);
        if (word.from == word.to && !context.explicit) return null;
        return {
          from: word.from,
          options: [
            { label: 'await', type: 'text', apply: 'await' },
            { label: 'async', type: 'text', apply: 'async' },
            { label: 'match', type: 'keyword' },
            { label: 'hello', type: 'variable', info: '(World)' },
            { label: 'magic', type: 'text', apply: '// ⠁⭒*.✩.*⭒⠁', detail: '星星符号' },
            { label: 'log', type: 'text', apply: 'console.log(\'\')', detail: 'log' },
          ],
        };
      }

      function myCompletions2({ state, pos }) {
        const token = state.tokenAt(pos);
        if (token.type.name === 'property' && token.from > 1) {
          const objectName = state.sliceDoc(0, token.from);
          if (objectName === 'f.') {
            return {
              from: token.from,
              to: token.to,
              options: [
                { label: 'logName', type: 'method', info: 'Logs the name.' },
                // Add more suggestions as needed
              ],
            };
          }
        }
        return null;
      }

      const tagOptions = [
        "constructor", "deprecated", "link", "param", "returns", "type"
      ].map(tag => ({ label: "@" + tag, type: "keyword" }))

      function completeJSDoc(context) {
        let nodeBefore = syntaxTree(context.state).resolveInner(context.pos, -1)
        if (nodeBefore.name != "BlockComment" ||
          context.state.sliceDoc(nodeBefore.from, nodeBefore.from + 3) != "/**")
          return null
        let textBefore = context.state.sliceDoc(nodeBefore.from, context.pos)
        let tagBefore = /@\w*$/.exec(textBefore)
        if (!tagBefore && !context.explicit) return null
        return {
          from: tagBefore ? nodeBefore.from + tagBefore.index : context.pos,
          options: tagOptions,
          validFor: /^(@\w*)?$/
        }
      }


      function moveToLine(view) {
        let line = prompt("跳转到哪一行?")
        if (!/^\d+$/.test(line) || +line <= 0 || +line > view.state.doc.lines)
          return false
        let pos = view.state.doc.line(+line).from
        view.dispatch({ selection: { anchor: pos }, userEvent: "select" })
        return true
      }

      console.log('completionStatus, acceptCompletion', completionStatus, acceptCompletion);

      function indentLess(state, dispatch) {
        // 在这里添加减小缩进的逻辑
        console.log('Indent Less', state, dispatch);

        return true;
      }

      const view = new EditorView({
        parent: this.$refs.editor,
        handleTab: true,
        // doc: "console.log('hello');\n",
        extensions: [
          // autocompletion({ override: [myCompletions] }),
          keymap.of([{ key: "Alt-l", run: moveToLine }]),
          // keymap.of([indentWithTab]),
          basicSetup,
          javascript(),
          javascriptLanguage.data.of({ autocomplete: scopeCompletionSource(globalThis) }),
          javascriptLanguage.data.of({
            autocomplete: myCompletions,
          }),
          javascriptLanguage.data.of({
            autocomplete: completeJSDoc
          }),
          keymap.of([
            {
              key: 'Tab',
              preventDefault: true,
              shift: indentLess,
              run: e => {
                if (!completionStatus(e.state)) {
                  insertTab(view);
                  // return indentMore(e);
                  return acceptCompletion(e)
                }
                return acceptCompletion(e);
              },
            },
          ]),

          // lintGutter(),
          // eslint-disable-next-line
          linter(esLint(new eslint.Linter(), config)),
          EditorView.updateListener.of(v => {
            this.code = v.state.doc.toString();
            //监测得到的最新代码
            // console.log('监测得到的最新代码', v.state.doc.toString());
          }),
        ],
      });

      this.view = view;

      document.querySelectorAll('.cm-gutter.cm-foldGutter').forEach(el => {
        el.remove();
      });

      // 点击行号事件
      document.querySelector(".event-list .cm-lineNumbers").addEventListener('mousedown', function (event) {

        if (event.target.className.includes('cm-lineNumbers'))
          return

        return

        const lineNumber = parseInt(event.target.offsetTop / parseFloat(event.target.style.height))
        // 处理你的逻辑
        console.log('Clicked on line number:', event.target.textContent);
        if (event.target.style.cssText.includes('red')) {
          event.target.style.cssText = 'height: 19.6px; cursor: pointer;'
        } else {
          event.target.style.cssText = 'height: 19.6px; cursor: pointer; background: red'
        }
      })

      // 鼠标在行号上显示为手型
      document.querySelector(".event-list .cm-lineNumbers").addEventListener('mouseover', function (event) {
        event.target.style.cursor = 'pointer'
      })

    },
    beforeDestroy() {
      this.view.destroy();
    },
    methods: {
      getSelectedCode() {
        const { from, to } = this.view.state.selection.main;
        const selectedCode = this.view.state.doc.sliceString(from, to);
        return selectedCode
      },
      createState(value, language, theme) {
        const _foldGutter = foldGutter({ openText: '收起', closedText: '展开' });
        const _extensions = [language, theme, _foldGutter, EditorView.lineWrapping, ...basicSetup];

        return EditorState.create({
          doc: value,
          extensions: _extensions,
        });
      },
      updateDoc(newDoc) {
        if ((newDoc.startsWith('"') && newDoc.endsWith('"')) || (newDoc.startsWith("'") && newDoc.endsWith("'")))
          newDoc = newDoc.substring(1, newDoc.length - 1);
        newDoc = newDoc.replace(/\\n/g, '\n');
        newDoc = newDoc.replace(/\\"/g, '"');
        const transaction = this.view.state.update({
          changes: { from: 0, to: this.view.state.doc.length, insert: newDoc },
        });
        this.view.dispatch(transaction);
      },
      jsBeautify() {
        const options = {
          max_preserve_newlines: 4,
        };
        return js_beautify(this.code, options)
      },
      getCode() {
        return this.code
      },
    },
  };
</script>
<style scoped>
  /deep/ .editor .cm-editor {
    border: solid 1px wheat;
    border-radius: 0.2rem;
    overflow: hidden;
    height: 100%;
    width: 100%;
    min-height: 230px;
    max-height: 100%;
    min-width: 100%;
    max-width: 100%;
    resize: both;
    font-size: 14px;
    font-variant-numeric: tabular-nums;
    font-family: 'Consolas, "Courier New", monospace';
    text-align: left;
  }

  .container {
    width: 100%;
    height: 100%;
  }

  /deep/ .cm-editor {
    resize: none !important;
  }
</style>
