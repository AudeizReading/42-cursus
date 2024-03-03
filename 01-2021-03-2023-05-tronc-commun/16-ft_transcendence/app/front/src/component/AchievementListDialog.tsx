import React from 'react';
import { Dialog, DialogTitle, DialogContent, ListItem, ListItemIcon, ListItemText, List, Avatar, Divider } from '@mui/material';
import { ProfileUserInterface } from '../page/Profile';
import { EmojiEvents } from '@mui/icons-material';

interface AchievementListDialogProps {
  open: boolean,
  setOpen: Function,
  profileUser: ProfileUserInterface,
}

export default function AchievementListDialog(props: AchievementListDialogProps)
{
  const onClose = () => props.setOpen(false);

  const achievements = props.profileUser.achievements.map( (ach, i) =>
      <AchievementListItem key={i} primary={JSON.parse(ach).primary} secondary={JSON.parse(ach).secondary} />);

  return (
    <Dialog open={props.open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Liste des succès
      </DialogTitle>
      <Divider />

      <DialogContent sx={{p: 1}}>
        <List sx={{width: '100%'}} >
          {
            achievements.length ? achievements
              : <p style={{textAlign: 'center'}}>Oh oh... Il n'y a rien ici !</p>
          }
        </List>
      </DialogContent>

    </Dialog>
  );
}

function AchievementListItem(props: {primary: string, secondary?: string})
{
  return (
    <ListItem>

      <ListItemIcon>
        <Avatar sx={{backgroundColor: 'gold'}}>
          <EmojiEvents />
        </Avatar>
      </ListItemIcon>

      <ListItemText {...props} />

    </ListItem>
  );
}
