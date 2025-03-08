import getIP from "./getIP";
import Iconfig from "../types/Iconfig";
import _config from "../../config.json";

const config = _config as Iconfig

export default function init() {
  const ip = getIP()
  let host = {}

  if (!ip) {
    throw new Error("Could not get the IP of this machine, are you connected to the internet?")
  }

  console.log("Found IP:  ", ip)

  for (const server in config.servers) {
    if (config.servers[server].ip === ip) {
      host = config.servers[server]
    }
  }

  if (!host) {
    throw new Error("This machine's IP is not defined in the config.json file")
  }

  console.log("Found host:", host)
}
