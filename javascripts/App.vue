<template>
  <div>
    <Layout class="layout">
      <Header>
        <Menu mode="horizontal" theme="dark" :active-name="activeMenu">
          <div class="layout-logo">Fake Messages</div>
          <div class="layout-nav">
            <MenuItem name="emails" :to="{ name: 'emails' }" class="main-menu">
              <Icon type="ios-mail"></Icon>
              邮件
            </MenuItem>
            <MenuItem name="messages" :to="{ name: 'messages' }" class="main-menu">
              <Icon type="ios-chatbubbles"></Icon>
              短信
            </MenuItem>
            <MenuItem name="help" :to="{ name: 'help' }" class="secondary-menu">
              开发者帮助
            </MenuItem>
          </div>
        </Menu>
      </Header>
      <Content class="layout-content">
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </Content>
    </Layout>
  </div>
</template>

<script>
import { Layout, Header, Content, Menu, MenuItem, Icon } from 'iview'
import websocket from './websocket'

export default {
  name: 'App',
  components: {
    Layout,
    Header,
    Content,
    Menu,
    MenuItem,
    Icon
  },
  data () {
    return {
      activeMenu: ''
    }
  },
  created () {
    const hash = window.location.hash
    if (hash === '#/emails' || hash.startsWith('#/emails/')) {
      this.activeMenu = 'emails'
    } else if (hash === '#/messages' || hash.startsWith('#/messages/')){
      this.activeMenu = 'messages'
    }

    websocket.connect()
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
.main-menu {
  font-size: 1.2em;
}
.secondary-menu {
  float: right !important;
}
.layout-content {
  margin: 40px 20px;
}
</style>

