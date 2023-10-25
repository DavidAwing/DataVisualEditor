import React, { useState, useEffect } from 'react';
import '@chatui/core/es/styles/index.less';
import Chat, { Card, Bubble, useMessages, Message } from '@chatui/core';
// 引入样式
import '@chatui/core/dist/index.css';
import './index.css';

import MyCustomMessage1 from './CustomMessage'

console.log('MyCustomMessage1', MyCustomMessage1);

const initialMessages = [
  {
    type: 'text',
    content: { text: '主人好，我是智能助理，你的贴心小助手~' },
    user: { avatar: '//gw.alicdn.com/tfs/TB1DYHLwMHqK1RjSZFEXXcGMXXa-56-62.svg' },
  },
  // {
  //   type: 'image',
  //   content: {
  //     picUrl: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fsafe-img.xhscdn.com%2Fbw1%2Ff3d8f089-9856-4666-a2d7-f3e2cd3a9455%3FimageView2%2F2%2Fw%2F1080%2Fformat%2Fjpg&refer=http%3A%2F%2Fsafe-img.xhscdn.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1700117562&t=3ab951f60da1995178b6562016cebea6',
  //   },
  // },
  // {
  //   type: 'custom',
  //   content: {
  //     picUrl: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fsafe-img.xhscdn.com%2Fbw1%2Ff3d8f089-9856-4666-a2d7-f3e2cd3a9455%3FimageView2%2F2%2Fw%2F1080%2Fformat%2Fjpg&refer=http%3A%2F%2Fsafe-img.xhscdn.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1700117562&t=3ab951f60da1995178b6562016cebea6',
  //   },
  // },
];

// 定義一個 style變數
const numStyle = {
  margin: '0', // 如果不是純數字，就要用字串格式
  padding: 0,
  color: '#EE6464',
  fontSize: 60, // 加 px 就要使用字串，這裡 px 可用可不用
  width: '100%',
  backgroundColor: 'aqua'
}
const CustomMessage = <div className="custom-component" style={numStyle}><canvas id='testCanvas'></canvas></div >;


function MyCustomMessage2() {
  return (
    <div>
      <span>这是一个自定义组件</span>
    </div>
  );
}



// 默认快捷短语，可选
const defaultQuickReplies = [
  {
    icon: 'message',
    name: '联系人工服务',
    isNew: true,
    isHighlight: true,
  },
  {
    name: '短语1',
    isNew: true,
  },
  {
    name: '短语2',
    isHighlight: true,
  },
  {
    name: '短语3',
  },
];




export default function (props) {
  // 消息列表
  const { messages, appendMsg, setTyping } = useMessages(initialMessages);

  const onSendMsg = props.onSendMsg ?? function () {

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({ msg: '亲，您遇到什么问题啦？请简要描述您的问题~' })
      }, 500);
    })
  }


  useEffect(() => {
    // 这里的代码会在组件挂载后执行，相当于 componentDidMount
    // 你可以在这里进行一些初始化工作
    console.log('react测试 Component has mounted');

    const MessageContainer = document.getElementsByClassName('PullToRefresh-inner')[0]

    // 阻止浏览器默认的文件拖放行为
    MessageContainer.addEventListener('dragover', (e) => {
      e.preventDefault();
      MessageContainer.style.backgroundColor = 'AntiqueWhite';
    });

    MessageContainer.addEventListener('dragleave', () => {
      MessageContainer.style.backgroundColor = '';
    });

    // 处理文件拖放
    MessageContainer.addEventListener('drop', (e) => {
      e.preventDefault();
      MessageContainer.style.backgroundColor = '';

      const files = e.dataTransfer.files;

      onSendMsg({ type: 'file', content: files }).then(({ type, content }) => {

        appendMsg({
          type: type,
          content: { text: content },
        });
      })

      console.log('react测试 拖放了文件在上面', files);
    });



    // 如果需要在组件卸载时执行一些清理工作，可以返回一个清理函数
    return () => {
      // 这里的代码会在组件卸载时执行，相当于 componentWillUnmount
      console.log('react测试 Component will unmount');
    };
  }, []); // 这个空数组表示依赖项为空，只在组件挂载和卸载时执行


  // 发送回调
  function handleSend(type, val) {
    if (type === 'text' && val.trim()) {
      // TODO: 发送请求
      appendMsg({
        type: 'text',
        content: { text: val },
        position: 'right',
      });

      setTyping(true);

      onSendMsg({ type, content: val }).then(({ type, content }) => {

        appendMsg({
          type: type,
          content: { text: content },
        });
      })
    }
  }

  // 快捷短语回调，可根据 item 数据做出不同的操作，这里以发送文本消息为例
  function handleQuickReplyClick(item) {
    handleSend('text', item.name);
  }

  const [bk, setBk] = useState('red');
  setTimeout(() => {
    setBk('blue')
  }, 1000);

  function renderMessageContent(msg) {
    const { type, content } = msg;

    // 根据消息类型来渲染
    switch (type) {
      case 'text':
        return <Bubble content={content.text} />;
      case 'image':
        return (
          <Bubble type="image">
            <img src={content.picUrl} alt="" />
          </Bubble>
        );
      case 'custom':

        return (
          // <Bubble content={CustomMessage} />
          // <Bubble content={<MyCustomMessage />} />

          // OK

          <Bubble type="custom">
            <MyCustomMessage1 bk={bk} />
          </Bubble>
        )
      default:
        return null;
    }
  }

  return (
    <Chat
      // navbar={{ title: '智能助理' }}
      messages={messages}
      renderMessageContent={renderMessageContent}
      // quickReplies={defaultQuickReplies}
      onQuickReplyClick={handleQuickReplyClick}
      onSend={handleSend}
    />
  );
}


//
