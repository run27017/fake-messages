<template>
  <div>
    <Form :label-width="80" inline>
      <FormItem label="收件人">
        <AutoComplete v-model="filters.toAddress"
                      :data="options.toAddresses"
                      @on-change="fetchToAddresses" />
      </FormItem>
      <FormItem label="发件人">
        <AutoComplete v-model="filters.fromAddress"
                      :data="options.fromAddresses"
                      @on-change="fetchFromAddresses" />
      </FormItem>
      <FormItem label="标签">
        <Select v-model="filters.tag" clearable style="width:200px">
          <Option v-for="tag in options.tags" :value="tag" :key="tag">{{ tag }}</Option>
        </Select>
      </FormItem>
      <FormItem label="起始时间">
        <DatePicker v-model="filters.createdAtFrom" type="datetime" placeholder="选择最小时间" style="width: 200px" />
      </FormItem>
      <FormItem label="截止时间">
        <DatePicker v-model="filters.createdAtTo" type="datetime" placeholder="选择最大时间" style="width: 200px" />
      </FormItem>
    </Form>
    <Table :row-class-name="tableRowClassName" :columns="columns" :data="emails"
           @on-row-click="readRow">
      <template slot-scope="{ row }" slot="from">
        <a @click="filters.fromAddress = row.fromAddress">
          {{ toNamedContact(row.fromAddress, row.fromName) }}
        </a>
      </template>
      <template slot-scope="{ row }" slot="to">
        <a @click="filters.toAddress = row.toAddress">
          {{ toNamedContact(row.toAddress, row.toName) }}
        </a>
      </template>
      <template slot-scope="{ row }" slot="tags">
        {{ row.tags.join(', ') }}
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

export default {
  name: 'EmailList',
  data() { 
    return {
      columns: [
        {
          title: '收件人',
          slot: 'to'
        },
        {
          title: '发件人',
          slot: 'from'
        },
        {
          title: '标签',
          slot: 'tags'
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
      filters: {
        fromAddress: '',
        toAddress: '',
        tag: '',
        createdAtFrom: undefined,
        createdAtTo: undefined
      },
      pageInfo: {
        number: 1,
        size: 10,
        total: 0
      },
      options: {
        tags: [],
        toAddresses: [],
        fromAddresses: []
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
        this.fetchEmails()
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
      axios.get('/emails', { params: { ...this.pageParams, ...this.filters } })
        .then(response => {
          const data = response.data
          this.emails = data.emails
          this.pageInfo.total = data.total
        })
        .catch(function () {
          console.log('error', arguments);
        })
    },
    fetchToAddresses (filter = '') {
      axios.get('/emails/toAddresses', { params: { filter } })
        .then(({ data: { toAddresses }}) => {
          this.options.toAddresses = toAddresses
        })
        .catch(function () {
          console.log('error', arguments);
        })
    },
    fetchFromAddresses (filter = '') {
      axios.get('/emails/fromAddresses', { params: { filter } })
        .then(({ data: { fromAddresses }}) => {
          this.options.fromAddresses = fromAddresses
        })
        .catch(function () {
          console.log('error', arguments);
        })
    },
    fetchTags () {
      axios.get('/emails/tags')
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
      this.emails[index].isNew = false
    },
    isMatchFilters (email) {
      if (this.filters.fromAddress && email.fromAddress !== this.filters.fromAddress) {
        return false
      }
      if (this.filters.toAddress && email.toAddress !== this.filters.toAddress) {
        return false
      }
      if (this.filters.tag && email.tags.indexOf(this.filters.tag) === -1) {
        return false
      }
      if (this.filters.createdAtFrom && new Date(email.createdAt) < this.filters.createdAtFrom) {
        return false
      }
      if (this.filters.createdAtTo && new Date(email.createdAt) > this.filters.createdAtTo) {
        return false
      }
      return true
    }
  },
  created () {
    this.fetchEmails()
    this.fetchToAddresses()
    this.fetchFromAddresses()
    this.fetchTags()

    // 因为使用了keep-alive，不需要removeEventListener之类的操作
    websocket.addEventListener('NewEmail', ({ data: email }) => {
      if (this.isMatchFilters(email)) {
        email.isNew = true
        this.emails.unshift(email)
      }
    })
  }
}
</script>

