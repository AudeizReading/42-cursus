import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import ChatComponent from '../component/Chat';

import { User } from '../interface/User'

interface ChatPageProps {
  userID: number,
  user: User,
  loaded: boolean
}

export default function ChatPage(props: ChatPageProps)
{
  const [connected, setConnected] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setConnected(props.userID !== 0);

    if (props.loaded && !props.user.connected)
      navigate('/');
  }, [props.userID, navigate, props.user, props.loaded]);

  return (
    <Box component="main" sx={{p: 1, height: '100vh', overflow: 'auto', background: 'white', color: 'black', padding: 0 }}>
      { connected ?
        <ChatComponent user_id={props.userID} />
        : null
      }
    </Box>
  );
}
