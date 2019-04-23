import Vue from 'vue'

Vue.filter('plain', function (content, type) {
  if (type === 'html') {
    return content.replace(/<(?:.|\n)*?>/gm, ' ')
  } else {
    return content
  }
})

