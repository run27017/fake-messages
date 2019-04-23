<template>
  <div>
    <ul v-if="email">
      <li>
        <span>收件人：</span>
        <span>{{ getNamedContact(email.toAddress, email.toName) }}</span>
      </li>
      <li>
        <span>发件人：</span>
        <span>{{ getNamedContact(email.fromAddress, email.fromName) }}</span>
      </li>
      <li>
        <span>时间：</span>
        <span>{{ email.createdAt | datetime }}</span>
      </li>
      <li>
        <span>主题：</span>
        <span>{{ email.subject }}</span>
      </li>
      <li>
        <span>内容：</span>
        <span>{{ email.content }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios'
import getNamedContact from '../mixins/getNamedContact'

export default {
  name: 'EmailDetails',
  data () {
    return {
      email: null
    }
  },
  mixins: [ getNamedContact ],
  created () {
    const id = this.$route.params.id
    axios.get(`/emails/${id}`)
      .then(({ data }) => {
        this.email = data.email
      })
      .catch(err => {
        console.error('获取邮件详情出错', err)
      })
  }
}
</script>

