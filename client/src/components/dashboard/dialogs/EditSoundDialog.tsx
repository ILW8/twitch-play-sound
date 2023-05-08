import React, { Dispatch, SetStateAction, Fragment, useState } from 'react'

import { AccessLevelRolesConst, EditSound, Whitelists } from '../../../types'
import { customColors } from '../../../theme'
import { IconHelper } from '../'

import {
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  Button,
  TextField,
  FormControl,
  InputLabel,
  OutlinedInput,
  Select,
  MenuItem,
  createStyles,
  makeStyles,
  Theme,
  Typography as T,
  Grid,
  Input,
  Slider,
  IconButton,
  Tooltip, Chip, DialogContentText
} from '@material-ui/core'

import {
  FileUploadOutline,
  VolumeHigh,
  Play
} from 'mdi-material-ui'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    text: {
      margin: theme.spacing(2, 0)
    },
    error: {
      color: customColors.danger.main
    },
    input: {
      display: 'none'
    },
    icon: {
      marginLeft: theme.spacing(1)
    },
    replay: {
      marginRight: theme.spacing(2)
    },
    menuitem: {
      verticalAlign: 'middle'
    },
    menuItemText: {
      display: 'inline-flex',
      verticalAlign: 'super',
      fontWeight: 400,
      marginLeft: theme.spacing(1)
    },
    chip: {
      margin: theme.spacing(0, 0.5),
      cursor: 'pointer'
    },
    chips: {
      display: 'flex',
      flexWrap: 'wrap',
      cursor: 'pointer'
    }
  })
)

interface Props {
  isOpen: boolean,
  onClose: () => void,
  onEdit: (sound: EditSound) => Promise<void>,
  sound: EditSound | null,
  setSound: Dispatch<SetStateAction<EditSound | null>>,
  whitelists: Whitelists
}

export default ({
  isOpen,
  onClose,
  onEdit,
  sound,
  setSound,
  whitelists
}: Props) => {
  const classes = useStyles()
  const [newName, setNewName] = useState<string>('')

  const appendToCustomOverrides = () => {
    if (!sound) return
    if (!sound.accessUsernames.includes(newName)) {
      let accessUsernames = sound.accessUsernames
      accessUsernames.push(newName)
      setSound({
        ...sound,
        accessUsernames: accessUsernames
      })
    }
  }

  const _handleClose = () => {
    onClose()
  }

  const _handleUpload = () => {
    if (sound !== null && sound.command !== '') {
      onEdit({
        id: sound.id,
        access: sound.access,
        accessWhitelists: sound.accessWhitelists,
        accessUsernames: sound.accessUsernames,
        command: sound.command,
        file: sound.file,
        level: Number(sound.level),
        path: sound.path
      })
        .then(() => {
          onClose()
        })
        .catch(() => {
          setSound(null)
        })
    }
  }

  const handleBlur = () => {
    if (sound && sound.level < 0) {
      setSound({ ...sound, level: 0 })
    }
    else if (sound && sound.level > 100) {
      setSound({ ...sound, level: 100 })
    }
  }

  const _playSound = () => {
    if ((sound && sound.file) || (sound && sound.path)) {
      const audio = new Audio(sound.file !== null
        ? window.URL.createObjectURL(sound.file)
        : '/' + sound.path)

      const volumeLevel = (Number(sound.level) / 100)
      audio.volume = 0.75 * volumeLevel
      audio.play()
    }
  }

  if (sound === null) {
    return <Fragment />
  }

  return (
    <Dialog
      fullWidth
      maxWidth='md'
      open={isOpen}
      onClose={_handleClose}
      aria-labelledby='active-dialog-title'
    >
      <DialogTitle id='active-dialog-title'>Edit sound</DialogTitle>
      <DialogContent>
        <TextField
          label='Command'
          value={sound.command}
          onChange={e => setSound({
            ...sound,
            command: e.currentTarget.value
          })}
          fullWidth
          variant='outlined'
          className={classes.text}
        />
        <FormControl variant='outlined' fullWidth>
          <InputLabel htmlFor='select-access-level'>
            Roles whitelist
          </InputLabel>
          <Select
            value={sound.access}
            onChange={(e: any) => setSound({
              ...sound,
              access: e.target.value
            })}
            multiple
            fullWidth
            renderValue={selected => (
              <div className={classes.chips}>
                {(selected as string[]).map(value => (
                  <div key={value}>
                    <IconHelper access={value} />
                    <Chip label={value} className={classes.chip} />
                  </div>
                ))}
              </div>
            )}
            input={
              <OutlinedInput
                labelWidth={123}
              />
            }
          >
            {AccessLevelRolesConst.map(s => (
              <MenuItem key={s} value={s} className={classes.menuitem}>
                <IconHelper access={s} /> <T variant='h4' className={classes.menuItemText}>{s}</T>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <DialogContentText>Whitelists</DialogContentText>
        <FormControl variant='outlined' fullWidth margin={'normal'}>
          <InputLabel htmlFor='select-whitelist'>
            Custom whitelists
          </InputLabel>
          <Select
            value={sound.accessWhitelists}
            onChange={(e: any) => setSound({
              ...sound,
              accessWhitelists: e.target.value
            })}
            multiple
            fullWidth
            renderValue={selected => (
              <div className={classes.chips}>
                {(selected as string[]).map(value => (
                  <Chip key={value} label={value} className={classes.chip} />
                ))}
              </div>
            )}
            input={
              <OutlinedInput
                labelWidth={123}
              />
            }
          >
            {Object.keys(whitelists).map(s => (
              <MenuItem key={s} value={s} className={classes.menuitem}>
                <T variant='h4' className={classes.menuItemText}>{s}</T>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <DialogContentText>Custom user overrides</DialogContentText>
        <Grid container spacing={0}>
          <Grid item xs>
            <TextField
              label='Twitch username'
              onChange={e => setNewName(e.currentTarget.value)}
              fullWidth
              variant='outlined'
              className={classes.text}
            />
          </Grid>
          <Grid item xs>
            <Button variant={'contained'} onClick={appendToCustomOverrides} color='primary'>
              Add {newName} to custom overrides
            </Button>
          </Grid>
        </Grid>
        <FormControl variant='outlined' fullWidth margin={'normal'}>
          <InputLabel htmlFor='select-username-overrides'>
            Custom username override (allow)
          </InputLabel>
          <Select
            value={sound.accessUsernames}
            onChange={(e: any) => setSound({
              ...sound,
              accessUsernames: e.target.value
            })}
            multiple
            fullWidth
            renderValue={selected => (
              <div className={classes.chips}>
                {(selected as string[]).map(value => (
                  <Chip key={value} label={value} className={classes.chip} />
                ))}
              </div>
            )}
            input={
              <OutlinedInput
                labelWidth={123}
              />
            }
          >
            {sound.accessUsernames.map(s => (
              <MenuItem key={s} value={s} className={classes.menuitem}>
                <T variant='h4' className={classes.menuItemText}>{s}</T>
              </MenuItem>
            ))}
          </Select>

        </FormControl>
        <input
          className={classes.input}
          id='sound-file-button'
          type='file'
          onChange={e => setSound({
            ...sound,
            file: e.target.files && e.target.files[0]
              ? e.target.files[0]
              : null
          })}
        />
        <label htmlFor='sound-file-button'>
          <Button
            variant='contained'
            component='span'
            color='default'
            fullWidth
            className={classes.text}
          >
            {sound.file === null ? 'Upload New Sound' : 'New Sound' }
            <FileUploadOutline className={classes.icon} />
            {sound.file !== null && (
              ` (${sound.file.name})`
            )}
          </Button>
        </label>
        <div>
          <T id='input-slider' gutterBottom>
            Volume
          </T>
          <Grid container spacing={2} alignItems='center'>
            <Grid item>
              <VolumeHigh />
            </Grid>
            <Grid item xs>
              <Slider
                value={typeof sound.level === 'number' ? sound.level : 0}
                onChange={(e, v) => {
                  if (sound && sound.level !== v) {
                    setSound({ ...sound, level: Number(v) })
                  }
                }}
                step={5}
                aria-labelledby='input-slider'
              />
            </Grid>
            <Grid item>
              <Input
                className={classes.input}
                value={sound.level}
                margin='dense'
                onChange={e => setSound({ ...sound, level: Number(e.target.value) })}
                onBlur={handleBlur}
                inputProps={{
                  step: 10,
                  min: 0,
                  max: 100,
                  type: 'number',
                  'aria-labelledby': 'input-slider'
                }}
              />
            </Grid>
            <Grid item className={classes.replay}>
              <Tooltip placement='top' title='Test Sound Level'>
                <IconButton color='primary' onClick={_playSound}>
                  <Play />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={_handleClose} color='secondary'>
          Close
        </Button>
        {sound.command !== '' && (
          <Button onClick={_handleUpload} color='primary'>
            Update
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}
