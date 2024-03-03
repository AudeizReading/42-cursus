import React from 'react';
import Box from '@mui/material/Box';
import Mate from '../component/Mate';

function MatesList(props: any)
{
	const {mates} = props;
	return (
		<Box component="div" sx={{display: 'flex', justifyContent: 'space-around', alignItems: 'center', width: '35%', p: {sm:'0.05em', md: '0.15em'}, m: {sm:'0.15em', md: '0.25em'}, fontSize: {sm: '0.5em', md: '0.75em', lg: '1em', xl: '1.15em'}}}>
			<Box component='span'>Fait par</Box>
			{
				mates.map(
					(mate: any) => (<Mate key={mate.login} login={mate.login}/>)
				)
			}
		</Box>
		);
}

export default MatesList;
