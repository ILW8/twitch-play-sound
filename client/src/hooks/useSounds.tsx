import { useState, useEffect } from 'react'
import { Sound, NewSound, EditSound, NewSoundNoUpload } from '../types'

import * as client from '../client'

interface SoundContext {
  sounds: Sound[],
  loading: boolean,
  addSound: (sound: NewSound) => Promise<void>,
  editSound: (sound: EditSound) => Promise<void>,
  deleteSound: (id: string) => void
}

function populateForm (sound: NewSoundNoUpload) {
  const form = new FormData()
  sound.access.map((val) => {
    form.append('access[]', val)
  })
  sound.accessWhitelists.map((val) => {
    form.append('accessWhitelists[]', val)
  })
  sound.accessUsernames.map((val) => {
    form.append('accessUsernames[]', val)
  })
  form.append('command', sound.command)
  form.append('level', sound.level.toString())
  return form
}

export const useSounds = (): SoundContext => {
  const [sounds, setSounds] = useState<Sound[]>([])
  const [loading, setLoading] = useState(true)

  const getSounds = () => client.fetchSounds()
    .then(sounds => {
      setSounds(sounds)
      setLoading(false)
    })

  const addSound = (sound: NewSound): Promise<void> => {
    const form = populateForm(sound)
    form.append('sound', sound.file)
    return client.addSound(form)
      .then(s => setSounds([...sounds, s]))
  }

  const deleteSound = (id: string) => {
    client.deleteSound(id)
      .then(sounds => setSounds(sounds))
  }

  const editSound = (sound: EditSound) => {
    if (sound.file) {
      const form = populateForm(sound)
      form.append('sound', sound.file)
      return client.editSound(sound.id, form)
        .then(s => setSounds(sounds.map(i => i.id === s.id ? s : i)))
    }
    else {
      return client.editSoundNoUpload(sound.id, {
        access: sound.access,
        accessWhitelists: sound.access,
        accessUsernames: sound.access,
        command: sound.command,
        level: sound.level
      })
        .then(s => setSounds(sounds.map(i => i.id === s.id ? s : i)))
    }
  }

  useEffect(() => {
    getSounds().then(null)
  }, [])

  return {
    sounds,
    loading,
    addSound,
    editSound,
    deleteSound
  }
}
