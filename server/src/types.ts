export type AccessLevel = 'ALL' | 'VIP' | 'MOD' | 'SUB'

export interface Sound {
  id: string,
  access: AccessLevel,
  command: string,
  path: string,
  level: number
}

export interface SoundRequest {
  access: AccessLevel,
  command: string,
  path: string,
  level: number
}

export interface TwitchConfig {
  username: string | null,
  oauth: string | null,
  channels: string[] | null
}
