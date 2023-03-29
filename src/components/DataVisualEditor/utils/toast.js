import { Message } from 'element-ui'

let messageList = []


function toastClose() {
  for (let i = 0; i < messageList.length; i++) {
    messageList[i].close();
  }
  messageList = [];
}

function toast(message = '', type = 'error', duration = 1500) {
  const instance = Message({
    message,
    type,
    duration,
  })
  messageList.push(instance)
}

window.toast = toast;

export default toast;
export { toastClose };
