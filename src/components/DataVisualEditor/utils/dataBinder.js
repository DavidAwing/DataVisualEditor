import * as DB from "../utils/indexDB";
import { getRandStr } from "../utils/utils";
import axios from 'axios'
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



`


// 解析数据配置表达式
// // const ttt = `This is a @test(a,b,c) and a @time(  ) expression.  @test2(a,  @b  ,   c)  @_AAAtest22222(a,  bddjj,  cff)  @test22222(a,  bddjj, @cff, ghhh,  @_o99  )  @test77777   @__test77777`;
// @test(a,b,c) 是函数,  @__test77777是变量
function extractExpressions(text) {
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
    const obj = { name: [], source: "", type: undefined, cron: undefined, jobName: undefined };
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      if (line.startsWith("//") || line.startsWith("#"))
        continue

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
          !/^(\*|[0-9-/,*]+)\s(\*|[0-9-/,*]+)\s(\*|[0-9-/,*]+)\s(\*|[0-9-/,*]+)\s(\*|[0-9-/,*]+)(\s(\*|[0-9-/,*]+))?$/i.test(line))) {
        // 是sql,http,cron
        obj.source += line.trim() + "\n";
      } else if ((i < 3) &&
        (/^(\*|[0-5]?\d)(\/\d+)?(\s+(\*|[01]?\d|2[0-3])(\/\d+)?){4}$/.test(line) || /^(\*|[0-9-/,*]+)\s(\*|[0-9-/,*]+)\s(\*|[0-9-/,*]+)\s(\*|[0-9-/,*]+)\s(\*|[0-9-/,*]+)(\s(\*|[0-9-/,*]+))?$/i.test(line))
      ) {
        // 是cron
        obj.cron = line;
      } else if ((i < 3) &&
        /^[\u4e00-\u9fa5a-zA-Z][\u4e00-\u9fa5a-zA-Z0-9]*(,[\u4e00-\u9fa5a-zA-Z][\u4e00-\u9fa5a-zA-Z0-9]*)*(,)?$/.test(line)) {
        // 是name
        obj.name = line.split(",");
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
    }

    if (obj.jobName === undefined)
      obj.jobName = getRandStr()
    obj.source = obj.source.substring(0, obj.source.length - 1)
    return obj;
  });

  return list.filter(item => item.type !== undefined && item.jobName !== undefined);
}

const jobList = []

function testTask(task) {

  return new Promise((resolve, reject) => {

    if (task.type === "http") {
      axios.get(task.source).then(data => {
        task.type = "get"
        resolve(task)
      }).catch(error => {
        const errorResponse = JSON.parse(JSON.stringify(error))
        if (errorResponse.status === 405)
          task.type = "post"
        else
          task.type = ""
        resolve(task)
      })
    }

  })

}

function commitData(store, task, response) {

  if (!task.componentType)
    return

  // todo: 匹配data中的name
  if (task.name.length == 0) {


  } else {

    console.log("数据2", task.componentType);

    for (let i = 0; i < task.name.length; i++) {
      const name = task.name[i];
      if (task.componentType === 'v-text') {
        store.commit("setCanvasComponentAttribute", [
          "data",
          {
            [name]: {
              text: response.data
            },
          },
        ]);
      }
    }

  }

}

// 数据绑定器
export function requestCanvasData(canvasName) {

  if (canvasName === undefined)
    canvasName = this.canvasName

  if (canvasName === undefined) {
    alert("未指定看板名称")
    return
  }

  // 这里一定要设置名称
  this.$store.commit("setCanvasName", canvasName);

  this.$nextTick(() => {

    setTimeout(() => {
      console.log("1画布数据1", this.canvasComponentData);
      console.log("1画布数据2", this.canvasData);
      console.log("1画布数据3", this.canvasName);
    }, 1000);

  })

  const getCanvasData = async (name) => {

    const canvasList = await DB.getAllItemByType("Canvas-Data");
    console.log("数据1");
    for (const data of canvasList) {

      if (data.name == name) {
        const canvasComponentData = JSONfn.parse(data.canvasComponentData);
        const canvasData = JSONfn.parse(data.canvasData);
        // 恢复画布
        this.$store.commit(
          "setCanvasComponentData",
          this.resetID(canvasComponentData)
        );
        this.$store.commit("setCanvasData", canvasData);
        const dataSource = canvasData.dataSource
        const sourceList = parseText(dataSource.parameters)
        console.log("任务列表", sourceList, canvasComponentData);

        sourceList.forEach(task => {

          for (let i = 0; i < canvasComponentData.length; i++) {
            const component = canvasComponentData[i];
            for (let j = 0; j < task.name.length; j++) {
              const name = task.name[j];
              if (component.data.name === name) {
                task.componentType = component.component
                break
              }
            }
          }
          testTask(task).then((task) => {

            if (task.componentType === undefined)
              return

            if (task.cron === undefined)
              task.cron = dataSource.cron
            schedule.cancelJob(task.jobName);
            const job = schedule.scheduleJob(
              task.jobName,
              task.cron,
              () => {

                if (task.type === "get" && task.source.startsWith("/")) {

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
                } else if (task.type === "post" && task.source.startsWith("/")) {

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
                } else if (task.type === "sql") {

                  console.log("执行sql");

                }

                // // 设置组件数据
                // this.$store.commit("setCanvasComponentAttribute", [
                //   "data",
                //   {
                //     [task.name[0]]: {
                //       text: task.name[0] + "==>" + new Date().toJSON()
                //     },
                //   },
                // ]);

              }
            )

            if (job != null) {
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
  };

  getCanvasData(canvasName);
}
