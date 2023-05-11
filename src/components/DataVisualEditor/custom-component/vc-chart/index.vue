<!-- eslint-disable vue/no-v-html -->
<template>
  <div class="container">
    <div :id="element.data.chartId"></div>
    <top-el-dialog
      title="编辑"
      :visible.sync="editSeriesDialog"
      width="40%"
      v-el-drag-dialog
      center
    >
      <div class="series-container">
        <div class="series-area">
          <div>
            <el-button type="primary" icon="el-icon-minus" size="mini" circle @click="deleteSerie"></el-button>
            <el-button type="danger" icon="el-icon-plus" size="mini" circle @click="addSerie"></el-button>
          </div>
          <draggable
            v-model="element.data.option.series"
            group="series"
            @start="startDraggable()"
            @end="endDraggable"
            @update="updateDraggable"
          >
            <el-tag
              v-for="(serie, index) in element.data.option.series"
              :key="index"
              :type="activeSerieIndex === index ? '' : 'info'"
              @click="onActiveSerie(serie, index)"
            >
              {{ serie.name }}
            </el-tag>
          </draggable>
        </div>

        <div class="edit-area">
          <el-form  label-width="40px" label-position=left>

            <el-form-item label="名称">
              <el-input v-model="activeSerie.name" placeholder="请输入内容"></el-input>
            </el-form-item>

            <el-form-item label="类型">
              <el-select v-model="activeSerie.type" placeholder="" style="width:100%">
                <el-option
                  v-for="serieType in serieTypeList"
                  :key="serieType.value"
                  :label="serieType.label"
                  :value="serieType.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <span slot="footer" class="dialog-footer" v-if="true">
        <el-button @click="editSeriesDialog = false">取 消</el-button>
        <el-button type="primary" @click="editSeriesDialog = false"
          >确 定</el-button
        >
      </span>
    </top-el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import axios from "axios";
import { keycodes } from "../../utils/shortcutKey";
import ChartComponentBase from "../ChartComponentBase";
import { getRandStr } from "../../utils/utils";
import * as echarts from "echarts";
import elDragDialog from "../../directive/el-drag-dialog";
import draggable from "vuedraggable";
import eventBus from "../../utils/eventBus";

export default {
  extends: ChartComponentBase,
  components: {
    draggable,
  },
  directives: {
    elDragDialog,
  },
  props: {},
  data() {
    return {};
  },
  computed: {
    ...mapState(["editMode"]),
  },
  watch: {
    element: {
      handler: function (val) {
        console.log("element图形配置", val.data.option);
      },
      deep: true,
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    updateDraggable(a) {
    },
    startDraggable() {
      this.oldSeries = this.element.data.option.series;
      console.log("拖动A", this.element.data.option.series);
    },

    endDraggable(dragEvent) {
      this.activeSerieIndex = dragEvent.newIndex;
      eventBus.$emit("endDraggable", dragEvent);
    },

    onActiveSerie(serie, index) {
      this.activeSerieIndex = index;
    },
  },
};
</script>

<style lang="less" scoped>
@import "index.less";
</style>
