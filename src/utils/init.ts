import getIP from './getIP';
import config from '../../config';

export default function init() {

  const ip = getIP()

  if (!ip) {
    throw new Error(
      'Could not get the IP of this machine'
    )
  }

  console.log('Found IP:  ', ip)

  let host: any

  for (const server of config.servers) {
    if (server.ip.trim() === ip) {
      host = server
    }
  }

  if (!host) {
    throw new Error(
      `This machine\'s IP (${ip}) is not defined in the config.ts file`
    )
  }

  console.log('Found host:', host)

  if (host.tls.enabled === true && (!host.domain)) {
    throw new Error(
      `If you want to enable SSL/TLS you must enter the domain of this machine`
    )
  }
}
