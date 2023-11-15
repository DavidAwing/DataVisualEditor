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
  import { autocompletion, snippetCompletion, completeFromList, completionKeymap, ifNotIn } from '@codemirror/autocomplete';
  // Uses linter.mjs
  import * as eslint from 'eslint-linter-browserify';
  const { js_beautify } = require('js-beautify');
  import { stringToFunction } from '../../utils/compiler.ts';

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
        console.log('输入', context);
        let word = context.matchBefore(/\w*/);
        if (word.from == word.to && !context.explicit) return null;
        return {
          from: word.from,
          options: [
            { label: 'match', type: 'keyword' },
            { label: 'hello', type: 'variable', info: '(World)' },
            { label: 'magic', type: 'text', apply: '// ⠁⭒*.✩.*⭒⠁', detail: '星星符号' },
            { label: 'log', type: 'text', apply: 'console.log(\'\')', detail: 'log' },
          ],
        };
      }

      function moveToLine(view) {
        let line = prompt("跳转到哪一行?")
        if (!/^\d+$/.test(line) || +line <= 0 || +line > view.state.doc.lines)
          return false
        let pos = view.state.doc.line(+line).from
        view.dispatch({ selection: { anchor: pos }, userEvent: "select" })
        return true
      }

      const view = new EditorView({
        parent: this.$refs.editor,
        handleTab: true,
        // doc: "console.log('hello');\n",
        extensions: [
          // autocompletion({ override: [myCompletions] }),
          keymap.of([{ key: "Alt-l", run: moveToLine }]),
          basicSetup,
          javascript(),
          javascriptLanguage.data.of({ autocomplete: scopeCompletionSource(globalThis) }),
          javascriptLanguage.data.of({
            autocomplete: myCompletions,
          }),


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
    },
    beforeDestroy() {
      this.view.destroy();
    },
    methods: {
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
      getCode() {
        const options = {
          max_preserve_newlines: 2,
        };
        return js_beautify(this.code, options);
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
