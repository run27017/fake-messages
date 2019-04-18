new Vue({
  el: '#app',
  data: {
    columns: [
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
