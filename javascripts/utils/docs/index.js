import spec from './swagger.yaml'

const host = window.location.host
const scheme = (() => {
  const protocol = window.location.protocol
  return protocol.substr(0, protocol.length - 1)
})()

spec.host = host
spec.schemes = [scheme]

export default spec 

