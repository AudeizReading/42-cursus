import React, { useState, useEffect, useRef, useCallback } from 'react';
import './App.css';

import Home from './page/Home';
import Play from './page/Play';
import Game from './page/Game';
import Score from './page/Score';
import Profile from './page/Profile';
import Auth from './page/Auth';
import Friends from './page/Friends';
import Settings from './page/Settings';
import Footer from './page/Footer'

import TopBar from './component/TopBar';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import Box from '@mui/material/Box';
import { TransitionProps } from '@mui/material/transitions';

import { BrowserRouter, Routes, Route, Link as RouterLink } from "react-router-dom";

import { fetch_opt } from './dep/fetch'
import { User } from './interface/User'
import Ladder from './page/Ladder';
import ChatPage from './page/ChatPage';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const MATCHMAKING_SECONDS = 25;

function App() {
  if (window.location.hostname === 'localhost')
    window.location.href = window.location.href.replace('localhost', '127.0.0.1');

  const isNotAuth = (window.location.pathname !== '/auth' && window.location.pathname !== '/auth/');

  const fetched_firsttime = useRef(false);
  const timeout: any = useRef(0);

  const defaultNotConnected = () => ({
    id: 0,
    name: '',
    connected: false,
    matchmaking_state: null,
    matchmaking_remaining: null,
    matchmaking_users: { count: 0, avatars: [] },
    friends: [],
    avatar: '',
    notifs: { num: 0, arr: [] },
    msgs: { num: 0, arr: [] },
    actions: { num: 0, arr: [] },
    is_playing: false,
    doubleFA: ''
  } as User);

  const [loaded, setLoaded] = useState(false);
  let [alreadyOpen, setAlreadyOpen] = useState(false); // 'let' because it lets doing a hack/force render refresh state
  const [user, setUser] = useState(defaultNotConnected());

  const fetch_userinfo = useCallback(() => {
    //console.trace(); // Permet de vérifier quelles fonctions appellent fetch_userinfo
    fetch('http://' + window.location.hostname + ':8190/user/me', fetch_opt())
      .then(res => res.json())
      .then(
        (result) => {
          setLoaded(true)
          // console.log('fetch', result);
          if (!result.connected) {
            if (result.statusCode
              && result.statusCode === 401
              && result.message === 'Unauthorized'
              && localStorage['bearer']) {
              localStorage.removeItem('bearer');
              console.error('401 because Invalid payload: ok, bearer erased.')
            }
            return setUser(defaultNotConnected())
          }
          setUser({
            id: result.user.id,
            name: result.user.name,
            connected: true,
            matchmaking_state: result.user.matchmaking_state,
            matchmaking_remaining: result.user.matchmaking_remaining,
            matchmaking_users: result.matchmaking_users,
            friends: result.friends,
            avatar: result.user.avatar,
            notifs: result.notifs,
            msgs: result.msgs,
            actions: result.actions,
            is_playing: result.user.is_playing,
            doubleFA: result.doubleFA
          });
        },
        (error) => {
          setLoaded(false)
          // console.info('fetch_userinfo', error)
          setUser(defaultNotConnected())
      })
      .catch((err) => {
        setLoaded(false);
        setUser(defaultNotConnected());
      });
  }, []);

  const handleDialogClose = () => {
    window.dispatchEvent(new Event('click_iamfirst'));
  };

  const handleReadyMatchMaking = async () => {
    user.matchmaking_state = 'CONFIRMED';
    await fetch('http://' + window.location.hostname + ':8190/game/matchmaking/confirm', fetch_opt());
    user.matchmaking_remaining = new Date().toString();
  };

  const [progress, setProgress] = React.useState(0);

  useEffect(() => {
    const refresh = (bool: boolean) => {
      if (bool && !alreadyOpen) {
        fetch_userinfo();
        fetched_firsttime.current = true;
      }
      clearTimeout(timeout.current);
      timeout.current = setTimeout(refresh, loaded && user.matchmaking_state !== null ? 3000 : 8000, true);
      // TODO: Better? Socket.io?
    };
    refresh(!fetched_firsttime.current);

    const timer: any = setInterval(() => {
      if (user.matchmaking_remaining === null)
        return clearInterval(timer);
      setProgress((+new Date() - +new Date(user.matchmaking_remaining)) / MATCHMAKING_SECONDS / 10);
    }, 400);

    // console.info('broadcast channel');
    const bc = new BroadcastChannel('one-pong-only');

    bc.onmessage = (event) => {
      if (!isNotAuth)
        return ;

      if (event.data === 'Am I the first?' && !alreadyOpen) {
        bc.postMessage('No you are not.');
      }
      if (event.data === 'No you are not.' || event.data === 'I am the first!') {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        alreadyOpen = true; // hack: fix bug!
        setAlreadyOpen(true);
      }
    };

    isNotAuth && bc.postMessage(`Am I the first?`);

    /*const handleBeforeUnload = () => {
      console.info('close bc');
      bc.close();
    }
    window.addEventListener('beforeunload', handleBeforeUnload, false);*/

    const handleDialogClose = () => {
      bc.postMessage('I am the first!');
      alreadyOpen = false; // hack: fix bug!
      setAlreadyOpen(false);
    };
    window.addEventListener('click_iamfirst', handleDialogClose, false);

    return () => {
      clearInterval(timer);
      clearTimeout(timeout.current);
      // console.info('close bc');
      bc.close();
      //window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('click_iamfirst', handleDialogClose);
    };
  }, [loaded, alreadyOpen, fetch_userinfo, isNotAuth, user]);

  return (
    <React.Fragment>
      <Backdrop sx={{ color: '#000', zIndex: 2000 }} open={!loaded || alreadyOpen}>
        <CircularProgress color="inherit" />
        <Dialog
          open={alreadyOpen}
          TransitionComponent={Transition}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          sx={{ zIndex: 2100 }}
        >
          <DialogTitle id="alert-dialog-title">
            Veuillez nous excuser pour cette interruption
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Il semblerait que vous aviez Pong sur plus d'un onglet à la fois. Vous pouvez
              décider de fermer l'autre page en cliquant sur "Fermer l'autre session".
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose} color="error">
              Fermer l'autre session
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={user.matchmaking_state === 'MATCHED' && progress <= 105}
          TransitionComponent={Transition}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            Un opposant a été trouvé
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Un opposant d'une grande force vous a été trouvé. Cliquez sur prêt pour lancer
              la partie.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleReadyMatchMaking}>
              <CircularProgress size={16} sx={{ mr: 1, verticalAlign: 'middle', mt: '-1px' }}
                variant="determinate" value={progress}
                /> Pret ({Math.max(MATCHMAKING_SECONDS - Math.round(progress * MATCHMAKING_SECONDS / 100), 0)}sec)
            </Button>
          </DialogActions>
        </Dialog>
      </Backdrop>
      <BrowserRouter>
        {isNotAuth && <TopBar fetch_userinfo={fetch_userinfo} user={user} loaded={loaded} alreadyOpen={alreadyOpen} />}
        <Routes>
          <Route index path="/" element={<Home fetch_userinfo={fetch_userinfo} user={user} loaded={loaded && !alreadyOpen} />} />
          <Route path="/play" element={<Play fetch_userinfo={fetch_userinfo} user={user} loaded={loaded && !alreadyOpen} />} />
          <Route path="/game/:gameid" element={<Game user={user} loaded={loaded && !alreadyOpen} />} />
          <Route path="/game/" element={<Game user={user} loaded={loaded && !alreadyOpen} />} />
          <Route path="/score" element={<Score />} />
          <Route path="/myfriends" element={<Friends fetch_userinfo={fetch_userinfo} user={user} loaded={loaded && !alreadyOpen} />} />
          <Route path="/user/:userid" element={<Profile fetch_userinfo={fetch_userinfo} user={user} loaded={loaded && !alreadyOpen} />} />
          <Route path="/settings" element={<Settings fetch_userinfo={fetch_userinfo} user={user} loaded={loaded && !alreadyOpen} />} />
          <Route path="/ladder" element={<Ladder currentUserID={user.id} />} />
          <Route path="/chat" element={<ChatPage userID={user.id} user={user} loaded={loaded && !alreadyOpen} />} />

          <Route path="/auth" element={<Auth />} />

          <Route path="*" element={<Error />} />
        </Routes>
      </BrowserRouter>
    </React.Fragment>
  );
}

export default App;

function Error() {
  return (
    <Box component="main" sx={{ height: '100vh', background: 'lightblue', overflow: 'auto', color: 'black', textAlign: 'center' }}>
      <Box sx={{ px: '8px', pb: '8px' }}>
        <h1>404: Not Found</h1>
        <p>The server can not find the requested resource.</p>
        <RouterLink to="/">Revenir sur la page d'accueil</RouterLink>
        <img src="/res/404.jpg" alt='not found' style={{ maxWidth: '100%', marginTop: '15px' }} />
        {/* <style>{`body {
          background: url('/res/404.jpg') center center;
          background-size: 'cover';
        }
        header.MuiPaper-root {
          background: rgba(25, 118, 210, 0.8);
        }`}</style> */}
        <p style={{ fontSize: '11px' }}>Webserv ❤️ : Un amour de coeur, on t'aimera toujours, avec ardeur, et sans aucun détour.</p>
      </Box>
      <Footer />
    </Box>
  );
}
