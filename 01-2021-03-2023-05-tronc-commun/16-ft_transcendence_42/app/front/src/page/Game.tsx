import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { useParams, useNavigate } from 'react-router-dom';

import { User } from '../interface/User'
import CanvasGame from '../component/CanvasGame';

function Game(props: {
    loaded: boolean,
    user: User
  }) {
  const [ message, setMessage ] = useState('Chargement…')
  const [ gameid, setGameId ] = useState(useParams().gameid)

  const navigate = useNavigate();

  useEffect(() => {
    if (props.user.id !== 0 && !props.user.connected)
      navigate('/');
    if (!gameid) {
      if (props.user.is_playing) {
        setGameId('mygame');
      } else {
        setMessage("Vous n'avez pas de partie en cours."); // TODO: Improve css
      }
    }
  }, [props, gameid, message, navigate]);

  return (
    <Box component="main" sx={{ py: 1, height: '100vh', overflow: 'auto', background: 'white', color: 'black' }}>
      {props.user.connected && props.loaded && (gameid
        ? <CanvasGame userId={props.user.id} gameId={gameid} playable border="3px solid black" />
        : <Box component="p" sx={{ maxWidth: 400, mx: 'auto' }}>{message || 'loading…'}</Box>
      )}
      <Box component="div" sx={{ maxWidth: 400, mx: 'auto' }}>
        <link rel="stylesheet" href="https://unpkg.com/keyboard-css@1.2.4/dist/css/main.min.css" />
        <p>Bonne chance !</p>
        <p><kbd className="kbc-button">Z</kbd>, <kbd className="kbc-button">W</kbd>, <kbd className="kbc-button">↑</kbd> : Aller vers le haut</p>
        <p><kbd className="kbc-button">S</kbd>, <kbd className="kbc-button">↓</kbd> : Aller vers le bas</p>
        <p><kbd className="kbc-button">F8</kbd>x3 : Pour abandonner.</p>
      </Box>
    </Box>
  );
}
export default Game;
