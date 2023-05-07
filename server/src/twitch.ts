import * as jsonfile from 'jsonfile'
import { Client, ChatUserstate } from 'tmi.js'
import { TwitchConfig } from './types'
import config from './config'
import { dispatchSocket } from './socket'
import { SOCKET, PERMISSIONS } from './enum'
import { fetchSounds } from './datastore'
import { findUser } from './users'
import { fetchWhitelists } from './whitelists'
import * as console from 'console'

const fileConfig = './db/db-twitch.json'

class TwitchConnection {
  connected: boolean
  username: string | null
  oauth: string | null
  channels: string[] | null

  client: null | Client

  constructor () {
    this.connected = false
    this.username = null
    this.oauth = null
    this.channels = null
    this.client = null
  }

  readConfig = (): Promise<TwitchConfig> => new Promise((resolve, reject) => {
    jsonfile.readFile(fileConfig, (err, cfg: TwitchConfig) => {
      if (err) reject(err)
      resolve(cfg)
    })
  })

  setConfig = (
    data: TwitchConfig
  ) => new Promise((resolve, reject) => {
    jsonfile.writeFile(fileConfig, data, (err) => {
      if (err) reject(err)
      resolve()
    })
  })

  onStartConnect = async () => {
    try {
      await this.readConfig()
    }
    catch (e) {
      console.log('Migrating twitch config DB')
      await this.setConfig({
        username: null,
        oauth: null,
        channels: null
      })
    }
    await this.loadConfig()

    if (this.oauth !== null) {
      try {
        await this.auth()
      }
      catch (e) {
        await this.resetConfig()
      }
    }
  }

  loadConfig = async () => {
    const config = await this.readConfig()
    this.username = config.username
    this.oauth = config.oauth
    this.channels = config.channels
  }

  updateConfig = async (config: TwitchConfig) => {
    await this.setConfig(config)
    this.username = config.username
    this.oauth = config.oauth
    this.channels = config.channels
    if (this.client && this.client.readyState() === 'OPEN') {
      await this.client.disconnect()
      await this.auth()
    }
    else {
      await this.auth()
    }
  }

  resetConfig = async () => {
    this.username = null
    this.oauth = null
    this.channels = null
    await this.setConfig({
      username: null,
      oauth: null,
      channels: null
    })
  }

  handleMessage = async (
    channel: string,
    user: ChatUserstate,
    message: string
  ) => {
    const sounds = await fetchSounds()
    for (const sound of sounds) {
      if (message.includes(sound.command)) {
        // console.log('"' + message + '" matched filter')
        const userBadgesRaw = user['badges-raw']
        const isUser = await findUser(user.username)
        if (isUser && isUser.flags.includes(PERMISSIONS.BANNED)) {
          return
        }

        let allowSound = false

        // check user role access
        for (const permRole of sound.access) {
          if (allowSound) break

          switch (permRole) {
            case 'ALL':
              allowSound = true
              break
            case 'MOD':
              if (user.mod || (isUser && isUser.flags.includes(PERMISSIONS.ALL_ACCESS))) {
                allowSound = true
              }
              break
            case 'SUB':
              if (user.subscriber
                  || user.mod
                  || (userBadgesRaw && userBadgesRaw.toLowerCase().includes('vip'))
                  || (isUser && isUser.flags.includes(PERMISSIONS.ALL_ACCESS))
              ) {
                allowSound = true
              }
              break
            case 'VIP':
              if (user.mod
                  || (userBadgesRaw && userBadgesRaw.toLowerCase().includes('vip'))
                  || (isUser && isUser.flags.includes(PERMISSIONS.ALL_ACCESS))
              ) {
                allowSound = true
              }
              break
          }
        }

        // noinspection LoopStatementThatDoesntLoopJS
        while (!allowSound) { // for control flow purposes
          if (user.username === undefined) break // if username undefined, don't bother checking whitelist

          // else check allowed user list
          for (const allowedUsername of sound.accessUsernames) {
            if (allowedUsername.toLowerCase() === user.username.toLowerCase()) {
              allowSound = true
              break
            }
          }
          if (allowSound) break // avoid checking whitelist if sound is already allowed to play

          // else check whitelist
          const whitelists = await fetchWhitelists()
          for (const whitelistName of sound.accessWhitelists) {
            if (!(whitelistName in whitelists)) continue
            if (whitelists[whitelistName].includes(user.username.toLowerCase())) {
              allowSound = true
              break
            }
          }
          break
        }

        if (allowSound) {
          console.log('[' + new Date().toISOString() + '] playing sound "' + sound.command + '"')
          dispatchSocket(SOCKET.PLAYER, sound)
        }
      }
    }
  }

  auth = async () => {
    try {
      if (this.username === null || this.oauth === null || this.channels === null) {
        throw new Error('No connection set!')
      }

      const options = {
        options: {
          debug: config.environment === 'DEVELOPMENT'
        },
        connection: {
          cluster: 'aws',
          reconnect: true
        },
        identity: {
          username: this.username,
          password: this.oauth
        },
        channels: this.channels
      }

      this.client = Client(options)
      this.client.connect()

      this.client.on('connected', () => {
        this.connected = true
        dispatchSocket(SOCKET.TWITCH, true)
      })

      this.client.on('disconnected', () => {
        this.connected = false
        dispatchSocket(SOCKET.TWITCH, false)
      })

      this.client.on('chat', (channel, user, message) => {
        this.handleMessage(channel, user, message)
      })
    }
    catch (e) {
      await this.resetConfig()
      return e
    }
  }

  getConfig = (): TwitchConfig => ({
    username: this.username,
    oauth: this.oauth,
    channels: this.channels
  })

  isAuth = (): boolean => this.connected

  disconnect = async () => {
    if (this.client) {
      await this.client.disconnect()
      this.connected = false
      dispatchSocket(SOCKET.TWITCH, false)
      await this.resetConfig()
    }
  }
}

const twitchConnection = new TwitchConnection()

export default twitchConnection
