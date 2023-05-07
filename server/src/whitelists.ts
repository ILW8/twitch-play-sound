import * as jsonfile from 'jsonfile'
import { Whitelists } from './types'

const fileWhitelists = './db/db-whitelists.json'

const readWhitelists = (): Promise<{[key: string]: string[]}> => new Promise((resolve, reject) => {
  jsonfile.readFile(fileWhitelists, (err, mainObj: {[key: string]: string[]}) => {
    if (err) {
      if (err.code === 'ENOENT') {
        jsonfile.writeFile(fileWhitelists, {}, (err) => {
          if (err) reject(err)
          resolve({})
        })
      }
    }
    resolve(mainObj)
  })
})

const setWhitelists = (
  data: Whitelists
) => new Promise((resolve, reject) => {
  let newData = {}
  for (const key in data) {
    let newEntry: string[] = []
    for (const value of data[key]) {
      newEntry.push(value.toLowerCase())
    }
    newData[key] = newEntry
  }
  jsonfile.writeFile(fileWhitelists, newData, (err) => {
    if (err) reject(err)
    resolve()
  })
})

export const addWhitelist = async (
  whitelistName: string,
  data: string[]
): Promise<Whitelists> => {
  console.log(whitelistName)
  console.log(data)
  try {
    const whitelists = await readWhitelists()

    if (!(whitelistName in whitelists)) {
      whitelists[whitelistName] = data
      await setWhitelists(whitelists)
    }
    else {
      throw new Error('whitelist "' + whitelistName + '" already exists')
    }
    return whitelists
  }
  catch (err) {
    console.log(err)
    throw err
  }
}

export const deleteWhitelist = async (
  whitelistName: string
): Promise<Whitelists> => {
  try {
    const whitelists = await readWhitelists()

    if (whitelistName in whitelists) {
      delete whitelists[whitelistName]
      await setWhitelists(whitelists)
    }
    return whitelists
  }
  catch (err) {
    console.log(err)
    throw new Error(err)
  }
}

export const updateWhitelist = async (
  name: string,
  data: string[]
): Promise<boolean> => {
  try {
    let whitelists = await readWhitelists()
    if (!(name in whitelists)) {
      return false
    }

    whitelists[name] = data
    await setWhitelists(whitelists)
    return true
  }
  catch (err) {
    console.log(err)
    throw new Error(err)
  }
}

export const getWhitelist = async (
  name: string | undefined
): Promise<undefined | string[]> => {
  if (name === undefined) {
    return undefined
  }

  const whitelists = await readWhitelists()
  return whitelists[name]
}

export const fetchWhitelists = async (): Promise<{[key: string]: string[]}> => readWhitelists()
export const migrateWhitelistsDB = async () => setWhitelists({})

export const migradeWhitelistsDatabase = async () => {
  try {
    await fetchWhitelists()
  }
  catch (e) {
    console.log('Migrating user DB')
    await migrateWhitelistsDB()
  }
}
