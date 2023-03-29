//引入mockjs
import Mock from 'mockjs'




//使用mockjs模拟数据
Mock.mock('/test', {
  "res": 0,
  "data":
  {
    "datatime": "@datetime",//随机生成日期时间
    "weekday|1-7": 7,//随机生成1-7的数字
    "name": "@cname",//随机生成中文名字
  }
});


Mock.mock('/getTestData', {
  "state": 200,
  "data": {

    textTest: "测试数据",
    tableData: {

    }

  }
});

