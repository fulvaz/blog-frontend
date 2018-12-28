React版本
===

Warning: 为了自己的人身安全, 千万不要改webpack配置, 否则你将会受到同事的毒打

love and peace -> [不要改webpack配置](https://www.hblady.com/wp-content/uploads/2018/08/c61cddeb1aa4722d2de6c3a020ba413f.mp4)

这个项目是什么
---

这个项目由create-react-app(CRA)创建, 集成了antd UI库与dva作为状态管理工具

但由于需要支持less, 这里对原来的初始项目进行了eject, 然后修改webpack配置.



项目结构
---


规范
---

### 命名

- 文件名: 帕斯卡命名如`ReservationCard.tsx`, `ReservationCard.module.less`
- 组件类名称: 帕斯卡命名, 如`ReservationCard`, 当你在一个文件引入一个组件的类时, 应写作: `import ReservationCard from './ReservationCard';`

ps: react内没有pipe, directive概念, 所以不需要在后面添加component
ps2: 对组件的样式文件名需要加上module, 否则无法使用模块化

### 属性
一行一个属性, 如:

```tsx
<Foo
  superLongParam="bar"
  anotherSuperLongParam="baz"
/>
```

ps: `visual code`安装`prettier`插件, 然后格式化(alt+f)即可

开发
---

npm run start

打包
---

npm run build

样式
---

请务必使用css module

推荐使用less或者css, 原因是less兼容css和scss的语法, 而且可以避免被node-sass折磨. (当前版本暂未移除sass依赖, 不排除以后哪天会移除, 推荐使用less降低迁移成本)

classname lib

环境变量
---

antd变量修改
---

在`src/styles/antd.less`下进行修改即可

状态管理
---



方案选型理由
---

当前(2018年12月28日), 如果我们需要使用ts+antd+react的话, 方案虽很多, 但据我对ts的了解, ts并不容易驯服, 特别是在大型项目里面.

因此必须基于CRA2, 而CRA2对antd的自定主题功能支持不好, 此时我们方案有
1. 使用黑科技去覆盖CRA2配置, 如craco, customize-cra等(Rewire Your App不支持也不打算支持CRA2)
2. 使用CRA1
3. 使用eject改webpack配置

对方案1, 我们是不可能将自己项目的未来寄托于一个star数量300不到的业务项目的
对方案2, 我们也是不可能从startup开始就去使用一个已经不再维护的项目

因此我们选择方案3, 少量修改的配置前提下, 以后仍然有迁移到CRA2甚至升级至CRA3的可能

为什么禁止修改wepack配置
---

从工程角度出发, 我们希望10个人的代码风格保持一致, 以降低相互协助时的沟通成本.

同时团队内的同学水平各有高低, 我们还希望写业务尽可能简单.

所以我们禁止对webpack配置进行修改以保持一致, 另一方面, CRA还在保持更新, 我们还是很乐意和官方生态同步的. 因此我们在采用每一个方案之前都需要问一下自己, 如果以后迁回CRA, 会不会很麻烦?

这便是禁止随意修改webpack配置的原因.