
所有的组件配置都在src\components\DataVisualEditor\custom-component\component-list.js文件中list中



多屏编辑模式



## <font color="#fb0">样式: </font><br />

 


## <font color="#fb0">事件: </font><br /> 

每个组件的events属性,挂载了vue的8个生命周期方法
beforeCreate created 
beforeMount mounted 
beforeUpdate updated 
beforeDestroy destroyed 
组件需要实现对应的方法,规则是方法名onBeforeCreate对应beforeCreate周期.


### <font color="#fb0">内部机制: </font><br /> 
 

## <font color="#fb0">动画: </font><br /> 


## <font color="#fb0">数据: </font><br /> 

1. 文本: 支持变量替换,支持html
2. 简单表格:  表头, 行数据, 表尾数据
    单元格显示: 文本

3. 复杂表格:  表头, 行数据, 表尾数据, 表行合并配置, 表行合并数据 







画布: 画布组件数据, 画布的数据



分层, 一个函数只干一件事,心智负担




数据来源: http接口, sql, 数据手动绑定(类似)


画布图层
画布元素列表

分栏组件

表格滚动

宏变量替换
@val

函数调用
$time()







Cron表达式范例：

每隔5秒执行一次：*/5 * * * * ?

每隔1分钟执行一次：0 */1 * * * ?

每天23点执行一次：0 0 23 * * ?

每天凌晨1点执行一次：0 0 1 * * ?

每月1号凌晨1点执行一次：0 0 1 1 * ?

每月最后一天23点执行一次：0 0 23 L * ?

每周星期天凌晨1点实行一次：0 0 1 ? * L

在26分、29分、33分执行一次：0 26,29,33 * * * ?

每天的0点、13点、18点、21点都执行一次：0 0 0,13,18,21 * * ?

  


值得参考: https://github.com/pengxiaotian/datav-vue

好看的边框,源码引入:
https://github.com/DataV-Team/Datav
http://datav.jiaminghi.com/guide/


编译器
https://babeljs.io/repl/
https://babeljs.io/docs/


地图组件

todo 组件的底部放置菜单按钮,  [控件]  [图层] [配置] [菜单]   

鼠标右键:   复制了时, 画布上,组件上, 多选时, group上

组件保存为新的定制组件

增加隐藏功能
收缩
------------------------------------------------------BI引擎组件------------------------------------------------------

事件管理器: 事件总线,事件注册,事件调度,dom事件

任务调度器: 任务执行,调度

视图渲染器: 组件渲染,页面渲染

数据管理器: indexDB, vuex数据

组件管理: 

监控: 性能监控,异常监控,设备监控

日志: 
 
解析器: css解析,less解析,配置解析,响应数据解析,数据验证,cron表达式解析生成,表达式树求值,字符串解析求值,规则解析
 
通讯: socket, http, gRPC, 实时交互, 数据请求, 数据分发

数据分析: 

资源管理器: 字体,模板,

分布式数据存储: 

模板升级:
 
vue指令系统

vue编译器

--------------------------------------------------------------------------------------------------------------