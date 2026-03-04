---
title: 'Test default cover'
date: '2026-03-02'
---

**这次对 Zustand 的理解升级，其实是从一个很简单的问题开始的：**

> _为什么我可以在组件外面通过_ `store.getState().setXXX()` _修改状态，而且组件里的值还能自动更新？_

~~一开始我一直以为 Zustand 是基于 React Context 实现的。既然是基于 Context，那它应该只~~能在组件树里用，离开组件就没法工作。但实际测试下来发现：

* 在组件外调用 `.getState().setXXX()` 完全没问题

* 组件内通过 `useStore(selector)` 订阅的值也会自动更新

* 根本不需要 Provider（在默认用法下）

这让我意识到，我对 Zustand 的理解是错的。

```TypeScript
const a = 1;
```

![1.00](assets/img_1.webp "test")


