<template>
  <div class="event-list">
    <div class="div-events">
      <el-button @click="isShowEvent = true">添加事件</el-button>
      <div>
        <el-tag v-for="event in Object.keys(curComponent.events)" :key="event" closable @close="removeEvent(event)"
          @click="showEventDialog($event)" class="event-tag">
          <span>{{ event }}</span>
        </el-tag>
      </div>
    </div>
    <!-- 选择事件 -->
    <Modal v-model="isShowEvent">


      <div style="height: 100%; display: flex; flex-flow: column nowrap; ">
        <div style="
            display: flex;
            flex-flow: row nowrap;
            justify-content: flex-start;
            align-items: center;
            padding-top: 8px;
          ">
          <div style="margin-left: 8px">事件列表:</div>
          <el-select v-model="selectedEvent" placeholder="请选择事件"
            style="margin-left: 8px;  margin-right: 8px;width: 160px;">
            <template v-for="item in eventOptions">
              <el-option :label="item.label" :value="item.value" :key="item.value"></el-option>
            </template>
          </el-select>
          <!-- <el-button type="primary" plain @click="curComponent.events[selectedEvent] = $refs.jsEditor.jsBeautify()">格式化</el-button> -->
          <el-button type="primary" plain @click="runCode">运行</el-button>
          <el-button type="primary" plain>搜索</el-button>
        </div>

        <div style="margin: 8px 8px;  flex: 1; overflow-y: hidden">
          <!-- <button @click="changeDb">修改数据库</button> -->
          <js-editor ref="jsEditor" />
          <!-- <json-editor ref="jsonEditor" v-model="jsonValue" /> -->
          <!-- <highlightjs language="javascript" :code="selectedEventCode"></highlightjs> -->
          <!-- <el-input v-model="selectedEventCode" type="textarea" placeholder="请输入事件代码" rows="30" @keydown.native.stop /> -->
        </div>

        <el-button v-if="false" type="primary"
          style="margin-bottom: 10px; margin-top: 10px; margin-left: 40%; margin-right: 40%"
          @click="setEvent">设置</el-button>
      </div>

      <el-tabs v-model="eventActiveName" v-if="false">
        <el-tab-pane v-for="item in eventList" :key="item.key" :label="item.label" :name="item.key"
          style="padding: 0 20px">
          <el-input v-if="item.key == 'redirect'" v-model="item.param" type="textarea" placeholder="请输入完整的 URL"
            @keydown.native.stop />
          <el-input v-if="item.key == 'alert'" v-model="item.param" type="textarea" placeholder="请输入要 alert 的内容"
            @keydown.native.stop />
          <el-button style="margin-top: 20px" @click="addEvent(item.key, item.param)">确定</el-button>
        </el-tab-pane>
      </el-tabs>
    </Modal>

    <el-dialog title="代码运行控制台" :visible.sync="runCodeDialogVisible">
      <div>
        <el-input type="textarea" :rows="30" placeholder="" v-model="codeRunData">
        </el-input>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import Modal from '../Modal';
  import { eventList } from '../../utils/events';
  import CodeViewer from './CodeViewer.vue';

  import SqlEditor from './SqlEditor';
  import JsEditor from './JsEditor';
  import JsonEditor from './JsonEditor';
  import { stringToFunction, CompileSourcecode, CompileToModule, CompileTypescriptToIIFE } from '../../utils/compiler.ts';
  import { parse, stringify, toJSON, fromJSON } from 'flatted';


  const JSONfn = require('jsonfn').JSONfn;

  const jsonData = 'select 1;\n' + 'select approx_count_distinct(t2.col2_1) from default.table2 as t2;';
  const schema = {
    'hue.table1': [
      { label: 'col1_1', detail: '字段11' },
      { label: 'col1_2', detail: '字段12' },
    ],
    'default.table2': [
      { label: 'col2_1', detail: '字段21' },
      { label: 'col2_2', detail: '字段22' },
    ],
    'default.table3': [
      { label: 'col3_1', detail: '字段31' },
      { label: 'col3_2', detail: '字段32' },
    ],
  };
  const dbInfo1 = {
    schema: schema,
    defaultSchema: 'hue',
    defaultTable: 'table1',
  };

  export default {
    components: { Modal, CodeViewer, SqlEditor, JsonEditor, JsEditor },
    data() {
      return {
        isShowEvent: false,
        eventURL: '',
        eventActiveName: 'redirect',
        eventList,
        selectedEvent: null,
        dbInfo: dbInfo1,
        value: jsonData.toString(),
        jsonValue: JSON.stringify(dbInfo1, null, '\t'),
        runCodeDialogVisible: false,
        codeRunData: ''
      };
    },
    computed: {
      ...mapState(['curComponent']),
      eventOptions() {
        return this.curComponent.eventOptions;
      },
      selectedEventCode: {
        get() {
          if (!this.selectedEvent) return '';
          const event = this.curComponent.events[this.selectedEvent];
          if (!event) {
            //           return JSONfn.stringify(`function ${this.selectedEvent}(param) {

            //     const component = param.component;
            //     const event = param.event;
            //     const element = param.element;
            //     console.log("组件${this.selectedEvent}事件", component, event, element);

            // }`);

            return `const component = param.component\nconst data = param.data\nconst element = param.element\nconsole.log("组件${this.selectedEvent}事件", component, data, element)`;
          }

          // return JSONfn.stringify(event).replace(/^("*)function\s+anonymous\(/, `"function ${this.selectedEvent}(`);
          return event;
        },
        set(newValue) {
          this.curComponent.events[this.selectedEvent] = newValue;
        },
      },
    },
    watch: {
      selectedEventCode() {
        if (!this.$refs.jsEditor) return;
        this.$refs.jsEditor.updateDoc(this.selectedEventCode);
      },
      isShowEvent() {
        if (this.isShowEvent) {
          this.selectedEvent = null;
        } else {
          this.setEvent()
        }

      },
    },
    created() {
      this.$nextTick(() => {
        // this.$refs.jsonEditor.updateDoc(this.jsonValue)
      });
    },
    mounted() {
    },
    methods: {
      async runCode() {

        const code = this.$refs.jsEditor.getSelectedCode()
        if (!code || !code.trim()) {
          toast('请选取需要运行的代码')
          return
        }
        this.runCodeDialogVisible = true
        this.codeRunData = ''
        const overrideConsoleLog = () => {
          const consoleLog = console.log;
          console.log = (...args) => {
            // const logOutput = args.map(arg => stringify(arg)).join(' ');
            args.forEach(arg => {
              try {
                this.codeRunData += JSONfn.stringify(arg) + '  '
              } catch (error) {
                this.codeRunData += `---------- 异常 ----------\nname: ${error.name}\nmessage: ${error.message}\nmessage: ${error.stack}\narg:${arg}\n\n`
              }
            })
            this.codeRunData += '\n'
            consoleLog.apply(console, args);
          };
          return consoleLog
        }

        if (location.href.includes('/editor')) {
          const log = window.log
          window.log = (...args) => {
            args.forEach(arg => {
              try {
                this.codeRunData += JSONfn.stringify(arg) + '  '
              } catch (error) {
                this.codeRunData += `\n⭒----------⭒*.✩.*⭒ log异常 ⭒*.✩.*⭒----------👇\nname: ${error.name}\nmessage: ${error.message}\nstack: ${error.stack}\n\n`
              }
            })
            this.codeRunData += '\n'
          }
        }

        try {
          let result = null
          const list = code.split('\n').filter(line => line.trim()).map(line => line.includes('//') ? line.substring(0, line.indexOf('//')) : line)
          if (code.includes('await ')) {
            const lastLine = list[list.length - 1].trim()
            list[list.length - 1] = (lastLine.startsWith('return ')
              || lastLine.startsWith('var')
              || lastLine.startsWith('const')
              || lastLine.startsWith('let')
              || lastLine.startsWith(')')
              || lastLine.startsWith('(')
              || lastLine.startsWith('}')
              || lastLine.startsWith('{')
              || lastLine.startsWith('||')
              || lastLine.startsWith('&&')
              || lastLine.startsWith('=')
              || lastLine.startsWith('!=')
            ) ? lastLine : 'return ' + lastLine
            result = await eval(`(async () => { ${list.join('\n')} })()`);
          } else {
            result = eval(list.join('\n'));
          }
          this.codeRunData += JSONfn.stringify(result) + '\n'
        } catch (error) {
          this.codeRunData += `\n⭒----------⭒*.✩.*⭒ 代码解析异常 ⭒*.✩.*⭒----------👇\nname: ${error.name}\nmessage: ${error.message}\nstack: ${error.stack}\n\n`
        } finally {
          setTimeout(() => {
            window.log = log
          }, 300);
        }

      },

      addEvent(event, param) {
        this.isShowEvent = false;
        this.$store.commit('addEvent', { event, param });
      },

      removeEvent(event) {
        this.$store.commit('removeEvent', event);
      },

      setEvent() {
        if (!this.selectedEvent) {
          console.log('没有选择事件');
          return;
        }

        const code = this.$refs.jsEditor.getCode();
        try {
          const func = stringToFunction(code);
          this.curComponent.events[this.selectedEvent] = func;
        } catch (error) {
          this.curComponent.events[this.selectedEvent] = code;
          bi.debug('脚本编译发生错误: ' + error.message + '\n' + error.stack)
        }
      },

      showEventDialog(event) {
        this.isShowEvent = true;
        this.$nextTick().then(() => {
          this.selectedEvent = event.target.textContent
        })
      }
    },
  };
</script>



<style lang="less" scoped>
  @import url(index.less);
</style>
