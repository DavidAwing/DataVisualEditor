import Vue from 'vue'
import axios from 'axios'
import Cookie from 'js-cookie'

// 跨域认证信息 header 名
const xsrfHeaderName = 'Authorization'

axios.defaults.timeout = 60000
axios.defaults.withCredentials = true
axios.defaults.xsrfHeaderName = xsrfHeaderName
axios.defaults.xsrfCookieName = xsrfHeaderName

// 认证类型
const AUTH_TYPE = {
  BEARER: 'Bearer',
  BASIC: 'basic',
  AUTH1: 'auth1',
  AUTH2: 'auth2',
}


// http method
const METHOD = {
  GET: 'get',
  POST: 'post'
}

/**
 * axios请求
 * @param url 请求地址
 * @param method {METHOD} http method
 * @param params 请求参数
 * @returns {Promise<AxiosResponse<T>>}
 */
 function request(url, method, params, config) {
  switch (method) {
    case METHOD.GET:
      return axios.get(url, { params }, config)
    case METHOD.POST:
      return axios.post(url, params, config)
    default:
      return axios.get(url, { params }, config)
  }
}

export function get(url, param, config) {
  if (config === undefined) {
    config = {}
    config.timeout = 6000
  }

  url = url
  return request(url, METHOD.GET, param, config)
}

export function post(url, param, config) {
  if (config === undefined) {
    config = {}
    config.timeout = 6000
  }

  url = url
  return request(url, METHOD.POST, param, config)
}

