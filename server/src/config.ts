import * as dotenv from 'dotenv'

dotenv.config()

interface ConfigType {
  port: number,
  ip: string,
  uuidNameSpace: string,
  environment: string,
  socketIoPort: number
}

const config: ConfigType = {
  port: Number(process.env.SERVER_PORT) || 8080,
  ip: process.env.LISTEN_IP || '127.0.0.1',
  socketIoPort: Number(process.env.SOCKET_PORT) || 8081,
  uuidNameSpace: process.env.UUID_NAMESPACE || '00 02 32 ef 70 30 a8 ea e4 c5 21 69 95 da 8a c5',
  environment: process.env.ENVIRONMENT || 'PRODUCTION'
}

export default config
