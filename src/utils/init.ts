import getIP from './getIP';
import IConfig from '../types/IConfig';
import _config from '../../config.json';
const config = _config as IConfig

export default function init() {

  /*
   * Get host IP
   * */
  const ip = getIP()

  if (!ip) {
    throw new Error('Could not get the IP of this machine, are you connected to the internet?')
  }
  console.log('Found IP:  ', ip)


  /*
   * Check if host ip exists in the config
   * */
  let host = {}

  for (const server of config.servers) {
    if (server.ip.trim() === ip) {
      host = server
    }
  }

  if (!host) {
    throw new Error('This machine\'s IP is not defined in the config.json file')
  }
  console.log('Found host:', host)


}
