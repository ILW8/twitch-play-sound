export const AccessLevelRolesConst = ['ALL', 'VIP', 'MOD', 'SUB'] as const
export type AccessLevelRoles = typeof AccessLevelRolesConst[number];
export type UserFlags = 'ban' | 'all-access'

export type AccessPermissions = string[];

export interface Sound {
  id: string,
  access: AccessLevelRoles[], // list of access roles
  accessWhitelists: string[], // list of whitelists
  accessUsernames: string[], // list of usernames
  command: string,
  path: string,
  level: number
}

export interface NewSound extends NewSoundNoUpload{
  file: File
}

export interface NewSoundNoUpload {
  access: AccessLevelRoles[], // list of access roles
  accessWhitelists: string[], // list of whitelists
  accessUsernames: string[], // list of usernames
  command: string,
  level: number
}

export interface EditSound extends NewSoundNoUpload {
  id: string,
  file: File | null,
  path: string
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
