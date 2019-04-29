# 开发者帮助文档

## 产品介绍

该产品是用来模拟发送邮件和短信的工具，常常用于开发环境。开发过程中发送邮件和短信时，常常遇到两个痛点：

1. 测试的邮箱和手机号不够用。
2. 开发环境的数据有可能是从生产环境导入的，开发测试的时候会向实际用户发送一些不必要的邮件和短信。

针对这两个痛点，我设计了一个独立的系统，用于模拟发送邮件和短信。开发者调用本网站的接口发送邮件和短信，可以任意指定发送者和接收者的邮箱，乃至于接收的手机号。这极大地促进了开发和测试时的灵活性。

## 发送邮件

调用接口：

    curl -XPOST -H 'Content-Type: application/json' http://host/emails -d '
      {
        "toAddress": "接收者的邮箱地址",
        "toName": "接收者的名字",
        "fromAddress": "发送者的邮箱地址",
        "fromName": "发送者的名字",
        "subject": "邮件主题",
        "type": "邮件正文类型，可选值是text或html",
        "content": "邮件正文"
      }
    '

其中`host`本站域名+端口一致，下同。

## 发送短信

调用接口：

    curl -XPOST -H 'Content-Type: application/json' http://localhost:3000/messages -d '
      {
        "toMobile": "接收者的手机号",
        "content": "短信内容（尽量控制字数在140以内）"
      }
    '
