'use client'
import { SnackbarKey, useSnackbar } from 'notistack'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/material/SvgIcon/SvgIcon'
import { Fragment, useEffect, useState } from 'react'

const useNotification = () => {
  const [conf, setConf] = useState<{
    msg: string
    variant: 'info' | 'default' | 'error' | 'success' | 'warning' | undefined
  }>()
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  const action = (key: SnackbarKey | undefined) => (
    <Fragment>
      <IconButton
        onClick={() => {
          closeSnackbar(key)
        }}
      >
        <CloseIcon />
      </IconButton>
    </Fragment>
  )
  useEffect(() => {
    if (conf?.msg) {
      let variant:
        | 'info'
        | 'default'
        | 'error'
        | 'success'
        | 'warning'
        | undefined = 'info'
      if (conf.variant) {
        variant = conf.variant
      }
      console.log('Hello')
      enqueueSnackbar(conf.msg, {
        variant: variant,
        autoHideDuration: 5000,
        action
      })
    }
  }, [conf])
  return setConf
}

export default useNotification
