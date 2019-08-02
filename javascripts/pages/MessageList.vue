<template>
  <div>
    <Form :label-width="80" inline>
      <FormItem label="接收手机">
        <AutoComplete v-model="filters.toMobile"
                      :data="options.toMobiles"
                      @on-change="fetchToMobiles" />
      </FormItem>
      <FormItem label="标签">
        <Select v-model="filters.tag" clearable style="width:200px">
          <Option v-for="tag in options.tags" :value="tag" :key="tag">{{ tag }}</Option>
        </Select>
      </FormItem>
    </Form>
    <Table :row-class-name="tableRowClassName" :columns="columns" :data="messages"
           @on-row-click="readRow">
      <template slot-scope="{ row }" slot="toMobile">
        <a @click="filters.toMobile = row.toMobile">
          {{ row.toMobile }}
        </a>
      </template>
      <template slot-scope="{ row }" slot="tags">
        {{ row.tags.join(', ') }}
      </template>
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
          slot: 'toMobile'
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
      },
      options: {
        tags: [],
        toMobiles: []
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
    fetchToMobiles (filter = '') {
      axios.get('/messages/toMobiles', { params: { filter } })
        .then(({ data: { toMobiles }}) => {
          this.options.toMobiles = toMobiles
        })
        .catch(function () {
          console.log('error', arguments);
        })
    },
    fetchTags () {
      axios.get('/messages/tags')
        .then(({ data: { tags }}) => {
          this.options.tags = tags
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
    },
    isMatchFilters (email) {
      if (this.filters.toMobile && email.toMobile !== this.filters.toMobile) {
        return false
      }
      if (this.filters.tag && email.tags.indexOf(this.filters.tag) === -1) {
        return false
      }
      return true
    }
  },
  created () {
    this.fetchMessages()
    this.fetchToMobiles()
    this.fetchTags()

    // 因为使用了keep-alive，不需要removeEventListener之类的操作
    websocket.addEventListener('NewMessage', ({ data: message }) => {
      if (this.isMatchFilters(message)) {
        message.isNew = true
        this.messages.unshift(message)
      }
    })
  }
}
</script>

