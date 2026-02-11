# @vue-spark/compose-kit

面向复杂业务的组合式 Vue 开发工具包：可复用的 Composables、SFC 组件与通用工具，显著提升开发效率。

## 安装说明

> 与大多数 Vue 工具包不同，`@vue-spark/compose-kit` 不会发布到 npm registry，而是通过「源码集成」的方式使用：从 GitHub Releases 下载源码，并借助构建工具（如 Vite 的 alias、TypeScript 的 paths）接入，这样可以按需修改源码以贴合具体业务需求。

### 1. 获取源码（Zip 包）

推荐从 GitHub Releases 下载对应版本的 zip 包：

```text
https://github.com/vue-spark/compose-kit/releases
```

下载后将其解压到业务项目附近，例如：

```text
your-project/
  compose-kit/      # 解压后的本库源码
  ...
```

### 2. 安装必要依赖

本库的依赖分为**核心依赖**（必须安装）和**可选依赖**（按需安装）。具体版本号可参考本库的 `package.json`。

#### 核心依赖

以下是使用本库必须安装的依赖：

```bash
# 运行时核心依赖
pnpm add vue @vue-spark/compose-kit-runtime type-fest vue-component-type-helpers
```

> `@vue-spark/compose-kit-runtime` 是本库的运行时基础包，提供 BEM 工具、全局配置、表格 Schema 类型等底层能力，所有组件均依赖它。它是一个标准 npm 包，无需额外配置 alias 或 paths。

#### 可选依赖：UI 组件库

如果你使用了本库中与特定 UI 组件库相关的功能，需要自行安装对应的 UI 库：

```bash
# 使用 src/element-plus 下的组件时安装
pnpm add element-plus

# 使用 src/vxe-table 下的组件时安装
pnpm add vxe-table
```

> 如果完全不需要某个 UI 库的集成，可以直接删除 `compose-kit/src/element-plus` 或 `compose-kit/src/vxe-table` 等对应目录，不会影响其他功能。

#### 可选依赖：其他

根据你使用的具体组件，可能还需要安装以下依赖（按需选择）：

```bash
# 如果组件中使用了 @vueuse/core 的 composables
pnpm add @vueuse/core

# 如果组件中使用了 iconify 图标
pnpm add @iconify/vue
```

### 3. 配置构建工具 alias（以 Vite 为例）

在构建工具中，将 `@vue-spark/compose-kit` 指向本地源码目录 `compose-kit/src`，使子路径导入（如 `@vue-spark/compose-kit/shared`）能正确解析。以 Vite 为例：

```ts
import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      // 请根据你的目录结构调整下面的路径
      '@vue-spark/compose-kit': resolve(__dirname, 'compose-kit/src'),
    },
  },
})
```

> 根据实际目录结构调整上面的路径即可，例如如果 `compose-kit/` 不在项目根目录下，就改成指向真实位置的相对路径。

### 4. 配置类型感知

为了获得良好的开发体验，请按下面的方式配置类型感知。

在项目根目录的 `tsconfig.json` 中为 `@vue-spark/compose-kit` 配置 `paths`，并与上面的 alias 保持一致，同时将源码目录包含进 TypeScript 的 `include` 中：

```jsonc
{
  "compilerOptions": {
    "paths": {
      // 支持子路径导入（例如 @vue-spark/compose-kit/shared）
      "@vue-spark/compose-kit/*": ["./compose-kit/src/*"]
    }
  },
  "include": [
    "src/**/*",
    "src/**/*.vue",

    // 确保 TS 能扫描到本库源码
    "compose-kit/src/**/*",
    "compose-kit/src/**/*.vue"
  ]
}
```

### 5. 在代码中使用

完成以上步骤后，通过子路径按模块导入：

```ts
// Element Plus 相关组件（需安装 element-plus）
import { ElTableSchemaColumns } from '@vue-spark/compose-kit/element-plus'

// 通用组件和 hooks
import {
  SectionLayout,
  Toolbar,
  useSelection,
} from '@vue-spark/compose-kit/shared'

// vxe-table 相关组件（需安装 vxe-table）
import { VxeTableSchemaColumns } from '@vue-spark/compose-kit/vxe-table'
```

### 6. 迭代升级建议

在功能定制时，优先通过本库提供的 `provideGlobalConfig` 进行配置，而不要直接修改源码中的实现逻辑。这样在需要升级时，一般只需从 Releases 下载新版本并替换本地的 `compose-kit` 源码目录，即可在保留既有配置代码的前提下完成大部分升级工作。

```ts
import { provideGlobalConfig } from '@vue-spark/compose-kit-runtime'

createApp(App).use((app) => {
  provideGlobalConfig(
    {
      // 你的配置
    },
    app,
  )
})
```

如果已经对源码做了较多定制化修改，不适合直接覆盖升级，建议将新旧两个版本分别放在不同目录下，使用 `git diff` 或图形化文件对比工具（如 VS Code 的对比视图等）逐步合并变更，以降低升级风险。

### 三方组件库集成（可选）

本库不会自动安装或引入任何第三方组件库及其样式（例如 Element Plus）。如果你需要结合 UI 组件库使用本库提供的能力，可以参考下面以 Element Plus 为例的可选说明。如果在项目中完全不需要这类第三方集成，可以直接删除 `compose-kit/src/element-plus` 等对应目录，不会影响本库核心功能。

<details>
<summary>以 Element Plus 为例的集成（点击展开）</summary>

#### 运行时集成

- 在业务项目中安装 Element Plus：
  ```bash
  pnpm add element-plus
  ```
- 在应用入口中按官方文档引入样式，例如：
  ```ts
  import 'element-plus/theme-chalk/index.css'
  ```
- 通过 `provideGlobalConfig` 配置与 Element Plus 相关的全局行为：

```ts
import { provideGlobalConfig } from '@vue-spark/compose-kit-runtime'

provideGlobalConfig({
  ElementPlus: {
    // ...你的配置
  },
})
```

- 在需要使用 Element Plus 组件的页面中引入：
  ```ts
  import { ElTableSchemaColumns } from '@vue-spark/compose-kit/element-plus'
  ```

</details>

## Sponsor

您的支持是我持续改进的动力！如果该项目对您有帮助，可以考虑请作者喝杯果汁🍹：

| 微信                                    | 支付宝                                   |
| --------------------------------------- | ---------------------------------------- |
| <img src="./public/wx.png" width="200"> | <img src="./public/zfb.png" width="200"> |

## License

[MIT](./LICENSE) License © 2025 [leihaohao](https://github.com/l246804)
