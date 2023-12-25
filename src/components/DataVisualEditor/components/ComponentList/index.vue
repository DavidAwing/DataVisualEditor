<template>
  <div>
    <el-collapse v-model="activeCollapses" class="collapse">
      <el-collapse-item title="内置组件" name="0">
        <template slot="title">
          <i v-if="false" class="header-icon el-icon-data-analysis" style="margin-left: 6px;"></i><span
            class="group-title">内置组件</span>
        </template>
        <div class="component-list" @dragstart="handleDragStart">
          <div v-for="(item, index) in componentList" :key="index" class="list" draggable :data-index="index">
            <img v-if="
                item.icon.endsWith('.jpg') ||
                item.icon.endsWith('.png') ||
                item.icon.startsWith('data:image/') ||
                item.icon.startsWith('http')
              " width="17" class="iconfont" :src="item.icon" style="margin-top: 3px; margin-bottom: 3px" />
            <span v-else class="iconfont" :class="'icon-' + item.icon"></span>
            <span>{{ item.label }}</span>
          </div>
        </div>
      </el-collapse-item>
      <el-collapse-item title="组件市场" name="1">
        <template slot="title">
          <div style="display: flex;justify-content: flex-start; align-items: center;">
            <i v-if="false" class="header-icon el-icon-present" style="margin-left: 6px;"></i>
            <span class="group-title">组件市场</span>

            <el-popover placement="top-start" title="保存到组件市场" width="230" trigger="click"
              v-model="componentTemplate.show">
              <el-form :inline="true" :model="componentTemplate">
                <el-form-item label="组件名称">
                  <el-input v-model="componentTemplate.name" placeholder=""></el-input>
                </el-form-item>
                <el-form-item label="权限">
                  <el-select v-model="componentTemplate.permission" placeholder="">
                    <el-option label="私有" value="private"></el-option>
                    <el-option label="开放" value="public"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="描述">
                  <el-input v-model="componentTemplate.details" placeholder="" type="textarea" :rows="3"></el-input>
                </el-form-item>

                <el-form-item style="width: 100%;">
                  <el-tag :key="tag" v-for="tag in componentTemplate.tags" closable :disable-transitions="false"
                    @close="handleTagClose(tag)">
                    {{tag}}
                  </el-tag>
                  <el-input class="input-new-tag" v-if="inputVisible" v-model="componentTemplate.tag" ref="saveTagInput"
                    size="small" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm">
                  </el-input>
                  <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 标签</el-button>
                </el-form-item>

                <el-form-item>
                  <el-button type="primary" @click="addComponentMarket">确定</el-button>
                </el-form-item>

              </el-form>
              <el-button
                @click="e=>{e.stopPropagation(); componentTemplate.name = '';componentTemplate.tags = []; /**if(curComponent) componentTemplate.name = curComponent.data.name;*/}"
                slot="reference" type="primary" icon="el-icon-upload" size="mini" circle
                style="margin-left: 10px;transform: scale(0.8);"></el-button>
            </el-popover>
          </div>

        </template>
        <div class="component-list">
          <div v-for="(item, index) in userComponentList" :key="index" class="list user-component-item" draggable
            @dragstart="handleDragStart($event, item.name || item.data.name, 'ComponentMarket')"
            @click="showUserComponentDetails">
            <img v-if="
                item.icon.endsWith('.jpg') ||
                item.icon.endsWith('.png') ||
                item.icon.startsWith('data:image/') ||
                item.icon.startsWith('http')
              " width="100%" :height="imgHeight" :src="item.icon" style="margin-top: 3px; margin-bottom: 3px" />
            <label>{{ item.name || item.data.name }}</label>
            <!-- <span v-else class="iconfont" :class="'icon-' + item.icon"></span>
             -->
          </div>
        </div>
      </el-collapse-item>
      <el-collapse-item title="业务插件" name="2">
        <template slot="title">
          <i v-if="false" class="header-icon el-icon-document" style="margin-left: 6px;"></i><span
            class="group-title">业务插件</span>
        </template>
        <div>
          <el-button type="primary" plain @click="null">编辑业务组件</el-button>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import componentList, { userComponentList } from '../../custom-component/component-list';
  import { toImage } from '../../utils/domUtils';
  import { getRandStr } from '../../utils/utils';
  import axios from 'axios';
  const JSONfn = require('jsonfn').JSONfn;

  export default {
    data() {
      return {
        inputVisible: false,
        componentTemplate: {
          show: false,
          name: '',
          permission: '',
          details: '',
          tag: "",
          tags: []
        },
        activeCollapses: ['0', '1', '2'],
        componentList,
        userComponentList,
        imgHeight: '60px',
      };
    },
    computed: {
      ...mapState(['curComponent']),
    },
    beforeCreate() {
      // for (let i = 0; i < componentList.length; i++) {
      //   const component = componentList[i]
      //   if (component.events && component.events.onBeforeCreate)
      //     await component.events.onBeforeCreate(component, this)
      // }
    },
    created() { },
    mounted() {
      // this.imgHeight = getComputedStyle(document.getElementsByClassName('list')[0]).width;

      axios.get(`/BI-API/Component/GetUserCustomizedComponentList?type=.ct`).then(({ data }) => {
        for (const item of data.data) {
          this.userComponentList.push(JSON.parse(item));
        }
      });
    },
    methods: {

      handleTagClose(tag) {
        this.componentTemplate.tags.splice(this.componentTemplate.tags.indexOf(tag), 1);
      },

      showInput() {
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },

      handleInputConfirm() {
        let tag = this.componentTemplate.tag;
        if (tag) {
          this.componentTemplate.tags.push(tag);
        }
        this.inputVisible = false;
        this.componentTemplate.tag = '';
      },

      showUserComponentDetails() {

        console.log('显示组件的详情,可以删除,修改');
      },
      handleDragStart(e, index, from) {

        if (from) {
          e.dataTransfer.setData('from', from);
        }

        if (!index) {
          e.dataTransfer.setData('index', e.target.dataset.index);
        } else {
          e.dataTransfer.setData('index', index);
        }
      },
      addComponentMarket() {
        if (!this.componentTemplate.name.trim()) {
          toast('需要指定组件名称');
          return
        }
        if (!this.curComponent) {
          toast('需要选择一个组件');
          return;
        }
        toImage(document.getElementById('component' + this.curComponent.id)).then(async image => {
          const { name, details, permission, tags } = this.componentTemplate
          this.curComponent.icon = image;
          this.curComponent.details = details
          this.curComponent.name = name
          this.curComponent.permission = permission
          this.curComponent.permission = permission
          this.curComponent.dataSourcelist = []
          this.curComponent.dataSourcelist.tags = tags
          const dataSourcelist = JSONfn.parse(bi.store.state.canvasData.dataSource.parameters);
          dataSourcelist.forEach(item => {
            if (item.componentName === this.curComponent.data.name) {
              this.curComponent.dataSourcelist.push(item)
            } else if (item.dataSourceType === "database") {
              const regexp = new RegExp(`@NAME\\s+${this.curComponent.data.name}`, 'i')
              if (!regexp.test(item.sql)) {
                return
              }
              const sqlList = item.sql.split(/\n{2}/).filter(s => s.trim())
              let sqlStr = ""
              for (const sql of sqlList) {
                if (regexp.test(sql)) {
                  sqlStr += sql + "\n\n\n"
                }
              }
              item.sql = sqlStr.trim()
              this.curComponent.dataSourcelist.push(item)
            }
          })
          const curComponentText = JSONfn.stringify(this.curComponent);
          delete this.curComponent.icon;
          delete this.curComponent.details;
          delete this.curComponent.name;
          delete this.curComponent.permission;
          delete this.curComponent.dataSourcelist;
          delete this.curComponent.dataSourcelist.tags;
          await axios.post(`/BI-API/Component/SaveUserCustomizedComponent`, {
            name: name + '.ct',
            component: curComponentText,
          });
          toast('保存成功', 'success');
          for (let i = 0; i < this.userComponentList.length; i++) {
            const item = this.userComponentList[i];
            if (item.name === name) {
              this.$set(this.userComponentList, i, JSON.parse(curComponentText));
              return;
            }
          }
          this.userComponentList.push(JSON.parse(curComponentText));
        });
        this.componentTemplate.show = false
      },
    },
  };
</script>

<style lang="less" scoped>
  .component-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 10px 8px;

    .list {
      width: 47%;
      border: 1px solid #ddd;
      cursor: grab;
      margin-bottom: 10px;
      text-align: center;
      color: #333;
      padding: 2px 3px;
      display: flex;
      align-items: center;
      justify-content: center;

      &:active {
        cursor: grabbing;
      }
      .iconfont {
        margin-right: 4px;
        font-size: 20px;
      }
      .icon-wenben,
      .icon-tupian {
        font-size: 18px;
      }
    }
  }

  @import url(index.less);
</style>
