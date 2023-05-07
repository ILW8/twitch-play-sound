import React, { Dispatch, SetStateAction, Fragment, useState } from 'react'

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
  onEdit: (name: string, whitelist: Whitelist) => Promise<void>,
  whitelist: {name: string, whitelist: Whitelist} | null,
  setWhitelist: Dispatch<SetStateAction<{name: string, whitelist: Whitelist} | null>>
}

export default ({
  isOpen,
  onClose,
  onEdit,
  whitelist,
  setWhitelist
}: Props) => {
  const classes = useStyles()

  const [newName, setNewName] = useState<string>('')

  const appendToWhitelist = () => {
    if (whitelist === null) return
    if (!whitelist.whitelist.includes(newName)) {
      let _whitelist = whitelist.whitelist
      _whitelist.push(newName)
      setWhitelist({
        ...whitelist,
        whitelist: _whitelist
      })
    }
  }

  const _handleClose = () => {
    onClose()
  }

  const handleChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    if (whitelist === null) return
    setWhitelist({
      ...whitelist,
      whitelist: e.target.value as Whitelist
    })
  }

  const _handleSaveEditWhitelist = () => {
    if (whitelist && whitelist.name !== '') {
      onEdit(whitelist.name, whitelist.whitelist).then(() => onClose()).catch(() => onClose())
    }
  }

  if (whitelist === null) {
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
      <DialogTitle id='active-dialog-title'>Add new user</DialogTitle>
      <DialogContent>
        <TextField
          label='Twitch Username'
          value={whitelist.name}
          disabled
          fullWidth
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
          <InputLabel htmlFor='select-multiple-chip'>Whitelisted usernames</InputLabel>
          <Select
            multiple
            value={whitelist.whitelist}
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
            {whitelist.whitelist.map(name => (
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
        <Button onClick={_handleSaveEditWhitelist} color='primary' disabled={whitelist.name === ''}>
          Save edit
        </Button>
      </DialogActions>
    </Dialog>
  )
}
