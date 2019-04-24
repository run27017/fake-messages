<template>
  <div v-if="email">
    <Card>
      <p slot="title">
        {{ email.subject }}
      </p>
      <ul style="list-style-type:none">
        <li>
          <span>收件人：</span>
          <span>{{ getNamedContact(email.toAddress, email.toName) }}</span>
        </li>
        <li>
          <span>时&nbsp;&nbsp;&nbsp;&nbsp;间：</span>
          <span>{{ email.createdAt | datetime }}</span>
        </li>
        <li>
          <span>发件人：</span>
          <span>{{ getNamedContact(email.fromAddress, email.fromName) }}</span>
        </li>
      </ul>
    </Card>
    <div style="margin: 10px;">
      <pre v-if="email.type === 'text'" style="white-space: pre-line">
        {{ email.content }}
      </pre>
      <div v-if="email.type === 'html'" v-html="email.content"></div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { getNamedContact } from '@/utils/emails'
import { Card } from 'iview'

export default {
  name: 'EmailDetails',
  components: {
    Card
  },
  data () {
    return {
      email: null
    }
  },
  methods: {
    getNamedContact
  },
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

