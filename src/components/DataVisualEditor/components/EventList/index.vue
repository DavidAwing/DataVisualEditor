<template>
  <div class="event-list">
    <div class="div-events">
      <el-button @click="isShowEvent = true">添加事件</el-button>
      <div>
        <el-tag v-for="event in Object.keys(curComponent.events)" :key="event" closable @close="removeEvent(event)" @click="showEventDialog($event)" class="event-tag">
          <span>{{ event }}</span>
        </el-tag>
      </div>
    </div>
    <!-- 选择事件 -->
    <Modal v-model="isShowEvent">
      <div style="height: 100%; display: flex; flex-flow: column nowrap">
        <div
          style="
            display: flex;
            flex-flow: row nowrap;
            justify-content: flex-start;
            align-items: center;
            padding-top: 8px;
          "
        >
          <div style="margin-left: 8px">事件名称:</div>
          <el-select
            v-model="selectedEvent"
            placeholder="请选择事件"
            style="margin-left: 8px; flex: 1; margin-right: 8px"
          >
            <template v-for="item in eventOptions">
              <el-option :label="item.label" :value="item.value" :key="item.value"></el-option>
            </template>
          </el-select>
        </div>

        <div style="margin-top: 8px; margin-left: 8px; margin-right: 8px; flex: 1; overflow-y: hidden">
          <!-- <button @click="changeDb">修改数据库</button> -->
          <js-editor ref="jsEditor" />
          <!-- <json-editor ref="jsonEditor" v-model="jsonValue" /> -->
          <!-- <highlightjs language="javascript" :code="selectedEventCode"></highlightjs> -->
          <!-- <el-input v-model="selectedEventCode" type="textarea" placeholder="请输入事件代码" rows="30" @keydown.native.stop /> -->
        </div>

        <el-button
          type="primary"
          style="margin-bottom: 10px; margin-top: 10px; margin-left: 40%; margin-right: 40%"
          @click="setEvent"
          >设置</el-button
        >
      </div>

      <el-tabs v-model="eventActiveName" v-if="false">
        <el-tab-pane
          v-for="item in eventList"
          :key="item.key"
          :label="item.label"
          :name="item.key"
          style="padding: 0 20px"
        >
          <el-input
            v-if="item.key == 'redirect'"
            v-model="item.param"
            type="textarea"
            placeholder="请输入完整的 URL"
            @keydown.native.stop
          />
          <el-input
            v-if="item.key == 'alert'"
            v-model="item.param"
            type="textarea"
            placeholder="请输入要 alert 的内容"
            @keydown.native.stop
          />
          <el-button style="margin-top: 20px" @click="addEvent(item.key, item.param)">确定</el-button>
        </el-tab-pane>
      </el-tabs>
    </Modal>
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

        return `const component = param.component;\nconst data = param.data;\nconst element = param.element;\nconsole.log("组件${this.selectedEvent}事件", component, data, element);`;
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
      }
    },
  },
  created() {
    this.$nextTick(() => {
      // this.$refs.jsonEditor.updateDoc(this.jsonValue)
    });
  },
  methods: {
    addEvent(event, param) {
      this.isShowEvent = false;
      this.$store.commit('addEvent', { event, param });
    },

    removeEvent(event) {
      this.$store.commit('removeEvent', event);
    },

    setEvent(event) {
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
        bi.debug('脚本编译发生错误: ' + error.message + '\n' + error.stack);
        // toast('脚本编译发生错误: ' + error.message + '\n' + error.stack);
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
