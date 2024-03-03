import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import { Link as RouterLink } from 'react-router-dom';

interface UserChipProps {
  id: number,
  name: string,
  avatar: string,  
}

function UserChip(props: UserChipProps)
{
  const {id, name, avatar} = props;
  const avatarComponent = <Avatar alt={name} src={avatar}>{name[0]}</Avatar>;

  return (
    <Chip
      avatar={avatarComponent}
      label={props.name}
      variant="outlined"
      component={RouterLink}
      to={`user/${id}`}
      clickable
    />
  );
}

export default UserChip;
