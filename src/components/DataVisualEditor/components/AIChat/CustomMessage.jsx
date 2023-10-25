import React from 'react';

function CustomMessage(props) {
  const numStyle = {
    margin: '0', // 如果不是純數字，就要用字串格式
    padding: 0,
    color: '#EE6464',
    fontSize: 60, // 加 px 就要使用字串，這裡 px 可用可不用
    width: '100%',
    backgroundColor: props.bk
  }




  function handleClick() {
    // 处理单击事件
  }

  function handleMouseEnter() {
    // 处理鼠标进入事件
    console.log('鼠标进入');
  }


  return (
    <div className="custom-component" style={numStyle} onMouseEnter={handleMouseEnter}>
      {/* <canvas id="testCanvas"></canvas> */}
      1111
    </div>
  );
};

export default CustomMessage;



// class MyComponent extends React.Component {
//   handleClick() {
//     // Use this.setState to update the component
//   }

//   render() {
//     return <button onClick={this.handleClick.bind(this)}>Click me!</button>;
//   }
// }


// 作者：圆太
// 链接：https://www.zhihu.com/question/570485625/answer/2788613908
// 来源：知乎
// 著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。


// class MyComponent extends React.Component {
//   constructor(props) {
//     super(props);
//     this.handleClick = this.handleClick.bind(this);
//   }

//   handleClick() {
//     // Use this.

// 作者：圆太
// 链接：https://www.zhihu.com/question/570485625/answer/2788613908
// 来源：知乎
// 著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
