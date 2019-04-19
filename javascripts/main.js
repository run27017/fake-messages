import Vue from 'vue/dist/vue.esm.js'
import axios from 'axios'
import 'iview/dist/styles/iview.css'
import { Table, Page } from 'iview'

new Vue({
  el: '#app',
  components: {
    'i-table': Table,
    'i-page': Page
  },
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
  data: {
    columns: [
      {
        title: '发件人',
        slot: 'from'
      },
      {
        title: '收件人',
        slot: 'to'
      },
      {
        title: '主题',
        key: 'subject'
      },
      {
        title: '内容',
        key: 'content'
      },
      {
        title: '时间',
        slot: 'createdAt'
      }
    ],
    emails: [],
    pageInfo: {
      number: 1,
      size: 10,
      total: 0
    }
  },
  computed: {
    pageParams () {
      return {
        from: (this.pageInfo.number - 1) * this.pageInfo.size + 1,
        size: this.pageInfo.size
      }
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
    pageNumberChanged (newPageNumber) {
      this.pageInfo.number = newPageNumber
      this.fetchEmails()
    },
    fetchEmails () {
      axios.get('/emails', { params: this.pageParams })
        .then(response => {
          const data = response.data
          this.emails = data.emails
          this.pageInfo.total = data.total
        })
        .catch(function () {
          console.log('error', arguments);
        })
    }
  },
  created () {
    this.fetchEmails()
  }
})
