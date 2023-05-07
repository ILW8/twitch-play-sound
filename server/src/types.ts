export const AccessLevelRolesConst = ['ALL', 'VIP', 'MOD', 'SUB'] as const
export type AccessLevelRoles = typeof AccessLevelRolesConst[number];
export type UserFlags = 'ban' | 'all-access'

export interface Whitelists { [key: string]: string[] }

export interface Sound { // for the backend
  id: string,
  access: AccessLevelRoles[], // list of access roles
  accessWhitelists: string[], // list of whitelists
  accessUsernames: string[], // list of usernames
  command: string,
  path: string,
  level: number
}

export interface SoundRequest { // for the frontend?
  access: AccessLevelRoles[], // list of access roles
  accessWhitelists: string[], // list of whitelists
  accessUsernames: string[], // list of usernames
  command: string,
  path: string,
  level: number
}

export interface TwitchConfig {
  username: string | null,
  oauth: string | null,
  channels: string[] | null
}

export interface User {
  id: string,
  username: string,
  flags: UserFlags[]
}

export interface UserRequest {
  username: string,
  flags: UserFlags[]
}
