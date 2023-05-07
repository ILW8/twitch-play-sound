import React from 'react'
import clsx from 'clsx'

import {
  Whitelist, Whitelists
} from '../../types'

import {
  Table,
  TableHead,
  TableCell,
  TableBody,
  TableRow,
  createStyles,
  makeStyles,
  Theme,
  LinearProgress,
  IconButton,
  Tooltip,
  Typography as T
} from '@material-ui/core'

import { DeleteOutline, Pencil } from 'mdi-material-ui'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    table: {
      minWidth: 650,
      marginTop: theme.spacing(1)
    },
    loading: {
      marginTop: theme.spacing(1)
    },
    small: {
      padding: theme.spacing(0.75)
    },
    iconOffset: {
      marginRight: theme.spacing(2)
    },
    accessText: {
      display: 'inline-flex',
      verticalAlign: 'super',
      marginLeft: theme.spacing(1.5)
    }
  })
)

interface Props {
  whitelists: Whitelists,
  loading: boolean,
  onDelete: (id: string) => void,
  onEdit: (editableWhitelist: { name: string, whitelist: Whitelist }) => void
}

export default ({
  whitelists,
  loading,
  onDelete,
  onEdit
}: Props) => {
  const classes = useStyles()

  if (loading) {
    return (
      <LinearProgress color='secondary' className={classes.loading} />
    )
  }

  return (
    <Table className={classes.table}>
      <TableHead>
        <TableRow>
          <TableCell>Whitelist name</TableCell>
          <TableCell>Users</TableCell>
          <TableCell align='right'>Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {
          Object.keys(whitelists).map(whitelistName => (
            <TableRow
              key={whitelistName}
              className='contains-inv-actions'
            >
              <TableCell component='th' scope='row'>
                {whitelistName}
              </TableCell>
              <TableCell>
                {whitelists[whitelistName].map(i => <T key={i}>{i} </T>)}
              </TableCell>
              <TableCell align='right'>
                <div className='inv-actions' style={{ float: 'right' }}>
                  <Tooltip placement='top' title='Edit whitelist'>
                    <IconButton
                      className={clsx(classes.small, classes.iconOffset)}
                      onClick={() => onEdit({ name: whitelistName, whitelist: whitelists[whitelistName] })}
                    >
                      <Pencil />
                    </IconButton>
                  </Tooltip>
                  <Tooltip placement='top' title={'Delete whitelist ' + "'" + whitelistName + "'"}>
                    <IconButton className={classes.small} onClick={() => onDelete(whitelistName)}>
                      <DeleteOutline />
                    </IconButton>
                  </Tooltip>
                </div>
              </TableCell>
            </TableRow>
          ))
        }
      </TableBody>
    </Table>
  )
}
