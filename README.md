# fake-messages

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

运行开发环境：

    $ yarn dev

运行生产环境：

    $ yarn start

运行之后，访问`http://localhost:3000`.

