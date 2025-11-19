# @vue-spark/compose-kit

面向复杂业务的组合式 Vue 开发工具包：可复用的 Composables、SFC 组件与通用工具，显著提升开发效率。

## 安装说明

> 与大多数 Vue 工具包不同，`@vue-spark/compose-kit` 不会发布到 npm registry，而是以「源码集成」的方式使用：从 Releases 下载源码，并通过构建工具（例如 Vite 的 alias、TypeScript 的 paths）接入，这样可以按需自由修改以贴合你的业务需求。

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

在业务项目中安装运行时依赖和开发依赖（如已安装可跳过）：

```bash
# 运行时依赖，请确保最低版本兼容
pnpm add vue @vueuse/core

# 开发依赖
pnpm add vue-component-type-helpers type-fest -D

# 可选依赖，根据需要进行安装
pnpm add element-plus
```

### 3. 配置构建工具 alias（以 Vite 为例）

在构建工具中，将逻辑包名 `@vue-spark/compose-kit` 指向本地源码目录 `compose-kit/src`。以 Vite 为例：

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

### 4. 确保类型感知与构建解析一致

为避免编辑器的类型感知与构建时的模块解析不一致，你可以从下面两种方式中选择一种：

1. 在项目根目录的 `tsconfig.json` 中为 `@vue-spark/compose-kit` 配置 `paths`，并与上面的 alias 保持一致：

   ```jsonc
   {
     "compilerOptions": {
       "baseUrl": ".",
       "paths": {
         "@vue-spark/compose-kit": ["./compose-kit/src"]
       }
     }
   }
   ```

2. 将本库作为本地依赖安装（例如 `pnpm add @vue-spark/compose-kit@file:./compose-kit`），让编辑器像处理普通依赖一样解析该模块并获得完整的类型信息。

### 5. 在代码中使用

完成以上步骤后，可以像使用普通包一样按包名引入：

```ts
import { useXxx } from '@vue-spark/compose-kit'
```

### 6. 迭代升级建议

在功能定制时，优先通过本库提供的 `setupConfig` 进行配置，而不要直接修改源码中的实现逻辑。这样在需要升级时，只需从 Releases 下载新版本并替换本地的 `compose-kit` 源码目录，保留既有的配置代码，即可完成大部分升级工作。

如果已经对源码做了较多定制化修改，不适合直接覆盖升级，建议将新旧两个版本分别放在不同目录下，使用 `git diff` 或图形化文件对比工具（如 VS Code 的对比视图等）逐步合并变更，以降低升级风险。

## Sponsor

您的支持是我持续改进的动力！如果该项目对您有帮助，可以考虑请作者喝杯果汁🍹：

| 微信                                    | 支付宝                                   |
| --------------------------------------- | ---------------------------------------- |
| <img src="./public/wx.png" width="200"> | <img src="./public/zfb.png" width="200"> |

## License

[MIT](./LICENSE) License © 2025 [leihaohao](https://github.com/l246804)
