import React, { useRef, useEffect, useState, useCallback } from 'react'
import socketIOClient, { Socket } from 'socket.io-client';
import { Point } from '../dep/minirt_functions'
import { DataElement, DataGame } from '../dep/minirt_functions'

import { fetch_opt } from '../dep/fetch'

export type DataGameForCanvas = DataGame & {
  cheat: boolean,
  giveup: number
};

interface pingpongData {
  first: number,
  second: number,
  third: number,
  fourth: number,
  fifth: number
}

export function getPlayerPosition(player: DataElement): number {
  if (player.at !== null && player.dir !== 0) {
    const time = (+new Date() - +player.at) / 1000;
    const speed = player.speed * (player.dir as number);
    const delta = speed * time;
    return Math.min(300 - player.size, Math.max(0, (player.pos as number) + delta));
  } else {
    return player.pos as number;
  }
}

export function getBallPosition(ball: DataElement): Point {
  const date = +new Date();
  if (ball.at !== null && ball.at <= date) {
    const time = (date - +ball.at) / 1000;
    const speed: number = ball.speed;
    const pos = ball.pos as Point;
    const dir = ball.dir as Point;
    //const pos: Point = ball.pos as Point;

    let x = pos.x + speed * time * dir.x;
    let y = pos.y + speed * time * dir.y;

    if (!(0 <= y && y <= 300)) {
      y = Math.abs(y);
      const pair = Math.floor(y / 300) % 2;
      y = y % 300;
      if (pair)
        y = 300 - y;
    }

    return { x: x, y: y } as Point;
  } else {
    return ball.pos as Point;
  }
}

function LogicGame(props: {
   playable: boolean,
   gameId: string | number,
   userId: number,
   data: DataGameForCanvas,
  }) {
  const loaded = useRef(false);
  const keydowns = useRef({
    '87': false,
    '90': false,
    '83': false,
    '38': false,
    '40': false
  });

  const [playerId, setPlayerId] = useState(-1);
  const [data, setData] = useState(props.data);
  if (!loaded.current) {
    setData(data);
    loaded.current = true;
  }

  const diffTime = useRef(0);
  const socketLatence = useRef(0);

  const sync2server = useCallback((rawPlayer: DataElement) => {
    const player = {...rawPlayer};
    if (player.at)
       player.at += (diffTime.current + socketLatence.current);
    return player;
  }, [diffTime, socketLatence]);

  const sync2client = useCallback((rawPlayer: DataElement) => {
    const player = {...rawPlayer};
    if (player.at)
      player.at -= (diffTime.current + socketLatence.current);
    return player;
  }, [diffTime, socketLatence]);

  const move_callback = useCallback((server_lacente: number, client_latence: number) => {
    socketLatence.current += server_lacente;
    //console.log(server_lacente, client_latence, socketLatence.current);
  }, [socketLatence]);

  const giveupTimeout = useRef(0 as any)

  const gameSocket = useRef(null as any);
  useEffect(() => {
    let socket: Socket;
    if (!gameSocket.current && props.gameId !== 'demo') {
      if ((window as any).gameSocket)
        (window as any).gameSocket.disconnect();
      console.log('connexion!');
      socket = socketIOClient('ws://' + window.location.hostname + ':8192/game?page=game&gameid=' + String(props.gameId), {
        extraHeaders: fetch_opt().headers
      });
      gameSocket.current = socket;
      (window as any).gameSocket = socket;

      socket.on('dataGame', (newData: DataGame) => {
        data.users = newData.users;
        data.points = newData.points;
        data.players = newData.players.map(sync2client);
        data.ball = sync2client(newData.ball);
        data.ended = newData.ended;
        setData(data);
        const id = +(props.userId === data.users[1].id);
        if (data.users[id].id === props.userId)
          setPlayerId(id);
      })

      const pingpong = () => {
        socket.emit('ping', {
          first: +new Date(), // client
          second: 0,
          third: 0, // client
          fourth: 0,
          fifth: 0 // client
        }, (data: pingpongData) => {
          data.third = +new Date();
          socket.emit('pong', data, (data: pingpongData) => {
            data.fifth = +new Date();
            const latence = (data.fifth - data.first) / 2;
            const [a, b, c, d] = [data.second - data.first, data.third - data.second,
              data.fourth - data.third, data.fifth - data.fourth];
            const diffs = [a - latence, -(b - latence), c - latence, -(d - latence)];
            const diff_datetime = Math.round(diffs.reduce(function(a, b) { return a + b; }, 0) / diffs.length);
            console.info('latence', latence, 'diff_datetime', diff_datetime); // positif = navigateur en retard, négatif = server en retard
            const save_diffTime = diffTime.current
            diffTime.current = diff_datetime;
            socketLatence.current = latence / 2
            /*console.log(a, b, c, d, diff_datetime);
            console.log(a - diff_datetime, b + diff_datetime, c - diff_datetime, d + diff_datetime, a + b + c + d, data.fifth - data.first);
            console.log(data.third - data.first, data.fifth - data.third);
            console.log(data.fourth - data.second);
            console.log(diffs);*/
            setTimeout(pingpong, 30000);
            if (Math.abs(save_diffTime - diffTime.current) > 20)
              pingpong();
            else
              socket.emit('data');
          });
        });
      }
      let notFound = false;
      socket.on('not-found', () => {
        notFound = true;
      })
      socket.on('disconnect', (reason: string, desc) => {
        console.log('disconnected!', reason, desc);
        data.ball.at = null;
        gameSocket.current = null;
        (window as any).gameSocket = null;
        setTimeout(() => {
          if (!gameSocket.current && !(window as any).gameSocket && !notFound) {
            socket.connect();
            gameSocket.current = socket;
            (window as any).gameSocket = socket;
          }
        }, 1000);
      });
      setTimeout(pingpong, 200);
      /*socket.on('message', (data) => {
        console.log(data);
      });*/
    } else {
      socket = gameSocket.current;
    }

    const handleKeyEvent = (event: KeyboardEvent) => {
      if (props.data.ended)
        return ;
      if (!event.repeat && event.keyCode === 114) {
        props.data.cheat = (event.type === 'keydown');
        event.stopPropagation();
        event.preventDefault();
      } else if (!event.repeat && event.keyCode === 119 && event.type === 'keyup') {
        data.giveup++;
        console.info('giveup !?', data.giveup);
        clearTimeout(giveupTimeout.current);
        giveupTimeout.current = setTimeout(() => data.giveup = 0, 300);
        if (data.giveup === 3) {
          socket.emit('giveup');
        }
      }
      if (event.keyCode === 114 || event.keyCode === 119) {
        event.stopPropagation();
        event.preventDefault();
      }
      if (!(event.keyCode === 87 || event.keyCode === 90 || event.keyCode === 83 // W - S
            || event.keyCode === 38 || event.keyCode === 40)) // arrow: ^ - v
        return ;
      if (playerId < 0)
        return ;
      if (!event.repeat && event.type === 'keydown') {
        const target = event.target as HTMLElement;
        if (target !== null && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA'
              || target.contentEditable === 'TEXTAREA')) // On bloque à l'activation, on laisse désactiver la touche
          return ;
        keydowns.current[event.keyCode] = true;
        const player = props.data.players[playerId];
        player.pos = Math.round(getPlayerPosition(player));
        player.dir = (event.keyCode === 87 || event.keyCode === 90 || event.keyCode === 38) ? -1 : +1; // if TOP -1 else +1
        player.at = +new Date();
        socket.emit('move', sync2server(player), (data: number) => move_callback(data, +new Date() - (player.at as number)));
      } else if (!event.repeat && event.type === 'keyup') {
        keydowns.current[event.keyCode] = false;
        const player = props.data.players[playerId];
        let nextdir = 0;
        // TODO: Ajout d'une queue sur les touches enfoncées ? Parce que le dessus à toujours l'avantage sur la touche du bas
        if (keydowns.current['87'] || keydowns.current['90'] || keydowns.current['38'])
          nextdir = -1;
        else if (keydowns.current['83'] || keydowns.current['40'])
          nextdir = 1;
        if (player.dir !== nextdir) {
          player.pos = Math.round(getPlayerPosition(player));
          player.dir = nextdir;
          player.at = +new Date();
          socket.emit('move', sync2server(player), (data: number) => move_callback(data, +new Date() - (player.at as number)));
        }
      };
      event.stopPropagation();
      event.preventDefault();
    };

    const handleFocus = (event: FocusEvent) => {
      if (playerId < 0)
        return ;
      keydowns.current['87'] = false;
      keydowns.current['90'] = false;
      keydowns.current['83'] = false;
      keydowns.current['38'] = false;
      keydowns.current['40'] = false;
      const player = props.data.players[playerId];
      player.pos = Math.round(getPlayerPosition(player));
      player.dir = 0;
      player.at = +new Date();
      socket.emit('move', sync2server(player), (data: number) => move_callback(data, +new Date() - (player.at as number)));
    };

    if (props.playable) {
      window.addEventListener('keydown', handleKeyEvent);
      window.addEventListener('keyup', handleKeyEvent);
      window.addEventListener('blur', handleFocus);
    }

    return () => {
      if (socket) {
        //socket.close();
        //gameSocket.current = null;
      }

      if (props.playable) {
        window.removeEventListener('keydown', handleKeyEvent);
        window.removeEventListener('keyup', handleKeyEvent);
        window.removeEventListener('blur', handleFocus);
      }
    }
  }, [props.data, props.playable, props.gameId, props.userId,
    data, playerId, diffTime, sync2client, sync2server, move_callback]);

  return (
    <React.Fragment>
    </React.Fragment>
  );
}

export default LogicGame;
