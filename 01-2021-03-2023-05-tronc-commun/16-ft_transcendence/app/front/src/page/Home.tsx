import React from 'react';
import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Fade from '@mui/material/Fade';

import { User } from '../interface/User';

import Footer from './Footer';
import Dashboard from '../component/Dashboard'

import Clock from '../component/Clock';
import DateTime from '../component/DateTime';
import AnalogicClock from '../component/AnalogicClock';

import UnstableGrid from '@mui/system/Unstable_Grid';

import { Link as RouterLink } from 'react-router-dom';
import Link from '@mui/material/Link';

import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';

const BoxPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: 'rgba(0,0,0,0.5)',
  color: 'white',
  textShadow: '0 0 1px #3F528C, 0 0 1px #3F528C, 0 0 1px #3F528C, 0 0 1px #3F528C, 0 0 2px #3F528C, 0 0 1px #3F528C, 0 0 1px #3F528C, 0 0 1px #3F528C, 0 0 1px #3F528C, 0 0 1px #3F528C, 0 0 1px #3F528C, 0 0 1px #3F528C, 0 0 1px #3F528C, 0 0 1px #3F528C, 0 0 1px #3F528C, 0 0 1px #3F528C, 0 0 1px #3F528C, 0 0 1px #3F528C, 0 0 1px #3F528C',
  ...theme.typography.body2,
  overflow: 'hidden',
  borderRadius: '10%',
  border: '1px solid #027368',
  boxShadow: '1px -4px 12px #3F528C',
  '& > p': {
    margin: 0,
    padding: 0,
    fontWeight: 700,
    marginTop: '75%',
    display: 'block',
    textAlign: 'center',
  }
}));

const BoxPaperSx = {
  minWidth: { xs: '25vw', sm: '20.5vw', md: '17vw'},
  minHeight: { xs: '25vw', sm: '20.5vw', md: '17vw'},
  maxWidth: { xs: '25vw', sm: '20.5vw', md: '17vw'},
  maxHeight: { xs: '25vw', sm: '20.5vw', md: '17vw'},
  fontSize: { xs: '3.7vi', sm: '3vi', md: '2.4vi'},
};

const RandomMessagesBox = styled(Paper)(({ theme }) => ({
  backgroundColor: 'rgba(0,0,0,0.4)',
  color: 'white',
  ...theme.typography.body2,
  width: '100%',
  borderRadius: 20,
  p: 'auto',
  border: '1px solid #027368',
  boxShadow: '1px -4px 12px #3F528C',
  '& > div': {
    margin: '5%',
    padding: '5%',
    fontSize: '2.5vi',
    fontWeight: 700,
    display: 'flex',
  },
  '& > h1': {
    marginLeft: '2.5%',
    paddingLeft: '5%',
    fontSize: '3vi',
    fontWeight: 700,
    display: 'block',
  },
  '& > blockquote': {
    margin: '5%',
    paddingLeft: '10%',
    fontSize: '1.67vi',
    fontWeight: 700,
    display: 'block',
  }
})) as typeof Paper;

function Home(props: {
    loaded: boolean,
    fetch_userinfo: Function,
    user: User
  }) {
  const [user, setUser] = useState(props.user);
  const [isLogged, setIsLogged] = useState(user.connected);
  
  useEffect(() => setUser(props.user), [user, props.user]);
  useEffect(() => setIsLogged(user.connected), [user.connected]);
  
  const customMessages = {
    notLogged: [
      "Pourquoi ne pas lancer une petite partie ?", 
      "L'essayer, c'est l'adopter !", 
      "Il y a déjà quelqu'un qui veut jouer avec vous !",
  ]};

  function randomizeMessages() {
    return (customMessages.notLogged[new Date().getMinutes() % (customMessages.notLogged.length - 1)]);
  }

  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(() => new Date());
    })
    return () => clearInterval(interval);
  }, [time])

  const gridNotLogged = (
      <UnstableGrid container rowSpacing={{xs: 1, md: 2}} columnSpacing={{xs: 3, md: 6}} sx={{margin: 0, height: {xs: 'calc(100vh - 120px)', lg: 'calc(100vh - 90}px)'},}}>
        <UnstableGrid xs={6} md={8} xsOffset={3} mdOffset={4} sx={{textAlign: 'center',}}>
          <DateTime component="h2" time={new Date("01/01/2023")} />
        </UnstableGrid>
        <UnstableGrid sx={{position: 'relative', width: '100%', mx: '2%', p: '1%'}}>
          <UnstableGrid xs={8} sm={5} xsOffset={2} smOffset={7} 
            sx={{
              position: 'relative', 
              display: 'flex', 
              flexFlow: 'column', 
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <AnalogicClock stress={true} time={time}/>
              <UnstableGrid xs={12} smOffset={0} 
                sx={{
                  position: 'absolute', 
                  top: '6vh', 
                  width: '100%', 
                  textAlign: 'center', 
                  zIndex: 10, 
                  color: '#024959' 
                }}>
                <Clock component="h6" time={time}/>
              </UnstableGrid>
          </UnstableGrid>

          
           
            <UnstableGrid rowSpacing={{xs: 4, sm: 8}} xs={6} md={5} xsOffset={3} smOffset='auto' lgOffset={1}
            sx={{
              position: {sm: 'absolute'}, 
              top: {sm: 0}, 
              textAlign: {xs: 'center', sm: 'left'},
              minHeight: '50vh',
            }}> 
              <RandomMessagesBox>
            <UnstableGrid component='h1'>Bonjour, cher visiteur !</UnstableGrid>
            <UnstableGrid component='blockquote' sx={{fontStyle: 'italic'}}>{randomizeMessages()}</UnstableGrid>
            <UnstableGrid component='div' sx={{textAlign: {sm: 'right', md: 'left'}, fontWeight: 'bold', fontSize: '1.5em', textTransform: 'uppercase',}}>Veuillez vous connecter</UnstableGrid>
              </RandomMessagesBox>
          </UnstableGrid>
          
        </UnstableGrid>
      </UnstableGrid>
  );

  const datasBoxPaper = [
    {
      sx: {
        background: 'url(/res/pong/iceberg_full.png), url(https://www.desktopbackground.org/download/1152x864/2014/04/15/747399_ocean-water-night-backgrounds_1255x1024_h.jpg)',
        backgroundPosition: 'center 80%',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100%, cover',
        ...BoxPaperSx
      },
      child: {sx: {},},
      name:'JOUER',
      url: '/play',
      uid: 'play',
    },
    {
      sx: 
      {
        background: 'url(https://www.desktopbackground.org/p/2015/09/06/1007039_aurora-borealis-iphone-wallpapers-wallpaper_1920x1200_h.jpg)',
        backgroundPosition: 'center 80%',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        ...BoxPaperSx
      },
      child: {
        sx: {},
      },
      name:'HISTORIQUE',
      url: '/score',
      uid: 'score',
    },
    {
      sx: {
        background: 'url(https://www.desktopbackground.org/p/2014/03/04/726085_penguin-wallpapers-1280x800-wallpapers-penguin-1280x800-wallpapers_1280x800_h.jpg)',
        backgroundPosition: 'center 80%',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        ...BoxPaperSx
      },
      child: {sx:{},},
      name: 'AMIS',
      url: '/myfriends',
      uid: 'friend',
    },
    {
      sx: {
        background: 'url(https://www.desktopbackground.org/download/o/2011/08/14/250058_aurora-borealis-from-space-wallpaper_1920x1080_h.jpg)',
        backgroundPosition: 'center 80%',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        ...BoxPaperSx
      },
      child: {sx:{},},
      name: 'OPTIONS',
      url: '/settings/',
      uid: 'options',
    },
  ];

  const LinkBox = (
      datasBoxPaper.map((data) =>
        {
          return (
            <div key={data.uid}>
              <Link to={data.url} component={RouterLink} color="inherit" underline="none">
              <BoxPaper  sx={data.sx}>
                <Box component="p" sx={data.child.sx}>
                    {data.name}
                </Box>
              </BoxPaper>
              </Link>
            </div>
          )
        }
  ));

  return (
    <Box component="main" /* className="pong-home-image-background" */ sx={{ height: '100vh', overflow: 'auto' }}>
      {isLogged === false ?
        <Fade in={true} timeout={400}>{gridNotLogged}</Fade>
        :
        <React.Fragment>

        <Box sx={{
          display: 'flex', 
          height: '100%', 
          p: 'auto',
          m: 'auto',
          flexDirection: {
            xs: 'row', 
            md: 'column',
          },
          justifyContent: {xs: 'center', md: 'flex-start'},
          alignItems: {xs: 'flex-start', md: 'center'},
        }}>

          <Box sx={{ 
            display: 'flex',  
            flexFlow: {
              xs: 'column wrap', 
              md: 'row wrap',
            },
            flex: '0 1 auto',
            width: 'auto',
            height: 'auto',
            my: '10vw',
            mx: '10vw',
            gap: {
              xs: '5vh', 
              lg: '2vw'
            } 
          }}>            
            {
              LinkBox
            }
          </Box>
          {  
            <Dashboard user={user} visible={false}/>
          }
          </Box>
        </React.Fragment>}
      {isLogged === false && window.outerHeight > 350 && <Footer />}
    </Box>
  );
}
export default Home;
