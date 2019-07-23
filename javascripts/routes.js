import EmailList from '@/pages/EmailList.vue'
import EmailDetails from '@/pages/EmailDetails.vue'
import MessageList from '@/pages/MessageList.vue'
import Docs from '@/pages/Docs.vue'

export default [
  { name: 'index', path: '/', redirect: { name: 'emails' } },
  { name: 'emails', path: '/emails', component: EmailList },
  { name: 'email', path: '/emails/:id', component: EmailDetails },
  { name: 'messages', path: '/messages', component: MessageList },
  { name: 'docs', path: '/docs', component: Docs }
]

