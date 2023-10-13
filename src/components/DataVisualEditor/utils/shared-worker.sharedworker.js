// 计时器
let counter = 0
let ports = [] // 存储所有连接端口的数组



// 监听连接
self.addEventListener('connect', (e) => {

  const port = e.ports[0]

  ports.push(port)

  port.onmessage = (res) => {
    ports.forEach((p) => {
      p.postMessage(res.data)
    })
  }
})



