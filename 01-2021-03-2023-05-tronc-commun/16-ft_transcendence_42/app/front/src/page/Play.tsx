import React, { useState, useEffect /*, useCallback */ } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { keyframes } from '@mui/system';
import { useNavigate } from 'react-router-dom';

import { fetch_opt } from '../dep/fetch'
import { User } from '../interface/User'
import { handleOpenAuthPopup } from '../dep/handleOpenAuthPopup'
import CanvasGame from '../component/CanvasGame';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function Play(props: {
    loaded: boolean,
    fetch_userinfo: Function,
    user: User
  }) {

  const [fetching, setFetching] = useState(false);
  const [mouse, setMouse] = useState({x: 0, y: 0});
  const [snackbar, setSnackbar] = useState({
    open: false,
    type: '',
    message: '',
    date: +new Date()
  });
  const showSnackbar = (type: string, message: string) => setSnackbar({ open: true, type, message, date: +new Date() });

  const handleCloseSnackbar = () => snackbar.open = false

  const [user, setUser] = React.useState({...props.user});
  const [avatars, setAvatars] = useState({ count: -1, avatars: [{ name: '', avatar: '' }]});

  const handleJoinMatchMaking = () => {
    setFetching(true);
    fetch('http://' + window.location.hostname + ':8190/game/matchmaking/join', {
      method: 'POST',
      headers: fetch_opt().headers
    })
      .then(res => res.json())
      .then(
        (result) => {
          setTimeout(() => setFetching(false), 4000);
          if (!('matchmaking' in result))
            return showSnackbar('error', 'Impossible de lancer le matchmaking.');
          showSnackbar('info', 'Vous avez lancé le matchmaking !');
          user.matchmaking_state = 'WAITING';
          user.matchmaking_users = { count: result.count, avatars: result.avatars};
          if (result.count)
            setAvatars(user.matchmaking_users);
        },
        (error) => {
          setTimeout(() => setFetching(false), 4000);
          console.log(error)
          showSnackbar('error', 'Impossible de lancer le matchmaking.');
        }
      )
  };

  /* const refreshMatchMaking = useCallback(() => {
    if (user.matchmaking_state === null || avatars.count !== -1)
      return ;
    fetch('http://' + window.location.hostname + ':8190/game/matchmaking/info', {
      method: 'GET',
      headers: fetch_opt().headers
    })
      .then(res => res.json())
      .then(
        (result) => {
          user.matchmaking_users = { count: result.count, avatars: result.avatars};
          if (result.count)
            setAvatars(user.matchmaking_users);
        },
        (error) => {
          console.log(error)
        }
      )
  }, [user, avatars]); */

  const handleQuitMatchMaking = () => {
    setFetching(true);
    fetch('http://' + window.location.hostname + ':8190/game/matchmaking/quit', {
      method: 'POST',
      headers: fetch_opt().headers
    })
      .then(res => res.json())
      .then(
        (result) => {
          setTimeout(() => setFetching(false), 4000);
          props.fetch_userinfo();
          if (!('matchmaking' in result))
            return showSnackbar('error', 'Impossible de quitter le matchmaking.');
          showSnackbar('warning', 'Vous avez quitté le matchmaking !');
          user.matchmaking_state = null;
        },
        (error) => {
          setTimeout(() => setFetching(false), 4000);
          console.log(error)
          showSnackbar('error', 'Impossible de quitter le matchmaking.');
        }
      )
  };

  const navigate = useNavigate();

  const handleGoToGame = () => {
    navigate('/game/');
  };

  const [descMm, setDescMm] = useState('');

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!event || !event.target)
        return ;
      const logo = document.querySelector('div.card-effect') as HTMLDivElement;
      const target = logo || (event.target as HTMLDivElement);
      setMouse({
        x: (event.clientX - target.offsetLeft) / target.offsetWidth,
        y: (event.clientY - target.offsetTop) / target.offsetHeight
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    setUser(props.user);
    setAvatars(props.user.matchmaking_users)

    if (props.user.matchmaking_state === 'WAITING')
      setDescMm("En attente d'autres joueurs.");
    else if (props.user.matchmaking_state === 'MATCHED')
      setDescMm('En attente de votre confirmation.');
    else if (props.user.matchmaking_state === 'CONFIRMED')
      setDescMm('Opposant trouvé! En attente de confirmation de sa part.');
    else
      setDescMm('');
    //refreshMatchMaking();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [ /* refreshMatchMaking, */ props.user, props.user.matchmaking_users]);

  const gradient = `
    radial-gradient(
      farthest-corner circle at var(--mx) var(--my),
      rgba(23, 161, 210,.8) 5%,
      rgba(23, 161, 210,.65) 10%,
      rgba(0,0,0,.5) 42%
    )
  `;

  const xs_button_height_container = 90;

  const floating = keyframes`
    0%   { transform: translateY(0);    }
    50%  { transform: translateY(-4px); }
    100% { transform: translateY(0);    }
  `;

  return (
    <Box component="main" sx={{ height: '100vh', overflow: 'auto', background: '#dcf2f6', color: 'black' }}>
      <Box>
        <Grid container sx={{
          display: 'flex',
          height: { xs: 400 + xs_button_height_container, md: 'inherit' }
        }}>
          <Grid item xs={12} md={8} style={{
            '--mx': mouse.x * 100 + '%',
            '--my': mouse.y * 100 + '%'
            } as any} sx={{
            background: 'url(/res/pong/iceberg_field.png)',
            backgroundPosition: 'top center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'auto 112%',
            height: 400,
            minWidth: 400,
            position: 'relative',
            animation: floating + ' 10s infinite ease-in-out',
            mb: '10px',
            '&:before': {
              content: '" "',
              height: '100%',
              width: '100%',
              display: 'block',
              background: gradient + ' , url(/res/pong/snow.jpg)',
              backgroundSize: '100%, 20%',
              backgroundPosition: 'var(--mx) var(--my)',
              maskImage: 'url(/res/pong/iceberg_text.png)',
              maskPosition: 'top center',
              maskRepeat: 'no-repeat',
              maskSize: 'auto 112%',
              opacity: 0.8,
              position: 'absolute', top: 0, left: 0,
              zIndex: 100
              //mixBlendMode: 'overlay'
            },
            perspective: '744px',
            perspectiveOrigin: '50% 20%',
          }} className="card-effect">
            <Box sx={{
              height: 300,
              width: 400,
              transform: `rotateX(82deg) scale(.72)`,
              position: 'absolute', top: '18.5%', left: 0, right:0, m:'auto',
              zIndex: 70,
              opacity: 0.42,
              mixBlendMode: 'multiply'
            }}>
             {props.loaded && <CanvasGame userId={user.id} gameId="demo" />}
            </Box>
          </Grid>
          <Grid item xs={12} md={4} sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: { xs: xs_button_height_container, md: 'inherit' }
          }}>
            <Box>
              { user.matchmaking_state === null
                ? (user.is_playing === true
                    ? <Button variant="contained" color="warning"
                      onClick={handleGoToGame}
                      sx={{
                        m: 'auto',
                        display: 'block'
                      }}
                    > Revenir en jeu</Button>
                    : <Button variant="contained"
                      onClick={user.connected ? handleJoinMatchMaking : handleOpenAuthPopup}
                      disabled={fetching}
                      sx={{
                        m: 'auto',
                        display: 'block'
                      }}
                    > Rejoindre le MatchMaking</Button>
                  )
                : <React.Fragment>
                    <Button variant="contained" color="error"
                      onClick={handleQuitMatchMaking}
                      disabled={fetching || user.matchmaking_state === 'CONFIRMED'}
                      sx={{
                        m: 'auto',
                        display: 'block'
                      }}
                    ><CircularProgress size={16} color="warning" sx={{ mr: 1, verticalAlign: 'middle', mt: '-2px' }}
                    /> Quitter le MatchMaking</Button>
                    <Box sx={{ fontSize: '9px', }}>{descMm}</Box>
                  </React.Fragment>
              }
            { avatars.count > 0 &&
              <AvatarGroup total={avatars.count} sx={{
                alignItems: 'center',
                justifyContent: 'center',
                mt: 1,
                '& .MuiAvatarGroup-avatar': {
                  height: 32,
                  width: 32,
                  fontSize: 13
                }
              }}>
                {avatars.avatars && avatars.avatars.map((item: any) =>
                  <Avatar key={item.name} alt={item.name} src={item.avatar} />
                )}
              </AvatarGroup>
            }
            </Box>
          </Grid>
        </Grid>
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000 - (+new Date() - snackbar.date)}
          onClose={handleCloseSnackbar}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.type !== '' ? (snackbar.type as any) : 'info'} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
}
export default Play;
