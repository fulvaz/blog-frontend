# ad-frontend-base for React

Warning: 为了自己的人身安全, 千万不要改 webpack 配置, 否则你将会受到同事的毒打

Love and peace -> [~~改 webpack 配置可能会导致的问题~~](https://www.hblady.com/wp-content/uploads/2018/08/c61cddeb1aa4722d2de6c3a020ba413f.mp4)

## 这个项目是什么

这个项目由 create-react-app(CRA)创建, 集成了 antd UI 库与 dva 作为状态管理工具

但由于需要支持 less, 这里对原来的初始项目进行了 eject, 然后修改 webpack 配置.

## 规范

### 命名

- 文件名: 帕斯卡命名如`ReservationCard.tsx`, `ReservationCard.module.less`
- 组件类名称: 帕斯卡命名, 如`ReservationCard`, 当你在一个文件引入一个组件的类时, 应写作: `import ReservationCard from './ReservationCard';`

ps: react 内没有 pipe, directive 概念, 所以不需要在后面添加 component
ps2: 对组件的样式文件名需要加上 module, 否则无法使用模块化

### 属性

一行一个属性, 如:

```tsx
<Foo superLongParam="bar" anotherSuperLongParam="baz" />
```

ps: `visual code`安装`prettier`插件, 然后格式化(alt+f)即可

### 项目结构

TODO: 需要验证当前结构是否适合业务开发

## 开发

npm run start

## 发布

TODO: 发布工具开发中

## 样式

请务必使用 css module, 以实现样式封装, 请不要把组件样式放在全局

推荐使用 less 或者 css, 原因是 less 兼容 css 和 scss 的语法, 而且可以避免被 node-sass 折磨. (当前版本暂未移除 sass 依赖, 不排除以后哪天会移除, 推荐使用 less 降低迁移成本)

classname lib

## 状态管理dva

和 redux 差不多, 使用这个而不是 redux 的原因是 dva 帮我们封装了大量繁琐的 redux api, 平滑了学习曲线, 可以快速上手写业务.

ps: dva 本质是对 redux, react-router, react 的"封装", 然后把 redux 和 react-router 的 api 直接暴露出来, 对 react 修改的部分也极少. 如果你需要深入理解 react 生态, 还是要自己去学习一下 redux 和 react-router 的.

### 定义一个model

见dva文档(dva上手很快, 请花一点时间看一下文档)

### 如何在组件中使用这些状态

为组件添加这样的一个装饰器

```
@connect(state => {
  console.log(state);
  // global, sidebar是命名空间
  cosnt {global, sidebar} = state;
  return {global, sidebar}
  /*
   * global: {count: 0}, // 你注册了一个namespace为global的model, count是model的状态
   * sidebar: {data: [], title: ""}, // 另一个namespace为sidebar的model
  */
})
class Component extends React.Component {
  render() {
    // 用过this.props可以访问到model的属性

    this.props.global.propOfGlobal

    this.props.sidebar.propOfSidebar
  }

}

```

### 什么状态不应该放在model中?

离开页面后需要重置的状态: 如表单填写的数据, filter的状态

TODO: 结合项目实践补充

ps: 实际上不需要共享的状态全部放model还是放component到现在都没有定论, 但dva的生态似乎默认你的数据都在model上, 如dva-loading. 鉴于此, 我们可以借鉴他们的设计. 这里只列出非常糟糕的设计.

## router

由于使用 dva 的内部 router, 即从`dva/router`引入路由相关的api

Route 必须是 Router 的子元素, 否则会无法正常导航 (nested route 还没测试)

## 环境变量

### 定义
在`.env`以`REACT_APP_`开头的变量名.

比如定义了`REACT_APP_VAR=123`

### 使用

```
console.log(process.env.REACT_APP_VAR); // 123
```



## iframe

这是我们实现从angular平稳过渡react的方案

### 白名单检查

为了保证通用, iframe的src暴露在url中, 虽然进行了base64编码, 但毕竟是掩耳盗铃, 容易导致安全问题.

因此`IFrame.tsx`内有一个白名单列表, 非这个列表内的地址不会跳转. 写新项目时你可能需要在自己的项目里面维护这个列表

ps: 由于使用自带的base64编码解码, 不支持ascii表以外的字符

### 如何进行通信

p = Parent, 指这个框
c = Child, 指嵌入的 iframe

p 这边使用了一个组件对通信进行封装, 每次修改 IframeComm 的 postMessageData 属性时, 就会想 c 发送内容为 postMessageData 的信息

### iframe如何部署

c 端需要在页面中添加

```js

window.addEventListener('message', (e) => {
    console.log(e);
    // 1. 这里需要检查e.origin是否合法
    // 2. 根据传过来的e.data进行相应的处理
})
```

这样便可以监听到来自parent的信息

TODO: 需要补充最佳实践, 比如在c的什么地方插入这段内容

### c -> p
- p接收: 在`src/component/IFrame/IFrame.tsx`内的onReceiveMessage可以收到来自子的信息
- c发送: 方法如下

```js
  if (parent !== window) {
    // 要判断是否在iframe内
    parent.postMessage(YOUR_MSG_HERE, targetOrigin); // targetOrigin是接收方的origin, 千万不要使用"*"作为你的origin!
  }
```

WARNING: 千万不要把 targetOrigin 设置为`*`, 会产生极其严重的安全隐患.

ps: 如果一个 iframe 需要在多个项目下工作, 那就要考虑在一个域名下搭一个中间页, 而不是把 targetOrigin设置 为`*`来解决这个需求.

网络请求
---

react版本我们使用比较成熟的网络库axios

和以前一样使用中间件模式处理鉴权, 错误. 

ps: loading现在使用`dva-loading`处理, 可以避免写一堆__noLoading__

### 中间件

Utils目录下有常见的和业务相关的中间件模板, 根据注释修改, 然后在`Request.ts`内根据该中间件是request还是response类型的中间件添加即可.

路由url保存页面状态
----

ps: 初始化和页面状态变化监控必须要分开.

### page -> url

每个filter都直接修改url的query

### url -> page

每次修改url后重新进行请求

componentDidUpdate

不要使用 componentWillReceiveProps

componentDidUpdate根据变化值的普通采取不同的行动, 


## Q&A

### 如何修改 antd 的样式变量修改?

(即antd的定制主题功能)

在`src/Styles/vars.less`下进行修改即可

### 如何获取 react-router 当前路径?

每个组件的 props 都会自动注入 history, history内有路径的信息

ps: 如果你需要监听路由变化, 需要使用dva

### router guide?

react-router 可以动态路由. 不需要router guide.

即: 你可以根据后台返回的数据生成路由, 根本不需要先定义, 然后加限制.

### 方案选型理由?

当前(2018 年 12 月 28 日), 如果我们需要使用 ts+antd+react 的话, 方案虽很多, 但据我对 ts 的了解, ts 并不容易驯服, 特别是在大型项目里面.

因此必须基于 CRA2, 而 CRA2 对 antd 的自定主题功能支持不好, 此时我们方案有

1. 使用黑科技去覆盖 CRA2 配置, 如 craco, customize-cra 等(Rewire Your App 不支持也不打算支持 CRA2)
2. 使用 CRA1
3. 使用 eject 改 webpack 配置

对方案 1, 我们是不可能将自己项目的未来寄托于一个 star 数量 300 不到的业务项目的
对方案 2, 我们也是不可能从 startup 开始就去使用一个已经不再维护的项目

因此我们选择方案 3, 少量修改的配置前提下, 以后仍然有迁移到 CRA2 甚至升级至 CRA3 的可能

### 为什么禁止修改 wepack 配置?

从工程角度出发, 我们希望 10 个人的代码风格保持一致, 以降低相互协助时的沟通成本.

同时团队内的同学水平各有高低, 我们还希望写业务尽可能简单.

所以我们禁止对 webpack 配置进行修改以保持一致, 另一方面, CRA 还在保持更新, 我们还是很乐意和官方生态同步的. 因此我们在采用每一个方案之前都需要问一下自己, 如果以后迁回 CRA, 会不会很麻烦?

这便是禁止随意修改 webpack 配置的原因.
