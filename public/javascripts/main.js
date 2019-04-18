new Vue({
  el: '#app',
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
  created: function () {
    var vm = this;
    axios.get('/emails')
      .then(function (response) {
        vm.emails = response.data;
      })
      .catch(function () {
        console.log('error', arguments);
      })
  }
})
