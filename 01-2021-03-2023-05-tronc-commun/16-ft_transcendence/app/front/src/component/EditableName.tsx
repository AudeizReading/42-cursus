import React, { useState, useEffect } from 'react';

import { TextField, useTheme } from '@mui/material';
import { fetch_opt } from '../dep/fetch';
import StatusSnackbar from './StatusSnackbar';

interface EditableNameProps {
  editable: boolean,
  name: string,
  fetch_userinfo: Function,
}

export default function EditableName(props: EditableNameProps)
{
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(props.name);
  const [newName, setNewName] = useState(props.name);
  const [error, setError] = useState(false);
  const theme = useTheme();
  
  const viewNameStyle = {
    fieldset: {
      border: "none",
    },
    "&:hover fieldset": props.editable ? { // Only apply this style if is editable
      border: "1px solid",
      borderColor: theme.palette.primary.main + "!important",
    } : {},
  };
  
  const textFieldFont = {
    textAlign: "center",
    fontSize: "2em",
    fontWeight: "bold",
    lineHeight: 1,
  };

  async function quitEditing() {
    setNewName(newName.trim());
    if (newName.length === 0 || newName === name) {
      setNewName(name);
      setEditing(false);
      return;
    }
    const res = await fetch(`http://${window.location.hostname}:8190/user/change-name`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(fetch_opt().headers),
      },
      body: JSON.stringify({newName: newName})
    });
    if (!res.ok) { // Only triggers on failed HTTP requests
      setError(true);
      setNewName(name);
      setEditing(false);
      return;
    }
    // Backend double-checks name, returns original one if new one is illegal
    const updtName = await res.text();
    setNewName(updtName);
    setName(updtName);
    props.fetch_userinfo();
    setEditing(false);
  }

  const nameView = (
    <TextField
      spellCheck={false}
      multiline
      size="small"
      value={name}
      sx={{ ...viewNameStyle, textArea: {...textFieldFont} }}
      InputProps={{ readOnly: true }}
      onClick={() => setEditing(props.editable)}
    />
  );
  
  const editingView = (
    <TextField
      spellCheck={false}
      multiline
      size="small"
      value={newName}
      sx={{textArea: {...textFieldFont} }}
      onBlur={quitEditing}
      onChange={(e: any) => setNewName(e.target.value)}
      inputProps={{maxLength: 32}}
      onKeyDown={(e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
          e.preventDefault();
          quitEditing();
        }
      }}
    />
  );

  useEffect(() => {
    setName(props.name);
    setNewName(props.name);
  }, [props.name]);

  return (
    <React.Fragment>
      <StatusSnackbar errorText="Impossible de changer le nom d'utilisateur"
        status={error ? "error" : ""}
        snackbarProps={{
          anchorOrigin: {vertical: 'top', horizontal: 'center'},
          autoHideDuration: 3000,
          onClose: () => setError(false),
        }}
      />
      {editing ? editingView : nameView}
    </React.Fragment>
  );
}
