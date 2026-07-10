# @simple-monitor/react

React 错误边界适配。提供开箱即用的 `<ErrorBoundary>` 组件 + `errorBoundaryReport` 函数，捕获子树渲染错误，封装为 `REACT_ERROR` 上报。

## 安装

```bash
npm i @simple-monitor/react
```

> `react` 为 peerDependency。通常通过门面包 `@simple-monitor/web` 的 re-export 引入。

## 用法

```tsx
// 方式 1：开箱即用组件
import { ErrorBoundary } from '@simple-monitor/react'  // 或 from '@simple-monitor/web'

<ErrorBoundary fallback={<div>出错了</div>}>
  <App />
</ErrorBoundary>

// 方式 2：自己实现 ErrorBoundary，手动上报
import { errorBoundaryReport } from '@simple-monitor/react'

class MyBoundary extends React.Component {
  componentDidCatch(error, info) {
    errorBoundaryReport(error, info)
  }
}
```

## API

### `<ErrorBoundary>`
开箱即用错误边界组件。props：

- `fallback?: ReactNode` — 出错时渲染的兜底 UI
- `children?: ReactNode` — 受监控的子树
- `onError?: (error, info) => void` — 捕获到错误时的额外回调（错误已自动上报）

实例方法 `reset()` — 手动重置错误状态（配合 ref，或改变 key 重新挂载）。

捕获子树渲染错误 → 自动上报 `REACT_ERROR` → 渲染 `fallback`。

### `errorBoundaryReport(error: unknown, info?: { componentStack? }): void`
手动上报 React 错误。从 `info.componentStack` 提取最近组件名（best-effort，拿不到记 `anonymous`），推一条 `BreadCrumbTypes.REACT`。

## 依赖

`@simple-monitor/core` · `types` · `utils`；peerDep `react >= 16.8.0`（可选）。
