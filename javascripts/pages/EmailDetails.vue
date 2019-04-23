<template>
  <div>
    <ul v-if="email">
      <li>
        <span>收件人：</span>
        <span>{{ getContactString(email.toAddress, email.toName) }}</span>
      </li>
      <li>
        <span>发件人：</span>
        <span>{{ getContactString(email.fromAddress, email.fromName) }}</span>
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

export default {
  name: 'EmailDetails',
  filters: {
    datetime (timestamps) {
      const date = new Date(timestamps)
      const year = date.getFullYear()
      const month = date.getMonth()
      const day = date.getDate()
      const hours = date.getHours()
      const minutes = date.getMinutes()
      const seconds = date.getSeconds()
      return `${year}年${month}月${day}日 ${hours}:${minutes}:${seconds}`
    }
  },
  data () {
    return {
      email: null
    }
  },
  methods: {
    getContactString (address, name) {
      if (name) {
        return name + ' <' + address + '>'
      } else {
        return address
      }
    },
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

