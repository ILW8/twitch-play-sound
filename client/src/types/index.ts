export type AccessLevel = 'ALL' | 'VIP' | 'MOD' | 'SUB' | 'WHITELIST'
export type UserFlags = 'ban' | 'all-access'

export type AccessPermissions = string[];

export interface Sound {
  id: string,
  access: AccessPermissions,
  command: string,
  path: string,
  level: number
}

export interface NewSound {
  access: AccessPermissions,
  command: string,
  file: File,
  level: number
}

export interface NewSoundNoUpload {
  access: AccessLevel,
  command: string,
  level: number
}

export interface EditSound {
  id: string,
  access: AccessLevel,
  command: string,
  file: File | null,
  path: string,
  level: number
}

export interface TwitchUser {
  username: string | null,
  oauth: string | null,
  channels: string[] | null
}

export interface User {
  id: string,
  username: string,
  flags: UserFlags[]
}

export type Whitelist = string[]

export interface Whitelists {
  [key: string]: Whitelist
}

export interface NewUser {
  username: string,
  flags: UserFlags[]
}

export interface Config {
  socketUrl: string
}
