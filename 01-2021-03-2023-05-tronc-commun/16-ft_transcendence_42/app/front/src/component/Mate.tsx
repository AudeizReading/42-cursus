import React from 'react'
import Box from '@mui/material/Box';

function Mate(props: any)
{
	const {login} = props;
	const sx_main = {
		display: 'flex',
		flexFlow: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		mx: '1%',
		px: '1%'
	};
	
	return (
		<Box component="div" sx={sx_main}>
			<Box component="div">
				{login}
			</Box>
		</Box>
	);
}

export default Mate;