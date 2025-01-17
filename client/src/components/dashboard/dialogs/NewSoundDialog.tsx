import React, { useState } from 'react'

import { AccessLevelRoles, AccessLevelRolesConst, NewSound, Whitelists } from '../../../types'
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
  onAdd: (sound: NewSound) => Promise<void>,
  whitelists: Whitelists
}

interface State {
  access: AccessLevelRoles[], // list of access roles
  accessWhitelists: string[], // list of whitelists
  accessUsernames: string[], // list of usernames
  command: string,
  file: File | null,
  level: number | number[],
  error: boolean
}

const getInitialState = (): State => ({
  access: [], // list of access roles
  accessWhitelists: [], // list of whitelists
  accessUsernames: [], // list of usernames
  command: '',
  file: null,
  level: 50,
  error: false
})

export default ({
  isOpen,
  onClose,
  onAdd,
  whitelists
}: Props) => {
  const classes = useStyles()
  const [state, setState] = useState<State>(getInitialState)
  const [newName, setNewName] = useState<string>('')

  const appendToCustomOverrides = () => {
    if (!state.accessUsernames.includes(newName)) {
      let accessUsernames = state.accessUsernames
      accessUsernames.push(newName)
      setState({
        ...state,
        accessUsernames: accessUsernames
      })
    }
  }

  const _handleClose = () => {
    onClose()
    setState(getInitialState)
  }

  const _handleUpload = () => {
    if (state.file !== null && state.command !== '') {
      onAdd({
        access: state.access,
        accessWhitelists: state.accessWhitelists,
        accessUsernames: state.accessUsernames,
        command: state.command,
        file: state.file,
        level: Number(state.level)
      })
        .then(() => {
          onClose()
          setState(getInitialState)
        })
        .catch(() => {
          setState({
            ...state,
            error: true
          })
        })
    }
  }

  const handleBlur = () => {
    if (state.level < 0) {
      setState({ ...state, level: 0 })
    }
    else if (state.level > 100) {
      setState({ ...state, level: 100 })
    }
  }

  const _playSound = () => {
    if (state.file) {
      const audio = new Audio(window.URL.createObjectURL(state.file))
      const volumeLevel = (Number(state.level) / 100)
      audio.volume = 0.75 * volumeLevel
      audio.play()
    }
  }

  return (
    <Dialog
      fullWidth
      maxWidth='md'
      open={isOpen}
      onClose={_handleClose}
      aria-labelledby='active-dialog-title'
    >
      <DialogTitle id='active-dialog-title'>Add new sound</DialogTitle>
      <DialogContent>
        <TextField
          label='Command'
          value={state.command}
          onChange={e => setState({
            ...state,
            command: e.currentTarget.value
          })}
          fullWidth
          error={state.error}
          variant='outlined'
          className={classes.text}
        />
        <DialogContentText>Roles</DialogContentText>
        <FormControl variant='outlined' fullWidth>
          <InputLabel htmlFor='select-access-level'>
            Roles whitelist
          </InputLabel>
          <Select
            value={state.access}
            onChange={(e: any) => setState({
              ...state,
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
            error={state.error}
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
            value={state.accessWhitelists}
            onChange={(e: any) => setState({
              ...state,
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
            error={state.error}
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
            value={state.accessUsernames}
            onChange={(e: any) => setState({
              ...state,
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
            error={state.error}
            input={
              <OutlinedInput
                labelWidth={123}
              />
            }
          >
            {state.accessUsernames.map(s => (
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
          onChange={e => setState({
            ...state,
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
            Upload Sound
            <FileUploadOutline className={classes.icon} />
            {state.file !== null && (
              ` (${state.file.name})`
            )}
          </Button>
        </label>
        {state.file !== null && (
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
                  value={typeof state.level === 'number' ? state.level : 0}
                  onChange={(e, v) => {
                    if (state.level !== v) {
                      setState({ ...state, level: v })
                    }
                  }}
                  step={5}
                  aria-labelledby='input-slider'
                />
              </Grid>
              <Grid item>
                <Input
                  className={classes.input}
                  value={state.level}
                  margin='dense'
                  onChange={e => setState({ ...state, level: Number(e.target.value) })}
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
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={_handleClose} color='secondary'>
          Close
        </Button>
        {state.file !== null && state.command !== '' && (
          <Button onClick={_handleUpload} color='primary'>
            Add
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}
