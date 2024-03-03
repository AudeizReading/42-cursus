import React from 'react';
import Box from '@mui/material/Box';
import MatesList from '../component/MatesList';


const mates = [
	{
		login: 'gphilipp'
	},
	{
		login: 'alellouc'
	},
	{
		login: 'achansel'
	},
	{
		login: 'pbremond'
	},
];


function Footer(props: any)
{
	const sx_footer = {
		position: 'relative',
		color: 'white',
		width: '100%',
		maxHeight: '10%',
		textAlign: "center",
		m: 'auto',
		p: 'auto',
		display: {xs: 'none', sm: 'none', md: 'flex', lg: 'flex', xl: 'flex'},
		justifyContent: 'center',
		alignItems: 'flex-end',
	};

	return (
		<Box component="footer" sx={sx_footer}>
			<MatesList mates={mates} />
		</Box>
	);
}

export default Footer;