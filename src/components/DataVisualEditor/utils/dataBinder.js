import * as DB from "../utils/indexDB";
import { getRandStr } from "../utils/utils";
import { CompileToModule, CompileTypescriptToIIFE, codeToInstance } from "../utils/compiler";
import CronExpressionValidator from "../utils/CronExpressionValidator";
import axios from 'axios'
import toast from "./toast";
// import cron from 'cron-validate'
const JSONfn = require("jsonfn").JSONfn;
const schedule = require("node-schedule");


const a = `
#你好啊
bbb,ccc
/select * from user


bb33b,ccc333
/select/rom/user

aaa,ccc
select * from user

[请求字符串每个请求]
ttt,sdf大师风范更多
*/23 * * * * *
select * from user
select * from user22222222

ttt2222的方式,sdf大师风范更多2222,
*/2 * * * * *
select * from user22222

ttt6666,sdf大师风范更多6666,
select * from user22222
select * from 士大夫士大夫士大夫



*/26 * * * * *
select * from user22222

ddd
select * from name

http士大夫士大夫大师傅


https://chat.openai.com/chat/3a780546-a1ba-43e3-8f60-48477bdc7121

帆帆帆帆
http://chat.openai.com/chat/3a780546-a1ba-43e3-8f60-48477bdc7121



KNPMCTeFywVLXRc
http://172.16.2.40:9096/#/project




[执行方法任务]
FMaCdstbaGGgThs
*/1 * * * * *
SCRIPT*AttributeEvent/testTask.js*Test2



`

// 解析数据配置表达式
// // const ttt = `This is a @test(a,b,c) and a @time(  ) expression.  @test2(a,  @b  ,   c)  @_AAAtest22222(a,  bddjj,  cff)  @test22222(a,  bddjj, @cff, ghhh,  @_o99  )  @test77777   @__test77777`;
// @test(a,b,c) 是函数,  @__test77777是变量
const extractExpressions = (text) => {
  // const regex = /(\$|@)[a-zA-Z_]+\s*\((\s*[^),]*\s*,)*(\s*[^),]*\s*)?\)/g;
  const expressions = [];

  const regex = /@([a-zA-Z_0-9]+)(\((\s*[\w@]*\s*,?)*\))?/g;
  let match;
  while ((match = regex.exec(text)) !== null) {
    const name = match[1];

    const expression = match[0];
    const type =
      /^@[a-zA-Z_0-9]\w*\(\s*([a-zA-Z_0-9@]\w*(\s*,\s*[a-zA-Z_0-9@]\w*)*)?\s*\)/g.test(
        expression
      )
        ? "function"
        : "variable";

    let parameters;
    if (type === "function") {
      let str = match[2].trim();
      str = str.substring(1, str.length - 1);
      if (str != null && str.trim() !== "") {
        parameters = str.split(",").map((param) => param.trim());
      }
    }

    expressions.push({
      type,
      name,
      parameters,
      expression,
    });
  }
  return expressions;
}

function parseText(text) {

  const groups = text.split(/\n{2,}/g); // 将文本分割成组
  const list = groups.map((group) => {

    const lines = group.trim().split("\n"); // 将组分割成行
    const obj = { element: {}, source: "", type: undefined, cron: undefined, jobName: undefined, message: "" };
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      if (line.startsWith("//") || line.startsWith("#")) {
        // obj.annotation += line.trim() + "\n"
        continue
      }

      // console.log("验证字符串", CronExpressionValidator.validateCronExpression(line), line);

      if ((i === 0) && /^\[[^\]]+\]$/.test(line)) {
        obj.jobName = line.substring(1, line.length - 1);
      } else if ((i < 3) &&
        (/^select\b/i.test(line) ||
          /^insert\b/i.test(line) ||
          /^update\b/i.test(line) ||
          /^delete\b/i.test(line) ||
          /^https?:\/\//i.test(line) ||
          /^http?:\/\//i.test(line) ||
          /^\/(?!$)[^/]/.test(line) ||
          /^(\d{1,3}\.){3}\d{1,3}/.test(line)) &&
        (!/^(\*|[0-5]?\d)(\/\d+)?(\s+(\*|[01]?\d|2[0-3])(\/\d+)?){4}$/.test(line) &&
          !/^(\*|[0-9-/,*]+)\s(\*|[0-9-/,*]+)\s(\*|[0-9-/,*]+)\s(\*|[0-9-/,*]+)\s(\*|[0-9-/,*]+)(\s(\*|[0-9-/,*]+))?$/i.test(line)) &&
        !line.startsWith("SCRIPT*")
      ) {
        // 是sql,http,cron
        obj.source += line.trim() + "\n";
      } else if ((i < 3) &&
        (/^(\*|[0-5]?\d)(\/\d+)?(\s+(\*|[01]?\d|2[0-3])(\/\d+)?){4}$/.test(line) ||
          /^(\*|[0-9-/,*]+)\s(\*|[0-9-/,*]+)\s(\*|[0-9-/,*]+)\s(\*|[0-9-/,*]+)\s(\*|[0-9-/,*]+)(\s(\*|[0-9-/,*]+))?$/i.test(line) ||
          CronExpressionValidator.validateCronExpression(line)
        ) &&
        !line.startsWith("SCRIPT*")
      ) {
        // 是cron
        obj.cron = line;
      } else if ((i < 3) &&
        /^[\u4e00-\u9fa5a-zA-Z][\u4e00-\u9fa5a-zA-Z0-9]*(,[\u4e00-\u9fa5a-zA-Z][\u4e00-\u9fa5a-zA-Z0-9]*)*(,)?$/.test(line) &&
        !line.startsWith("SCRIPT*")) {
        // 是name
        line.split(",").forEach(name => {
          name = name.trim()
          if (name === "")
            return
          obj.element[name] = {};
        });
      } else if (line.startsWith("SCRIPT*")) {
        obj.source = line
      } else {
        obj.source += line.trim() + "\n";
      }
    }

    const source = obj.source;
    if (
      // 匹配SQL语句的关键词
      /^select\b/i.test(source) ||
      /^insert\b/i.test(source) ||
      /^update\b/i.test(source) ||
      /^delete\b/i.test(source)
    ) {
      obj.type = "sql";
    } else if (
      /^https?:\/\//i.test(source) ||
      /^http?:\/\//i.test(source) ||
      /^(\d{1,3}\.){3}\d{1,3}/.test(source) ||
      /^\/(?!$)[^/]/.test(source)
    ) {
      // 匹配URL的正则表达式
      obj.type = "http";
    } else if (source.startsWith("SCRIPT*")) {
      obj.source = source.trim().substring("SCRIPT*".length);
      obj.type = "script"
    }

    if (obj.jobName === undefined)
      obj.jobName = getRandStr()  // todo 不能用随机字符串
    obj.source = obj.source.trim()

    if (obj.cron === undefined) {

    }

    return obj;
  });

  return list.filter(item => item.type !== undefined && item.jobName !== undefined);
}

const jobList = []

function testTask(task) {

  return new Promise((resolve, reject) => {
    if (task.type === "http" && task.source.startsWith("/")) {
      axios.get(task.source, {
        timeout: 1000 * 60 * 3
      }).then(data => {
        task.type = "get"
        resolve(task)
      }).catch(error => {
        const errorResponse = JSON.parse(JSON.stringify(error))
        if (errorResponse.status === 405) {
          task.type = "post"
        } else {
          task.message = errorResponse
        }
        resolve(task)
      })
    } else {
      resolve(task)
    }
  })

}

function commitData(store, task, response) {

  if (response.data.headers === undefined &&
    response.data.request === undefined &&
    response.data.status === undefined &&
    typeof response === 'object' &&
    typeof response.name === "string") {
    const { attributeName, name, data } = response
    store.commit("setCanvasComponentAttribute", [
      attributeName,
      name,
      data
    ]);
  } else {
    const data = response.data.data
    if (Array.isArray(data)) {
      data.forEach(({ attributeName, name, data }) => {
        store.commit("setCanvasComponentAttribute", [
          attributeName,
          name,
          data
        ]);

      })
    }
  }
  // todo: 匹配data中的name
}

// 数据绑定器
export function requestCanvasData(canvasName, callback) {

  if (canvasName === undefined) {
    console.warn("未设置看板名称");
    return
  }

  // 这里一定要设置名称
  this.$store.commit("setCanvasName", canvasName);

  const getCanvasData = async (name, callback) => {

    const canvasList = await DB.getAllItemByType("Canvas-Data");

    let hasName = false
    if (canvasList !== undefined && canvasList !== null && canvasList.length > 0) {
      for (const data of canvasList) {
        if (data.name === name) {
          if (data.checkCode !== undefined) {
            const response = await axios.get(`/BI/Component/GetCanvasCheckCode?name=${name}`)
            if (response !== undefined && response.data !== undefined) {
              const code = response.data.data
              if (data.checkCode !== code) {
                hasName = false
                break
              }
            }
          }
          hasName = true
          const canvasData = JSONfn.parse(data.canvasData);
          const canvasComponentData = JSONfn.parse(data.canvasComponentData);

          // 恢复画布
          this.$store.commit(
            "setCanvasComponentData",
            this.resetID(canvasComponentData)
          );
          this.$store.commit("setCanvasData", canvasData);
          const dataSource = canvasData.dataSource
          const sourceList = parseText(dataSource.parameters)
          // console.log("任务列表1", sourceList);
          sourceList.forEach(task => {
            // console.log("任务列表D1", task);
            for (let i = 0; i < canvasComponentData.length; i++) {

              let component = canvasComponentData[i];
              if (component.component === "Group")
                component = component.propValue.find(item => Object.keys(task.element).includes(item.data.name))
              if (component === undefined || component === null)
                continue
              const element = task.element[component.data.name]
              if (element === undefined || element === null)
                continue
              element.componentType = component.component
              if (element.componentType === "vc-chart") {
                console.log("图表组件22", component);
                console.log("图表组件33", component.data.option.series);
              }
            }

            // 合并任务
            console.log("任务列表2", task);
            testTask(task).then((task) => {

              if (task.cron === undefined)
                task.cron = dataSource.cron

              if (task.type === "get") {
                task.call = () => {
                  axios.get(task.source).then(response => {
                    if (response.status !== 200 || !response) {
                      console.error(task, response);
                      return
                    }
                    commitData(this.$store, task, response)
                  }).catch(error => {
                    const errorResponse = JSON.parse(JSON.stringify(error))
                    console.warn("任务执行报错", task, errorResponse);
                  })
                }
              } else if (task.type === "post") {

                task.call = () => {
                  axios.post(task.source).then(response => {
                    if (response.status !== 200 || !response) {
                      console.error(task, response);
                      return
                    }
                    commitData(this.$store, task, response)
                  }).catch(error => {
                    const errorResponse = JSON.parse(JSON.stringify(error))
                    console.warn("任务执行报错", task, errorResponse);
                  })
                }

              } else if (task.type === "script") {

                task.call = () => {

                  if (task.method === undefined || task.method === null) {

                    if (task.method === null)
                      return
                    const arr = task.source.trim().split("*")
                    const scriptPath = arr[0].trim()
                    const methodName = arr[1]
                    task.method = null



                    axios.get("/BI/Component/GetScript", {
                      params: {
                        name: scriptPath,
                      },
                      timeout: 6000,
                    })
                      .then(({ data }) => {
                        if (data.state !== 200) {
                          console.warn("执行任务获取脚本异常", data);
                          return
                        }

                        codeToInstance(scriptPath, data.data).then(instance => {
                          let method = null
                          if (Object.prototype.toString.call(instance) === "[object Module]") {
                            if (methodName === undefined || methodName === null) {
                              method = instance.default.bind(this)
                            } else if (Object.prototype.toString.call(methodName) === "[object String]" &&
                              Object.prototype.toString.call(instance[methodName]) === "[object Function]") {
                              method = instance[methodName].bind(this)
                            } else {
                            }
                          } else if (Object.prototype.toString.call(instance) === '[object Function]') {
                          } else if (Object.prototype.toString.call(module.default) === '[object Object]') {
                          }

                          if (method === null) {
                            console.error(`找不到任务执行的方法`, "方法名: " + methodName, "实例类型: " + Object.prototype.toString.call(instance), "代码: " + data.data);
                            return
                          }

                          task.method = method
                        })

                      })
                      .catch((error) => {
                        console.error(`${scriptPath}脚本异常: `, error);
                      });
                  } else {

                    console.log("任务AAA1");

                    const response = task.method()



                    if (Object.prototype.toString.call(response) === "[object Promise]") {
                      response.then(data => {
                        commitData(this.$store, task, data)
                      }).catch(error => {
                        console.error(`执行script任务异常`, task, error);
                      })
                    } else {
                      commitData(this.$store, task, response)
                    }

                  }
                }

              } else {
                task.call = () => {
                  axios.post("/BI/CronJob/RequestData", task).then(response => {
                    if (response === undefined || response === null || response.status !== 200) {
                      console.error("任务执行报错1", task, response);
                      return
                    }
                    commitData(this.$store, task, response)
                  }).catch(error => {
                    const errorResponse = JSON.parse(JSON.stringify(error))
                    console.warn("任务执行报错2", task, errorResponse);
                  })
                }
              }

              schedule.cancelJob(task.jobName);
              const job = schedule.scheduleJob(
                task.jobName,
                task.cron,
                task.call
              )

              if (job !== null && job !== undefined) {
                job.invoke();
                jobList.push(job)
              }

            })

          });

          // const job = schedule.scheduleJob(
          //   jobName,
          //   dataSource.cron,
          //   () => {
          //     console.log("todo请求数据,绑定数据");
          //     // 设置组件数据
          //     this.$store.commit("setCanvasComponentAttribute", [
          //       "data",
          //       {
          //         aaa: {
          //           text: new Date().toJSON()
          //         },
          //       },
          //     ]);
          //     console.log(new Date().toJSON() + "  定时任务运行完毕!  " + this.canvasName);
          //   }
          // );

          return;
        }
      }
    }

    if (!hasName) {

      axios.get(`/BI/Component/GetCanvasTemplate`, {
        params: {
          name: name,
        },
        timeout: 1000 * 60 * 30,
      })
        .then(({ data }) => {
          if (data.state !== 200) {
            callback(false, data)
            return
          }
          DB.setItem(name, JSON.parse(data.data)).then(() => {
            getCanvasData(name);
          }).catch((error) => {
            toast("浏览器数据保存异常")
            console.error("getCanvasData|浏览器数据保存异常", error);
          })
        })
        .catch((error) => {
          console.error("getCanvasData|indexDB保存数据异常", JSON.stringify(error));
          callback(false, error)
        });
    }
  };

  getCanvasData(canvasName, callback);
}
