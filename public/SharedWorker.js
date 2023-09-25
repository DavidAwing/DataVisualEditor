// 计时器
let counter = 0
let ports = [] // 存储所有连接端口的数组

// 监听连接
self.addEventListener('connect', (e) => {
  const port = e.ports[0]
  // 把端口对象存起来
  ports.push(port)

  // 监听消息
  port.onmessage = (res) => {
    console.log('共享线程接收到信息：', res)
    switch (res.data) {
      case 'counter++':
        counter++
        break
    }
    console.log('当前counter:', counter)

    // 向所有端口广播
    ports.forEach((p) => {
      p.postMessage(counter)
    })
  }
})
