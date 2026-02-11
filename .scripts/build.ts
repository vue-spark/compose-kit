import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import archiver from 'archiver'
import pkg from '../package.json'
import runtimePkg from '../runtime/package.json'

interface PackageEntryContext {
  absPath: string
  innerPath: string
  archive: archiver.Archiver
}

interface PackageEntry {
  /** 仓库根目录下的源路径（文件或目录） */
  from: string
  /**
   * 可选的自定义处理函数；如果提供则由它负责将内容写入 archive
   */
  handle?: (ctx: PackageEntryContext) => Promise<void> | void
}

const ROOT_DIR = process.cwd()
const PKG_NAME = pkg.name.slice(pkg.name.lastIndexOf('/') + 1)
const PKG_VERSION = pkg.version
const OUTPUT_ZIP_NAME = `${PKG_NAME}-${PKG_VERSION}.zip`
const OUTPUT_ZIP_PATH = path.resolve(ROOT_DIR, OUTPUT_ZIP_NAME)
const DIST_ROOT = path.resolve(ROOT_DIR, 'node_modules', '.dist')
const COMPOSE_ROOT_DIR = path.resolve(DIST_ROOT, PKG_NAME)
// zip 内部根目录名，只用于 archive 内部路径
const COMPOSE_ROOT = PKG_NAME

// 配置要打包的条目
const entries: PackageEntry[] = [
  {
    from: 'package.json',
    handle: ({ archive, innerPath }) => {
      const {
        devDependencies: _devDependencies,
        scripts: _scripts,
        'simple-git-hooks': _simpleGitHooks,
        packageManager: _packageManager,
        ...restOptions
      } = pkg

      // 将 workspace:* 协议替换为实际版本号
      if (restOptions.dependencies) {
        for (const [name, version] of Object.entries(
          restOptions.dependencies,
        )) {
          if (typeof version === 'string' && version.startsWith('workspace:')) {
            if (name === runtimePkg.name) {
              restOptions.dependencies[name] = `^${runtimePkg.version}`
            }
          }
        }
      }

      const pkgJsonContent = `${JSON.stringify(restOptions, null, 2)}\n`
      archive.append(pkgJsonContent, { name: innerPath })
    },
  },
  { from: 'src' },
  { from: 'README.md' },
  { from: 'LICENSE' },
]

await Promise.all([
  fs.promises.rm(COMPOSE_ROOT_DIR, { force: true, recursive: true }),
  fs.promises.rm(OUTPUT_ZIP_PATH, { force: true }),
])

await fs.promises.mkdir(COMPOSE_ROOT_DIR, { recursive: true })

const output = fs.createWriteStream(OUTPUT_ZIP_PATH)
const archive = archiver('zip', { zlib: { level: 9 } })

archive.on('error', (err) => {
  throw err
})

archive.pipe(output)

for (const entry of entries) {
  const absPath = path.resolve(ROOT_DIR, entry.from)

  try {
    await fs.promises.access(absPath)
  }
  catch {
    console.warn(`[build] skip: ${entry.from} not found`)
    continue
  }

  const innerPath = `${COMPOSE_ROOT}/${entry.from}`.replace(/\\/g, '/')

  if (entry.handle) {
    await entry.handle({ absPath, innerPath, archive })
    continue
  }

  const stat = await fs.promises.stat(absPath)

  if (stat.isDirectory()) {
    // 目录：打包到 PKG_NAME/xxx/
    archive.directory(absPath, innerPath)
  }
  else {
    // 文件：打包为 PKG_NAME/xxx
    archive.file(absPath, { name: innerPath })
  }
}

const closePromise = new Promise<void>((resolve, reject) => {
  output.on('close', () => resolve())
  output.on('error', reject)
})

await archive.finalize()
await closePromise

console.log(`[build] ${OUTPUT_ZIP_NAME} generated at ${OUTPUT_ZIP_PATH}`)
