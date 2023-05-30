
import md5 from "blueimp-md5"

enum STATE {
  // 未就绪
  NotReady = 0,
  // 就绪
  Ready = 1,
  // 运行中
  Running = 2,
  // 已删除
  Deleted = 3,
  // 任务执行异常
  Error = 4
}

class FunctionUtil {



  /**
     const test1 = `(a, b) => {
    console.log("当前组件1", b);
      console.log("当前组件2", this, a + 3);
      return 7 + a
    }`

    const codeString = `
      console.log("当前组件1", b);
        console.log("当前组件2", this, a + 3);
        return 7 + a
      `

    const p = ["a", "b"]
    const func = new Function(...p, codeString);
    const res = func.bind(this)(1, 5)
    console.log("当前组件1返回数据", res);
   */





  static createFunction(fun: any) {

    if (typeof fun === 'function') {
      return fun
    } else if (typeof fun === 'string') {
      return new Function('return ' + fun)();
    } else {
      return null
    }
  }

  static getParamNames(fun: any) {

    if (typeof fun !== 'function') {
      throw Error("参数fun必须是function类型")
    }

    let funStr = fun.toString();
    // let _param = fun.toString().match(/function\s*([^(].+[\)$])/)[1];
    // _param = _param.substring(this.getName().length + 1, _param.length-1);

    let paramNames = funStr.substring(funStr.indexOf('(') + 1, funStr.indexOf(')'));
    if (paramNames.length <= 0) return [];
    paramNames = paramNames.split(',').map(function (name: any) { // 清洗多余字符
      return name.match(/\w+/)[0]
    });

    return paramNames;
  }

  static getFunctionName(fun: any) {

    let _callee = fun.toString().replace(/[\s\?]*/g, ""),
      comb = _callee.length >= 50 ? 50 : _callee.length;
    _callee = _callee.substring(0, comb);
    let name = _callee.match(/^function([^\(]+?)\(/);
    if (name && name[1])
      return name[1];

    let caller = fun.caller,
      _caller = caller.toString().replace(/[\s\?]*/g, "");
    let last = _caller.indexOf(_callee),
      str = _caller.substring(last - 30, last);
    name = str.match(/var([^\=]+?)\=/);
    if (name && name[1])
      return name[1];

    return "anonymous"
  }

}

class Task {

  public interval: number = 30
  public immediate: boolean = true
  public name: string
  public onStop: Function | undefined
  public onError: Function | undefined
  public callback: Function
  public executions = 0 // 函数执行次数
  public state = STATE.Ready
  public timerIdList: Array<ReturnType<typeof setTimeout>> = []
  public error: any

  constructor(fun: Function, config: any | undefined) {

    function parseState(state: any): STATE {

      if (typeof state === 'string' && state === "NotReady") {
        return STATE.NotReady
      } else if (typeof state === 'string' && state === "Ready") {
        return STATE.Ready
      } else if (typeof state === 'string' && state === "Running") {
        return STATE.Running
      } else if (typeof state === 'string' && state === "Deleted") {
        return STATE.Deleted
      } else if (typeof state === 'string' && state === "Error") {
        return STATE.Error
      } else if (typeof state === 'number' && state === 0) {
        return STATE.NotReady
      } else if (typeof state === 'number' && state === 1) {
        return STATE.Ready
      } else if (typeof state === 'number' && state === 2) {
        return STATE.Running
      } else if (typeof state === 'number' && state === 3) {
        return STATE.Deleted
      } else if (typeof state === 'number' && state === 4) {
        return STATE.Error
      } else {
        return STATE.Ready
      }
    }

    this.name = md5(fun.toString())
    if (typeof config === 'number') {
      this.interval = config
    } else if (typeof config === 'string') {
      this.interval = parseInt(config)
    } else if (typeof config === 'object') {
      const { interval, immediate, name, onStop, onError, state } = config
      this.interval = parseInt(interval)
      this.immediate = immediate
      this.name = name
      this.onStop = onStop
      this.onError = onError as Function
      this.state = parseState(state)
    }

    this.callback = fun
  }

  execute() {

    return new Promise((resolve, reject) => {

      try {
        if (this.state != STATE.Ready)
          return reject(this)

        this.state = STATE.Running

        this.callback()

        this.executions++
        this.state = STATE.Ready
        return resolve(this)
      } catch (error) {
        this.state = STATE.Ready
        this.error = error
        return reject(this)
      }

    })
  }

  ready() {
    if (this.state == STATE.Ready) {
      console.warn("task already running", this);
      return
    }
    this.state = STATE.Ready
  }

  stop() {
    if (this.state == STATE.NotReady) {
      console.warn("task is stopped", this);
      return
    }
    this.state = STATE.NotReady
  }

  clearTimer() {
    while (this.timerIdList.length > 0)
      clearTimeout(this.timerIdList.splice(-1, 1)[0])
  }

}

class TaskScheduler {

  static taskMap = new Map<string, Task>()

  public static addTask(fun: Function, config: any): Task {

    // if (typeof config !== 'number' && typeof config !== 'object') {
    //     throw Error('argument config must be a number or an object')
    // }
    // if (typeof fun === 'string')
    //     fun = FunctionUtil.createFunction(fun)

    if (typeof fun !== 'function')
      throw Error('invalid argument [fun]')

    const task = new Task(fun, config)
    TaskScheduler.taskMap.set(task.name, task)
    return task
  }

  static runAllTask() {

    for (const iterator of TaskScheduler.taskMap) {
      const name = iterator[0]
      const task = iterator[1]

      if (isNaN(task.interval) || task.interval <= 0) {
        console.warn("the interval of the task is invalid", task);
        continue
      }

      if (task.state !== STATE.Ready)
        task.ready()
      const interval = task.interval
      if (task.immediate)
        task.interval = 0
      setTimeout(() => {
        TaskScheduler.runTask(task)
        task.interval = interval
      }, task.interval);

    }
  }

  static stopAllTask() {
    for (const iterator of TaskScheduler.taskMap) {
      const name = iterator[0]
      const task = iterator[1]
      task.stop()
    }
  }

  static runTask(task: Task | string) {

    if (typeof task === 'string')
      task = this.taskMap.get(task) as Task

    if (task.state != STATE.Ready) {

      task.onStop && task.onStop()
      if (task?.state == STATE.NotReady) {
      } else if (task?.state == STATE.Deleted) {
      }
      task.clearTimer()
      return
    }

    task.execute()
      .then(() => {
        while ((task as Task).timerIdList.length > 2)
          clearTimeout((task as Task).timerIdList.splice(-1, 1)[0]);
        (task as Task).timerIdList.push(setTimeout(() => TaskScheduler.runTask(task), (task as Task).interval))
      }).catch((task) => {
        task.state = STATE.Error
        task.onError && task.onError()
        task.clearTimer()
        task.stop()
        console.error("task scheduling exception", task);
      })
  }

  static stopTask(name: string) {
    const task = TaskScheduler.taskMap.get(name)
    if (task) {
      task.stop()
    } else {
      console.warn('not found task: ' + name);
    }
  }

  static deleteTask(name: string) {

    const task = TaskScheduler.taskMap.get(name)
    if (task) {
      task.state = STATE.Deleted
    } else {
      console.warn('not found task: ' + name);
      return false
    }
    return TaskScheduler.taskMap.delete(name)
  }

}

export default TaskScheduler
