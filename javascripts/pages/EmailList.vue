<template>
  <div>
    <Table :row-class-name="tableRowClassName" :columns="columns" :data="emails"
           @on-row-click="readRow">
      <template slot-scope="{ row }" slot="from">
        {{ toNamedContact(row.fromAddress, row.fromName) }}
      </template>
      <template slot-scope="{ row }" slot="to">
        {{ toNamedContact(row.toAddress, row.toName) }}
      </template>
      <template slot-scope="{ row }" slot="content">
        {{ row.content | plain(row.type) }}
      </template>
      <template slot-scope="{ row }" slot="createdAt">
        {{ row.createdAt | datetime }}
      </template>
      <template slot-scope="{ row }" slot="operators">
        <router-link :to="{ name: 'email', params: { id: row.id } }">查看</router-link>
      </template>
    </Table>
    <br>
    <Page :total="pageInfo.total" :current="pageInfo.number" @on-change="pageNumberChanged" />
  </div>
</template>

<script>
import axios from 'axios'
import websocket from '@/websocket'
import { toNamedContact } from '@/utils/emails'
import { Table, Page } from 'iview'

export default {
  name: 'EmailList',
  components: {
    Table,
    Page
  },
  data() { 
    return {
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
          slot: 'content'
        },
        {
          title: '时间',
          slot: 'createdAt'
        },
        {
          title: '操作',
          slot: 'operators'
        }
      ],
      emails: [],
      pageInfo: {
        number: 1,
        size: 10,
        total: 0
      }
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
    toNamedContact,
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
    },
    tableRowClassName (row, index) {
      return row.isNew ? 'new-item' : ''
    },
    readRow (_, index) {
      this.emails[index].isNew = false
    }
  },
  created () {
    this.fetchEmails()
    // 因为使用了keep-alive，不需要removeEventListener之类的操作
    websocket.addEventListener('EmailReceived', ({ data }) => {
      const email = Object.assign({}, data)
      email.isNew = true
      this.emails.unshift(email)
    })
  }
}
</script>

