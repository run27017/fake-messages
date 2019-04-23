import Vue from 'vue'

// datetime可以是时间戳、时间字符串
Vue.filter('datetime', function (datetime) {
  const date = new Date(datetime)
  const year = date.getFullYear()
  const month = date.getMonth()
  const day = date.getDate()
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const seconds = date.getSeconds()
  return `${year}年${month}月${day}日 ${hours}:${minutes}:${seconds}`
})
