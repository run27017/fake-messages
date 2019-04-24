<template>
  <div>
    <h1>Fake Messages</h1>
    <p>
      <router-link :to="{ name: 'emails' }">查看邮件列表</router-link>
      <router-link :to="{ name: 'messages' }">查看短信列表</router-link>
    </p>
    <router-view></router-view>
  </div>
</template>
