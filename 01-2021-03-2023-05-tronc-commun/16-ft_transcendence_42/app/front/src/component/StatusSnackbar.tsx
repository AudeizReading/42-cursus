import React from 'react';

import { Snackbar, Alert, SnackbarProps } from '@mui/material';

interface StatusSnackbarProps {
  successText?: string,
  errorText?: string,
  warningText?: string,
  infotext?: string,

  status: string,

  snackbarProps: SnackbarProps,
}

export default function StatusSnackbar(props: StatusSnackbarProps)
{
  const snackProps = props.snackbarProps;
  
  return (
    <React.Fragment>

      <Snackbar open={props.status === "success"} {...snackProps} >
        <Alert severity="success" variant="filled">
          {props.successText}
        </Alert>
      </Snackbar>
      
      <Snackbar open={props.status === "error"} {...snackProps} >
        <Alert severity="error" variant="filled">
          {props.errorText}
        </Alert>
      </Snackbar>

      <Snackbar open={props.status === "warning"} {...snackProps} >
        <Alert severity="warning" variant="filled">
          {props.warningText}
        </Alert>
      </Snackbar>

      <Snackbar open={props.status === "info"} {...snackProps} >
        <Alert severity="info" variant="filled">
          {props.infotext}
        </Alert>
      </Snackbar>

    </React.Fragment>
  );
}
