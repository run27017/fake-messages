import Vue from 'vue/dist/vue.esm.js'
import axios from 'axios'
import 'iview/dist/styles/iview.css'
import { Table } from 'iview'

new Vue({
  el: '#app',
  components: {
    'i-table': Table
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
    emails: []
  },
  methods: {
    getContactString(address, name) {
      if (name) {
        return name + ' <' + address + '>'
      } else {
        return address
      }
    }
  },
  created () {
    axios.get('/emails')
      .then(response => {
        this.emails = response.data;
      })
      .catch(function () {
        console.log('error', arguments);
      })
  }
})
