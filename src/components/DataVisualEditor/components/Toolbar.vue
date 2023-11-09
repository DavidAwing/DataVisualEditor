<template>
  <div>
    <div class="toolbar">
      <div class="canvas-config" style="margin-left: 0">
        <span>名称</span>

        <!--   @blur="inputCanvaName($event)" -->
        <el-select style="padding: 6px; width: 120px" v-model="currentCanvasName" @keyup.enter.native="inputCanvaName"
          clearable filterable placeholder="" @clear="clearCanvas">
          <el-option v-for="item in canvasList" :key="item.name" :label="item.name" :value="item.name"> </el-option>
        </el-select>
      </div>
      <!-- <el-button @click="exportTemplate">导出</el-button>
      <el-button @click="importTemplate">导入</el-button> -->
      <!-- <el-button @click="redo">预览</el-button> -->
      <!-- 填写接口或者json数据测试 -->

      <el-button class="ai-dialog-button" icon="el-icon-search" :circle="false"
        @click="showChatDialogVisible"></el-button>

      <el-button class="show-canvas-config-dialog" icon="el-icon-search" :circle="false"
        @click="showCanvasConfigDialogVisible"></el-button>

      <!-- <el-select v-model="canvasData.deviceType" style="width: 70px; min-width: 70px" class="canvas-config">
        <el-option key="pc" label="pc" value="pc"> </el-option>
        <el-option key="mobile" label="mobile" value="mobile"></el-option>
      </el-select> -->

      <el-button :class="'device-' + canvasData.deviceType" type="primary--" icon="el-icon-search" :circle="false"
        @click="()=>{canvasData.deviceType === 'mobile' ? canvasData.deviceType = 'pc': canvasData.deviceType = 'mobile'}"></el-button>

      <!-- <el-button @click="redo" style="margin-left: 10px">其他</el-button> -->
      <el-button @click="preview" v-if="false">预览</el-button>
      <el-button @click="undo" v-if="false">撤消</el-button>
      <el-button @click="redo" v-if="false">重做</el-button>
      <label for="input" class="insert" v-if="false">插入图片</label>
      <input id="input" type="file" hidden @change="handleFileChange" />
      <el-button style="margin-left: 10px" @click="preview" v-if="false">预览</el-button>
      <el-button @click="save" style="margin-left: 10px" v-if="false">保存</el-button>
      <el-button @click="clearCanvas" v-if="false">删除</el-button>
      <el-button v-if="false" @click="compose">组合</el-button>
      <el-button v-if="false" :disabled="!curComponent || curComponent.isLock || curComponent.component != 'Group'"
        @click="decompose">
        拆分
      </el-button>
      <el-button v-if="false" @click="lock">锁定</el-button>
      <el-button v-if="false" @click="unlock">解锁</el-button>

      <div class="canvas-config">
        <!-- <span>尺寸</span> -->
        <input style="padding: 6px" v-model="canvasData.width" />
        <span>*</span>
        <input style="padding: 6px" v-model="canvasData.height" />
      </div>
      <el-select v-model="canvasData.unit" style="width: 70px; min-width: 70px" class="canvas-config">
        <el-option key="px" label="px" value="px"></el-option>
        <el-option key="%" label="%" value="%"></el-option>
        <el-option key="mm" label="mm" value="mm"></el-option>
      </el-select>
      <div class="canvas-config">
        <span>缩放</span>
        <input style="padding: 6px" v-model="scale" @input="handleScaleChange" />
        %
      </div>
    </div>

    <el-dialog title="业务配置" :visible.sync="canvasConfigDialogVisible" v-el-drag-dialog>
      <el-form>
        <!-- <el-form-item label="数据来源">

        </el-form-item> -->

        <div style="display: flex; justify-content: flex-end">
          <a :href="'/bi/#/DatasourceEditor?name=' + currentCanvasName" target="_blank" class=""
            @click="canvasConfigDialogVisible = false">
            <el-button type="text" style="font-size: 16px">进入数据源编辑器</el-button>
          </a>
        </div>
        <el-input type="textarea" v-model="canvasData.dataSource.parameters" autocomplete="off" :rows="10"></el-input>
        <div style="display: flex; justify-content: flex-end">
          <a :href="'/bi/#/WorkFlowEditor?name=' + currentCanvasName" target="_blank" class=""
            @click="canvasConfigDialogVisible = false">
            <el-button type="text" style="font-size: 16px">进入工作流编辑器</el-button>
          </a>
        </div>
        <el-input type="textarea" v-model="canvasData.dataSource.workFlow" autocomplete="off" :rows="10"></el-input>

        <el-form-item label="cron" v-show="false">
          <el-input v-model="canvasData.dataSource.cron" autocomplete="off"></el-input>
        </el-form-item>

        <!-- <el-form-item label="http地址">
          <el-input
            v-model="currentCanvasConfig.http"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <el-form-item v-model="currentCanvasConfig.http" label="请求间隔">
          <el-input autocomplete="off"></el-input>
        </el-form-item> -->
      </el-form>

      <div slot="footer" class="dialog-footer">
        <!-- <div>
          <a :href="'/bi/#/DatasourceEditor?name=' + currentCanvasName" target="_blank" class="">
            <el-button type="text"></el-button>
          </a>
          <a :href="'/bi/#/AddDatasource'" target="_blank" style="margin-left: 16px">
            <el-button type="text"></el-button>
          </a>
        </div> -->

        <div style="width: 300%;" v-if="false">
          <el-input v-model="helpMsg" placeholder="这里显示最后编辑日期时间,和编辑者" autocomplete="off" type="text"></el-input>
        </div>

        <div style="position: relative; display: flexbox; flex-flow: row nowrap; width: 100%;">
          <el-button @click="canvasConfigDialogVisible = false" style="margin-left: 26px;width: fit-content;">取
            消</el-button>
          <el-button type="primary" @click="canvasConfigDialogVisible = false" style="width: fit-content;">确
            定</el-button>
        </div>
      </div>
    </el-dialog>



    <top-el-dialog title="AI助手" :visible.sync="chatDialogVisible" width="23%" :custom-class="'ai-chat-dialog'"
      :modal="false" :close-on-click-modal="false" v-el-drag-dialog center>

      <div style="background-color: white;">
        <AIChat :onSendMsg="onSendMsg" style="height: 500px;" />
      </div>

      <span slot="footer" class="dialog-footer" v-if="false">
        11111111111111111
      </span>
    </top-el-dialog>


  </div>
</template>

<script>
  import generateID, { resetID } from '../utils/generateID';
  import { removeAllStyleNotOfCanvasName } from '../utils/style';
  import toast, { toastClose } from '../utils/toast';
  import { mapState } from 'vuex';
  import Preview from './Editor/Preview';
  import ComponentListViewer from './ComponentListViewer';
  import { commonStyle, commonAttr } from '../custom-component/component-list';
  import eventBus from '../utils/eventBus';
  import { deepCopy, selectFile, saveText, closeWindow } from '../utils/utils';
  import { divide, multiply } from 'mathjs';
  import * as DB from '../utils/indexDB';
  import { toImage } from '../utils/domUtils';
  const LZ = require('lz-string');
  const JSONfn = require('jsonfn').JSONfn;
  // import TestCanvas from './TestCanvas';
  import axios from 'axios';
  import md5 from 'blueimp-md5';
  import { requestCanvasData } from '../utils/dataBinder';
  import { saveCanvas } from './MenuHandler';
  import { MessageBox } from 'element-ui';
  import AIChat from "@/components/DataVisualEditor/components/AIChat";

  export default {
    components: { Preview, ComponentListViewer, AIChat },
    data() {
      return {
        isShowPreview: false,
        isShowComponentListViewer: false,
        needToChange: ['top', 'left', 'width', 'height', 'fontSize'],
        scale: 100,
        scaleCopy: null,
        messageList: [],
        timer: null,
        changeState: {
          name: true,
        },
        currentCanvasName: '', // 当前的画布名称
        canvasList: [],
        canvasConfigDialogVisible: false,
        helpMsg: "",
        chatDialogVisible: false
      };
    },
    computed: {
      ...mapState(['canvasComponentData', 'canvasData', 'areaData', 'curComponent', 'curComponentIndex', 'canvasName', 'activeComponentList']),
      saveMenuShow() {

      },
      composeMenuShow() {
        return this.areaData.components.length > 1
      },
      lockMenuShow() {
        return !(!this.curComponent || this.curComponent.isLock)
      },
      unlockMenuShow() {
        return !(!this.curComponent || !this.curComponent.isLock)
      },
      decomposeMenuShow() {
        if (this.activeComponentList.length > 1) {
          for (let i = 0; i < this.activeComponentList.length; i++) {
            const c = this.canvasComponentData.find(c => c.id === this.activeComponentList[i])
            if (c && c.component === 'Group') {
              return false
            }
          }
        }
        return !(!this.curComponent || this.curComponent.isLock || this.curComponent.component != 'Group')
      }
    },
    watch: {
      currentCanvasName: {
        handler: function (val, old) {

          removeAllStyleNotOfCanvasName(this.currentCanvasName);

          // 清除画布中已选中的组件
          this.$store.commit('setCurComponent', {
            component: null,
            index: null,
          });

          this.$store.commit('setCanvasName', this.currentCanvasName);

          if (!val) {
            this.$store.commit('setCanvasComponentData', []);
            this.$store.commit('recordSnapshot');
            return;
          }

          if (
            this.currentCanvasName &&
            this.currentCanvasName.trim() !== ''
          )
            DB.setItem('CurrentCanvasName', this.currentCanvasName);

          this.setAttributeChangeable('name', false);
          for (const data of this.canvasList) {
            if (data.name == val) {
              const name = val;
              const checkCode = data.checkCode;
              const canvasComponentData = data.canvasComponentData;
              const canvasData = JSONfn.parse(data.canvasData);
              axios.get(`/BI-API/Component/GetCanvasCheckCode?name=${name}`).then(({ data }) => {
                if (data.state !== 200) {
                  console.warn('currentCanvasName|获取校验码发生错误', data);
                  return;
                }
                const code = data.data;
                if (checkCode === code) {
                  // 恢复画布
                  this.$store.commit('setCanvasComponentData', this.resetID(JSONfn.parse(canvasComponentData)));
                  this.$store.commit('setCanvasData', canvasData);
                  eventBus.$emit('restoreEvent', this.currentCanvasName, canvasComponentData);
                } else {
                  // 从后台请求数据
                  axios
                    .get(`/BI-API/Component/GetCanvasTemplate`, {
                      params: {
                        name: name,
                      },
                      timeout: 1000 * 60 * 30,
                    })
                    .then(({ data }) => {
                      if (data.state !== 200) {
                        console.warn('currentCanvasName|GetCanvasTemplate发生错误', data);
                        return;
                      }
                      data = JSONfn.parse(data.data);
                      const canvasComponentData = data.canvasComponentData;
                      const canvasData = JSONfn.parse(data.canvasData);

                      // 恢复画布
                      this.$store.commit('setCanvasComponentData', this.resetID(JSONfn.parse(canvasComponentData)));
                      this.$store.commit('setCanvasData', canvasData);
                      eventBus.$emit('restoreEvent', this.currentCanvasName, canvasComponentData);

                      // axios
                      //   .get(`/BI-API/DataSource/GetCanvasDataSourceList`, {
                      //     params: { userId: 'admin', canvasName: this.currentCanvasName },
                      //   })
                      //   .then(({ data }) => {
                      //     if (data.state === 200 && data.data !== '[]') canvasData.dataSource.parameters = data.data;
                      //   })
                      //   .finally(() => {});
                    })
                    .catch(error => {
                      console.error('currentCanvasName|发生错误', error);
                    });
                }
              });
              return;
            }
          }

          // 新增的
          this.$store.commit('setCanvasComponentData', []);
          this.$store.commit('recordSnapshot');

          if (
            this.currentCanvasName !== undefined &&
            this.currentCanvasName !== null &&
            this.currentCanvasName.trim() !== ''
          ) {
            this.canvasList.push({
              canvasComponentData: JSONfn.stringify(this.canvasComponentData),
              canvasData: JSONfn.stringify(this.canvasData),
              name: this.currentCanvasName,
              type: 'Canvas-Data',
            });
          }
        },
        deep: false,
        immediate: true,
      },
      canvasName() {
        this.currentCanvasName = this.canvasName;
      },
      canvasData() {
        this.scale = this.canvasData.scale;
      },
    },
    created() {
      eventBus.$on('preview', this.preview);
      eventBus.$on('save', this.save);
      eventBus.$on('clearCanvas', this.clearCanvas);

      this.$watch(() => this.composeMenuShow, (val) => {
        this.$store.commit('setTopMenuShow', ['compose', val])
      })
      this.$watch(() => this.lockMenuShow, (val) => {
        this.$store.commit('setTopMenuShow', ['lock', val])
      })
      this.$watch(() => this.unlockMenuShow, (val) => {
        this.$store.commit('setTopMenuShow', ['unlock', val])
      })
      this.$watch(() => this.decomposeMenuShow, (val) => {
        this.$store.commit('setTopMenuShow', ['decompose', val])
      })



      eventBus.$on('TopMenu.save', this.save)
      eventBus.$on('TopMenu.undo', this.undo)
      eventBus.$on('TopMenu.redo', this.redo)
      eventBus.$on('TopMenu.compose', this.compose)
      eventBus.$on('TopMenu.decompose', this.decompose)
      eventBus.$on('TopMenu.lock', this.lock)
      eventBus.$on('TopMenu.unlock', this.unlock)
    },
    mounted() {
      const that = this;
      DB.CallbackMap.onOpenSucceedEventList.push(async () => {
        this.canvasList = await DB.getAllItemByType('Canvas-Data');
        const canvasTemplateName = await DB.getItem('CanvasTemplateName');
        if (canvasTemplateName !== undefined && canvasTemplateName !== null && canvasTemplateName.trim() !== '') {
          this.currentCanvasName = canvasTemplateName;
          try {
            requestCanvasData.bind(this)(this.currentCanvasName);
          } catch (error) {
            console.error('eventBus|数据绑定异常', error);
          }
          DB.removeItem('CanvasTemplateName');
        } else {
          DB.getItem('CurrentCanvasName').then(item => {
            this.currentCanvasName = item;
          });
        }
      });
    },
    methods: {

      async onSendMsg({ type, content }) {

        /**

        用户输入时
        测试文本:

        // 场景1
        1. 把/将组件0移到顶部,宽度占满,高度30%
        2. 高/宽(度)-1/+1
        3. 顶部-1/+1
        4. 文字16
        5. 文字+1/-1
        6. 文字从上到下渐变, 上面红色, 下面蓝色
        7. 上面(颜色)改成#bb5599/ 下面改成绿色

        // 场景2
        1. 高亮显示当前组件/ 高亮组件
        2. 设置为组件1/切换到组件1


        // 场景3
        1. 添加一个动画

        // 场景4
        1. 请求这个接口的数据


        点击aaa时导出组件bbb的数据
        点击aaa时导出bbb的数据
        点击aaa时导出bbb的到表格


         * */

        console.log('处理用户消息', type, content);

        if (type === 'file') {
          return { type: 'text', content: content[0].name }
        }

        let msg = null
        const { data } = await axios.post(`/BI-API/AI/GetWordClass`, { content, hmm: true }, {
          headers: {
            'Content-Type': 'application/json',
          },
        })

        msg = data

        if (typeof msg === 'object') {

          if (msg.content && msg.type) {
            return msg
          } else if (msg.content) {
            return { type: 'text', content: msg.content }
          } else {
            return { type: 'text', content: JSONfn.stringify(msg) }
          }

        } else if (typeof msg === 'string') {
          return msg
        }


        return data
      },

      showChatDialogVisible() {

        this.chatDialogVisible = true

        setTimeout(() => {
          $('.el-dialog__wrapper').css('visibility', 'hidden')
          $('.el-dialog__wrapper>div').css('visibility', 'visible')
          const empty = function (e) {
            window.getSelection().empty()
            // $('.el-dialog__header').off("mouseup", onmouseup);
          }
          $('.el-dialog__header').mousedown(empty);
          $('.el-dialog__header').mouseup(empty);
        }, 100);

      },

      showCanvasConfigDialogVisible() {
        this.canvasConfigDialogVisible = true;
        const canvasData = this.canvasData;
        const currentCanvasName = this.currentCanvasName;
        DB.getItem(`bi-user-canvas-data-source-${currentCanvasName}`).then(userCanvasDataSource => {
          if (userCanvasDataSource !== undefined) {
            canvasData.dataSource.parameters = userCanvasDataSource;
            DB.removeItem(`bi-user-canvas-data-source-${currentCanvasName}`);
          }
        });
      },
      setAttributeChangeable(key, state) {
        this.changeState[key] = state;
      },

      onPrintExit() {
        this.scaleCopy = null;
        closeWindow();
      },

      exportTemplate() {
        if (this.currentCanvasName == null || this.currentCanvasName == '') {
          toast('请设置看板模板的名称...');
          return;
        }

        const canvas = {
          canvasComponentData: JSONfn.stringify(this.canvasComponentData),
          canvasData: JSONfn.stringify(this.canvasData),
        };

        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const second = date.getSeconds();

        saveText(
          !this.currentCanvasName
            ? `${year}.${month}.${day}.${hours}.${minutes}.${second}.label`
            : this.currentCanvasName + '.label',
          JSONfn.stringify(canvas)
        );
        toast('标签模板已导出', 'success', 3000);
      },

      resetID,

      importTemplate() {
        selectFile().then(fileList => {
          const that = this;

          const reader = new FileReader();
          reader.readAsText(fileList[0], 'UTF-8');
          reader.onload = function (e) {
            const text = e.target.result;
            const canvas = JSONfn.parse(text);

            // 用保存的数据恢复画布
            if (typeof canvas.canvasComponentData === 'string') {
              that.$store.commit('setCanvasComponentData', that.resetID(JSONfn.parse(canvas.canvasComponentData)));
            }

            if (typeof canvas.canvasData === 'string') {
              that.$store.commit('setCanvasData', JSONfn.parse(canvas.canvasData));
            }

            const name = fileList[0].name;
            that.$store.commit('setCanvasName', name.substring(0, name.length - 6));
          };
        });
      },

      importData() {
        function selectFile(options = { multiple: false, accept: '*/*' }, isDirectory = false) {
          return new Promise((res, rej) => {
            const el = document.createElement('input');
            el.type = 'file';
            el.accept = options.accept;
            el.webkitdirectory = isDirectory;
            el.multiple = options.multiple;
            el.addEventListener('change', result => {
              try {
                if (el.files === null) {
                  rej(null);
                } else {
                  res(el.files);
                }
              } catch (error) {
                rej(error);
              }
            });
            el.click();
          });
        }

        selectFile().then(fileList => {
          if (fileList[0].name.toLowerCase().endsWith('.txt') || fileList[0].name.toLowerCase().endsWith('.json')) {
            const reader = new FileReader();
            reader.readAsText(fileList[0], 'UTF-8');
            reader.onload = function (e) {
              const text = e.target.result;
              const labelData = JSONfn.parse(text);
              this.$store.commit('setListData', labelData);
              toast('标签数据导入成功', 'success', 600);
            }.bind(this);
          }
        });
      },

      format(value) {
        return multiply(value, divide(parseFloat(this.scale), 100));
      },

      getOriginStyle(value) {
        return divide(value, divide(parseFloat(this.canvasData.scale), 100));
      },

      handleScaleChange(afterCallback) {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          // 画布比例设一个最小值，不能为 0
          // eslint-disable-next-line no-bitwise
          this.scale = ~~this.scale || 1;
          const canvasComponentData = deepCopy(this.canvasComponentData);
          canvasComponentData.forEach(component => {
            Object.keys(component.style).forEach(key => {
              if (this.needToChange.includes(key)) {
                // 根据原来的比例获取样式原来的尺寸
                // 再用原来的尺寸 * 现在的比例得出新的尺寸
                component.style[key] = this.format(this.getOriginStyle(component.style[key]));
              }
            });
          });

          this.$store.commit('setCanvasComponentData', canvasComponentData);
          // 更新画布数组后，需要重新设置当前组件，否则在改变比例后，直接拖动圆点改变组件大小不会生效 https://github.com/woai3c/visual-drag-demo/issues/74
          this.$store.commit('setCurComponent', {
            component: canvasComponentData[this.curComponentIndex],
            index: this.curComponentIndex,
          });
          this.$store.commit('setCanvasData', {
            ...this.canvasData,
            scale: this.scale,
          });

          this.$nextTick(() => {
            if (typeof afterCallback == 'function') afterCallback();
          });
        }, 200);
      },

      lock() {
        this.$store.commit('lock');
      },

      unlock() {
        this.$store.commit('unlock');
      },

      compose() {
        this.$store.commit('compose');
        this.$store.commit('recordSnapshot');
      },

      decompose() {
        this.$store.commit('decompose');
        this.$store.commit('recordSnapshot');
      },

      undo() {
        this.$store.commit('undo');
      },

      redo() {
        this.$store.commit('redo');
      },

      handleFileChange(e) {
        const file = e.target.files[0];
        if (!file.type.includes('image')) {
          toast('只能插入图片');
          return;
        }

        const reader = new FileReader();
        reader.onload = res => {
          const fileResult = res.target.result;
          const img = new Image();
          img.onload = () => {
            this.$store.commit('addComponent', {
              component: {
                ...commonAttr,
                id: generateID(),
                component: 'Picture',
                label: '图片',
                icon: '',
                propValue: fileResult,
                style: {
                  ...commonStyle,
                  top: 0,
                  left: 0,
                  width: img.width,
                  height: img.height,
                },
              },
            });

            this.$store.commit('recordSnapshot');

            // 修复重复上传同一文件，@change 不触发的问题
            document.querySelector('#input').setAttribute('type', 'text');
            document.querySelector('#input').setAttribute('type', 'file');
          };

          img.src = fileResult;
        };

        reader.readAsDataURL(file);
      },

      preview() {
        this.isShowPreview = true;
        this.$store.commit('setEditMode', 'preview');
      },

      async save() {

        const componentNameList = [];
        for (const component of this.canvasComponentData) {
          if (!component.data || !component.data.name || !component.data.name.trim()) continue;

          // todo 去除组件中存在的服务端数据
          if (component.component === '') {

          }
          const componentName = component.data.name.trim();
          if (componentNameList.indexOf(componentName) !== -1) {
            toast('组件名称重复: ' + componentName);
            return;
          }
          componentNameList.push(componentName);
        }
        const isSave = saveCanvas(this.currentCanvasName, this.canvasComponentData, this.canvasData)

        // const obj = { action: 'refresh', urls: [`/DatasourceEditor?name=${this.currentCanvasName}`] }
        // bi.sharedWorker.postMessage(JSON.stringify(obj))
        toast('保存成功', 'success');

        const obj1 = {
          action: 'setState',
          urls: [`/DatasourceEditor?name=${this.currentCanvasName}`],
          data: [{ key: 'canvasComponentData', value: this.canvasComponentData },
          { key: 'canvasData', value: this.canvasData }]
        }
        const obj2 = {
          action: 'emitEvent',
          urls: [`/DatasourceEditor?name=${this.currentCanvasName}`],
          name: 'setCanvasDataSourceList',
          data: this.canvasData.dataSource.parameters
        }
        bi.sharedWorker.postMessage(JSONfn.stringify(obj1))
        bi.sharedWorker.postMessage(JSONfn.stringify(obj2))
        return true
      },

      clearCanvas() {

        MessageBox.confirm('此操作将永久删除该文件, 是否继续?', '删除确认', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {

          const currentCanvasName = await DB.getItem('CurrentCanvasName')
          if (!currentCanvasName || !currentCanvasName.trim()) {
            return;
          }

          DB.removeItem('CurrentCanvasName');
          DB.removeItem(currentCanvasName);

          this.$store.commit('setCurComponent', { component: null, index: null });
          this.$store.commit('setCanvasComponentData', []);
          this.$store.commit('setCanvasName', '');
          this.$store.commit('recordSnapshot');

          for (let i = 0; i < this.canvasList.length; i++) {
            if (this.canvasList[i].name === currentCanvasName) {
              this.canvasList.splice(i, 1);
              break;
            }
          }

          if (this.canvasList.length > 0) {
            this.currentCanvasName = this.canvasList[0].name
            DB.setItem('CurrentCanvasName', this.currentCanvasName)
          }

          axios.get(`/BI-API/Component/DeleteCanvasTemplate?name=${currentCanvasName}`)

        }).catch(async () => {
          this.currentCanvasName = await DB.getItem('CurrentCanvasName')
        });

      },

      handlePreviewChange() {
        this.$store.commit('setEditMode', 'edit');
      },

      handleComponentListViewerChange() {
        this.$store.commit('setEditMode', 'edit');

        this.scale = this.scaleCopy;
        this.handleScaleChange();
      },

      inputCanvaName(event) {
        if (event.target.value === undefined || event.target.value === null || event.target.value.trim() === '') return;
        this.currentCanvasName = event.target.value;

        try {
          requestCanvasData.bind(this)(this.currentCanvasName);
        } catch (error) {
          console.error('数据绑定异常', error);
        }
      },

      // inputCanvaName(event) {
      //   if (!event.target.value || !event.target.value.trim()) return;

      // },
    },
  };
</script>

<style lang="less" scoped>
  .toolbar {
    padding: 15px 10px;
    white-space: nowrap;
    overflow-x: auto;
    background: #fff;
    border-bottom: 1px solid #ddd;
    display: flex;
    justify-content: flex-start;
    align-items: center;

    & .canvas-config {
      display: inline-block;
      margin-left: 10px;
      font-size: 14px;
      color: #606266;

      input {
        width: 50px;
        margin-left: 10px;
        outline: none;
        padding: 0 5px;
        border: 1px solid #ddd;
        color: #606266;
      }

      span {
        margin-left: 10px;
      }
    }

    & .insert {
      display: inline-block;
      line-height: 1;
      white-space: nowrap;
      cursor: pointer;
      background: #fff;
      border: 1px solid #dcdfe6;
      color: #606266;
      -webkit-appearance: none;
      text-align: center;
      box-sizing: border-box;
      outline: 0;
      margin: 0;
      transition: 0.1s;
      font-weight: 500;
      padding: 9px 15px;
      font-size: 12px;
      border-radius: 3px;
      margin-left: 10px;

      &:active {
        color: #3a8ee6;
        border-color: #3a8ee6;
        outline: 0;
      }

      &:hover {
        background-color: #ecf5ff;
        color: #3a8ee6;
      }
    }
  }

  /deep/ .el-dialog__body {
    padding: 0 15px;
  }

  /deep/ .el-dialog .el-dialog__header {
    text-align: left;
  }

  .dialog-footer {
    width: 100%;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    margin-top: 8px;
  }

  /deep/ .device-pc {
    background: url('@/assets/pc.png') center center no-repeat;
    background-size: 18px;

    &>i {
      visibility: hidden;
    }

  }

  /deep/ .device-mobile {
    background: url('@/assets/mobile.png') center center no-repeat;
    background-size: 18px;

    &>i {
      visibility: hidden;
    }

  }

  /deep/ .show-canvas-config-dialog {
    margin-left: 10px;
    background: url('@/assets/数据管理.png') center center no-repeat;
    background-size: 21px;

    &>i {
      visibility: hidden;
    }
  }

  /deep/ .ai-dialog-button {
    margin-left: 10px;
    background: url('@/assets/人机对话.png') center center no-repeat;
    background-size: 21px;

    &>i {
      visibility: hidden;
    }
  }

  .hr-edge-weak {
    border: 0;
    padding-top: 1px;
    background: linear-gradient(to right, transparent, #d0d0d5, transparent);
  }

  /deep/ .el-dialog__title {
    user-select: none;
  }
</style>
