import EmailList from './pages/EmailList.vue'
import EmailDetails from './pages/EmailDetails.vue'

export default [
  { name: 'emails', path: '/emails', component: EmailList },
  { name: 'email', path: '/emails/:id', component: EmailDetails }
]
