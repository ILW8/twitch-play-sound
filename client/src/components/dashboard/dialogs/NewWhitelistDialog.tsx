import React, { useState } from 'react'

import { Whitelist } from '../../../types'
import { customColors } from '../../../theme'

import {
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  Button,
  TextField,
  createStyles,
  makeStyles,
  Theme,
  FormControl,
  InputLabel,
  Select,
  Input,
  MenuItem,
  Chip
} from '@material-ui/core'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    text: {
      margin: theme.spacing(2, 0),
      width: '100%'
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

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
}

interface Props {
  isOpen: boolean,
  onClose: () => void,
  onAdd: (name: string, whitelist: Whitelist) => Promise<void>
}

interface State {
  name: string,
  whitelist: Whitelist,
  error: boolean
}

const getInitialState = (): State => ({
  name: '',
  whitelist: [],
  error: true
})

export default ({
  isOpen,
  onClose,
  onAdd
}: Props) => {
  const classes = useStyles()
  const [state, setState] = useState<State>(getInitialState)
  const [newName, setNewName] = useState<string>('')

  const _handleClose = () => {
    onClose()
    setState(getInitialState)
  }

  const handleChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    setState({
      ...state,
      whitelist: e.target.value as Whitelist
    })
  }

  const appendToWhitelist = () => {
    if (!state.whitelist.includes(newName)) {
      let whitelist = state.whitelist
      whitelist.push(newName)
      setState({
        ...state,
        whitelist: whitelist
      })
    }
  }

  const _handleNewWhitelist = () => {
    console.log('-------')
    console.log('_handleNewWhitelist')
    console.log(state.name)
    console.log(state.whitelist)
    if (state.name !== '') {
      onAdd(state.name, state.whitelist)
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

  return (
    <Dialog
      fullWidth
      maxWidth='md'
      open={isOpen}
      onClose={_handleClose}
      aria-labelledby='active-dialog-title'
    >
      <DialogTitle id='active-dialog-title'>Add new whitelist</DialogTitle>
      <DialogContent>
        <TextField
          label='Whitelist name'
          value={state.name}
          onChange={e => setState({
            ...state,
            error: e.currentTarget.value.length === 0,
            name: e.currentTarget.value
          })}
          fullWidth
          error={state.error}
          variant='outlined'
          className={classes.text}
        />

        <TextField
          label='Twitch username'
          onChange={e => setNewName(e.currentTarget.value)}
          fullWidth
          variant='outlined'
          className={classes.text}
        />
        <Button variant={'contained'} onClick={appendToWhitelist} color='primary'>
          Add {newName} to whitelist
        </Button>

        <FormControl className={classes.text}>
          <InputLabel htmlFor='select-multiple-chip' />
          <Select
            multiple
            value={state.whitelist}
            onChange={handleChange}
            input={<Input id='select-multiple-chip' />}
            fullWidth
            renderValue={selected => (
              <div className={classes.chips}>
                {(selected as string[]).map(value => (
                  <Chip key={value} label={value} className={classes.chip} />
                ))}
              </div>
            )}
            MenuProps={MenuProps}
          >
            {state.whitelist.map(name => (
              <MenuItem key={name} value={name}>
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={_handleClose} color='secondary'>
          Close
        </Button>
        <Button onClick={_handleNewWhitelist} color='primary' disabled={state.name === ''}>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  )
}
