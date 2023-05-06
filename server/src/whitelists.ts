import * as jsonfile from 'jsonfile'

const fileWhitelists = './db/db-whitelists.json'

const readWhitelists = (): Promise<{[key: string]: string[]}> => new Promise((resolve, reject) => {
  jsonfile.readFile(fileWhitelists, (err, mainObj: {[key: string]: string[]}) => {
    if (err) reject(err)
    resolve(mainObj)
  })
})

const setWhitelists = (
  data: {[key: string]: string[] }
) => new Promise((resolve, reject) => {
  jsonfile.writeFile(fileWhitelists, data, (err) => {
    if (err) reject(err)
    resolve()
  })
})

export const addWhitelist = async (
  whitelistName: string
): Promise<boolean> => {
  try {
    const whitelists = await readWhitelists()

    if (!(whitelistName in whitelists)) {
      whitelists[whitelistName] = []
      await setWhitelists(whitelists)

      return true
    }
    else {
      return false
    }
  }
  catch (err) {
    console.log(err)
    throw new Error(err)
  }
}

export const deleteWhitelist = async (
  whitelistName: string
): Promise<boolean> => {
  try {
    const whitelists = await readWhitelists()

    if (whitelistName in whitelists) {
      delete whitelists[whitelistName]
      await setWhitelists(whitelists)
      return true
    }
    return false
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
