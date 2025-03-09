import { networkInterfaces } from 'node:os'

export default function getIP(): string | undefined {
  const net = networkInterfaces()

  let IP = null;

  for (const interfaceName in net) {

    const networkInterface = net[interfaceName]
    if (!networkInterface) continue

    for (const i of networkInterface) {
      if (i.family === 'IPv4' && !i.internal) {

        IP = i.address
        break
      }
    }

    if (IP) return IP
  }

  return undefined
}

