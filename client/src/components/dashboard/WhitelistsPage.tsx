import React, { useState } from 'react'
import { Layout, WhitelistsTable, NewWhitelistDialog, EditUserDialog } from '.'
import { User } from '../../types'
import { Plus } from 'mdi-material-ui'
import { useUsers, useWhitelists } from '../../hooks'

import {
  createStyles,
  Theme,
  makeStyles,
  Tooltip,
  Fab
} from '@material-ui/core'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    action: {
      position: 'fixed',
      bottom: '0',
      right: '0',
      margin: theme.spacing(3.5)
    }
  })
)

export default () => {
  const classes = useStyles()
  const [ isNewDialogOpen, setIsNewDialogOpen ] = useState(false)
  const [ editableUser, setEditableUser ] = useState<null | User>(null)
  const {
    users,
    loading,
    addUser,
    deleteUser,
    editUser
  } = useUsers()

  const {
    whitelists,
    loading: whitelistsLoading,
    addWhitelist,
    deleteWhitelist,
    editWhitelist
  } = useWhitelists()

  return (
    <>
      <Layout title='Manage Users'>
        <WhitelistsTable
          whitelists={whitelists}
          loading={whitelistsLoading}
          onDelete={deleteWhitelist}
          onEdit={(user) => setEditableUser(user)}
        />
      </Layout>
      <div className={classes.action}>
        <Tooltip title='Add new user'>
          <Fab
            color='secondary'
            onClick={() => setIsNewDialogOpen(true)}
          >
            <Plus />
          </Fab>
        </Tooltip>
      </div>
      <NewWhitelistDialog
        isOpen={isNewDialogOpen}
        onClose={() => setIsNewDialogOpen(false)}
        onAdd={addWhitelist}
      />
      <EditUserDialog
        isOpen={editableUser !== null}
        onClose={() => setEditableUser(null)}
        user={editableUser}
        onEdit={editUser}
        setUser={setEditableUser}
      />
    </>
  )
}
