# fake-messages

## 目录结构

- `/server`: 服务器的 js 代码。
- `/javascripts`: Webpack 打包用的源代码。
- `/public`: 静态文件，包括 Webpack 打包后的代码。

## 快速上手

### 安装依赖包

    $ yarn

### 准备数据库

创建数据库：

    $ bin/create_db

删除数据库：

    $ rm db/default.sqlite3

如果需要，创建种子数据用于开发：

    $ bin/create_seeds

### 使用webpack打包客户端js文件

打包：

    $ yarn build:js

实时打包：

    $ yarn watch:js

### 运行服务器

运行开发环境（默认端口3000）：

    $ yarn run dev

运行生产环境：

    $ PORT=3000 yarn start

运行之后，访问`http://localhost:3000`.

