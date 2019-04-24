<template>
  <div>
    <Layout class="layout">
      <Header>
        <Menu mode="horizontal" theme="dark" active-name="emails">
          <div class="layout-logo">Fame Messages</div>
          <div class="layout-nav">
            <MenuItem name="emails" :to="{ name: 'emails' }">
              <Icon type="ios-mail"></Icon>
              邮件
            </MenuItem>
            <MenuItem name="messages" :to="{ name: 'messages' }">
              <Icon type="ios-chatbubbles"></Icon>
              短信
            </MenuItem>
          </div>
        </Menu>
      </Header>
      <Content class="layout-content">
        <router-view></router-view>
      </Content>
    </Layout>
  </div>
</template>

<script>
import { Layout, Header, Content, Menu, MenuItem, Icon } from 'iview'

export default {
  name: 'App',
  components: {
    Layout,
    Header,
    Content,
    Menu,
    MenuItem,
    Icon
  }
}
</script>

<style scoped>
.layout {
  background: #fff;
  position: relative;
  overflow: hidden;
}
.layout-logo {
  color: beige;
  float: left;
}
.layout-nav {
  margin-left: 140px;
}
.layout-content {
  margin: 40px 20px;
}
</style>

