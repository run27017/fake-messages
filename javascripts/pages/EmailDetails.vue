<template>
  <div v-if="email">
    <Card>
      <p slot="title">
        {{ email.subject }}
      </p>
      <ul style="list-style-type:none">
        <li>
          <span>收件人：</span>
          <span>{{ toNamedContact(email.toAddress, email.toName) }}</span>
        </li>
        <li>
          <span>时&nbsp;&nbsp;&nbsp;&nbsp;间：</span>
          <span>{{ email.createdAt | datetime }}</span>
        </li>
        <li>
          <span>发件人：</span>
          <span>{{ toNamedContact(email.fromAddress, email.fromName) }}</span>
        </li>
        <li>
          <span>标&nbsp;&nbsp;&nbsp;&nbsp;签：</span>
          <span>{{ email.tags.join(', ') }}</span>
        </li>
      </ul>
    </Card>
    <div style="margin: 10px;">
      <div v-if="email.type === 'html'" v-html="email.content"></div>
      <pre v-else style="white-space: pre-line">
        {{ email.content }}
      </pre>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { toNamedContact } from '@/utils/emails'
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
    toNamedContact
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

