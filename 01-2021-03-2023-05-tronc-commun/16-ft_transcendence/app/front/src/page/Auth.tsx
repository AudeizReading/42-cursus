import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

function Auth() {
  const [html, setHtml] = useState('');
  const [error, setError] = useState(false);

  const [bearer, setBearer] = useState(false);
  const [surrogate, setSurrogate] = useState(false);
  const [ok, setOk] = useState(false);

  const refDoubleFA = React.createRef();

  useEffect(() => { // will be run twice ^^'
    let b, s;
    setBearer(b = window.location.hash.indexOf('#bearer=') !== -1);
    setSurrogate(s = window.location.hash.indexOf('#surrogate=') !== -1);
    if (b) {
      localStorage.setItem('bearer', window.location.hash.replace('#bearer=', ''));
    } else if (s) {
      localStorage.setItem('surrogate', window.location.hash.replace('#surrogate=', ''));
    }


    if (bearer || ok) {
      try {
        window.opener.window.wOpen = window;
        window.opener.window.dispatchEvent(new Event('auth_success'));
      } catch (e) {
        console.warn('je suis triste mais auth!');
        setHtml(' *');
      }
    }
  },[bearer, surrogate, ok]);

  const validate2FA = () => {
    fetch(`http://${window.location.hostname}:8190/auth/login2fa`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage['surrogate'] ? 'Bearer ' + localStorage['surrogate'] : '',
      },
      body: JSON.stringify({ code: (refDoubleFA.current as HTMLInputElement).value }),
    }).then(res => res.json())
      .then(
        (result) => {
          setError(!result.success);
          if (result.bearer) {
            setBearer(true);
            setSurrogate(false);
            setOk(true);
            localStorage.setItem('bearer', result.bearer);
          }
        },
        (error) => {
          setError(true);
        }
      );
  }

  return (
    <Box component="main" sx={{ height: '100%', background: 'white', color: 'black', textAlign: 'center' }}>
      {(bearer || ok) &&
        <Box component="p">Connexion OK. Vous pouvez fermer cette page :) {html}</Box>
      }
      {(surrogate && !ok) &&
        <Box>
          <Stack spacing={2} direction="row" justifyContent="center" sx={{  mb: '36px', mt: '20%' }}>
            <TextField id="outlined-basic" inputRef={refDoubleFA} variant="outlined"
              label={error ? 'Error' : 'Code 2FA'} {...(error ? {error: true, helperText: 'Wrong 2FA code.'} : {})}
              sx={{ '.MuiFormHelperText-root': { position: 'absolute', bottom: '-24px' } }}/>
            <Button variant="contained" onClick={validate2FA}>Valider</Button>
          </Stack>
        </Box>
      }
    </Box>
  );
}
export default Auth;