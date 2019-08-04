<template>
  <div>
    <div ref="swagger"></div>
  </div>
</template>

<script>
import SwaggerUI from 'swagger-ui'
import 'swagger-ui/dist/swagger-ui.css'
import docs from '@/utils/docs'

export default {
  mounted () {
    SwaggerUI({
      domNode: this.$refs.swagger,
      spec: docs,
      defaultModelExpandDepth: 3,
      displayRequestDuration: true,
      docExpansion: 'list'
    })
  }
}
</script>

