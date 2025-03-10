const config = {
  servers: [
    {
      domain: "",
      ip: "127.0.0.1",
      port: 3000,
      tls: {
        enabled: false,
        key: "/etc/letsencrypt/live/__DOMAIN__/privkey.pem",
        cert: "/etc/letsencrypt/live/__DOMAIN__/cert.pem"
      }
    },
    {
      domain: "cdn-3.example.com",
      ip: "127.0.0.1",
      port: 3000,
      tls: {
        enabled: true,
        key: "/etc/letsencrypt/live/__DOMAIN__/privkey.pem",
        cert: "/etc/letsencrypt/live/__DOMAIN__/cert.pem"
      }
    },
    {
      domain: "cdn-3.example.com",
      ip: "192.168.215.38",
      port: 3000,
      tls: {
        enabled: false,
        key: "/etc/letsencrypt/live/__DOMAIN__/privkey.pem",
        cert: "/etc/letsencrypt/live/__DOMAIN__/cert.pem"
      }
    }
  ],
}

export default config
