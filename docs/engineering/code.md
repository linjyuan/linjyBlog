# 代码规范
## 代码不规范导致的问题
- ==代码可读性低代码==
- ==代码规范落地难==
- ==代码格式难统一==
- ==代码质量低下==
## 配置 ESLint

- **ESLint** 是一个用来识别 **ECMAScript** 并且按照规则给出报告的代码检测工具，使用它可以避免低级错误和统一代码的风格。它拥有以下功能：
   - 查出 JavaScript 代码语法问题。
   - 根据配置的规则，标记不符合规范的代码。
   - 自动修复一些结构、风格问题。
- 防止代码很难维护，可以帮我们检查有没有死循环，有没有定义但未使用的变量等等。
- **ESLint官方文档**：[ESLint - Pluggable JavaScript linter - ESLint中文](https://eslint.cn/)
### 安装依赖
```lua
pnpm install -D eslint @eslint/create-config
```

- @eslint/create-config：eslint配置文件初始化工具
### 生成配置文件
```bash
#  生成 ESLint 配置文件模板
npx eslint --init
```
```bash
# 出现如下选择

# 选择2 我们会使用 prettier 进行代码风格校验
How would you like to use ESLint?
1.只检查语法
2.检查语法并提示问题
3.检查语法、提示问题并且强制使用一些代码风格

# 你的项目用的哪一种模块化方式 选择1
What type of modules does your project use?
1.ES6
2.CommonJS
3.None

# 使用的框架 选择2
Which framework does your project use?
1.React
2.Vue.js
3.None

# 项目是否使用TS yes
Does your project use TypeScript?

# 项目在哪里跑的 选择1
Where does your code run?
1.browser
2.node

# 项目用哪种配置文件 选择1
What format do you want your config file to be in?
1.JavaScript
2.YAML
3.JSON
 
# 是否立即安装需要的依赖
Would you like to install them now?
# 会帮我们安装如下插件
# pnpm install -D eslint-plugin-vue@latest @typescript-eslint/eslint-plugin@latest @typescript-eslint/parser@latest
```

- 熟悉之后我们就可以不使用配置生成工具
- 直接新建配置文件进行配置即可
- ESLint配置文件名称可以为：.eslintrc.js、.eslint.config.js （根据个人习惯选择即可）

这里是我常用的配置规则，更多配置规则请查阅[ESLint中文](https://eslint.cn/)。
单独的语法配置需要在rules中编写，全部配置请参考：[List of available rules - ESLint中文](https://eslint.cn/docs/rules/)
```javascript
module.exports = {
  // 使 eslint 支持 node 与 ES6
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  // 引入推荐的语法校验规则
  extends: [
    'plugin:vue/vue3-recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  overrides: [],
  /* 
   这里一定要配置对 先使用vue-eslint-parser 再使用@typescript-eslint/parser
   先解析 <template> 标签中的内容 然后再解析 vue <script> 标签中的 TS 代码
   */
  // 选择使用的解析器
  parser: 'vue-eslint-parser',
  // 解析器的详细配置
  parserOptions: {
    // 使用最新版 ES 语法
    ecmaVersion: 'latest',
    // 使用 ESLint TS 解析器
    parser: '@typescript-eslint/parser',
    // 使用 ES 模块化规范
    sourceType: 'module',
  },
  // 使用的插件
  plugins: ['vue', '@typescript-eslint'],
  // 自定义规则
  rules: {},
};
```

- 配置完规则后我们配置一条指令用于代码质量的修复
```json
// package.json
// --cache 为仅检测改动过的代码
// --max-warnings 0 表示出现超过0个警告强制eslint以错误状态推出
"scripts": {
  "lint:eslint": "eslint --cache --max-warnings 0 {src,mock}/**/*.{vue,ts,tsx} --fix",
},
```
我们还可以配置忽略文件，让 ESLint 不对这些文件进行校验。
新建 .eslintignore 进行配置。
```json
node_modules
*.md
.vscode
.idea
dist
/public
/docs
.husky
.local
/bin
```
### 自动修复

- 大部分IDE支持在修改代码后进行自动修复
1. WebStorme：直接在Setting中搜索ESLint即可进行配置
2. VSCode：需要在项目目录下加入如下配置文件，还需要下载ESLint插件

**/.vscode/settings.json**
```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll": true
  }
}
```
## 配置 Prettier

- 多人协作的项目开发中，保持统一的代码风格是一件很重要的事。
- Prettier就可以帮我们做到这个事情，但是ESLint不是也能规范代码风格么？可以是可以，但是相比Prettier差了很多，术业有专攻，Prettier可以让我们拥有超级整齐的代码。可以帮助我们配置是否使用分号，缩进的格式等等。
- 官方文档：[Prettier 中文网 · Prettier 是一个“有态度”的代码格式化工具](https://www.prettier.cn/)
### 安装依赖
```bash
pnpm install -D prettier
```
### 添加配置文件

- Prettier配置文件名称可以为：.ptettierrc.js、.ptettier.config.js （根据个人习惯选择即可）
- 下面是我常用的一些配置，更多配置规则大家可以前官网查看：[Options · Prettier 中文网](https://www.prettier.cn/docs/options.html)
```javascript
module.exports = {
  printWidth: 120, //单行长度
  tabWidth: 4, //缩进长度
  useTabs: true, //使用空格代替tab缩进
  semi: true, //句末使用分号
  singleQuote: true, //使用单引号
  endOfLine: "auto",
  trailingComma: "none", // 对象最后一个属性末尾是否要逗号
};

```

- 配置一个指令便于我们使用prettier进行修复代码风格
```json
{
  "script": {
    "lint:prettier": "prettier --write **/*.{js,json,tsx,css,less,scss,vue,html,md}",
  }
}
```
### 解决ESLint与Prettier冲突问题
#### 安装依赖
```bash
pnpm install -D eslint-config-prettier eslint-plugin-prettier
```

- eslint-config-prettier 的作用是关闭eslint中与prettier相互冲突的规则。
- eslint-plugin-prettier 的作用是赋予eslint用prettier格式化代码的能力。 安装依赖并修改.eslintrc文件。
#### 配置ESLint
```javascript
/ 此配置在eslint配置文件中新增 
"extends": [
  "eslint:recommended",
  "plugin:vue/vue3-recommended",
  "plugin:@typescript-eslint/recommended",
  "plugin:prettier/recommended" // 在最后面新增extends
],
```
配置完成之后我们对代码风格的配置只会使用prettier的配置，相当于将eslint中冲突的规则覆盖掉了。
我们还可以配置忽略文件，让 Prettier 不对这些文件进行校验。
新建 .prettierignore 进行配置。
```bash
/dist/*
/node_modules/**
```
## 配置 StyleLint

- tylelint 是一个强大、先进的 CSS 代码检查器（linter），可以帮助你规避 CSS 代码中的错误并保持一致的编码风格。
- 你可能会想：WTF😓，怎么有有一个配置编码风格的，不是已经有Prettier了么。StyleLint，是专用于规范样式代码的工具，可以做到一些Prettier做不到的功能，有了它能让我们的样式代码（CSS/Less/Scss）更加美观，比如说对CSS样式代码进行顺序规定。
- 但是 StyleLint 与 Prettier 也有配置冲突，所以我们也要将 StyleLint 中与 Prettier 冲突的配置关闭。
### 安装依赖
```bash
pnpm install -D stylelint stylelint-config-standard

pnpm install -D stylelint-config-prettier stylelint-config-html stylelint-order stylelint-less postcss-html postcss-less stylelint-config-standard-vue
```

- stylelint-config-standard：StyleLint 推荐配置
- stylelint-config-prettier：关闭与 prettier 冲突的配置
- stylelint-config-standard-vue：StyleLint Vue 项目推荐配置
- postcss-html postcss-less：支持检查 less 与 html
- stylelint-order：支持 css 样式排序
### 添加配置文件

- Prettier配置文件名称可以为：.stylelintrc.js、.stylelint.config.js （根据个人习惯选择即可）
- 更多详细配置规则请查看官方文档：[List of rules | Stylelint 中文文档 (bootcss.com)](https://stylelint.bootcss.com/user-guide/rules/list)
```javascript
module.exports = {
  // 继承推荐规范配置
  extends: [
    'stylelint-config-standard',
    'stylelint-config-prettier',
    'stylelint-config-recommended-scss',
    'stylelint-config-standard-vue',
  ],
  // 添加规则插件
  plugins: ['stylelint-order'],
  // 不同格式的文件指定自定义语法
  overrides: [
    {
      files: ['**/*.(scss|css|vue|html)'],
      customSyntax: 'postcss-scss',
    },
    {
      files: ['**/*.(html|vue)'],
      customSyntax: 'postcss-html',
    },
  ],
  // 忽略检测文件
  ignoreFiles: [
    '**/*.js',
    '**/*.jsx',
    '**/*.tsx',
    '**/*.ts',
    '**/*.json',
    '**/*.md',
    '**/*.yaml',
  ],
  // 自定义配置规则
  rules: {
    // 便于配置变量 关闭未知属性检测
    'property-no-unknown': null,
    // 指定类选择器的模式
    'selector-class-pattern': null,
    // 允许 Vue 的 global
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['global'],
      },
    ],
    // 允许 Vue 的 v-deep
    'selector-pseudo-element-no-unknown': [
      true,
      {
        ignorePseudoElements: ['v-deep'],
      },
    ],
    // 允许对应内核前缀
    'property-no-vendor-prefix': null,
    // 指定样式的排序 修复后会帮我们自动整理CSS样式的顺序
    'order/properties-order': [
      'position',
      'top',
      'right',
      'bottom',
      'left',
      'z-index',
      'display',
      'justify-content',
      'align-items',
      'float',
      'clear',
      'overflow',
      'overflow-x',
      'overflow-y',
      'padding',
      'padding-top',
      'padding-right',
      'padding-bottom',
      'padding-left',
      'margin',
      'margin-top',
      'margin-right',
      'margin-bottom',
      'margin-left',
      'width',
      'min-width',
      'max-width',
      'height',
      'min-height',
      'max-height',
      'font-size',
      'font-family',
      'text-align',
      'text-justify',
      'text-indent',
      'text-overflow',
      'text-decoration',
      'white-space',
      'color',
      'background',
      'background-position',
      'background-repeat',
      'background-size',
      'background-color',
      'background-clip',
      'border',
      'border-style',
      'border-width',
      'border-color',
      'border-top-style',
      'border-top-width',
      'border-top-color',
      'border-right-style',
      'border-right-width',
      'border-right-color',
      'border-bottom-style',
      'border-bottom-width',
      'border-bottom-color',
      'border-left-style',
      'border-left-width',
      'border-left-color',
      'border-radius',
      'opacity',
      'filter',
      'list-style',
      'outline',
      'visibility',
      'box-shadow',
      'text-shadow',
      'resize',
      'transition',
    ],
  },
};
```
我们还可以配置忽略文件，让 StyleLint 不对这些文件进行校验。
新建 .stylelintignore 进行配置。
```json
/dist/*
/public/*
public/*
/mock/*
/node_modules/*
/types/*
```
## 配置 Husky

- 团队协作时，我们会遇到多种问题，最让人难受的就是每个人书写的代码风格不一致😅，使用的规范不一致，导致团队协作效率极低，代码可读性差。
- 这时候就需要 Husky 来帮忙了，它可以帮助我们在代码提交前后进行一些自定义的操作，像是代码风格的校验，并且它支持所有的 Git 钩子（钩子是你可以放在钩子目录中触发的程序 在 Git 执行的某些点执行的操作）。

Git全部钩子的详细介绍：[Git - githooks Documentation (git-scm.com)](https://git-scm.com/docs/githooks)
**本文用到的钩子**：

- 在 pre-commit 触发时进行代码格式验证，在 commit-msg 触发时对 commit 消息和提交用户进行验证。
| git hook   | 执行时期          | 备注                                      |
| ---------- | ----------------- | ----------------------------------------- |
| pre-commit | git commit 执行前 | git commit --no verify 命令可以绕过该钩子 |
| commit-msg | git commit 执行前 | git commit --no verify 命令可以绕过该钩子 |

### 安装依赖
```bash
pnpm install -D husky
```
然后配置一个初始化 Hysky 的命令
```json
// package.json
{
  "script": {
    "prepare": "husky install"
  }
}
```
运行这个命令
```bash
# 运行后会初始化husky
pnpm run prepare
```
运行之后就会出现.husky文件夹，之后我们就可以配置在GItHook中执行的操作啦😀。
## 配置 LintStaged

- 有些同学感觉使用IDE的保存自动修复相当麻烦，我每次改完之后都需要等他修复一下😡，太不方便啦！
- 接下来就要请出我们的好帮手：lint-staged，它可以帮助我们在 git 缓存中进行代码质量与风格的修复，在代码提交前进行统一校验，通过后才可以提交。
### 安装依赖
```bash
pnpm install -D lint-staged
```
### 配置
在 package.json 配置一个指令方便我们使用
```json
{
  "script":{
    "lint:lint-staged": "lint-staged",
  }
}
```
使用 husky 配置一个 pre-commit 钩子
```sql
# --no-install 代表强制使用本地模块
npx husky add .husky/pre-commit "npm run lint:lint-staged"
```
LintStaged 的配置文件方式也有多种：

- 在 package.json 中配置
- lint-staged.js 或 lint-staged.config.js
- .lintstagedrc.json 或 .lintstagedrc.yaml

这里我们直接在 package.json 中配置
```json
// 我们直接配置在 package.json 中
/*
配置的含义：
<需要执行的文件>: <对应文件需要执行的命令数组>
*/
"lint-staged": {
  "*.{js,jsx,ts,tsx}": [
    "eslint --fix",
    "prettier --write"
  ],
  "{!(package)*.json,*.code-snippets,.!(browserslist)*rc}": [
    "prettier --write--parser json"
  ],
  "package.json": [
    "prettier --write"
  ],
  "*.vue": [
    "eslint --fix",
    "prettier --write",
    "stylelint --fix"
  ],
  "*.{scss,less,styl,html}": [
    "stylelint --fix",
    "prettier --write"
  ],
  "*.md": [
    "prettier --write"
  ]
}
```
这样就配置完毕啦，当我们使用 git commit -m "xxx" 时，lint-staged 会自动执行帮我们进行代码质量与风格的修复。
## 配置 CommitLint

- 每次看 Github 仓库的时候，总感觉有些不顺眼。原来是提交附带的信息乱糟糟的，都是"新增xx功能"，"修复xxBUG"，非常的不工整，看着太不舒服啦🤯。
- 不要慌，我们可以使用 CommitLint 对提交的信息进行规范。
- 官方文档：[commitlint - Lint commit messages](https://commitlint.js.org/#/)
### 安装依赖
```bash
pnpm install -D @commitlint/cli  @commitlint/config-conventional
```

- @commitlint/config-conventional：commitlint自定义配置规则插件
### 配置
#### 规则配置

- CommitLint配置文件名称可以为：.commitlintrc.js、.commitlint.config.js （根据个人习惯选择即可）

**配置文件内容如下**

- 官方文档的配置规则讲解：[Rules (commitlint.js.org)](https://commitlint.js.org/#/reference-rules?id=rules)

规则由名称和配置数组组成：
<配置名称>: [<警报级别>, <是否启用>, <规则对应的值>]

- 警报级别
   - 0 无提示 disable
   - 1 警告 warning
   - 2 错误 error
- 是否启用
   - always 启用
   - never 禁用
- 规则对应的值：查看官方文档进行配置
```javascript
// 这里是通俗的解释 详情请前往官方文档查阅
module.exports = {
  ignores: [(commit) => commit.includes('init')],
  extends: ['@commitlint/config-conventional'],
  rules: {
    // 信息以空格开头
    'body-leading-blank': [2, 'always'],
    'footer-leading-blank': [2, 'always'],
    // 信息最大长度
    'header-max-length': [2, 'always', 108],
    // 信息不能未空
    'subject-empty': [2, 'never'],
    // 信息类型不能未空
    'type-empty': [2, 'never'],
    // 提交信息的类型 下文有介绍
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'perf',
        'style',
        'docs',
        'test',
        'refactor',
        'build',
        'ci',
        'chore',
        'revert',
        'wip',
        'workflow',
        'types',
        'release',
        'temp'
      ],
    ],
  },
};
```
**提交信息的类型一般有如下规范**（可根据团队习惯进行更改）：

- feat : 增加一个新特性
- fix : 修复一个 bug
- perf : 更改代码以提高性能
- build : 更改构建系统和外部依赖项（如将 gulp 改为 webpack，更新某个 npm 包）
- ci : 对 CI 配置文件和脚本的更改
- docs : 仅仅修改文档说明
- refactor : 代码重构时使用
- style : 不影响代码含义的改动，例如去掉空格、改变缩进、增删分号
- test : 增加新的测试功能或更改原有的测试模块
- temp: 临时的提交

![git .png](https://cdn.nlark.com/yuque/0/2023/png/207857/1698137772303-183e2c80-9141-4266-9ee4-d6d60ce2387e.png#averageHue=%23f2efec&clientId=u67e2578a-a5a2-4&from=paste&height=454&id=uef5b649e&originHeight=727&originWidth=544&originalType=binary&ratio=1.600000023841858&rotation=0&showTitle=false&size=187446&status=done&style=none&taskId=u9f702605-9878-4ac6-aa87-fb72cfeb12d&title=&width=339.99999493360525)
### 钩子配置
```bash
# 配置 commit-msg 钩子 运行 commitlint
# --no-install 代表强制使用本地模块
npx husky add .husky/commit-msg "npx --no-install commitlint --edit $1"
```
配置完成后我们就可以在git commit时进行信息的规范
我们需要按照以下格式进行提交：
```bash
# git commit -m "类型: 信息"
# 新增功能示例
git commit -m "feat: 新增用户登录功能"
# 修复Bug示例
git commit -m "fix: 修复首页用户头像不显示问题"
```
##  


 
