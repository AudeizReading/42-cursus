import React from 'react';

import { Box, Button, IconButton, List, ListItem, ListItemButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { NotifContainerType, NotifDataType } from '../interface/User';
import { Link as RouterLink } from 'react-router-dom';
import { fetch_opt } from '../dep/fetch';

interface NotifListProps {
  handleCloseNotifMenu: () => void,
  notifs: NotifContainerType,
  fetch_userinfo: Function,
}

export default function NotifList(props: NotifListProps)
{
  if (!props.notifs.num) {
    return <p>Vous n'avez aucune notification !</p>;
  }

  async function deleteNotif(id: number) {
    await fetch(`http://${window.location.hostname}:8190/notif/delete/${id}`, fetch_opt());
    props.fetch_userinfo();
  }

  const getDeleteNotifButton = (id: number) => (
    <IconButton edge="end" onClick={async () => deleteNotif(id)} >
      <DeleteIcon />
    </IconButton>
  );
  
  const notifListJSX = props.notifs.arr.map( (notif, index) =>
    <ListItem
      key={index}
      sx={{ p: 0, m: 0, wordBreak: 'break-word', wordWrap: 'break-word' }}
      divider={index < props.notifs.arr.length - 1}
      secondaryAction={getDeleteNotifButton(notif.id)}
    >
      {
        notif.type === "GAMEINVITE" ? 
          <GameInviteNotifListButton notif={notif} handleCloseNotifMenu={props.handleCloseNotifMenu} deleteNotif={deleteNotif} />
          : <NotifListItemButton notif={notif} handleCloseNotifMenu={props.handleCloseNotifMenu} />
      }
    </ListItem>
  );

  return (
    <List sx={{ height:'100%', p: 0, overflow: 'auto' }} >
      {notifListJSX}
    </List>
  )
}

function NotifListItemButton(props: {
    notif: NotifDataType,
    handleCloseNotifMenu: () => void,
})
{ 
  return (
    <ListItemButton
      sx={{ display: 'block', pt: 1, pb:0 }}
      onClick={props.handleCloseNotifMenu}
      // Make this a RouterLink only if there's a URL in the notif
      { ...(props.notif.url ? {component: RouterLink, to: props.notif.url} : {}) }
    >
      <Box sx={{
          color: props.notif.read ? 'grey' : 'text.primary',
          whiteSpace: 'normal',
          mx: '2px'
        }}>
        {props.notif.text}
      </Box>        
      <Box sx={{ color: 'text.secondary', fontSize: 11, textAlign: 'right' }} >
        {new Date(props.notif.date).toLocaleString()}
      </Box>
    </ListItemButton>
  );
}

async function callInviteController(notifMetaData: any, action: "accept" | "refuse")
{
  const res = await fetch(`http://${window.location.hostname}:8190/invite/${action}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(fetch_opt().headers),
    },
    body: JSON.stringify(notifMetaData.invite),
  });
  if (!res.ok) {
    // TODO: error handling
  }
}

// This probably deserves a bit of explaining.
// The simplest way to get some custom notification layout for an invite is to serialize
// the actual invitation info in the notif text. So, the notif has a type, and if that type
// if a 'GAMEINVITE', we know the text is JSON. We can then parse it, and use the information
// inside to manipulate our invite.
function GameInviteNotifListButton(props: {
  notif: NotifDataType,
  handleCloseNotifMenu: () => void,
  deleteNotif: (id: number) => Promise<void>
})
{
  const notifMetaData = JSON.parse(props.notif.text);

  function acceptInvite() {
    callInviteController(notifMetaData, "accept");
    props.deleteNotif(props.notif.id);
    props.handleCloseNotifMenu();
  }
  
  function refuseInvite() {
    callInviteController(notifMetaData, "refuse");
    props.deleteNotif(props.notif.id);
    // props.handleCloseNotifMenu();
  }

  return (
    <ListItemButton
      sx={{ display: 'block', pt: 1, pb: 0, cursor: 'default' }}
      disableRipple
      disableTouchRipple
    >
      <Box sx={{color: props.notif.read ? 'grey' : 'text.primary', whiteSpace: 'normal'}} >
        {notifMetaData.text}
      </Box>
      <Button color="success" variant="contained" sx={{mx: 1}} onClick={acceptInvite} >
        Accepter
      </Button>
      <Button color="error" variant="contained" sx={{mx: 1}} onClick={refuseInvite} >
        Refuser
      </Button>
      <Box sx={{ color: 'text.secondary', fontSize: 11, textAlign: 'right' }} >
        {new Date(props.notif.date).toLocaleString()}
      </Box>
    </ListItemButton>
  );
}
