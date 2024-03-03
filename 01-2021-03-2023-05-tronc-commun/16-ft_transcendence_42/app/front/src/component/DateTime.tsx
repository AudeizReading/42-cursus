import Box from '@mui/material/Box';
import {ElementType} from 'react'

import formattingNumber from '../dep/formattingNumber';

function formattingFrenchDate(day: number) {
  switch (day) {
  case 1:
    return "er";
  case 2:
    return "nd";
  default:
    return null;
  }
}

function DateTime(props: {
  component: ElementType<any>,
  time: Date
})
{
  const days = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
  const months = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

  return (
    <Box component={props.component}> 
      <Box component="span">{days[props.time.getDay()]}</Box>
      <Box component="span"> {formattingNumber(props.time.getDate())}</Box>
      <Box component="sup">{formattingFrenchDate(props.time.getDate())}</Box>
      <Box component="span"> {months[props.time.getMonth()]}</Box>
      <Box component="span"> {props.time.getFullYear()}</Box>   
    </Box>);
}

export default DateTime;
