import React, { useState, useEffect, useRef } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import TextField from '@mui/material/TextField';
import { DataGrid, GridColDef, GridValueGetterParams, GridRenderCellParams } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import VideogameAssetIcon from '@mui/icons-material/VideogameAsset';
import CheckIcon from '@mui/icons-material/Check';
import VisibilityIcon from '@mui/icons-material/Visibility';

import { User } from '../interface/User';
import Friend from '../interface/Friend';
import UserButton from '../component/UserButton';
import LoadingButton from '../component/LoadingButton';
import { fetch_opt } from '../dep/fetch';
import GameConfigDialog from '../component/GameConfigDialog';
import GameSettingsInterface from '../interface/GameSettingsInterface';
import { VisibilityOff } from '@mui/icons-material';

// ========================================================================== //
// ========================================================================== //
// ========================================================================== //

// Component to render the "My Friends" page.
// Gets the array of friends of this user
export default function Friends(props: {
    fetch_userinfo: Function,
    user: User,
    loaded: boolean
  }) {
  const gridColums: GridColDef[] = [
    {
      field: "name",
      headerName: "Nom",
      width: 240,
      renderCell: (params: GridRenderCellParams) => <UserButton {...params.row} />,
    },
    {
      field: "games_played",
      headerName: "Nombre de parties",
      width: 150,
    },
    {
      field: "win-ratio",
      headerName: "Rapport Victoires/Défaites",
      width: 200,
      valueGetter: (params: GridValueGetterParams) => {
        const gamesLost = params.row.games_played - params.row.games_won;
        return (params.row.games_won / (gamesLost || 1)).toFixed(2);
      }
    },
    {
      field: "buttons",
      headerName: "",
      width: 180,
      sortable: false,
      renderCell: (params: GridRenderCellParams<Friend, Friend>) =>
        <FriendActionButtons
          user={props.user}
          fetch_userinfo={props.fetch_userinfo}
          {...params.row}
        />,
    },
  ];

  // ========================================================================== //
  // ========================================================================== //
  // ========================================================================== //

  const [search, setSearch] = useState("");
  const [addingFriend, setAddingFriend] = useState(false); // Turns on or off popup
  const [hideOffline, setHideOffline] = useState(false);
  // Filter the rows of the table with the search bar
  const gridRows = props.user.friends.filter((friend) =>
      friend.name.toLowerCase().includes(search.toLowerCase())
  ).filter(friend => hideOffline && friend.status === "offline" ? false : true);

  const navigate = useNavigate();

  useEffect(() => {
    if (props.loaded && !props.user.connected)
      navigate('/');
  }, [props.user, navigate, props.loaded]);

  return (
    <Box component="main" sx={{ p: 1, display: "flex", flexDirection: "column", height: '100vh', overflow: 'auto', background: 'white', }} >
      <AddFriendDialog
        fetch_userinfo={props.fetch_userinfo}
        addingFriend={addingFriend}
        setAddingFriend={setAddingFriend}
      />

      <Box display="flex" alignItems="center"
        sx={{
          maxWidth: 800,
          width: '100%',
          mx: 'auto',
          my: 1
        }}
      >
        <TextField
          id="search-friend"
          label="Rechercher un ami"
          variant="outlined"
          fullWidth
          type="search"
          value={search}
          onChange={ (e : any) => setSearch(e.target.value) }
        />
        <Button
          variant="contained"
          sx={{ml: 1, height: 55, width: '25%'}}
          onClick={(e: any) => setAddingFriend(true)}
        >
          Ajouter un ami
        </Button>
      </Box>

      <Box display="flex" alignItems="center"
        sx={{
          maxWidth: 800,
          width: '100%',
          mx: 'auto',
          mb: 1
        }}
      >
        <Button
          sx={{m: 'auto'}}
          variant="outlined"
          startIcon={hideOffline ? <VisibilityIcon/> : <VisibilityOff/>}
          onClick={() => setHideOffline(!hideOffline)}
        >
          {`${hideOffline ? "Afficher" : "Cacher"} les amis hors-ligne`}
        </Button>
      </Box>

      <Box
        sx={{
          minHeight: 300,
          height: '100%',
          maxWidth: 800,
          width: '100%',
          mx: 'auto',
        }}
      >
        <DataGrid
          rows={gridRows}
          columns={gridColums}
          disableSelectionOnClick
          disableColumnSelector
          disableColumnMenu
          sx={{ '.MuiDataGrid-footerContainer': { display: 'none' } }}
        />
      </Box>
    </Box>
  );
}

function AddFriendDialog(props: {
    fetch_userinfo: Function,
    addingFriend: boolean,
    setAddingFriend: Function
  })
{
  const {addingFriend, setAddingFriend} = props;
  const [friendName, setFriendName] = useState("");
  const [loading, setLoading] = useState(false); // Do I NEED a state for that?
  const [status, setStatus] = useState<'neutral' | 'success' | 'error'>("neutral");
  const textFieldRef = useRef<HTMLInputElement>(null); // Used to refocus on the text field

  function closeDialog() {
    setAddingFriend(false);
    setFriendName("");
    setStatus("neutral");
  }

  function getFieldLabel() {
    if (status === "error")
      return "Impossible d'ajouter l'ami";
    else if (status === "success")
      return "Demande d'ami envoyée !";
    else
      return "Nom de l'ami à ajouter";
  }

  async function requestFriend(e: React.FormEvent) {
    e.preventDefault();
    if (friendName.length === 0)
      return;
    setLoading(true);
    const result = await fetch(`http://${window.location.hostname}:8190/friend/${friendName}/request`, fetch_opt());
    const success: boolean = await result.json();
    setStatus(success ? "success" : "error");
    textFieldRef.current!.focus();
    props.fetch_userinfo(); // Update to get friend request in background
    setLoading(false);
  }

  return (
    <Dialog open={addingFriend} onClose={closeDialog} maxWidth="sm" fullWidth>
      <form onSubmit={requestFriend}>
        <DialogTitle>Ajouter un ami</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            inputRef={textFieldRef}
            error={status === "error"}
            margin="dense"
            id="name"
            label={getFieldLabel()}
            type="search"
            variant="outlined"
            color={status === "success" ? "success" : "primary"}
            fullWidth
            value={friendName}
            onChange={ (e : any) => {
              setFriendName(e.target.value);
              setStatus("neutral");
            } }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Annuler</Button>
          <LoadingButton type="submit" loading={loading}>Ajouter</LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
}

// Component to render the buttons for an entry in the friend list. If it's a friend,
// displays buttons for invite, chat, and unfriend. If it's a friend request, displays
// buttons to accept or deny.
function FriendActionButtons(props: {
    user: User,
    fetch_userinfo: Function,
    id: number,
    friend_status: "requested" | "pending" | "accepted",
    status: "offline" | "online" | "playing",
    gameID?: number,
  })
{
  async function sendGameInvite(settings: GameSettingsInterface) {
    const inviteData = {
      fromID: props.user.id,
      toID: props.id,
      settings,
    }
    const result = await fetch(`http://${window.location.hostname}:8190/invite/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(fetch_opt().headers),
        },
        body: JSON.stringify(inviteData),
    });
    return (result.ok);
  }

  async function callFriendController(action: string) {
    await fetch(`http://${window.location.hostname}:8190/friend/${props.id}/${action}`, fetch_opt());
    props.fetch_userinfo();
  }

  const [isGameConfigOpen, setGameConfigOpen] = useState(false);

  const pendingFriend = (
    <Box component="span">
      <Tooltip title="Accepter l'ami" arrow disableInteractive>
        <IconButton color="success" onClick={() => callFriendController("accept")}>
          <CheckIcon/>
        </IconButton>
      </Tooltip>
      <Tooltip title="Refuser l'ami" arrow disableInteractive>
        <IconButton color="error" onClick={() => callFriendController("refuse")}>
          <CloseIcon/>
        </IconButton>
      </Tooltip>
    </Box>
  );

  const requestedFriend = (
    <Box component="span">
      <span>Invitation envoyée</span>
      <Tooltip title="Annuler la demande d'ami" arrow disableInteractive>
        <IconButton color="error" onClick={() => callFriendController("cancelrequest")}>
          <CloseIcon/>
        </IconButton>
      </Tooltip>
    </Box>
  );

  const knownFriend = (
    <Box component="span">
      <GameConfigDialog open={isGameConfigOpen} setOpen={setGameConfigOpen} sendInvite={sendGameInvite} />
      
      { props.status !== "playing" ?
        <Tooltip title="Inviter à jouer" arrow disableInteractive>
          <span>
            <IconButton color="success" disabled={props.status !== "online"} onClick={() => setGameConfigOpen(true)}>
              <VideogameAssetIcon/>
            </IconButton>
          </span>
        </Tooltip>
      :
        <Tooltip title="Regarder la partie" arrow disableInteractive>
            <IconButton color="info" component={RouterLink} to={`/game/${props.gameID ? props.gameID : ""}`}>
              <VisibilityIcon/>
            </IconButton>
        </Tooltip>
      }

      <Tooltip title="Supprimer l'ami" arrow disableInteractive>
        <IconButton color="error" onClick={() => callFriendController("remove")}>
          <DeleteForeverIcon/>
        </IconButton>
      </Tooltip>
    </Box>
  );

  if (props.friend_status === "requested")
    return requestedFriend;
  return (props.friend_status === "pending" ? pendingFriend : knownFriend);
}
