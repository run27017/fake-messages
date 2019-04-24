<template>
  <div class="help">
    <HelpMarkdown />
  </div>
</template>

<script>
import HelpMarkdown from '@/components/Help.md'
import 'highlight.js/styles/github-gist.css'

export default {
  name: 'Help',
  components: {
    HelpMarkdown
  }
}
</script>

<style scoped lang="scss">
.help {
  width: 960px;
  margin: auto;
  font-size: 1.2em;

  /deep/ {
    h2 {
      margin-top: 1em;
    }

    ol, ul {
      margin: 1em 2em;
    }

    pre {
      margin: 1em 2em;
    }
  }
}
</style>

