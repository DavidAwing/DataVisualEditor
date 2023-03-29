<template>
  <div class="code-container" ref="container"></div>
</template>

<script>
  import * as monaco from "monaco-editor";

  let keywords =
    `ADD EXCEPT PERCENT ALL EXEC PLAN ALTER EXECUTE PRECISION AND EXISTS PRIMARY ANY \
    EXIT PRINT AS FETCH PROC ASC FILE PROCEDURE AUTHORIZATION FILLFACTOR PUBLIC BACKUP \
    FOR RAISERROR BEGIN FOREIGN READ BETWEEN FREETEXT READTEXT BREAK FREETEXTTABLE \
    RECONFIGURE BROWSE FROM REFERENCES BULK FULL REPLICATION BY FUNCTION RESTORE CASCADE \
    GOTO RESTRICT CASE GRANT RETURN CHECK GROUP REVOKE CHECKPOINT HAVING RIGHT CLOSE \
    HOLDLOCK ROLLBACK CLUSTERED IDENTITY ROWCOUNT COALESCE IDENTITY_INSERT ROWGUIDCOL \
    COLLATE IDENTITYCOL RULE COLUMN IF SAVE COMMIT IN SCHEMA COMPUTE INDEX SELECT \
    CONSTRAINT INNER SESSION_USER CONTAINS INSERT SET CONTAINSTABLE INTERSECT SETUSER \
    CONTINUE INTO SHUTDOWN CONVERT IS SOME CREATE JOIN STATISTICS CROSS KEY SYSTEM_USER \
    CURRENT KILL TABLE CURRENT_DATE LEFT TEXTSIZE CURRENT_TIME LIKE THEN CURRENT_TIMESTAMP \
    LINENO TO CURRENT_USER LOAD TOP CURSOR NATIONAL TRAN DATABASE NOCHECK TRANSACTION \
    DBCC NONCLUSTERED TRIGGER DEALLOCATE NOT TRUNCATE DECLARE NULL TSEQUAL DEFAULT NULLIF \
    UNION DELETE OF UNIQUE DENY OFF UPDATE DESC OFFSETS UPDATETEXT DISK ON USE DISTINCT \
    OPEN USER DISTRIBUTED OPENDATASOURCE VALUES DOUBLE OPENQUERY VARYING DROP OPENROWSET \
    VIEW DUMMY OPENXML WAITFOR DUMP OPTION WHEN ELSE OR WHERE END ORDER WHILE ERRLVL \
    OUTER WITH ESCAPE OVER WRITETEXT`;

  export default {
    name: "SqlEditor",
    props: {
      options: {
        type: Object,
        default() {
          return {
            language: "sql", // shell、sql、python
            readOnly: true, // 不能编辑
            tableNameKeys: [],
            fieldNameKeys: []
          };
        }
      },
      value: {
        type: String,
        default: ""
      }
    },
    data() {
      return {
        monacoInstance: null,
        provider: null,
        hints: [
          "SELECT",
        ]
      }
    },
    created() {
      this.initHints();
    },
    mounted() {
      this.init();
    },
    beforeDestroy() {
      this.dispose();
    },
    computed: {
      tableNameKeys() {
        return this.options.tableNameKeys
      },
      fieldNameKeys() {
        return this.options.fieldNameKeys
      }
    },
    watch: {
      tableNameKeys: {
        handler(val) {
          this.initHints()
        },
        deep: true
      },
      fieldNameKeys: {
        handler(val) {
          this.initHints()
        },
        deep: true
      }
    },
    methods: {
      dispose() {
        if (this.monacoInstance) {
          if (this.monacoInstance.getModel()) {
            this.monacoInstance.getModel().dispose();
          }
          this.monacoInstance.dispose();
          this.monacoInstance = null;
          if (this.provider) {
            this.provider.dispose();
            this.provider = null
          }
        }
      },
      initHints() {

        if (!this.tableNameKeys)
          this.tableNameKeys = []
        if (!this.fieldNameKeys)
          this.fieldNameKeys = []
        this.hints = Array.from(new Set([...this.hints, ...keywords.split(" "), ...this.tableNameKeys, ...this.fieldNameKeys])).sort();
      },
      init() {
        let that = this;
        this.dispose();
        let createCompleters = textUntilPosition => {
          //过滤特殊字符
          let _textUntilPosition = textUntilPosition
            .replace(/[\*\[\]@\$\(\)]/g, "")
            .replace(/(\s+|\.)/g, " ");
          //切割成数组
          let arr = _textUntilPosition.split(" ");
          //取当前输入值
          let activeStr = arr[arr.length - 1];
          //获得输入值的长度
          let len = activeStr.length;

          //获得编辑区域内已经存在的内容
          let rexp = new RegExp('([^\\w]|^)' + activeStr + '\\w*', "gim");
          let match = that.value.match(rexp);
          let _hints = !match ? [] : match.map(ele => {
            let rexp = new RegExp(activeStr, "gim");
            let search = ele.search(rexp);
            return ele.substr(search)
          })

          //查找匹配当前输入值的元素
          let hints = Array.from(new Set([...that.hints, ..._hints])).sort().filter(ele => {
            let rexp = new RegExp(ele.substr(0, len), "gim");
            return match && match.length === 1 && ele === activeStr || ele.length === 1
              ? false
              : activeStr.match(rexp);
          });
          //添加内容提示
          let res = hints.map(ele => {
            return {
              label: ele,
              kind: that.hints.indexOf(ele) > -1 ? monaco.languages.CompletionItemKind.Keyword : monaco.languages.CompletionItemKind.Text,
              documentation: ele,
              insertText: ele
            };
          });
          return res;
        };
        this.provider = monaco.languages.registerCompletionItemProvider("sql", {
          provideCompletionItems(model, position) {
            var textUntilPosition = model.getValueInRange({
              startLineNumber: position.lineNumber,
              startColumn: 1,
              endLineNumber: position.lineNumber,
              endColumn: position.column
            });
            var suggestions = createCompleters(textUntilPosition);
            return {
              suggestions: suggestions
            };

            return createCompleters(textUntilPosition);
          }
        });

        const theme = {
          base: 'vs',
          inherit: true,
          colors: {
            'editor.lineHighlightBackground': '#f00', // 选择行的背景
            'editorLineNumber.foreground': '#f00',
            'editor.inactiveSelectionBackground': '#FF0000',
            'editor.selectionBackground': '#ff0000',
            'editor.monaco-mouse-cursor-text': '#ff0000',
            "editor.background": '#f00'  // 编辑框背景
          },
          rules: [
            { token: 'custom-info', foreground: 'a3a7a9', background: 'ffffff' },
            { token: 'custom-error', foreground: 'ee4444' },
            { token: 'custom-notice', foreground: '1055af' },
            { token: 'custom-date', foreground: '20aa20' },
          ]
        }
        monaco.editor.defineTheme('myTheme', theme)

        // 初始化编辑器实例
        this.monacoInstance = monaco.editor.create(this.$refs["container"], {
          value: this.value,
          autoIndex: true,
          theme: "vs",  //  vs, hc-black, vs-dark, 或者自定义样式: myTheme
          fontSize: 14,
          minimap: { enabled: false }, // 关闭右边预览
          lineNumbers: false, // 显示行号
          // 下面4个选项关闭调试列
          glyphMargin: false,
          folding: false,
          lineDecorationsWidth: 0,
          lineNumbersMinChars: 0,
          ...this.options
        });

        console.log("编辑器", this.monacoInstance);

        // 监听编辑器content变化事件
        this.monacoInstance.onDidChangeModelContent(() => {

          let content = this.monacoInstance.getValue()

          if (content.toLowerCase().endsWith('select ')) {
            console.log('显示字段名称');
          } else if (content.toLowerCase().endsWith('from ')) {
            console.log('显示表名称');
          }

          this.$emit("contentChange", content);
        });

        // 光标位置改变
        this.monacoInstance.onDidChangeCursorPosition((e) => {
          console.log('光标位置', e)
          this.$emit("cursorPositionChange", e);
        })

        this.monacoInstance.onDidChangeCursorSelection((e) => {
          console.log('光标选择文本', this.monacoInstance.getModel().getValueInRange(this.monacoInstance.getSelection()))
          this.$emit("cursorSelectionChange", this.monacoInstance.getModel().getValueInRange(this.monacoInstance.getSelection()));
        })

      }
    }
  };
</script>

<style lang="less" scope>
  .code-container {
    width: 100%;
    height: 100%;
    overflow: hidden;
    border: 1px solid #eaeaea;
    text-align: left;
    white-space: nowrap;
  }

  .code-container .monaco-editor .scroll-decoration {
    box-shadow: none;
  }

  /* .monaco-list-row{
    display: flex !important;
    flex-flow: row nowrap !important;
    color: red !important;
  }

  .monaco-list-row .contents .main .suggest-icon{
    display: none;
  } */
</style>
