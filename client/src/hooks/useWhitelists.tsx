import { useState, useEffect } from 'react'
import { Whitelist, Whitelists } from '../types'

import * as client from '../client'

interface WhitelistContext {
  whitelists: Whitelists,
  loading: boolean,
  addWhitelist: (name: string, whitelist: Whitelist) => Promise<void>,
  editWhitelist: (name: string, whitelist: Whitelist) => Promise<void>,
  deleteWhitelist: (name: string) => Promise<void>
}

export const useWhitelists = (): WhitelistContext => {
  const [whitelists, setWhitelists] = useState<{[key: string]: string[]}>({})
  const [loading, setLoading] = useState(true)

  const getUsers = () => client.fetchWhitelists()
    .then(whitelists => {
      setWhitelists(whitelists)
      setLoading(false)
    })

  const addWhitelist = (
    name: string,
    whitelist: Whitelist
  ): Promise<void> => client.addWhitelist(name, whitelist)
    .then(whitelists => {
      setWhitelists(whitelists)
    })

  const deleteWhitelist = (name: string): Promise<void> => client.deleteWhitelist(name)
    .then(whitelists => {
      setWhitelists(whitelists)
    })

  const editWhitelist = (name: string, whitelist: Whitelist): Promise<void> => client.editWhitelist(name, whitelist)
    .then(whitelists => {
      setWhitelists(whitelists)
    })

  useEffect(() => {
    getUsers()
  }, [])

  return {
    whitelists,
    loading,
    addWhitelist,
    deleteWhitelist,
    editWhitelist
  }
}
