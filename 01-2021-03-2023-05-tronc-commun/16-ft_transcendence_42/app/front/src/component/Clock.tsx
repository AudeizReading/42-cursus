import Box from '@mui/material/Box';
import {ElementType} from 'react'

import formattingNumber from '../dep/formattingNumber';

function Clock(props: {
  component: ElementType<any>,
  time: Date
})
{
  return (
    <Box component={props.component}>
      <Box component="span">
        {formattingNumber(props.time.getHours())}:{formattingNumber(props.time.getMinutes())}:{formattingNumber(props.time.getSeconds())}
      </Box>
    </Box>
    );
}

export default Clock;
