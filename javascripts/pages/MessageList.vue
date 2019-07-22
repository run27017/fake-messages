<template>
  <div>
    <Form :label-width="80" inline>
      <FormItem label="接受者手机">
        <Input v-model="filters.toMobile"></Input>
      </FormItem>
      <FormItem label="标签">
        <Input v-model="filters.tag"></Input>
      </FormItem>
    </Form>
    <Table :row-class-name="tableRowClassName" :columns="columns" :data="messages"
           @on-row-click="readRow">
      <template slot-scope="{ row }" slot="createdAt">
        {{ row.createdAt | datetime }}
      </template>
      <template slot-scope="{ row }" slot="tags">
        {{ row.tags.join(', ') }}
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
          title: '标签',
          slot: 'tags'
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
      filters: {
        toMobile: '',
        tag: ''
      },
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
  watch: {
    filters: {
      deep: true,
      handler () {
        this.pageInfo.number = 1
        this.fetchMessages()
      }
    }
  },
  methods: {
    pageNumberChanged (newPageNumber) {
      this.pageInfo.number = newPageNumber
      this.fetchMessages()
    },
    fetchMessages () {
      axios.get('/messages', { params: { ...this.filters, ...this.pageParams } })
        .then(response => {
          const data = response.data
          this.messages = data.messages
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
      this.messages[index].isNew = false
    }
  },
  created () {
    this.fetchMessages()
    // 因为使用了keep-alive，不需要removeEventListener之类的操作
    websocket.addEventListener('NewMessage', ({ data }) => {
      const message = Object.assign({}, data)
      message.isNew = true
      this.messages.unshift(message)
    })
  }
}
</script>

