import axios from 'axios'
import qs from 'qs'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  // headers: { "Authorization": "Basic RU1hY3JvOkVNYWNybw==", "Content-Type": "application/json;charset=UTF-8" },
  timeout: 30000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation

      (config.headers as any)['X-Token'] = getToken();
    }
    return config
  },
  error => {
    // do something with request error
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {

    try {
      if (response.config.responseType === 'stream' || response.config.responseType === 'arraybuffer' || response.config.responseType === 'blob') {
        return Promise.resolve(response)
      }
    } catch (error) {
      return Promise.reject(error)
    }

    const res = response.data
    if (response.request.responseURL.indexOf(process.env.VUE_APP_BASE_API + "/requestWebServices") !== -1) {
      return response
    }

    if (response.status === 200 && response.request.responseURL.indexOf("/EMacroApi") !== -1) {
      return Promise.resolve(response)
    }

    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 20000) {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 15 * 1000
      })
      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // to re-login
        MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
          confirmButtonText: 'Re-Login',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('err', error)
    // Message({
    //   message: error.message,
    //   type: 'error',
    //   duration: 5 * 1000
    // })
    return Promise.reject(error)
  }
)


// 请求服务
function requestWebServices(cmd: any, stationId: string, param: string) {
  return service({
    url: '/requestWebServices',
    method: 'get',
    params: {
      cmd: cmd,
      stationId: stationId,
      param: param
    }
  })
}

export function requestCommand(
  cmd: any,
  stationId: string,
  param: string
) {
  return new Promise((resolve, reject) => {
    requestWebServices(cmd, stationId, param).then(response => {
      const {
        data
      } = response
      if (!data) {
        reject(new Error('requestWebServices failed.'))
      }
      resolve(data)
    }).catch(error => {
      reject(error)
    })
  })
}





// 请求微信form-data接口
function _postWeixin(formData: FormData) {

  const config = {
    headers: { "Content-Type": "multipart/form-data;boundary=----WebKitFormBoundaryn" + new Date().getTime() }
  };
  return axios.post(process.env.VUE_APP_BASE_API + '/post_weixin', formData, config)

  // 下面的应该也可以,错误是因为nginx

  //   return axios.create({
  //     method: 'post',
  //     baseURL:  process.env.VUE_APP_BASE_API,
  //     url:'/weixin',
  //     headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  //     data: formData
  //  })


  // return service({
  //   method: 'post',
  //   url: '/weixin',
  //   headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  //   // processData: true,
  //   // contentType: true,
  //   data: formData
  // })

  // return axios.post( process.env.VUE_APP_BASE_API + '/weixin', formData, {
  //   headers: {
  //     "Content-Type": "multipart/form-data; boundary=----WebKitFormBoundaryn8D9asOnAnEU4Js0"
  //   }
  // })

}

function _getWeixin(url: string) {

  return axios.get(process.env.VUE_APP_BASE_API + '/get_weixin' + url)
}

export function requestWeixin(
  cmd: any,
  stationId: string,
  param: string,
  file: string,
  fileName: string
) {
  return new Promise((resolve, reject) => {

    if (cmd && stationId && param && fileName) {

      const formData = new FormData();
      formData.append('cmd', cmd);
      formData.append('stationId', stationId);
      formData.append('param', param);
      if (fileName) {
        formData.append('file', file, fileName);
      }
      _postWeixin(formData).then(response => {
        const {
          data
        } = response
        if (!data) {
          reject(new Error('requestWeixin failed.'))
        }
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    } else {
      _getWeixin(cmd).then(response => {
        const {
          data
        } = response
        if (!data) {
          reject(new Error('requestWeixin failed.'))
        }
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    }
  })
}


// 选择文件
export function selectFile(_options: any) {
  return new Promise((resolve, reject) => {
    const options = {
      accept: '*/*',
      multiple: true
    }
    if (_options) {
      options.accept = _options.accept
      options.multiple = _options.multiple
    }
    const el = document.createElement('input')
    el.type = 'file'
    el.accept = options.accept
    el.multiple = options.multiple
    el.addEventListener('change', _ => {
      // options.multiple
      resolve(el.files)
    })
    el.click()
  })
}


export default service
