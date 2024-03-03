import React, { useState, useEffect, useCallback } from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Fab from '@mui/material/Fab';
import EditIcon from '@mui/icons-material/Edit';
import { useParams, useNavigate } from 'react-router-dom';

import { fetch_opt } from '../dep/fetch'
import { User } from '../interface/User'
import EditableName from '../component/EditableName';
import ProfileActionButtons from '../component/ProfileActionButtons';
import MatchHistory from '../component/MatchHistory';
import StatusSnackbar from '../component/StatusSnackbar';
import { Button } from '@mui/material';
import { EmojiEvents } from '@mui/icons-material';
import AchievementListDialog from '../component/AchievementListDialog';

export interface ProfileUserInterface {
  id: number,
  name: string,
  avatar: string,
  wins: number,
  losses: number,
  status: "offline" | "online" | "playing",
  gameID?: number,
  achievements: string[], // Still serialized for now
}

function Profile(props: {
    fetch_userinfo: Function,
    user: User,
    loaded: boolean
  }) {
  const { userid } = useParams();

  const emptyUser = {
    id: 0,
    name: '',
    avatar: '',
    wins: 0,
    losses: 0,
    status: "offline",
    achievements: [],
  } as ProfileUserInterface;

  const [user, setUser] = useState<ProfileUserInterface>(emptyUser);
  const [uploadStatus, setUploadStatus] = useState<'success' | 'error' | 'neutral'>("neutral");
  const [openAchievements, setOpenAchievements] = useState(false);

  const navigate = useNavigate();

  const fetch_user = useCallback((userid: number) => {
    fetch(`http://${window.location.hostname}:8190/user/${userid.toString()}`, fetch_opt())
      .then(res => res.json())
      .then(
        (result) => {
          if (result.error)
            return navigate('/not-found');
          setUser({...result});
        },
        (error) => {
          navigate('/not-found');
        }
      )
  }, [navigate]);

  // Updates whenever profile changes, or every X seconds with the rest of the logged user's info
  useEffect(() => {
    fetch_user(Number(userid));

    if (props.loaded && !props.user.connected)
      navigate('/');
  }, [fetch_user, userid, navigate, props.user, props.loaded]);

  const handleCapture = ({ target }: any) => {
    var data = new FormData()
    data.append('file', target.files[0])

    fetch('http://' + window.location.hostname + ':8190/user/avatar-upload', {
      method: 'POST',
      headers: fetch_opt().headers,
      body: data
    })
      .then(res => res.json())
      .then(
        (result) => {
          if (result.error) {
            setUploadStatus("error");
            return;
          }
          fetch_user(Number(userid));
          props.fetch_userinfo();
          if (result.upload)
            setUploadStatus("success");
        },
        (error) => {
          console.log(error);
          setUploadStatus("error");
        }
      )
  };

  const isOwnProfile: boolean = user.id !== null && user.id === props.user.id;

  const getStatusColor = (status: string) => {
    if (status === "online")
      return "#44b700";
    else if (status === "playing")
      return "#1976d2";
    else
      return "#7f7f7f";
  }

  const winLoseRatio = (user.wins / (user.losses || 1));
  const ladderPoints = winLoseRatio * (user.wins + user.losses);

  return (
    <Box component="main" sx={{ height: '100vh', overflow: 'auto', background: "white", textAlign: 'center', p: 1, display: "flex", flexDirection: "column" }}>
      <StatusSnackbar status={uploadStatus} errorText="Impossible d'accepter l'image" successText="Avatar uploadé !"
        snackbarProps={{
          autoHideDuration: 3000,
          anchorOrigin: {vertical: 'top', horizontal: 'center'},
          onClose: () => setUploadStatus("neutral"),
        }}
      />

      <AchievementListDialog open={openAchievements} setOpen={setOpenAchievements} profileUser={user} />

      <Box sx={{
        width: 250,
        minWidth: 250,
        height: 250,
        minHeight: 250,
        pb: 2,
        mx: 'auto',
        display: 'flex',
        justifyContent: 'center',
        position: 'relative',
        '&:hover > .editIcon': {
          visibility: 'visible',
          opacity: 1
        },
        '& > .editIcon': {
          visibility: 'hidden',
          opacity: 0,
          transition: 'all 0.1s linear'
        } }}
      >
        <Avatar
          alt={user.name}
          src={user.avatar}
          sx={{ width: '100%', height: '100%', border: `5px solid ${getStatusColor(user.status)}` }}
        />
        {
          isOwnProfile &&
            <Fab
              className="editIcon"
              color="primary"
              component="label"
              sx={{ position: 'absolute', top: '190px', right: '10px' }}
            >
              <input hidden accept="image/*" type="file" onChange={handleCapture} />
              <EditIcon />
            </Fab>
        }
      </Box>

      <Box display="flex" alignItems="center" sx={{ mx: 'auto' }}>
        <EditableName
          editable={isOwnProfile}
          name={user.name}
          fetch_userinfo={props.fetch_userinfo}
        />
      </Box>

      <Box display="flex" alignItems="center" sx={{mx: 'auto', my: isOwnProfile ? 0 : 1}}>
        <ProfileActionButtons
          disabled={isOwnProfile}
          fetch_userinfo={props.fetch_userinfo}
          currentUserID={props.user.id}
          currentUserFriends={props.user.friends}
          profileUser={user}
        />
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          '& > :not(style)': {
            p: '15px',
            m: '5px',
            width: 64,
            height: 64,
          }
        }}
      >
        <Paper variant="outlined">
          <p style={{ fontSize: 12, color: 'light-grey', fontWeight: 500, margin: 3 }}>Victoires</p>
          <p style={{ fontSize: 20, lineHeight: '20px', fontWeight: 'bold', marginBottom: 0 }}>{user.wins}</p>
        </Paper>
        <Paper variant="outlined">
          <p style={{ fontSize: 12, color: 'light-grey', fontWeight: 500, margin: 3 }}>Défaites</p>
          <p style={{ fontSize: 20, lineHeight: '20px', fontWeight: 'bold', marginBottom: 0 }}>{user.losses}</p>
        </Paper>
        <Paper variant="outlined" sx={{p: 0, m: 0}}>
          <p style={{ fontSize: 12, color: 'light-grey', fontWeight: 500, margin: 0, top: 0, padding: 0 }}>Parties jouées</p>
          <p style={{ fontSize: 20, lineHeight: '20px', fontWeight: 'bold', marginBottom: 0, marginTop: '15%' }}>{user.wins + user.losses}</p>
        </Paper>
        <Paper variant="outlined">
          <p style={{ fontSize: 12, color: 'light-grey', fontWeight: 500, margin: 3 }}>Ratio V/D</p>
          <p style={{ fontSize: 20, lineHeight: '20px', fontWeight: 'bold', marginBottom: 0 }}>{winLoseRatio.toFixed(2)}</p>
        </Paper>
        <Paper variant="outlined">
          <p style={{ fontSize: 12, color: 'light-grey', fontWeight: 500, margin: 3 }}>Points</p>
          <p style={{ fontSize: 20, lineHeight: '20px', fontWeight: 'bold', marginBottom: 0 }}>{ ladderPoints >= 1e6 ? ladderPoints.toExponential() : ladderPoints.toFixed() }</p>
        </Paper>
        <Paper elevation={0} sx={{m: 0, p: 0}}>
          <Button variant="contained" color="warning" sx={{width: '100%', height: '100%'}} onClick={() => setOpenAchievements(true)}>
            <EmojiEvents />
          </Button>
        </Paper>
      </Box>

      <Box display="flex" alignItems="center"
        sx={{
          mx: 'auto',
          mt: 1,
          minHeight: 200,
          height: '100%',
          maxWidth: 800,
          width: '100%',
        }}
      >
        <MatchHistory userID={user.id} deps={[user.wins, user.losses]} />
      </Box>
    </Box>
  );
}
export default Profile;
