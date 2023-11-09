<!-- eslint-disable vue/no-v-html -->
<template>
  <div class="container">
    <div :id="element.data.chartId"></div>

    <top-el-dialog title="编辑" :visible.sync="editSeriesDialog" width="46%" v-el-drag-dialog center>
      <div class="series-container">
        <div class="series-area">
          <div>
            <el-button type="primary" icon="el-icon-minus" size="mini" circle @click="deleteSerie"></el-button>
            <el-button type="primary" icon="el-icon-plus" size="mini" circle @click="addSerie"></el-button>
            <el-button type="primary" icon="el-icon-edit-outline" size="mini" circle
              @click="openSetOptionDialog"></el-button>

            <el-popover placement="top-start" title="存为模板" width="200" trigger="click" v-model="chartTemplate.show">
              <el-form :inline="true" :model="chartTemplate">
                <el-form-item label="模板名称">
                  <el-input v-model="chartTemplate.name" placeholder=""></el-input>
                </el-form-item>
                <el-form-item label="权限">
                  <el-select v-model="chartTemplate.permission" placeholder="">
                    <el-option label="私有" value="private"></el-option>
                    <el-option label="开放" value="public"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="描述">
                  <el-input v-model="chartTemplate.details" placeholder="" type="textarea" :rows="3"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="addChartTemplate">确定</el-button>
                </el-form-item>
              </el-form>
              <el-button slot="reference" type="primary" icon="el-icon-upload" size="mini" circle
                style="margin-left: 10px;"></el-button>
            </el-popover>

          </div>
          <draggable v-model="element.data.option.series" group="series" @start="startDraggable()" @end="endDraggable"
            @update="updateDraggable">
            <el-tag v-for="(serie, index) in element.data.option.series" :key="index"
              :type="activeSerieIndex === index ? '' : 'info'" @click="onActiveSerie(serie, index)">
              {{ serie.name }}
            </el-tag>
          </draggable>
        </div>

        <div class="edit-area">
          <el-form label-width="40px" label-position="left">
            <el-form-item label="名称">
              <el-input v-model="activeSerie.name" placeholder="请输入内容"></el-input>
            </el-form-item>

            <el-form-item label="类型">
              <el-select v-model="activeSerie.type" placeholder="" style="width: 100%">
                <el-option v-for="serieType in serieTypeList" :key="serieType.value" :label="serieType.label"
                  :value="serieType.value">
                </el-option>
              </el-select>
            </el-form-item>

            <div class="chart-list">

              <el-carousel style="" :autoplay="false" @change="chartTemplateChange">
                <el-carousel-item v-for="item in chartTemplateList" :key="item">
                  <div style="display: flex;flex-flow: column nowrap;">
                    <h3 style="width: 100%;margin-top: 10px;text-align: center;">{{ item.name }}</h3>
                    <div style="width: 100%;height: auto;display: flex; justify-content: center;align-items: center;">
                      <img :src="item.icon" alt="" width="100%" height="100%" srcset="" style="object-fit: cover;">
                    </div>
                  </div>

                </el-carousel-item>
              </el-carousel>

              <div
                style="display: flex;width: 100%;flex-flow: row nowrap;justify-content: center; align-items: center;margin-top: 10px;">
                <el-button @click="replaceOption">替换</el-button>
              </div>

            </div>
          </el-form>
        </div>
      </div>
      <span slot="footer" class="dialog-footer" v-if="true">
        <el-button @click="editSeriesDialog = false">取 消</el-button>
        <el-button type="primary" @click="editSeriesDialog = false">确 定</el-button>
      </span>
    </top-el-dialog>

    <top-el-dialog class="edit-option-dialog" title="编辑配置项" :visible.sync="editOptionDialog" width="40%"
      v-el-drag-dialog center>
      <div style="position: relative;height: 50vh;">
        <!-- <el-input type="textarea" :rows="20" v-model="inputOption"> </el-input> -->
        <div id="jsonEditor" style="height:100%;width: 100%;"></div>
      </div>
      <span slot="footer" class="dialog-footer" v-if="true">
        <el-button @click="closeSetOptionDialog('取消')">取 消</el-button>
        <el-button type="primary" @click="closeSetOptionDialog('确定')">确 定</el-button>
      </span>
    </top-el-dialog>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import axios from 'axios';
  import { keycodes } from '../../utils/shortcutKey';
  import ChartComponentBase from '../ChartComponentBase';
  import { getRandStr, throttle, debounce } from '../../utils/utils';
  import * as echarts from 'echarts';
  import elDragDialog from '../../directive/el-drag-dialog';
  import draggable from 'vuedraggable';
  import eventBus from '../../utils/eventBus';
  const JSONfn = require('jsonfn').JSONfn;
  import BaseMixins from '../BaseMixins';
  import JSONEditor from 'jsoneditor'
  import 'jsoneditor/dist/jsoneditor.css'

  import { toImage } from '../../utils/domUtils';


  let editor = null

  export default {
    extends: ChartComponentBase,
    mixins: [BaseMixins],
    components: {
      draggable,
      JSONEditor
    },
    directives: {
      elDragDialog,
    },
    props: {},
    data() {
      return {
        inputOption: '',
        chartTemplate: {
          show: false,
          name: '',
          permission: '',
          details: '',
          indicatorIndex: 0
        },
        chartTemplateList: ChartComponentBase.ChartTemplateList,
        options: {
          mode: 'code',
          search: false,
          transform: false,
          onChangeText: (jsonText) => {

            // jsonText = jsonText.trim()
            // if (!jsonText) {
            //   return
            // }

            // if (!jsonText.startsWith("{") || !jsonText.endsWith("}")) {
            //   const start = jsonText.indexOf("{")
            //   const last = jsonText.lastIndexOf("}")
            //   jsonText = jsonText.substring(start, last + 1)
            //   editor.set(eval('(' + jsonText + ')'))
            // }


          }
        },
      };
    },
    computed: {
      ...mapState(['editMode']),
    },
    watch: {
      element: {
        handler: function (val) {
          console.log('element图形配置', val.data.option);
        },
        deep: true,
      },
      editOptionDialog: {
        handler: function (val) {
          if (!val) {
            return
          }
          this.$nextTick(() => {
            if (editor == null) {
              const container = document.getElementById('jsonEditor')
              editor = new JSONEditor(container, this.options)
            }

            editor.set(JSON.parse(this.inputOption))
          })
        },
        deep: false,
      },
    },
    created() { },
    mounted() {
      console.log('数据项', this.element.data.option);


    },
    methods: {

      chartTemplateChange(i) {
        this.chartTemplate.indicatorIndex = i
      },

      replaceOption() {
        const list = this.chartTemplateList
        const i = this.chartTemplate.indicatorIndex
        eventBus.$emit("SetOption", this.element.data.name, list[i].data.option)
      },

      addChartTemplate() {

        if (!this.chartTemplate.name.trim()) {
          toast('需要指定模板名称');
          return
        }

        const fn = () => {

          const list = this.chartTemplateList

          toImage(document.getElementById('component' + this.element.id)).then(async image => {

            const { name, details, permission } = this.chartTemplate
            this.element.icon = image;
            this.element.details = details
            this.element.name = name
            this.element.permission = permission
            const curComponentText = JSONfn.stringify(this.element);

            delete this.element.icon
            delete this.element.details
            delete this.element.name
            delete this.element.permission

            await axios.post(`/BI-API/Component/SaveUserCustomizedComponent`, {
              name: this.chartTemplate.name + '.vct',
              component: curComponentText,
            });

            const i = list.findIndex(e => e.data.name === this.chartTemplate.name)

            if (i !== -1) {
              Vue.set(list, i, JSON.parse(curComponentText));
            } else {
              Vue.set(list, list.length, JSON.parse(curComponentText))
            }

            toast('模板保存成功', 'success');
          })
        }

        throttle(fn, 5000)()
        this.chartTemplate.show = false
      },

      updateDraggable(a) { },
      startDraggable() {
        this.oldSeries = this.element.data.option.series;
      },

      endDraggable(dragEvent) {
        this.activeSerieIndex = dragEvent.newIndex;
        eventBus.$emit('endDraggable', dragEvent);
      },

      onActiveSerie(serie, index) {
        this.activeSerieIndex = index;
      },

      openSetOptionDialog() {
        this.inputOption = JSONfn.stringify(this.element.data.option);
        this.editSeriesDialog = false;
        this.editOptionDialog = true;
      },

      closeSetOptionDialog(button) {
        if (button === '取消') {
          this.editSeriesDialog = true;
          this.editOptionDialog = false;
        } else if (button === '确定') {

          // jsonText = jsonText.trim()
          // if (!jsonText) {
          //   return
          // }

          // if (!jsonText.startsWith("{") || !jsonText.endsWith("}")) {
          //   const start = jsonText.indexOf("{")
          //   const last = jsonText.lastIndexOf("}")
          //   jsonText = jsonText.substring(start, last + 1)
          //   editor.set(eval('(' + jsonText + ')'))
          // }

          this.inputOption = editor.getText()

          let txt = this.inputOption.trim();
          const start = txt.indexOf("{")
          const last = txt.lastIndexOf("}")
          txt = txt.substring(start, last + 1)

          if (!txt) {
            return
          }

          const option = eval('(' + txt + ')');
          eventBus.$emit("SetOption", this.element.data.name, option)

          this.editSeriesDialog = false;
          this.editOptionDialog = false;
        }
      },
    },
  };
</script>

<style lang="less" scoped>
  @import 'index.less';
</style>
