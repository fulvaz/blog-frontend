# ad-frontend-base for React

Warning: 为了自己的人身安全, 千万不要改 webpack 配置, 否则你将会受到同事的毒打

Love and peace -> [~~改 webpack 配置可能会导致的问题~~](https://www.hblady.com/wp-content/uploads/2018/08/c61cddeb1aa4722d2de6c3a020ba413f.mp4)

## 这个项目是什么

这个项目由 create-react-app(CRA)创建, 集成了 antd UI 库与 dva 作为状态管理工具

但由于需要支持 less, 这里对原来的初始项目进行了 eject, 然后修改 webpack 配置.

## 规范

### README.md

必须要有

1. 生产/测试/QA 页面地址
2. 发布仓库地址
3. 其他你觉得需要的说明

### 命名

参考antd-pro

- 对组件, 其文件名及其目录名用Pascal命名
- 最其他, 文件名和目录名均小写, 使用驼峰命名, 包括model, 其中model需要显式添加Model作为文件名结尾, 如`userModel.ts`
- 类名: 用Pascal命名, 即`EeservationCard`
- 样式类型: 用`-`分割单词, 即`.table-head`

ps: 对组件的样式文件名需要加上 module, 如`page.module.less`, 否则无法使用模块化

### 属性

一行一个属性, 如:

```tsx
<Foo superLongParam="bar" anotherSuperLongParam="baz" />
```

ps: `visual code`安装`prettier`插件, 然后格式化(alt+f)即可

### 样式

其实一个div一个类名没有必要, 样式文件里还会有大量重复的样式代码

针对业务的样式, 我们可以将样式分为: 布局样式与装饰样式

- 通常来说装饰样式是可以复用的, 比如你多个button都长一个样, 这时共享一个class即可

- 布局样式是很难复用的, 比如padding, margin, top, left这种, 部分情况下width和height也是如此. 涉及到布局样式, 推荐使用atomic css的做法, 把布局都抽出一个个很小的类, 即, 类似这样

```css
.p20 {
  padding: 20px;
}

.pr20 {
  padding-right: 20px;
}
```

那你在使用的时候直接把`p20`放在你需要的标签内即可. 这样还能解决一个div一个类名的问题, 通常来说, 这个div的类名可能只是改了一下布局, 就为一个padding新建一个类太浪费了.

`atomic.less`下已经提取了常见的布局样式, 可以当全局样式直接使用

注意! 这里是在写业务的前提下, 如果你在写通用组件(指不依赖业务的组件), 这种方法并不合适.

#### 必须遵守的规则

你可以在div内内联style的方式写样式, 但是属性数量不能超过6个, 超过6个必须放在样式文件中.

#### 最佳实践

另外这个项目下使用css module时, webpack已经帮我们把下划线命名的class自动修改位驼峰命名, 即, 你在使用时, 不需要`style['flex-wrap]`, 直接style.flexWrap即可

请务必使用 css module, 以实现样式封装, 请不要把组件样式放在全局

推荐使用 less 或者 css, 原因是 less 兼容 css 和 scss 的语法, 而且可以避免被 node-sass 折磨. (当前版本暂未移除 sass 依赖, 不排除以后哪天会移除, 推荐使用 less 降低迁移成本)

使用css module时, 多个类名存在需要拼接字符串的问题, 可以使用`className`这个类库帮你拼接

1. 是否封装 是
2. less style 共存 超过6个不允许使用style

TODO: 样式部分文档需要润色

### 项目结构规范与说明

src
├── app.module.less
├── app.tsx --- 路由与全局配置文件
├── index.css
├── index.tsx
├── assets --- 静态资源目录
│   └── logo.svg
├── components --- 存放通用组件, 即需要多个页面共享的组件放这里,否则放页面目录
│   ├── iframe
│   │   ├── iframe-comm.tsx
│   │   ├── iframe.less
│   │   └── iframe.tsx
│   └── page-layout
│       ├── page-content.tsx
│       ├── page-layout.module.less
│       ├── page-layout.tsx
│       └── page-title.tsx
├── models --- 状态管理定义文件, 全局使用的放在这里, 否则在自己的页面项目新建一个[pageName].ts 文件
│   ├── global.ts
│   ├── iframe.ts
│   └── sidebar.ts
├── pages --- 业务页面文件夹
│   └── table-page
│       ├── table-filter-one --- 页面下需要提取组件的话, 新建一个文件夹即可, 不需要新建component文件夹

│       │   └── table-filter-one.tsx
│       ├── table-filter-two
│       │   └── table-filter-two.tsx
│       ├── table-page-model.ts
│       └── table-page.tsx
├── serviceWorker.js
├── style --- 全局样式, 可以在 app.tsx 内直接引入
│   ├── antd.less
│   ├── atomic.less
│   ├── iconfont.less
│   └── vars.less
└── utils --- 通用工具库
    ├── http-interceptors --- HTTP 中间件配置文件
    │   ├── cookie-auth.ts
    │   ├── dev.ts
    │   ├── err.ts
    │   └── token-auth.ts
    ├── request.ts
    ├── tools.ts
    └── url-state.ts

说明:

保持与本项目相近的结构, 以降低合作沟通成本

#### 必须遵守的规则

对简单的业务, 只有一个model时, model文件可以与页面平级(model并非必须的). 如果多个, 则需要新建一个`models`文件夹, 把你的model放进去

TODO: 需要验证当前结构是否适合业务开发

## 开发

npm run start

## 发布流程

1. 打包

2. 推送到发布仓库

3. 运行发布

4. 打开页面检查是否正常

5. 通知后端与测试

6. 发布完毕

ps: 务必保证上线后的页面可用正常, 记得走完流程, 再做其他事情.

## 状态管理 dva

和 redux 差不多, 使用这个而不是 redux 的原因是 dva 帮我们封装了大量繁琐的 redux api, 平滑了学习曲线, 可以快速上手写业务.

ps: dva 本质是对 redux, react-router, react 的"封装", 然后把 redux 和 react-router 的 api 直接暴露出来, 对 react 修改的部分也极少. 如果你需要深入理解 react 生态, 还是要自己去学习一下 redux 和 react-router 的.

### 定义一个 model

见 dva 文档(dva 上手很快, 请花一点时间看一下文档)

### 如何在组件中使用这些状态

为组件添加这样的一个装饰器

```ts
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

### 什么状态不应该放在 model 中

离开页面后需要重置的状态: 如表单填写的数据, filter 的状态

TODO: 结合项目实践补充

ps: 实际上不需要共享的状态全部放 model 还是放 component 到现在都没有定论, 但 dva 的生态似乎默认你的数据都在 model 上, 如 dva-loading. 鉴于此, 我们可以借鉴他们的设计. 这里只列出非常糟糕的设计.

## router

由于使用 dva 的内部 router, 即从`dva/router`引入路由相关的 api

Route 必须是 Router 的子元素, 否则会无法正常导航 (nested route 还没测试)

## 环境变量

### 定义

在`.env`以`REACT_APP_ENV`开头的变量名.

比如定义了`REACT_APP_ENV=local`

需要等发布工具支持才可以使用自定义变量, 现在仅支持REACT_APP_ENV

### 使用

```ts
console.log(process.env.REACT_APP_VAR); // 123
```

## iframe

这是我们实现从 angular 平稳过渡 react 的方案

### 白名单检查

为了保证通用, iframe 的 src 暴露在 url 中, 虽然进行了 base64 编码, 但毕竟是掩耳盗铃, 容易导致安全问题.

因此`IFrame.tsx`内有一个白名单列表, 非这个列表内的地址不会跳转. 写新项目时你可能需要在自己的项目里面维护这个列表

ps: 由于使用自带的 base64 编码解码, 不支持 ascii 表以外的字符

### 如何进行通信

p = Parent, 指这个框
c = Child, 指嵌入的 iframe

p 这边使用了一个组件对通信进行封装, 每次修改 IframeComm 的 postMessageData 属性时, 就会想 c 发送内容为 postMessageData 的信息

### iframe 如何部署

c 端需要在页面中添加

```js
window.addEventListener("message", e => {
  console.log(e);
  // 1. 这里需要检查e.origin是否合法
  // 2. 根据传过来的e.data进行相应的处理
});
```

这样便可以监听到来自 parent 的信息

TODO: 需要补充最佳实践, 比如在 c 的什么地方插入这段内容

### c -> p

- p 接收: 在`src/component/IFrame/IFrame.tsx`内的 onReceiveMessage 可以收到来自子的信息
- c 发送: 方法如下

```js
if (parent !== window) {
  // 要判断是否在iframe内
  parent.postMessage(YOUR_MSG_HERE, targetOrigin); // targetOrigin是接收方的origin, 千万不要使用"*"作为你的origin!
}
```

WARNING: 千万不要把 targetOrigin 设置为`*`, 会产生极其严重的安全隐患.

ps: 如果一个 iframe 需要在多个项目下工作, 那就要考虑在一个域名下搭一个中间页, 而不是把 targetOrigin 设置 为`*`来解决这个需求.

## 网络请求

react 版本我们使用比较成熟的网络库 axios

dva/fecth 尽可能

和以前一样使用中间件模式处理鉴权, 错误.

ps: loading 现在使用`dva-loading`处理, 可以避免写一堆**noLoading**

### 中间件

Utils 目录下有常见的和业务相关的中间件模板, 根据注释修改, 然后在`Request.ts`内根据该中间件是 request 还是 response 类型的中间件添加即可.

## 路由分割懒加载

### 如何使组件成为异步组件

使用 dva 提供的封装工具

```ts
dynamic({
  dva,
  models: () => [
    import('./models/users'),
    import('./models/menu'),
  ],
  component: () => import("./Pages/FormPage/FormPage").then(e => Object.values(e)[0])
}),
```

## 路由 url 保存页面状态

### 用法

s1. 在组件的 class 添加`@putStateInUrl(config)`

  config 的格式见 PutStateInUrlConfig

  ```ts
  interface PutStateInUrlConfig {
    [namespace: string]: {
      api: string;
    };
  }
  ```

  其中 namespace 是一部分 UI 的命名空间, 自己定就可以了, 通常命名空间下面会有多个 filter 字段, 不需要在这里定义

s2. 在个筛选的回调函数上添加`@changeUrl(config)`

config 的定义:

```ts
interface ChangeUrlConfig {
  namespace: string;
  filters: string[];
}
```

namespace 就是你在上面定义的 namespace 字段, filter 是这个 namespace 下包含的 filter 字段

例子可以见 UrlStateExample

说明:

### 约定

1. 我们默认你会在 componentDidMount 里面初始化数据
2. 你在 handleTableChange 类似的回调函数里面不会调用获取数据的 api (装饰器会帮你在修改路由时统一调用该 api)

Table
---

### 要求

1. 首列与操作列(通常是最后一列)需要fixed, 最后一列不是操作的话不需要fixed
2. 表格太宽但页面太窄中间需要可以滚动
3. 保证每一列不需要换行即可显示, 如果某列内容太多, 可以用`...`省略过长的内容, 然后用tooltip的形式显示全部内容
4. 推荐全部列固定宽度

### 当前最佳实践

首列与最后一列设为fixed, 分别设置自己的宽度 (最后一列不为'操作'的话不设置fixed)

然后设置中间滚动, 其中scroll.x的经验值是, 列的数量*200, scroll.x设置规则, 见[这个issue](https://github.com/ant-design/ant-design/issues/11328#issuecomment-408664916)

然后观察页面效果, 如果内容比较多, 适当增加scroll.x的值, 否则减少scroll.x的值.

warning: 对每一列设置宽度很可能会导致高分辨率下显示错误

## Q&A

### 如何修改 antd 的样式变量修改?

(即 antd 的定制主题功能)

在`src/styles/vars.less`下进行修改即可

### 如何获取 react-router 当前路径?

每个组件的 props 都会自动注入 history, history 内有路径的信息

ps: 如果你需要监听路由变化, 需要使用 dva

### router guide?

react-router 可以动态路由. 不需要 router guide.

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

### 我怎么觉得方案有点low?

如果你的项目预计会有30w行以上代码的话, 你可能需要重新设计一个适合的方案, 而不是这个.

### 如何添加一个新页面

1. 在`pages`下新建文件
2. 添加路由
3. 添加菜单
