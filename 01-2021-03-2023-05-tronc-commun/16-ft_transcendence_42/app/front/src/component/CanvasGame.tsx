import React, { useRef, useState, useEffect } from 'react'
import { v_dot, v_sub, v_scale, pl_intersect, pl_time_to_vector, Point, Plane, check_segment_collision } from '../dep/minirt_functions'
import LogicGame, { getPlayerPosition, getBallPosition, DataGameForCanvas } from './LogicGame';
import { useNavigate } from 'react-router-dom';

function draw(context: CanvasRenderingContext2D, tick: number, data: DataGameForCanvas, gameId: string | number, navigate: any) {
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);
  /*context.fillStyle = 'black';
  context.beginPath();
  context.arc(50, 100, 20*Math.sin(+new Date()*0.003)**2, 0, 3*Math.PI);
  context.fill();*/

  // Centre de terrain
  context.strokeStyle = 'black';
  context.lineWidth = 3;
  context.setLineDash([6, 4]);
  context.beginPath();
  context.moveTo(200, -3);
  context.lineTo(200, 300);
  context.stroke();

  context.fillStyle = 'brown';
  context.font = 'small-caps bold 48px/1 sans-serif';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  if (data.ended) {
    context.fillText('Terminé', 200, 150);
    if (data.points[0] !== data.points[1]) {
      context.font = 'small-caps bold 24px/1 sans-serif';
      context.fillText(data.users[+(data.points[0] < data.points[1])].name + ' a gagné !', 200, 180);
    }
    if (data.ball.at && data.ball.at < +new Date())
      navigate('/play')
  } else if (data.users.length === 0) {
    context.fillText('Not found', 200, 150);
  } else if (data.ball.at === null) {
    context.fillText('En attente', 200, 150);
  } else if (data.ball.at > +new Date()) {
    context.fillText(String(Math.ceil((data.ball.at - +new Date()) / 1000)), 200, 150);
  }

  context.font = 'small-caps bold 12px/1 sans-serif';
  context.textAlign = 'right';
  context.textBaseline = 'bottom';
  context.fillText(String(gameId), 400, 300);

  context.fillStyle = 'black';
  context.strokeStyle = 'black';

  // Score
  context.font = '70px "Qahiri"';
  context.textAlign = 'center';
  context.textBaseline = 'top';
  context.fillText(String(data.points[0]),       80, 40);
  context.fillText(String(data.points[1]), 400 - 80, 40);

  // Joueurs
  const pl: Plane = {
    n: { x: 1, y: 0 },
    pos: { x: 20, y: 0 },
    size: 20
  };

  const pr: Plane = {
    n: { x: -1, y: 0 },
    pos: { x: 400 - 20, y: 0 },
    size: 20
  };

  if (data.players) {
    if (data.players.length >= 1) {
      pl.pos.y = Math.round(getPlayerPosition(data.players[0]) as number);
      pl.size = data.players[0].size;
    }
    if (data.players.length >= 2) {
      pr.pos.y = Math.round(getPlayerPosition(data.players[1]) as number);
      pr.size = data.players[1].size;
    }
  }

  context.lineWidth = 5;
  context.setLineDash([]);

  const players: Plane[] = [pl, pr];
  for (let i = 0; i < players.length; i++) {
    context.beginPath();
    context.moveTo(players[i].pos.x - 2 * players[i].n.x, players[i].pos.y);
    context.lineTo(players[i].pos.x - 2 * players[i].n.x, players[i].pos.y + (players[i].size || 0));
    context.stroke();
    context.strokeStyle = 'black';
  }

  // Balle
  const ballPos: Point = getBallPosition(data.ball);
  context.fillRect(ballPos.x - data.ball.size / 2, ballPos.y - data.ball.size / 2, data.ball.size, data.ball.size);

  if (!data.cheat)
    return ;

  const dir: Point = data.ball.dir as Point;
  // const vec: Point = v_norm({
  //   x: pl.pos.x - 200,
  //   y: pl.pos.y - 150 + (+new Date()/300%((pl.size||1) + 20)) - 10
  // })

  // const dir: Point = {
  //   x: vec.x,
  //   y: vec.y
  // };

  // const dir: Point = {
  //   x: Math.cos(Math.PI/180 * -60),
  //   y: Math.sin(Math.PI/180 * -60)
  // };

  // const dir: Point = {
  //   x: Math.cos(Math.PI/4 * (+new Date()/10)*0.004),
  //   y: Math.sin(Math.PI/4 * (+new Date()/10)*0.004)
  // };

  const bt: Plane = {
    n: { x: 0, y: 1 },
    pos: { x: 0, y: 0 }
  };

  const bb: Plane = {
    n: { x: 0, y: -1 },
    pos: { x: 0, y: 300 }
  };

  const bl: Plane = {
    n: { x: 1, y: 0 },
    pos: { x: 0, y: 0 }
  };

  const br: Plane = {
    n: { x: -1, y: 0 },
    pos: { x: 400, y: 0 }
  };

  const start: Point = data.ball.pos as Point;

  //ballPos
  context.fillStyle = 'red';
  context.fillRect(start.x - 3, start.y - 3, 6, 6);
  context.strokeStyle = 'lightblue';
  context.lineWidth = 2;

  let planes: Plane[] = [pl, pr, bt, bb];
  let i = -1, a: Point, b: Point, ray: Point, time: number, point: Point | null = null, max: number = 0;
  a = {...start};
  ray = {...dir};
  do {
    b = { x: a.x + 20 * ray.x, y: a.y + 20 * ray.y }
    time = -1;
    for (i = 0; i < planes.length; i++) {
      if ((time = pl_intersect(a, b, planes[i])) > -1) {
        point = pl_time_to_vector(a, b, time);
        if (planes[i].size && !check_segment_collision(planes[i], point))
          continue ;
        break ;
      }
    }

    if (time > -1 && point) {
      context.fillStyle = 'rgba(255,165,0,0.1)';
      context.strokeStyle = 'rgba(255,165,0,0.1)';
      context.beginPath();
      context.lineTo(a.x, a.y);
      context.lineTo(point.x, point.y);
      context.stroke();
      context.fillRect(point.x - 3, point.y - 3, 6, 6);
      let normal: Point = planes[i].n
      if (planes[i].size && check_segment_collision(planes[i], point)) {
        const size: number = (planes[i].size || 0);
        let dist = (point.y - planes[i].pos.y + 3) / (size + 6) * 160; // 3 et 6 == rayon/diametre de la balle
        if (Math.sign(planes[i].n.x) < 0)
          dist = (160 - dist) - 180
        ray = {
          x: Math.cos(Math.PI / 180 * (dist - 80)),
          y: Math.sin(Math.PI / 180 * (dist - 80))
        }
      }
      else
        ray = v_sub(ray, v_scale(normal, 2.0 * v_dot(normal, ray)));
      a = {...point};
    } else {
      // dir vec(0;+1), quand le rayon va tout droit
      break ;
    }
  } while(time > -1 && point && 0 <= point.x && point.x <= 400 && ++max < 100)

  planes = [pl, pr, bl, br];
  a = {...start};
  ray = {...dir};
  b = { x: a.x + 20 * ray.x, y: a.y + 20 * ray.y }
  time = -1;
  // Draw first collision on player
  for (i = 0; i < planes.length; i++) {
    if ((time = pl_intersect(a, b, planes[i])) > -1) {
      point = pl_time_to_vector(a, b, time);
      if (point && !(0 <= point.y && point.y <= 300)) {
        point.y = Math.abs(point.y);
        const pair = Math.floor(point.y / 300) % 2;
        point.y = point.y % 300;
        if (pair) 
          point.y = 300 - point.y;

      }
      if (planes[i].size && !check_segment_collision(planes[i], point))
        continue ;
      break ;
    }
  }
  if (time > -1) {
    context.fillStyle = 'lightblue';
    point && context.fillRect(point.x - 3, point.y - 3, 6, 6);
  }
}

function CanvasGame(props: {
   playable?: boolean,
   border?: string,
   gameId: string | number,
   userId: number,
  }) {
  const canvasEl: { current: HTMLElement | null } = useRef(null);
  const [data] = useState({
    users: [],
    points: [0, 0],
    players: [
      { dir: 0, pos: 164, speed: 250, size: 40, at: null },
      { dir: 0, pos: 210, speed: 250, size: 40, at: null },
    ],
    ball: { dir: { x: 0, y: 0 }, pos: { x: 320, y: 240 }, speed: 250, size: 6, at: null },
    ended: false,
    cheat: false,
    giveup: 0
  } as DataGameForCanvas);

  const navigate = useNavigate();

  useEffect(() => {
    if (!canvasEl.current)
      canvasEl.current = document.getElementById('canvas-game');

    const canv: any = canvasEl.current;
    const context = canv.getContext('2d');
    let tick = 0;
    let animationFrameId: number;

    const render = () => {
      tick++;
      draw(context, tick, data, props.gameId, navigate);
      animationFrameId = window.requestAnimationFrame(render);
    }
    render();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    }
  }, [data, props.gameId, navigate]);

  return (
    <React.Fragment>
      <canvas id="canvas-game" width="400" height="300" style={{
        border: props.border,
        margin: '20px auto',
        maxWidth: 'calc(100% - 40px)',
        display: 'block'
      }}></canvas>
      <LogicGame data={data} userId={props.userId} gameId={props.gameId} playable={props.playable?true:false} />
    </React.Fragment>
  );
}

export default CanvasGame;

/*
const canvas = (draw: Function) => {
  
  useEffect(() => {

  }, [draw])
  
  return <canvas ref={canvasRef} />
}

export default useCanvas;*/
