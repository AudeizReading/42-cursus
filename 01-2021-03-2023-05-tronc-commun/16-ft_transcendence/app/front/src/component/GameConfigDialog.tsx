import React, { useState } from 'react';

import { Box, Dialog, Button, DialogTitle, DialogContent, TextField, Grid, Switch, Slider, DialogActions, Snackbar, Alert, Divider } from '@mui/material';
import GameSettingsInterface from '../interface/GameSettingsInterface';
import LoadingButton from './LoadingButton';

interface GameConfigDialogProps {
  sendInvite: (settings: GameSettingsInterface) => Promise<boolean>,
  open: boolean,
  setOpen: (open: boolean) => any,
}

// Component to call whenever a user wants to create a game.
// props.open controls whether the Dialog box is opened. props.setOpen is the associated
// useState function.
// props.sendInvite is a function that will be called when the user confirms the game's parameters
// and sends the invitation. It contains a GameSettingsInterface object to be used to configure
// the game. In other words, it's what will ultimately call the backend.
export default function GameConfigDialog(props: GameConfigDialogProps)
{
  const DEFAULTS = { PTS_TO_WIN: 11, PTS_GAP: 2, BALL_SPEED: 25, RACKET_SIZE: 40 };
  const CLAMPS = { // min/max values for each setting
    pointsToWin: {min: 3, max: 50},
    pointsGap: {min: 1, max: 10},
    ballSpeed: {min: 5, max: 100},
    racketSize: {min: 6, max: 100},
  };

  const clamp = (n: number, x: {min: number, max: number}) => Math.min(Math.max(n, x.min), x.max);
  const handleClose = () => props.setOpen(false);
  const handleSwitch = (e: any) => setEnablePointsGap(e.target.checked);
  const handleBallSlider = (e: any, newVal: number | number[]) => setBallSpeed(newVal as number);
  const handleRacketSizeSlider = (e: any, newVal: number | number[]) => setRacketSize(newVal as number);
  const handleSend = async () => {
    setStatus("loading");
    const success = await props.sendInvite({
      pointsToWin,
      pointsGap: enablePointsGap ? pointsGap : 0,
      ballSpeed,
      racketSize,
    });
    setCooldown(success);
    setTimeout(() => setCooldown(false), 5000);
    setStatus(success ? "success" : "error");
  }

  const [cooldown, setCooldown] = useState(false);
  const [pointsToWin, setPointsToWin] = useState(DEFAULTS.PTS_TO_WIN);
  const [enablePointsGap, setEnablePointsGap] = useState(false);
  const [pointsGap, setPointsGap] = useState<number>(DEFAULTS.PTS_GAP);
  const [ballSpeed, setBallSpeed] = useState(DEFAULTS.BALL_SPEED);
  const [racketSize, setRacketSize] = useState(DEFAULTS.RACKET_SIZE);
  const [status, setStatus] = useState<'neutral' | 'loading' | 'success' | 'error'>("neutral");

  return (
    <Dialog open={props.open} onClose={handleClose} maxWidth="xs" fullWidth>
      
      <Snackbar open={status === "error"} autoHideDuration={3000}
        onClose={() => setStatus("neutral")} anchorOrigin={{vertical: 'top', horizontal: 'center'}}
      >
        <Alert severity="error" variant="filled">
          L'invitation n'a pas pu être envoyée
        </Alert>
      </Snackbar>
      <Snackbar open={status === "success"} autoHideDuration={3000}
        onClose={() => setStatus("neutral")} anchorOrigin={{vertical: 'top', horizontal: 'center'}}
      >
        <Alert severity="success" variant="filled">
          Invitation envoyée !
        </Alert>
      </Snackbar>

      <DialogTitle>Création de partie</DialogTitle>

      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={5}>
            <TextField
              id="score-to-win"
              label="Points pour gagner"
              type="number"
              margin="dense"
              inputProps={{ ...CLAMPS.pointsToWin }}
              value={pointsToWin}
              onChange={(e: any) => setPointsToWin(e.target.value)}
              onBlur={() => setPointsToWin(clamp(pointsToWin, CLAMPS.pointsToWin))}
              error={pointsToWin < CLAMPS.pointsToWin.min || pointsToWin > CLAMPS.pointsToWin.max}
              fullWidth
            />
          </Grid>
          <Grid item xs={7}>
            <Box display="flex" flexDirection="row" alignItems="center" sx={{m: 0, p: 0}} >
              <Switch checked={enablePointsGap} onChange={handleSwitch} />
              <TextField
                id="time-limit"
                label="Points d'écart pour gagner"
                type="number"
                margin="dense"
                inputProps={{ ...CLAMPS.pointsGap }}
                value={pointsGap}
                onChange={(e: any) => setPointsGap(e.target.value)}
                onBlur={() => setPointsGap(clamp(pointsGap, CLAMPS.pointsGap))}
                error={enablePointsGap
                  && (pointsGap < CLAMPS.pointsGap.min || pointsGap > CLAMPS.pointsGap.max)}
                fullWidth
                disabled={!enablePointsGap}
              />
            </Box>
          </Grid>
          <Grid item xs={12}>
            <p style={{textAlign: 'center', margin: 0, padding: 0}}>Vitesse de la balle</p>
            <Box display="flex" flexDirection="row" alignItems="center" sx={{my: 0, mx: 0.5, p: 0, gap: "10px"}} >
              🐢
              <Slider
                value={ballSpeed}
                onChange={handleBallSlider}
                marks={ [{value: DEFAULTS.BALL_SPEED, label: "Par défaut"}] }
                step={5}
                min={CLAMPS.ballSpeed.min}
                max={CLAMPS.ballSpeed.max}
              />
              🐇
            </Box>
          </Grid>
          <Grid item xs={12}>
            <p style={{textAlign: 'center', margin: 0, padding: 0}}>Taille de la raquette</p>
            <Box display="flex" flexDirection="row" alignItems="center" sx={{my: 0, mx: 0.5, p: 0, gap: "10px"}} >
              <Slider
                value={racketSize}
                onChange={handleRacketSizeSlider}
                marks={ [{value: DEFAULTS.RACKET_SIZE, label: "Par défaut"}] }
                step={2}
                min={CLAMPS.racketSize.min}
                max={CLAMPS.racketSize.max}
              />
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Button variant="outlined" fullWidth
              onClick={() => {
                setBallSpeed(DEFAULTS.BALL_SPEED);
                setEnablePointsGap(false);
                setPointsToWin(DEFAULTS.PTS_TO_WIN);
                setRacketSize(DEFAULTS.RACKET_SIZE);
              }}
            >
              Réglages par défaut
            </Button>
          </Grid>
        </Grid>
      </DialogContent>

      <Divider variant="middle" />

      <DialogActions>
        <Button onClick={() => props.setOpen(false)} variant="text">Annuler</Button>
        <LoadingButton
          loading={status === "loading"}
          onClick={handleSend}
          variant="contained"
          disabled={cooldown}
        >
          Inviter
        </LoadingButton>
      </DialogActions>

    </Dialog>
  );
}
