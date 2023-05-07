import React, { useState } from 'react'
import { Layout, WhitelistsTable, NewWhitelistDialog, EditWhitelistDialog } from '.'
import { Whitelist } from '../../types'
import { Plus } from 'mdi-material-ui'
import { useWhitelists } from '../../hooks'

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
  const [ editableWhitelist, setEditableWhitelist ] = useState<null | {name: string, whitelist: Whitelist}>(null)

  const {
    whitelists,
    loading: whitelistsLoading,
    addWhitelist,
    deleteWhitelist,
    editWhitelist
  } = useWhitelists()

  return (
    <>
      <Layout title='Manage Whitelists'>
        <WhitelistsTable
          whitelists={whitelists}
          loading={whitelistsLoading}
          onDelete={deleteWhitelist}
          onEdit={(whitelistName) => setEditableWhitelist(whitelistName)}
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
      <EditWhitelistDialog
        isOpen={editableWhitelist !== null}
        onClose={() => setEditableWhitelist(null)}
        whitelist={editableWhitelist}
        onEdit={editWhitelist}
        setWhitelist={setEditableWhitelist}
      />
    </>
  )
}
