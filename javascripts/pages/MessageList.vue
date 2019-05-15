<template>
  <div>
    <Table :columns="columns" :data="messages">
      <template slot-scope="{ row }" slot="createdAt">
        {{ row.createdAt | datetime }}
      </template>
    </Table>
    <br>
    <Page :total="pageInfo.total" :current="pageInfo.number" @on-change="pageNumberChanged" />
  </div>
</template>

<script>
import axios from 'axios'
import websocket from '@/websocket'
import { Table, Page } from 'iview'

export default {
  name: 'MessageList',
  components: {
    Table,
    Page
  },
  data() { 
    return {
      columns: [
        {
          title: '接收手机',
          key: 'toMobile'
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
      messages: [],
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
    pageNumberChanged (newPageNumber) {
      this.pageInfo.number = newPageNumber
      this.fetchMessages()
    },
    fetchMessages () {
      axios.get('/messages', { params: this.pageParams })
        .then(response => {
          const data = response.data
          this.messages = data.messages
          this.pageInfo.total = data.total
        })
        .catch(function () {
          console.log('error', arguments);
        })
    }
  },
  created () {
    this.fetchMessages()
    websocket.addEventListener('MessageReceived', ({ data }) => {
      if (this.pageInfo.number === 1) {
        this.fetchMessages()
      }
    })
  }
}
</script>
