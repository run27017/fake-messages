import EmailList from './pages/EmailList.vue'
import EmailDetails from './pages/EmailDetails.vue'
import MessageList from './pages/MessageList.vue'

export default [
  { name: 'index', path: '/', redirect: { name: 'emails' } },
  { name: 'emails', path: '/emails', component: EmailList },
  { name: 'email', path: '/emails/:id', component: EmailDetails },
  { name: 'messages', path: '/messages', component: MessageList },
]

