# @simple-monitor/vue

Vue 错误捕获适配（Vue2 + Vue3 双兼容）。通过 `MonitorVue` 插件重写 `app.config.errorHandler`，捕获组件 render / setup / 生命周期错误，封装为 `VUE_ERROR` 上报。

## 安装

```bash
npm i @simple-monitor/vue
```

> `vue` 为 peerDependency（Vue3 必需，Vue2 兼容）。通常通过门面包 `@simple-monitor/web` 的 re-export 引入。

## 用法

```ts
import { createApp } from 'vue'
import { MonitorVue } from '@simple-monitor/vue'  // 或 from '@simple-monitor/web'

const app = createApp(App)
app.use(MonitorVue)  // 捕获 Vue 组件错误 → VUE_ERROR
```

## API

### `MonitorVue`
Vue 插件对象。`install(app)` 时重写 `errorHandler`：

- **Vue3**：`app.config.errorHandler`
- **Vue2**：`Vue.config.errorHandler`（install 接收 Vue 构造器）
- 提取出错组件名（`$options.name` / `_componentTag`，`<script setup>` 匿名导出记 `anonymous`）
- 封装 `VUE_ERROR` → core transport 上报 + 推一条 `BreadCrumbTypes.VUE`
- 受 `silentVue` 开关控制
- 保留用户既有 errorHandler，不吞错（采集失败不影响用户处理）

## 依赖

`@simple-monitor/core` · `types` · `utils`；peerDep `vue >= 2.0.0`（可选）。
