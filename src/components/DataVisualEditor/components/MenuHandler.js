import toast, { toastClose } from '../utils/toast';
import * as DB from '../utils/indexDB';
import md5 from 'blueimp-md5';
import axios from 'axios';
import { toImage } from '../utils/domUtils';
import eventBus from '../utils/eventBus';


const JSONfn = require('jsonfn').JSONfn;



export function saveCanvas(canvasName, canvasComponentData, canvasData) {


  if (!canvasName) {
    toast('请设置画布名称...');
    return false;
  }


  canvasData.datetime = window.bi.utils.format(new Date(), 'YYYY/MM/DD HH:mm:ss');
  DB.getItem(`bi-user-canvas-data-source-${canvasName}`).then(userCanvasDataSource => {
    if (userCanvasDataSource) {
      canvasData.dataSource.parameters = userCanvasDataSource;
      DB.removeItem(`bi-user-canvas-data-source-${canvasName}`);
    }

    if (typeof canvasComponentData !== 'string') {
      canvasComponentData = JSONfn.stringify(canvasComponentData);
    }
    if (typeof canvasData !== 'string') {
      canvasData = JSONfn.stringify(canvasData);
    }

    const systemVersion = window.bi.version;
    const checkCode = md5(canvasComponentData + '@|||@' + canvasData + '@|||@' + systemVersion);

    const canvasEditorData = {
      type: 'Canvas-Data',
      name: canvasName,
      canvasComponentData: canvasComponentData,
      canvasData: canvasData,
      systemVersion: systemVersion,
      modifyTime: new Date().toString(),
      checkCode: checkCode,
    };

    DB.setItem(canvasName, canvasEditorData);
    axios.post(`/BI-API/Component/SaveCanvasTemplate?name=${canvasName}`, canvasEditorData, {
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(response => {
      if (response.status == 200) {
        toast('模板保存成功', 'success');
      }
    }).catch(error => {
      const errorResponse = JSON.parse(JSON.stringify(error));
      console.warn('保存数据异常', errorResponse);
    });

    // 保存图片
    toImage(document.getElementById('editor')).then(image => {
      axios.post(
        `/BI-API/Component/SaveCanvasTemplateImage?name=${canvasName}`,
        image.substring('data:image/png;base64,'.length),
        {
          headers: {
            'Content-Type': 'text/plain',
          },
        }
      );
    });

    eventBus.$emit('saveEvent', canvasName, canvasEditorData);
  });

  return true;
}
